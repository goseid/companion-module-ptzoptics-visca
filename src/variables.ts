import type { CompanionVariableDefinition } from '@companion-module/base'
import { CameraBlockInquiry, LensBlockInquiry } from './camera/block-inquiry.js'
import { OnScreenDisplayInquiry } from './camera/osd.js'
import { PanTiltPositionInquiry } from './camera/pan-tilt.js'
import { SharpnessModeInquiry } from './camera/sharpness.js'
import { FeedbackId } from './feedbacks.js'
import type { PtzOpticsInstance } from './instance.js'
import { PanTiltBounds } from './actions/pan-tilt.js'
import { irisLabelToPercent, normalizePercent, progressBar } from './utils/progress-bar.js'
import { traceLog } from './utils/trace-log.js'

export function getVariableDefinitions(): CompanionVariableDefinition[] {
	return [
		{ variableId: 'pan_position', name: 'Pan Position' },
		{ variableId: 'tilt_position', name: 'Tilt Position' },
		{ variableId: 'zoom_position', name: 'Zoom Position' },
		{ variableId: 'zoom_speed', name: 'Zoom Speed' },
		{ variableId: 'focus_position', name: 'Focus Position' },
		{ variableId: 'focus_speed', name: 'Focus Speed' },
		{ variableId: 'focus_mode', name: 'Focus Mode' },
		{ variableId: 'osd_state', name: 'OSD Menu State' },
		// CAM_CameraBlockInq variables
		{ variableId: 'r_gain', name: 'R Gain' },
		{ variableId: 'b_gain', name: 'B Gain' },
		{ variableId: 'wb_mode', name: 'White Balance Mode' },
		{ variableId: 'sharpness', name: 'Sharpness' },
		{ variableId: 'sharpness_mode', name: 'Sharpness Mode' },
		{ variableId: 'exposure_mode', name: 'Exposure Mode' },
		{ variableId: 'backlight', name: 'Back Light' },
		{ variableId: 'exposure_comp', name: 'Exposure Compensation' },
		{ variableId: 'shutter_position', name: 'Shutter Position' },
		{ variableId: 'iris_position', name: 'Iris Position' },
		{ variableId: 'bright_position', name: 'Bright Position' },
		{ variableId: 'exp_comp_position', name: 'Exposure Comp Position' },
		{ variableId: 'gain_position', name: 'Gain Position' },
		// Position bar variables
		{ variableId: 'pan_position_bar', name: 'Pan Position Bar' },
		{ variableId: 'tilt_position_bar', name: 'Tilt Position Bar' },
		{ variableId: 'zoom_position_bar', name: 'Zoom Position Bar' },
		{ variableId: 'focus_position_bar', name: 'Focus Position Bar' },
		{ variableId: 'iris_position_bar', name: 'Iris Position Bar' },
		// Camera preset variables
		// Camera preset variables
		{ variableId: 'preset_speed', name: 'Preset Speed' },
		{ variableId: 'last_preset_selected', name: 'Last Preset Selected' },
		{ variableId: 'preset_save_active', name: 'Preset Save Active' },
	]
}

/** Default speed for variable-speed zoom and focus commands. */
export const DEFAULT_SPEED = 4

/** Default speed for preset recall drive movements. */
export const DEFAULT_PRESET_SPEED = 12

/** Delay between successive inquiry responses and the next inquiry. */
const POLL_DELAY_MS = 20

/**
 * Maximum time a single poll step may take before being abandoned.  If the
 * camera doesn't respond to an inquiry within this time, the stale pending
 * entry is flushed so the loop can continue draining queued commands.
 */
const POLL_STEP_TIMEOUT_MS = 2_000

async function delay(ms: number, signal: AbortSignal): Promise<void> {
	if (signal.aborted) return Promise.resolve()
	return new Promise((resolve) => {
		function onDone() {
			clearTimeout(timer)
			signal.removeEventListener('abort', onDone)
			resolve()
		}
		const timer = setTimeout(onDone, ms)
		signal.addEventListener('abort', onDone)
	})
}

