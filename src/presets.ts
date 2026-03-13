import { combineRgb, type CompanionPresetDefinitions } from '@companion-module/base'
import { ExposureActionId, ExposureModeId } from './actions/exposure.js'
import { FeedbackId, PanTiltPositionPanId, PanTiltPositionTiltId } from './feedbacks.js'
import { FocusActionId, FocusModeId } from './actions/focus.js'
import { AutoTrackingActionId, TrackingId } from './actions/auto-tracking.js'
import { OnScreenDisplayMenuStateId, OSDActionId, OSDNavigateDirectionId } from './actions/osd.js'
import { PanTiltActionId } from './actions/pan-tilt.js'
import { PresetAsNumberId, PresetAsTextId, PresetIsTextId, RecallPresetId, SetPresetId } from './actions/presets.js'
import { SharpnessActionId, SharpnessModeId, SharpnessPositionId } from './actions/sharpness.js'
import { WhiteBalanceActionId, WhiteBalanceModeId } from './actions/white-balance.js'
import { ZoomActionId } from './actions/zoom.js'
import {
	IMAGE_UP,
	IMAGE_DOWN,
	IMAGE_LEFT,
	IMAGE_RIGHT,
	IMAGE_UP_RIGHT,
	IMAGE_UP_LEFT,
	IMAGE_DOWN_LEFT,
	IMAGE_DOWN_RIGHT,
	IMAGE_ROTARY_BG,
} from './assets/assets.js'
import { isValidPreset } from './camera/presets.js'

