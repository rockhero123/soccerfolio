import { expect, test, type Page } from "./fixtures";

const forest = '[data-testid="forest-background"]';
const part = (name: string) => `${forest} [data-forest-part="${name}"]`;

async function box(page: Page, selector: string) {
  const b = await page.locator(selector).boundingBox();
  if (!b) throw new Error(`${selector} has no bounding box`);
  return b;
}

/** Makes the page much taller than the viewport, like the real content will. */
async function addTallContent(page: Page, height: number) {
  await page.evaluate((h) => {
    const filler = document.createElement("div");
    filler.style.height = `${h}px`;
    filler.dataset.testFiller = "true";
    document.querySelector("main")!.after(filler);
  }, height);
}

for (const width of [375, 768, 1280]) {
  test.describe(`at ${width}px`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      // Web fonts reflow the text when they arrive, which changes the page
      // height; measure only after they have loaded.
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
    });

    test("AC2 — the forest fills the full page height behind the content", async ({
      page,
    }) => {
      await addTallContent(page, 3000);
      const pageHeight = await page.evaluate(
        () => document.documentElement.scrollHeight,
      );
      expect(pageHeight).toBeGreaterThan(3000);

      const root = await box(page, forest);
      expect(root.y).toBe(0);
      // scrollHeight is rounded to whole pixels; the layout box is not.
      expect(Math.abs(root.height - pageHeight)).toBeLessThanOrEqual(1);
      await expect(page.locator(forest)).toHaveCSS("z-index", "-10");

      const left = await box(page, part("side-left"));
      expect(Math.abs(left.height - pageHeight)).toBeLessThanOrEqual(1);
      const bottom = await box(page, part("band-bottom"));
      expect(Math.abs(bottom.y + bottom.height - pageHeight)).toBeLessThanOrEqual(1);

      // The content is painted above the forest.
      const card = await box(page, "main h1");
      const topElement = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.closest("main") !== null,
        { x: card.x + card.width / 2, y: card.y + card.height / 2 },
      );
      expect(topElement).toBe(true);
    });

    test("AC2 — the forest frames a clear centre for the field", async ({
      page,
    }) => {
      const viewport = page.viewportSize()!;
      const left = await box(page, part("side-left"));
      const right = await box(page, part("side-right"));
      const top = await box(page, part("band-top"));
      const bottom = await box(page, part("band-bottom"));
      const main = await box(page, "main");

      expect(left.x).toBe(0);
      expect(right.x + right.width).toBeCloseTo(viewport.width, 0);
      expect(top.y).toBe(0);
      expect(top.width).toBeCloseTo(viewport.width, 0);
      expect(bottom.width).toBeCloseTo(viewport.width, 0);

      // The content sits in the clear centre, between the panels and bands.
      expect(main.x).toBeGreaterThanOrEqual(left.x + left.width - 1);
      expect(main.x + main.width).toBeLessThanOrEqual(right.x + 1);
      expect(main.y).toBeGreaterThanOrEqual(top.y + top.height - 1);
      expect(main.y + main.height).toBeLessThanOrEqual(bottom.y + 1);

      if (width >= 1024) {
        // Desktop: the forest frames the field on the left and right.
        expect(left.width).toBeGreaterThanOrEqual(144);
        expect(right.width).toBeGreaterThanOrEqual(144);
      } else {
        // Below 1024px: a narrow decorative border plus top and bottom bands.
        expect(left.width).toBeGreaterThan(0);
        expect(left.width).toBeLessThanOrEqual(24);
        expect(right.width).toBeLessThanOrEqual(24);
        expect(top.height).toBeGreaterThanOrEqual(120);
        expect(bottom.height).toBeGreaterThanOrEqual(120);
      }
    });

    test("AC3 — the forest is hidden from assistive tech and never focused", async ({
      page,
    }) => {
      await expect(page.locator(forest)).toHaveAttribute("aria-hidden", "true");
      await expect(page.locator(forest)).toHaveCSS("pointer-events", "none");
      await expect(
        page.locator(
          `${forest} :is(a, button, input, select, textarea, [tabindex])`,
        ),
      ).toHaveCount(0);

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        const inForest = await page.evaluate(
          (sel) =>
            document.activeElement?.closest(sel) !== null &&
            document.activeElement !== document.body,
          forest,
        );
        expect(inForest).toBe(false);
      }
    });

    test("AC4 — inline SVG only, no raster images, ≤ 150 KB gzipped, static", async ({
      page,
    }) => {
      const root = page.locator(forest);
      await expect(root.locator("svg").first()).toBeAttached();
      await expect(
        root.locator(":is(img, image, picture, canvas, video)"),
      ).toHaveCount(0);

      const result = await page.evaluate(async (sel) => {
        const el = document.querySelector(sel)!;
        const all = [el, ...el.querySelectorAll("*")];
        const backgrounds = all
          .map((node) => getComputedStyle(node).backgroundImage)
          .filter((value) => value !== "none");
        const stream = new Blob([el.outerHTML])
          .stream()
          .pipeThrough(new CompressionStream("gzip"));
        const gzipped = (await new Response(stream).arrayBuffer()).byteLength;
        const animations = all.flatMap((node) => node.getAnimations());
        return { backgrounds, gzipped, animations: animations.length };
      }, forest);

      expect(result.backgrounds).toEqual([]);
      expect(result.gzipped).toBeLessThanOrEqual(150 * 1024);
      expect(result.animations).toBe(0);
    });
  });
}

test("visual check screenshots (375px and 1280px)", async ({
  page,
}, testInfo) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(forest)).toBeAttached();
    await page.screenshot({
      path: `test-results/soc-3-forest-${testInfo.project.name}-${width}.png`,
      fullPage: true,
    });
  }
});
