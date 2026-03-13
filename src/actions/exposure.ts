import type { CompanionActionEvent, CompanionMigrationAction, CompanionOptionValues } from '@companion-module/base'
import type { ActionDefinitions } from './actionid.js'
import {
	BacklightOff,
	BacklightOn,
	BrightDirect,
	BrightDown,
	BrightReset,
	BrightUp,
	ExpCompDirect,
	ExpCompDown,
	ExpCompOff,
	ExpCompOn,
	ExpCompReset,
	ExpCompUp,
	ExposureMode,
	ExposureModeInquiry,
	GainDirect,
	GainDown,
	GainReset,
	GainUp,
	IrisDown,
	IrisReset,
	IrisSet,
	type IrisSetting,
	IrisUp,
	ShutterDown,
	ShutterReset,
	ShutterSet,
	type ShutterSetting,
	ShutterUp,
} from '../camera/exposure.js'
import type { PtzOpticsInstance } from '../instance.js'
import { optionConversions } from './option-conversion.js'
import { twoDigitHex } from '../utils/two-digit-hex.js'

export enum ExposureActionId {
	BacklightOn = 'backlightOn',
	BacklightOff = 'backlightOff',
	SelectExposureMode = 'expM',
	IrisUp = 'irisU',
	IrisDown = 'irisD',
	IrisReset = 'irisR',
	SetIris = 'irisS',
	ShutterUp = 'shutU',
	ShutterDown = 'shutD',
	ShutterReset = 'shutR',
	SetShutter = 'shutS',
	GainUp = 'gainU',
	GainDown = 'gainD',
	GainReset = 'gainR',
	GainDirect = 'gainDirect',
	ExpCompOn = 'expCompOn',
	ExpCompOff = 'expCompOff',
	ExpCompUp = 'expCompU',
	ExpCompDown = 'expCompD',
	ExpCompReset = 'expCompR',
	ExpCompDirect = 'expCompDirect',
	BrightUp = 'brightU',
	BrightDown = 'brightD',
	BrightReset = 'brightR',
	BrightDirect = 'brightDirect',
}

export const ExposureModeId = 'val'

const [getExposureMode, exposureModeToOption] = optionConversions<ExposureMode, typeof ExposureModeId>(
	ExposureModeId,
	[
		['0', 'full-auto'],
		['1', 'manual'],
		['2', 'shutter-priority'],
		['3', 'iris-priority'],
		['4', 'bright-mode-manual'],
	],
	'full-auto',
	'0',
	String,
)

export const IrisSettingId = 'val'

const [getIrisSetting] = optionConversions<IrisSetting, typeof IrisSettingId>(
	IrisSettingId,
	[
		['0C', 'ƒ 1.8'],
		['0B', 'ƒ 2.0'],
		['0A', 'ƒ 2.4'],
		['09', 'ƒ 2.8'],
		['08', 'ƒ 3.4'],
		['07', 'ƒ 4.0'],
		['06', 'ƒ 4.8'],
		['05', 'ƒ 5.6'],
		['04', 'ƒ 6.8'],
		['03', 'ƒ 8.0'],
		['02', 'ƒ 9.6'],
		['01', 'ƒ 11.0'],
		['00', 'CLOSED'],
	],
	'CLOSED',
	'00',
	String,
)

export const ShutterSettingId = 'val'

const DefaultShutterSetting = 4

// XXX These mappings aren't all correct on G3, 1/180 seems really to be 1/200
//     and 1/90-30 seems really to be 1/60-50-30.
function getShutterSetting(options: CompanionOptionValues): ShutterSetting {
	let setting = parseInt(String(options[ShutterSettingId]), 16)
	if (setting < 0x01) {
		setting = 0x01
	} else if (0x11 < setting) {
		setting = 0x11
	}

	switch (setting) {
		case 0x11:
			return '1/1000000'
		case 0x10:
			return '1/6000'
		case 0x0f:
			return '1/4000'
		case 0x0e:
			return '1/3000'
		case 0x0d:
			return '1/2000'
		case 0x0c:
			return '1/1500'
		case 0x0b:
			return '1/1000'
		case 0x0a:
			return '1/725'
		case 0x09:
			return '1/500'
		case 0x08:
			return '1/350'
		case 0x07:
			return '1/250'
		case 0x06:
			return '1/180'
		case 0x05:
			return '1/125'
		default:
		case 0x04:
			return '1/100'
		case 0x03:
			return '1/90'
		case 0x02:
			return '1/60'
		case 0x01:
			return '1/30'
	}
}

