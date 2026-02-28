import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
import { ExposureModeInquiry } from './camera/exposure.js'
import { FocusModeInquiry } from './camera/focus.js'
import { OnScreenDisplayInquiry } from './camera/osd.js'
import { PanTiltPositionInquiry } from './camera/pan-tilt.js'
import { FeedbackId } from './feedbacks.js'
import type { PtzOpticsInstance } from './instance.js'

export function getVariableDefinitions(): CompanionVariableDefinition[] {
	return [
		{ variableId: 'pan_position', name: 'Pan Position' },
		{ variableId: 'tilt_position', name: 'Tilt Position' },
		{ variableId: 'focus_mode', name: 'Focus Mode' },
		{ variableId: 'exposure_mode', name: 'Exposure Mode' },
		{ variableId: 'osd_state', name: 'OSD Menu State' },
	]
}

export async function pollVariables(instance: PtzOpticsInstance): Promise<void> {
	const values: CompanionVariableValues = {}

	const panTilt = await instance.sendInquiry(PanTiltPositionInquiry)
	if (panTilt !== null) {
		values['pan_position'] = panTilt.panPosition
		values['tilt_position'] = panTilt.tiltPosition
	}

	const focus = await instance.sendInquiry(FocusModeInquiry)
	if (focus !== null) {
		values['focus_mode'] = focus.mode
	}

	const exposure = await instance.sendInquiry(ExposureModeInquiry)
	if (exposure !== null) {
		values['exposure_mode'] = exposure.mode
	}

	const osd = await instance.sendInquiry(OnScreenDisplayInquiry)
	if (osd !== null) {
		values['osd_state'] = osd.state
	}

	instance.setVariableValues(values)
	instance.checkFeedbacks(FeedbackId.FocusModeAuto, FeedbackId.ExposureModeText)
}
