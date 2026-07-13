import { PlayerTuning } from "../core/Constants.js";

export class Player {
  position;
  facingRadians = -Math.PI / 2;
  dashDirection = { x: 0, y: -1 };
  dashTimeRemaining = 0;
  dashCooldownRemaining = 0;

  constructor(x, y) {
    this.position = { x, y };
  }

  get radius() {
    return PlayerTuning.radius;
  }

  get isDashing() {
    return this.dashTimeRemaining > 0;
  }

  get dashReady() {
    return this.dashCooldownRemaining <= 0;
  }

  get facingDirection() {
    return {
      x: Math.cos(this.facingRadians),
      y: Math.sin(this.facingRadians),
    };
  }

  startDash(direction) {
    if (!this.dashReady) {
      return false;
    }

    this.dashDirection = direction;
    this.dashTimeRemaining = PlayerTuning.dashDuration;
    this.dashCooldownRemaining = PlayerTuning.dashCooldown;
    return true;
  }

  tickTimers(deltaSeconds) {
    this.dashTimeRemaining = Math.max(0, this.dashTimeRemaining - deltaSeconds);
    this.dashCooldownRemaining = Math.max(0, this.dashCooldownRemaining - deltaSeconds);
  }
}
