# Block 001 — Player controller

## Status

Complete

## Scope delivered

- Keyboard movement using WASD or arrow keys.
- Mouse-based aim independent of movement direction.
- Spacebar dash using movement direction, or aim direction when stationary.
- A 0.15-second dash with a 0.75-second cooldown.
- Code-drawn arena and player placeholder only.

## Architecture

| Responsibility | File |
| --- | --- |
| Browser composition root | `src/main.js` |
| Update loop | `src/core/Game.js` |
| Keyboard and mouse state | `src/core/Input.js` |
| Player data and dash timers | `src/entities/Player.js` |
| Input-to-movement behavior | `src/systems/PlayerController.js` |
| Canvas and arena drawing | `src/rendering/Renderer.js` |
| Player-only drawing | `src/rendering/PlayerRenderer.js` |

## Manual acceptance check

1. Open the game in a browser.
2. Move with WASD or arrow keys; diagonal movement should match cardinal speed.
3. Move in one direction while aiming elsewhere with the mouse.
4. Press Space while moving to dash in the movement direction.
5. Press Space while stationary to dash toward the cursor.
6. Confirm a pink ring briefly shows dash cooldown.

## Out of scope remains unchanged

Shooting, enemies, combat, waves, pickups, upgrades, HUD, menus, audio, assets, and networking are not included.

