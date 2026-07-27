import type { CompanionActionEvent } from '@companion-module/base'
import type { ActionDefinitions } from './actionid.js'
import { ZoomDirect, ZoomIn, ZoomInVariable, ZoomOut, ZoomOutVariable, ZoomStop } from '../camera/zoom.js'
import type { PtzOpticsInstance } from '../instance.js'
import { FeedbackId } from '../feedbacks.js'
import { createRotaryAccumulator } from '../utils/rotary-accumulator.js'

export enum ZoomActionId {
	StartZoomIn = 'zoomI',
	StartZoomOut = 'zoomO',
	StopZoom = 'zoomS',
	StartZoomInVariable = 'zoomIV',
	StartZoomOutVariable = 'zoomOV',
	ZoomPositionIn = 'zoomPosI',
	ZoomPositionOut = 'zoomPosO',
	SetZoomPosition = 'zoomPosS',
	ZoomSpeedUp = 'zoomSpeedU',
	ZoomSpeedDown = 'zoomSpeedD',
	SetZoomSpeed = 'zoomSpeedS',
}

export const ZoomSpeedId = 'speed'
export const ZoomPositionId = 'position'

/**
 * Step size in ZoomDirect units for position increment/decrement.
 * One LensBlockInquiry stepper step ≈ 3.19 ZoomDirect units.
 * Using 4 ensures we always advance at least one stepper step.
 */
const ZOOM_DIRECT_STEP = 4

/**
 * Approximate ratio between ZoomDirect coordinates and LensBlockInquiry
 * stepper positions.  Used for absolute positioning (e.g. jump to Wide/Tele).
 */
const STEPPER_TO_DIRECT_RATIO = 3.1875

export function zoomActions(instance: PtzOpticsInstance): ActionDefinitions<ZoomActionId> {
	// Smooth, velocity-free rotary zoom.  ZoomDirect uses a different coordinate
	// system than the polled `zoom_position` (stepper units), so seed the target
	// from the polled value scaled by STEPPER_TO_DIRECT_RATIO and accumulate in
	// ZoomDirect units — this also drops the former per-tick position inquiry.
	const zoomStep = createRotaryAccumulator({
		min: 0,
		max: 0xffff,
		getCurrent: () => Math.round((Number(instance.getVariableValue('zoom_position')) || 0) * STEPPER_TO_DIRECT_RATIO),
		sendTarget: (position) => instance.sendCommand(ZoomDirect, { position }),
		registerCleanup: (fn) => instance.registerCleanup(fn),
	})

	return {
		[ZoomActionId.StartZoomIn]: {
			name: 'Zoom In',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ZoomIn)
			},
		},
		[ZoomActionId.StartZoomOut]: {
			name: 'Zoom Out',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ZoomOut)
			},
		},
		[ZoomActionId.StopZoom]: {
			name: 'Zoom Stop',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ZoomStop)
			},
		},
		[ZoomActionId.StartZoomInVariable]: {
			name: 'Zoom In (Variable)',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const speed = Number(instance.getVariableValue('zoom_speed')) || 0
				instance.sendCommand(ZoomInVariable, { speed })
			},
		},
		[ZoomActionId.StartZoomOutVariable]: {
			name: 'Zoom Out (Variable)',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const speed = Number(instance.getVariableValue('zoom_speed')) || 0
				instance.sendCommand(ZoomOutVariable, { speed })
			},
		},
		[ZoomActionId.ZoomPositionIn]: {
			name: 'Zoom Position In',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				zoomStep(ZOOM_DIRECT_STEP)
			},
		},
		[ZoomActionId.ZoomPositionOut]: {
			name: 'Zoom Position Out',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				zoomStep(-ZOOM_DIRECT_STEP)
			},
		},
		[ZoomActionId.SetZoomPosition]: {
			name: 'Set Zoom Position',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: ZoomPositionId,
					min: 0,
					max: 5140,
					default: 0,
				},
			],
			callback: async ({ options }) => {
				const position = Math.round(Number(options[ZoomPositionId]) * STEPPER_TO_DIRECT_RATIO)
				instance.sendCommand(ZoomDirect, { position: Math.min(position, 0xffff) })
			},
		},
		[ZoomActionId.ZoomSpeedUp]: {
			name: 'Zoom Speed Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('zoom_speed')) || 0
				const speed = Math.min(current + 1, 7)
				instance.setVariableValues({ zoom_speed: speed })
				instance.checkFeedbacks(FeedbackId.ZoomSpeed)
			},
		},
		[ZoomActionId.ZoomSpeedDown]: {
			name: 'Zoom Speed Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('zoom_speed')) || 0
				const speed = Math.max(current - 1, 0)
				instance.setVariableValues({ zoom_speed: speed })
				instance.checkFeedbacks(FeedbackId.ZoomSpeed)
			},
		},
		[ZoomActionId.SetZoomSpeed]: {
			name: 'Set Zoom Speed',
			options: [
				{
					type: 'number',
					label: 'Speed',
					id: ZoomSpeedId,
					min: 0,
					max: 7,
					default: 4,
				},
			],
			callback: async ({ options }) => {
				const speed = Number(options[ZoomSpeedId])
				instance.setVariableValues({ zoom_speed: speed })
				instance.checkFeedbacks(FeedbackId.ZoomSpeed)
			},
		},
	}
}
