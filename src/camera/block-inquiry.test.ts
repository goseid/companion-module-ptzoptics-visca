import { InstanceStatus } from '@companion-module/base'
import { describe, test } from 'vitest'
import {
	CameraExpectIncomingBytes,
	CameraReplyBytes,
	InquirySucceeded,
	SendInquiry,
} from '../visca/__tests__/camera-interactions/interactions.js'
import { RunCameraInteractionTest } from '../visca/__tests__/camera-interactions/run-test.js'
import { CameraBlockInquiry } from './block-inquiry.js'

const CameraBlockInquiryBytes = [0x81, 0x09, 0x7e, 0x7e, 0x01, 0xff]

describe('CameraBlockInquiry response parsing', () => {
	test('parses all parameters from a typical response', async () => {
		// Response: 90 50 0p 0p 0q 0q 0r 0s tt 0u vv ww rr xx 0z FF
		// pp=0x0080 (R Gain=128), qq=0x0060 (B Gain=96), r=0 (WB=automatic),
		// s=5 (sharpness), tt=0x03 (AE=manual), u=0x0 (no backlight, no expcomp),
		// vv=0x04 (shutter=1/100), ww=0x07 (iris=ƒ 4.0), rr=0x05 (gain),
		// xx=0x07 (bright), z=3 (expcomp)
		return RunCameraInteractionTest(
			[
				SendInquiry(CameraBlockInquiry, 'block-1'),
				CameraExpectIncomingBytes(CameraBlockInquiryBytes),
				CameraReplyBytes([
					0x90, 0x50, 0x00, 0x08, 0x00, 0x06, 0x00, 0x05, 0x03, 0x00, 0x04, 0x07, 0x05, 0x07, 0x03, 0xff,
				]),
				InquirySucceeded(
					{
						rGain: 0x08,
						bGain: 0x06,
						wbMode: 'automatic',
						sharpness: 5,
						aeMode: 'manual',
						backlightExpComp: 0,
						shutterPosition: '1/100',
						irisPosition: 'ƒ 4.0',
						gainPosition: 0x05,
						brightPosition: 0x07,
						expCompPosition: -4,
					},
					'block-1',
				),
			],
			InstanceStatus.Ok,
		)
	})

	test('converts all WB modes correctly', async () => {
		// Test each WB mode value: 0=automatic, 1=indoor, 2=outdoor, 3=onepush, 5=manual
		// We only vary the WB nibble (nibble 13, byte index 6 low nibble)
		const wbTests: Array<[number, string]> = [
			[0x00, 'automatic'],
			[0x01, 'indoor'],
			[0x02, 'outdoor'],
			[0x03, 'onepush'],
			[0x05, 'manual'],
			[0x0f, 'automatic'], // unknown defaults to automatic
		]

		const interactions = []
		for (let i = 0; i < wbTests.length; i++) {
			const [wbNibble, expected] = wbTests[i]
			const id = `wb-${i}`
			interactions.push(
				SendInquiry(CameraBlockInquiry, id),
				CameraExpectIncomingBytes(CameraBlockInquiryBytes),
				CameraReplyBytes([
					0x90,
					0x50,
					0x00,
					0x00,
					0x00,
					0x00,
					wbNibble,
					0x00,
					0x00,
					0x00,
					0x04,
					0x07,
					0x00,
					0x00,
					0x00,
					0xff,
				]),
				InquirySucceeded(
					{
						rGain: 0,
						bGain: 0,
						wbMode: expected,
						sharpness: 0,
						aeMode: 'full-auto',
						backlightExpComp: 0,
						shutterPosition: '1/100',
						irisPosition: 'ƒ 4.0',
						gainPosition: 0,
						brightPosition: 0,
						expCompPosition: -7,
					},
					id,
				),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})

	test('converts all AE modes correctly', async () => {
		// AE mode is at nibbles [16,17] — byte index 8 (both nibbles)
		// 0x00=full-auto, 0x03=manual, 0x0a=shutter-priority,
		// 0x0b=iris-priority, 0x0d=bright-mode-manual
		const aeTests: Array<[number, string]> = [
			[0x00, 'full-auto'],
			[0x03, 'manual'],
			[0x0a, 'shutter-priority'],
			[0x0b, 'iris-priority'],
			[0x0d, 'bright-mode-manual'],
			[0x0e, 'full-auto'], // unknown defaults to full-auto
		]

		const interactions = []
		for (let i = 0; i < aeTests.length; i++) {
			const [aeByte, expected] = aeTests[i]
			const id = `ae-${i}`
			interactions.push(
				SendInquiry(CameraBlockInquiry, id),
				CameraExpectIncomingBytes(CameraBlockInquiryBytes),
				CameraReplyBytes([
					0x90,
					0x50,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					aeByte,
					0x00,
					0x04,
					0x07,
					0x00,
					0x00,
					0x00,
					0xff,
				]),
				InquirySucceeded(
					{
						rGain: 0,
						bGain: 0,
						wbMode: 'automatic',
						sharpness: 0,
						aeMode: expected,
						backlightExpComp: 0,
						shutterPosition: '1/100',
						irisPosition: 'ƒ 4.0',
						gainPosition: 0,
						brightPosition: 0,
						expCompPosition: -7,
					},
					id,
				),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})

	test('converts all shutter positions correctly', async () => {
		// Shutter position at nibbles [20,21] — byte index 10 (both nibbles)
		const shutterTests: Array<[number, string]> = [
			[0x01, '1/30'],
			[0x02, '1/60'],
			[0x03, '1/90'],
			[0x04, '1/100'],
			[0x05, '1/125'],
			[0x06, '1/180'],
			[0x07, '1/250'],
			[0x08, '1/350'],
			[0x09, '1/500'],
			[0x0a, '1/725'],
			[0x0b, '1/1000'],
			[0x0c, '1/1500'],
			[0x0d, '1/2000'],
			[0x0e, '1/3000'],
			[0x0f, '1/4000'],
			[0x10, '1/6000'],
			[0x11, '1/1000000'],
			[0x00, '1/100'], // 0x00 defaults to 1/100
			[0x12, '1/100'], // out of range defaults to 1/100
		]

		const interactions = []
		for (let i = 0; i < shutterTests.length; i++) {
			const [shutterByte, expected] = shutterTests[i]
			const id = `shutter-${i}`
			interactions.push(
				SendInquiry(CameraBlockInquiry, id),
				CameraExpectIncomingBytes(CameraBlockInquiryBytes),
				CameraReplyBytes([
					0x90,
					0x50,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					shutterByte,
					0x07,
					0x00,
					0x00,
					0x00,
					0xff,
				]),
				InquirySucceeded(
					{
						rGain: 0,
						bGain: 0,
						wbMode: 'automatic',
						sharpness: 0,
						aeMode: 'full-auto',
						backlightExpComp: 0,
						shutterPosition: expected,
						irisPosition: 'ƒ 4.0',
						gainPosition: 0,
						brightPosition: 0,
						expCompPosition: -7,
					},
					id,
				),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})

	test('converts all iris positions correctly', async () => {
		// Iris position at nibbles [22,23] — byte index 11 (both nibbles)
		const irisTests: Array<[number, string]> = [
			[0x00, 'CLOSED'],
			[0x01, 'ƒ 11.0'],
			[0x02, 'ƒ 9.6'],
			[0x03, 'ƒ 8.0'],
			[0x04, 'ƒ 6.8'],
			[0x05, 'ƒ 5.6'],
			[0x06, 'ƒ 4.8'],
			[0x07, 'ƒ 4.0'],
			[0x08, 'ƒ 3.4'],
			[0x09, 'ƒ 2.8'],
			[0x0a, 'ƒ 2.4'],
			[0x0b, 'ƒ 2.0'],
			[0x0c, 'ƒ 1.8'],
			[0x0d, 'ƒ 4.0'], // out of range defaults to ƒ 4.0
		]

		const interactions = []
		for (let i = 0; i < irisTests.length; i++) {
			const [irisByte, expected] = irisTests[i]
			const id = `iris-${i}`
			interactions.push(
				SendInquiry(CameraBlockInquiry, id),
				CameraExpectIncomingBytes(CameraBlockInquiryBytes),
				CameraReplyBytes([
					0x90,
					0x50,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x04,
					irisByte,
					0x00,
					0x00,
					0x00,
					0xff,
				]),
				InquirySucceeded(
					{
						rGain: 0,
						bGain: 0,
						wbMode: 'automatic',
						sharpness: 0,
						aeMode: 'full-auto',
						backlightExpComp: 0,
						shutterPosition: '1/100',
						irisPosition: expected,
						gainPosition: 0,
						brightPosition: 0,
						expCompPosition: -7,
					},
					id,
				),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})

	test('parses backlight and exposure comp bit fields', async () => {
		// backlightExpComp is nibble [19] — byte 9 low nibble
		// bit 2 (0x4) = backlight, bit 1 (0x2) = exposure comp
		const bitTests: Array<[number, number]> = [
			[0x00, 0x0], // neither
			[0x02, 0x2], // exposure comp only
			[0x04, 0x4], // backlight only
			[0x06, 0x6], // both
		]

		const interactions = []
		for (let i = 0; i < bitTests.length; i++) {
			const [nibbleVal, expectedVal] = bitTests[i]
			const id = `bits-${i}`
			interactions.push(
				SendInquiry(CameraBlockInquiry, id),
				CameraExpectIncomingBytes(CameraBlockInquiryBytes),
				CameraReplyBytes([
					0x90,
					0x50,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					0x00,
					nibbleVal,
					0x04,
					0x07,
					0x00,
					0x00,
					0x00,
					0xff,
				]),
				InquirySucceeded(
					{
						rGain: 0,
						bGain: 0,
						wbMode: 'automatic',
						sharpness: 0,
						aeMode: 'full-auto',
						backlightExpComp: expectedVal,
						shutterPosition: '1/100',
						irisPosition: 'ƒ 4.0',
						gainPosition: 0,
						brightPosition: 0,
						expCompPosition: -7,
					},
					id,
				),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})

	test('parses R/B gain across nibble boundaries', async () => {
		// rGain at nibbles [5,7]: byte 2 low nibble + byte 3 low nibble
		// bGain at nibbles [9,11]: byte 4 low nibble + byte 5 low nibble
		// E.g. response bytes [0x90, 0x50, 0x0A, 0x0B, 0x0C, 0x0D, ...]
		//   rGain = (0xA << 4) | 0xB = 0xAB
		//   bGain = (0xC << 4) | 0xD = 0xCD
		return RunCameraInteractionTest(
			[
				SendInquiry(CameraBlockInquiry, 'gain-1'),
				CameraExpectIncomingBytes(CameraBlockInquiryBytes),
				CameraReplyBytes([
					0x90, 0x50, 0x0a, 0x0b, 0x0c, 0x0d, 0x00, 0x00, 0x00, 0x00, 0x04, 0x07, 0x00, 0x00, 0x00, 0xff,
				]),
				InquirySucceeded(
					{
						rGain: 0xab,
						bGain: 0xcd,
						wbMode: 'automatic',
						sharpness: 0,
						aeMode: 'full-auto',
						backlightExpComp: 0,
						shutterPosition: '1/100',
						irisPosition: 'ƒ 4.0',
						gainPosition: 0,
						brightPosition: 0,
						expCompPosition: -7,
					},
					'gain-1',
				),
			],
			InstanceStatus.Ok,
		)
	})
})
