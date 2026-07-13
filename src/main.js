import { Game } from "./core/Game.js";

const canvas = document.querySelector("#game-canvas");

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Game canvas was not found.");
}

const game = new Game(canvas);
game.start();

const isLocalDevelopment = ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);

if (isLocalDevelopment && new URLSearchParams(window.location.search).has("debug")) {
  window.__arcadeHorde = game;
}
