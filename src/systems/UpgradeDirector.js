const upgrades = Object.freeze([
  {
    id: "scattershot",
    name: "SCATTERSHOT",
    description: "+2 blaster shots in a tight spread.",
    apply(blaster) {
      blaster.shotCount += 2;
    },
  },
  {
    id: "heavy-rounds",
    name: "HEAVY ROUNDS",
    description: "+1 damage per blaster shot.",
    apply(blaster) {
      blaster.projectileDamage += 1;
    },
  },
  {
    id: "blood-rounds",
    name: "BLOOD ROUNDS",
    description: "Heal 6 JUICE for every zombie defeated.",
    apply(blaster) {
      blaster.healthOnKill += 6;
    },
  },
]);

export class UpgradeDirector {
  picks = [];

  get choices() {
    return upgrades;
  }

  choose(choiceIndex, blaster) {
    const upgrade = upgrades[choiceIndex];
    if (!upgrade) {
      return null;
    }

    upgrade.apply(blaster);
    this.picks.push(upgrade.id);
    return upgrade;
  }
}
