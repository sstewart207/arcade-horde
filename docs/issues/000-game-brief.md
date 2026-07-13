# Block 000 — Game brief

## Status

Complete

## Goal

Define the smallest game identity and the boundary for the first playable block.

## Game statement

**Arcade Horde** is a colorful, top-down action game where the player darts through compact arenas, defeats playful monster hordes, and repeatedly gets a visibly stronger or stranger build.

## Player promise

- The game feels good within the first 30 seconds.
- Movement creates clutch escapes and intentional positioning.
- Every 5–15 seconds delivers a reward: a strong kill, a pickup, a wave clear, or a playstyle-changing upgrade.
- Enemies and effects are expressive and playful, never horror-focused or graphic.
- Upgrades create new behaviors rather than only small percentage increases.

## First playable slice

The initial slice will contain only:

1. Player movement with keyboard input.
2. Independent mouse aim.
3. A short, responsive dash.

It will use simple code-drawn shapes and no external assets.

## Explicitly out of scope

- Shooting and weapons
- Enemies and waves
- Health, damage, currency, or upgrades
- Menus, HUD, audio, final art, or networking
- Dependencies, frameworks, build steps, downloads, or asset libraries

## Proposed next block

`001-player-controller`

### Acceptance criteria

- WASD and arrow keys move the player in eight directions.
- The player faces the mouse position independently of movement direction.
- Space triggers a dash with a brief cooldown.
- Diagonal movement is not faster than cardinal movement.
- The game code separates the player model, input handling, controller logic, and rendering.

