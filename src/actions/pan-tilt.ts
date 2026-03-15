import type {
	CompanionActionContext,
	CompanionActionEvent,
	CompanionOptionValues,
	SomeCompanionActionInputField,
} from '@companion-module/base'
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

type PanOrTilt = 'pan' | 'tilt'

const posIsText = (type: PanOrTilt) => `${type}PosIsText`
const posAsText = (type: PanOrTilt) => `${type}PosAsText`
const posAsNumber = (type: PanOrTilt) => `${type}PosAsNumber`

const speedMinMax = (type: PanOrTilt): [number, number] => (type === 'pan' ? [0x01, 0x18] : [0x01, 0x14])

const speed = (type: PanOrTilt) => `${type}Speed`

async function getPosition(
	options: CompanionOptionValues,
	type: PanOrTilt,
	context: CompanionActionContext,
): Promise<number | string> {
	const isText = Boolean(options[`${type}PosIsText`])
	const pos = isText
		? Number(await context.parseVariablesInString(String(options[`${type}PosAsText`])))
		: Number(options[`${type}PosAsNumber`])
	const { min, max } = PanTiltBounds[type]
	return min <= pos && pos <= max
		? pos
		: `${type[0].toUpperCase()}${type.slice(1)} position ${pos} not in range ${min} through ${max}`
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
		const positionTooltip = `${uppercased} position (${min} through ${max})`
		return [
			{
				type: 'checkbox',
				id: posIsText(type),
				label: `Specify ${type} position from text`,
				default: false,
			},
			{
				type: 'number',
				id: posAsNumber(type),
				label: `${uppercased} position`,
				tooltip: positionTooltip,
				default: 0,
				min,
				max,
				isVisibleExpression: `!$(options:${posIsText(type)})`,
			},
			{
				type: 'textinput',
				id: posAsText(type),
				label: `${uppercased} position`,
				tooltip: positionTooltip,
				useVariables: { local: true },
				default: '0',
				isVisibleExpression: `!!$(options:${posIsText(type)})`,
			},
		]
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
			callback: async ({ options }, context) => {
				const panPosition = await getPosition(options, 'pan', context)
				if (typeof panPosition === 'string') {
					instance.log('error', `Pan/tilt to absolute: ${panPosition}`)
					return
				}

				const tiltPosition = await getPosition(options, 'tilt', context)
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
			learn: async ({ options }, _context) => {
				const answer = await instance.sendInquiry(PanTiltPositionInquiry)
				if (answer === null) {
					return undefined
				}

				const learnedOpts: CompanionOptionValues = {}

				const panPosIsText = Boolean(options[posIsText('pan')])
				if (panPosIsText) {
					learnedOpts[posAsText('pan')] = String(answer.panPosition)
				} else {
					learnedOpts[posAsNumber('pan')] = answer.panPosition
				}

				const tiltPosIsText = Boolean(options[posIsText('tilt')])
				if (tiltPosIsText) {
					learnedOpts[posAsText('tilt')] = String(answer.tiltPosition)
				} else {
					learnedOpts[posAsNumber('tilt')] = answer.tiltPosition
				}

				return {
					...options,
					...learnedOpts,
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
			callback: async (_event: CompanionActionEvent) => {
				const pan = Number(instance.getVariableValue('pan_position')) || 0
				const tilt = Number(instance.getVariableValue('tilt_position')) || 0
				const panPosition = Math.max(pan - PAN_TILT_POSITION_STEP, PanTiltBounds.pan.min)
				instance.sendCommand(MoveToAbsolutePanTilt, {
					panPosition,
					tiltPosition: tilt,
					panSpeed: PAN_TILT_POSITION_SPEED,
					tiltSpeed: PAN_TILT_POSITION_SPEED,
				})
			},
		},
		[PanTiltActionId.PanPositionRight]: {
			name: 'Pan Position Right',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const pan = Number(instance.getVariableValue('pan_position')) || 0
				const tilt = Number(instance.getVariableValue('tilt_position')) || 0
				const panPosition = Math.min(pan + PAN_TILT_POSITION_STEP, PanTiltBounds.pan.max)
				instance.sendCommand(MoveToAbsolutePanTilt, {
					panPosition,
					tiltPosition: tilt,
					panSpeed: PAN_TILT_POSITION_SPEED,
					tiltSpeed: PAN_TILT_POSITION_SPEED,
				})
			},
		},
		[PanTiltActionId.TiltPositionUp]: {
			name: 'Tilt Position Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const pan = Number(instance.getVariableValue('pan_position')) || 0
				const tilt = Number(instance.getVariableValue('tilt_position')) || 0
				const tiltPosition = Math.min(tilt + PAN_TILT_POSITION_STEP, PanTiltBounds.tilt.max)
				instance.sendCommand(MoveToAbsolutePanTilt, {
					panPosition: pan,
					tiltPosition,
					panSpeed: PAN_TILT_POSITION_SPEED,
					tiltSpeed: PAN_TILT_POSITION_SPEED,
				})
			},
		},
		[PanTiltActionId.TiltPositionDown]: {
			name: 'Tilt Position Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const pan = Number(instance.getVariableValue('pan_position')) || 0
				const tilt = Number(instance.getVariableValue('tilt_position')) || 0
				const tiltPosition = Math.max(tilt - PAN_TILT_POSITION_STEP, PanTiltBounds.tilt.min)
				instance.sendCommand(MoveToAbsolutePanTilt, {
					panPosition: pan,
					tiltPosition,
					panSpeed: PAN_TILT_POSITION_SPEED,
					tiltSpeed: PAN_TILT_POSITION_SPEED,
				})
			},
		},
	}
}
