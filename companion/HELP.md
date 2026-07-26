# companion-module-ptzoptics-visca

This module can be used to control PTZOptics cameras using the PTZOptics flavor of the Sony VISCA protocol communicating over TCP.

It _may_ work with other manufacturers' cameras, but it isn't guaranteed to do so. (We attempt to maintain support for other cameras as long as it doesn't interfere with supporting PTZOptics cameras.) If you find that some commands work with your camera but others don't, you may be able to replace the nonfunctional commands with a "Custom command" that sends the byte sequence your camera requires.

## Commands

- Custom Command
  Custom commands allow you to send any valid VISCA byte sequence to the camera. The camera must respond with an `ACK` message followed at some later time (either immediately or after a delay) by a `Completion` message: that is,`90 4y FF` and `90 5y FF` where the nibble indicated by `y` is consistent in both replies. Specify the VISCA bytes using this format, beginning with `81` and ending with `FF` and with one or more non-`FF` bytes between: `81 01 02 03 04 FF`

## Presets

The **Presets** category provides camera-preset buttons (one per preset): a short press (< 1 second) recalls the preset, and a long press (> 1 second) saves it — holding lights the other preset buttons until you let go so the save is visible even if your finger covers the button.

Several presets — the camera preset buttons, **Absolute Position**, **Focus Direct**, **Gain / Bright / Exp Comp Set**, and **RB Gain Direct** — are driven by **button-local variables**. To make a custom button, drag one in, then copy it and edit its local variable(s) (for example `PresetNumber`, or `PanPosition` / `TiltPosition`) in the button's **Local Variables** section. The button's text, actions, and feedback all follow the variable, so you only change the value in one place instead of editing every field.
