import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const root = '[data-waterfall="root"]';

for (const width of [375, 768, 1280]) {
  test(`AC2 — at ${width}px it spans the top of the field down to just above the Introduction banner`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const field = (await page
      .locator('[data-testid="soccer-field"]')
      .boundingBox())!;
    const wf = (await page.locator(root).boundingBox())!;
    const banner = (await page
      .locator("#hero [data-title-banner]")
      .boundingBox())!;
    expect(Math.abs(wf.y - field.y)).toBeLessThanOrEqual(6);
    expect(wf.width).toBeGreaterThan(field.width * 0.95);
    expect(wf.y + wf.height).toBeLessThanOrEqual(banner.y + 1);
    // The banner stays visible and clickable through nothing.
    const hit = await page.evaluate(
      ({ x, y }) =>
        document.elementFromPoint(x, y)?.closest("[data-title-banner]") !==
        null,
      { x: banner.x + banner.width / 2, y: banner.y + banner.height / 2 },
    );
    expect(hit).toBe(true);
  });
}

test("AC3 — the water moves with CSS animations", async ({ page }) => {
  await page.goto("/");
  const count = await page
    .locator(root)
    .evaluate((el) => el.getAnimations({ subtree: true }).length);
  expect(count).toBeGreaterThan(5);
});

test("AC4 — the water stands still with prefers-reduced-motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(root)).toBeVisible();
  const count = await page
    .locator(root)
    .evaluate((el) => el.getAnimations({ subtree: true }).length);
  expect(count).toBe(0);
});

test("AC5 — decorative: hidden from assistive tech and never focused", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(root)).toHaveAttribute("aria-hidden", "true");
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        (sel) => document.activeElement?.closest(sel) !== null,
        root,
      ),
    ).toBe(false);
  }
});

test("an axe scan finds no serious issues", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("visual check screenshots (375px and 1280px)", async ({
  page,
}, testInfo) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const field = (await page
      .locator('[data-testid="soccer-field"]')
      .boundingBox())!;
    await page.screenshot({
      path: `test-results/soc-22-waterfall-${testInfo.project.name}-${width}.png`,
      clip: { x: field.x, y: field.y, width: field.width, height: 420 },
    });
  }
});
