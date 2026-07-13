export class ProjectileRenderer {
  #context;

  constructor(context) {
    this.#context = context;
  }

  drawProjectiles(projectiles) {
    for (const projectile of projectiles) {
      const context = this.#context;
      context.fillStyle = "#ff8a4c";
      context.beginPath();
      context.arc(projectile.position.x, projectile.position.y, projectile.radius + 5, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#fff7bc";
      context.beginPath();
      context.arc(projectile.position.x, projectile.position.y, projectile.radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawImpacts(impacts) {
    for (const impact of impacts) {
      const size = 8 + impact.progress * 34;
      const alpha = 1 - impact.progress;
      const context = this.#context;
      context.strokeStyle = `rgb(255 218 77 / ${alpha})`;
      context.lineWidth = 4 * alpha;
      context.beginPath();
      context.arc(impact.position.x, impact.position.y, size, 0, Math.PI * 2);
      context.stroke();
    }
  }
}

