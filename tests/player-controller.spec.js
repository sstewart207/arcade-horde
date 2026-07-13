import { expect, test } from "@playwright/test";

test("player responds to movement, aim, dash, and blaster input", async ({ page }) => {
  await page.goto("/?debug");
  await startRun(page);

  const canvas = page.locator("#game-canvas");
  await expect(canvas).toBeVisible();

  const beforeMovement = await getGameState(page);
  await page.keyboard.down("KeyD");
  await page.waitForTimeout(100);
  await page.keyboard.up("KeyD");
  const afterMovement = await getGameState(page);
  expect(afterMovement.position.x).toBeGreaterThan(beforeMovement.position.x + 10);

  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas has no visible bounds.");
  }

  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2);
  await expect.poll(() => getGameState(page).then((state) => state.facingRadians)).toBeCloseTo(0, 1);

  await page.keyboard.press("Space");
  await expect.poll(() => getGameState(page).then((state) => state.dashCooldownRemaining)).toBeGreaterThan(0.1);

  await page.mouse.down();
  await expect.poll(() => getGameState(page).then((state) => state.projectileCount)).toBeGreaterThan(0);
  await page.mouse.up();
  await expect.poll(
    () => getGameState(page).then((state) => state.impactCount),
    { timeout: 1_000, intervals: [25] },
  ).toBeGreaterThan(0);
});

test("a run waits on the title screen until Enter starts Wave 1", async ({ page }) => {
  await page.goto("/?debug");

  await expect.poll(() => getGameState(page)).toMatchObject({
    isRunActive: false,
    isGameOver: false,
    kills: 0,
    wave: 0,
    zombieCount: 0,
  });

  await page.keyboard.press("Digit1");
  await startRun(page);
  await expect.poll(() => getGameState(page)).toMatchObject({
    isRunActive: true,
    wave: 1,
    wavePhase: "active",
    zombieCount: 4,
    kills: 0,
    upgrades: [],
  });
});

async function getGameState(page) {
  return page.evaluate(() => window.__arcadeHorde.getDebugSnapshot());
}

async function startRun(page) {
  await expect.poll(() => getGameState(page).then((state) => state.isRunActive)).toBe(false);
  await page.keyboard.press("Enter");
  await expect.poll(() => getGameState(page).then((state) => state.isRunActive)).toBe(true);
}

test("blaster damages and defeats chasing zombies", async ({ page }) => {
  await page.goto("/?debug");
  await startRun(page);

  const canvas = page.locator("#game-canvas");
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas has no visible bounds.");
  }

  const initialState = await getGameState(page);
  expect(initialState.zombieCount).toBe(4);

  const firstTarget = initialState.zombies[0];
  await page.mouse.move(
    box.x + (firstTarget.position.x / 1280) * box.width,
    box.y + (firstTarget.position.y / 720) * box.height,
  );
  await page.mouse.down();
  const endTime = Date.now() + 2_500;
  while (Date.now() < endTime) {
    const state = await getGameState(page);
    const target = state.zombies[0];
    if (!target) {
      break;
    }

    await page.mouse.move(
      box.x + (target.position.x / 1280) * box.width,
      box.y + (target.position.y / 720) * box.height,
    );
    await page.waitForTimeout(50);
  }
  await page.mouse.up();

  await expect.poll(() => getGameState(page).then((state) => state.zombieCount)).toBeLessThan(4);
  await expect.poll(() => getGameState(page).then((state) => state.kills)).toBeGreaterThan(0);
});

test("zombie contact can end and restart a run", async ({ page }) => {
  test.setTimeout(15_000);
  await page.goto("/?debug");
  await startRun(page);

  await expect.poll(() => getGameState(page).then((state) => state.health), { timeout: 8_000 }).toBeLessThan(100);
  await expect.poll(() => getGameState(page).then((state) => state.isGameOver), { timeout: 5_000 }).toBe(true);

  await page.keyboard.press("KeyR");
  await expect.poll(() => getGameState(page)).toMatchObject({
    health: 100,
    isGameOver: false,
    isRunActive: true,
    zombieCount: 4,
    wave: 1,
    kills: 0,
    upgrades: [],
  });
});

test("clearing a wave offers an upgrade before escalating the next horde", async ({ page }) => {
  await page.goto("/?debug");
  await startRun(page);
  await expect.poll(() => getGameState(page)).toMatchObject({
    wave: 1,
    wavePhase: "active",
    zombieCount: 4,
  });

  await page.evaluate(() => window.__arcadeHorde.clearZombiesForTesting());
  await expect.poll(() => getGameState(page).then((state) => state.wavePhase)).toBe("upgrade");
  await expect.poll(() => getGameState(page).then((state) => state.upgradeChoices)).toHaveLength(3);

  await page.keyboard.press("Digit2");
  await expect.poll(() => getGameState(page)).toMatchObject({
    wave: 2,
    wavePhase: "active",
    zombieCount: 6,
  });
  await expect.poll(() => getGameState(page).then((state) => state.blaster.projectileDamage)).toBe(2);
  await expect.poll(() => getGameState(page).then((state) => state.upgrades)).toEqual(["heavy-rounds"]);
});

