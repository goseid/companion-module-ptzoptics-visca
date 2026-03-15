import type { ActionDefinitions } from './actionid.js'
import { NR2DLevel, NR3DLevel } from '../camera/noise-reduction.js'
import type { PtzOpticsInstance } from '../instance.js'

export enum NoiseReductionActionId {
	Set2DLevel = 'nr2dLevel',
	Set3DLevel = 'nr3dLevel',
}

const NR2DLevelId = 'level'
const NR3DLevelId = 'level'

export function noiseReductionActions(instance: PtzOpticsInstance): ActionDefinitions<NoiseReductionActionId> {
	return {
		[NoiseReductionActionId.Set2DLevel]: {
			name: '2D NR Level',
			options: [
				{
					type: 'dropdown',
					label: 'Level',
					id: NR2DLevelId,
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: '1 (Weak)' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3' },
						{ id: '4', label: '4' },
						{ id: '5', label: '5 (Strong)' },
					],
					default: '0',
				},
			],
			callback: async ({ options }) => {
				const level = Number(options[NR2DLevelId])
				instance.sendCommand(NR2DLevel, { level })
			},
		},
		[NoiseReductionActionId.Set3DLevel]: {
			name: '3D NR Level',
			options: [
				{
					type: 'dropdown',
					label: 'Level',
					id: NR3DLevelId,
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: '1' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3' },
						{ id: '4', label: '4' },
						{ id: '5', label: '5' },
					],
					default: '0',
				},
			],
			callback: async ({ options }) => {
				const level = Number(options[NR3DLevelId])
				instance.sendCommand(NR3DLevel, { level })
			},
		},
	}
}
