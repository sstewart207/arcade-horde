import { Arena } from "./Constants.js";
import { Input } from "./Input.js";
import { Viewport } from "./Viewport.js";
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
import { PickupSystem } from "../systems/PickupSystem.js";
import { Renderer } from "../rendering/Renderer.js";

export class Game {
  #canvas;
  #viewport;
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
  #pickupSystem;
  #isGameOver = false;
  #isRunActive = false;
  #renderer;
  #lastFrameTime = 0;
  #animationFrameId = 0;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#viewport = new Viewport(canvas);
    this.#input = new Input(canvas, this.#viewport);
    this.#combatSystem = new CombatSystem();
    this.#contactDamageSystem = new ContactDamageSystem();
    this.#renderer = new Renderer(canvas, this.#viewport);
    this.#startRun();
    window.addEventListener("resize", this.#constrainEntitiesToArena);
  }

  start() {
    this.#animationFrameId = requestAnimationFrame(this.#frame);
  }

  stop() {
    cancelAnimationFrame(this.#animationFrameId);
    this.#input.destroy();
    this.#viewport.destroy();
    window.removeEventListener("resize", this.#constrainEntitiesToArena);
  }

  getDebugSnapshot() {
    return {
      position: { ...this.#player.position },
      arena: { width: Arena.width, height: Arena.height },
      velocity: { ...this.#player.velocity },
      health: this.#playerVitals.health,
      isGameOver: this.#isGameOver,
      isRunActive: this.#isRunActive,
      kills: this.#runStats.kills,
      facingRadians: this.#player.facingRadians,
      moveFacingRadians: this.#player.moveFacingRadians,
      locomotion: this.#player.locomotion,
      dashTrailCount: this.#player.dashTrail.length,
      isDashing: this.#player.isDashing,
      dashCooldownRemaining: this.#player.dashCooldownRemaining,
      projectileCount: this.#projectileSystem.projectiles.length,
      medkitCount: this.#pickupSystem.medkits.length,
      medkits: this.#pickupSystem.medkits.map((medkit) => ({ position: { ...medkit.position } })),
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
        recoilRemaining: this.#blaster.recoilRemaining,
        shotId: this.#blaster.shotId,
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
      } else {
        this.#input.consumeDashRequest();
        this.#input.consumeRestartRequest();
        this.#input.consumeUpgradeChoice();
      }
    } else {
      this.#input.consumeRestartRequest();
      this.#input.consumeStartRequest();
      if (this.#waveDirector.phase === "upgrade") {
        const choice = this.#input.consumeUpgradeChoice();
        if (choice !== null && this.#upgradeDirector.choose(choice, this.#blaster)) {
          this.#input.clearActionRequests();
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
          this.#pickupSystem,
        );
        this.#pickupSystem.update(deltaSeconds, this.#player, this.#playerVitals);
        this.#contactDamageSystem.update(deltaSeconds, this.#player, this.#playerVitals, this.#enemySystem);
        this.#waveDirector.update(this.#enemySystem);
        if (this.#waveDirector.phase === "upgrade") {
          this.#input.clearActionRequests();
        }
        this.#isGameOver = this.#playerVitals.isDefeated;
      }
    }

    this.#renderer.render(
      this.#player,
      this.#playerVitals,
      this.#blaster,
      this.#projectileSystem,
      this.#pickupSystem,
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
    this.#pickupSystem = new PickupSystem();
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
    this.#input.clearActionRequests();
    this.#waveDirector.start(this.#enemySystem);
    this.#isRunActive = true;
  }

  clearZombiesForTesting() {
    this.#enemySystem.clearForTesting();
  }

  spawnMedkitForTesting(position = this.#player.position) {
    this.#pickupSystem.spawnForTesting(position);
  }

  damagePlayerForTesting() {
    this.#playerVitals.takeDamage(25);
  }

  #constrainEntitiesToArena = () => {
    const edge = Arena.padding + this.#player.radius;
    this.#player.position.x = clamp(this.#player.position.x, edge, Arena.width - edge);
    this.#player.position.y = clamp(this.#player.position.y, edge, Arena.height - edge);
    this.#enemySystem.clampToArena();
    this.#pickupSystem.clampToArena();
  };
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}
