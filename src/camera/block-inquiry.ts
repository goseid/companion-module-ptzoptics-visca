import type { ExposureMode, IrisSetting, ShutterSetting } from './exposure.js'
import type { WhiteBalanceMode } from './white-balance.js'
import { ModuleDefinedInquiry } from '../visca/inquiry.js'

/**
 * CAM_CameraBlockInq — returns camera exposure, white balance, and gain
 * state in a single response.
 *
 * Command:  81 09 7E 7E 01 FF
 * Response: 90 50 0p 0p 0q 0q 0r 0s tt 0u vv ww rr xx 0z FF
 *
 * pp: R Gain, qq: B Gain, r: WB Mode, s: Aperture, tt: AE Mode,
 * u.bit2: Back Light, u.bit1: Exposure Comp,
 * vv: Shutter Position, ww: Iris Position, rr: reserved (not always 00),
 * xx: Bright Position, z: Exposure Comp Position
 */
export const CameraBlockInquiry = new ModuleDefinedInquiry([0x81, 0x09, 0x7e, 0x7e, 0x01, 0xff], {
	//       90   50   0p   0p   0q   0q   0r   0s   tt   0u   vv   ww   rr   xx   0z   FF
	bytes: [0x90, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff],
	params: {
		rGain: {
			nibbles: [5, 7],
		},
		bGain: {
			nibbles: [9, 11],
		},
		wbMode: {
			nibbles: [13],
			convert: (param: number): WhiteBalanceMode => {
				switch (param) {
					case 0x0:
						return 'automatic'
					case 0x1:
						return 'indoor'
					case 0x2:
						return 'outdoor'
					case 0x3:
						return 'onepush'
					case 0x5:
						return 'manual'
					default:
						return 'automatic'
				}
			},
		},
		aperture: {
			nibbles: [15],
		},
		aeMode: {
			nibbles: [16, 17],
			convert: (param: number): ExposureMode => {
				switch (param) {
					case 0x00:
						return 'full-auto'
					case 0x03:
						return 'manual'
					case 0x0a:
						return 'shutter-priority'
					case 0x0b:
						return 'iris-priority'
					case 0x0d:
						return 'bright-mode-manual'
					default:
						return 'full-auto'
				}
			},
		},
		backlightExpComp: {
			nibbles: [19],
		},
		shutterPosition: {
			nibbles: [20, 21],
			convert: (param: number): ShutterSetting => {
				switch (param) {
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
					case 0x04:
						return '1/100'
					case 0x03:
						return '1/90'
					case 0x02:
						return '1/60'
					case 0x01:
						return '1/30'
					default:
						return '1/100'
				}
			},
		},
		irisPosition: {
			nibbles: [22, 23],
			convert: (param: number): IrisSetting => {
				switch (param) {
					case 0x0c:
						return 'ƒ 1.8'
					case 0x0b:
						return 'ƒ 2.0'
					case 0x0a:
						return 'ƒ 2.4'
					case 0x09:
						return 'ƒ 2.8'
					case 0x08:
						return 'ƒ 3.4'
					case 0x07:
						return 'ƒ 4.0'
					case 0x06:
						return 'ƒ 4.8'
					case 0x05:
						return 'ƒ 5.6'
					case 0x04:
						return 'ƒ 6.8'
					case 0x03:
						return 'ƒ 8.0'
					case 0x02:
						return 'ƒ 9.6'
					case 0x01:
						return 'ƒ 11.0'
					case 0x00:
						return 'CLOSED'
					default:
						return 'ƒ 4.0'
				}
			},
		},
		gainPosition: {
			nibbles: [24, 25],
		},
		brightPosition: {
			nibbles: [26, 27],
		},
		expCompPosition: {
			nibbles: [29],
		},
	},
})
