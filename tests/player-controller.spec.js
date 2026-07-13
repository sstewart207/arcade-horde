import { expect, test } from "@playwright/test";

test("player responds to movement, aim, dash, and blaster input", async ({ page }) => {
  await page.goto("/?debug");

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

async function getGameState(page) {
  return page.evaluate(() => window.__arcadeHorde.getDebugSnapshot());
}

test("blaster damages and defeats chasing zombies", async ({ page }) => {
  await page.goto("/?debug");

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
});

test("zombie contact can end and restart a run", async ({ page }) => {
  test.setTimeout(15_000);
  await page.goto("/?debug");

  await expect.poll(() => getGameState(page).then((state) => state.health), { timeout: 8_000 }).toBeLessThan(100);
  await expect.poll(() => getGameState(page).then((state) => state.isGameOver), { timeout: 5_000 }).toBe(true);

  await page.keyboard.press("KeyR");
  await expect.poll(() => getGameState(page)).toMatchObject({
    health: 100,
    isGameOver: false,
    zombieCount: 4,
    wave: 1,
  });
});

test("clearing a wave escalates the next horde", async ({ page }) => {
  await page.goto("/?debug");
  await expect.poll(() => getGameState(page)).toMatchObject({
    wave: 1,
    wavePhase: "active",
    zombieCount: 4,
  });

  await page.evaluate(() => window.__arcadeHorde.clearZombiesForTesting());
  await expect.poll(() => getGameState(page).then((state) => state.wavePhase)).toBe("clear");
  await expect.poll(() => getGameState(page)).toMatchObject({
    wave: 2,
    wavePhase: "active",
    zombieCount: 6,
  });
});
