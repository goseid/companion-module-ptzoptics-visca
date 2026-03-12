import { InstanceStatus } from '@companion-module/base'
import { describe, test } from 'vitest'
import { ACKCompletion } from '../visca/__tests__/camera-interactions/bytes.js'
import {
	CameraExpectIncomingBytes,
	CameraReplyBytes,
	CommandSucceeded,
	SendCommand,
} from '../visca/__tests__/camera-interactions/interactions.js'
import { RunCameraInteractionTest } from '../visca/__tests__/camera-interactions/run-test.js'
import {
	AutoWhiteBalanceSensitivity,
	BGainDirect,
	BGainDown,
	BGainReset,
	BGainUp,
	RGainDirect,
	RGainDown,
	RGainReset,
	RGainUp,
	WhiteBalance,
	WhiteBalanceOnePushTrigger,
} from './white-balance.js'

describe('WhiteBalance command encoding', () => {
	test('automatic sends nibble 0x0', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(WhiteBalance, { mode: 'automatic' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x35, 0x00, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('indoor sends nibble 0x1', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(WhiteBalance, { mode: 'indoor' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x35, 0x01, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('outdoor sends nibble 0x2', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(WhiteBalance, { mode: 'outdoor' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x35, 0x02, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('onepush sends nibble 0x3', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(WhiteBalance, { mode: 'onepush' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x35, 0x03, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('manual sends nibble 0x5', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(WhiteBalance, { mode: 'manual' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x35, 0x05, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('WhiteBalanceOnePushTrigger command', () => {
	test('sends correct bytes', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(WhiteBalanceOnePushTrigger, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x10, 0x05, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('AutoWhiteBalanceSensitivity command encoding', () => {
	test('high sends nibble 0x0', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(AutoWhiteBalanceSensitivity, { level: 'high' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0xa9, 0x00, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('normal sends nibble 0x1', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(AutoWhiteBalanceSensitivity, { level: 'normal' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0xa9, 0x01, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('low sends nibble 0x2', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(AutoWhiteBalanceSensitivity, { level: 'low' }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0xa9, 0x02, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('R Gain commands', () => {
	test('RGainReset sends 04 03 00', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(RGainReset, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x03, 0x00, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('RGainUp sends 04 03 02', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(RGainUp, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x03, 0x02, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('RGainDown sends 04 03 03', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(RGainDown, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x03, 0x03, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('RGainDirect encodes gain at nibbles [13,15]', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(RGainDirect, { gain: 0xe2 }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x43, 0x00, 0x00, 0x0e, 0x02, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('B Gain commands', () => {
	test('BGainReset sends 04 04 00', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(BGainReset, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x04, 0x00, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('BGainUp sends 04 04 02', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(BGainUp, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x04, 0x02, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('BGainDown sends 04 04 03', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(BGainDown, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x04, 0x03, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('BGainDirect encodes gain at nibbles [13,15]', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(BGainDirect, { gain: 0xbc }, 'cmd-1'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x04, 0x44, 0x00, 0x00, 0x0b, 0x0c, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})
})