export function getPresets(): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitions = {}

	presets['tilt_up_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'UP',
		style: {
			text: '',
			png64: IMAGE_UP,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.TiltUp,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['tilt_down_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'DOWN',
		style: {
			text: '',
			png64: IMAGE_DOWN,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.TiltDown,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['pan_left_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'LEFT',
		style: {
			text: '',
			png64: IMAGE_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.PanLeft,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['pan_right_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'RIGHT',
		style: {
			text: '',
			png64: IMAGE_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.PanRight,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['pt_up_right_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'UP RIGHT',
		style: {
			text: '',
			png64: IMAGE_UP_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.MoveUpRight,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['pt_up_left_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'UP LEFT',
		style: {
			text: '',
			png64: IMAGE_UP_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.MoveUpLeft,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['pt_down_left_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'DOWN LEFT',
		style: {
			text: '',
			png64: IMAGE_DOWN_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.MoveDownLeft,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['pt_down_right_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'DOWN RIGHT',
		style: {
			text: '',
			png64: IMAGE_DOWN_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.MoveDownRight,
						options: {},
					},
				],
				up: [
					{
						actionId: PanTiltActionId.StopMoving,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['home_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Home',
		style: {
			text: 'HOME',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.ResetToHome,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['absolute_position_center'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Center (0, 0)',
		style: {
			text: 'Center\\n0, 0',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.AbsolutePosition,
						options: {
							panPosIsText: false,
							panPosAsNumber: 0,
							panPosAsText: '0',
							tiltPosIsText: false,
							tiltPosAsNumber: 0,
							tiltPosAsText: '0',
							panSpeed: 12,
							tiltSpeed: 12,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.PanTiltPosition,
				options: {
					[PanTiltPositionPanId]: 0,
					[PanTiltPositionTiltId]: 0,
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['speed_up_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Speed Up',
		style: {
			text: 'SPEED\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.SpeedUpMovement,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['speed_down_preset'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Speed Down',
		style: {
			text: 'SPEED\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.SlowDownMovement,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['zoom_in_preset'] = {
		type: 'button',
		category: 'Lens',
		name: 'Zoom In',
		style: {
			text: 'ZOOM\\nIN',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.StartZoomIn,
						options: {},
					},
				],
				up: [
					{
						actionId: ZoomActionId.StopZoom,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['zoom_out_preset'] = {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Out',
		style: {
			text: 'ZOOM\\nOUT',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.StartZoomOut,
						options: {},
					},
				],
				up: [
					{
						actionId: ZoomActionId.StopZoom,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['focus_near_preset'] = {
		type: 'button',
		category: 'Lens',
		name: 'Focus Near',
		style: {
			text: 'FOCUS\\nNEAR',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.StartFocusNearer,
						options: {},
					},
				],
				up: [
					{
						actionId: FocusActionId.StopFocus,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['focus_far_preset'] = {
		type: 'button',
		category: 'Lens',
		name: 'Focus Far',
		style: {
			text: 'FOCUS\\nFAR',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.StartFocusFarther,
						options: {},
					},
				],
				up: [
					{
						actionId: FocusActionId.StopFocus,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['auto_focus_preset'] = {
		type: 'button',
		category: 'Lens',
		name: 'Auto Focus',
		style: {
			text: 'AUTO\\nFOCUS',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.SelectFocusMode,
						options: {
							[FocusModeId]: '2',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.FocusMode,
				options: { mode: 'auto' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}

	presets['focus_lock_preset'] = {
		type: 'button',
		category: 'Lens',
		name: 'Focus Lock',
		style: {
			text: 'FOCUS\\nLOCK',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.LockFocus,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['focus_unlock_preset'] = {
		type: 'button',
		category: 'Lens',
		name: 'Focus Unlock',
		style: {
			text: 'FOCUS\\nUNLOCK',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.UnlockFocus,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['exposure_mode_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Mode',
		style: {
			text: 'EXP\\nMODE',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: 0,
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: 1,
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: 2,
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: 3,
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: 4,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExposureModeText,
				options: {},
			},
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'full-auto' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'manual' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'shutter-priority' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'iris-priority' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'bright-mode-manual' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['exposure_mode_full_auto_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Full Auto',
		style: {
			text: 'EXP Mode\\nAuto',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: '0',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'full-auto' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['exposure_mode_manual_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Manual',
		style: {
			text: 'EXP Mode\\nManual',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: '1',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'manual' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['exposure_mode_shutter_priority_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Shutter Priority',
		style: {
			text: 'EXP Mode\\nShutter',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: '2',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'shutter-priority' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['exposure_mode_iris_priority_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Iris Priority',
		style: {
			text: 'EXP Mode\\nIris',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: '3',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'iris-priority' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['exposure_mode_bright_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Bright Mode',
		style: {
			text: 'EXP Mode\\nBright',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SelectExposureMode,
						options: {
							[ExposureModeId]: '4',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExposureMode,
				options: { mode: 'bright-mode-manual' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['iris_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Iris',
		options: { rotaryActions: true },
		style: {
			text: 'Iris\\n$(ptzoptics-visca:iris_position)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SetIris,
						options: {
							val: '0B',
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: ExposureActionId.IrisDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: ExposureActionId.IrisUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['iris_up_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Iris Up',
		style: {
			text: 'IRIS\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.IrisUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['iris_down_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Iris Down',
		style: {
			text: 'IRIS\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.IrisDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['shutter_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Shutter',
		options: { rotaryActions: true },
		style: {
			text: 'Shutter\\n$(ptzoptics-visca:shutter_position)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SetShutter,
						options: {
							val: '02',
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: ExposureActionId.ShutterDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: ExposureActionId.ShutterUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['shutter_up_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Shutter Up',
		style: {
			text: 'Shut\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ShutterUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['shutter_down_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Shutter Down',
		style: {
			text: 'Shut\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ShutterDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['gain_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Gain',
		options: { rotaryActions: true },
		style: {
			text: 'Gain\\n$(ptzoptics-visca:gain_position)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.GainDirect,
						options: {
							gain: 0x00,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: ExposureActionId.GainDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: ExposureActionId.GainUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['exp_comp_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exp Comp',
		options: { rotaryActions: true },
		style: {
			text: 'Exp Comp\\n$(ptzoptics-visca:exp_comp_position)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ExpCompDirect,
						options: {
							position: 0x00,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: ExposureActionId.ExpCompDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: ExposureActionId.ExpCompUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['bright_preset'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Bright',
		options: { rotaryActions: true },
		style: {
			text: 'Bright\\n$(ptzoptics-visca:bright_position)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.BrightDirect,
						options: {
							position: 7,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: ExposureActionId.BrightDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: ExposureActionId.BrightUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['wb_mode_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode',
		style: {
			text: 'WB\\nMODE',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'automatic',
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'indoor',
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'outdoor',
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'onepush',
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'manual',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'automatic' },
				style: {
					text: 'WB\\nAUTO',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'indoor' },
				style: {
					text: 'WB\\nIndoor',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'outdoor' },
				style: {
					text: 'WB\\nOutdoor',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'onepush' },
				style: {
					text: 'WB\\nONE PUSH',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'manual' },
				style: {
					text: 'WB\\nMANUAL',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['wb_mode_auto_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'WB Auto',
		style: {
			text: 'WB\\nAUTO',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'automatic',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'automatic' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['wb_mode_indoor_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'WB Indoor',
		style: {
			text: 'WB\\nIndoor',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 192, 192),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'indoor',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'indoor' },
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['wb_mode_outdoor_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'WB Outdoor',
		style: {
			text: 'WB\\nOutdoor',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(192, 192, 255),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'outdoor',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'outdoor' },
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['wb_mode_onepush_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'WB One Push',
		style: {
			text: 'WB\\nONE PUSH',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'onepush',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'onepush' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['wb_mode_manual_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'WB Manual',
		style: {
			text: 'WB\\nMANUAL',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.SelectWhiteBalance,
						options: {
							[WhiteBalanceModeId]: 'manual',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.WhiteBalanceMode,
				options: { mode: 'manual' },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['trigger_one_push_white_balance_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'Trigger One Push White Balance',
		style: {
			text: 'WB\\nTRIGGER\\nONE PUSH',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.WhiteBalanceOnePushTrigger,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['r_gain_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'R Gain',
		options: { rotaryActions: true },
		style: {
			text: 'R Gain\\n$(ptzoptics-visca:r_gain)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x66, 0x00, 0x00),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.RGainDirect,
						options: {
							gain: 226,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: WhiteBalanceActionId.RGainDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: WhiteBalanceActionId.RGainUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['b_gain_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'B Gain',
		options: { rotaryActions: true },
		style: {
			text: 'B Gain\\n$(ptzoptics-visca:b_gain)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x00, 0x00, 0x66),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.BGainDirect,
						options: {
							gain: 188,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: WhiteBalanceActionId.BGainDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: WhiteBalanceActionId.BGainUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['r_gain_up_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'R Gain Up',
		style: {
			text: 'R Gain\\nUp',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x66, 0x00, 0x00),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.RGainUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['r_gain_down_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'R Gain Down',
		style: {
			text: 'R Gain\\nDown',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x66, 0x00, 0x00),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.RGainDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['r_gain_reset_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'R Gain Reset',
		style: {
			text: 'R Gain\\nReset',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x66, 0x00, 0x00),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.RGainReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['r_gain_direct_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'R Gain Direct',
		style: {
			text: 'R Gain\\nDirect',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x66, 0x00, 0x00),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.RGainDirect,
						options: {
							gain: 226,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['b_gain_up_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'B Gain Up',
		style: {
			text: 'B Gain\\nUp',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x00, 0x00, 0x66),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.BGainUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['b_gain_down_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'B Gain Down',
		style: {
			text: 'B Gain\\nDown',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x00, 0x00, 0x66),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.BGainDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['b_gain_reset_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'B Gain Reset',
		style: {
			text: 'B Gain\\nReset',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x00, 0x00, 0x66),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.BGainReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['b_gain_direct_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'B Gain Direct',
		style: {
			text: 'B Gain\\nDirect',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x00, 0x00, 0x66),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.BGainDirect,
						options: {
							gain: 188,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['rb_gain_direct_preset'] = {
		type: 'button',
		category: 'Color',
		name: 'RB Gain Direct',
		style: {
			text: 'RB Gain\\nDirect',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x33, 0x00, 0x33),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.RGainDirect,
						options: {
							gain: 226,
						},
					},
					{
						actionId: WhiteBalanceActionId.BGainDirect,
						options: {
							gain: 188,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Sharpness presets

	presets['sharpness_preset'] = {
		type: 'button',
		category: 'Image',
		name: 'Sharpness',
		options: { rotaryActions: true },
		style: {
			text: 'Sharp\\n$(ptzoptics-visca:sharpness)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: SharpnessActionId.SharpnessDirect,
						options: {
							[SharpnessPositionId]: 3,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: SharpnessActionId.SharpnessDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: SharpnessActionId.SharpnessUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['sharpness_mode_auto_preset'] = {
		type: 'button',
		category: 'Image',
		name: 'Sharpness Auto',
		style: {
			text: 'Sharp\\nAuto',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: SharpnessActionId.SharpnessMode,
						options: {
							[SharpnessModeId]: 'auto',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.SharpnessMode,
				options: {
					mode: 'auto',
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['sharpness_mode_manual_preset'] = {
		type: 'button',
		category: 'Image',
		name: 'Sharpness Manual',
		style: {
			text: 'Sharp\\nManual',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: SharpnessActionId.SharpnessMode,
						options: {
							[SharpnessModeId]: 'manual',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.SharpnessMode,
				options: {
					mode: 'manual',
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['sharpness_reset_preset'] = {
		type: 'button',
		category: 'Image',
		name: 'Sharpness Reset',
		style: {
			text: 'Sharp\\nReset',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: SharpnessActionId.SharpnessReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['sharpness_up_preset'] = {
		type: 'button',
		category: 'Image',
		name: 'Sharpness Up',
		style: {
			text: 'Sharp\\nUp',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: SharpnessActionId.SharpnessUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['sharpness_down_preset'] = {
		type: 'button',
		category: 'Image',
		name: 'Sharpness Down',
		style: {
			text: 'Sharp\\nDown',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: SharpnessActionId.SharpnessDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['sharpness_direct_preset'] = {
		type: 'button',
		category: 'Image',
		name: 'Sharpness Direct',
		style: {
			text: 'Sharp\\nDirect',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: SharpnessActionId.SharpnessDirect,
						options: {
							[SharpnessPositionId]: 3,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['auto_tracking_on'] = {
		type: 'button',
		category: 'Auto Tracking',
		name: 'Auto Tracking On',
		style: {
			text: 'Auto\\nTracking\\nOn',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: AutoTrackingActionId.AutoTracking,
						options: {
							[TrackingId]: 'on',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['auto_tracking_off'] = {
		type: 'button',
		category: 'Auto Tracking',
		name: 'Auto Tracking Off',
		style: {
			text: 'Auto\\nTracking\\nOff',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: AutoTrackingActionId.AutoTracking,
						options: {
							[TrackingId]: 'off',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['osd_toggle'] = {
		type: 'button',
		category: 'OSD Menu',
		name: 'OSD Menu',
		style: {
			text: 'OSD\\nOpen/Close',
			size: 12,
			color: combineRgb(0xff, 0xff, 0xff),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: OSDActionId.OSD,
						options: {
							[OnScreenDisplayMenuStateId]: 'toggle',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	for (const [DIRECTION, IMAGE] of [
		['up', IMAGE_UP],
		['right', IMAGE_RIGHT],
		['down', IMAGE_DOWN],
		['left', IMAGE_LEFT],
	]) {
		presets['osd_navigate_' + DIRECTION] = {
			type: 'button',
			category: 'OSD Menu',
			name: 'OSD Navigate',
			style: {
				text: '',
				png64: IMAGE,
				pngalignment: 'center:center',
				size: '18',
				color: combineRgb(0xff, 0xff, 0xff),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: OSDActionId.OSDNavigate,
							options: {
								[OSDNavigateDirectionId]: DIRECTION,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	presets['osd_enter'] = {
		type: 'button',
		category: 'OSD Menu',
		name: 'OSD Enter',
		style: {
			text: 'OSD\\nEnter',
			size: '18',
			color: combineRgb(0xff, 0xff, 0xff),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: OSDActionId.OSDEnter,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['osd_back'] = {
		type: 'button',
		category: 'OSD Menu',
		name: 'OSD Back',
		style: {
			text: 'OSD\\nBack',
			size: '18',
			color: combineRgb(0xff, 0xff, 0xff),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: OSDActionId.OSDBack,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// generates presets for saving camera presets
	for (let save = 0; save < 255; save++) {
		if (isValidPreset(save)) {
			presets['save_preset_' + save + '_preset'] = {
				type: 'button',
				category: 'Save Preset',
				name: `Save Preset ${save}`,
				style: {
					text: `SAVE\\nPSET\\n${save}`,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: SetPresetId,
								options: {
									[PresetIsTextId]: false,
									[PresetAsNumberId]: save,
									[PresetAsTextId]: `${save}`,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}

	// generates presets for recalling camera presets
	for (let recall = 0; recall < 255; recall++) {
		if (isValidPreset(recall)) {
			presets['recall_preset_' + recall + '_preset'] = {
				type: 'button',
				category: 'Recall Preset',
				name: `Recall Preset ${recall}`,
				style: {
					text: `Recall\\nPSET\\n${recall}`,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: RecallPresetId,
								options: {
									[PresetIsTextId]: false,
									[PresetAsNumberId]: recall,
									[PresetAsTextId]: `${recall}`,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}

	return presets
}
