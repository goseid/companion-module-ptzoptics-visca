import { combineRgb } from '@companion-module/base'
import { describe, expect, test } from 'vitest'
import {
	type RawConfig,
	DebugLoggingOptionId,
	PresetColorTextOptionId,
	PresetColorBGOptionId,
	tryUpdateConfigWithDebugLogging,
	tryUpdateConfigWithPresetColors,
} from './config.js'

describe('config upgrade to specify debug logging', () => {
	test('config without debug logging', () => {
		const configMissingDebugLogging: RawConfig = {
			host: '127.0.0.1',
			port: '5678',
		}
		expect(DebugLoggingOptionId in configMissingDebugLogging).toBe(false)

		expect(tryUpdateConfigWithDebugLogging(configMissingDebugLogging)).toBe(true)
		expect(DebugLoggingOptionId in configMissingDebugLogging).toBe(true)
		expect(configMissingDebugLogging[DebugLoggingOptionId]).toBe(false)

		expect(tryUpdateConfigWithDebugLogging(configMissingDebugLogging)).toBe(false)
	})

	test('config with debug logging=false', () => {
		const configWithDebugLoggingFalse: RawConfig = {
			host: '127.0.0.1',
			port: '5678',
			debugLogging: false,
		}

		expect(tryUpdateConfigWithDebugLogging(configWithDebugLoggingFalse)).toBe(false)
		expect(configWithDebugLoggingFalse[DebugLoggingOptionId]).toBe(false)
	})

	test('config with debug logging=true', () => {
		const configWithDebugLoggingTrue: RawConfig = {
			host: '127.0.0.1',
			port: '5678',
			debugLogging: true,
		}

		expect(tryUpdateConfigWithDebugLogging(configWithDebugLoggingTrue)).toBe(false)
		expect(configWithDebugLoggingTrue[DebugLoggingOptionId]).toBe(true)
	})
})

describe('config upgrade to specify preset colors', () => {
	test('config without preset colors gets defaults', () => {
		const config: RawConfig = {
			host: '127.0.0.1',
			port: '5678',
		}
		expect(PresetColorTextOptionId in config).toBe(false)
		expect(PresetColorBGOptionId in config).toBe(false)

		expect(tryUpdateConfigWithPresetColors(config)).toBe(true)
		expect(config[PresetColorTextOptionId]).toBe(combineRgb(255, 255, 255))
		expect(config[PresetColorBGOptionId]).toBe(combineRgb(51, 68, 68))

		// Running again should be a no-op
		expect(tryUpdateConfigWithPresetColors(config)).toBe(false)
	})

	test('config with only text color gets background default', () => {
		const config: RawConfig = {
			host: '127.0.0.1',
			port: '5678',
			[PresetColorTextOptionId]: combineRgb(255, 0, 0),
		}

		expect(tryUpdateConfigWithPresetColors(config)).toBe(true)
		expect(config[PresetColorTextOptionId]).toBe(combineRgb(255, 0, 0))
		expect(config[PresetColorBGOptionId]).toBe(combineRgb(51, 68, 68))
	})

	test('config with both colors is not updated', () => {
		const config: RawConfig = {
			host: '127.0.0.1',
			port: '5678',
			[PresetColorTextOptionId]: combineRgb(255, 0, 0),
			[PresetColorBGOptionId]: combineRgb(0, 255, 0),
		}

		expect(tryUpdateConfigWithPresetColors(config)).toBe(false)
		expect(config[PresetColorTextOptionId]).toBe(combineRgb(255, 0, 0))
		expect(config[PresetColorBGOptionId]).toBe(combineRgb(0, 255, 0))
	})
})
