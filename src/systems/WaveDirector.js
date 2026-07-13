import { WaveTuning } from "../core/Constants.js";

export class WaveDirector {
  wave = 0;
  phase = "starting";
  phaseTimeRemaining = 0;

  start(enemySystem) {
    this.wave = 1;
    this.#startWave(enemySystem);
  }

  update(deltaSeconds, enemySystem) {
    if (this.phase === "active" && enemySystem.zombies.length === 0) {
      this.phase = "clear";
      this.phaseTimeRemaining = WaveTuning.clearDuration;
      return;
    }

    if (this.phase !== "clear") {
      return;
    }

    this.phaseTimeRemaining = Math.max(0, this.phaseTimeRemaining - deltaSeconds);
    if (this.phaseTimeRemaining === 0) {
      this.wave += 1;
      this.#startWave(enemySystem);
    }
  }

  #startWave(enemySystem) {
    const enemyCount = WaveTuning.baseEnemyCount + (this.wave - 1) * WaveTuning.enemiesPerWave;
    const speedMultiplier = 1 + (this.wave - 1) * WaveTuning.speedIncreasePerWave;
    enemySystem.spawnWave(enemyCount, speedMultiplier);
    this.phase = "active";
  }
}

