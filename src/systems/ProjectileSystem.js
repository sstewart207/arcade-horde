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
    return projectile.position.x < edge
      || projectile.position.x > Arena.width - edge
      || projectile.position.y < edge
      || projectile.position.y > Arena.height - edge;
  }

  #clampToArena(position) {
    const edge = Arena.padding;
    return {
      x: clamp(position.x, edge, Arena.width - edge),
      y: clamp(position.y, edge, Arena.height - edge),
    };
  }
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}
