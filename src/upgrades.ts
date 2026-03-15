import type {
	CompanionMigrationAction,
	CompanionMigrationFeedback,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
} from '@companion-module/base'
import { tryUpdateCustomCommandsWithCommandParamOptions } from './actions/custom-command.js'
import { tryUpdateIrisHexValues } from './actions/exposure.js'
import { tryUpdatePresetAndSpeedEncodingsInActions, tryUpdateRecallSetPresetActions } from './actions/presets.js'
import { type RawConfig, tryUpdateConfigWithDebugLogging, tryUpdateConfigWithPresetColors } from './config.js'

function ActionUpdater(
	tryUpdate: (action: CompanionMigrationAction) => boolean,
): CompanionStaticUpgradeScript<RawConfig> {
	return (_context: CompanionUpgradeContext<RawConfig>, props: CompanionStaticUpgradeProps<RawConfig>) => {
		return {
			updatedActions: props.actions.filter(tryUpdate),
			updatedConfig: null,
			updatedFeedbacks: [],
		}
	}
}

function FeedbackUpdater(
	tryUpdate: (feedback: CompanionMigrationFeedback) => boolean,
): CompanionStaticUpgradeScript<RawConfig> {
	return (_context: CompanionUpgradeContext<RawConfig>, props: CompanionStaticUpgradeProps<RawConfig>) => {
		return {
			updatedActions: [],
			updatedConfig: null,
			updatedFeedbacks: props.feedbacks.filter(tryUpdate),
		}
	}
}

function ConfigUpdater(tryUpdate: (config: RawConfig) => boolean): CompanionStaticUpgradeScript<RawConfig> {
	return (_context: CompanionUpgradeContext<RawConfig>, props: CompanionStaticUpgradeProps<RawConfig>) => {
		return {
			updatedActions: [],
			updatedConfig: props.config !== null && tryUpdate(props.config) ? props.config : null,
			updatedFeedbacks: [],
		}
	}
}

/** Old individual WB feedback IDs → mode value for the unified feedback. */
const oldWbFeedbackToMode: Record<string, string> = {
	wb_mode_auto: 'automatic',
	wb_mode_indoor: 'indoor',
	wb_mode_outdoor: 'outdoor',
	wb_mode_onepush: 'onepush',
	wb_mode_manual: 'manual',
}

function tryUpdateFocusModeFeedback(feedback: CompanionMigrationFeedback): boolean {
	if (feedback.feedbackId !== 'focus_mode_auto') return false
	feedback.feedbackId = 'focus_mode'
	feedback.options['mode'] = 'auto'
	return true
}

function tryUpdateWhiteBalanceFeedbacks(feedback: CompanionMigrationFeedback): boolean {
	const mode = oldWbFeedbackToMode[feedback.feedbackId]
	if (mode === undefined) return false
	feedback.feedbackId = 'wb_mode'
	feedback.options['mode'] = mode
	return true
}

export const UpgradeScripts = [
	ActionUpdater(tryUpdateCustomCommandsWithCommandParamOptions),
	ConfigUpdater(tryUpdateConfigWithDebugLogging),
	ActionUpdater(tryUpdateRecallSetPresetActions),
	ActionUpdater(tryUpdatePresetAndSpeedEncodingsInActions),
	ActionUpdater(tryUpdateIrisHexValues),
	FeedbackUpdater(tryUpdateFocusModeFeedback),
	FeedbackUpdater(tryUpdateWhiteBalanceFeedbacks),
	ConfigUpdater(tryUpdateConfigWithPresetColors),
] satisfies CompanionStaticUpgradeScript<RawConfig>[]
