import { type CompanionMigrationAction } from '@companion-module/base'
import { describe, expect, test } from 'vitest'
import { computeCustomCommandAndOptions, tryUpdateCustomCommandsWithCommandParamOptions } from './custom-command.js'
import { MockContext } from '../__tests__/mock-context.js'
import { migOpt, migValue } from '../utils/migration.js'

function makeCustomMigrationAction(includeParameters: boolean): CompanionMigrationAction {
	const action: CompanionMigrationAction = {
		id: 'abcOdOefghiOFjBkGHlJm',
		controlId: '1/0/0',
		actionId: 'custom',
		options: {
			custom: migOpt('81 01 06 06 03 FF'),
		},
	}

	if (includeParameters) {
		action.options.command_parameters = migOpt('')
		action.options.parameter0 = migOpt('')
		action.options.parameter1 = migOpt('')
		action.options.parameter2 = migOpt('')
		action.options.parameter3 = migOpt('')
	}

	return action
}

describe('custom command upgrade to support parameters', () => {
	test('old-school custom command testing and upgrading', () => {
		const needsUpgrade = makeCustomMigrationAction(false)
		expect('command_parameters' in needsUpgrade.options).toBe(false)
		expect('parameter0' in needsUpgrade.options).toBe(false)
		expect('parameter1' in needsUpgrade.options).toBe(false)
		expect('parameter2' in needsUpgrade.options).toBe(false)
		expect('parameter3' in needsUpgrade.options).toBe(false)

		expect(tryUpdateCustomCommandsWithCommandParamOptions(needsUpgrade)).toBe(true)
		expect('command_parameters' in needsUpgrade.options).toBe(true)
		expect(migValue(needsUpgrade.options['parameter0'])).toBe('')
		expect(migValue(needsUpgrade.options['parameter1'])).toBe('')
		expect(migValue(needsUpgrade.options['parameter2'])).toBe('')
		expect(migValue(needsUpgrade.options['parameter3'])).toBe('')

		expect(tryUpdateCustomCommandsWithCommandParamOptions(needsUpgrade)).toBe(false)

		const newStyle = makeCustomMigrationAction(true)
		expect(tryUpdateCustomCommandsWithCommandParamOptions(newStyle)).toBe(false)
	})
})

describe('custom command ultimate bytes sent', () => {
	// In API 2.0 Companion resolves variables/expressions before invoking the
	// callback, so these tests pass already-resolved parameter values (rather
	// than `$(...)` references resolved by the module, as in the API 1.x tests).
	test('no parameters', async () => {
		const context = new MockContext()

		const actionOptions = {
			custom: '81 0A 11 54 00 FF',
			command_parameters: '',
		}

		const { command, paramValues } = await computeCustomCommandAndOptions(actionOptions, context)
		expect(command.toBytes(paramValues)).toStrictEqual([0x81, 0x0a, 0x11, 0x54, 0x00, 0xff])
	})

	test('one parameter, numeric value', async () => {
		const context = new MockContext()

		const actionOptions = {
			custom: '81 0A 11 54 00 FF',
			command_parameters: '9',
			parameter0: '5',
		}

		const { command, paramValues } = await computeCustomCommandAndOptions(actionOptions, context)
		expect(command.toBytes(paramValues)).toStrictEqual([0x81, 0x0a, 0x11, 0x54, 0x05, 0xff])
	})

	test('one parameter, empty (non-numeric) resolved value', async () => {
		const context = new MockContext()

		const actionOptions = {
			custom: '81 0A 11 54 00 FF',
			command_parameters: '9',
			parameter0: '',
		}

		const { command, paramValues } = await computeCustomCommandAndOptions(actionOptions, context)
		expect(command.toBytes(paramValues)).toStrictEqual([0x81, 0x0a, 0x11, 0x54, 0x00, 0xff])
	})

	test('one parameter, resolved to a value', async () => {
		const context = new MockContext()

		const actionOptions = {
			custom: '81 0A 11 54 00 FF',
			command_parameters: '9',
			parameter0: '8',
		}

		const { command, paramValues } = await computeCustomCommandAndOptions(actionOptions, context)
		expect(command.toBytes(paramValues)).toStrictEqual([0x81, 0x0a, 0x11, 0x54, 0x08, 0xff])
	})

	test('one parameter, multi-digit resolved value', async () => {
		const context = new MockContext()

		const actionOptions = {
			custom: '81 0A 11 54 00 FF',
			command_parameters: '9',
			parameter0: '13',
		}

		const { command, paramValues } = await computeCustomCommandAndOptions(actionOptions, context)
		expect(command.toBytes(paramValues)).toStrictEqual([0x81, 0x0a, 0x11, 0x54, 0x0d, 0xff])
	})

	test('two parameters', async () => {
		const context = new MockContext()

		const actionOptions = {
			custom: '81 0A 11 54 00 FF',
			command_parameters: '2; 9',
			parameter0: '7',
			parameter1: '12',
		}

		const { command, paramValues } = await computeCustomCommandAndOptions(actionOptions, context)
		expect(command.toBytes(paramValues)).toStrictEqual([0x81, 0x7a, 0x11, 0x54, 0x0c, 0xff])
	})
})
