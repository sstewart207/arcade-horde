export class PickupRenderer {
  #context;

  constructor(context) {
    this.#context = context;
  }

  drawMedkits(medkits) {
    for (const medkit of medkits) {
      const context = this.#context;
      const bob = Math.sin(medkit.age * 4) * 3;
      const x = medkit.position.x;
      const y = medkit.position.y + bob;

      context.fillStyle = "rgb(16 20 43 / 42%)";
      context.beginPath();
      context.ellipse(x, y + 18, 20, 7, 0, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#f6f1d1";
      context.fillRect(x - 16, y - 12, 32, 24);
      context.fillStyle = "#ff6b92";
      context.fillRect(x - 5, y - 9, 10, 18);
      context.fillRect(x - 12, y - 2, 24, 10);
    }
  }
}
