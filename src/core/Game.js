import { Arena } from "./Constants.js";
import { Input } from "./Input.js";
import { Player } from "../entities/Player.js";
import { Blaster } from "../entities/Blaster.js";
import { PlayerVitals } from "../entities/PlayerVitals.js";
import { RunStats } from "../entities/RunStats.js";
import { PlayerController } from "../systems/PlayerController.js";
import { CombatSystem } from "../systems/CombatSystem.js";
import { EnemySystem } from "../systems/EnemySystem.js";
import { ContactDamageSystem } from "../systems/ContactDamageSystem.js";
import { WaveDirector } from "../systems/WaveDirector.js";
import { ProjectileSystem } from "../systems/ProjectileSystem.js";
import { WeaponController } from "../systems/WeaponController.js";
import { UpgradeDirector } from "../systems/UpgradeDirector.js";
import { Renderer } from "../rendering/Renderer.js";

export class Game {
  #canvas;
  #input;
  #player;
  #playerVitals;
  #runStats;
  #blaster;
  #playerController;
  #projectileSystem;
  #weaponController;
  #enemySystem;
  #combatSystem;
  #contactDamageSystem;
  #waveDirector;
  #upgradeDirector;
  #isGameOver = false;
  #isRunActive = false;
  #renderer;
  #lastFrameTime = 0;
  #animationFrameId = 0;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#input = new Input(canvas);
    this.#combatSystem = new CombatSystem();
    this.#contactDamageSystem = new ContactDamageSystem();
    this.#renderer = new Renderer(canvas);
    this.#startRun();
  }

  start() {
    this.#animationFrameId = requestAnimationFrame(this.#frame);
  }

  stop() {
    cancelAnimationFrame(this.#animationFrameId);
    this.#input.destroy();
  }

  getDebugSnapshot() {
    return {
      position: { ...this.#player.position },
      health: this.#playerVitals.health,
      isGameOver: this.#isGameOver,
      isRunActive: this.#isRunActive,
      kills: this.#runStats.kills,
      facingRadians: this.#player.facingRadians,
      isDashing: this.#player.isDashing,
      dashCooldownRemaining: this.#player.dashCooldownRemaining,
      projectileCount: this.#projectileSystem.projectiles.length,
      impactCount: this.#projectileSystem.impacts.length,
      muzzleFlashRemaining: this.#blaster.muzzleFlashRemaining,
      zombieCount: this.#enemySystem.zombies.length,
      wave: this.#waveDirector.wave,
      wavePhase: this.#waveDirector.phase,
      upgradeChoices: this.#waveDirector.phase === "upgrade"
        ? this.#upgradeDirector.choices.map(({ id, name, description }) => ({ id, name, description }))
        : [],
      upgrades: [...this.#upgradeDirector.picks],
      blaster: {
        shotCount: this.#blaster.shotCount,
        projectileDamage: this.#blaster.projectileDamage,
        healthOnKill: this.#blaster.healthOnKill,
      },
      zombies: this.#enemySystem.zombies.map((zombie) => ({
        position: { ...zombie.position },
        health: zombie.health,
      })),
    };
  }

  #frame = (timestamp) => {
    const deltaSeconds = Math.min((timestamp - this.#lastFrameTime) / 1000, 0.05);
    this.#lastFrameTime = timestamp;

    if (this.#isGameOver) {
      if (this.#input.consumeRestartRequest()) {
        this.#startRun(true);
      }
    } else if (!this.#isRunActive) {
      if (this.#input.consumeStartRequest()) {
        this.#beginRun();
      }
    } else {
      if (this.#waveDirector.phase === "upgrade") {
        const choice = this.#input.consumeUpgradeChoice();
        if (choice !== null && this.#upgradeDirector.choose(choice, this.#blaster)) {
          this.#waveDirector.startNextWave(this.#enemySystem);
        }
      } else {
        this.#input.consumeUpgradeChoice();
        this.#playerController.update(deltaSeconds);
        this.#weaponController.update(deltaSeconds, this.#player);
        this.#projectileSystem.update(deltaSeconds);
        this.#enemySystem.update(deltaSeconds, this.#player);
        this.#combatSystem.update(
          this.#projectileSystem,
          this.#enemySystem,
          this.#playerVitals,
          this.#blaster,
          this.#runStats,
        );
        this.#contactDamageSystem.update(deltaSeconds, this.#player, this.#playerVitals, this.#enemySystem);
        this.#waveDirector.update(this.#enemySystem);
        this.#isGameOver = this.#playerVitals.isDefeated;
      }
    }

    this.#renderer.render(
      this.#player,
      this.#playerVitals,
      this.#blaster,
      this.#projectileSystem,
      this.#enemySystem,
      this.#waveDirector,
      this.#upgradeDirector,
      this.#runStats,
      this.#isGameOver,
      this.#isRunActive,
    );

    this.#animationFrameId = requestAnimationFrame(this.#frame);
  };

  #startRun(startImmediately = false) {
    this.#player = new Player(Arena.width / 2, Arena.height / 2);
    this.#playerVitals = new PlayerVitals();
    this.#blaster = new Blaster();
    this.#projectileSystem = new ProjectileSystem();
    this.#enemySystem = new EnemySystem();
    this.#waveDirector = new WaveDirector();
    this.#upgradeDirector = new UpgradeDirector();
    this.#runStats = new RunStats();
    this.#playerController = new PlayerController(this.#player, this.#input);
    this.#weaponController = new WeaponController(this.#blaster, this.#input, this.#projectileSystem);
    this.#isGameOver = false;
    this.#isRunActive = false;
    if (startImmediately) {
      this.#beginRun();
    }
  }

  #beginRun() {
    this.#waveDirector.start(this.#enemySystem);
    this.#isRunActive = true;
  }

  clearZombiesForTesting() {
    this.#enemySystem.clearForTesting();
  }
}
