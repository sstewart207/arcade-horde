import { Arena, BlasterTuning } from "../core/Constants.js";
import { ImpactBurst } from "../entities/ImpactBurst.js";
import { Zombie } from "../entities/Zombie.js";

export class EnemySystem {
  zombies = [];
  defeatBursts = [];

  spawnWave(enemyCount, speedMultiplier) {
    const spawnPoints = getSpawnPoints();
    this.zombies = Array.from({ length: enemyCount }, (_, index) => {
      const spawnPoint = spawnPoints[index % spawnPoints.length];
      const ring = Math.floor(index / spawnPoints.length);
      const offset = ring * 58;
      const direction = index % 2 === 0 ? 1 : -1;
      return new Zombie(spawnPoint.x + offset * direction, spawnPoint.y + offset * direction, speedMultiplier);
    });
  }

  clearForTesting() {
    this.zombies = [];
  }

  clampToArena() {
    for (const zombie of this.zombies) {
      clampPositionToArena(zombie.position, zombie.radius);
    }
  }

  update(deltaSeconds, player) {
    for (const zombie of this.zombies) {
      zombie.tick(deltaSeconds);
      zombie.moveToward(player.position, player.radius, deltaSeconds);
      clampPositionToArena(zombie.position, zombie.radius);
    }

    for (const burst of this.defeatBursts) {
      burst.tick(deltaSeconds);
    }
    this.defeatBursts = this.defeatBursts.filter((burst) => !burst.isExpired);
  }

  findHitTarget(projectile) {
    for (const zombie of this.zombies) {
      const radius = projectile.radius + zombie.radius;
      const closestPoint = closestPointOnSegment(zombie.position, projectile.previousPosition, projectile.position);
      if (closestPoint.distance <= radius) {
        return {
          zombie,
          position: segmentCircleEntryPoint(zombie.position, projectile.previousPosition, projectile.position, radius),
          direction: normalized(projectile.velocity),
        };
      }
    }
    return null;
  }

  damage(zombie, amount, hitPosition, hitDirection) {
    zombie.takeDamage(amount, hitPosition, hitDirection);
    if (!zombie.isDefeated) {
      return false;
    }

    this.defeatBursts.push(new ImpactBurst({ ...zombie.position }, BlasterTuning.impactDuration));
    this.zombies = this.zombies.filter((candidate) => candidate !== zombie);
    return true;
  }
}

function getSpawnPoints() {
  const insetX = Arena.padding + 148;
  const insetY = Arena.padding + 128;
  return [
    { x: insetX, y: insetY },
    { x: Arena.width - insetX + 20, y: insetY + 10 },
    { x: Arena.width - insetX, y: Arena.height - insetY + 8 },
    { x: insetX + 10, y: Arena.height - insetY + 18 },
  ];
}

function closestPointOnSegment(point, start, end) {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;
  if (lengthSquared === 0) {
    return {
      position: { ...start },
      distance: Math.hypot(point.x - start.x, point.y - start.y),
    };
  }

  const projection = ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / lengthSquared;
  const t = Math.max(0, Math.min(1, projection));
  const position = {
    x: start.x + segmentX * t,
    y: start.y + segmentY * t,
  };
  return {
    position,
    distance: Math.hypot(point.x - position.x, point.y - position.y),
  };
}

function segmentCircleEntryPoint(center, start, end, radius) {
  const directionX = end.x - start.x;
  const directionY = end.y - start.y;
  const fromCenterX = start.x - center.x;
  const fromCenterY = start.y - center.y;
  const lengthSquared = directionX * directionX + directionY * directionY;
  if (lengthSquared === 0) {
    return { ...start };
  }

  const b = 2 * (fromCenterX * directionX + fromCenterY * directionY);
  const c = fromCenterX * fromCenterX + fromCenterY * fromCenterY - radius * radius;
  const discriminant = b * b - 4 * lengthSquared * c;
  if (discriminant < 0) {
    return { ...start };
  }

  const entry = (-b - Math.sqrt(discriminant)) / (2 * lengthSquared);
  const t = Math.max(0, Math.min(1, entry));
  return {
    x: start.x + directionX * t,
    y: start.y + directionY * t,
  };
}

function normalized(vector) {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

function clampPositionToArena(position, radius) {
  const edge = Arena.padding + radius;
  position.x = clamp(position.x, edge, Arena.width - edge);
  position.y = clamp(position.y, edge, Arena.height - edge);
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}
