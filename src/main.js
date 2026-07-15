import { Game } from "./core/Game.js";

const canvas = document.querySelector("#game-canvas");

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Game canvas was not found.");
}

const game = new Game(canvas);
game.start();

const gameStage = document.querySelector(".game-stage");
const fullscreenButton = document.querySelector("#fullscreen-button");

if (gameStage instanceof HTMLElement && fullscreenButton instanceof HTMLButtonElement) {
  const updateFullscreenButton = () => {
    const isFullscreen = document.fullscreenElement === gameStage;
    fullscreenButton.setAttribute("aria-label", isFullscreen ? "Exit fullscreen" : "Enter fullscreen");
    fullscreenButton.innerHTML = isFullscreen
      ? 'Exit fullscreen <span aria-hidden="true">×</span>'
      : 'Fullscreen <span aria-hidden="true">⛶</span>';
  };

  fullscreenButton.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === gameStage) {
        await document.exitFullscreen();
      } else {
        await gameStage.requestFullscreen();
      }
    } catch {
      // Fullscreen is optional; browsers can reject it in embedded contexts.
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenButton);
}

const isLocalDevelopment = ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);

if (isLocalDevelopment && new URLSearchParams(window.location.search).has("debug")) {
  window.__arcadeHorde = game;
}
