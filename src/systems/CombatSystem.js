export class CombatSystem {
  update(projectileSystem, enemySystem) {
    for (const projectile of [...projectileSystem.projectiles]) {
      const target = enemySystem.findHitTarget(projectile);
      if (!target) {
        continue;
      }

      projectileSystem.createImpact(projectile.position);
      projectileSystem.remove(projectile);
      enemySystem.damage(target, 1);
    }
  }
}

