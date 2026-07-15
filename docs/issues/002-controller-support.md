# Block 002 — Controller support

## Status

Planned

## Goal

Make Arcade Horde feel native on modern Xbox and PlayStation controllers in supported desktop browsers.

## Scope

- Use the browser Gamepad API; do not add a controller library.
- Support Xbox Series controllers and PlayStation 5 DualSense controllers through their standard button and axis layouts.
- Use a familiar twin-stick COD Zombies-style layout adapted for top-down play: left stick moves, right stick aims, and right trigger fires.
- South button (A / Cross) dashes; D-pad or face buttons select wave upgrades; Menu / Options starts or restarts a run.
- Apply a configurable stick dead zone and normalize stick input so diagonals are not faster.
- Show a small controller-connected prompt and fall back cleanly to keyboard/mouse when no gamepad is active.
- Preserve existing keyboard and mouse controls.

## Acceptance checks

1. Connecting either controller in Chrome exposes a clear controller-active state after a button press.
2. Left-stick movement and right-stick aim work independently and respect the arena bounds.
3. Trigger firing, dash, upgrade choice, restart, and start inputs work without keyboard input.
4. Releasing a stick inside the dead zone stops movement or preserves the last aim direction without drift.
5. Disconnecting a controller cannot leave movement, firing, dash, or selection inputs stuck on.
6. Automated tests cover input normalization, dead-zone behavior, and controller-to-action mapping without requiring physical hardware.

## Deferred decisions

- Vibration/haptics.
- Controller remapping UI.
- Steam Input and non-standard browser mappings.
