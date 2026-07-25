import type { CompanionMigrationAction } from '@companion-module/base'
import { migOpt, migValue } from '../utils/migration.js'
import { describe, expect, test } from 'vitest'
import { ExposureActionId, tryUpdateIrisHexValues } from './exposure.js'

describe('iris hex value upgrade migration', () => {
	test('updates old reversed hex values to corrected values', () => {
		const oldToNew: Array<[string, string]> = [
			['11', '0C'],
			['10', '0B'],
			['0F', '0A'],
			['0E', '09'],
			['0D', '08'],
			['0C', '07'],
			['0B', '06'],
			['0A', '05'],
			['09', '04'],
			['08', '03'],
			['07', '02'],
			['06', '01'],
		]

		for (const [oldHex, newHex] of oldToNew) {
			const action: CompanionMigrationAction = {
				actionId: ExposureActionId.SetIris,
				id: 'test',
				controlId: 'x',
				options: { val: migOpt(oldHex) },
			}

			expect(tryUpdateIrisHexValues(action)).toBe(true)
			expect(migValue(action.options['val'])).toBe(newHex)
		}
	})

	test('handles lowercase old hex values', () => {
		const action: CompanionMigrationAction = {
			actionId: ExposureActionId.SetIris,
			id: 'test',
			controlId: 'x',
			options: { val: migOpt('0f') },
		}

		expect(tryUpdateIrisHexValues(action)).toBe(true)
		expect(migValue(action.options['val'])).toBe('0A')
	})

	test('does not modify already-corrected hex values', () => {
		// These are the new/correct values that should not be changed
		const correctValues = ['00', '01', '02', '03', '04', '05']

		for (const val of correctValues) {
			const action: CompanionMigrationAction = {
				actionId: ExposureActionId.SetIris,
				id: 'test',
				controlId: 'x',
				options: { val: migOpt(val) },
			}

			expect(tryUpdateIrisHexValues(action)).toBe(false)
			expect(migValue(action.options['val'])).toBe(val)
		}
	})

	test('does not modify unrelated actions', () => {
		const action: CompanionMigrationAction = {
			actionId: 'someOtherAction',
			id: 'test',
			controlId: 'x',
			options: { val: migOpt('11') },
		}

		expect(tryUpdateIrisHexValues(action)).toBe(false)
		expect(migValue(action.options['val'])).toBe('11')
	})

	test('does not modify when option value is not a string', () => {
		const action: CompanionMigrationAction = {
			actionId: ExposureActionId.SetIris,
			id: 'test',
			controlId: 'x',
			options: { val: migOpt(11) },
		}

		expect(tryUpdateIrisHexValues(action)).toBe(false)
		expect(migValue(action.options['val'])).toBe(11)
	})

	test('does not modify when option is missing', () => {
		const action: CompanionMigrationAction = {
			actionId: ExposureActionId.SetIris,
			id: 'test',
			controlId: 'x',
			options: {},
		}

		expect(tryUpdateIrisHexValues(action)).toBe(false)
	})
})
