import type { CompanionActionEvent } from '@companion-module/base'
import type { ActionDefinitions } from './actionid.js'
import {
	SharpnessDirect,
	SharpnessDown,
	SharpnessModeCommand,
	type SharpnessMode,
	SharpnessModeInquiry,
	SharpnessReset,
	SharpnessUp,
} from '../camera/sharpness.js'
import type { PtzOpticsInstance } from '../instance.js'
import { optionNullConversions } from './option-conversion.js'

export enum SharpnessActionId {
	SharpnessMode = 'sharpMode',
	SharpnessReset = 'sharpReset',
	SharpnessUp = 'sharpU',
	SharpnessDown = 'sharpD',
	SharpnessDirect = 'sharpDirect',
}

export const SharpnessModeId = 'mode'
export const SharpnessPositionId = 'position'

const [getSharpnessMode, sharpnessModeToOption] = optionNullConversions<SharpnessMode, typeof SharpnessModeId>(
	SharpnessModeId,
	['auto', 'manual'],
	'auto',
)

export function sharpnessActions(instance: PtzOpticsInstance): ActionDefinitions<SharpnessActionId> {
	return {
		[SharpnessActionId.SharpnessMode]: {
			name: 'Sharpness Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: SharpnessModeId,
					choices: [
						{ id: 'auto', label: 'Auto' },
						{ id: 'manual', label: 'Manual' },
					],
					default: 'auto',
				},
			],
			callback: async ({ options }) => {
				const mode = getSharpnessMode(options)
				instance.sendCommand(SharpnessModeCommand, { mode })
			},
			learn: async (_event: CompanionActionEvent) => {
				const result = await instance.sendInquiry(SharpnessModeInquiry)
				if (result === null) {
					return undefined
				}
				return { [SharpnessModeId]: sharpnessModeToOption(result.mode) }
			},
		},
		[SharpnessActionId.SharpnessReset]: {
			name: 'Sharpness Reset',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(SharpnessReset)
			},
		},
		[SharpnessActionId.SharpnessUp]: {
			name: 'Sharpness Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(SharpnessUp)
			},
		},
		[SharpnessActionId.SharpnessDown]: {
			name: 'Sharpness Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(SharpnessDown)
			},
		},
		[SharpnessActionId.SharpnessDirect]: {
			name: 'Sharpness Direct',
			options: [
				{
					type: 'number',
					label: 'Value (0-15)',
					id: SharpnessPositionId,
					min: 0,
					max: 15,
					default: 3,
				},
			],
			callback: async ({ options }) => {
				const position = Number(options[SharpnessPositionId])
				instance.sendCommand(SharpnessDirect, { position })
			},
		},
	}
}
