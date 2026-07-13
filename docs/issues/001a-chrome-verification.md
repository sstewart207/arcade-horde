# Block 001a — Chrome verification

## Status

Complete

## Scope

- Add Playwright as a development-only dependency.
- Use the locally installed Google Chrome channel; do not download a Playwright browser.
- Start a loopback-only static server during tests.
- Verify the player controller responds to movement, aim, and dash input.

## Test hook

Appending `?debug` exposes a read-only game-state snapshot on `window.__arcadeHorde`. It is used only by the automated test and is absent during a normal game launch.

## Verification result

`npm test` passed in the locally installed Google Chrome. The test loaded the canvas and confirmed movement, mouse aim, and dash cooldown behavior.
