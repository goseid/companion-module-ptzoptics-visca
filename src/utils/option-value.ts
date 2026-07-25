import type { JsonValue } from '@companion-module/base'

/**
 * Safely stringify a Companion option value.
 *
 * In API 2.0 option values are typed as `JsonValue` (which includes objects and
 * arrays), so a bare `String(value)` trips `@typescript-eslint/no-base-to-string`.
 * Option values consumed as text/number inputs are primitives in practice; on the
 * off chance a value is an object it is JSON-encoded rather than rendered as the
 * useless `"[object Object]"`.
 */
export function optString(value: JsonValue | undefined): string {
	return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)
}
