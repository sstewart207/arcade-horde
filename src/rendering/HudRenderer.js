import { Arena, PlayerVitalsTuning } from "../core/Constants.js";

export class HudRenderer {
  #context;

  constructor(context) {
    this.#context = context;
  }

  draw(playerVitals, waveDirector, upgradeDirector, runStats) {
    const context = this.#context;
    const ratio = playerVitals.health / PlayerVitalsTuning.maxHealth;

    context.fillStyle = "rgb(16 20 43 / 72%)";
    context.fillRect(Arena.left + 54, Arena.top + 54, 260, 55);
    context.fillStyle = "#f6f1d1";
    context.font = "700 22px system-ui";
    context.fillText(`JUICE ${playerVitals.health}`, Arena.left + 68, Arena.top + 78);
    context.fillStyle = "#263764";
    context.fillRect(Arena.left + 68, Arena.top + 87, 220, 10);
    context.fillStyle = ratio > 0.3 ? "#ff8a4c" : "#ff6b92";
    context.fillRect(Arena.left + 68, Arena.top + 87, 220 * ratio, 10);

    context.textAlign = "right";
    context.fillStyle = "#f6f1d1";
    context.font = "700 22px system-ui";
    context.fillText(`WAVE ${waveDirector.wave}  ·  KILLS ${runStats.kills}`, Arena.right - 55, Arena.top + 78);

    if (waveDirector.phase === "upgrade") {
      this.#drawUpgradeOffer(upgradeDirector.choices);
    }

    context.textAlign = "start";
  }

  drawGameOver() {
    const context = this.#context;
    context.fillStyle = "rgb(16 20 43 / 72%)";
    context.fillRect(Arena.left, Arena.top, Arena.width, Arena.height);
    context.fillStyle = "#ffda4d";
    context.textAlign = "center";
    context.font = "800 58px system-ui";
    context.fillText("JUICE BOX EMPTY", Arena.centerX, Arena.centerY - 40);
    context.fillStyle = "#f6f1d1";
    context.font = "600 26px system-ui";
    context.fillText("Press R to jump back in", Arena.centerX, Arena.centerY + 14);
    context.textAlign = "start";
  }

  drawStartScreen() {
    const context = this.#context;
    context.fillStyle = "rgb(16 20 43 / 78%)";
    context.fillRect(Arena.left, Arena.top, Arena.width, Arena.height);
    context.textAlign = "center";
    context.fillStyle = "#ffda4d";
    context.font = "800 68px system-ui";
    context.fillText("ARCADE HORDE", Arena.centerX, Arena.centerY - 68);
    context.fillStyle = "#f6f1d1";
    context.font = "600 28px system-ui";
    context.fillText("Survive the waves. Build something ridiculous.", Arena.centerX, Arena.centerY - 18);
    context.fillStyle = "#ff8a4c";
    context.font = "800 28px system-ui";
    context.fillText("Press Enter to start", Arena.centerX, Arena.centerY + 62);
    context.textAlign = "start";
  }

  #drawUpgradeOffer(choices) {
    const context = this.#context;
    const panelWidth = Math.min(980, Arena.width - 120);
    const panelX = Arena.centerX - panelWidth / 2;
    const cardGap = 24;
    const cardWidth = (panelWidth - 86 - cardGap * 2) / 3;
    const panelY = Arena.centerY - 210;
    const cardY = panelY + 100;
    const panelHeight = 400;
    context.fillStyle = "rgb(16 20 43 / 86%)";
    context.fillRect(panelX, panelY, panelWidth, panelHeight);
    context.textAlign = "center";
    context.fillStyle = "#ffda4d";
    context.font = "800 42px system-ui";
    context.fillText("WAVE CLEAR — PICK A POWER", Arena.centerX, panelY + 62);

    choices.forEach((choice, index) => {
      const x = panelX + 43 + index * (cardWidth + cardGap);
      context.fillStyle = "#263764";
      context.fillRect(x, cardY, cardWidth, 220);
      context.strokeStyle = "#f6f1d1";
      context.lineWidth = 3;
      context.strokeRect(x, cardY, cardWidth, 220);
      context.fillStyle = "#ff8a4c";
      context.font = "800 30px system-ui";
      context.fillText(String(index + 1), x + cardWidth / 2, cardY + 46);
      context.fillStyle = "#f6f1d1";
      context.font = "800 22px system-ui";
      context.fillText(choice.name, x + cardWidth / 2, cardY + 98);
      context.font = "600 16px system-ui";
      drawWrappedText(context, choice.description, x + cardWidth / 2, cardY + 136, cardWidth - 38, 22);
    });

    context.fillStyle = "#f6f1d1";
    context.font = "600 20px system-ui";
    context.fillText("Press 1, 2, or 3 to keep the horde coming.", Arena.centerX, panelY + 366);
    context.textAlign = "start";
  }
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = candidate;
    }
  }
  context.fillText(line, x, lineY);
}
