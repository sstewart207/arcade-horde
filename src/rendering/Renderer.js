import { Arena } from "../core/Constants.js";
import { PlayerRenderer } from "./PlayerRenderer.js";
import { ProjectileRenderer } from "./ProjectileRenderer.js";
import { ZombieRenderer } from "./ZombieRenderer.js";
import { HudRenderer } from "./HudRenderer.js";
import { PickupRenderer } from "./PickupRenderer.js";

export class Renderer {
  #context;
  #canvas;
  #viewport;
  #playerRenderer;
  #projectileRenderer;
  #zombieRenderer;
  #hudRenderer;
  #pickupRenderer;

  constructor(canvas, viewport) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("A 2D canvas context is required.");
    }

    this.#context = context;
    this.#canvas = canvas;
    this.#viewport = viewport;
    this.#playerRenderer = new PlayerRenderer(context);
    this.#projectileRenderer = new ProjectileRenderer(context);
    this.#zombieRenderer = new ZombieRenderer(context);
    this.#hudRenderer = new HudRenderer(context);
    this.#pickupRenderer = new PickupRenderer(context);
  }

  render(player, playerVitals, blaster, projectileSystem, pickupSystem, enemySystem, waveDirector, upgradeDirector, runStats, isGameOver, isRunActive) {
    this.#context.setTransform(1, 0, 0, 1, 0, 0);
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    const scale = this.#viewport.scale * this.#viewport.pixelRatio;
    this.#context.setTransform(scale, 0, 0, scale, -Arena.left * scale, -Arena.top * scale);
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
    const { left, top, right, bottom, width, height, padding } = Arena;
    const context = this.#context;

    context.fillStyle = "#263764";
    context.fillRect(left, top, width, height);

    context.strokeStyle = "rgb(246 241 209 / 12%)";
    context.lineWidth = 2;
    for (let x = firstGridLine(left, padding); x < right - padding; x += 64) {
      context.beginPath();
      context.moveTo(x, top + padding);
      context.lineTo(x, bottom - padding);
      context.stroke();
    }
    for (let y = firstGridLine(top, padding); y < bottom - padding; y += 64) {
      context.beginPath();
      context.moveTo(left + padding, y);
      context.lineTo(right - padding, y);
      context.stroke();
    }

    context.strokeStyle = "#f6f1d1";
    context.lineWidth = 4;
    context.strokeRect(left + padding, top + padding, width - padding * 2, height - padding * 2);
  }
}

function firstGridLine(edge, padding) {
  return padding + Math.ceil((edge - padding) / 64) * 64;
}
