import { combineRgb, type JsonValue, Regex, type SomeCompanionConfigField } from '@companion-module/base'
import type { Branded } from './utils/brand.js'

/**
 * The `TConfig` object type used to store instance configuration info.
 *
 * Nothing ensures that Companion config objects conform to the `TConfig` type
 * specified by a module.  Therefore we leave this type underdefined, not
 * well-defined, so that configuration info will be defensively processed.  (We
 * use `PtzOpticsConfig` to ensure configuration data is well-typed.  See
 * `validateConfig` for details.)
 */
export interface RawConfig {
	// Values are typed as `JsonValue` (not `JsonValue | undefined`) so `RawConfig`
	// satisfies the `JsonObject` constraint that Companion's config types require.
	// Missing keys still read back as `undefined` at runtime, so the defensive
	// `!== undefined` guards below remain meaningful.
	[key: string]: JsonValue
}

/** The id of the debug-logging config option. */
export const DebugLoggingOptionId = 'debugLogging'

/**
 * A config option was added in 3.0.0 to turn on extra logging to Companion's
 * logs, to make it easier to debug the module in case of error.  Add a default
 * value for that option to older configs.
 */
export function tryUpdateConfigWithDebugLogging(config: RawConfig): boolean {
	if (!(DebugLoggingOptionId in config)) {
		config[DebugLoggingOptionId] = false
		return true
	}

	return false
}

/** The id of the preset text color config option. */
export const PresetColorTextOptionId = 'presetColorText'

/** The id of the preset background color config option. */
export const PresetColorBGOptionId = 'presetColorBG'

/**
 * Preset color options were added after the initial release.  Add default
 * values for older configs that don't have them.
 */
const DefaultPresetColorText = combineRgb(255, 255, 255)
const DefaultPresetColorBG = combineRgb(51, 68, 68)

export function tryUpdateConfigWithPresetColors(config: RawConfig): boolean {
	let updated = false
	if (!(PresetColorTextOptionId in config)) {
		config[PresetColorTextOptionId] = DefaultPresetColorText
		updated = true
	}
	if (!(PresetColorBGOptionId in config)) {
		config[PresetColorBGOptionId] = DefaultPresetColorBG
		updated = true
	}
	return updated
}

/** Compute the config fields list for this module. */
export function getConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls PTZ cameras with VISCA over IP protocol',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Camera IP',
			width: 6,
			default: '',
			regex: Regex.IP,
			minLength: 1,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'VISCA TCP port',
			width: 6,
			default: '5678',
			regex: Regex.PORT,
			minLength: 1,
		},
		{
			type: 'checkbox',
			id: DebugLoggingOptionId,
			label: 'Log extra info during connection operations, for debugging purposes',
			default: false,
			width: 6,
		},
		{
			type: 'static-text',
			id: 'presetColorInfo',
			width: 12,
			label: 'Color for Presets',
			value: 'Default color for new camera presets',
		},
		{
			type: 'colorpicker',
			id: PresetColorTextOptionId,
			label: 'Text',
			default: DefaultPresetColorText,
			width: 1,
		},
		{
			type: 'colorpicker',
			id: PresetColorBGOptionId,
			label: 'Background',
			default: DefaultPresetColorBG,
			width: 2,
		},
	]
}

/** Validated config information for the camera connection being manipulated. */
export type PtzOpticsConfig = {
	/** The TCP/IP IP address of the camera, or a non-IP address string. */
	host: string

	/** The TCP/IP port used to connect to the camera. */
	port: number

	/**
	 * Whether to perform debug logging of extensive details concerning the
	 * connection: messages sent and received, internal command/inquiry/reply
	 * handling state, etc.
	 */
	[DebugLoggingOptionId]: boolean

	/** Text color for camera preset buttons (combined RGB number). */
	[PresetColorTextOptionId]: number

	/** Background color for camera preset buttons (combined RGB number). */
	[PresetColorBGOptionId]: number
}

/**
 * Instance config suitable for use at instance creation before initialization
 * with an actual config.
 */
export function noCameraConfig(): PtzOpticsConfig {
	return {
		// Empty host ensures that these options won't trigger a connection.
		host: '',
		port: DefaultPort,
		debugLogging: false,
		presetColorText: DefaultPresetColorText,
		presetColorBG: DefaultPresetColorBG,
	}
}

/**
 * Validate `config` as validly-encoded options, massaging options into type
 * conformance as necessary.
 */
export function validateConfig(config: RawConfig): asserts config is PtzOpticsConfig {
	config.host = toHost(config.host)
	config.port = toPort(config.port)
	config[DebugLoggingOptionId] = toDebugLogging(config[DebugLoggingOptionId])
	config[PresetColorTextOptionId] = toColor(config[PresetColorTextOptionId], DefaultPresetColorText)
	config[PresetColorBGOptionId] = toColor(config[PresetColorBGOptionId], DefaultPresetColorBG)
}

const ipRegExp = new RegExp(Regex.IP.slice(1, -1))

/** A valid hostname as well-formed IP address. */
export type Host = Branded<string, 'config-host-valid-ip'>

/** Determine whether the supplied string is a valid hostname. */
export function isValidHost(str: string): str is Host {
	return ipRegExp.test(str)
}

function toHost(host: RawConfig['host']): string {
	if (typeof host === 'string' && isValidHost(host)) {
		return host
	}

	return ''
}

const DefaultPort = 5678

const portRegExp = new RegExp(Regex.PORT.slice(1, -1))

function toPort(port: RawConfig['port']): number {
	if (typeof port === 'number' && portRegExp.test(String(port))) {
		return port
	}
	if (typeof port === 'string' && portRegExp.test(port)) {
		return Number(port)
	}

	return DefaultPort
}

const toDebugLogging = Boolean

function toColor(value: RawConfig[string], fallback: number): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}
	return fallback
}

/**
 * For an already-started instance/connection using the given old config,
 * determine whether applying the new config to it requires restarting the
 * connection.
 */
export function canUpdateConfigWithoutRestarting(oldConfig: PtzOpticsConfig, newConfig: PtzOpticsConfig): boolean {
	// A different host or port straightforwardly requires a connection restart.
	if (oldConfig.host !== newConfig.host || oldConfig.port !== newConfig.port) {
		return false
	}

	// Debug logging can be turned on or off at runtime without restarting.

	// Otherwise we can update config without restarting.
	return true
}
