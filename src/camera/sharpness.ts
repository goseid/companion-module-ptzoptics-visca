import { ModuleDefinedCommand } from '../visca/command.js'
import { ModuleDefinedInquiry } from '../visca/inquiry.js'

export type SharpnessMode = 'auto' | 'manual'

export const SharpnessModeCommand = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x05, 0x00, 0xff], {
	mode: {
		nibbles: [9],
		convert: (mode: SharpnessMode): number => {
			switch (mode) {
				case 'auto':
					return 0x2
				default:
				case 'manual':
					return 0x3
			}
		},
	},
})

export const SharpnessReset = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x02, 0x00, 0xff])
export const SharpnessUp = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x02, 0x02, 0xff])
export const SharpnessDown = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x02, 0x03, 0xff])

export const SharpnessDirect = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x42, 0x00, 0x00, 0x00, 0x00, 0xff], {
	position: {
		nibbles: [13, 15],
	},
})

export const SharpnessModeInquiry = new ModuleDefinedInquiry([0x81, 0x09, 0x04, 0x05, 0xff], {
	bytes: [0x90, 0x50, 0x00, 0xff],
	params: {
		mode: {
			nibbles: [5],
			convert: (param: number): SharpnessMode => {
				switch (param) {
					case 0x2:
						return 'auto'
					case 0x3:
					default:
						return 'manual'
				}
			},
		},
	},
})
