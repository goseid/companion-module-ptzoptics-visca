# goseid Feature Ledger

Features and functionality this branch (`goseid`) adds on top of upstream
`bitfocus/companion-module-ptzoptics-visca` (`master`). Kept concise and
current so both of us can see, at a glance, what is _ours_ versus what comes
from upstream. Update this when adding/removing a feature or when upstream
adoption changes an entry.

Branched from upstream at `c7b82d8` (2026-02-24).

## Pan / Tilt

- Signed 16-bit pan/tilt **position variables** (center=0, ±left/right, ±down/up).
- Pan/Tilt **position actions** (absolute + relative/step).
- **Position feedback** and center-position preset.
- `pan_position_bar` / `tilt_position_bar` text progress bars; step + rotary presets.

## Zoom / Focus

- **Focus mode** toggle action + consolidated selectable focus-mode feedback.
- Zoom/Focus **position actions**, feedbacks, and step/direct presets.
- `zoom_position_bar` / `focus_position_bar` bars; rotary-encoder presets + background image.
- Dual zoom coordinate handling (stepper vs ZoomDirect) for correct stepping.

## Exposure

- **Block-inquiry polling** (`CAM_CameraBlockInq`) for efficient combined state.
- **Exposure mode** feedback + presets.
- **Iris** & **Gain** position feedbacks, reset actions, presets; corrected iris hex map + friendly labels (`ƒ 2.0`).
- **Shutter** position feedback, reset action, presets (friendly `1/100` labels).
- **Bright** (AE level) position feedback, reset action, presets.
- **Exposure comp** feedbacks + on/off toggle + presets (display −7..+7).
- **Backlight** on/off toggle + feedback.
- Gain inquiry (`GainPositionInquiry`, kept for future use).
- `iris_position_bar` bar.

## Image quality

- **Sharpness** actions/feedbacks/presets + sharpness mode (renamed from "aperture").
- **Noise reduction** actions — independent 2D and 3D NR levels.

## White Balance

- WB actions, R/B gain **reset** actions, Color presets.
- Consolidated single **selectable WB feedback** (dropdown) + WB tests.

## Presets (buttons)

- **Smart preset buttons** (~245, one per valid preset): each carries a per-button `PresetNumber` local variable (API 2.0) set to its preset number, so the button text, recall/save actions, and "selected" feedback all follow the variable. Drag in the presets you need, then copy any button and change only `PresetNumber` to retarget it — clone a customized button without re-editing every field.
- Hold-to-save behavior: short press (<1s) recalls, long press (>1s) saves.
- Config-driven preset button colors; global **preset recall speed** (`81 01 06 01 ss FF`).
- `PresetSaveActive` (yellow) + `PresetSelected` (orange) feedbacks.
- Removed the separate "Recall Preset" / "Save Preset" categories.

## Infrastructure / fixes

- Continuous poll loop with position/lens/OSD/sharpness/block variables & feedbacks framework.
- `src/utils/progress-bar.ts` text progress-bar utility.
- OSD toggle uses `81 01 06 06 10 FF` (avoids poll-loop stall).
- Consolidated PTZOptics PT20X-SDI-xx-G2 protocol docs; `CLAUDE.md` guidance.
- Test coverage: block inquiry, pan/tilt, exposure, OSD, feedbacks, WB, command encoding.

---

## Upstream adoption notes

- Upstream **v4.0.0** (TypeScript 6, ESM tooling refactor) — adopt as baseline; no competing camera features.
- Migrate our `assertNever(...)` usage → upstream's `type assert_XIsNever = Expect<IsNever<typeof val>>` (`type-testing`) pattern (lint-enforced).
