import { BlasterTuning } from "../core/Constants.js";
import { ImpactBurst } from "../entities/ImpactBurst.js";
import { Zombie } from "../entities/Zombie.js";

const spawnPoints = [
  { x: 180, y: 160 },
  { x: 1080, y: 170 },
  { x: 1100, y: 560 },
  { x: 190, y: 570 },
];

export class EnemySystem {
  zombies = [];
  defeatBursts = [];

  spawnWave(enemyCount, speedMultiplier) {
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

  update(deltaSeconds, player) {
    for (const zombie of this.zombies) {
      zombie.moveToward(player.position, player.radius, deltaSeconds);
    }

    for (const burst of this.defeatBursts) {
      burst.tick(deltaSeconds);
    }
    this.defeatBursts = this.defeatBursts.filter((burst) => !burst.isExpired);
  }

  findHitTarget(projectile) {
    return this.zombies.find((zombie) => {
      const x = projectile.position.x - zombie.position.x;
      const y = projectile.position.y - zombie.position.y;
      return Math.hypot(x, y) <= projectile.radius + zombie.radius;
    });
  }

  damage(zombie, amount) {
    zombie.takeDamage(amount);
    if (!zombie.isDefeated) {
      return false;
    }

    this.defeatBursts.push(new ImpactBurst({ ...zombie.position }, BlasterTuning.impactDuration));
    this.zombies = this.zombies.filter((candidate) => candidate !== zombie);
    return true;
  }
}
