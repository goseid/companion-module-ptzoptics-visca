import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import { PanTiltBounds } from './actions/pan-tilt.js'
import type { PtzOpticsInstance } from './instance.js'

export enum FeedbackId {
	FocusModeAuto = 'focus_mode_auto',
	ExposureModeText = 'exposure_mode_text',
	WhiteBalanceMode = 'wb_mode',
	SharpnessMode = 'sharpness_mode',
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
		[FeedbackId.WhiteBalanceMode]: {
			type: 'boolean',
			name: 'White Balance Mode',
			description: 'Change button style when white balance mode matches',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'automatic', label: 'Auto' },
						{ id: 'indoor', label: 'Indoor' },
						{ id: 'outdoor', label: 'Outdoor' },
						{ id: 'onepush', label: 'One Push' },
						{ id: 'manual', label: 'Manual' },
					],
					default: 'automatic',
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return instance.getVariableValue('wb_mode') === options['mode']
			},
		},
		[FeedbackId.SharpnessMode]: {
			type: 'boolean',
			name: 'Sharpness Mode',
			description: 'Change button style when sharpness mode matches',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'auto', label: 'Auto' },
						{ id: 'manual', label: 'Manual' },
					],
					default: 'auto',
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return instance.getVariableValue('sharpness_mode') === options['mode']
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
				bgcolor: combineRgb(223, 85, 0),
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
