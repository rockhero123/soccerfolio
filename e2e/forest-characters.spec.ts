import { expect, test, type Page } from "@playwright/test";

const characters = '[data-testid="forest-background"] [data-character]';
const field = '[data-testid="soccer-field"]';

type Box = { x: number; y: number; width: number; height: number };
const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width &&
  b.x < a.x + a.width &&
  a.y < b.y + b.height &&
  b.y < a.y + a.height;

/** Bounding boxes of the characters that are actually shown at this width. */
async function visibleCharacters(page: Page) {
  const boxes: { name: string; box: Box }[] = [];
  for (const c of await page.locator(characters).all()) {
    if (!(await c.isVisible())) continue;
    boxes.push({
      name: (await c.getAttribute("data-character"))!,
      box: (await c.boundingBox())!,
    });
  }
  return boxes;
}

async function addTallContent(page: Page) {
  await page.evaluate(() => {
    const filler = document.createElement("section");
    filler.style.height = "2400px";
    document
      .querySelector('[data-field-zone="play"] [data-field-content]')!
      .append(filler);
  });
}

for (const width of [1024, 1280]) {
  test(`AC2 — at ${width}px, at least 15 characters frame the field without overlapping it`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const tall of [false, true]) {
      if (tall) await addTallContent(page);
      const shown = await visibleCharacters(page);
      expect(shown.length).toBeGreaterThanOrEqual(15);
      const f = (await page.locator(field).boundingBox())!;
      for (const { name, box } of shown) {
        expect(overlaps(box, f), `${name} overlaps the field`).toBe(false);
      }
    }
  });
}

for (const width of [375, 768]) {
  test(`AC3 — at ${width}px, at least 10 characters stay visible in the top and bottom bands`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const shown = await visibleCharacters(page);
    expect(shown.length).toBeGreaterThanOrEqual(10);
    const bands = await Promise.all(
      ["band-top", "band-bottom"].map(
        async (part) =>
          (await page.locator(`[data-forest-part="${part}"]`).boundingBox())!,
      ),
    );
    const f = (await page.locator(field).boundingBox())!;
    for (const { name, box } of shown) {
      const inBand = bands.some(
        (b) => box.y >= b.y - 1 && box.y + box.height <= b.y + b.height + 1,
      );
      expect(inBand, `${name} is outside the forest bands`).toBe(true);
      expect(overlaps(box, f), `${name} overlaps the field`).toBe(false);
      // Fully on screen horizontally.
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    // The side-panel characters only appear from 1024px.
    for (const side of ["left", "right"]) {
      await expect(
        page.locator(`[data-forest-characters="${side}"]`),
      ).toBeHidden();
    }
  });
}

test("AC5 — characters are hidden from assistive tech and never focused", async ({
  page,
}) => {
  await page.goto("/");
  const exposed = await page.evaluate(
    (selector) =>
      [...document.querySelectorAll(selector)].filter(
        (c) =>
          c.getAttribute("aria-hidden") !== "true" ||
          !c.closest('[data-testid="forest-background"][aria-hidden="true"]'),
      ).length,
    characters,
  );
  expect(exposed).toBe(0);
  const snapshot = await page.locator("body").ariaSnapshot();
  expect(snapshot).not.toMatch(/owl|mushroom|frog/i);
});

test("visual check screenshots (375px, 1024px and 1280px)", async ({
  page,
}, testInfo) => {
  for (const width of [375, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.screenshot({
      path: `test-results/soc-5-characters-${testInfo.project.name}-${width}.png`,
      fullPage: true,
    });
  }
});
