import { PlayerTuning } from "../core/Constants.js";

export class Player {
  position;
  facingRadians = -Math.PI / 2;
  moveFacingRadians = -Math.PI / 2;
  velocity = { x: 0, y: 0 };
  locomotion = "idle";
  locomotionPhase = 0;
  visualTime = 0;
  dashDirection = { x: 0, y: -1 };
  dashTimeRemaining = 0;
  dashCooldownRemaining = 0;
  dashTrail = [];
  dashTrailIntervalRemaining = 0;

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
    this.dashTrailIntervalRemaining = 0;
    return true;
  }

  tickTimers(deltaSeconds) {
    this.visualTime += deltaSeconds;
    this.dashTimeRemaining = Math.max(0, this.dashTimeRemaining - deltaSeconds);
    this.dashCooldownRemaining = Math.max(0, this.dashCooldownRemaining - deltaSeconds);
    for (const afterimage of this.dashTrail) {
      afterimage.age += deltaSeconds;
    }
    this.dashTrail = this.dashTrail.filter((afterimage) => afterimage.age < PlayerTuning.dashTrailDuration);
  }

  recordDashAfterimage() {
    this.dashTrail.push({
      position: { ...this.position },
      aimRadians: this.facingRadians,
      moveFacingRadians: this.moveFacingRadians,
      locomotion: this.locomotion,
      locomotionPhase: this.locomotionPhase,
      visualTime: this.visualTime,
      age: 0,
    });
    this.dashTrailIntervalRemaining = PlayerTuning.dashTrailInterval;
  }
}
