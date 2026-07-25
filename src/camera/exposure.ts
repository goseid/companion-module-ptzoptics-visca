import type { Expect, IsNever } from 'type-testing'
import { ModuleDefinedCommand } from '../visca/command.js'
import { ModuleDefinedInquiry } from '../visca/inquiry.js'

export type ExposureMode =
	| 'full-auto'
	| 'manual'
	| 'shutter-priority'
	| 'iris-priority'
	// XXX This isn't in the latest API doc: remove?
	| 'bright-mode-manual'

export const ExposureModeInquiry = new ModuleDefinedInquiry([0x81, 0x09, 0x04, 0x39, 0xff], {
	bytes: [0x90, 0x50, 0x00, 0xff],
	params: {
		mode: {
			nibbles: [5],
			convert: (param: number): ExposureMode => {
				switch (param) {
					case 0x0:
						return 'full-auto'
					case 0x3:
						return 'manual'
					case 0xa:
						return 'shutter-priority'
					case 0xb:
						return 'iris-priority'
					case 0xd:
						return 'bright-mode-manual'
					default:
						return 'full-auto'
				}
			},
		},
	},
})

export const ExposureMode = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x39, 0x00, 0xff], {
	mode: {
		nibbles: [9],
		convert: (mode: ExposureMode): number => {
			switch (mode) {
				case 'full-auto':
					return 0x0
				case 'manual':
					return 0x3
				case 'shutter-priority':
					return 0xa
				case 'iris-priority':
					return 0xb
				case 'bright-mode-manual':
					return 0xd
				default: {
					type assert_ModeIsNever = Expect<IsNever<typeof mode>>
					return 0x0
				}
			}
		},
	},
})

export const IrisReset = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0b, 0x00, 0xff])
export const IrisUp = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0b, 0x02, 0xff])
export const IrisDown = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0b, 0x03, 0xff])

export type IrisSetting =
	| 'ƒ 1.8'
	| 'ƒ 2.0'
	| 'ƒ 2.4'
	| 'ƒ 2.8'
	| 'ƒ 3.4'
	| 'ƒ 4.0'
	| 'ƒ 4.8'
	| 'ƒ 5.6'
	| 'ƒ 6.8'
	| 'ƒ 8.0'
	| 'ƒ 9.6'
	| 'ƒ 11.0'
	| 'CLOSED'

export const IrisSet = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x4b, 0x00, 0x00, 0x00, 0x00, 0xff], {
	setting: {
		nibbles: [13, 15],
		convert: (setting: IrisSetting): number => {
			switch (setting) {
				case 'ƒ 1.8':
					return 0x0c
				case 'ƒ 2.0':
					return 0x0b
				case 'ƒ 2.4':
					return 0x0a
				case 'ƒ 2.8':
					return 0x09
				case 'ƒ 3.4':
					return 0x08
				// @ts-expect-error intentional fallthrough
				default:
					type assert_SettingIsNever = Expect<IsNever<typeof setting>>
				// reset to default for a bad setting
				// eslint-disable-next-line no-fallthrough
				case 'ƒ 4.0':
					return 0x07
				case 'ƒ 4.8':
					return 0x06
				case 'ƒ 5.6':
					return 0x05
				case 'ƒ 6.8':
					return 0x04
				case 'ƒ 8.0':
					return 0x03
				case 'ƒ 9.6':
					return 0x02
				case 'ƒ 11.0':
					return 0x01
				case 'CLOSED':
					return 0x00
			}
		},
	},
})

export const GainReset = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0c, 0x00, 0xff])
export const GainUp = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0c, 0x02, 0xff])
export const GainDown = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0c, 0x03, 0xff])

export const GainDirect = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x4c, 0x00, 0x00, 0x00, 0x00, 0xff], {
	gain: {
		nibbles: [13, 15],
	},
})

/** @public Kept for future use — verified to match CameraBlockInq gain value. */
export const GainPositionInquiry = new ModuleDefinedInquiry([0x81, 0x09, 0x04, 0x4c, 0xff], {
	bytes: [0x90, 0x50, 0x00, 0x00, 0x00, 0x00, 0xff],
	params: {
		position: {
			nibbles: [5, 7, 9, 11],
		},
	},
})

export const BacklightOn = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x33, 0x02, 0xff])
export const BacklightOff = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x33, 0x03, 0xff])

export const ExpCompOn = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x3e, 0x02, 0xff])
export const ExpCompOff = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x3e, 0x03, 0xff])
export const ExpCompReset = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0e, 0x00, 0xff])
export const ExpCompUp = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0e, 0x02, 0xff])
export const ExpCompDown = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0e, 0x03, 0xff])

export const ExpCompDirect = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x4e, 0x00, 0x00, 0x00, 0x00, 0xff], {
	position: {
		nibbles: [13, 15],
	},
})

export const BrightReset = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0d, 0x00, 0xff])
export const BrightUp = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0d, 0x02, 0xff])
export const BrightDown = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0d, 0x03, 0xff])

export const BrightDirect = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x4d, 0x00, 0x00, 0x00, 0x00, 0xff], {
	position: {
		nibbles: [13, 15],
	},
})

export const ShutterReset = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0a, 0x00, 0xff])
export const ShutterUp = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0a, 0x02, 0xff])
export const ShutterDown = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x0a, 0x03, 0xff])

export type ShutterSetting =
	| '1/1000000'
	| '1/6000'
	| '1/4000'
	| '1/3000'
	| '1/2000'
	| '1/1500'
	| '1/1000'
	| '1/725'
	| '1/500'
	| '1/350'
	| '1/250'
	| '1/180'
	| '1/125'
	| '1/100'
	| '1/90'
	| '1/60'
	| '1/30'

// XXX Some of these speeds (1/250 and 1/90-30) don't seem to be what G3 cameras
//     claim they are (1/200 and 1/60-50-30).  Maybe a G2/G3 difference?
export const ShutterSet = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x4a, 0x00, 0x00, 0x00, 0x00, 0xff], {
	setting: {
		nibbles: [13, 15],
		convert: (setting: ShutterSetting): number => {
			switch (setting) {
				case '1/1000000':
					return 0x11
				case '1/6000':
					return 0x10
				case '1/4000':
					return 0x0f
				case '1/3000':
					return 0x0e
				case '1/2000':
					return 0x0d
				case '1/1500':
					return 0x0c
				case '1/1000':
					return 0x0b
				case '1/725':
					return 0x0a
				case '1/500':
					return 0x09
				case '1/350':
					return 0x8
				case '1/250':
					return 0x7
				case '1/180':
					return 0x06
				case '1/125':
					return 0x05
				default:
				case '1/100':
					return 0x04
				case '1/90':
					return 0x03
				case '1/60':
					return 0x02
				case '1/30':
					return 0x01
			}
		},
	},
})
