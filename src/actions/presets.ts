import type {
	CompanionActionContext,
	CompanionActionEvent,
	CompanionMigrationAction,
	CompanionOptionValues,
	DropdownChoice,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import { optString } from '../utils/option-value.js'
import type { ActionDefinitions } from './actionid.js'
import { isValidPreset, PresetDriveSpeed, PresetRecall, PresetRecallSpeed, PresetSave } from '../camera/presets.js'
import { FeedbackId } from '../feedbacks.js'
import type { PtzOpticsInstance } from '../instance.js'
import { speedChoices } from './speeds.js'
import { repr } from '../utils/repr.js'
import { twoDigitHex } from '../utils/two-digit-hex.js'
import { migOpt, migValue } from '../utils/migration.js'
import { ObsoletePtSpeedSId, PanTiltActionId, PanTiltSpeedSetSpeedId } from './pan-tilt.js'

/** The id of the recall-preset action. */
export const RecallPresetId = 'recallPreset'

/** The id of the set-preset action. */
export const SetPresetId = 'setPreset'

/** The id of the set-a-preset's-drive-speed action. */
const SetPresetDriveSpeedId = 'speedPreset'

/** The id of the smart-preset-down action. */
const SmartPresetDownId = 'smartPresetDown'

/** The id of the smart-preset-up action. */
const SmartPresetUpId = 'smartPresetUp'

/** The id of the preset-speed-up action. */
const PresetSpeedUpId = 'presetSpeedUp'

/** The id of the preset-speed-down action. */
const PresetSpeedDownId = 'presetSpeedDown'

/** The id of the set-preset-speed action. */
const SetPresetSpeedId = 'setPresetSpeed'

/** The id of the preset speed option. */
export const PresetSpeedOptionId = 'presetSpeed'

export enum PresetActionId {
	RecallPreset = RecallPresetId,
	SetPreset = SetPresetId,
	SetPresetDriveSpeed = SetPresetDriveSpeedId,
	SmartPresetDown = SmartPresetDownId,
	SmartPresetUp = SmartPresetUpId,
	PresetSpeedUp = PresetSpeedUpId,
	PresetSpeedDown = PresetSpeedDownId,
	SetPresetSpeed = SetPresetSpeedId,
}

/**
 * The action ID of an obsolete action that would set a preset identified by a
 * textinput whose contents would be parsed for variable references -- replaced
 * with an action that allows specifying the preset from dropdown or textually.
 */
const ObsoleteSavePsetFromVar = 'savePsetFromVar'

/**
 * The action ID of an obsolete action that would recall a preset identified by
 * a textinput whose contents would be parsed for variable references --
 * replaced with an action that allows specifying the preset from dropdown or
 * textually.
 */
const ObsoleteRecallPsetFromVar = 'recallPsetFromVar'

/**
 * The obsolete id of the use-variables option checkbox for preset recall/save
 * actions.  Replaced by `PresetIsTextId`.
 */
export const ObsoletePresetUseVariablesOptionId = 'useVariables'

/**
 * The obsolete id of the option defining a variables-supporting textinput to
 * specify the preset in preset recall/save actions, when the use-variables
 * checkbox is checked.  Replaced by `PresetFromTextId`.
 */
export const ObsoletePresetVariableOptionId = 'presetVariable'

/**
 * The obsolete id of the option that identifies the preset in preset
 * recall/save actions when the use-variables checkbox is unchecked.  Replaced
 * by `PresetAsNumberId`.
 */
export const ObsoletePresetValueOptionId = 'val'

/**
 * If the entirety of `s` is a decimal number, return it.  Otherwise return
 * `NaN`.
 */
function parseCompleteDecimal(s: string): number {
	// `parseInt` can't be directly used because it'll parse a mere prefix of
	// decimal numbers.
	return /^\d+$/.test(s) ? parseInt(s, 10) : NaN
}

/**
 * The id of the obsolete save-preset action that specified preset from either
 * constant two-digit hex number or a variables-supporting text input.
 */
export const ObsoleteSavePsetId = 'savePset'

/**
 * The id of the obsolete recall-preset action that specified preset from either
 * constant two-digit hex number or a variables-supporting text input.
 */
export const ObsoleteRecallPsetId = 'recallPset'

/**
 * Given a migration action, if it's a preset recall/save action with the preset
 * specified *only* by dropdown or *only* by textinput that supports variable
 * references, rewrite it into an action that supports either specification
 * method (with the intended one controlled by a newly-added checkbox) and
 * return true.  Otherwise return false.
 *
 *     // by dropdown
 *     { val: twoDigitHex(N) }⇒
 *     { useVariables: false, val: twoDigitHex(N), presetVariable: <default> }
 *
 *     // by textinput supporting variables
 *     { val: "..." } ⇒
 *     { useVariables: true, val: <default>, presetVariable: "..." }
 *
 * @returns
 *   Whether the action was a preset recall/save action that was rewritten.
 */
export function tryUpdateRecallSetPresetActions(action: CompanionMigrationAction): boolean {
	const { actionId, options } = action
	switch (actionId) {
		case ObsoleteRecallPsetFromVar: {
			action.actionId = ObsoleteRecallPsetId
			options[ObsoletePresetUseVariablesOptionId] = migOpt(true)

			const textinput = optString(migValue(options[ObsoletePresetValueOptionId]))
			options[ObsoletePresetVariableOptionId] = migOpt(textinput)

			const n = parseCompleteDecimal(textinput)
			options[ObsoletePresetValueOptionId] = migOpt(twoDigitHex(isValidPreset(n) ? n : PresetRecallDefault))
			return true
		}

		case ObsoleteSavePsetFromVar: {
			action.actionId = ObsoleteSavePsetId
			options[ObsoletePresetUseVariablesOptionId] = migOpt(true)

			const textinput = optString(migValue(options[ObsoletePresetValueOptionId]))
			options[ObsoletePresetVariableOptionId] = migOpt(textinput)

			const n = parseCompleteDecimal(textinput)
			options[ObsoletePresetValueOptionId] = migOpt(twoDigitHex(isValidPreset(n) ? n : PresetSetDefault))
			return true
		}

		case ObsoleteRecallPsetId:
			if (!(ObsoletePresetUseVariablesOptionId in options)) {
				options[ObsoletePresetUseVariablesOptionId] = migOpt(false)

				const n = parseInt(optString(migValue(options[ObsoletePresetValueOptionId])), 16)
				options[ObsoletePresetVariableOptionId] = migOpt(String(isValidPreset(n) ? n : PresetRecallDefault))
				return true
			}
			return false

		case ObsoleteSavePsetId:
			if (!(ObsoletePresetUseVariablesOptionId in options)) {
				options[ObsoletePresetUseVariablesOptionId] = migOpt(false)

				const n = parseInt(optString(migValue(options[ObsoletePresetValueOptionId])), 16)
				options[ObsoletePresetVariableOptionId] = migOpt(String(isValidPreset(n) ? n : PresetSetDefault))
				return true
			}
			return false

		default:
			return false
	}
}

/**
 * The id of the obsolete set-preset-drive-speed action that specified preset
 * fromeither constant two-digit hex number or a variables-supporting text
 * input.
 */
const ObsoleteSpeedPsetId = 'speedPset'

/**
 * The id of the option checkbox for preset recall/save actions that determines
 * whether the number dropdown determines the desired preset, or the text field
 * (parsed supporting variables) determines the desired preset.
 */
export const PresetIsTextId = 'isText'

/**
 * The id of the option that defines a dropdown of preset numbers in preset
 * recall/save actions, when the use-the-textinput checkbox is unchecked.
 */
export const PresetAsNumberId = 'presetAsNumber'

/**
 * The id of the option defining a variables-supporting textinput to specify the
 * preset in preset recall/save actions, when the use-the-textinput checkbox is
 * checked.
 */
export const PresetAsTextId = 'presetAsText'

/**
 * The id of the option on the set-preset's-drive-speed action that specifies
 * the preset.
 */
export const SetPresetDriveSpeedPresetId = 'preset'

/**
 * The id of the option on the set-preset's-drive-speed action that specifies
 * the speed.
 */
export const SetPresetDriveSpeedSpeedId = 'speed'

/**
 * Given a migration action, attempt to perform these potential upgrades to it:
 *
 *   * If the action is an obsolete preset recall/save action, that had its
 *     preset specified by either two-digit lowercase hex number string or by
 *     text input that supports variables, rewrite it to a modernized form with
 *     the former encoding choice simply being the preset number.
 *
 *         { useVariables: boolean, val: twoDigitHex(N), presetVariable: "..." } ⇒
 *         { isText: boolean, presetAsNumber: N, presetAsText: "..." }
 *
 *   * If the action is an obsolete set-preset-recall-speed action, that had its
 *     preset encoded as a two-digit lowercase hex number string and its speed
 *     encoded as a two-digit uppercase hex number string, rewrite it to a
 *     modernized form that encodes both as simple numbers.
 *
 *         { val: twoDigitHex(N), speed: twoDigitHex(S).toUpperCase() } ⇒
 *         { preset: N, speed: S }
 *
 *   * If the action is an obsolete set-global-pan/tilt-speed action, that
 *     encoded the speed as a two-digit uppercase hex number string, rewrite it
 *     to a modernized form that encodes the speed as a simple number.
 *
 *         { speed: twoDigitHex(S).toUpperCase() }⇒
 *         { speed: S }
 *
 * If one of these upgrades was performed, return true.  Otherwise return false.
 *
 * @returns
 *   Whether the action was upgraded.
 */
export function tryUpdatePresetAndSpeedEncodingsInActions(action: CompanionMigrationAction): boolean {
	const { actionId, options } = action
	switch (actionId) {
		case ObsoleteSavePsetId:
		case ObsoleteRecallPsetId: {
			action.actionId = actionId === ObsoleteSavePsetId ? SetPresetId : RecallPresetId

			options[PresetIsTextId] = options[ObsoletePresetUseVariablesOptionId]
			delete options[ObsoletePresetUseVariablesOptionId]

			options[PresetAsNumberId] = migOpt(parseInt(optString(migValue(options[ObsoletePresetValueOptionId])), 16))
			delete options[ObsoletePresetValueOptionId]

			options[PresetAsTextId] = options[ObsoletePresetVariableOptionId]
			delete options[ObsoletePresetVariableOptionId]
			return true
		}

		case ObsoleteSpeedPsetId: {
			action.actionId = SetPresetDriveSpeedId

			options[SetPresetDriveSpeedPresetId] = migOpt(
				parseInt(optString(migValue(options[ObsoletePresetValueOptionId])), 16),
			)
			delete options[ObsoletePresetValueOptionId]

			options[SetPresetDriveSpeedSpeedId] = migOpt(
				parseInt(optString(migValue(options[SetPresetDriveSpeedSpeedId])), 16),
			)

			return true
		}

		case ObsoletePtSpeedSId: {
			action.actionId = PanTiltActionId.SetMovementSpeed

			options[PanTiltSpeedSetSpeedId] = migOpt(parseInt(optString(migValue(options[PanTiltSpeedSetSpeedId])), 16))
			return true
		}

		default:
			return false
	}
}

/**
 * Given options for an action with a preset option that supports variables,
 * compute the desired preset.
 *
 * @param options
 *   Options from the action.
 * @param context
 *   The context supplied to the action.
 * @returns
 *   An error string if the preset isn't validly identified, or else the preset.
 */
export async function getPresetNumber(
	options: CompanionOptionValues,
	_context: CompanionActionContext,
): Promise<number | string> {
	const isText = Boolean(options[PresetIsTextId])
	let preset
	if (isText) {
		// In API 2.0 Companion resolves variables/expressions before the callback,
		// so the text option is already the final resolved value.
		const presetStr = optString(options[PresetAsTextId])
		preset = parseCompleteDecimal(presetStr)

		if (!isValidPreset(preset)) {
			return `Preset field ${repr(presetStr)} evaluated to an invalid preset`
		}
	} else {
		preset = Number(options[PresetAsNumberId])

		if (!isValidPreset(preset)) {
			return `Invalid preset selected: ${preset}`
		}
	}

	return preset
}

/**
 * The preset default for a preset-recall option.  (0 is used because it's the
 * home setting and so can be expected to be reasonably defined.)
 */
export const PresetRecallDefault = 0

/**
 * The preset default for a preset-set option.  (253 is chosen because it's
 * reasonably likely to be unused, so if the user accidentally forgets to change
 * it he's unlikely to destroy an existing preset.)
 */
export const PresetSetDefault = 253

const PRESET_CHOICES: DropdownChoice[] = []
for (let i = 0; i < 255; ++i) {
	if (isValidPreset(i)) {
		PRESET_CHOICES.push({ id: i, label: String(i) })
	}
}

export function presetActions(instance: PtzOpticsInstance): ActionDefinitions<PresetActionId> {
	function presetNumberOptions(defaultPreset: number): SomeCompanionActionInputField[] {
		return [
			{
				type: 'checkbox',
				label: 'Specify preset textually (supporting variables)',
				id: PresetIsTextId,
				default: false,
			},
			{
				type: 'dropdown',
				label: 'Preset number',
				id: PresetAsNumberId,
				choices: PRESET_CHOICES,
				minChoicesForSearch: 1,
				default: defaultPreset,
				isVisibleExpression: `!$(options:${PresetIsTextId})`,
			},
			{
				type: 'textinput',
				label: 'Preset number',
				id: PresetAsTextId,
				useVariables: true,
				tooltip: 'Preset number range of 0-89, 100-254',
				default: `${defaultPreset}`,
				isVisibleExpression: `!!$(options:${PresetIsTextId})`,
			},
		]
	}

	return {
		[PresetActionId.SetPreset]: {
			name: 'Set Preset',
			options: presetNumberOptions(PresetSetDefault),
			callback: async ({ options }, context) => {
				const preset = await getPresetNumber(options, context)
				if (typeof preset === 'string') {
					instance.log('error', preset)
					return
				}

				instance.sendCommand(PresetSave, { preset })
			},
		},
		[PresetActionId.RecallPreset]: {
			name: 'Recall Preset',
			options: presetNumberOptions(PresetRecallDefault),
			callback: async ({ options }, context) => {
				const preset = await getPresetNumber(options, context)
				if (typeof preset === 'string') {
					instance.log('error', preset)
					return
				}

				instance.sendCommand(PresetRecall, { preset })
			},
		},
		[PresetActionId.SetPresetDriveSpeed]: {
			name: 'Preset Drive Speed',
			options: [
				{
					type: 'dropdown',
					label: 'Preset number',
					id: SetPresetDriveSpeedPresetId,
					choices: PRESET_CHOICES,
					minChoicesForSearch: 1,
					default: 1,
				},
				{
					type: 'dropdown',
					label: 'Speed setting',
					id: SetPresetDriveSpeedSpeedId,
					choices: speedChoices(1, 24),
					minChoicesForSearch: 1,
					default: 12,
				},
			],
			callback: async ({ options }) => {
				const preset = Number(options[SetPresetDriveSpeedPresetId])
				const speed = Number(options[SetPresetDriveSpeedSpeedId])
				instance.sendCommand(PresetDriveSpeed, { preset, speed })
			},
		},
		[PresetActionId.SmartPresetDown]: {
			name: 'Smart Preset (Press)',
			options: presetNumberOptions(PresetRecallDefault),
			callback: async ({ options }, context) => {
				const preset = await getPresetNumber(options, context)
				if (typeof preset === 'string') {
					instance.log('error', preset)
					return
				}

				instance.smartPresetDown(preset)
			},
		},
		[PresetActionId.SmartPresetUp]: {
			name: 'Smart Preset (Release)',
			options: presetNumberOptions(PresetRecallDefault),
			callback: async ({ options }, context) => {
				const preset = await getPresetNumber(options, context)
				if (typeof preset === 'string') {
					instance.log('error', preset)
					return
				}

				instance.smartPresetUp(preset)
			},
		},
		[PresetActionId.PresetSpeedUp]: {
			name: 'Preset Speed Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('preset_speed')) || 1
				const speed = Math.min(current + 1, 24)
				instance.setVariableValues({ preset_speed: speed })
				instance.sendCommand(PresetRecallSpeed, { speed })
				instance.checkFeedbacks(FeedbackId.PresetSpeed)
			},
		},
		[PresetActionId.PresetSpeedDown]: {
			name: 'Preset Speed Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('preset_speed')) || 1
				const speed = Math.max(current - 1, 1)
				instance.setVariableValues({ preset_speed: speed })
				instance.sendCommand(PresetRecallSpeed, { speed })
				instance.checkFeedbacks(FeedbackId.PresetSpeed)
			},
		},
		[PresetActionId.SetPresetSpeed]: {
			name: 'Set Preset Speed',
			options: [
				{
					type: 'number',
					label: 'Speed',
					id: PresetSpeedOptionId,
					min: 1,
					max: 24,
					default: 12,
				},
			],
			callback: async ({ options }) => {
				const speed = Number(options[PresetSpeedOptionId])
				instance.setVariableValues({ preset_speed: speed })
				instance.sendCommand(PresetRecallSpeed, { speed })
				instance.checkFeedbacks(FeedbackId.PresetSpeed)
			},
		},
	}
}
