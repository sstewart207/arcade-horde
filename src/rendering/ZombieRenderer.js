export class ZombieRenderer {
  #context;
  #sprite;

  constructor(context, sprite) {
    this.#context = context;
    this.#sprite = sprite;
  }

  draw(zombies) {
    for (const zombie of zombies) {
      this.#drawZombie(zombie);
    }
  }

  #drawZombie(zombie) {
    const { x, y } = zombie.position;
    const context = this.#context;

    if (this.#sprite.complete && this.#sprite.naturalWidth > 0) {
      context.save();
      context.translate(x, y);
      context.rotate(zombie.facingRadians + Math.PI / 2);
      context.drawImage(this.#sprite, -72, -72, 144, 144);
      context.restore();
    }

    const healthRatio = zombie.health / 3;
    context.fillStyle = "#263764";
    context.fillRect(x - 17, y - 50, 34, 5);
    context.fillStyle = "#ff8a4c";
    context.fillRect(x - 17, y - 50, 34 * healthRatio, 5);
  }
}
