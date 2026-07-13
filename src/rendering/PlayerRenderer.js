export class PlayerRenderer {
  #context;
  #sprite;

  constructor(context, sprite) {
    this.#context = context;
    this.#sprite = sprite;
  }

  draw(player, blaster, playerVitals) {
    const context = this.#context;
    const { x, y } = player.position;
    const directionX = Math.cos(player.facingRadians);
    const directionY = Math.sin(player.facingRadians);

    if (player.isDashing) {
      context.save();
      context.translate(x, y);
      context.fillStyle = "rgb(255 223 102 / 28%)";
      context.beginPath();
      context.arc(0, 0, player.radius * 2, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    this.#drawSprite(x, y, player.facingRadians);

    if (playerVitals.isInvulnerable) {
      context.strokeStyle = "#ff6b92";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(x, y, player.radius + 13, 0, Math.PI * 2);
      context.stroke();
    }

    if (blaster.muzzleFlashRemaining > 0) {
      context.fillStyle = "#fff7bc";
      context.beginPath();
      context.arc(x + directionX * 58, y + directionY * 58, 13, 0, Math.PI * 2);
      context.fill();
    }

    const cooldownRatio = player.dashCooldownRemaining / 0.75;
    if (cooldownRatio > 0) {
      context.strokeStyle = "#ff6b92";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(x, y, player.radius + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cooldownRatio);
      context.stroke();
    }
  }

  #drawSprite(x, y, facingRadians) {
    const context = this.#context;
    if (!this.#sprite.complete || this.#sprite.naturalWidth === 0) {
      return;
    }

    context.save();
    context.translate(x, y);
    context.rotate(facingRadians + Math.PI / 2);
    context.drawImage(this.#sprite, -82, -82, 164, 164);
    context.restore();
  }
}
