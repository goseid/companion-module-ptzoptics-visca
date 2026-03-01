/**
 * Temporary trace logger for diagnosing VISCA traffic issues.
 *
 * Uses console.log to avoid Node permission restrictions on fs writes.
 * Every entry is timestamped so we can correlate sends, receives, and
 * queue operations to understand stalls and response mismatches.
 *
 * Remove this file once the issues are resolved.
 */

function timestamp(): string {
	return new Date().toISOString()
}

export function traceLog(tag: string, message: string): void {
	console.log(`VISCA-TRACE ${timestamp()} [${tag}] ${message}`)
}
