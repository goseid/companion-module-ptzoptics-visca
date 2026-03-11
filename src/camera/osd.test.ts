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
import { OnScreenDisplayClose, OnScreenDisplayInquiry, OnScreenDisplayNavigate, OnScreenDisplayToggle } from './osd.js'

describe('OnScreenDisplayInquiry conversion', () => {
	test('returns open when nibble is 0x2', async () => {
		return RunCameraInteractionTest(
			[
				SendInquiry(OnScreenDisplayInquiry, 'osd-1'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x06, 0xff]),
				CameraReplyBytes([0x90, 0x50, 0x02, 0xff]),
				InquirySucceeded({ state: 'open' }, 'osd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('returns close when nibble is 0x3', async () => {
		return RunCameraInteractionTest(
			[
				SendInquiry(OnScreenDisplayInquiry, 'osd-1'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x06, 0xff]),
				CameraReplyBytes([0x90, 0x50, 0x03, 0xff]),
				InquirySucceeded({ state: 'close' }, 'osd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('defaults to close for unknown values', async () => {
		return RunCameraInteractionTest(
			[
				SendInquiry(OnScreenDisplayInquiry, 'osd-1'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x06, 0xff]),
				CameraReplyBytes([0x90, 0x50, 0x0f, 0xff]),
				InquirySucceeded({ state: 'close' }, 'osd-1'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('OSD navigate direction encoding', () => {
	test('up sends direction byte 0x31', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(OnScreenDisplayNavigate, { direction: 'up' }, 'nav-up'),
				// Template: 81 01 06 01 0E 0E DD DD FF
				// direction nibbles [13,15]: 0x31 → bytes 0x03, 0x01
				CameraExpectIncomingBytes([0x81, 0x01, 0x06, 0x01, 0x0e, 0x0e, 0x03, 0x01, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('nav-up'),
			],
			InstanceStatus.Ok,
		)
	})

	test('right sends direction byte 0x23', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(OnScreenDisplayNavigate, { direction: 'right' }, 'nav-right'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x06, 0x01, 0x0e, 0x0e, 0x02, 0x03, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('nav-right'),
			],
			InstanceStatus.Ok,
		)
	})

	test('down sends direction byte 0x32', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(OnScreenDisplayNavigate, { direction: 'down' }, 'nav-down'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x06, 0x01, 0x0e, 0x0e, 0x03, 0x02, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('nav-down'),
			],
			InstanceStatus.Ok,
		)
	})

	test('left sends direction byte 0x13', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(OnScreenDisplayNavigate, { direction: 'left' }, 'nav-left'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x06, 0x01, 0x0e, 0x0e, 0x01, 0x03, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('nav-left'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('OSD toggle and close commands', () => {
	test('toggle sends correct bytes', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(OnScreenDisplayToggle, 'toggle'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x06, 0x06, 0x10, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('toggle'),
			],
			InstanceStatus.Ok,
		)
	})

	test('close sends correct bytes', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(OnScreenDisplayClose, 'close'),
				CameraExpectIncomingBytes([0x81, 0x01, 0x06, 0x06, 0x03, 0xff]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('close'),
			],
			InstanceStatus.Ok,
		)
	})
})
