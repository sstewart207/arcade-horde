export class CombatSystem {
  update(projectileSystem, enemySystem, playerVitals, blaster, runStats, pickupSystem) {
    for (const projectile of [...projectileSystem.projectiles]) {
      const target = enemySystem.findHitTarget(projectile);
      if (!target) {
        continue;
      }

      projectileSystem.createImpact(projectile.position);
      projectileSystem.remove(projectile);
      const defeated = enemySystem.damage(target, projectile.damage);
      if (defeated) {
        runStats.recordKill();
        pickupSystem.onZombieDefeated(target.position, playerVitals);
        playerVitals.heal(blaster.healthOnKill);
      }
    }
  }
}
