import { PlayerVitalsTuning } from "../core/Constants.js";

export class PlayerVitals {
  health = PlayerVitalsTuning.maxHealth;
  damageCooldownRemaining = 0;

  get isDefeated() {
    return this.health <= 0;
  }

  get isInvulnerable() {
    return this.damageCooldownRemaining > 0;
  }

  tick(deltaSeconds) {
    this.damageCooldownRemaining = Math.max(0, this.damageCooldownRemaining - deltaSeconds);
  }

  takeDamage(amount) {
    if (this.isInvulnerable || this.isDefeated) {
      return false;
    }

    this.health = Math.max(0, this.health - amount);
    this.damageCooldownRemaining = PlayerVitalsTuning.damageCooldown;
    return true;
  }

  heal(amount) {
    if (this.isDefeated || amount <= 0) {
      return false;
    }

    const previousHealth = this.health;
    this.health = Math.min(PlayerVitalsTuning.maxHealth, this.health + amount);
    return this.health > previousHealth;
  }
}
