import type { CompanionActionEvent } from '@companion-module/base'
import type { ActionDefinitions } from './actionid.js'
import {
	AutoWhiteBalanceSensitivity,
	type AutoWhiteBalanceSensitivityLevel,
	BGainDirect,
	BGainDown,
	BGainUp,
	RGainDirect,
	RGainDown,
	RGainUp,
	WhiteBalance,
	type WhiteBalanceMode,
	WhiteBalanceOnePushTrigger,
} from '../camera/white-balance.js'
import type { PtzOpticsInstance } from '../instance.js'
import { optionConversions, optionNullConversions } from './option-conversion.js'

export enum WhiteBalanceActionId {
	SelectWhiteBalance = 'wb',
	WhiteBalanceOnePushTrigger = 'wbOPT',
	SelectAutoWhiteBalanceSensitivity = 'awbS',
	RGainUp = 'rGainUp',
	RGainDown = 'rGainDown',
	RGainDirect = 'rGainDirect',
	BGainUp = 'bGainUp',
	BGainDown = 'bGainDown',
	BGainDirect = 'bGainDirect',
}

export const WhiteBalanceModeId = 'val'

const [getWhiteBalanceMode] = optionNullConversions<WhiteBalanceMode, typeof WhiteBalanceModeId>(
	WhiteBalanceModeId,
	['automatic', 'indoor', 'outdoor', 'onepush', 'manual'],
	'automatic',
)

const AutoWhiteBalanceSensitivityId = 'val'

const [getAutoWhiteBalanceSensitivityLevel] = optionConversions<
	AutoWhiteBalanceSensitivityLevel,
	typeof AutoWhiteBalanceSensitivityId
>(
	AutoWhiteBalanceSensitivityId,
	[
		[0, 'high'],
		[1, 'normal'],
		[2, 'low'],
	],
	'normal',
	1,
)

const GainValueId = 'gain'

export function whiteBalanceActions(instance: PtzOpticsInstance): ActionDefinitions<WhiteBalanceActionId> {
	return {
		[WhiteBalanceActionId.SelectWhiteBalance]: {
			name: 'White balance',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: WhiteBalanceModeId,
					choices: [
						{ id: 'automatic', label: 'Automatic' },
						{ id: 'indoor', label: 'Indoor' },
						{ id: 'outdoor', label: 'Outdoor' },
						{ id: 'onepush', label: 'One Push' },
						{ id: 'manual', label: 'Manual' },
					],
					default: 'automatic',
				},
			],
			callback: async ({ options }) => {
				const mode = getWhiteBalanceMode(options)
				instance.sendCommand(WhiteBalance, { mode })
			},
		},
		[WhiteBalanceActionId.WhiteBalanceOnePushTrigger]: {
			name: 'White balance one push trigger',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(WhiteBalanceOnePushTrigger)
			},
		},
		[WhiteBalanceActionId.SelectAutoWhiteBalanceSensitivity]: {
			name: 'Auto white balance sensitivity',
			options: [
				{
					type: 'dropdown',
					label: 'Sensitivity',
					id: AutoWhiteBalanceSensitivityId,
					choices: [
						{ id: 0, label: 'High' },
						{ id: 1, label: 'Middle' },
						{ id: 2, label: 'Low' },
					],
					default: 1,
				},
			],
			callback: async ({ options }) => {
				const level = getAutoWhiteBalanceSensitivityLevel(options)
				instance.sendCommand(AutoWhiteBalanceSensitivity, { level })
			},
		},
		[WhiteBalanceActionId.RGainUp]: {
			name: 'R Gain Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(RGainUp)
			},
		},
		[WhiteBalanceActionId.RGainDown]: {
			name: 'R Gain Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(RGainDown)
			},
		},
		[WhiteBalanceActionId.RGainDirect]: {
			name: 'R Gain Direct',
			options: [
				{
					type: 'number',
					label: 'Value',
					id: GainValueId,
					min: 0x00,
					max: 0xff,
					default: 0x80,
				},
			],
			callback: async ({ options }) => {
				const gain = Number(options[GainValueId])
				instance.sendCommand(RGainDirect, { gain })
			},
		},
		[WhiteBalanceActionId.BGainUp]: {
			name: 'B Gain Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(BGainUp)
			},
		},
		[WhiteBalanceActionId.BGainDown]: {
			name: 'B Gain Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(BGainDown)
			},
		},
		[WhiteBalanceActionId.BGainDirect]: {
			name: 'B Gain Direct',
			options: [
				{
					type: 'number',
					label: 'Value',
					id: GainValueId,
					min: 0x00,
					max: 0xff,
					default: 0x80,
				},
			],
			callback: async ({ options }) => {
				const gain = Number(options[GainValueId])
				instance.sendCommand(BGainDirect, { gain })
			},
		},
	}
}
