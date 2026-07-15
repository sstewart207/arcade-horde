import { BlasterTuning, PlayerTuning } from "../core/Constants.js";
import { getMuzzlePosition } from "../core/CombatGeometry.js";

export class PlayerRenderer {
  #context;

  constructor(context) {
    this.#context = context;
  }

  draw(player, blaster, playerVitals) {
    for (const afterimage of player.dashTrail) {
      const alpha = 0.3 * (1 - afterimage.age / PlayerTuning.dashTrailDuration);
      this.#drawActor(afterimage, alpha, 0);
    }

    const recoil = blaster.recoilRemaining / BlasterTuning.recoilDuration;
    this.#drawActor(player, 1, recoil);

    const { x, y } = player.position;
    if (playerVitals.isInvulnerable) {
      const context = this.#context;
      context.strokeStyle = "#ff6b92";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(x, y, player.radius + 13, 0, Math.PI * 2);
      context.stroke();
    }

    if (blaster.muzzleFlashRemaining > 0) {
      this.#drawMuzzleFlash(player, blaster.muzzleFlashRemaining / BlasterTuning.muzzleFlashDuration);
    }

    const cooldownRatio = player.dashCooldownRemaining / PlayerTuning.dashCooldown;
    if (cooldownRatio > 0) {
      const context = this.#context;
      context.strokeStyle = "#ff6b92";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(x, y, player.radius + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cooldownRatio);
      context.stroke();
    }
  }

  #drawActor(actor, alpha, recoil) {
    const context = this.#context;
    const { x, y } = actor.position;
    const isWalking = actor.locomotion === "walk" || actor.locomotion === "dash";
    const walkSwing = isWalking ? Math.sin(actor.locomotionPhase ?? 0) : 0;
    const bob = isWalking ? Math.abs(walkSwing) * -3 : Math.sin((actor.visualTime ?? 0) * 2) * 0.8;
    const directionX = Math.cos(actor.aimRadians ?? actor.facingRadians);
    const directionY = Math.sin(actor.aimRadians ?? actor.facingRadians);

    context.save();
    context.globalAlpha = alpha;
    context.fillStyle = "rgb(10 15 34 / 36%)";
    context.beginPath();
    context.ellipse(x, y + 27, 25, 8, 0, 0, Math.PI * 2);
    context.fill();

    context.translate(x, y + bob);
    context.rotate(actor.moveFacingRadians ?? actor.facingRadians);
    const stride = walkSwing * 7;
    drawRoundedRect(context, -12, -8 + stride, 9, 26, 4, "#172348");
    drawRoundedRect(context, 3, -8 - stride, 9, 26, 4, "#1e315f");
    context.restore();

    context.save();
    context.globalAlpha = alpha;
    context.translate(x - directionX * recoil * 6, y - directionY * recoil * 6 + bob);
    context.rotate(actor.aimRadians ?? actor.facingRadians);
    context.scale(1 + recoil * 0.06, 1 - recoil * 0.04);

    context.fillStyle = "#09152f";
    context.beginPath();
    context.arc(0, 0, 22, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#36b6f2";
    context.beginPath();
    context.arc(0, 0, 18, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#b9f1ff";
    context.beginPath();
    context.arc(7, -4, 8, 0, Math.PI * 2);
    context.fill();
    drawRoundedRect(context, 11, -7, 36, 14, 4, "#f6f1d1");
    drawRoundedRect(context, 24, -4, 31, 8, 3, "#ff8a4c");
    context.fillStyle = "#263764";
    context.fillRect(-12, -27, 22, 9);
    context.restore();
  }

  #drawMuzzleFlash(player, intensity) {
    const context = this.#context;
    const muzzle = getMuzzlePosition(player);
    context.save();
    context.translate(muzzle.x, muzzle.y);
    context.rotate(player.facingRadians);
    context.globalAlpha = intensity;
    context.fillStyle = "#fff7bc";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(24, -10);
    context.lineTo(36, 0);
    context.lineTo(24, 10);
    context.closePath();
    context.fill();
    context.fillStyle = "#ffda4d";
    context.fillRect(0, -4, 28, 8);
    context.restore();
  }
}

function drawRoundedRect(context, x, y, width, height, radius, fillStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}
