import { InstanceStatus } from '@companion-module/base'
import { describe, test } from 'vitest'
import { ACKCompletion } from '../visca/__tests__/camera-interactions/bytes.js'
import {
	CameraExpectIncomingBytes,
	CameraReplyBytes,
	CommandSucceeded,
	InquirySucceeded,
	SendCommand,
	SendInquiry,
} from '../visca/__tests__/camera-interactions/interactions.js'
import { RunCameraInteractionTest } from '../visca/__tests__/camera-interactions/run-test.js'
import {
	ExposureMode,
	ExposureModeInquiry,
	type IrisSetting,
	IrisSet,
	type ShutterSetting,
	ShutterSet,
	GainDirect,
	ExpCompDirect,
	BrightDirect,
} from './exposure.js'

describe('ExposureMode command encoding', () => {
	test('full-auto sends nibble 0x0', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(ExposureMode, { mode: 'full-auto' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x39, 0x00, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('manual sends nibble 0x3', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(ExposureMode, { mode: 'manual' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x39, 0x03, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('shutter-priority sends nibble 0xA', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(ExposureMode, { mode: 'shutter-priority' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x39, 0x0a, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('iris-priority sends nibble 0xB', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(ExposureMode, { mode: 'iris-priority' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x39, 0x0b, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('bright-mode-manual sends nibble 0xD', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(ExposureMode, { mode: 'bright-mode-manual' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x39, 0x0d, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('ExposureModeInquiry conversion', () => {
	test('converts all mode nibbles', async () => {
		const modeTests: Array<[number, string]> = [
			[0x0, 'full-auto'],
			[0x3, 'manual'],
			[0xa, 'shutter-priority'],
			[0xb, 'iris-priority'],
			[0xd, 'bright-mode-manual'],
			[0xf, 'full-auto'], // unknown defaults to full-auto
		]

		const interactions = []
		for (let i = 0; i < modeTests.length; i++) {
			const [nibble, expected] = modeTests[i]
			const id = `mode-${i}`
			interactions.push(
				SendInquiry(ExposureModeInquiry, id),
				CameraExpectIncomingBytes([0x81, 0x09, 0x04, 0x39, 0xff]),
				CameraReplyBytes([0x90, 0x50, nibble, 0xff]),
				InquirySucceeded({ mode: expected }, id),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})
})

describe('IrisSet command encoding', () => {
	test('encodes verified iris hex values', async () => {
		const irisTests: Array<[IrisSetting, number, number]> = [
			// [setting, expected nibble high, expected nibble low]
			['CLOSED', 0x00, 0x00],
			['ƒ 11.0', 0x00, 0x01],
			['ƒ 9.6', 0x00, 0x02],
			['ƒ 4.0', 0x00, 0x07],
			['ƒ 1.8', 0x00, 0x0c],
		]

		const interactions = []
		for (let i = 0; i < irisTests.length; i++) {
			const [setting, hiNib, loNib] = irisTests[i]
			const id = `iris-${i}`
			interactions.push(
				SendCommand(IrisSet, { setting }, id),
				// Template: 81 01 04 4B 00 00 0p 0q FF (nibbles [13,15])
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x4b, 0x00, 0x00, hiNib, loNib, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded(id),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})
})

describe('ShutterSet command encoding', () => {
	test('encodes shutter speed values', async () => {
		const shutterTests: Array<[ShutterSetting, number, number]> = [
			['1/30', 0x00, 0x01],
			['1/100', 0x00, 0x04],
			['1/1000', 0x00, 0x0b],
			['1/1000000', 0x01, 0x01],
		]

		const interactions = []
		for (let i = 0; i < shutterTests.length; i++) {
			const [setting, hiNib, loNib] = shutterTests[i]
			const id = `shutter-${i}`
			interactions.push(
				SendCommand(ShutterSet, { setting }, id),
				// Template: 81 01 04 4A 00 00 0p 0q FF (nibbles [13,15])
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x4a, 0x00, 0x00, hiNib, loNib, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded(id),
			)
		}

		return RunCameraInteractionTest(interactions, InstanceStatus.Ok)
	})
})

describe('direct value commands', () => {
	test('GainDirect encodes gain value at nibbles [13,15]', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(GainDirect, { gain: 0x0f }, 'gain-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x4c, 0x00, 0x00, 0x00, 0x0f, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('gain-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('ExpCompDirect encodes position at nibbles [13,15]', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(ExpCompDirect, { position: 0x0a }, 'exp-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x4e, 0x00, 0x00, 0x00, 0x0a, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('exp-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('BrightDirect encodes position at nibbles [13,15]', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(BrightDirect, { position: 0x07 }, 'bright-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x4d, 0x00, 0x00, 0x00, 0x07, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('bright-1'),
			],
			InstanceStatus.Ok,
		)
	})
})
