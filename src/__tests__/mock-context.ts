import type { CompanionActionContext, CompanionVariableValue } from '@companion-module/base'

/**
 * A minimal `CompanionActionContext` for tests.
 *
 * In API 2.0 Companion resolves variables/expressions before invoking a
 * callback, so the module no longer parses variables itself.  Tests therefore
 * pass already-resolved option values, and this context needs only satisfy the
 * (now tiny) `CompanionActionContext` interface.
 */
export class MockContext implements CompanionActionContext {
	readonly type = 'action' as const

	setCustomVariableValue(_variableName: string, _value: CompanionVariableValue): void {
		// not used so not meaningfully implemented
	}
}
