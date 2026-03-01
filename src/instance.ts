import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { getActions } from './actions/actions.js'
import { getFeedbacks } from './feedbacks.js'
import {
	canUpdateConfigWithoutRestarting,
	type RawConfig,
	getConfigFields,
	isValidHost,
	noCameraConfig,
	type PtzOpticsConfig,
	validateConfig,
} from './config.js'
import { getPresets } from './presets.js'
import { repr } from './utils/repr.js'
import { traceLog } from './utils/trace-log.js'
import { getVariableDefinitions, pollVariablesContinuously } from './variables.js'
import type { Command, CommandParameters, CommandParamValues, NoCommandParameters } from './visca/command.js'
import type { Answer, AnswerParameters, Inquiry } from './visca/inquiry.js'
import { VISCAPort } from './visca/port.js'

export class PtzOpticsInstance extends InstanceBase<RawConfig> {
	/** Configuration dictating the behavior of this instance. */
	#config: PtzOpticsConfig = noCameraConfig()

	/** Whether debug logging is enabled on this instance or not. */
	get debugLogging(): boolean {
		return this.#config.debugLogging
	}

	/** A port to use to communicate with the represented camera. */
	#visca = new VISCAPort(this)

	/** Abort controller for the continuous polling loop, or null if not polling. */
	#pollAbort: AbortController | null = null

	/** Watchdog timer that aborts and restarts the poll loop if it stalls. */
	#pollWatchdog: ReturnType<typeof setInterval> | null = null

	/** Timestamp of the last completed poll step, used by the watchdog. */
	#pollLastStepTime = 0

	/**
	 * Queue of operations (commands and action-triggered inquiries) to be
	 * processed by the poll loop.  New items are pushed to the front so that
	 * user-triggered commands execute as soon as possible, before the next
	 * background poll inquiry.
	 */
	#messageQueue: Array<() => Promise<void>> = []

