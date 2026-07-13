import { BlasterTuning } from "../core/Constants.js";

export class Blaster {
  cooldownRemaining = 0;
  muzzleFlashRemaining = 0;
  shotCount = 1;
  projectileDamage = 1;
  healthOnKill = 0;

  get canFire() {
    return this.cooldownRemaining <= 0;
  }

  tryFire() {
    if (!this.canFire) {
      return false;
    }

    this.cooldownRemaining = BlasterTuning.fireInterval;
    this.muzzleFlashRemaining = BlasterTuning.muzzleFlashDuration;
    return true;
  }

  tick(deltaSeconds) {
    this.cooldownRemaining = Math.max(0, this.cooldownRemaining - deltaSeconds);
    this.muzzleFlashRemaining = Math.max(0, this.muzzleFlashRemaining - deltaSeconds);
  }
}
