import { BlasterTuning } from "../core/Constants.js";
import { getMuzzlePosition } from "../core/CombatGeometry.js";
import { Projectile } from "../entities/Projectile.js";

export class WeaponController {
  #blaster;
  #input;
  #projectileSystem;

  constructor(blaster, input, projectileSystem) {
    this.#blaster = blaster;
    this.#input = input;
    this.#projectileSystem = projectileSystem;
  }

  update(deltaSeconds, player) {
    this.#blaster.tick(deltaSeconds);

    if (!this.#input.isPrimaryHeld || !this.#blaster.tryFire()) {
      return;
    }

    for (const direction of shotDirections(player.facingRadians, this.#blaster.shotCount)) {
      const muzzle = getMuzzlePosition(player, Math.atan2(direction.y, direction.x));
      this.#projectileSystem.projectiles.push(new Projectile(
        muzzle,
        direction,
        BlasterTuning.projectileSpeed,
        BlasterTuning.projectileRadius,
        this.#blaster.projectileDamage,
      ));
    }
  }
}

function shotDirections(facingRadians, shotCount) {
  const spread = Math.min(0.5, 0.16 * (shotCount - 1));
  return Array.from({ length: shotCount }, (_, index) => {
    const ratio = shotCount === 1 ? 0 : index / (shotCount - 1) - 0.5;
    const radians = facingRadians + ratio * spread;
    return { x: Math.cos(radians), y: Math.sin(radians) };
  });
}
