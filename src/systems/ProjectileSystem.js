import { Arena, BlasterTuning } from "../core/Constants.js";
import { ImpactBurst } from "../entities/ImpactBurst.js";

export class ProjectileSystem {
  projectiles = [];
  impacts = [];

  update(deltaSeconds) {
    for (const projectile of this.projectiles) {
      projectile.move(deltaSeconds);
    }

    const remainingProjectiles = [];
    for (const projectile of this.projectiles) {
      if (this.#isOutsideArena(projectile)) {
        this.createImpact(this.#clampToArena(projectile.position));
      } else {
        remainingProjectiles.push(projectile);
      }
    }
    this.projectiles = remainingProjectiles;

    for (const impact of this.impacts) {
      impact.tick(deltaSeconds);
    }
    this.impacts = this.impacts.filter((impact) => !impact.isExpired);
  }

  createImpact(position) {
    this.impacts.push(new ImpactBurst({ ...position }, BlasterTuning.impactDuration));
  }

  remove(projectile) {
    this.projectiles = this.projectiles.filter((candidate) => candidate !== projectile);
  }

  #isOutsideArena(projectile) {
    const edge = Arena.padding + projectile.radius;
    return projectile.position.x < Arena.left + edge
      || projectile.position.x > Arena.right - edge
      || projectile.position.y < Arena.top + edge
      || projectile.position.y > Arena.bottom - edge;
  }

  #clampToArena(position) {
    const edge = Arena.padding;
    return {
      x: clamp(position.x, Arena.left + edge, Arena.right - edge),
      y: clamp(position.y, Arena.top + edge, Arena.bottom - edge),
    };
  }
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}
