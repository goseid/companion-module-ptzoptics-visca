import type { CompanionActionEvent } from '@companion-module/base'
import { optString } from '../utils/option-value.js'
import type { ActionDefinitions } from './actionid.js'
import {
	FocusDirect,
	FocusFarStandard,
	FocusFarVariable,
	FocusLock,
	FocusMode,
	FocusModeInquiry,
	FocusNearStandard,
	FocusNearVariable,
	FocusStop,
	FocusUnlock,
} from '../camera/focus.js'
import { FeedbackId } from '../feedbacks.js'
import type { PtzOpticsInstance } from '../instance.js'
import { optionConversions } from './option-conversion.js'

export enum FocusActionId {
	SelectFocusMode = 'focusM',
	StartFocusNearer = 'focusN',
	StartFocusFarther = 'focusF',
	StopFocus = 'focusS',
	LockFocus = 'focusL',
	UnlockFocus = 'focusU',
	StartFocusNearerVariable = 'focusNV',
	StartFocusFartherVariable = 'focusFV',
	FocusPositionFar = 'focusPosF',
	FocusPositionNear = 'focusPosN',
	SetFocusPosition = 'focusPosS',
	FocusSpeedUp = 'focusSpeedU',
	FocusSpeedDown = 'focusSpeedD',
	SetFocusSpeed = 'focusSpeedS',
}

export const FocusModeId = 'bol'
export const FocusPositionId = 'position'
export const FocusSpeedId = 'speed'

const [getFocusMode, focusModeToOption] = optionConversions<FocusMode, typeof FocusModeId>(
	FocusModeId,
	[
		['0', 'auto'],
		['1', 'manual'],
	],
	'auto',
	'0',
	String,
)

export function focusActions(instance: PtzOpticsInstance): ActionDefinitions<FocusActionId> {
	return {
		[FocusActionId.SelectFocusMode]: {
			name: 'Focus Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Auto/manual focus',
					id: FocusModeId,
					choices: [
						{ id: '0', label: 'Auto focus' },
						{ id: '1', label: 'Manual focus' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async ({ options }) => {
				if (optString(options[FocusModeId]) === '2') {
					const answer = await instance.sendInquiry(FocusModeInquiry)
					if (answer === null) {
						return
					}
					const mode = answer.mode === 'auto' ? 'manual' : 'auto'
					instance.sendCommand(FocusMode, { mode })
				} else {
					const mode = getFocusMode(options)
					instance.sendCommand(FocusMode, { mode })
				}
			},
			learn: async (_event: CompanionActionEvent) => {
				const answer = await instance.sendInquiry(FocusModeInquiry)
				if (answer === null) {
					return undefined
				}
				return { [FocusModeId]: focusModeToOption(answer.mode) }
			},
		},
		[FocusActionId.StartFocusNearer]: {
			name: 'Focus Near',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(FocusNearStandard)
			},
		},
		[FocusActionId.StartFocusFarther]: {
			name: 'Focus Far',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(FocusFarStandard)
			},
		},
		[FocusActionId.StopFocus]: {
			name: 'Focus Stop',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(FocusStop)
			},
		},
		[FocusActionId.LockFocus]: {
			name: 'Focus Lock',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(FocusLock)
			},
		},
		[FocusActionId.UnlockFocus]: {
			name: 'Focus Unlock',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.sendCommand(FocusUnlock)
			},
		},
		[FocusActionId.StartFocusNearerVariable]: {
			name: 'Focus Near (Variable)',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const speed = Number(instance.getVariableValue('focus_speed')) || 0
				instance.sendCommand(FocusNearVariable, { speed })
			},
		},
		[FocusActionId.StartFocusFartherVariable]: {
			name: 'Focus Far (Variable)',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const speed = Number(instance.getVariableValue('focus_speed')) || 0
				instance.sendCommand(FocusFarVariable, { speed })
			},
		},
		[FocusActionId.FocusPositionFar]: {
			name: 'Focus Position Far',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('focus_position')) || 0
				const position = Math.min(current + 1, 0xffff)
				instance.sendCommand(FocusDirect, { position })
			},
		},
		[FocusActionId.FocusPositionNear]: {
			name: 'Focus Position Near',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('focus_position')) || 0
				const position = Math.max(current - 1, 0)
				instance.sendCommand(FocusDirect, { position })
			},
		},
		[FocusActionId.SetFocusPosition]: {
			name: 'Set Focus Position',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: FocusPositionId,
					min: 0,
					max: 0xffff,
					default: 1500,
				},
			],
			callback: async ({ options }) => {
				const position = Number(options[FocusPositionId])
				instance.sendCommand(FocusDirect, { position })
			},
		},
		[FocusActionId.FocusSpeedUp]: {
			name: 'Focus Speed Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('focus_speed')) || 0
				const speed = Math.min(current + 1, 7)
				instance.setVariableValues({ focus_speed: speed })
				instance.checkFeedbacks(FeedbackId.FocusSpeed)
			},
		},
		[FocusActionId.FocusSpeedDown]: {
			name: 'Focus Speed Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				const current = Number(instance.getVariableValue('focus_speed')) || 0
				const speed = Math.max(current - 1, 0)
				instance.setVariableValues({ focus_speed: speed })
				instance.checkFeedbacks(FeedbackId.FocusSpeed)
			},
		},
		[FocusActionId.SetFocusSpeed]: {
			name: 'Set Focus Speed',
			options: [
				{
					type: 'number',
					label: 'Speed',
					id: FocusSpeedId,
					min: 0,
					max: 7,
					default: 4,
				},
			],
			callback: async ({ options }) => {
				const speed = Number(options[FocusSpeedId])
				instance.setVariableValues({ focus_speed: speed })
				instance.checkFeedbacks(FeedbackId.FocusSpeed)
			},
		},
	}
}
