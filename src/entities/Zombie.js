import { ZombieTuning } from "../core/Constants.js";

export class Zombie {
  health = ZombieTuning.health;
  facingRadians = -Math.PI / 2;

  constructor(x, y, speedMultiplier = 1) {
    this.position = { x, y };
    this.speedMultiplier = speedMultiplier;
  }

  get radius() {
    return ZombieTuning.radius;
  }

  get isDefeated() {
    return this.health <= 0;
  }

  moveToward(target, targetRadius, deltaSeconds) {
    const x = target.x - this.position.x;
    const y = target.y - this.position.y;
    const distance = Math.hypot(x, y);
    const stopDistance = targetRadius + this.radius + ZombieTuning.contactDistance;

    if (distance <= stopDistance) {
      return;
    }

    this.facingRadians = Math.atan2(y, x);
    const distanceToTravel = Math.min(ZombieTuning.moveSpeed * this.speedMultiplier * deltaSeconds, distance - stopDistance);
    this.position.x += (x / distance) * distanceToTravel;
    this.position.y += (y / distance) * distanceToTravel;
  }

  takeDamage(amount) {
    this.health -= amount;
  }
}
