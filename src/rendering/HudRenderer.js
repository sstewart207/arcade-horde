import { PlayerVitalsTuning } from "../core/Constants.js";

export class HudRenderer {
  #context;

  constructor(context) {
    this.#context = context;
  }

  draw(playerVitals, waveDirector) {
    const context = this.#context;
    const ratio = playerVitals.health / PlayerVitalsTuning.maxHealth;

    context.fillStyle = "rgb(16 20 43 / 72%)";
    context.fillRect(54, 54, 260, 55);
    context.fillStyle = "#f6f1d1";
    context.font = "700 22px system-ui";
    context.fillText(`JUICE ${playerVitals.health}`, 68, 78);
    context.fillStyle = "#263764";
    context.fillRect(68, 87, 220, 10);
    context.fillStyle = ratio > 0.3 ? "#ff8a4c" : "#ff6b92";
    context.fillRect(68, 87, 220 * ratio, 10);

    context.textAlign = "right";
    context.fillStyle = "#f6f1d1";
    context.font = "700 22px system-ui";
    context.fillText(`WAVE ${waveDirector.wave}`, 1225, 78);

    if (waveDirector.phase === "clear") {
      context.textAlign = "center";
      context.fillStyle = "#ffda4d";
      context.font = "800 34px system-ui";
      context.fillText("WAVE CLEAR!", 640, 112);
      context.fillStyle = "#f6f1d1";
      context.font = "600 18px system-ui";
      context.fillText("Get ready...", 640, 140);
    }

    context.textAlign = "start";
  }

  drawGameOver() {
    const context = this.#context;
    context.fillStyle = "rgb(16 20 43 / 72%)";
    context.fillRect(0, 0, 1280, 720);
    context.fillStyle = "#ffda4d";
    context.textAlign = "center";
    context.font = "800 58px system-ui";
    context.fillText("JUICE BOX EMPTY", 640, 320);
    context.fillStyle = "#f6f1d1";
    context.font = "600 26px system-ui";
    context.fillText("Press R to jump back in", 640, 374);
    context.textAlign = "start";
  }
}
