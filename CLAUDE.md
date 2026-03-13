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

### Polling and Message Queue

- **Continuous polling** (`src/variables.ts`): Camera state is polled continuously with 20ms delays between inquiries (not interval-based). Each poll step sends one inquiry, updates variables, and checks feedbacks. A 2-second per-step timeout prevents stalls from unresponsive cameras.

- **Block inquiries** (`src/camera/block-inquiry.ts`): Where possible, block inquiries (e.g., `CAM_CameraBlockInq`) are used instead of individual inquiries to reduce the number of poll steps. The CameraBlockInq returns R/B gain, WB mode, sharpness, AE mode, backlight, exposure comp, shutter/iris/bright/gain positions in a single 16-byte response.

- **Serialized message queue** (`src/instance.ts`): All VISCA traffic flows through a single poll loop. User-triggered commands are enqueued and drained between poll steps. `sendPollInquiry()` is for the poll loop (bypasses queue); `sendInquiry()` is for actions (goes through queue).

- **Watchdog** (`src/instance.ts`): A 5-second watchdog detects stalled poll loops. On stall, it aborts the loop, flushes stale pending VISCA messages, and launches a fresh loop.

### Variables and Feedbacks

- **Variables** (`src/variables.ts`): Camera state is polled via VISCA inquiries and exposed as Companion variables. The poll loop cycles through: pan/tilt position, focus mode, OSD state, sharpness mode, and CameraBlockInq (which provides exposure mode, WB mode, R/B gain, sharpness, shutter/iris/bright/gain positions, backlight, exposure comp). Pan/tilt positions are signed 16-bit integers (center=0, negative=left/down, positive=right/up). Iris and shutter position variables are converted to user-friendly labels (e.g., `ƒ 2.0`, `1/100`) via convert functions on the block inquiry parameters.

- **Feedbacks** (`src/feedbacks.ts`): Boolean feedbacks check variable state and apply styles (e.g., Focus Mode, Exposure Mode, WB Mode, Sharpness Mode, Iris Position, Shutter Position, Bright Position, Gain Position, Pan/Tilt Position). Selectable feedbacks use a dropdown option for the mode/position value rather than separate feedbacks per value. Advanced feedbacks return dynamic text (e.g., Exposure Mode Text). When referencing boolean feedbacks in presets, the `style` property must be specified inline on the preset feedback — `defaultStyle` on the definition only applies when users manually add a feedback. Numeric variable comparisons require `Number()` conversion because `getVariableValue()` always returns strings.

### Presets and Assets

- **Presets** (`src/presets.ts`): Button presets provide pre-configured buttons for Companion's UI. Rotary action presets (those with `options: { rotaryActions: true }`) support encoder rotation for incremental adjustments and use a shared `IMAGE_ROTARY_BG` background image.

- **Assets** (`src/assets/assets.ts`): Base64-encoded PNG images used in preset button styles. Includes directional arrows (`IMAGE_UP`, `IMAGE_DOWN`, etc.) and the rotary encoder background (`IMAGE_ROTARY_BG`).

### Instance Lifecycle

`PtzOpticsInstance` (extends `InstanceBase<RawConfig>`) implements three Companion lifecycle methods:

- `init()` — Registers actions, feedbacks, presets, and variables; opens VISCA connection
- `configUpdated()` — Validates new config, reconnects and restarts polling if needed
- `destroy()` — Stops polling, closes connection

### VISCA Command Byte Patterns

Commands and inquiries follow consistent byte patterns for related camera properties:

| Property       | Up/Down | Direct  | Inquiry |
| -------------- | ------- | ------- | ------- |
| Sharpness      | `04 02` | `04 42` | `04 42` |
| R Gain         | `04 03` | `04 43` | —       |
| B Gain         | `04 04` | `04 44` | —       |
| Sharpness Mode | —       | `04 05` | `04 05` |
| Shutter        | `04 0A` | `04 4A` | `04 4A` |
| Iris           | `04 0B` | `04 4B` | `04 4B` |
| Gain           | `04 0C` | `04 4C` | —       |
| Bright         | `04 0D` | `04 4D` | `04 4D` |
| Exp Comp       | `04 0E` | `04 4E` | `04 4E` |

Up = `XX 02 FF`, Down = `XX 03 FF`, Reset = `XX 00 FF`. Direct commands use `XX 00 00 0p 0q FF` with position in nibbles [13, 15]. Note: `04 A1` is a separate "Brightness" (image quality) parameter, distinct from "Bright" (AE bright level) at `04 0D`/`04 4D`. Sharpness mode uses `04 05 0p FF` (p: 2=Auto, 3=Manual). The CameraBlockInq field previously called "Aperture" is actually Sharpness.

**Iris hex values** (verified against camera): `00` = CLOSED, `01` = ƒ 11.0, `02` = ƒ 9.6, `03` = ƒ 8.0, `04` = ƒ 6.8, `05` = ƒ 5.6, `06` = ƒ 4.8, `07` = ƒ 4.0, `08` = ƒ 3.4, `09` = ƒ 2.8, `0A` = ƒ 2.4, `0B` = ƒ 2.0, `0C` = ƒ 1.8. These differ from the PTZOptics API documentation, which lists incorrect/reversed mappings.

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

### Camera Interaction Tests

The `RunCameraInteractionTest` framework in `src/visca/__tests__/camera-interactions/` spins up a real TCP server as a mock camera, then replays a scripted sequence of sends, receives, and assertions. This is used to test:

- **VISCA port behavior** (`src/visca/__tests__/`): Connection management, ACK/completion handling, error recovery, message queuing, reconnection.
- **Command parameter encoding** (`src/visca/__tests__/command-convert.test.ts`, `src/camera/exposure.test.ts`, `src/camera/osd.test.ts`, `src/camera/pan-tilt.test.ts`): Verifies that typed parameter values are correctly encoded into VISCA byte sequences via nibble mappings and convert functions.
- **Inquiry response parsing** (`src/visca/__tests__/inquiry-convert.test.ts`, `src/camera/block-inquiry.test.ts`, `src/camera/pan-tilt.test.ts`, `src/camera/osd.test.ts`): Verifies that raw VISCA response bytes are correctly parsed into typed answer objects, including convert functions for iris/shutter labels, WB/AE mode enums, signed 16-bit pan/tilt positions, and OSD state.

### Upgrade Migration Tests

Migration functions (`tryUpdate*` in `src/actions/`) are tested directly with mock `CompanionMigrationAction` objects. See `src/actions/exposure.test.ts`, `src/actions/presets.test.ts`, `src/actions/pan-tilt.test.ts`.

### Unit Tests

Pure logic tests for option conversions (`src/actions/option-conversion.test.ts`), feedback evaluation logic (`src/feedbacks.test.ts`), and config validation (`src/config.test.ts`).
