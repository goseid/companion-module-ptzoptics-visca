import type { CompanionMigrationAction, CompanionOptionValues } from '@companion-module/base'
import { migOpt, migValue } from '../utils/migration.js'
import { describe, expect, test } from 'vitest'
import {
	getPresetNumber,
	ObsoletePresetUseVariablesOptionId,
	ObsoletePresetValueOptionId,
	ObsoletePresetVariableOptionId,
	ObsoleteRecallPsetId,
	ObsoleteSavePsetId,
	PresetActionId,
	PresetAsNumberId,
	PresetAsTextId,
	PresetIsTextId,
	PresetRecallDefault,
	PresetSetDefault,
	RecallPresetId,
	SetPresetDriveSpeedPresetId,
	SetPresetDriveSpeedSpeedId,
	SetPresetId,
	tryUpdatePresetAndSpeedEncodingsInActions,
	tryUpdateRecallSetPresetActions,
} from './presets.js'
import { repr } from '../utils/repr.js'
import { twoDigitHex } from '../utils/two-digit-hex.js'

function presetOptions(presetAsNumber: number | string): CompanionOptionValues {
	// The single preset field resolves (value or expression) to a number or a
	// numeric string before the callback; getPresetNumber reads it directly.
	return { [PresetAsNumberId]: presetAsNumber }
}

function expectIsErrorString(result: number | string): void {
	if (typeof result !== 'string') {
		throw new TypeError(`Result should have been an error: ${repr(result)}`)
	}
}

describe('getPresetNumber', () => {
	test('valid preset chosen from the dropdown (number value)', async () => {
		expect(await getPresetNumber(presetOptions(37))).toBe(37)
	})

	test('valid preset from a resolved expression (numeric string)', async () => {
		expect(await getPresetNumber(presetOptions('37'))).toBe(37)
	})

	test('boundary presets are valid', async () => {
		expect(await getPresetNumber(presetOptions(0))).toBe(0)
		expect(await getPresetNumber(presetOptions(89))).toBe(89)
		expect(await getPresetNumber(presetOptions(100))).toBe(100)
		expect(await getPresetNumber(presetOptions(254))).toBe(254)
	})

	test('non-numeric value is an error', async () => {
		expectIsErrorString(await getPresetNumber(presetOptions('foo')))
	})

	test('out-of-range preset in the 90-99 gap is an error', async () => {
		expectIsErrorString(await getPresetNumber(presetOptions(99)))
	})

	test('preset above 254 is an error', async () => {
		expectIsErrorString(await getPresetNumber(presetOptions(255)))
	})
})

describe('preset upgrading of non-preset action', () => {
	describe('test preset upgrading of non-preset action', () => {
		test('non-upgradable action', async () => {
			const action: CompanionMigrationAction = {
				actionId: 'foobar',
				id: 'ohai',
				controlId: 'x',
				options: {
					val: migOpt('123'),
				},
			}

			expect(tryUpdateRecallSetPresetActions(action)).toBe(false)

			const { actionId, options } = action
			expect(actionId).toBe('foobar')
			expect(migValue(options.val)).toBe('123')
		})
	})
})

describe('obsolete preset recall upgrades', () => {
	test('upgradable with constant preset', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'recallPset',
			id: 'kthx',
			controlId: 'x',
			options: {
				val: migOpt(twoDigitHex(66)), // '42'
			},
		}

		expect(tryUpdateRecallSetPresetActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(ObsoleteRecallPsetId)
		expect(migValue(options[ObsoletePresetUseVariablesOptionId])).toBe(false)
		expect(migValue(options[ObsoletePresetValueOptionId])).toBe('42')
		expect(migValue(options[ObsoletePresetVariableOptionId])).toBe(`66`)
	})

	test('upgradable with variable preset containing number', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'recallPsetFromVar',
			id: 'kthx',
			controlId: 'y',
			options: {
				val: migOpt('42'),
			},
		}

		expect(tryUpdateRecallSetPresetActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(ObsoleteRecallPsetId)
		expect(migValue(options[ObsoletePresetUseVariablesOptionId])).toBe(true)
		expect(migValue(options[ObsoletePresetValueOptionId])).toBe(twoDigitHex(42))
		expect(migValue(options[ObsoletePresetVariableOptionId])).toBe('42')
	})

	test('upgradable with variable preset containing variable', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'recallPsetFromVar',
			id: 'kthx',
			controlId: 'y',
			options: {
				val: migOpt('1$(internal:custom_var)'),
			},
		}

		expect(tryUpdateRecallSetPresetActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(ObsoleteRecallPsetId)
		expect(migValue(options[ObsoletePresetUseVariablesOptionId])).toBe(true)
		expect(migValue(options[ObsoletePresetValueOptionId])).toBe(twoDigitHex(PresetRecallDefault))
		expect(migValue(options[ObsoletePresetVariableOptionId])).toBe('1$(internal:custom_var)')
	})
})

