# Block 003 — Weapon wheel and gun family

## Status

Backlog — intentionally later

## Goal

Give a run a small, readable set of distinct 2D firearms with meaningful tradeoffs, then let the player switch between owned guns through a controller-friendly weapon wheel.

## Initial gun family

| Weapon | Combat identity | Visual direction |
| --- | --- | --- |
| Pistol | Reliable starter; accurate, modest damage, steady fire rate | Compact sidearm, clear muzzle pop |
| SMG | Fast close-range crowd pressure; lower damage per bullet and wider spread | Compact automatic, rapid tracer stream |
| Assault rifle | Mid-range all-rounder; controlled fire rate, stronger individual shots | Longer rifle silhouette, firmer recoil |

## Intended controls

- Hold the weapon-wheel input to open a radial selection overlay; release to equip the highlighted owned weapon.
- Keyboard gets an equivalent hold/select flow.
- The exact button is deferred until controller support is in play, so it does not conflict with upgrade selection or future utility actions.

## Scope when this starts

- Code-drawn 2D weapon silhouettes first; final sprite assets arrive after the art direction is locked.
- Per-weapon damage, fire interval, projectile speed/spread, recoil, ammo policy, and HUD indicator.
- Pickup/unlock flow for gaining guns during a run.
- Weapon wheel that works with mouse and right-stick direction.
- Clear hit, firing, and equip feedback distinct enough to understand without reading numbers.

## Out of scope for the first weapon block

- Reloading, reserve ammo, attachments, rarities, or random loot tables.
- Full final gun art, animations, sound design, or controller remapping.
- Shotguns, snipers, explosives, or melee weapons.

## Acceptance checks

1. The pistol, SMG, and assault rifle feel different within a few seconds of shooting zombies.
2. Damage and rate-of-fire tradeoffs are visible in play, not hidden in a spreadsheet.
3. The weapon wheel selects only owned guns and never fires a weapon while choosing.
4. Mouse/keyboard and controller can both open, highlight, and equip a weapon.
5. Existing progression, upgrades, waves, and restart stay stable across weapon swaps.
