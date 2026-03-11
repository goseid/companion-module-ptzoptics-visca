import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import { PanTiltBounds } from './actions/pan-tilt.js'
import type { PtzOpticsInstance } from './instance.js'

export enum FeedbackId {
	FocusModeAuto = 'focus_mode_auto',
	ExposureModeText = 'exposure_mode_text',
	WhiteBalanceModeAuto = 'wb_mode_auto',
	WhiteBalanceModeIndoor = 'wb_mode_indoor',
	WhiteBalanceModeOutdoor = 'wb_mode_outdoor',
	WhiteBalanceModeOnePush = 'wb_mode_onepush',
	WhiteBalanceModeManual = 'wb_mode_manual',
	PanTiltPosition = 'pan_tilt_position',
}

export const PanTiltPositionPanId = 'panPosition'
export const PanTiltPositionTiltId = 'tiltPosition'

export function getFeedbacks(instance: PtzOpticsInstance): CompanionFeedbackDefinitions {
	return {
		[FeedbackId.FocusModeAuto]: {
			type: 'boolean',
			name: 'Focus Mode: Auto',
			description: 'Change button style when focus mode is Auto',
			options: [],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			callback: () => {
				return instance.getVariableValue('focus_mode') === 'auto'
			},
		},
		[FeedbackId.ExposureModeText]: {
			type: 'advanced',
			name: 'Exposure Mode Text',
			description: 'Show the current exposure mode on the button',
			options: [],
			callback: () => {
				const mode = instance.getVariableValue('exposure_mode')
				switch (mode) {
					case 'full-auto':
						return { text: 'Auto\nExpose' }
					case 'manual':
						return { text: 'Manual\nExpose' }
					case 'shutter-priority':
						return { text: 'Shutter\nPriority' }
					case 'iris-priority':
						return { text: 'Iris\nPriority' }
					case 'bright-mode-manual':
						return { text: 'Bright\nExpose' }
					default:
						return {}
				}
			},
		},
		[FeedbackId.WhiteBalanceModeAuto]: {
			type: 'boolean',
			name: 'White Balance Mode: Auto',
			description: 'Change button style when white balance mode is Auto',
			options: [],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			callback: () => {
				return instance.getVariableValue('wb_mode') === 'automatic'
			},
		},
		[FeedbackId.WhiteBalanceModeIndoor]: {
			type: 'boolean',
			name: 'White Balance Mode: Indoor',
			description: 'Change button style when white balance mode is Indoor',
			options: [],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			callback: () => {
				return instance.getVariableValue('wb_mode') === 'indoor'
			},
		},
		[FeedbackId.WhiteBalanceModeOutdoor]: {
			type: 'boolean',
			name: 'White Balance Mode: Outdoor',
			description: 'Change button style when white balance mode is Outdoor',
			options: [],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			callback: () => {
				return instance.getVariableValue('wb_mode') === 'outdoor'
			},
		},
		[FeedbackId.WhiteBalanceModeOnePush]: {
			type: 'boolean',
			name: 'White Balance Mode: One Push',
			description: 'Change button style when white balance mode is One Push',
			options: [],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			callback: () => {
				return instance.getVariableValue('wb_mode') === 'onepush'
			},
		},
		[FeedbackId.WhiteBalanceModeManual]: {
			type: 'boolean',
			name: 'White Balance Mode: Manual',
			description: 'Change button style when white balance mode is Manual',
			options: [],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			callback: () => {
				return instance.getVariableValue('wb_mode') === 'manual'
			},
		},
		[FeedbackId.PanTiltPosition]: {
			type: 'boolean',
			name: 'Pan/Tilt Position',
			description: 'Change button style when camera is at the specified pan/tilt position',
			options: [
				{
					type: 'number',
					id: PanTiltPositionPanId,
					label: 'Pan position',
					tooltip: `Pan position (${PanTiltBounds.pan.min} through ${PanTiltBounds.pan.max})`,
					default: 0,
					min: PanTiltBounds.pan.min,
					max: PanTiltBounds.pan.max,
				},
				{
					type: 'number',
					id: PanTiltPositionTiltId,
					label: 'Tilt position',
					tooltip: `Tilt position (${PanTiltBounds.tilt.min} through ${PanTiltBounds.tilt.max})`,
					default: 0,
					min: PanTiltBounds.tilt.min,
					max: PanTiltBounds.tilt.max,
				},
			],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
			callback: ({ options }) => {
				return (
					Number(instance.getVariableValue('pan_position')) === Number(options[PanTiltPositionPanId]) &&
					Number(instance.getVariableValue('tilt_position')) === Number(options[PanTiltPositionTiltId])
				)
			},
		},
	}
}
