import { expect, test } from "@playwright/test";

const overlay = '[data-testid="film-overlay"]';

for (const width of [375, 768, 1280]) {
  test(`AC1 — at ${width}px the overlay covers the screen and stays fixed while scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await page.evaluate(() => {
      const filler = document.createElement("section");
      filler.style.height = "2400px";
      document
        .querySelector('[data-field-zone="play"] [data-field-content]')!
        .append(filler);
    });
    for (const scrollY of [0, 1200]) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      const box = (await page.locator(overlay).boundingBox())!;
      expect(box).toEqual({ x: 0, y: 0, width, height: 800 });
    }
    await expect(page.locator(`${overlay} [data-film="grain"]`)).toBeVisible();
    await expect(page.locator(`${overlay} [data-film="vignette"]`)).toHaveCSS(
      "background-image",
      /radial-gradient/,
    );
  });
}

test("AC2 — clicks and hovers go straight through to the page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(overlay)).toHaveCSS("pointer-events", "none");
  const heading = (await page.locator("main h1").boundingBox())!;
  const hit = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.closest("main h1") !== null,
    { x: heading.x + heading.width / 2, y: heading.y + heading.height / 2 },
  );
  expect(hit).toBe(true);
});

test("AC3 — the overlay is not rendered with prefers-reduced-motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(overlay)).toHaveCSS("display", "none");
  await expect(page.locator(overlay)).toBeHidden();

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(overlay)).toBeVisible();
});

test("AC4 — the overlay is static: no animations, transitions or scroll work", async ({
  page,
}) => {
  await page.goto("/");
  const motion = await page.evaluate((selector) => {
    const root = document.querySelector(selector)!;
    const nodes = [root, ...root.querySelectorAll("*")];
    return {
      animations: root.getAnimations({ subtree: true }).length,
      transitions: nodes.filter((n) => {
        const d = getComputedStyle(n).transitionDuration;
        return d.split(",").some((v) => parseFloat(v) > 0);
      }).length,
      scripts: root.querySelectorAll("script, animate, set").length,
    };
  }, overlay);
  expect(motion).toEqual({ animations: 0, transitions: 0, scripts: 0 });
});

test("visual check screenshots (375px and 1280px)", async ({
  page,
}, testInfo) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.screenshot({
      path: `test-results/soc-6-film-${testInfo.project.name}-${width}.png`,
    });
  }
});
