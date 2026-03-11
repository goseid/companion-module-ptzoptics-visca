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
import { MoveToAbsolutePanTilt, PanTiltPositionInquiry } from './pan-tilt.js'

describe('PanTiltPositionInquiry signed 16-bit conversion', () => {
	test('center position (0, 0)', async () => {
		return RunCameraInteractionTest(
			[
				SendInquiry(PanTiltPositionInquiry, 'pos-1'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x12, 0xff]),
				// Response: 90 50 0p 0p 0p 0p 0t 0t 0t 0t FF
				// pan=0x0000, tilt=0x0000
				CameraReplyBytes([0x90, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]),
				InquirySucceeded({ panPosition: 0, tiltPosition: 0 }, 'pos-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('positive positions', async () => {
		return RunCameraInteractionTest(
			[
				SendInquiry(PanTiltPositionInquiry, 'pos-1'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x12, 0xff]),
				// pan=0x0064 (100), tilt=0x0032 (50)
				CameraReplyBytes([0x90, 0x50, 0x00, 0x00, 0x06, 0x04, 0x00, 0x00, 0x03, 0x02, 0xff]),
				InquirySucceeded({ panPosition: 100, tiltPosition: 50 }, 'pos-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test("negative positions (two's complement)", async () => {
		return RunCameraInteractionTest(
			[
				SendInquiry(PanTiltPositionInquiry, 'pos-1'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x12, 0xff]),
				// pan=0xFF9C (-100), tilt=0xFFCE (-50)
				// 0xFF9C: nibbles F,F,9,C
				// 0xFFCE: nibbles F,F,C,E
				CameraReplyBytes([0x90, 0x50, 0x0f, 0x0f, 0x09, 0x0c, 0x0f, 0x0f, 0x0c, 0x0e, 0xff]),
				InquirySucceeded({ panPosition: -100, tiltPosition: -50 }, 'pos-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('boundary values', async () => {
		return RunCameraInteractionTest(
			[
				// 0x7FFF = 32767 (max positive)
				SendInquiry(PanTiltPositionInquiry, 'pos-max'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x12, 0xff]),
				CameraReplyBytes([0x90, 0x50, 0x07, 0x0f, 0x0f, 0x0f, 0x07, 0x0f, 0x0f, 0x0f, 0xff]),
				InquirySucceeded({ panPosition: 32767, tiltPosition: 32767 }, 'pos-max'),

				// 0x8000 = -32768 (min negative)
				SendInquiry(PanTiltPositionInquiry, 'pos-min'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x12, 0xff]),
				CameraReplyBytes([0x90, 0x50, 0x08, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0xff]),
				InquirySucceeded({ panPosition: -32768, tiltPosition: -32768 }, 'pos-min'),

				// 0xFFFF = -1
				SendInquiry(PanTiltPositionInquiry, 'pos-neg1'),
				CameraExpectIncomingBytes([0x81, 0x09, 0x06, 0x12, 0xff]),
				CameraReplyBytes([0x90, 0x50, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 0xff]),
				InquirySucceeded({ panPosition: -1, tiltPosition: -1 }, 'pos-neg1'),
			],
			InstanceStatus.Ok,
		)
	})
})

describe('MoveToAbsolutePanTilt command encoding', () => {
	test('center position with moderate speed', async () => {
		return RunCameraInteractionTest(
			[
				SendCommand(MoveToAbsolutePanTilt, { panSpeed: 12, tiltSpeed: 10, panPosition: 0, tiltPosition: 0 }, 'cmd-1'),
				// Template: 81 01 06 02 SS TT 0p 0p 0p 0p 0t 0t 0t 0t FF
				// Speed: pan=0x0C, tilt=0x0A
				// Pan: 0x0000, Tilt: 0x0000
				CameraExpectIncomingBytes([
					0x81, 0x01, 0x06, 0x02, 0x0c, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff,
				]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test('positive pan/tilt positions', async () => {
		return RunCameraInteractionTest(
			[
				// Pan=0x1234, Tilt=0x5678
				SendCommand(
					MoveToAbsolutePanTilt,
					{ panSpeed: 1, tiltSpeed: 1, panPosition: 0x1234, tiltPosition: 0x5678 },
					'cmd-1',
				),
				CameraExpectIncomingBytes([
					0x81, 0x01, 0x06, 0x02, 0x01, 0x01, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xff,
				]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-1'),
			],
			InstanceStatus.Ok,
		)
	})

	test("negative positions encode as unsigned 16-bit (two's complement)", async () => {
		return RunCameraInteractionTest(
			[
				// -100 = 0xFF9C, -50 = 0xFFCE
				// JavaScript: -100 & 0xFFFF = 0xFF9C, but the command parameter
				// system writes the numeric value's nibbles directly.
				// Negative numbers: nibbles of the 16-bit representation are
				// extracted by the parameter system.
				SendCommand(
					MoveToAbsolutePanTilt,
					{ panSpeed: 12, tiltSpeed: 10, panPosition: -100, tiltPosition: -50 },
					'cmd-neg',
				),
				// -100 = 0xFF9C → nibbles F,F,9,C → bytes 0F 0F 09 0C
				// -50  = 0xFFCE → nibbles F,F,C,E → bytes 0F 0F 0C 0E
				CameraExpectIncomingBytes([
					0x81, 0x01, 0x06, 0x02, 0x0c, 0x0a, 0x0f, 0x0f, 0x09, 0x0c, 0x0f, 0x0f, 0x0c, 0x0e, 0xff,
				]),
				CameraReplyBytes(ACKCompletion(1)),
				CommandSucceeded('cmd-neg'),
			],
			InstanceStatus.Ok,
		)
	})
})
