import type { CompanionActionEvent, CompanionOptionValues, SomeCompanionActionInputField } from '@companion-module/base'
import type { ActionDefinitions } from './actionid.js'
import {
	MoveToAbsolutePanTilt,
	PanTiltAction,
	PanTiltDirection,
	PanTiltHome,
	PanTiltPositionInquiry,
	sendPanTiltCommand,
} from '../camera/pan-tilt.js'
import type { PtzOpticsInstance } from '../instance.js'
import { speedChoices } from './speeds.js'
import { repr } from '../utils/repr.js'

/**
 * The id of the obsolete action to set module-global pan/tilt speed using
 * options storing the preset and speed as two-digit hex number strings.
 *
 * This action has been replaced by the action below that defines those options
 * to both accept simple numbers instead.  The upgrade from obsolete to new
 * action is performed in `tryUpdatePresetAndSpeedEncodingsInActions` because of
 * the shared preset-number and speed choice encodings used across actions that
 * span two action subsets.
 */
export const ObsoletePtSpeedSId = 'ptSpeedS'

export enum PanTiltActionId {
	PanLeft = 'left',
	PanRight = 'right',
	TiltUp = 'up',
	TiltDown = 'down',
	MoveUpLeft = 'upLeft',
	MoveUpRight = 'upRight',
	MoveDownLeft = 'downLeft',
	MoveDownRight = 'downRight',
	StopMoving = 'stop',
	ResetToHome = 'home',
	SetMovementSpeed = 'ptSpeedSet',
	SpeedUpMovement = 'ptSpeedU',
	SlowDownMovement = 'ptSpeedD',
	AbsolutePosition = 'moveAbsolutePosition',
	PanPositionLeft = 'panPosL',
	PanPositionRight = 'panPosR',
	TiltPositionUp = 'tiltPosU',
	TiltPositionDown = 'tiltPosD',
}

/**
 * Pan/tilt position bounds.  Full signed 16-bit range is the VISCA default;
 * narrow these when camera-specific limits are known.
 */
export const PanTiltBounds = {
	pan: { min: -0x8000, max: 0x7fff },
	tilt: { min: -0x8000, max: 0x7fff },
}

/** Step size for relative pan/tilt position actions. */
const PAN_TILT_POSITION_STEP = 1

/** Default speed for relative pan/tilt position movements. */
const PAN_TILT_POSITION_SPEED = 12

/**
 * Idle time (ms) after which a rotary axis resyncs its optimistic target to the
 * polled position, so rotary moves don't fight movements made by other controls.
 * Must be longer than the poll refresh so the polled value is fresh after a pause.
 */
const ROTARY_RESYNC_MS = 400

/**
 * Coalescing window (ms): ticks within this window of the last send only update
 * the accumulated target, then a single command moves to the total (so 4 quick
 * clicks become one move to current+4 rather than 4 separate 1-step moves).  The
 * first click of a move still sends immediately (leading edge); only rapid
 * follow-ups combine.  Wider = more coalescing on fast spins (fewer, larger
 * moves); narrower = more individual steps.
 *
 * The Stream Deck encoder tops out at ~50ms/tick (20 ticks/sec), so 150ms folds
 * ~3 ticks per send on a fast spin while deliberate single clicks (>=~600ms
 * apart, measured) always send individually.
 */
const ROTARY_THROTTLE_MS = 150

const clamp = (value: number, lo: number, hi: number): number => Math.min(Math.max(value, lo), hi)

type PanOrTilt = 'pan' | 'tilt'

const posAsNumber = (type: PanOrTilt) => `${type}PosAsNumber`

const speedMinMax = (type: PanOrTilt): [number, number] => (type === 'pan' ? [0x01, 0x18] : [0x01, 0x14])

const speed = (type: PanOrTilt) => `${type}Speed`

function getPosition(options: CompanionOptionValues, type: PanOrTilt): number | string {
	// The position field is a number the user can switch to Expression mode;
	// Companion resolves value/expression before the callback.
	const pos = Number(options[posAsNumber(type)])
	const { min, max } = PanTiltBounds[type]
	return min <= pos && pos <= max
		? pos
		: `${type[0].toUpperCase()}${type.slice(1)} position ${repr(options[posAsNumber(type)])} not in range ${min} through ${max}`
}

