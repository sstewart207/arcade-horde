import { WaveTuning } from "../core/Constants.js";

export class WaveDirector {
  wave = 0;
  phase = "starting";
  phaseTimeRemaining = 0;

  start(enemySystem) {
    this.wave = 1;
    this.#startWave(enemySystem);
  }

  update(enemySystem) {
    if (this.phase === "active" && enemySystem.zombies.length === 0) {
      this.phase = "upgrade";
    }
  }

  startNextWave(enemySystem) {
    if (this.phase !== "upgrade") {
      return false;
    }

    this.wave += 1;
    this.#startWave(enemySystem);
    return true;
  }

  #startWave(enemySystem) {
    const enemyCount = WaveTuning.baseEnemyCount + (this.wave - 1) * WaveTuning.enemiesPerWave;
    const speedMultiplier = 1 + (this.wave - 1) * WaveTuning.speedIncreasePerWave;
    enemySystem.spawnWave(enemyCount, speedMultiplier);
    this.phase = "active";
  }
}
