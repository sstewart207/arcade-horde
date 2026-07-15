# Arcade Horde handoff

## Read this first

This is a vanilla JavaScript + Canvas top-down horde shooter in `/home/shane/arcade-horde`.

The user calls it “2D Doom,” but the game identity is **Arcade Horde**: colorful, responsive, playful arcade horde action. Avoid horror/gore and avoid generic web-app presentation.

## Current state

- The game is playable locally in Chrome.
- Automated browser suite: **13 passing Playwright tests**.
- Manual human testing is deliberately deferred until there is a larger batch worth testing.
- Working tree should be clean after this handoff commit.

Run locally:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`.

Run tests:

```bash
npm test
```

## Windows bootstrap

The project is pushed to `https://github.com/sstewart207/arcade-horde.git` at handoff time.

```powershell
git clone https://github.com/sstewart207/arcade-horde.git
cd arcade-horde
npm ci
codex "Read HANDOFF.md, inspect git status, then continue the controller-support issue."
```

- Install/sign in to GitHub, Node.js, Python, and Codex first.
- Playwright’s local server command works on Linux and Windows (`python3` on Linux, `py -3` on Windows).
- The exact Linux CLI transcript is local to this machine, so Windows should start a fresh Codex task from `HANDOFF.md` rather than relying on `codex resume`.

## Recent save points

- `dea34f0 Preserve the arena at every browser aspect ratio`
  - Full browser-window Canvas stage.
  - No stretching, letterboxing, or crop.
  - The original 1280×720 arena is the minimum: ultrawide adds horizontal floor; 4:3 adds vertical floor.
  - Pointer aim, rendering, player/projectile/enemy/pickup bounds, HUD, and spawns understand dynamic arena edges.
- `155c241 Make the arena fill the browser window`
  - Introduced the full-window shell and optional fullscreen button.
- `c5ecc2d Document controller scheme and weapon wheel backlog`
  - Controller and later weapon-wheel direction are written down.
- `613dbbf Improve combat feel and animation`
  - Code-drawn animated player/zombies, better dash, muzzle flash/recoil, projectile trails, hit flashes and knockback.

## What is implemented

- Start screen; Enter starts a run.
- WASD/arrow movement; mouse aim; Space dash; held left-click fire.
- Waves, chasing zombies, damage/health/game-over/restart.
- Wave-clear upgrades: Scattershot, Heavy Rounds, Blood Rounds.
- Medkits with hurt-only drops and drought protection.
- Player movement is acceleration/braking based; aim direction and movement direction are independent.
- Dash has afterimages and invulnerability frames.
- Code-drawn characters are intentional temporary presentation, replacing the old rotating-PNG prototype look.
- Full-window responsive arena and optional fullscreen control.

## Locked design decisions

### Responsive browser shell

- Do **not** go back to a fixed 16:9 viewport inside blue page chrome.
- Do **not** stretch the game, letterbox it, or crop it to fit windows.
- Preserve 1280×720 as the minimum logical arena. Extra browser shape becomes real playable floor, symmetrically around the stable `(640, 360)` center.
- The current implementation lives primarily in `src/core/Viewport.js`, `src/rendering/Renderer.js`, and `src/core/Constants.js`.

### Controller scheme (next major issue)

Twin-stick / COD Zombies-style controls:

- Left stick: move.
- Right stick: aim.
- RT / R2: fire.
- A / Cross: dash.
- D-pad or face buttons: upgrade selection.
- Menu / Options: start and restart.

See `docs/issues/002-controller-support.md`.

### Weapon wheel (explicitly later)

Do not build this yet. Save it for a later progression/content pass.

- Weapon wheel for owned weapons.
- Pistol: accurate starter / steady fire.
- SMG: fast, close-range spray / lower damage per bullet.
- Assault rifle: stronger all-rounder.
- Final 2D weapon assets are later too.

See `docs/issues/003-weapon-wheel-and-gun-family.md`.

## Next issue: controller support

Implement `docs/issues/002-controller-support.md` next.

Architecture direction already researched:

- Use the browser’s standard Gamepad API only; no controller library.
- Add a small `GamepadSource` polled once per game frame, then merge it into the existing `Input` abstraction.
- Support standard-mapped Xbox Series and DualSense controllers without checking controller IDs.
- Use radial stick dead zones; left `0.18`, right `0.22`; rescale outside them.
- Right trigger fire threshold: `0.35`.
- Edge-detect dash, start/restart, confirm, and D-pad actions.
- Keyboard/mouse behavior must stay intact.
- Controller disconnect/blur must never leave movement or firing stuck.
- Add unit-like tests using fake gamepad snapshots plus one browser integration test; save physical Xbox/DualSense testing for the deferred manual test batch.

## UI/art direction notes

Research was done using Boxhead, SAS: Zombie Assault, Amorphous+, Raze, BrowserQuest, and Canvas/HiDPI guidance.

- Let the arena dominate the screen.
- Keep HUD compact at edges; no permanent controls paragraph below the game.
- Make player/weapon/enemy reaction more readable than menus or panels.
- Start, pause, and game-over are clear breather states, not surrounding site furniture.
- Current fullscreen control is intentionally minimal; future controls/help/pause can be added as accessible DOM overlays.

## Existing specialist-agent context

If using subagents, these roles worked well:

- **Rook** — game-feel reviewer. The user asked that substantive code changes get a post-implementation check from the game-dev person. Give Rook must-fix-only review tasks.
- **Maya** — web-game UI/art direction. She produced the responsive full-window approach and research references.
- **Mira** — animation/art direction.
- **Byte** — Canvas architecture/controller support research.

## User collaboration preferences

- Keep it direct, fun, CS-teacher energy. Don’t sound corporate or “Claude-y.”
- “Sitrep” means a practical issue/status list, not generic project framing.
- Don’t make a big deal out of sandbox/network tool hiccups unless genuinely blocked.
- Use internet search for current facts instead of saying “I don’t know.”
- The user dislikes manual UI testing as an ADHD flow blocker; batch it later instead of repeatedly demanding a one-off test.
- Before changing scope materially, say what you found and why the proposed next move is sensible.
- The user likes clear save points: run appropriate tests, have Rook check substantive work, then commit intentionally.

## Useful files

- `src/core/Viewport.js` — physical browser Canvas ↔ logical responsive world layout.
- `src/core/Input.js` — keyboard/mouse input; controller input should merge here.
- `src/core/Game.js` — frame loop/state flow/debug snapshot.
- `src/rendering/Renderer.js` — world transform and arena drawing.
- `src/rendering/HudRenderer.js` — Canvas HUD/start/game-over/upgrade panels.
- `docs/issues/002-controller-support.md` — next major issue.
- `docs/issues/003-weapon-wheel-and-gun-family.md` — later weapon backlog.
