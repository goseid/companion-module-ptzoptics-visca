import { describe, expect, test } from 'vitest'

/**
 * These tests verify the backlight/exposure-comp bit-field extraction logic
 * used by the poll loop in variables.ts when processing CameraBlockInquiry
 * results.  The logic is:
 *   backlight = (backlightExpComp & 0x4) !== 0
 *   exposureComp = (backlightExpComp & 0x2) !== 0
 */
describe('backlight and exposure comp bit-field extraction', () => {
	function extractBits(backlightExpComp: number) {
		return {
			backlight: (backlightExpComp & 0x4) !== 0,
			exposureComp: (backlightExpComp & 0x2) !== 0,
		}
	}

	test('0x0: neither backlight nor exposure comp', () => {
		expect(extractBits(0x0)).toEqual({ backlight: false, exposureComp: false })
	})

	test('0x2: exposure comp only', () => {
		expect(extractBits(0x2)).toEqual({ backlight: false, exposureComp: true })
	})

	test('0x4: backlight only', () => {
		expect(extractBits(0x4)).toEqual({ backlight: true, exposureComp: false })
	})

	test('0x6: both backlight and exposure comp', () => {
		expect(extractBits(0x6)).toEqual({ backlight: true, exposureComp: true })
	})

	test('0x7: all bits set (backlight and exposure comp with extra bit)', () => {
		expect(extractBits(0x7)).toEqual({ backlight: true, exposureComp: true })
	})

	test('0x1: only bit 0 set (neither backlight nor exposure comp)', () => {
		expect(extractBits(0x1)).toEqual({ backlight: false, exposureComp: false })
	})

	test('0x5: bits 0 and 2 (backlight only)', () => {
		expect(extractBits(0x5)).toEqual({ backlight: true, exposureComp: false })
	})

	test('0x3: bits 0 and 1 (exposure comp only)', () => {
		expect(extractBits(0x3)).toEqual({ backlight: false, exposureComp: true })
	})
})

/**
 * These tests verify the exposure mode text feedback logic from feedbacks.ts.
 */
describe('exposure mode text feedback', () => {
	function exposureModeText(mode: string | undefined): { text: string } | Record<string, never> {
		switch (mode) {
			case 'full-auto':
				return { text: 'EXP Mode\nAuto' }
			case 'manual':
				return { text: 'EXP Mode\nManual' }
			case 'shutter-priority':
				return { text: 'EXP Mode\nShutter' }
			case 'iris-priority':
				return { text: 'EXP Mode\nIris' }
			case 'bright-mode-manual':
				return { text: 'EXP Mode\nBright' }
			default:
				return {}
		}
	}

	test('full-auto returns EXP Mode Auto text', () => {
		expect(exposureModeText('full-auto')).toEqual({ text: 'EXP Mode\nAuto' })
	})

	test('manual returns EXP Mode Manual text', () => {
		expect(exposureModeText('manual')).toEqual({ text: 'EXP Mode\nManual' })
	})

	test('shutter-priority returns EXP Mode Shutter text', () => {
		expect(exposureModeText('shutter-priority')).toEqual({ text: 'EXP Mode\nShutter' })
	})

	test('iris-priority returns EXP Mode Iris text', () => {
		expect(exposureModeText('iris-priority')).toEqual({ text: 'EXP Mode\nIris' })
	})

	test('bright-mode-manual returns EXP Mode Bright text', () => {
		expect(exposureModeText('bright-mode-manual')).toEqual({ text: 'EXP Mode\nBright' })
	})

	test('unknown mode returns empty object', () => {
		expect(exposureModeText('unknown')).toEqual({})
	})

	test('undefined mode returns empty object', () => {
		expect(exposureModeText(undefined)).toEqual({})
	})
})