export function exposureActions(instance: PtzOpticsInstance): ActionDefinitions<ExposureActionId> {
	return {
		[ExposureActionId.BacklightOn]: {
			name: 'Backlight On',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(BacklightOn)
			},
		},
		[ExposureActionId.BacklightOff]: {
			name: 'Backlight Off',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(BacklightOff)
			},
		},
		[ExposureActionId.SelectExposureMode]: {
			name: 'Exposure Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: ExposureModeId,
					choices: [
						{ id: '0', label: 'Full Auto' },
						{ id: '1', label: 'Manual' },
						{ id: '2', label: 'Shutter Pri' },
						{ id: '3', label: 'Iris Pri' },
						{ id: '4', label: 'Bright Mode (manual)' }, // Not in latest API doc: remove?
					],
					default: '0',
				},
			],
			callback: async ({ options }) => {
				const mode = getExposureMode(options)
				instance.sendCommand(ExposureMode, { mode })
			},
			learn: async (_event: CompanionActionEvent) => {
				const opts = await instance.sendInquiry(ExposureModeInquiry)
				if (opts === null) {
					return undefined
				}
				return { [ExposureModeId]: exposureModeToOption(opts.mode) }
			},
		},
		[ExposureActionId.IrisUp]: {
			name: 'Iris Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(IrisUp)
			},
		},
		[ExposureActionId.IrisDown]: {
			name: 'Iris Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(IrisDown)
			},
		},
		[ExposureActionId.IrisReset]: {
			name: 'Iris Reset',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(IrisReset)
			},
		},
		[ExposureActionId.SetIris]: {
			name: 'Set Iris',
			options: [
				{
					type: 'dropdown',
					label: 'Iris setting',
					id: IrisSettingId,
					choices: [
						{ id: '0C', label: 'ƒ 1.8' },
						{ id: '0B', label: 'ƒ 2.0' },
						{ id: '0A', label: 'ƒ 2.4' },
						{ id: '09', label: 'ƒ 2.8' },
						{ id: '08', label: 'ƒ 3.4' },
						{ id: '07', label: 'ƒ 4.0' },
						{ id: '06', label: 'ƒ 4.8' },
						{ id: '05', label: 'ƒ 5.6' },
						{ id: '04', label: 'ƒ 6.8' },
						{ id: '03', label: 'ƒ 8.0' },
						{ id: '02', label: 'ƒ 9.6' },
						{ id: '01', label: 'ƒ 11.0' },
						{ id: '00', label: 'CLOSED' },
					],
					default: '07',
				},
			],
			callback: async ({ options }) => {
				const setting = getIrisSetting(options)
				instance.sendCommand(IrisSet, { setting })
			},
		},
		[ExposureActionId.ShutterUp]: {
			name: 'Shutter Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ShutterUp)
			},
		},
		[ExposureActionId.ShutterDown]: {
			name: 'Shutter Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ShutterDown)
			},
		},
		[ExposureActionId.ShutterReset]: {
			name: 'Shutter Reset',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ShutterReset)
			},
		},
		[ExposureActionId.SetShutter]: {
			name: 'Set Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter setting',
					id: ShutterSettingId,
					choices: [
						{ id: '11', label: '1/1000000' },
						{ id: '10', label: '1/6000' },
						{ id: '0F', label: '1/4000' },
						{ id: '0E', label: '1/3000' },
						{ id: '0D', label: '1/2000' },
						{ id: '0C', label: '1/1500' },
						{ id: '0B', label: '1/1000' },
						{ id: '0A', label: '1/725' },
						{ id: '09', label: '1/500' },
						{ id: '08', label: '1/350' },
						{ id: '07', label: '1/250' },
						{ id: '06', label: '1/180' },
						{ id: '05', label: '1/125' },
						{ id: '04', label: '1/100' },
						{ id: '03', label: '1/90' },
						{ id: '02', label: '1/60' },
						{ id: '01', label: '1/30' },
					],
					default: twoDigitHex(DefaultShutterSetting),
				},
			],
			callback: async ({ options }) => {
				const setting = getShutterSetting(options)
				instance.sendCommand(ShutterSet, { setting })
			},
		},
		[ExposureActionId.GainUp]: {
			name: 'Gain Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(GainUp)
			},
		},
		[ExposureActionId.GainDown]: {
			name: 'Gain Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(GainDown)
			},
		},
		[ExposureActionId.GainReset]: {
			name: 'Gain Reset',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(GainReset)
			},
		},
		[ExposureActionId.GainDirect]: {
			name: 'Gain Direct',
			options: [
				{
					type: 'number',
					label: 'Value',
					id: 'gain',
					min: 0x00,
					max: 0x0f,
					default: 2,
				},
			],
			callback: async ({ options }) => {
				const gain = Number(options['gain'])
				instance.sendCommand(GainDirect, { gain })
			},
		},
		[ExposureActionId.ExpCompOn]: {
			name: 'Exposure Comp On',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ExpCompOn)
			},
		},
		[ExposureActionId.ExpCompOff]: {
			name: 'Exposure Comp Off',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ExpCompOff)
			},
		},
		[ExposureActionId.ExpCompUp]: {
			name: 'Exposure Comp Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ExpCompUp)
			},
		},
		[ExposureActionId.ExpCompDown]: {
			name: 'Exposure Comp Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ExpCompDown)
			},
		},
		[ExposureActionId.ExpCompReset]: {
			name: 'Exposure Comp Reset',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(ExpCompReset)
			},
		},
		[ExposureActionId.ExpCompDirect]: {
			name: 'Exposure Comp Direct',
			options: [
				{
					type: 'number',
					label: 'Value',
					id: 'position',
					min: -7,
					max: 7,
					default: 0,
				},
			],
			callback: async ({ options }) => {
				const position = Number(options['position']) + 7
				instance.sendCommand(ExpCompDirect, { position })
			},
		},
		[ExposureActionId.BrightReset]: {
			name: 'Bright Reset',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(BrightReset)
			},
		},
		[ExposureActionId.BrightUp]: {
			name: 'Bright Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(BrightUp)
			},
		},
		[ExposureActionId.BrightDown]: {
			name: 'Bright Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(BrightDown)
			},
		},
		[ExposureActionId.BrightDirect]: {
			name: 'Bright Direct',
			options: [
				{
					type: 'number',
					label: 'Value',
					id: 'position',
					min: 0x00,
					max: 0xff,
					default: 7,
				},
			],
			callback: async ({ options }) => {
				const position = Number(options['position'])
				instance.sendCommand(BrightDirect, { position })
			},
		},
	}
}

/** Old hex IDs → corrected hex IDs for Set Iris actions. */
const oldIrisHexToNew: Record<string, string> = {
	'11': '0C',
	'10': '0B',
	'0F': '0A',
	'0E': '09',
	'0D': '08',
	'0C': '07',
	'0B': '06',
	'0A': '05',
	'09': '04',
	'08': '03',
	'07': '02',
	'06': '01',
}

export function tryUpdateIrisHexValues(action: CompanionMigrationAction): boolean {
	if (action.actionId !== (ExposureActionId.SetIris as string)) return false
	const val = action.options[IrisSettingId]
	if (typeof val !== 'string') return false
	const upper = val.toUpperCase()
	const replacement = oldIrisHexToNew[upper]
	if (replacement === undefined) return false
	action.options[IrisSettingId] = replacement
	return true
}
