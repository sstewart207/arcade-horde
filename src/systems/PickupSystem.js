import { Arena, MedkitTuning, PlayerVitalsTuning } from "../core/Constants.js";
import { Medkit } from "../entities/Medkit.js";

export class PickupSystem {
  medkits = [];
  #random;
  #killsSinceLastDrop = 0;

  constructor(random = Math.random) {
    this.#random = random;
  }

  onZombieDefeated(position, playerVitals) {
    const isMeaningfullyHurt = playerVitals.health <= PlayerVitalsTuning.maxHealth - MedkitTuning.minimumMissingHealth;
    if (!isMeaningfullyHurt) {
      this.#killsSinceLastDrop = 0;
      return;
    }

    if (this.medkits.length > 0) {
      return;
    }

    this.#killsSinceLastDrop += 1;
    const isGuaranteed = this.#killsSinceLastDrop >= MedkitTuning.maximumKillsWithoutDrop;
    if (!isGuaranteed && this.#random() >= MedkitTuning.dropChance) {
      return;
    }

    this.medkits.push(new Medkit(position));
    this.#killsSinceLastDrop = 0;
  }

  update(deltaSeconds, player, playerVitals) {
    for (const medkit of this.medkits) {
      medkit.tick(deltaSeconds);
    }

    this.medkits = this.medkits.filter((medkit) => {
      if (!isTouching(player, medkit)) {
        return true;
      }

      return !playerVitals.heal(MedkitTuning.healAmount);
    });
  }

  spawnForTesting(position) {
    this.medkits.push(new Medkit(position));
  }

  clampToArena() {
    for (const medkit of this.medkits) {
      const edge = Arena.padding + medkit.radius;
      medkit.position.x = clamp(medkit.position.x, edge, Arena.width - edge);
      medkit.position.y = clamp(medkit.position.y, edge, Arena.height - edge);
    }
  }
}

function isTouching(player, medkit) {
  return Math.hypot(
    player.position.x - medkit.position.x,
    player.position.y - medkit.position.y,
  ) <= player.radius + medkit.radius;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}
