import { ModuleDefinedCommand } from '../visca/command.js'

/**
 * Set the 2D noise reduction level.
 *
 * `81 01 04 53 0p FF`
 * p: 0=Off, 1=Weak through 5=Strong
 *
 * Not in official PTZOptics documentation. Verified working on G2 cameras.
 */
export const NR2DLevel = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x53, 0x00, 0xff], {
	level: {
		nibbles: [9],
	},
})

/**
 * Set the 3D noise reduction level.
 *
 * `81 01 04 54 0p FF`
 * p: 0=Off, 1 through 5
 *
 * The camera OSD allows values up to 8, but this VISCA command clamps at 5.
 * Not in official PTZOptics documentation. Verified working on G2 cameras.
 */
export const NR3DLevel = new ModuleDefinedCommand([0x81, 0x01, 0x04, 0x54, 0x00, 0xff], {
	level: {
		nibbles: [9],
	},
})
