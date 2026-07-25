import type { ExpressionOrValue, JsonValue } from '@companion-module/base'

/**
 * In API 2.0, action/feedback option values presented to upgrade (migration)
 * scripts are wrapped as `ExpressionOrValue` — `{ isExpression, value }` — so
 * that expression-mode fields survive migration.  These helpers read and write
 * those wrapped values in `CompanionMigrationAction`/`Feedback` `options`.
 */

/** The wrapped value type of a migration option in API 2.0. */
type MigrationOptionValue = ExpressionOrValue<JsonValue | undefined> | undefined

/** Unwrap a migration option to its stored (non-expression) value. */
export function migValue(opt: MigrationOptionValue): JsonValue | undefined {
	return opt?.value
}

/** Wrap a plain value as a non-expression migration option value. */
export function migOpt(value: JsonValue | undefined): ExpressionOrValue<JsonValue | undefined> {
	return { isExpression: false, value }
}
