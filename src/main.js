import { Game } from "./core/Game.js";

const canvas = document.querySelector("#game-canvas");

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Game canvas was not found.");
}

const game = new Game(canvas);
game.start();

if (new URLSearchParams(window.location.search).has("debug")) {
  window.__arcadeHorde = game;
}
