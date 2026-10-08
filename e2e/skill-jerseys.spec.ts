import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const names = [
  "React",
  "Claude Code",
  "Kiro Code",
  "JavaScript",
  "TypeScript",
  "Angular",
  "CSS",
  "SCSS",
  "MongoDB",
  "Node.js",
  "HTML",
];

for (const width of [375, 768, 1280]) {
  test(`AC1/AC3 — at ${width}px every jersey shows its whole name and logo`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const name of names) {
      const jersey = page.locator(`[data-skill="${name}"]`);
      await expect(jersey).toBeVisible();
      const label = jersey.locator('[data-jersey="name"]');
      await expect(label).toHaveText(name);
      await expect(label).toHaveCSS("color", "rgb(255, 251, 239)");
      const fits = await label.evaluate((el) => {
        const size = parseFloat(getComputedStyle(el).fontSize);
        const wordWrapped = [...el.textContent!.split(" ")].every(
          (w) => !w.includes("\n"),
        );
        return {
          size,
          fits: el.scrollWidth <= el.clientWidth + 1,
          wordWrapped,
        };
      });
      expect(fits.size).toBeGreaterThanOrEqual(12);
      expect(fits.fits).toBe(true);
      await expect(jersey.locator("[data-skill-logo]")).toBeVisible();
    }
  });
}

test("AC1 — no word is split across lines", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  for (const name of names) {
    const lines = await page
      .locator(`[data-skill="${name}"] [data-jersey="name"]`)
      .evaluate((el) => {
        const range = document.createRange();
        const node = el.firstChild!;
        const words: number[] = [];
        let i = 0;
        for (const word of el.textContent!.split(" ")) {
          range.setStart(node, i);
          range.setEnd(node, i + word.length);
          const rects = [...range.getClientRects()].map((r) =>
            Math.round(r.top),
          );
          words.push(new Set(rects).size);
          i += word.length + 1;
        }
        return words;
      });
    lines.forEach((n) => expect(n, name).toBe(1));
  }
});

test("AC4 — an axe scan finds no serious issues", async ({ page }) => {
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
    await page.locator("section#skills").screenshot({
      path: `test-results/soc-15-jerseys-${testInfo.project.name}-${width}.png`,
    });
  }
});
