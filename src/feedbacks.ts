import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import type { PtzOpticsInstance } from './instance.js'

export enum FeedbackId {
	FocusModeAuto = 'focus_mode_auto',
	ExposureModeText = 'exposure_mode_text',
}

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
	}
}
