# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Bitfocus Companion module that controls PTZOptics cameras (and compatible) via Sony VISCA protocol over TCP/IP. It integrates with the Companion application framework to provide camera control actions, inquiries, and button presets.

## Commands

```bash
yarn install          # Install dependencies (Yarn 4.14.1 via Corepack)
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

Requires Node.js ^22.11. Built on `@companion-module/base` **API 2.0** (base `~2.0.4`, tools `^3.0.1`); targets Companion 4.x (deliberately not 2.1 / Companion 5.0+). The entry point `src/main.ts` `export default`s the instance class and re-exports `UpgradeScripts` (no `runEntrypoint`).

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

- **Variables** (`src/variables.ts`): Camera state is polled via VISCA inquiries and exposed as Companion variables. The poll loop cycles through: pan/tilt position, lens block (zoom/focus position, focus mode), OSD state, sharpness mode, and CameraBlockInq (which provides exposure mode, WB mode, R/B gain, sharpness, shutter/iris/bright/gain positions, backlight, exposure comp). Pan/tilt positions are signed 16-bit integers (center=0, negative=left/down, positive=right/up). Iris and shutter position variables are converted to user-friendly labels (e.g., `ƒ 2.0`, `1/100`) via convert functions on the block inquiry parameters. Position bar variables (`pan_position_bar`, `tilt_position_bar`, `zoom_position_bar`, `focus_position_bar`, `iris_position_bar`) provide text-based progress bars (e.g., `L.....|.....R`, `D.....|.....U`, `W.....|.....T`) computed via `src/utils/progress-bar.ts`. Pan/tilt bars use `PanTiltBounds` (full signed 16-bit range) for normalization. Non-polled variables include `preset_speed` (1-24, default 12), `last_preset_selected`, and `preset_save_active`.

- **Feedbacks** (`src/feedbacks.ts`): Boolean feedbacks check variable state and apply styles (e.g., Focus Mode, Focus Position, Exposure Mode, WB Mode, Sharpness Mode, Iris Position, Shutter Position, Backlight On, Exp Comp On, Exp Comp Position, Bright Position, Gain Position, Zoom Position, Zoom Speed, Focus Speed, Pan/Tilt Position, Preset Speed, Preset Selected, Preset Save Active). Exposure comp position uses display values (-7 to +7) in feedbacks and actions, converted from/to camera values (0x0-0xE) internally. Selectable feedbacks use a dropdown option for the mode/position value rather than separate feedbacks per value. Advanced feedbacks return dynamic text (e.g., Exposure Mode Text). When referencing boolean feedbacks in presets, the `style` property must be specified inline on the preset feedback — `defaultStyle` on the definition only applies when users manually add a feedback. Numeric variable comparisons require `Number()` conversion, and stringly comparisons use `optString()` (`src/utils/option-value.ts`) — in API 2.0 `getVariableValue()` and option values are typed as `JsonValue`, so a bare `String()` on them trips `no-base-to-string`.

### Presets and Assets

- **Presets** (`src/presets.ts`): Button presets (API 2.0 `type: 'simple'`) provide pre-configured buttons. `getPresets(presetColorText, presetColorBG)` returns `{ structure, presets }` — a `CompanionPresetSection[]` grouping (derived one-to-one from functional categories: Pan/Tilt, Lens, Exposure, Color, Image, Auto Tracking, OSD Menu, Presets) plus the flat preset definitions — passed to `setPresetDefinitions(structure, presets)`. Rotary action presets are enabled by the presence of `rotate_left`/`rotate_right` in a step (2.0 removed the old `options: { rotaryActions: true }` flag) and use a shared `IMAGE_ROTARY_BG` background image. Pan/tilt position presets (rotary and standard step buttons) use relative positioning actions that read current position from polled variables and send `MoveToAbsolutePanTilt` with a step offset of 1. The relative pan/tilt, focus, and zoom position actions share a **rotary accumulator** (`src/utils/rotary-accumulator.ts`, `createRotaryAccumulator`): to stay smooth (not velocity-based) on a fast encoder spin, each axis accumulates against an internal optimistic target instead of re-reading the lagging polled value every tick (which undershoots), resyncs to the real position after `ROTARY_RESYNC_MS` (400ms) idle, and coalesces device sends with a leading+trailing `ROTARY_THROTTLE_MS` (150ms) throttle (per-tick step size is unchanged). Pan/tilt keeps its own two-axis wrapper but imports the shared constants; focus/zoom use the helper directly. Cleanup of pending trailing timers is registered via `instance.registerCleanup()` (drained in `destroy()`).
- **Local-variable presets**: many presets declare per-button `localVariables` (`variableType: 'simple'` with a `startupValue`) so a user can copy a button and retarget it by editing just the variable(s) — the ~245 numbered camera preset buttons (id `camera_preset_N`, `PresetNumber` + a `PresetName` label defaulting to "Preset"), Absolute Position (`PanPosition`/`TiltPosition`), RB Gain Direct (`RedGain`/`BlueGain`), and Focus/Gain/Bright/ExpComp Set. Their text, actions, and feedback reference `$(local:NAME)`. Number-typed action/feedback options reference a local variable via **expression mode** (`{ isExpression: true, value: '$(local:NAME)' }`), since 2.0 removed value-mode `useVariables: { local: true }`; Companion resolves these before the callback runs. Presets are re-registered in `configUpdated()` to pick up color changes.
- **Camera preset buttons — native hold-to-save** (replaced the old smart-timer buttons): each numbered preset is built from Companion **duration groups**, not a module timer — `up` recalls on short release; a `1000` group with `runWhileHeld: true` saves while held and raises the global `preset_save_active` highlight; a `1001` group (not run-while-held, so it fires on release) runs the `ClearPresetSaveActive` action to drop the highlight. Enabler actions: `RecallPreset`/`SetPreset` set `last_preset_selected` (Recall also sends the global recall speed and clears save-active; Set raises it), driving `PresetSelected` (orange) and `PresetSaveActive` (yellow, global) feedbacks. The older **smart-preset actions** (`SmartPresetDown`/`SmartPresetUp`, a module `setTimeout` on a single down/up — `#smartPresetTimer` in `instance.ts`) are retained for backward compatibility but no longer used by any shipped preset; native composes with conditional safeguards without the press/release desync a module timer suffers.

