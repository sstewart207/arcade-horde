import { PlayerVitalsTuning } from "../core/Constants.js";

export class ContactDamageSystem {
  update(deltaSeconds, player, playerVitals, enemySystem) {
    playerVitals.tick(deltaSeconds);

    if (player.isDashing) {
      return;
    }

    const isInContact = enemySystem.zombies.some((zombie) => {
      const x = zombie.position.x - player.position.x;
      const y = zombie.position.y - player.position.y;
      return Math.hypot(x, y) <= player.radius + zombie.radius + 8;
    });

    if (isInContact) {
      playerVitals.takeDamage(PlayerVitalsTuning.contactDamage);
    }
  }
}
