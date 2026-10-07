import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const mirror = '[data-mirror="frame"]';
const sign = "[data-intro-sign]";

for (const width of [768, 1280]) {
  test(`AC3 — at ${width}px the sign comes out from behind the mirror, beside it`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const m = (await page.locator(mirror).boundingBox())!;
    const s = (await page.locator(sign).boundingBox())!;
    // It starts behind the mirror's right edge and extends well past it.
    expect(s.x).toBeLessThan(m.x + m.width);
    expect(s.x + s.width).toBeGreaterThan(m.x + m.width + 200);
    // Side by side: their vertical ranges overlap.
    expect(s.y).toBeLessThan(m.y + m.height);
    expect(s.y + s.height).toBeGreaterThan(m.y);
    // The mirror sits on top, so the sign appears to come out from behind it.
    const onTop = await page.evaluate(
      ({ x, y }) =>
        document.elementFromPoint(x, y)?.closest('[data-mirror="frame"]') !==
        null,
      { x: s.x + 8, y: s.y + s.height / 2 },
    );
    expect(onTop).toBe(true);
    // The engraved text itself is never covered by the mirror.
    const text = (await page.locator(`${sign} p`).boundingBox())!;
    expect(text.x).toBeGreaterThan(m.x + m.width);
  });
}

test("AC3 — at 375px the sign stacks under the mirror, tucked beneath it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const m = (await page.locator(mirror).boundingBox())!;
  const s = (await page.locator(sign).boundingBox())!;
  // It starts just under the mirror's bottom edge (they overlap) and continues below.
  expect(s.y).toBeLessThan(m.y + m.height);
  expect(s.y + s.height).toBeGreaterThan(m.y + m.height + 100);
  const text = (await page.locator(`${sign} p`).boundingBox())!;
  expect(text.y).toBeGreaterThan(m.y + m.height);
});

for (const width of [375, 768, 1280]) {
  test(`AC3 — at ${width}px nothing overflows`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const s = (await page.locator(sign).boundingBox())!;
    const text = (await page.locator(`${sign} p`).boundingBox())!;
    expect(s.x).toBeGreaterThanOrEqual(0);
    expect(s.x + s.width).toBeLessThanOrEqual(width);
    // The engraved text stays inside the plank.
    expect(text.x).toBeGreaterThanOrEqual(s.x);
    expect(text.x + text.width).toBeLessThanOrEqual(s.x + s.width);
    expect(text.y + text.height).toBeLessThanOrEqual(s.y + s.height);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("AC2/AC4 — the intro is readable: ≥ 1.125rem, bold, line height ≥ 1.5, parchment", async ({
  page,
}) => {
  await page.goto("/");
  const text = page.locator(`${sign} p`);
  await expect(text).toContainText("Interactive Media Design");
  const { size, line } = await text.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { size: parseFloat(cs.fontSize), line: parseFloat(cs.lineHeight) };
  });
  expect(size).toBeGreaterThanOrEqual(18);
  expect(line / size).toBeGreaterThanOrEqual(1.5);
  await expect(text).toHaveCSS("color", "rgb(243, 231, 201)");
  await expect(text).toHaveCSS("font-weight", "700");
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
    await page.goto("/");
    await page.locator("section#hero").screenshot({
      path: `test-results/soc-13-intro-${testInfo.project.name}-${width}.png`,
    });
  }
});
