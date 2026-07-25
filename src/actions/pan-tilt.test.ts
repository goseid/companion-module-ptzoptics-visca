import type { CompanionMigrationAction } from '@companion-module/base'
import { migOpt, migValue } from '../utils/migration.js'
import { describe, expect, test } from 'vitest'
import {
	ObsoletePresetUseVariablesOptionId,
	ObsoletePresetValueOptionId,
	ObsoletePresetVariableOptionId,
	PresetAsNumberId,
	PresetAsTextId,
	PresetIsTextId,
	tryUpdatePresetAndSpeedEncodingsInActions,
} from './presets.js'
import { PanTiltActionId, PanTiltSpeedSetSpeedId } from './pan-tilt.js'

describe('obsolete preset/speed encoding upgrades to pan/tilt set-speed action', () => {
	test('not upgradable, unrelated', () => {
		const action: CompanionMigrationAction = {
			actionId: 'foobar',
			id: 'bai',
			controlId: 'm',
			options: {
				speed: migOpt('0C'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(false)

		const { actionId, options } = action
		expect(actionId).toBe('foobar')
		expect(migValue(options.speed)).toBe('0C')
	})

	test('upgradable pan/tilt set speed, slowest', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'ptSpeedS',
			id: 'kthx',
			controlId: 'z',
			options: {
				speed: migOpt('01'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(PanTiltActionId.SetMovementSpeed)
		expect(migValue(options[PanTiltSpeedSetSpeedId])).toBe(1)
		expect(ObsoletePresetUseVariablesOptionId in options).toBe(false)
		expect(ObsoletePresetValueOptionId in options).toBe(false)
		expect(ObsoletePresetVariableOptionId in options).toBe(false)
		expect(PresetIsTextId in options).toBe(false)
		expect(PresetAsTextId in options).toBe(false)
		expect(PresetAsNumberId in options).toBe(false)
	})

	test('upgradable pan/tilt set speed, mid/default', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'ptSpeedS',
			id: 'kthx',
			controlId: 'z',
			options: {
				speed: migOpt('0C'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(PanTiltActionId.SetMovementSpeed)
		expect(migValue(options[PanTiltSpeedSetSpeedId])).toBe(12)
		expect(ObsoletePresetUseVariablesOptionId in options).toBe(false)
		expect(ObsoletePresetValueOptionId in options).toBe(false)
		expect(ObsoletePresetVariableOptionId in options).toBe(false)
		expect(PresetIsTextId in options).toBe(false)
		expect(PresetAsTextId in options).toBe(false)
		expect(PresetAsNumberId in options).toBe(false)
	})

	test('upgradable pan/tilt set speed, fastest', async () => {
		const action: CompanionMigrationAction = {
			actionId: 'ptSpeedS',
			id: 'kthx',
			controlId: 'z',
			options: {
				speed: migOpt('18'),
			},
		}

		expect(tryUpdatePresetAndSpeedEncodingsInActions(action)).toBe(true)

		const { actionId, options } = action
		expect(actionId).toBe(PanTiltActionId.SetMovementSpeed)
		expect(migValue(options[PanTiltSpeedSetSpeedId])).toBe(24)
		expect(ObsoletePresetUseVariablesOptionId in options).toBe(false)
		expect(ObsoletePresetValueOptionId in options).toBe(false)
		expect(ObsoletePresetVariableOptionId in options).toBe(false)
		expect(PresetIsTextId in options).toBe(false)
		expect(PresetAsTextId in options).toBe(false)
		expect(PresetAsNumberId in options).toBe(false)
	})
})
