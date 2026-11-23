import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const mirror = '[data-mirror="frame"]';

test("AC1 — the portrait sits in an enchanted mirror with grass at its foot", async ({
  page,
}) => {
  await page.goto("/");
  const frame = page.locator(mirror);
  await expect(frame).toBeVisible();
  await expect(
    frame.getByRole("img", { name: /Pixel-art portrait of Ricardo Martinez/ }),
  ).toBeVisible();
  const box = (await frame.boundingBox())!;
  const grass = (await frame.locator("[data-grass-strip]").boundingBox())!;
  // The grass's ground row tucks two art pixels under the frame's foot.
  const px = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--px")),
  );
  expect(Math.abs(grass.y + grass.height - (box.y + box.height))).toBeLessThanOrEqual(2 * px);
  // A bevelled pixel stone-silver frame around mint glass, with a gold crest.
  const glass = frame.locator(".pixel-frame-stone");
  await expect(glass).toHaveCSS("background-color", "rgb(168, 240, 216)");
  await expect(glass).toHaveCSS("box-shadow", /rgb\(231, 233, 238\)/);
  await expect(frame.locator('[data-mirror="crest"]')).toBeVisible();
});

test("AC2/AC3 — Richi is the only h1, named Ricardo Martinez (Richi), with the role below", async ({
  page,
}) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveAccessibleName("Ricardo Martinez (Richi)");
  // Only "Richi" is drawn on screen.
  const visibleWidth = await h1.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return [...range.getClientRects()].filter((r) => r.width > 1).length;
  });
  expect(visibleWidth).toBeGreaterThan(0);
  await expect(page.locator(`${mirror} [data-mirror="role"]`)).toHaveText(
    "Software Engineer",
  );
  const nameBox = (await h1.boundingBox())!;
  const roleBox = (await page
    .locator(`${mirror} [data-mirror="role"]`)
    .boundingBox())!;
  expect(roleBox.y).toBeGreaterThan(nameBox.y);
  await expect(h1).toHaveCSS("font-family", /Jersey 10/);
  await expect(page.locator(`${mirror} [data-mirror="role"]`)).toHaveCSS(
    "font-weight",
    "400",
  );
});

test("AC4 — the page title uses the role Software Engineer", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Ricardo Martinez — Software Engineer");
});

for (const width of [320, 375, 768, 1280]) {
  test(`at ${width}px the role nameplate stays on one line inside the glass`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const plate = page.locator(`${mirror} [data-mirror="role"]`);
    const p = (await plate.boundingBox())!;
    const glass = (await page
      .locator(`${mirror} .pixel-frame-stone`)
      .boundingBox())!;
    expect(p.x).toBeGreaterThanOrEqual(glass.x);
    expect(p.x + p.width).toBeLessThanOrEqual(glass.x + glass.width);
    const lineHeight = await plate.evaluate((el) =>
      parseFloat(getComputedStyle(el).lineHeight),
    );
    expect(p.height).toBeLessThan(lineHeight * 2);
  });
}

for (const width of [375, 768, 1280]) {
  test(`at ${width}px the mirror fits on screen`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const box = (await page.locator(mirror).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  });
}

test("AC5 — an axe scan finds no serious issues", async ({ page }) => {
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
    await page.locator(mirror).screenshot({
      path: `test-results/soc-12-mirror-${testInfo.project.name}-${width}.png`,
    });
  }
});
