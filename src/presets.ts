import { combineRgb, type CompanionPresetDefinitions, type CompanionPresetSection } from '@companion-module/base'
import { ExposureActionId, ExposureModeId, IrisSettingId, ShutterSettingId } from './actions/exposure.js'
import {
	FeedbackId,
	BrightPositionValueId,
	ExpCompPositionValueId,
	GainPositionValueId,
	IrisPositionSettingId,
	ShutterPositionSettingId,
	PanTiltPositionPanId,
	PanTiltPositionTiltId,
	ZoomPositionValueId,
	ZoomSpeedValueId,
	FocusPositionValueId,
	FocusSpeedValueId,
	PresetSpeedValueId,
	PresetSelectedValueId,
} from './feedbacks.js'
import { FocusActionId, FocusModeId, FocusPositionId, FocusSpeedId } from './actions/focus.js'
import { AutoTrackingActionId, TrackingId } from './actions/auto-tracking.js'
import { NoiseReductionActionId } from './actions/noise-reduction.js'
import { OnScreenDisplayMenuStateId, OSDActionId, OSDNavigateDirectionId } from './actions/osd.js'
import { PanTiltActionId } from './actions/pan-tilt.js'
import {
	PresetActionId,
	PresetAsNumberId,
	PresetAsTextId,
	PresetIsTextId,
	PresetSpeedOptionId,
} from './actions/presets.js'
import { isValidPreset } from './camera/presets.js'
import { SharpnessActionId, SharpnessModeId, SharpnessPositionId } from './actions/sharpness.js'
import { WhiteBalanceActionId, WhiteBalanceModeId } from './actions/white-balance.js'
import { ZoomActionId, ZoomPositionId, ZoomSpeedId } from './actions/zoom.js'
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

