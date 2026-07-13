import { Arena, PlayerTuning } from "../core/Constants.js";

export class PlayerController {
  #player;
  #input;

  constructor(player, input) {
    this.#player = player;
    this.#input = input;
  }

  update(deltaSeconds) {
    this.#player.tickTimers(deltaSeconds);

    const movement = this.#input.getMovementDirection();
    const aim = this.#getAimDirection();
    this.#updateFacing(aim);

    if (this.#input.consumeDashRequest()) {
      this.#player.startDash(this.#dashDirection(movement, aim));
    }

    const direction = this.#player.isDashing ? this.#player.dashDirection : movement;
    const speed = this.#player.isDashing ? PlayerTuning.dashSpeed : PlayerTuning.moveSpeed;
    this.#movePlayer(direction, speed * deltaSeconds);
  }

  #getAimDirection() {
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

  #dashDirection(movement, aim) {
    if (movement.x !== 0 || movement.y !== 0) {
      return movement;
    }

    if (aim) {
      return aim;
    }

    return this.#player.facingDirection;
  }

  #movePlayer(direction, distance) {
    const radius = this.#player.radius;
    this.#player.position.x = clamp(
      this.#player.position.x + direction.x * distance,
      Arena.padding + radius,
      Arena.width - Arena.padding - radius,
    );
    this.#player.position.y = clamp(
      this.#player.position.y + direction.y * distance,
      Arena.padding + radius,
      Arena.height - Arena.padding - radius,
    );
  }
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}
