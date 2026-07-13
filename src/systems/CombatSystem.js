export class CombatSystem {
  update(projectileSystem, enemySystem, playerVitals, blaster, runStats) {
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
        playerVitals.heal(blaster.healthOnKill);
      }
    }
  }
}