test("combat and upgrade inputs do not leak into later game states", async ({ page }) => {
  test.setTimeout(15_000);
  await page.goto("/?debug");
  await startRun(page);

  await page.keyboard.press("KeyR");
  await expect.poll(() => getGameState(page).then((state) => state.isGameOver), { timeout: 12_000 }).toBe(true);
  await page.waitForTimeout(250);
  await expect(getGameState(page)).resolves.toMatchObject({ isGameOver: true, isRunActive: true });

  await page.keyboard.press("KeyR");
  await expect.poll(() => getGameState(page).then((state) => state.isGameOver)).toBe(false);

  await page.evaluate(() => window.__arcadeHorde.clearZombiesForTesting());
  await expect.poll(() => getGameState(page).then((state) => state.wavePhase)).toBe("upgrade");
  await page.keyboard.press("Space");
  await page.keyboard.press("Digit3");
  await expect.poll(() => getGameState(page)).toMatchObject({ wave: 2, wavePhase: "active" });
  await page.waitForTimeout(100);
  await expect.poll(() => getGameState(page).then((state) => state.dashCooldownRemaining)).toBe(0);
});

test("medkit drops are hurt-only, chance-based, and drought-protected", async ({ page }) => {
  await page.goto("/?debug");

  const result = await page.evaluate(async () => {
    const { PickupSystem } = await import("/src/systems/PickupSystem.js");
    const noDropRoll = () => 0.99;
    const position = { x: 100, y: 100 };
    const hurtPlayer = { health: 70 };
    const fullPlayer = { health: 100 };

    const droughtSystem = new PickupSystem(noDropRoll);
    for (let index = 0; index < 5; index += 1) {
      droughtSystem.onZombieDefeated(position, hurtPlayer);
    }
    const beforeGuarantee = droughtSystem.medkits.length;
    droughtSystem.onZombieDefeated(position, hurtPlayer);

    const fullHealthSystem = new PickupSystem(() => 0);
    fullHealthSystem.onZombieDefeated(position, fullPlayer);

    return {
      beforeGuarantee,
      afterGuarantee: droughtSystem.medkits.length,
      fullHealthDrops: fullHealthSystem.medkits.length,
    };
  });

  expect(result).toEqual({ beforeGuarantee: 0, afterGuarantee: 1, fullHealthDrops: 0 });
});

test("a medkit heals an injured player and is consumed", async ({ page }) => {
  await page.goto("/?debug");
  await startRun(page);

  await page.evaluate(() => {
    window.__arcadeHorde.damagePlayerForTesting();
    window.__arcadeHorde.spawnMedkitForTesting();
  });

  await expect.poll(() => getGameState(page)).toMatchObject({ health: 100, medkitCount: 0 });
});

test("a run progresses through waves, a medkit, death, and restart without stale state", async ({ page }) => {
  test.setTimeout(20_000);
  await page.goto("/?debug");
  await startRun(page);

  await page.evaluate(() => window.__arcadeHorde.clearZombiesForTesting());
  await expect.poll(() => getGameState(page).then((state) => state.wavePhase)).toBe("upgrade");
  await page.keyboard.press("Digit1");
  await expect.poll(() => getGameState(page)).toMatchObject({
    wave: 2,
    wavePhase: "active",
    zombieCount: 6,
    upgrades: ["scattershot"],
  });

  await page.evaluate(() => {
    window.__arcadeHorde.damagePlayerForTesting();
    window.__arcadeHorde.spawnMedkitForTesting();
  });
  await expect.poll(() => getGameState(page)).toMatchObject({ health: 100, medkitCount: 0 });

  await page.evaluate(() => window.__arcadeHorde.clearZombiesForTesting());
  await expect.poll(() => getGameState(page).then((state) => state.wavePhase)).toBe("upgrade");
  await page.keyboard.press("Digit3");
  await expect.poll(() => getGameState(page)).toMatchObject({
    wave: 3,
    wavePhase: "active",
    zombieCount: 8,
    upgrades: ["scattershot", "blood-rounds"],
  });

  for (let hit = 0; hit < 4; hit += 1) {
    await page.evaluate(() => window.__arcadeHorde.damagePlayerForTesting());
    await page.waitForTimeout(650);
  }
  await expect.poll(() => getGameState(page).then((state) => state.isGameOver)).toBe(true);

  await page.keyboard.press("KeyR");
  await expect.poll(() => getGameState(page)).toMatchObject({
    health: 100,
    isGameOver: false,
    isRunActive: true,
    kills: 0,
    wave: 1,
    wavePhase: "active",
    zombieCount: 4,
    medkitCount: 0,
    upgrades: [],
    blaster: {
      shotCount: 1,
      projectileDamage: 1,
      healthOnKill: 0,
    },
  });
});
