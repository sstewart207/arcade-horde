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

    const direction = player.facingDirection;
    const muzzleDistance = player.radius + BlasterTuning.projectileRadius + 8;
    this.#projectileSystem.projectiles.push(new Projectile(
      {
        x: player.position.x + direction.x * muzzleDistance,
        y: player.position.y + direction.y * muzzleDistance,
      },
      direction,
      BlasterTuning.projectileSpeed,
      BlasterTuning.projectileRadius,
    ));
  }
}

