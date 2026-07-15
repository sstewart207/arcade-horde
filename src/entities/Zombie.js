import { ZombieTuning } from "../core/Constants.js";

export class Zombie {
  health = ZombieTuning.health;
  facingRadians = -Math.PI / 2;
  locomotionPhase = 0;
  visualTime = 0;
  hitFlashRemaining = 0;
  knockbackVelocity = { x: 0, y: 0 };

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
    this.#applyKnockback(deltaSeconds);
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
    this.locomotionPhase += distanceToTravel * 0.1;
  }

  tick(deltaSeconds) {
    this.visualTime += deltaSeconds;
    this.hitFlashRemaining = Math.max(0, this.hitFlashRemaining - deltaSeconds);
  }

  takeDamage(amount, hitPosition, hitDirection) {
    this.health -= amount;
    this.hitFlashRemaining = ZombieTuning.hitFlashDuration;
    const x = hitDirection?.x ?? this.position.x - hitPosition.x;
    const y = hitDirection?.y ?? this.position.y - hitPosition.y;
    const length = Math.hypot(x, y) || 1;
    this.knockbackVelocity = {
      x: (x / length) * ZombieTuning.hitKnockbackSpeed,
      y: (y / length) * ZombieTuning.hitKnockbackSpeed,
    };
  }

  #applyKnockback(deltaSeconds) {
    this.position.x += this.knockbackVelocity.x * deltaSeconds;
    this.position.y += this.knockbackVelocity.y * deltaSeconds;
    const damping = Math.exp(-18 * deltaSeconds);
    this.knockbackVelocity.x *= damping;
    this.knockbackVelocity.y *= damping;
  }
}