/** Each poll step sends one inquiry, updates its variables, and checks its feedbacks. */
const pollSteps: Array<(instance: PtzOpticsInstance) => Promise<void>> = [
	async (instance) => {
		const panTilt = await instance.sendPollInquiry(PanTiltPositionInquiry)
		if (panTilt !== null) {
			instance.setVariableValues({
				pan_position: panTilt.panPosition,
				tilt_position: panTilt.tiltPosition,
				pan_position_bar: progressBar(
					normalizePercent(panTilt.panPosition, PanTiltBounds.pan.min, PanTiltBounds.pan.max),
					10,
					'L',
					'R',
				),
				tilt_position_bar: progressBar(
					normalizePercent(panTilt.tiltPosition, PanTiltBounds.tilt.min, PanTiltBounds.tilt.max),
					10,
					'D',
					'U',
				),
			})
			instance.checkFeedbacks(FeedbackId.PanTiltPosition)
		}
	},
	async (instance) => {
		const lens = await instance.sendPollInquiry(LensBlockInquiry)
		if (lens !== null) {
			instance.setVariableValues({
				zoom_position: lens.zoomPosition,
				zoom_position_bar: progressBar(normalizePercent(lens.zoomPosition, 0, 5140), 10, 'W', 'T'),
				focus_position: lens.focusPosition,
				focus_position_bar: progressBar(normalizePercent(lens.focusPosition, 0, 1770), 10, 'N', 'F'),
				focus_mode: lens.focusMode,
			})
			instance.checkFeedbacks(FeedbackId.FocusMode, FeedbackId.FocusPosition, FeedbackId.ZoomPosition)
		}
	},
	async (instance) => {
		const osd = await instance.sendPollInquiry(OnScreenDisplayInquiry)
		if (osd !== null) {
			instance.setVariableValues({ osd_state: osd.state })
		}
	},
	async (instance) => {
		const sharpnessMode = await instance.sendPollInquiry(SharpnessModeInquiry)
		if (sharpnessMode !== null) {
			instance.setVariableValues({ sharpness_mode: sharpnessMode.mode })
			instance.checkFeedbacks(FeedbackId.SharpnessMode)
		}
	},
	async (instance) => {
		const cam = await instance.sendPollInquiry(CameraBlockInquiry)
		if (cam !== null) {
			const backlight = (cam.backlightExpComp & 0x4) !== 0
			const exposureComp = (cam.backlightExpComp & 0x2) !== 0
			instance.setVariableValues({
				r_gain: cam.rGain,
				b_gain: cam.bGain,
				wb_mode: cam.wbMode,
				sharpness: cam.sharpness,
				exposure_mode: cam.aeMode,
				backlight: backlight ? 'on' : 'off',
				exposure_comp: exposureComp ? 'on' : 'off',
				shutter_position: cam.shutterPosition,
				iris_position: cam.irisPosition,
				iris_position_bar: progressBar(irisLabelToPercent(cam.irisPosition), 10, 'C', 'O'),
				bright_position: cam.brightPosition,
				exp_comp_position: cam.expCompPosition,
				gain_position: cam.gainPosition,
			})
			instance.checkFeedbacks(
				FeedbackId.ExposureMode,
				FeedbackId.ExposureModeText,
				FeedbackId.WhiteBalanceMode,
				FeedbackId.IrisPosition,
				FeedbackId.ShutterPosition,
				FeedbackId.BacklightOn,
				FeedbackId.ExpCompOn,
				FeedbackId.ExpCompPosition,
				FeedbackId.BrightPosition,
				FeedbackId.GainPosition,
			)
		}
	},
]

/**
 * Continuously poll camera variables, sending one inquiry at a time with a
 * short delay between each response and the next request.  Individual
 * inquiry failures are logged and skipped so the loop keeps running.
 *
 * Calls `onStepCompleted` after each step so the caller can track liveness.
 */
let nextLoopId = 0

export async function pollVariablesContinuously(
	instance: PtzOpticsInstance,
	signal: AbortSignal,
	onStepCompleted: () => void,
): Promise<void> {
	const loopId = nextLoopId++
	const tag = `POLL-${loopId}`
	traceLog(tag, 'loop started')
	let step = 0
	while (!signal.aborted) {
		// Drain any queued commands/inquiries before the next poll step so
		// that user-triggered operations execute as soon as possible.
		while (!signal.aborted && instance.hasQueuedMessages()) {
			traceLog(tag, 'draining queued message')
			await instance.processNextQueuedMessage()
			onStepCompleted()
			await delay(POLL_DELAY_MS, signal)
		}

		if (signal.aborted) break

		traceLog(tag, `step ${step} start`)
		try {
			const stepResult = await Promise.race([
				pollSteps[step](instance).then(() => 'ok' as const),
				delay(POLL_STEP_TIMEOUT_MS, signal).then(() => 'timeout' as const),
			])
			if (stepResult === 'timeout') {
				traceLog(tag, `step ${step} timed out after ${POLL_STEP_TIMEOUT_MS}ms, flushing`)
				instance.log('debug', `Poll step ${step} timed out, flushing stale messages`)
				instance.flushVISCAQueue('Poll step timed out')
			} else {
				traceLog(tag, `step ${step} done`)
			}
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error)
			traceLog(tag, `step ${step} error: ${message}`)
			instance.log('debug', `Poll step ${step} error: ${message}`)
		}
		onStepCompleted()
		traceLog(tag, `step ${step} post-complete, next delay`)
		step = (step + 1) % pollSteps.length
		await delay(POLL_DELAY_MS, signal)
		traceLog(tag, `delay done, aborted=${String(signal.aborted)}`)
	}
	traceLog(tag, 'loop exited')
}
