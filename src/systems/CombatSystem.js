export class CombatSystem {
  update(projectileSystem, enemySystem, playerVitals, blaster, runStats, pickupSystem) {
    for (const projectile of [...projectileSystem.projectiles]) {
      const hit = enemySystem.findHitTarget(projectile);
      if (!hit) {
        continue;
      }

      projectileSystem.createImpact(hit.position);
      projectileSystem.remove(projectile);
      const defeated = enemySystem.damage(hit.zombie, projectile.damage, hit.position, hit.direction);
      if (defeated) {
        runStats.recordKill();
        pickupSystem.onZombieDefeated(hit.zombie.position, playerVitals);
        playerVitals.heal(blaster.healthOnKill);
      }
    }
  }
}
