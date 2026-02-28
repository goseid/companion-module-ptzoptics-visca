# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Bitfocus Companion module that controls PTZOptics cameras (and compatible) via Sony VISCA protocol over TCP/IP. It integrates with the Companion application framework to provide camera control actions, inquiries, and button presets.

## Commands

```bash
yarn install          # Install dependencies (Yarn 4.12.0 via Corepack)
yarn build            # Clean dist/ and compile TypeScript
yarn dev              # Watch mode compilation
yarn test             # Run Vitest test suite
yarn test --run <pattern>  # Run a single test file by name pattern
yarn lint             # ESLint check
yarn lint --fix       # ESLint with auto-fix
yarn check-types      # TypeScript type checking only
yarn knip             # Detect unused code/dependencies
yarn bt               # Full pipeline: install, types, lint, knip, build, test
yarn check            # Full check without install: types, lint, knip, build
yarn package          # Build and package for Companion distribution
```

Requires Node.js ^22.11.

## Architecture

### Layer Separation

The codebase has three distinct layers with a strict dependency direction:

1. **Actions** (`src/actions/`) — Companion UI integration. Each file exports a factory function that takes a `PtzOpticsInstance` and returns `ActionDefinitions`. Actions handle user input (options, variables) and delegate to camera commands.

2. **Camera** (`src/camera/`) — VISCA command/inquiry definitions as reusable objects. Each file defines `ModuleDefinedCommand` and `ModuleDefinedInquiry` instances with byte templates and parameter nibble mappings. No UI concerns.

3. **VISCA** (`src/visca/`) — Low-level protocol layer. `VISCAPort` manages TCP connection, message queuing, and response parsing. `Command` and `Inquiry` classes define the parameter encoding system using nibble offsets.

### Key Types and Patterns

- **Branded types** (`src/utils/brand.ts`): Used for compile-time safety. E.g., `Host = Branded<string, 'config-host-valid-ip'>` ensures only validated IPs are used where a `Host` is expected.

- **VISCA parameter system**: Commands define parameters as nibble offsets into byte arrays with optional conversion functions. E.g., `{ panSpeed: { nibbles: [8, 9] } }` means the pan speed value occupies nibbles at positions 8 and 9 in the message template.

- **`RawConfig` vs `PtzOpticsConfig`**: Config is received loosely-typed from Companion (`RawConfig`), then defensively validated into the strict `PtzOpticsConfig` type via `validateConfig()`.

- **Module-defined vs user-defined commands**: Module-defined commands (`ModuleDefinedCommand`) are built-in with typed parameters. User-defined commands (`UserDefinedCommand`) are parsed from hex strings entered by users. Error handling differs: user-defined command errors are non-fatal.

### Variables and Feedbacks

- **Variables** (`src/variables.ts`): Camera state is polled every 5 seconds via VISCA inquiries and exposed as Companion variables (`pan_position`, `tilt_position`, `focus_mode`, `exposure_mode`, `osd_state`). After each poll, `checkFeedbacks()` is called to re-evaluate feedback state.

- **Feedbacks** (`src/feedbacks.ts`): Boolean feedbacks check variable state and apply styles (e.g., Focus Mode: Auto). Advanced feedbacks return dynamic text (e.g., Exposure Mode Text). When referencing boolean feedbacks in presets, the `style` property must be specified inline on the preset feedback — `defaultStyle` on the definition only applies when users manually add a feedback.

### Instance Lifecycle

`PtzOpticsInstance` (extends `InstanceBase<RawConfig>`) implements three Companion lifecycle methods:

- `init()` — Registers actions, feedbacks, presets, and variables; opens VISCA connection
- `configUpdated()` — Validates new config, reconnects and restarts polling if needed
- `destroy()` — Stops polling, closes connection

### Upgrade System

`src/upgrades.ts` contains ordered migration scripts (using `ActionUpdater`/`ConfigUpdater` helpers) that transform saved configs and actions when the module version changes. These run automatically via Companion.

## Lint & Style Rules

- Strict boolean expressions enforced (`@typescript-eslint/strict-boolean-expressions`)
- `eqeqeq` required (no `==`/`!=`)
- `object-shorthand` and `no-useless-rename` enforced
- Inline type imports required: `import { type Foo }` not `import type { Foo }`
- Unused vars must start with `_` (or `assert_` for type-testing variables)
- Pre-commit hooks run Prettier on non-code files and ESLint --fix on TS/JS

## Testing

Tests use Vitest with `describe`/`test` syntax. Test files live alongside source as `*.test.ts`. A mock `CompanionActionContext` helper is in `src/__tests__/mock-context.ts`.