	/**
	 * Enqueue a command to be sent by the poll loop.  The command will be
	 * sent before the next background poll inquiry.
	 */
	sendCommand<CmdParameters extends CommandParameters>(
		command: Command<CmdParameters>,
		...paramValues: CmdParameters extends NoCommandParameters
			? [CommandParamValues<CmdParameters>?]
			: [CommandParamValues<CmdParameters>]
	): void {
		traceLog('QUEUE', `enqueue command, queue length=${this.#messageQueue.length + 1}`)
		this.#messageQueue.push(async () => {
			try {
				const result = await this.#visca.sendCommand(command, ...paramValues)
				if (result instanceof Error) {
					this.log('error', `Error processing command: ${result.message}`)
				}
			} catch (reason: unknown) {
				const message = reason instanceof Error ? reason.message : String(reason)
				this.log('error', `Unhandled command rejection was suppressed: ${message}`)
			}
		})
	}

	/**
	 * Enqueue an inquiry to be sent by the poll loop.  The returned promise
	 * resolves when the inquiry has been sent and its response processed.
	 *
	 * This is used by action callbacks that need to read camera state before
	 * sending a follow-up command (e.g. focus toggle, gain increment).
	 */
	async sendInquiry<Parameters extends AnswerParameters>(
		inquiry: Inquiry<Parameters>,
	): Promise<Answer<Parameters> | null> {
		traceLog('QUEUE', `enqueue inquiry, queue length=${this.#messageQueue.length + 1}`)
		return new Promise<Answer<Parameters> | null>((resolve) => {
			this.#messageQueue.push(async () => {
				resolve(await this.sendPollInquiry(inquiry))
			})
		})
	}

	/**
	 * Send an inquiry directly to the VISCA port and return the result.
	 *
	 * This bypasses the message queue and is intended **only** for the poll
	 * loop's own background inquiries, which are already serialised by the
	 * loop itself.
	 */
	async sendPollInquiry<Parameters extends AnswerParameters>(
		inquiry: Inquiry<Parameters>,
	): Promise<Answer<Parameters> | null> {
		return this.#visca.sendInquiry(inquiry).then(
			(result: Answer<Parameters> | Error) => {
				if (result instanceof Error) {
					this.log('error', `Error processing inquiry: ${result.message}`)
					return null
				}

				return result
			},
			(reason: Error) => {
				// Swallow the error so that execution gracefully unwinds.
				this.log('error', `Unhandled inquiry rejection was suppressed: ${reason}`)
				return null
			},
		)
	}

	/** Whether there are queued messages waiting to be processed. */
	hasQueuedMessages(): boolean {
		return this.#messageQueue.length > 0
	}

	/** Process the next queued message.  Errors are logged internally. */
	async processNextQueuedMessage(): Promise<void> {
		const op = this.#messageQueue.shift()
		if (op !== undefined) {
			traceLog('QUEUE', `dequeue message, remaining=${this.#messageQueue.length}`)
			try {
				await op()
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : String(error)
				this.log('error', `Error processing queued message: ${message}`)
			}
		}
	}

	/**
	 * Flush stale pending messages from the VISCA port so the poll loop
	 * can recover from a timed-out inquiry.
	 */
	flushVISCAQueue(reason: string): void {
		this.#visca.flushPendingMessages(reason)
	}

	/**
	 * The speed to be passed in the pan/tilt speed parameters of Pan Tilt Drive
	 * VISCA commands.  Ranges between 0x01 (low speed) and 0x18 (high speed).
	 * However, as 0x15-0x18 are valid only for panning, tilt speed is capped at
	 * 0x14.
	 */
	#speed = 0x0c

	panTiltSpeed(): { panSpeed: number; tiltSpeed: number } {
		return {
			panSpeed: this.#speed,
			tiltSpeed: Math.min(this.#speed, 0x14),
		}
	}

	setPanTiltSpeed(speed: number): void {
		if (0x01 <= speed && speed <= 0x18) {
			this.#speed = speed
		} else {
			this.log('debug', `speed ${speed} unexpectedly not in range [0x01, 0x18]`)
			this.#speed = 0x0c
		}
	}

	increasePanTiltSpeed(): void {
		if (this.#speed < 0x18) this.#speed++
	}

	decreasePanTiltSpeed(): void {
		if (this.#speed > 0x01) this.#speed--
	}

	/**
	 * Maximum time a poll step may take before the watchdog considers the loop
	 * stalled and restarts it.
	 */
	static readonly #POLL_STALL_MS = 5_000

	#startPolling(): void {
		this.#stopPolling()
		this.#pollLastStepTime = Date.now()
		this.#launchPollLoop()
		this.#pollWatchdog = setInterval(() => {
			if (Date.now() - this.#pollLastStepTime > PtzOpticsInstance.#POLL_STALL_MS) {
				traceLog('WATCHDOG', `Poll loop stalled (${Date.now() - this.#pollLastStepTime}ms since last step), restarting`)
				this.log('warn', 'Poll loop stalled, restarting')
				// Abort the stuck loop, flush stale VISCA state, and launch
				// a fresh loop.  Flushing is critical: without it, stale
				// PendingInquiry entries from the old loop consume responses
				// meant for the new loop's inquiries, causing an infinite
				// stall cycle.
				this.#pollAbort?.abort()
				this.#visca.flushPendingMessages('Poll loop stalled, flushing stale messages')
				this.#pollLastStepTime = Date.now()
				this.#launchPollLoop()
			}
		}, PtzOpticsInstance.#POLL_STALL_MS)
	}

	#launchPollLoop(): void {
		const abort = new AbortController()
		this.#pollAbort = abort
		void pollVariablesContinuously(this, abort.signal, () => {
			this.#pollLastStepTime = Date.now()
		}).catch((reason: Error) => {
			this.log('error', `Variable polling error: ${reason.message}`)
		})
	}

	#stopPolling(): void {
		if (this.#pollWatchdog !== null) {
			clearInterval(this.#pollWatchdog)
			this.#pollWatchdog = null
		}
		if (this.#pollAbort !== null) {
			this.#pollAbort.abort()
			this.#pollAbort = null
		}
		this.#messageQueue.length = 0
	}

	override getConfigFields(): SomeCompanionConfigField[] {
		return getConfigFields()
	}

	override async destroy(): Promise<void> {
		this.log('info', `destroying module: ${this.id}`)
		this.#stopPolling()
		this.#visca.close('Instance is being destroyed', InstanceStatus.Disconnected)
	}

	override async init(config: RawConfig): Promise<void> {
		this.#logConfig(config, 'init()')

		this.setActionDefinitions(getActions(this))
		this.setFeedbackDefinitions(getFeedbacks(this))
		this.setPresetDefinitions(getPresets())
		this.setVariableDefinitions(getVariableDefinitions())

		return this.configUpdated(config)
	}

	override async configUpdated(config: RawConfig): Promise<void> {
		this.#logConfig(config, 'configUpdated()')

		const oldConfig = this.#config

		validateConfig(config)
		this.#config = config

		if (canUpdateConfigWithoutRestarting(oldConfig, config)) {
			return
		}

		if (!isValidHost(this.#config.host)) {
			this.#stopPolling()
			this.#visca.close('no host specified', InstanceStatus.Disconnected)
		} else {
			// Initiate the connection (closing any prior connection), but don't
			// delay to fully establish it as `await this.#visca.connect()`
			// would, because network vagaries might make this take a long time.
			this.#visca.open(this.#config.host, this.#config.port)
			this.#startPolling()
		}
	}

	/**
	 * Write a copy of the given module config information to logs.
	 *
	 * @param config
	 *   The config information to log.
	 * @param desc
	 *   A description of the event occasioning the logging.
	 */
	#logConfig(config: RawConfig, desc = 'logConfig()'): void {
		this.log('info', `PTZOptics module configuration on ${desc}: ${repr(config)}`)
	}
}
