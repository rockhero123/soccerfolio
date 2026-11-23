import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const label = /Pixel-art portrait of Ricardo Martinez/;

for (const width of [375, 1280]) {
  test(`AC3 — at ${width}px the hair breaks out above the portrait circle`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const portrait = page.getByRole("img", { name: label });
    await expect(portrait).toBeVisible();
    // The pixel sprite draws the circle's dark ring in wood-900 and the hair
    // in the hair colour: compare their extents, in the sprite's own pixels.
    const { ring, hair, height } = await portrait.evaluate((el) => {
      const svg = el.querySelector("svg")!;
      const bbox = (token: string) => {
        const { x, y, width, height } = (
          svg.querySelector(`path[fill="var(--color-${token})"]`) as SVGPathElement
        ).getBBox();
        return { x, y, width, height };
      };
      return {
        ring: bbox("wood-900"),
        hair: bbox("hair"),
        height: svg.viewBox.baseVal.height,
      };
    });
    // The hair rises clearly above the circle and stays centred on it.
    expect(hair.y).toBeLessThan(ring.y - 2);
    expect(
      Math.abs(hair.x + hair.width / 2 - (ring.x + ring.width / 2)),
    ).toBeLessThan(2);
    // The portrait stays inside its own box.
    expect(hair.y).toBeGreaterThanOrEqual(0);
    expect(ring.y + ring.height).toBeLessThanOrEqual(height);
  });
}

test("AC4 — the portrait is announced as one image with its label", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main")).toMatchAriaSnapshot(
    `- img /Pixel-art portrait of Ricardo Martinez/`,
  );
});

test("AC2 — he wears the yellow Colombia shirt", async ({ page }) => {
  await page.goto("/");
  const portrait = page.getByRole("img", { name: label });
  // The shirt is shaded in the gold ramp around cartoon-yellow.
  await expect(
    portrait.locator('path[fill="var(--color-gold-600)"]'),
  ).toHaveCSS("fill", "rgb(232, 182, 48)");
});

test("an axe scan finds no serious issues with the portrait", async ({
  page,
}) => {
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
    await page.getByRole("img", { name: label }).screenshot({
      path: `test-results/soc-11-portrait-${testInfo.project.name}-${width}.png`,
      scale: "device",
    });
  }
});
