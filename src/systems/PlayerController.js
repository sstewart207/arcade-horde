import { Arena, PlayerTuning } from "../core/Constants.js";

export class PlayerController {
  #player;
  #input;

  constructor(player, input) {
    this.#player = player;
    this.#input = input;
  }

  update(deltaSeconds) {
    const wasDashing = this.#player.isDashing;
    this.#player.tickTimers(deltaSeconds);

    const movement = this.#input.getMovementDirection();
    const aim = this.#getAimDirection();
    this.#updateFacing(aim);

    if (this.#input.consumeDashRequest()) {
      this.#player.startDash(this.#dashDirection(movement, aim));
    }

    if (this.#player.isDashing) {
      this.#player.velocity = {
        x: this.#player.dashDirection.x * PlayerTuning.dashSpeed,
        y: this.#player.dashDirection.y * PlayerTuning.dashSpeed,
      };
      this.#player.locomotion = "dash";
      this.#recordDashTrail(deltaSeconds);
    } else {
      if (wasDashing) {
        this.#player.velocity = { x: 0, y: 0 };
      }
      this.#updateVelocity(movement, deltaSeconds);
      this.#player.locomotion = Math.hypot(this.#player.velocity.x, this.#player.velocity.y) > 8 ? "walk" : "idle";
    }

    const distanceMoved = this.#movePlayer(this.#player.velocity, deltaSeconds);
    if (distanceMoved > 0) {
      this.#player.locomotionPhase += distanceMoved * 0.09;
    }
  }

  #getAimDirection() {
    if (!this.#input.hasPointer) {
      return null;
    }

    const pointer = this.#input.getPointerPosition();
    const x = pointer.x - this.#player.position.x;
    const y = pointer.y - this.#player.position.y;
    const length = Math.hypot(x, y);

    return length === 0 ? null : { x: x / length, y: y / length };
  }

  #updateFacing(aim) {
    if (aim) {
      this.#player.facingRadians = Math.atan2(aim.y, aim.x);
    }
  }

  #updateVelocity(movement, deltaSeconds) {
    const desiredVelocity = {
      x: movement.x * PlayerTuning.moveSpeed,
      y: movement.y * PlayerTuning.moveSpeed,
    };
    const isTryingToMove = movement.x !== 0 || movement.y !== 0;
    const rate = isTryingToMove ? PlayerTuning.moveAcceleration : PlayerTuning.moveBrake;
    this.#player.velocity.x = approach(this.#player.velocity.x, desiredVelocity.x, rate * deltaSeconds);
    this.#player.velocity.y = approach(this.#player.velocity.y, desiredVelocity.y, rate * deltaSeconds);

    if (isTryingToMove) {
      this.#player.moveFacingRadians = Math.atan2(movement.y, movement.x);
    }
  }

  #recordDashTrail(deltaSeconds) {
    this.#player.dashTrailIntervalRemaining -= deltaSeconds;
    if (this.#player.dashTrailIntervalRemaining <= 0) {
      this.#player.recordDashAfterimage();
    }
  }

  #dashDirection(movement, aim) {
    if (movement.x !== 0 || movement.y !== 0) {
      return movement;
    }

    if (aim) {
      return aim;
    }

    return this.#player.facingDirection;
  }

  #movePlayer(velocity, deltaSeconds) {
    const radius = this.#player.radius;
    const previousPosition = { ...this.#player.position };
    this.#player.position.x = clamp(
      this.#player.position.x + velocity.x * deltaSeconds,
      Arena.left + Arena.padding + radius,
      Arena.right - Arena.padding - radius,
    );
    this.#player.position.y = clamp(
      this.#player.position.y + velocity.y * deltaSeconds,
      Arena.top + Arena.padding + radius,
      Arena.bottom - Arena.padding - radius,
    );
    return Math.hypot(
      this.#player.position.x - previousPosition.x,
      this.#player.position.y - previousPosition.y,
    );
  }
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}

function approach(current, target, amount) {
  if (current < target) {
    return Math.min(target, current + amount);
  }
  return Math.max(target, current - amount);
}