describe('obsolete preset save upgrades', () => {
	test('upgradable with constant preset', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'savePset',
			id: 'kthx',
			controlId: 'z',
			options: {
				val: migOpt(twoDigitHex(66)), // '42'
			},
		}

		expect(tryUpdateRecallSetPresetActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(ObsoleteSavePsetId)
		expect(migValue(options[ObsoletePresetUseVariablesOptionId])).toBe(false)
		expect(migValue(options[ObsoletePresetValueOptionId])).toBe('42')
		expect(migValue(options[ObsoletePresetVariableOptionId])).toBe('66')
	})

	test('upgradable with variable preset containing number', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'savePsetFromVar',
			id: 'kthx',
			controlId: 'w',
			options: {
				val: migOpt('42'),
			},
		}

		expect(tryUpdateRecallSetPresetActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(ObsoleteSavePsetId)
		expect(migValue(options[ObsoletePresetUseVariablesOptionId])).toBe(true)
		expect(migValue(options[ObsoletePresetValueOptionId])).toBe(twoDigitHex(42))
		expect(migValue(options[ObsoletePresetVariableOptionId])).toBe('42')
	})

	test('upgradable with variable preset containing variable', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'savePsetFromVar',
			id: 'kthx',
			controlId: 'w',
			options: {
				val: migOpt('1$(internal:custom_var)'),
			},
		}

		expect(tryUpdateRecallSetPresetActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(ObsoleteSavePsetId)
		expect(migValue(options[ObsoletePresetUseVariablesOptionId])).toBe(true)
		expect(migValue(options[ObsoletePresetValueOptionId])).toBe(twoDigitHex(PresetSetDefault))
		expect(migValue(options[ObsoletePresetVariableOptionId])).toBe('1$(internal:custom_var)')
	})
})

describe('obsolete preset/speed encoding upgrades to preset actions', () => {
	test('not upgradable, unrelated', () => {
		const action: CompanionMigrationAction = {
			actionId: 'foobar',
			id: 'bai',
			controlId: 'm',
			options: {
				useVariables: migOpt(42),
				val: migOpt(17),
				presetVariable: migOpt('element'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(false)

		const { actionId, options } = action
		expect(actionId).toBe('foobar')
		expect(migValue(options.useVariables)).toBe(42)
		expect(migValue(options.val)).toBe(17)
		expect(migValue(options.presetVariable)).toBe('element')
		expect('isText' in options).toBe(false)
		expect('asText' in options).toBe(false)
		expect('asNumber' in options).toBe(false)
	})

	test('upgradable save preset', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'savePset',
			id: 'kthx',
			controlId: 'z',
			options: {
				useVariables: migOpt(true),
				val: migOpt('42'),
				presetVariable: migOpt('6$(custom:hello)'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(SetPresetId)
		expect(ObsoletePresetUseVariablesOptionId in options).toBe(false)
		expect(migValue(options[PresetIsTextId])).toBe(true)
		expect(ObsoletePresetValueOptionId in options).toBe(false)
		expect(migValue(options[PresetAsNumberId])).toBe(66)
		expect(ObsoletePresetVariableOptionId in options).toBe(false)
		expect(migValue(options[PresetAsTextId])).toBe('6$(custom:hello)')
	})

	test('upgradable recall preset', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'recallPset',
			id: 'kthx',
			controlId: 'z',
			options: {
				useVariables: migOpt(true),
				val: migOpt('17'),
				presetVariable: migOpt('$(custom:hello)3'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(RecallPresetId)
		expect(ObsoletePresetUseVariablesOptionId in options).toBe(false)
		expect(migValue(options[PresetIsTextId])).toBe(true)
		expect(ObsoletePresetValueOptionId in options).toBe(false)
		expect(migValue(options[PresetAsNumberId])).toBe(23)
		expect(ObsoletePresetVariableOptionId in options).toBe(false)
		expect(migValue(options[PresetAsTextId])).toBe('$(custom:hello)3')
	})

	test('upgradable set preset drive speed', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'speedPset',
			id: 'kthx',
			controlId: 'z',
			options: {
				val: migOpt('69'),
				speed: migOpt('13'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(PresetActionId.SetPresetDriveSpeed)
		expect(migValue(options[SetPresetDriveSpeedPresetId])).toBe(105)
		expect(migValue(options[SetPresetDriveSpeedSpeedId])).toBe(19)
	})
})
