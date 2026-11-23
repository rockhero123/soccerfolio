// These tests use Playwright's own `test`, not the shared fixtures, which
// skip the theater.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const theater = "[data-theater]";
const begin = "Start";

test.beforeEach(async ({ page }) => {
  // Keep YouTube out of the tests: the page must work without it (AC5).
  await page.route(/youtube(-nocookie)?\.com|ytimg\.com/, (route) => route.abort());
});

for (const width of [375, 768, 1280]) {
  test(`at ${width}px the closed curtain covers the whole page, poster above the button`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const dialog = page.locator(theater);
    await expect(dialog).toBeVisible();
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBe(0);
    expect(box.y).toBe(0);
    expect(box.width).toBe(width);
    expect(box.height).toBe(800);
    await expect(page.getByRole("button", { name: begin })).toBeVisible();
    const poster = (await page.locator(`${theater} [data-theater-poster]`).boundingBox())!;
    const button = (await page.getByRole("button", { name: begin }).boundingBox())!;
    expect(poster.y + poster.height).toBeLessThan(button.y);
    expect(poster.x).toBeGreaterThanOrEqual(0);
    expect(poster.x + poster.width).toBeLessThanOrEqual(width);
    // The button stands on the curtain, above the stage.
    const stage = (await page.locator(`${theater} [data-theater-stalls]`).boundingBox())!;
    expect(button.y + button.height).toBeLessThan(stage.y);
    // The curtain is what the visitor sees, not the header.
    const top = await page.evaluate(() =>
      document.elementFromPoint(innerWidth / 2, 60)?.closest("[data-theater]") !== null,
    );
    expect(top).toBe(true);
  });
}

test("it is a modal dialog named by its poster, with focus on 'Start', and the page does not scroll", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Ready to start the match?" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: begin })).toBeFocused();
  expect(await dialog.evaluate((el) => el.matches(":modal"))).toBe(true);
  await page.mouse.wheel(0, 800);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("'Start' lifts the curtain smoothly and reveals the portfolio", async ({
  page,
}) => {
  await page.goto("/");
  const drapes = page.locator(`${theater} [data-theater-drapes]`);
  const startBottom = (await drapes.boundingBox())!.y + (await drapes.boundingBox())!.height;
  await page.getByRole("button", { name: begin }).click();
  // Mid-way the curtain is on its way up: higher than it was, not gone.
  await page.waitForTimeout(600);
  const mid = await drapes.boundingBox();
  expect(mid).not.toBeNull();
  expect(mid!.y + mid!.height).toBeLessThan(startBottom - 50);
  // Then the theater is removed and the page is usable.
  await expect(page.locator(theater)).toHaveCount(0, { timeout: 4000 });
  await expect(page.locator("header")).toBeInViewport();
  const covered = await page.evaluate(
    () => document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest("main") === null,
  );
  expect(covered).toBe(false);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test("Escape enters without music", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: begin })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(theater)).toHaveCount(0, { timeout: 4000 });
});

test("every reload shows the closed curtain again", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: begin }).click();
  await expect(page.locator(theater)).toHaveCount(0, { timeout: 4000 });
  await page.reload();
  await expect(page.locator(theater)).toBeVisible();
  await expect(page.getByRole("button", { name: begin })).toBeFocused();
});

test("with reduced motion the curtain is removed at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: begin }).click();
  await expect(page.locator(theater)).toHaveCount(0, { timeout: 500 });
});

test("an axe scan of the theater finds no serious issues", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(theater)).toBeVisible();
  const results = await new AxeBuilder({ page }).include(theater).analyze();
  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