- **Assets** (`src/assets/assets.ts`): Base64-encoded PNG images used in preset button styles. Includes directional arrows (`IMAGE_UP`, `IMAGE_DOWN`, etc.) and the rotary encoder background (`IMAGE_ROTARY_BG`).

### Instance Lifecycle

`PtzOpticsInstance` (extends `InstanceBase<PtzOpticsInstanceTypes>`, a schema bundling config/secrets/actions/feedbacks/variables) implements three Companion lifecycle methods:

- `init()` — Registers actions, feedbacks, presets, and variables; opens VISCA connection
- `configUpdated()` — Validates new config, re-registers presets (for color changes), reconnects and restarts polling if needed
- `destroy()` — Clears smart preset timer, stops polling, closes connection

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
| Gain           | `04 0C` | `04 4C` | `04 4C` |
| Bright         | `04 0D` | `04 4D` | `04 4D` |
| Exp Comp       | `04 0E` | `04 4E` | `04 4E` |

Up = `XX 02 FF`, Down = `XX 03 FF`, Reset = `XX 00 FF`. Direct commands use `XX 00 00 0p 0q FF` with position in nibbles [13, 15]. Note: `04 A1` is a separate "Brightness" (image quality) parameter, distinct from "Bright" (AE bright level) at `04 0D`/`04 4D`. Sharpness mode uses `04 05 0p FF` (p: 2=Auto, 3=Manual). The CameraBlockInq field previously called "Aperture" is actually Sharpness.

**Iris hex values** (verified against camera): `00` = CLOSED, `01` = ƒ 11.0, `02` = ƒ 9.6, `03` = ƒ 8.0, `04` = ƒ 6.8, `05` = ƒ 5.6, `06` = ƒ 4.8, `07` = ƒ 4.0, `08` = ƒ 3.4, `09` = ƒ 2.8, `0A` = ƒ 2.4, `0B` = ƒ 2.0, `0C` = ƒ 1.8. These differ from the PTZOptics API documentation, which lists incorrect/reversed mappings.

**Preset Recall Speed**: `81 01 06 01 ss FF` (speed 0x01-0x18, i.e., 1-24). This is a global speed setting — not per-preset. The legacy per-preset `PresetDriveSpeed` command (`81 01 06 01 pp ss FF`) exists in the codebase but does not work on this camera model.

**Zoom coordinate systems**: `CAM_LensBlockInq` returns zoom position in stepper motor steps (~0–5140 range), while `CAM_ZoomDirect` and `CAM_ZoomPosInq` use a different coordinate system (~0–16384 range, ratio ≈3.1875). The `zoom_position` variable uses stepper units from LensBlockInq. For incremental (rotary) zoom steps, the shared rotary accumulator (see below) seeds its ZoomDirect-coordinate target from `zoom_position × 3.1875` on idle, then accumulates ±4 per tick and sends `ZoomDirect` — this replaced the former per-tick `ZoomPositionInquiry` (still exported for future use). For absolute positioning (e.g., Wide/Mid/Tele), stepper values are converted using the 3.1875 ratio. Focus position does not have this dual-coordinate issue — `FocusDirect` uses the same units as `LensBlockInq`.

**Noise Reduction**: 2D and 3D NR levels are set independently via `81 01 04 53 0p FF` (2D, 0=Off through 5=Strong) and `81 01 04 54 0p FF` (3D, 0=Off through 5; camera OSD allows up to 8 but VISCA clamps at 5). These commands are not in the official PTZOptics documentation but are verified working on G2 cameras. The `GainPositionInquiry` (`81 09 04 4C FF`) is also undocumented but verified to match CameraBlockInq gain values — kept in `src/camera/exposure.ts` for future use but not polled.

### Upgrade System

`src/upgrades.ts` contains ordered migration scripts (using `ActionUpdater`/`ConfigUpdater` helpers) that transform saved configs and actions when the module version changes. These run automatically via Companion. In API 2.0, migration option values are `ExpressionOrValue`-wrapped (`{ isExpression, value }`); the `tryUpdate*` functions read/write them via `migValue`/`migOpt` (`src/utils/migration.ts`).

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
