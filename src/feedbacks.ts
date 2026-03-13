import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import { PanTiltBounds } from './actions/pan-tilt.js'
import type { PtzOpticsInstance } from './instance.js'

export enum FeedbackId {
	FocusMode = 'focus_mode',
	ExposureMode = 'exposure_mode',
	ExposureModeText = 'exposure_mode_text',
	WhiteBalanceMode = 'wb_mode',
	SharpnessMode = 'sharpness_mode',
	IrisPosition = 'iris_position',
	ShutterPosition = 'shutter_position',
	ExpCompOn = 'exp_comp_on',
	ExpCompPosition = 'exp_comp_position',
	BrightPosition = 'bright_position',
	GainPosition = 'gain_position',
	PanTiltPosition = 'pan_tilt_position',
}

export const IrisPositionSettingId = 'irisSetting'
export const ShutterPositionSettingId = 'shutterSetting'
export const ExpCompPositionValueId = 'expCompValue'
export const BrightPositionValueId = 'brightValue'
export const GainPositionValueId = 'gainValue'
export const PanTiltPositionPanId = 'panPosition'
export const PanTiltPositionTiltId = 'tiltPosition'

export function getFeedbacks(instance: PtzOpticsInstance): CompanionFeedbackDefinitions {
	return {
		[FeedbackId.FocusMode]: {
			type: 'boolean',
			name: 'Focus Mode',
			description: 'Change button style when focus mode matches',
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
				bgcolor: combineRgb(255, 0, 0),
			},
			callback: ({ options }) => {
				return instance.getVariableValue('focus_mode') === options['mode']
			},
		},
		[FeedbackId.ExposureMode]: {
			type: 'boolean',
			name: 'Exposure Mode',
			description: 'Change button style when exposure mode matches',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'full-auto', label: 'Full Auto' },
						{ id: 'manual', label: 'Manual' },
						{ id: 'shutter-priority', label: 'Shutter Priority' },
						{ id: 'iris-priority', label: 'Iris Priority' },
						{ id: 'bright-mode-manual', label: 'Bright Mode' },
					],
					default: 'full-auto',
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return instance.getVariableValue('exposure_mode') === options['mode']
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
						return { text: 'EXP Mode\nAuto' }
					case 'manual':
						return { text: 'EXP Mode\nManual' }
					case 'shutter-priority':
						return { text: 'EXP Mode\nShutter' }
					case 'iris-priority':
						return { text: 'EXP Mode\nIris' }
					case 'bright-mode-manual':
						return { text: 'EXP Mode\nBright' }
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
		[FeedbackId.IrisPosition]: {
			type: 'boolean',
			name: 'Iris Position',
			description: 'Change button style when iris position matches',
			options: [
				{
					type: 'dropdown',
					label: 'Position',
					id: IrisPositionSettingId,
					choices: [
						{ id: 'ƒ 1.8', label: 'ƒ 1.8' },
						{ id: 'ƒ 2.0', label: 'ƒ 2.0' },
						{ id: 'ƒ 2.4', label: 'ƒ 2.4' },
						{ id: 'ƒ 2.8', label: 'ƒ 2.8' },
						{ id: 'ƒ 3.4', label: 'ƒ 3.4' },
						{ id: 'ƒ 4.0', label: 'ƒ 4.0' },
						{ id: 'ƒ 4.8', label: 'ƒ 4.8' },
						{ id: 'ƒ 5.6', label: 'ƒ 5.6' },
						{ id: 'ƒ 6.8', label: 'ƒ 6.8' },
						{ id: 'ƒ 8.0', label: 'ƒ 8.0' },
						{ id: 'ƒ 9.6', label: 'ƒ 9.6' },
						{ id: 'ƒ 11.0', label: 'ƒ 11.0' },
						{ id: 'CLOSED', label: 'CLOSED' },
					],
					default: 'ƒ 2.0',
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return instance.getVariableValue('iris_position') === options[IrisPositionSettingId]
			},
		},
		[FeedbackId.ShutterPosition]: {
			type: 'boolean',
			name: 'Shutter Position',
			description: 'Change button style when shutter position matches',
			options: [
				{
					type: 'dropdown',
					label: 'Position',
					id: ShutterPositionSettingId,
					choices: [
						{ id: '1/1000000', label: '1/1000000' },
						{ id: '1/6000', label: '1/6000' },
						{ id: '1/4000', label: '1/4000' },
						{ id: '1/3000', label: '1/3000' },
						{ id: '1/2000', label: '1/2000' },
						{ id: '1/1500', label: '1/1500' },
						{ id: '1/1000', label: '1/1000' },
						{ id: '1/725', label: '1/725' },
						{ id: '1/500', label: '1/500' },
						{ id: '1/350', label: '1/350' },
						{ id: '1/250', label: '1/250' },
						{ id: '1/180', label: '1/180' },
						{ id: '1/125', label: '1/125' },
						{ id: '1/100', label: '1/100' },
						{ id: '1/90', label: '1/90' },
						{ id: '1/60', label: '1/60' },
						{ id: '1/30', label: '1/30' },
					],
					default: '1/60',
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return instance.getVariableValue('shutter_position') === options[ShutterPositionSettingId]
			},
		},
		[FeedbackId.ExpCompOn]: {
			type: 'boolean',
			name: 'Exposure Comp On',
			description: 'Change button style when exposure compensation is on',
			options: [],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: () => {
				return instance.getVariableValue('exposure_comp') === 'on'
			},
		},
		[FeedbackId.ExpCompPosition]: {
			type: 'boolean',
			name: 'Exposure Comp Position',
			description: 'Change button style when exposure comp position matches',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: ExpCompPositionValueId,
					default: 0,
					min: -7,
					max: 7,
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return Number(instance.getVariableValue('exp_comp_position')) === Number(options[ExpCompPositionValueId])
			},
		},
		[FeedbackId.BrightPosition]: {
			type: 'boolean',
			name: 'Bright Position',
			description: 'Change button style when bright position matches',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: BrightPositionValueId,
					default: 7,
					min: 0x00,
					max: 0xff,
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return Number(instance.getVariableValue('bright_position')) === Number(options[BrightPositionValueId])
			},
		},
		[FeedbackId.GainPosition]: {
			type: 'boolean',
			name: 'Gain Position',
			description: 'Change button style when gain position matches',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: GainPositionValueId,
					default: 2,
					min: 0x00,
					max: 0x0f,
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(223, 85, 0),
			},
			callback: ({ options }) => {
				return Number(instance.getVariableValue('gain_position')) === Number(options[GainPositionValueId])
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
