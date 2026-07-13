export const Arena = Object.freeze({
  width: 1280,
  height: 720,
  padding: 32,
});

export const PlayerTuning = Object.freeze({
  radius: 22,
  moveSpeed: 340,
  dashSpeed: 1080,
  dashDuration: 0.15,
  dashCooldown: 0.75,
});

export const BlasterTuning = Object.freeze({
  fireInterval: 0.16,
  projectileSpeed: 980,
  projectileRadius: 7,
  muzzleFlashDuration: 0.06,
  impactDuration: 0.22,
});

export const ZombieTuning = Object.freeze({
  radius: 24,
  moveSpeed: 86,
  health: 3,
  contactDistance: 8,
});

export const PlayerVitalsTuning = Object.freeze({
  maxHealth: 100,
  contactDamage: 25,
  damageCooldown: 0.6,
});

export const WaveTuning = Object.freeze({
  baseEnemyCount: 4,
  enemiesPerWave: 2,
  speedIncreasePerWave: 0.12,
  clearDuration: 1.2,
});

export const MedkitTuning = Object.freeze({
  radius: 17,
  healAmount: 25,
  minimumMissingHealth: 20,
  dropChance: 0.2,
  maximumKillsWithoutDrop: 6,
});