function getSpeed(options: CompanionOptionValues, type: PanOrTilt): number | string {
	const opt = options[speed(type)]
	const spd = Number(opt)
	const [min, max] = speedMinMax(type)
	if (min <= spd && spd <= max) {
		return spd
	}

	return `Invalid ${type} speed: ${repr(opt)}`
}

/**
 * The id of the option on the set-global-pan/tilt-speed action that specifies
 * the speed.
 */
export const PanTiltSpeedSetSpeedId = 'speed'

export function panTiltActions(instance: PtzOpticsInstance): ActionDefinitions<PanTiltActionId> {
	function createPanTiltCallback(direction: readonly [number, number]) {
		return async (_event: CompanionActionEvent) => {
			const { panSpeed, tiltSpeed } = instance.panTiltSpeed()
			sendPanTiltCommand(instance, direction, panSpeed, tiltSpeed)
		}
	}

	function positionTypeOptions(type: PanOrTilt): SomeCompanionActionInputField[] {
		const uppercased = `${type[0].toUpperCase()}${type.slice(1)}`
		const { min, max } = PanTiltBounds[type]
		return [
			{
				type: 'number',
				id: posAsNumber(type),
				label: `${uppercased} position`,
				tooltip: `${uppercased} position (${min} through ${max}). Use Expression mode for a variable or formula.`,
				default: 0,
				min,
				max,
			},
		]
	}

	// Optimistic rotary targets, kept in this closure so they persist across
	// rotary ticks.  Each axis accumulates its own target during a fast spin (so
	// a burst of ticks moves the full distance instead of undershooting from a
	// lagging polled position), and resyncs to the polled position after an idle
	// gap (so it doesn't fight moves made by other controls).
	const rotary = {
		pan: { target: 0, lastTick: 0 },
		tilt: { target: 0, lastTick: 0 },
	}
	let rotaryLastSend = 0
	let rotaryPending: ReturnType<typeof setTimeout> | null = null

	// The throttle's actual move: send the current pan/tilt target to the camera.
	function sendRotaryMove(): void {
		rotaryLastSend = Date.now()
		rotaryPending = null
		instance.sendCommand(MoveToAbsolutePanTilt, {
			panPosition: rotary.pan.target,
			tiltPosition: rotary.tilt.target,
			panSpeed: PAN_TILT_POSITION_SPEED,
			tiltSpeed: PAN_TILT_POSITION_SPEED,
		})
	}

	// At most one command per ROTARY_THROTTLE_MS: send immediately on the leading
	// edge, otherwise arm a trailing send so the final accumulated target lands.
	function scheduleRotaryMove(): void {
		const elapsed = Date.now() - rotaryLastSend
		if (elapsed >= ROTARY_THROTTLE_MS) {
			if (rotaryPending !== null) {
				clearTimeout(rotaryPending)
				rotaryPending = null
			}
			sendRotaryMove()
		} else if (rotaryPending === null) {
			rotaryPending = setTimeout(sendRotaryMove, ROTARY_THROTTLE_MS - elapsed)
		}
	}

	instance.registerCleanup(() => {
		if (rotaryPending !== null) {
			clearTimeout(rotaryPending)
			rotaryPending = null
		}
	})

	function rotaryPanTiltStep(axis: PanOrTilt, delta: number): void {
		const now = Date.now()
		const { pan, tilt } = rotary

		// Resync each axis to the polled position when its encoder has been idle.
		if (now - pan.lastTick > ROTARY_RESYNC_MS) {
			pan.target = Number(instance.getVariableValue('pan_position')) || 0
		}
		if (now - tilt.lastTick > ROTARY_RESYNC_MS) {
			tilt.target = Number(instance.getVariableValue('tilt_position')) || 0
		}

		// Accumulate the step on the rotated axis and mark it active.
		const moved = rotary[axis]
		const bounds = PanTiltBounds[axis]
		moved.target = clamp(moved.target + delta, bounds.min, bounds.max)
		moved.lastTick = now

		scheduleRotaryMove()
	}

	return {
		[PanTiltActionId.AbsolutePosition]: {
			name: 'Move to Absolute Position',
			options: [
				...positionTypeOptions('pan'),
				...positionTypeOptions('tilt'),
				{
					type: 'dropdown',
					label: 'Pan speed',
					id: speed('pan'),
					choices: speedChoices(...speedMinMax('pan')),
					tooltip: 'Pan speed',
					default: 12,
				},
				{
					type: 'dropdown',
					label: 'Tilt speed',
					id: speed('tilt'),
					choices: speedChoices(...speedMinMax('tilt')),
					tooltip: 'Tilt speed',
					default: 12,
				},
			],
			callback: async ({ options }) => {
				const panPosition = getPosition(options, 'pan')
				if (typeof panPosition === 'string') {
					instance.log('error', `Pan/tilt to absolute: ${panPosition}`)
					return
				}

				const tiltPosition = getPosition(options, 'tilt')
				if (typeof tiltPosition === 'string') {
					instance.log('error', `Pan/tilt to absolute: ${tiltPosition}`)
					return
				}

				const panSpeed = getSpeed(options, 'pan')
				if (typeof panSpeed !== 'number') {
					instance.log('error', `Pan/tilt to absolute: ${panSpeed}`)
					return
				}

				const tiltSpeed = getSpeed(options, 'tilt')
				if (typeof tiltSpeed !== 'number') {
					instance.log('error', `Pan/tilt to absolute: ${tiltSpeed}`)
					return
				}

				instance.sendCommand(MoveToAbsolutePanTilt, {
					panPosition,
					tiltPosition,
					panSpeed,
					tiltSpeed,
				})
			},
			learn: async ({ options }) => {
				const answer = await instance.sendInquiry(PanTiltPositionInquiry)
				if (answer === null) {
					return undefined
				}

				return {
					...options,
					[posAsNumber('pan')]: answer.panPosition,
					[posAsNumber('tilt')]: answer.tiltPosition,
				}
			},
		},
		[PanTiltActionId.PanLeft]: {
			name: 'Pan Left',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Left]),
		},
		[PanTiltActionId.PanRight]: {
			name: 'Pan Right',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Right]),
		},
		[PanTiltActionId.TiltUp]: {
			name: 'Tilt Up',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Up]),
		},
		[PanTiltActionId.TiltDown]: {
			name: 'Tilt Down',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Down]),
		},
		[PanTiltActionId.MoveUpLeft]: {
			name: 'Up Left',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.UpLeft]),
		},
		[PanTiltActionId.MoveUpRight]: {
			name: 'Up Right',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.UpRight]),
		},
		[PanTiltActionId.MoveDownLeft]: {
			name: 'Down Left',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.DownLeft]),
		},
		[PanTiltActionId.MoveDownRight]: {
			name: 'Down Right',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.DownRight]),
		},
		[PanTiltActionId.StopMoving]: {
			name: 'P/T Stop',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Stop]),
		},
		[PanTiltActionId.ResetToHome]: {
			name: 'P/T Home',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(PanTiltHome)
			},
		},
		[PanTiltActionId.SetMovementSpeed]: {
			name: 'P/T Speed',
			options: [
				{
					type: 'dropdown',
					label: 'Speed setting',
					id: PanTiltSpeedSetSpeedId,
					choices: speedChoices(1, 24),
					default: 12,
				},
			],
			callback: async ({ options }) => {
				const speed = Number(options[PanTiltSpeedSetSpeedId])
				instance.setPanTiltSpeed(speed)
			},
		},
		[PanTiltActionId.SpeedUpMovement]: {
			name: 'P/T Speed Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.increasePanTiltSpeed()
			},
		},
		[PanTiltActionId.SlowDownMovement]: {
			name: 'P/T Speed Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.decreasePanTiltSpeed()
			},
		},
		[PanTiltActionId.PanPositionLeft]: {
			name: 'Pan Position Left',
			options: [],
			callback: async () => {
				rotaryPanTiltStep('pan', -PAN_TILT_POSITION_STEP)
			},
		},
		[PanTiltActionId.PanPositionRight]: {
			name: 'Pan Position Right',
			options: [],
			callback: async () => {
				rotaryPanTiltStep('pan', PAN_TILT_POSITION_STEP)
			},
		},
		[PanTiltActionId.TiltPositionUp]: {
			name: 'Tilt Position Up',
			options: [],
			callback: async () => {
				rotaryPanTiltStep('tilt', PAN_TILT_POSITION_STEP)
			},
		},
		[PanTiltActionId.TiltPositionDown]: {
			name: 'Tilt Position Down',
			options: [],
			callback: async () => {
				rotaryPanTiltStep('tilt', -PAN_TILT_POSITION_STEP)
			},
		},
	}
}
