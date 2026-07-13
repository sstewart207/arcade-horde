import { Arena } from "../core/Constants.js";
import { PlayerRenderer } from "./PlayerRenderer.js";
import { ProjectileRenderer } from "./ProjectileRenderer.js";
import { ZombieRenderer } from "./ZombieRenderer.js";
import { HudRenderer } from "./HudRenderer.js";
import { SpriteAssets } from "./SpriteAssets.js";
import { PickupRenderer } from "./PickupRenderer.js";

export class Renderer {
  #context;
  #playerRenderer;
  #projectileRenderer;
  #zombieRenderer;
  #hudRenderer;
  #pickupRenderer;

  constructor(canvas) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("A 2D canvas context is required.");
    }

    this.#context = context;
    const sprites = new SpriteAssets();
    this.#playerRenderer = new PlayerRenderer(context, sprites.player);
    this.#projectileRenderer = new ProjectileRenderer(context);
    this.#zombieRenderer = new ZombieRenderer(context, sprites.zombie);
    this.#hudRenderer = new HudRenderer(context);
    this.#pickupRenderer = new PickupRenderer(context);
  }

  render(player, playerVitals, blaster, projectileSystem, pickupSystem, enemySystem, waveDirector, upgradeDirector, runStats, isGameOver, isRunActive) {
    this.#context.clearRect(0, 0, Arena.width, Arena.height);
    this.#drawArena();
    this.#zombieRenderer.draw(enemySystem.zombies);
    this.#projectileRenderer.drawImpacts(enemySystem.defeatBursts);
    this.#projectileRenderer.drawImpacts(projectileSystem.impacts);
    this.#pickupRenderer.drawMedkits(pickupSystem.medkits);
    this.#projectileRenderer.drawProjectiles(projectileSystem.projectiles);
    this.#playerRenderer.draw(player, blaster, playerVitals);
    this.#hudRenderer.draw(playerVitals, waveDirector, upgradeDirector, runStats);
    if (isGameOver) {
      this.#hudRenderer.drawGameOver();
    } else if (!isRunActive) {
      this.#hudRenderer.drawStartScreen();
    }
  }

  #drawArena() {
    const { width, height, padding } = Arena;
    const context = this.#context;

    context.fillStyle = "#263764";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "rgb(246 241 209 / 12%)";
    context.lineWidth = 2;
    for (let x = padding; x < width - padding; x += 64) {
      context.beginPath();
      context.moveTo(x, padding);
      context.lineTo(x, height - padding);
      context.stroke();
    }
    for (let y = padding; y < height - padding; y += 64) {
      context.beginPath();
      context.moveTo(padding, y);
      context.lineTo(width - padding, y);
      context.stroke();
    }

    context.strokeStyle = "#f6f1d1";
    context.lineWidth = 4;
    context.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
  }
}
