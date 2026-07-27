/**
 * Shared helper for smooth, velocity-free rotary (encoder) position control.
 *
 * A rotary tick fires one action with no speed info, and reading the polled
 * position each tick undershoots on a fast spin (the poll lags).  This helper
 * accumulates against an internal target instead, resyncing to the real position
 * after an idle gap, and coalesces the actual device commands with a throttle so
 * a fast spin doesn't back up the message queue.  Step size is unchanged per tick
 * (no velocity) — only correctness at speed and send smoothness improve.
 */

/**
 * Idle time (ms) after which an axis resyncs its optimistic target to the real
 * position, so rotary moves don't fight movements made by other controls.  Must
 * exceed the poll refresh so the read-back is fresh after a pause.
 */
export const ROTARY_RESYNC_MS = 400

/**
 * Coalescing window (ms): ticks within this window of the last send only update
 * the accumulated target, then one command moves to the total (4 quick clicks →
 * one move to current+4, not 4 separate moves).  A leading-edge send keeps the
 * first click immediate; a trailing send lands the final target.  The Stream Deck
 * encoder caps at ~50ms/tick, so 150ms folds ~3 ticks per fast-spin send while
 * deliberate single clicks (>=~600ms apart, measured) always send individually.
 */
export const ROTARY_THROTTLE_MS = 150

interface RotaryAccumulatorConfig {
	/** Lower bound for the target (inclusive). */
	min: number
	/** Upper bound for the target (inclusive). */
	max: number
	/** Read the current device position — used to reseed after an idle gap. */
	getCurrent: () => number
	/** Send a move to the given target position. */
	sendTarget: (target: number) => void
	/** Register a cleanup to clear the pending trailing timer on destroy(). */
	registerCleanup: (fn: () => void) => void
}

/**
 * Create a single-axis rotary step function.  Call the returned function with a
 * signed per-tick delta; it accumulates against an internal target, resyncs to
 * the real position when idle, and throttles the actual sends.
 */
export function createRotaryAccumulator(cfg: RotaryAccumulatorConfig): (delta: number) => void {
	let target = 0
	let lastTick = 0
	let lastSend = 0
	let pending: ReturnType<typeof setTimeout> | null = null

	function send(): void {
		lastSend = Date.now()
		pending = null
		cfg.sendTarget(target)
	}

	// At most one send per ROTARY_THROTTLE_MS: fire immediately on the leading
	// edge, otherwise arm a trailing send so the final accumulated target lands.
	function schedule(): void {
		const elapsed = Date.now() - lastSend
		if (elapsed >= ROTARY_THROTTLE_MS) {
			if (pending !== null) {
				clearTimeout(pending)
				pending = null
			}
			send()
		} else if (pending === null) {
			pending = setTimeout(send, ROTARY_THROTTLE_MS - elapsed)
		}
	}

	cfg.registerCleanup(() => {
		if (pending !== null) {
			clearTimeout(pending)
			pending = null
		}
	})

	return (delta: number): void => {
		const now = Date.now()
		// Resync to the real position when the encoder has been idle.
		if (now - lastTick > ROTARY_RESYNC_MS) {
			target = cfg.getCurrent()
		}
		lastTick = now
		target = Math.min(Math.max(target + delta, cfg.min), cfg.max)
		schedule()
	}
}
