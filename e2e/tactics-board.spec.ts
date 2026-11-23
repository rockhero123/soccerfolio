import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const board = '[data-board="frame"]';
const LINES = [
  ["forwards", 3],
  ["midfielders", 3],
  ["defenders", 4],
  ["goalkeeper", 1],
] as const;

type Box = { x: number; y: number; width: number; height: number };
const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width - 1 &&
  b.x < a.x + a.width - 1 &&
  a.y < b.y + b.height - 1 &&
  b.y < a.y + a.height - 1;

test("AC3 — the board sits in #skills, below the Skills title banner", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("section#skills");
  await expect(section.locator(board)).toBeVisible();
  const banner = (await section.locator("[data-title-banner]").boundingBox())!;
  const frame = (await section.locator(board).boundingBox())!;
  expect(frame.y).toBeGreaterThan(banner.y + banner.height - 1);
});

for (const width of [375, 768, 1280]) {
  test(`AC2/AC4 — at ${width}px a readable 1-4-3-3 that fits`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const rows: Box[][] = [];
    for (const [line, count] of LINES) {
      const jerseys = page.locator(
        `${board} [data-formation-line="${line}"] [data-skill]`,
      );
      await expect(jerseys).toHaveCount(count);
      const boxes: Box[] = [];
      for (const j of await jerseys.all()) {
        await expect(j).toBeVisible();
        boxes.push((await j.boundingBox())!);
      }
      // One row, left to right, evenly centred on the board.
      const ys = boxes.map((b) => Math.round(b.y));
      expect(Math.max(...ys) - Math.min(...ys)).toBeLessThanOrEqual(1);
      boxes.slice(1).forEach((b, i) => expect(b.x).toBeGreaterThan(boxes[i].x));
      rows.push(boxes);
    }
    // Rows from top to bottom: forwards, midfielders, defenders, goalkeeper.
    rows
      .slice(1)
      .forEach((row, i) => expect(row[0].y).toBeGreaterThan(rows[i][0].y));
    // No two jerseys overlap.
    const all = rows.flat();
    all.forEach((a, i) =>
      all.slice(i + 1).forEach((b) => expect(overlaps(a, b)).toBe(false)),
    );
    // Names stay readable and inside their jerseys.
    const minSize = width < 768 ? 12 : 14;
    const names = await page
      .locator(`${board} [data-jersey="name"]`)
      .evaluateAll((els) =>
        els.map((e) => ({
          size: parseFloat(getComputedStyle(e).fontSize),
          fits: e.scrollWidth <= e.clientWidth + 1,
        })),
      );
    names.forEach((n) => {
      expect(n.size).toBeGreaterThanOrEqual(minSize - 0.5);
      expect(n.fits).toBe(true);
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("AC5 — screen readers get the team as a list grouped by line", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("section#skills")).toMatchAriaSnapshot(`
    - list "The team, in a 1-4-3-3 formation":
      - listitem:
        - heading "Forwards" [level=3]
        - list:
          - listitem: React
          - listitem: Claude Code
          - listitem: Kiro Code
      - listitem:
        - heading "Midfielders" [level=3]
        - list:
          - listitem: JavaScript
          - listitem: TypeScript
          - listitem: Angular
      - listitem:
        - heading "Defenders" [level=3]
        - list:
          - listitem: CSS
          - listitem: SCSS
          - listitem: MongoDB
          - listitem: Node.js
      - listitem:
        - heading "Goalkeeper" [level=3]
        - list:
          - listitem: HTML
  `);
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
    await page.locator(board).screenshot({
      path: `test-results/soc-16-board-${testInfo.project.name}-${width}.png`,
    });
  }
});
