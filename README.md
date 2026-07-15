# Arcade Horde

**Arcade Horde** is a colorful, arcade-first top-down zombie horde shooter for the browser. Play as a human survivor, dodge through compact arenas, and blast back escalating zombie waves.

## Current prototype

The first complete survival loop is implemented:

- WASD/arrow-key movement, independent mouse aim, and a responsive Spacebar dash.
- Hold left-click to fire the blaster; projectiles create muzzle flashes and impact effects.
- Generated, transparent sprites for the human player and basic zombie.
- Chasing zombie AI, projectile damage, defeat effects, player health, contact damage, game-over, and `R` to restart.
- Endless waves: Wave 1 begins with four zombies; cleared waves add faster, larger hordes.
- Each cleared wave pauses for a choice of stacking upgrades: Scattershot, Heavy Rounds, or Blood Rounds.
- A clean start screen, wave/kill HUD, and restart flow frame each run.
- When the player is hurt, zombies can drop code-drawn medkits; a drought safeguard prevents unfairly long dry streaks.
- The arena fills the browser window without stretching the game world; wider windows become wider playable arenas. An optional fullscreen control lives in the bottom-right corner.

Audio, more enemy/weapon types, final art, menus, and MVP hardening are still ahead.

## Play locally

```bash
cd /home/shane/arcade-horde
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000> in Chrome.

## Controls

| Control | Action |
| --- | --- |
| Enter | Start a run |
| WASD / arrow keys | Move |
| Mouse | Aim |
| Space | Dash |
| Left-click / hold | Fire blaster |
| R | Restart after game over |
| Fullscreen button | Enter or exit fullscreen |

## Tests

The Playwright suite uses the locally installed Google Chrome and covers player control, combat, player survival/restart, and wave escalation.

```bash
npm test
```

## Stack

Vanilla JavaScript modules and the Canvas API—no framework or build step.
