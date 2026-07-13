import { BlasterTuning } from "../core/Constants.js";
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

    const muzzleDistance = player.radius + BlasterTuning.projectileRadius + 8;
    for (const direction of shotDirections(player.facingRadians, this.#blaster.shotCount)) {
      this.#projectileSystem.projectiles.push(new Projectile(
        {
          x: player.position.x + direction.x * muzzleDistance,
          y: player.position.y + direction.y * muzzleDistance,
        },
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
