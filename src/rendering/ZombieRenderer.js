export class ZombieRenderer {
  #context;

  constructor(context) {
    this.#context = context;
  }

  draw(zombies) {
    for (const zombie of zombies) {
      this.#drawZombie(zombie);
    }
  }

  #drawZombie(zombie) {
    const { x, y } = zombie.position;
    const context = this.#context;
    const phase = zombie.locomotionPhase;
    const bounce = Math.abs(Math.sin(phase)) * -3 + Math.sin(zombie.visualTime * 1.8) * 0.8;
    const wobble = Math.sin(phase * 0.5 + zombie.visualTime * 0.9) * 0.06;

    context.save();
    context.fillStyle = "rgb(10 15 34 / 32%)";
    context.beginPath();
    context.ellipse(x, y + 28, 24, 7, 0, 0, Math.PI * 2);
    context.fill();

    context.translate(x, y + bounce);
    context.rotate(zombie.facingRadians + wobble);
    context.scale(1.05 - Math.abs(Math.sin(phase)) * 0.06, 0.95 + Math.abs(Math.sin(phase)) * 0.06);
    context.fillStyle = zombie.hitFlashRemaining > 0 ? "#fff7bc" : "#73d987";
    context.beginPath();
    context.arc(0, 0, 22, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#263764";
    context.fillRect(8, -13, 8, 7);
    context.fillRect(8, 6, 8, 7);
    context.fillStyle = "#ff6b92";
    context.fillRect(16, -10, 5, 4);
    context.fillRect(16, 6, 5, 4);
    context.strokeStyle = "#355d65";
    context.lineWidth = 6;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(9, -13);
    context.lineTo(25, -25);
    context.moveTo(9, 13);
    context.lineTo(25, 25);
    context.stroke();
    context.restore();

    const healthRatio = zombie.health / 3;
    if (healthRatio < 1) {
      context.fillStyle = "rgb(16 20 43 / 78%)";
      context.fillRect(x - 20, y - 49, 40, 6);
      context.fillStyle = "#ff8a4c";
      context.fillRect(x - 20, y - 49, 40 * healthRatio, 6);
    }
  }
}