export function getPresets(
	presetColorText: number,
	presetColorBG: number,
): { structure: CompanionPresetSection[]; presets: CompanionPresetDefinitions } {
	const presets: CompanionPresetDefinitions = {}

	presets['tilt_up_preset'] = {
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
		name: 'Absolute Position',
		// Per-button `PanPosition`/`TiltPosition` local variables (default 0,0 =
		// center).  Copy the button and edit the two variables to make a custom
		// position-recall button.
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'PanPosition',
				startupValue: 0,
			},
			{
				variableType: 'simple',
				variableName: 'TiltPosition',
				startupValue: 0,
			},
		],
		style: {
			text: 'Abs Pos\\n$(local:PanPosition), $(local:TiltPosition)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.AbsolutePosition,
						// Use the text/expression path per axis so the local variables resolve.
						options: {
							panPosIsText: true,
							panPosAsNumber: 0,
							panPosAsText: { isExpression: true, value: '$(local:PanPosition)' },
							tiltPosIsText: true,
							tiltPosAsNumber: 0,
							tiltPosAsText: { isExpression: true, value: '$(local:TiltPosition)' },
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
					[PanTiltPositionPanId]: { isExpression: true, value: '$(local:PanPosition)' },
					[PanTiltPositionTiltId]: { isExpression: true, value: '$(local:TiltPosition)' },
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['speed_up_preset'] = {
		type: 'simple',
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
		type: 'simple',
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

	presets['pan_position_preset'] = {
		type: 'simple',
		name: 'Pan',
		style: {
			text: 'PAN\\n$(ptzoptics-visca:pan_position)\\n$(ptzoptics-visca:pan_position_bar)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [],
				up: [],
				rotate_left: [
					{
						actionId: PanTiltActionId.PanPositionLeft,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: PanTiltActionId.PanPositionRight,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['tilt_position_preset'] = {
		type: 'simple',
		name: 'Tilt',
		style: {
			text: 'TILT\\n$(ptzoptics-visca:tilt_position)\\n$(ptzoptics-visca:tilt_position_bar)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [],
				up: [],
				rotate_left: [
					{
						actionId: PanTiltActionId.TiltPositionDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: PanTiltActionId.TiltPositionUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['pan_step_left_preset'] = {
		type: 'simple',
		name: 'Pan Step Left',
		style: {
			text: 'Pan\\nStep\\nLEFT',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.PanPositionLeft,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['pan_step_right_preset'] = {
		type: 'simple',
		name: 'Pan Step Right',
		style: {
			text: 'Pan\\nStep\\nRIGHT',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.PanPositionRight,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['tilt_step_up_preset'] = {
		type: 'simple',
		name: 'Tilt Step Up',
		style: {
			text: 'Tilt\\nStep\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.TiltPositionUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['tilt_step_down_preset'] = {
		type: 'simple',
		name: 'Tilt Step Down',
		style: {
			text: 'Tilt\\nStep\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PanTiltActionId.TiltPositionDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['zoom_preset'] = {
		type: 'simple',
		name: 'Zoom',
		style: {
			text: 'ZOOM\\n$(ptzoptics-visca:zoom_position)\\n$(ptzoptics-visca:zoom_position_bar)',
			size: '14',
			png64: IMAGE_ROTARY_BG,
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [],
				up: [],
				rotate_left: [
					{
						actionId: ZoomActionId.ZoomPositionOut,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: ZoomActionId.ZoomPositionIn,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['zoom_in_variable_preset'] = {
		type: 'simple',
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
						actionId: ZoomActionId.StartZoomInVariable,
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

	presets['zoom_out_variable_preset'] = {
		type: 'simple',
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
						actionId: ZoomActionId.StartZoomOutVariable,
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

	presets['zoom_speed_preset'] = {
		type: 'simple',
		name: 'Zoom Speed',
		style: {
			text: 'Zoom Speed\\n$(ptzoptics-visca:zoom_speed)',
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
						actionId: ZoomActionId.SetZoomSpeed,
						options: {
							[ZoomSpeedId]: 4,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: ZoomActionId.ZoomSpeedDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: ZoomActionId.ZoomSpeedUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['zoom_speed_up_preset'] = {
		type: 'simple',
		name: 'Zoom Speed Up',
		style: {
			text: 'Zoom Speed\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.ZoomSpeedUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['zoom_speed_down_preset'] = {
		type: 'simple',
		name: 'Zoom Speed Down',
		style: {
			text: 'Zoom Speed\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.ZoomSpeedDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['zoom_speed_direct_preset'] = {
		type: 'simple',
		name: 'Zoom Speed Set',
		style: {
			text: 'Zoom Speed\\nSet\\n4',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.SetZoomSpeed,
						options: { [ZoomSpeedId]: 4 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ZoomSpeed,
				options: { [ZoomSpeedValueId]: 4 },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['zoom_step_in_preset'] = {
		type: 'simple',
		name: 'Zoom Step In',
		style: {
			text: 'Zoom\\nStep\\nIN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.ZoomPositionIn,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['zoom_step_out_preset'] = {
		type: 'simple',
		name: 'Zoom Step Out',
		style: {
			text: 'Zoom\\nStep\\nOUT',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.ZoomPositionOut,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['zoom_direct_wide_preset'] = {
		type: 'simple',
		name: 'Zoom Wide',
		style: {
			text: 'Zoom\\nWide\\n0',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.SetZoomPosition,
						options: { [ZoomPositionId]: 0 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ZoomPosition,
				options: { [ZoomPositionValueId]: 0 },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['zoom_direct_mid_preset'] = {
		type: 'simple',
		name: 'Zoom Mid',
		style: {
			text: 'Zoom\\nMid\\n2570',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.SetZoomPosition,
						options: { [ZoomPositionId]: 2570 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ZoomPosition,
				options: { [ZoomPositionValueId]: 2570 },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['zoom_direct_tele_preset'] = {
		type: 'simple',
		name: 'Zoom Tele',
		style: {
			text: 'Zoom\\nTele\\n5140',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ZoomActionId.SetZoomPosition,
						options: { [ZoomPositionId]: 5140 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ZoomPosition,
				options: { [ZoomPositionValueId]: 5140 },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['focus_preset'] = {
		type: 'simple',
		name: 'Focus',
		style: {
			text: 'FOCUS\\n$(ptzoptics-visca:focus_position)\\n$(ptzoptics-visca:focus_position_bar)',
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
						actionId: FocusActionId.SelectFocusMode,
						options: {
							[FocusModeId]: '2',
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: FocusActionId.FocusPositionNear,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: FocusActionId.FocusPositionFar,
						options: {},
					},
				],
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

	presets['focus_near_variable_preset'] = {
		type: 'simple',
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
						actionId: FocusActionId.StartFocusNearerVariable,
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

	presets['focus_far_variable_preset'] = {
		type: 'simple',
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
						actionId: FocusActionId.StartFocusFartherVariable,
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

	presets['focus_speed_preset'] = {
		type: 'simple',
		name: 'Focus Speed',
		style: {
			text: 'Focus Speed\\n$(ptzoptics-visca:focus_speed)',
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
						actionId: FocusActionId.SetFocusSpeed,
						options: {
							[FocusSpeedId]: 4,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: FocusActionId.FocusSpeedDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: FocusActionId.FocusSpeedUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['focus_speed_up_preset'] = {
		type: 'simple',
		name: 'Focus Speed Up',
		style: {
			text: 'Focus Speed\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.FocusSpeedUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['focus_speed_down_preset'] = {
		type: 'simple',
		name: 'Focus Speed Down',
		style: {
			text: 'Focus Speed\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.FocusSpeedDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['focus_speed_direct_preset'] = {
		type: 'simple',
		name: 'Focus Speed Set',
		style: {
			text: 'Focus Speed\\nSet\\n4',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.SetFocusSpeed,
						options: { [FocusSpeedId]: 4 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.FocusSpeed,
				options: { [FocusSpeedValueId]: 4 },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['focus_step_far_preset'] = {
		type: 'simple',
		name: 'Focus Step Far',
		style: {
			text: 'Focus\\nStep\\nFAR',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.FocusPositionFar,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['focus_step_near_preset'] = {
		type: 'simple',
		name: 'Focus Step Near',
		style: {
			text: 'Focus\\nStep\\nNEAR',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.FocusPositionNear,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['focus_direct_preset'] = {
		type: 'simple',
		name: 'Focus Direct',
		// Per-button `FocusPosition` local variable: copy the button and edit the
		// variable to make a custom focus-point button.
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'FocusPosition',
				startupValue: 1500,
			},
		],
		style: {
			text: 'Focus\\nDirect\\n$(local:FocusPosition)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: FocusActionId.SetFocusPosition,
						options: { [FocusPositionId]: { isExpression: true, value: '$(local:FocusPosition)' } },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.FocusPosition,
				options: { [FocusPositionValueId]: { isExpression: true, value: '$(local:FocusPosition)' } },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['auto_focus_preset'] = {
		type: 'simple',
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
		type: 'simple',
		name: 'Focus Lock',
		style: {
			text: 'FOCUS\\nLOCK',
			size: '14',
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
		type: 'simple',
		name: 'Focus Unlock',
		style: {
			text: 'FOCUS\\nUNLOCK',
			size: '14',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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

	presets['exp_comp_on_off_preset'] = {
		type: 'simple',
		name: 'Exp Comp On/Off',
		style: {
			text: 'EXP Comp\\nON/OFF',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ExpCompOn,
						options: {},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ExposureActionId.ExpCompOff,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExpCompOn,
				options: {},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['exp_comp_preset'] = {
		type: 'simple',
		name: 'Exp Comp',
		style: {
			text: 'EXP Comp\\n$(ptzoptics-visca:exp_comp_position)',
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
							position: 0,
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

	presets['exp_comp_up_preset'] = {
		type: 'simple',
		name: 'Exp Comp Up',
		style: {
			text: 'EXP Comp\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ExpCompUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['exp_comp_down_preset'] = {
		type: 'simple',
		name: 'Exp Comp Down',
		style: {
			text: 'EXP Comp\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ExpCompDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['exp_comp_reset_preset'] = {
		type: 'simple',
		name: 'Exp Comp Reset',
		style: {
			text: 'EXP Comp\\nRESET',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ExpCompReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['exp_comp_set_preset'] = {
		type: 'simple',
		name: 'Exp Comp Set',
		// Per-button `ExpComp` local variable (display value -7..+7): copy the
		// button and edit the variable to make a custom exposure-comp button.
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'ExpComp',
				startupValue: 0,
			},
		],
		style: {
			text: 'EXP Comp\\nSet\\n$(local:ExpComp)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ExpCompDirect,
						options: {
							position: { isExpression: true, value: '$(local:ExpComp)' },
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ExpCompPosition,
				options: {
					[ExpCompPositionValueId]: { isExpression: true, value: '$(local:ExpComp)' },
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['iris_preset'] = {
		type: 'simple',
		name: 'Iris',
		style: {
			text: 'Iris\\n$(ptzoptics-visca:iris_position)\\n$(ptzoptics-visca:iris_position_bar)',
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
		type: 'simple',
		name: 'Iris Up',
		style: {
			text: 'Iris\\nUP',
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
		type: 'simple',
		name: 'Iris Down',
		style: {
			text: 'Iris\\nDOWN',
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

	presets['iris_reset_preset'] = {
		type: 'simple',
		name: 'Iris Reset',
		style: {
			text: 'Iris\\nRESET',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.IrisReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['iris_direct_preset'] = {
		type: 'simple',
		name: 'Iris Set',
		style: {
			text: 'Iris\\nSet\\nƒ 2.0',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SetIris,
						options: {
							[IrisSettingId]: '0B',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.IrisPosition,
				options: {
					[IrisPositionSettingId]: 'ƒ 2.0',
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['gain_preset'] = {
		type: 'simple',
		name: 'Gain',
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
							gain: 2,
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

	presets['gain_up_preset'] = {
		type: 'simple',
		name: 'Gain Up',
		style: {
			text: 'Gain\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.GainUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['gain_down_preset'] = {
		type: 'simple',
		name: 'Gain Down',
		style: {
			text: 'Gain\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.GainDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['gain_reset_preset'] = {
		type: 'simple',
		name: 'Gain Reset',
		style: {
			text: 'Gain\\nRESET',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.GainReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['gain_set_preset'] = {
		type: 'simple',
		name: 'Gain Set',
		// Per-button `Gain` local variable: copy the button and edit the variable
		// to make a custom gain button.
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'Gain',
				startupValue: 2,
			},
		],
		style: {
			text: 'Gain\\nSet\\n$(local:Gain)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.GainDirect,
						options: {
							gain: { isExpression: true, value: '$(local:Gain)' },
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.GainPosition,
				options: {
					[GainPositionValueId]: { isExpression: true, value: '$(local:Gain)' },
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['shutter_preset'] = {
		type: 'simple',
		name: 'Shutter',
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
		type: 'simple',
		name: 'Shutter Up',
		style: {
			text: 'Shutter\\nUP',
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
		type: 'simple',
		name: 'Shutter Down',
		style: {
			text: 'Shutter\\nDOWN',
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

	presets['shutter_reset_preset'] = {
		type: 'simple',
		name: 'Shutter Reset',
		style: {
			text: 'Shutter\\nRESET',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.ShutterReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['shutter_set_preset'] = {
		type: 'simple',
		name: 'Shutter Set',
		style: {
			text: 'Shutter\\nSet\\n1/60',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.SetShutter,
						options: {
							[ShutterSettingId]: '02',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.ShutterPosition,
				options: {
					[ShutterPositionSettingId]: '1/60',
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['bright_preset'] = {
		type: 'simple',
		name: 'Bright',
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

	presets['bright_up_preset'] = {
		type: 'simple',
		name: 'Bright Up',
		style: {
			text: 'Bright\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.BrightUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['bright_down_preset'] = {
		type: 'simple',
		name: 'Bright Down',
		style: {
			text: 'Bright\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.BrightDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['bright_reset_preset'] = {
		type: 'simple',
		name: 'Bright Reset',
		style: {
			text: 'Bright\\nRESET',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.BrightReset,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['bright_set_preset'] = {
		type: 'simple',
		name: 'Bright Set',
		// Per-button `Bright` local variable: copy the button and edit the variable
		// to make a custom bright-level button.
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'Bright',
				startupValue: 7,
			},
		],
		style: {
			text: 'Bright\\nSet\\n$(local:Bright)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.BrightDirect,
						options: {
							position: { isExpression: true, value: '$(local:Bright)' },
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.BrightPosition,
				options: {
					[BrightPositionValueId]: { isExpression: true, value: '$(local:Bright)' },
				},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['backlight_on_off_preset'] = {
		type: 'simple',
		name: 'Backlight On/Off',
		style: {
			text: 'Backlight\\nON/OFF',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ExposureActionId.BacklightOn,
						options: {},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ExposureActionId.BacklightOff,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.BacklightOn,
				options: {},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	presets['wb_mode_preset'] = {
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
		name: 'R Gain',
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
		type: 'simple',
		name: 'B Gain',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
		name: 'RB Gain Direct',
		// Per-button `RedGain`/`BlueGain` local variables drive both the button
		// text and the R/B gain values sent, so a copied button can target
		// different gains by editing just the two variables.
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'RedGain',
				startupValue: 226,
			},
			{
				variableType: 'simple',
				variableName: 'BlueGain',
				startupValue: 188,
			},
		],
		style: {
			text: 'RB Gain\\nDirect\\n$(local:RedGain)|$(local:BlueGain)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0x33, 0x00, 0x33),
		},
		steps: [
			{
				down: [
					{
						actionId: WhiteBalanceActionId.RGainDirect,
						// Number field, so reference the local variable via expression mode.
						options: {
							gain: { isExpression: true, value: '$(local:RedGain)' },
						},
					},
					{
						actionId: WhiteBalanceActionId.BGainDirect,
						options: {
							gain: { isExpression: true, value: '$(local:BlueGain)' },
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
		type: 'simple',
		name: 'Sharpness',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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

	presets['nr_2d_off_preset'] = {
		type: 'simple',
		name: '2D NR Off',
		style: {
			text: '2D NR\\nOFF',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: NoiseReductionActionId.Set2DLevel,
						options: { level: '0' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['nr_2d_level_3_preset'] = {
		type: 'simple',
		name: '2D NR Level 3',
		style: {
			text: '2D NR\\nLevel 3',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: NoiseReductionActionId.Set2DLevel,
						options: { level: '3' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['nr_3d_off_preset'] = {
		type: 'simple',
		name: '3D NR Off',
		style: {
			text: '3D NR\\nOFF',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: NoiseReductionActionId.Set3DLevel,
						options: { level: '0' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['nr_3d_level_3_preset'] = {
		type: 'simple',
		name: '3D NR Level 3',
		style: {
			text: '3D NR\\nLevel 3',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: NoiseReductionActionId.Set3DLevel,
						options: { level: '3' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['auto_tracking_on'] = {
		type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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

	const osdNavigateIds: string[] = []
	for (const [DIRECTION, IMAGE] of [
		['up', IMAGE_UP],
		['right', IMAGE_RIGHT],
		['down', IMAGE_DOWN],
		['left', IMAGE_LEFT],
	]) {
		const osdNavigateId = 'osd_navigate_' + DIRECTION
		osdNavigateIds.push(osdNavigateId)
		presets[osdNavigateId] = {
			type: 'simple',
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
		type: 'simple',
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
		type: 'simple',
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

	// Smart preset buttons: one per valid preset (short press = recall, hold > 1s
	// = save).  Each carries a per-button `PresetNumber` local variable set to its
	// preset number, so the button text, recall/save actions, and "selected"
	// feedback all follow the variable.  Copy any button and change `PresetNumber`
	// to retarget the whole button to a different preset.
	const smartPresetIds: string[] = []
	for (let n = 0; n < 255; n++) {
		if (!isValidPreset(n)) continue

		const smartPresetId = `smart_preset_${n}`
		smartPresetIds.push(smartPresetId)
		presets[smartPresetId] = {
			type: 'simple',
			name: `Preset ${n}`,
			localVariables: [
				{
					variableType: 'simple',
					variableName: 'PresetNumber',
					startupValue: n,
				},
			],
			style: {
				text: 'Preset\\n$(local:PresetNumber)',
				size: '18',
				color: presetColorText,
				bgcolor: presetColorBG,
			},
			steps: [
				{
					down: [
						{
							actionId: PresetActionId.SmartPresetDown,
							options: {
								[PresetIsTextId]: true,
								[PresetAsNumberId]: n,
								// Expression mode so the per-button local variable resolves.
								[PresetAsTextId]: { isExpression: true, value: '$(local:PresetNumber)' },
							},
						},
					],
					up: [
						{
							actionId: PresetActionId.SmartPresetUp,
							options: {
								[PresetIsTextId]: true,
								[PresetAsNumberId]: n,
								// Expression mode so the per-button local variable resolves.
								[PresetAsTextId]: { isExpression: true, value: '$(local:PresetNumber)' },
							},
						},
					],
				},
			],
			feedbacks: [
				{
					feedbackId: FeedbackId.PresetSelected,
					// A number field can't hold a variable reference in value mode, so
					// drive it with an expression evaluating the local variable.
					options: { [PresetSelectedValueId]: { isExpression: true, value: '$(local:PresetNumber)' } },
					style: {
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(223, 85, 0),
					},
				},
				{
					feedbackId: FeedbackId.PresetSaveActive,
					options: {},
					style: {
						color: combineRgb(0, 0, 0),
						bgcolor: combineRgb(255, 255, 0),
					},
				},
			],
		}
	}

	presets['preset_speed_preset'] = {
		type: 'simple',
		name: 'Preset Speed',
		style: {
			text: 'Preset Speed\\n$(ptzoptics-visca:preset_speed)',
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
						actionId: PresetActionId.SetPresetSpeed,
						options: {
							[PresetSpeedOptionId]: 12,
						},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: PresetActionId.PresetSpeedDown,
						options: {},
					},
				],
				rotate_right: [
					{
						actionId: PresetActionId.PresetSpeedUp,
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	}

	presets['preset_speed_up_preset'] = {
		type: 'simple',
		name: 'Preset Speed Up',
		style: {
			text: 'Preset Speed\\nUP',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PresetActionId.PresetSpeedUp,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['preset_speed_down_preset'] = {
		type: 'simple',
		name: 'Preset Speed Down',
		style: {
			text: 'Preset Speed\\nDOWN',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PresetActionId.PresetSpeedDown,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['preset_speed_direct_preset'] = {
		type: 'simple',
		name: 'Preset Speed Set',
		style: {
			text: 'Preset Speed\\nSet\\n12',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: PresetActionId.SetPresetSpeed,
						options: { [PresetSpeedOptionId]: 12 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: FeedbackId.PresetSpeed,
				options: { [PresetSpeedValueId]: 12 },
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(223, 85, 0),
				},
			},
		],
	}

	const structure: CompanionPresetSection[] = [
		{
			id: 'pan-tilt',
			name: 'Pan/Tilt',
			definitions: [
				'tilt_up_preset',
				'tilt_down_preset',
				'pan_left_preset',
				'pan_right_preset',
				'pt_up_right_preset',
				'pt_up_left_preset',
				'pt_down_left_preset',
				'pt_down_right_preset',
				'home_preset',
				'absolute_position_center',
				'speed_up_preset',
				'speed_down_preset',
				'pan_position_preset',
				'tilt_position_preset',
				'pan_step_left_preset',
				'pan_step_right_preset',
				'tilt_step_up_preset',
				'tilt_step_down_preset',
			],
		},
		{
			id: 'lens',
			name: 'Lens',
			definitions: [
				'zoom_preset',
				'zoom_in_variable_preset',
				'zoom_out_variable_preset',
				'zoom_speed_preset',
				'zoom_speed_up_preset',
				'zoom_speed_down_preset',
				'zoom_speed_direct_preset',
				'zoom_step_in_preset',
				'zoom_step_out_preset',
				'zoom_direct_wide_preset',
				'zoom_direct_mid_preset',
				'zoom_direct_tele_preset',
				'focus_preset',
				'focus_near_variable_preset',
				'focus_far_variable_preset',
				'focus_speed_preset',
				'focus_speed_up_preset',
				'focus_speed_down_preset',
				'focus_speed_direct_preset',
				'focus_step_far_preset',
				'focus_step_near_preset',
				'focus_direct_preset',
				'auto_focus_preset',
				'focus_lock_preset',
				'focus_unlock_preset',
			],
		},
		{
			id: 'exposure',
			name: 'Exposure',
			definitions: [
				'exposure_mode_preset',
				'exposure_mode_full_auto_preset',
				'exposure_mode_manual_preset',
				'exposure_mode_shutter_priority_preset',
				'exposure_mode_iris_priority_preset',
				'exposure_mode_bright_preset',
				'exp_comp_on_off_preset',
				'exp_comp_preset',
				'exp_comp_up_preset',
				'exp_comp_down_preset',
				'exp_comp_reset_preset',
				'exp_comp_set_preset',
				'iris_preset',
				'iris_up_preset',
				'iris_down_preset',
				'iris_reset_preset',
				'iris_direct_preset',
				'gain_preset',
				'gain_up_preset',
				'gain_down_preset',
				'gain_reset_preset',
				'gain_set_preset',
				'shutter_preset',
				'shutter_up_preset',
				'shutter_down_preset',
				'shutter_reset_preset',
				'shutter_set_preset',
				'bright_preset',
				'bright_up_preset',
				'bright_down_preset',
				'bright_reset_preset',
				'bright_set_preset',
				'backlight_on_off_preset',
			],
		},
		{
			id: 'color',
			name: 'Color',
			definitions: [
				'wb_mode_preset',
				'wb_mode_auto_preset',
				'wb_mode_indoor_preset',
				'wb_mode_outdoor_preset',
				'wb_mode_onepush_preset',
				'wb_mode_manual_preset',
				'trigger_one_push_white_balance_preset',
				'r_gain_preset',
				'b_gain_preset',
				'r_gain_up_preset',
				'r_gain_down_preset',
				'r_gain_reset_preset',
				'r_gain_direct_preset',
				'b_gain_up_preset',
				'b_gain_down_preset',
				'b_gain_reset_preset',
				'b_gain_direct_preset',
				'rb_gain_direct_preset',
			],
		},
		{
			id: 'image',
			name: 'Image',
			definitions: [
				'sharpness_preset',
				'sharpness_mode_auto_preset',
				'sharpness_mode_manual_preset',
				'sharpness_reset_preset',
				'sharpness_up_preset',
				'sharpness_down_preset',
				'sharpness_direct_preset',
				'nr_2d_off_preset',
				'nr_2d_level_3_preset',
				'nr_3d_off_preset',
				'nr_3d_level_3_preset',
			],
		},
		{
			id: 'auto-tracking',
			name: 'Auto Tracking',
			definitions: ['auto_tracking_on', 'auto_tracking_off'],
		},
		{
			id: 'osd-menu',
			name: 'OSD Menu',
			definitions: ['osd_toggle', 'osd_enter', 'osd_back', ...osdNavigateIds],
		},
		{
			id: 'presets',
			name: 'Presets',
			definitions: [
				...smartPresetIds,
				'preset_speed_preset',
				'preset_speed_up_preset',
				'preset_speed_down_preset',
				'preset_speed_direct_preset',
			],
		},
	]

	return { structure, presets }
}
