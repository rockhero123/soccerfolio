import { join } from "node:path";
import { expect, test } from "./fixtures";

const colorTokens: Record<string, string> = {
  pitch: "#00b262",
  "pitch-dark": "#00522d",
  mint: "#a8f0d8",
  chalk: "#fffbef",
  parchment: "#f3e7c9",
  ink: "#1e1a16",
  "forest-deep": "#2f3b2a",
  moss: "#a9bf5a",
  bark: "#7a5236",
  "cartoon-red": "#c8312b",
  "cartoon-yellow": "#e8b630",
};

test.describe("AC1 — design tokens", () => {
  test("every manifest §6 token is available as a CSS variable", async ({
    page,
  }) => {
    await page.goto("/");
    const read = (name: string) =>
      page.evaluate(
        (n) =>
          getComputedStyle(document.documentElement)
            .getPropertyValue(n)
            .trim()
            .toLowerCase(),
        name,
      );

    for (const [name, value] of Object.entries(colorTokens)) {
      expect(await read(`--color-${name}`), name).toBe(value);
    }
    // Colour ramps for the pixel art, built on the base tokens.
    expect(await read("--color-wood-300")).toBe("#edb75a");
    expect(await read("--color-grass-500")).toBe("#00b262");
    // One art pixel: 3px on phones, 4px from 768px.
    const width = page.viewportSize()!.width;
    expect(await read("--px")).toBe(width >= 768 ? "4px" : "3px");
  });

  test("token utilities resolve to the token values", async ({ page }) => {
    await page.goto("/");
    // A paper card: parchment paper, square pixel corners, a notched dark-wood outline.
    const card = page.locator(".pixel-frame-paper").first();
    await expect(card).toHaveCSS("background-color", "rgb(243, 231, 201)");
    await expect(card).toHaveCSS("border-top-left-radius", "0px");
    await expect(card).toHaveCSS("box-shadow", /rgb\(72, 38, 19\)/);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(22, 58, 33)",
    );
  });
});

test.describe("AC2 — fonts", () => {
  test("headings use Jersey 10 and body uses Pixelify Sans", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCSS("font-family", /Jersey 10/);
    await expect(page.locator("body")).toHaveCSS(
      "font-family",
      /Pixelify Sans/,
    );
    await expect(page.locator("main p").first()).toHaveCSS(
      "font-family",
      /Pixelify Sans/,
    );

    const loaded = await page.evaluate(async () => {
      await document.fonts.ready;
      const families = [...document.fonts]
        .filter((f) => f.status === "loaded")
        .map((f) => f.family.replace(/['"]/g, ""));
      return families;
    });
    expect(loaded).toContain("Jersey 10");
    expect(loaded).toContain("Pixelify Sans");
  });

  test("fonts are self-hosted (no requests to Google)", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      // Only the site's own requests: the easter egg's YouTube player (spec
      // 900) loads its own fonts inside its iframe.
      if (request.frame() !== page.mainFrame()) return;
      if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) {
        external.push(request.url());
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(external).toEqual([]);
  });

  test("font loading causes no layout shift", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const cls = await page.evaluate(async () => {
      await document.fonts.ready;
      return new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & {
              value: number;
              hadRecentInput: boolean;
            };
            if (!shift.hadRecentInput) total += shift.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        setTimeout(() => resolve(total), 500);
      });
    });
    expect(cls).toBeLessThan(0.01);
  });
});

test.describe("AC3 — starter content removed", () => {
  test("page has no create-next-app content", async ({ page }) => {
    await page.goto("/");
    await expect(page).not.toHaveTitle(/create next app/i);
    await expect(page.getByText(/to get started/i)).toHaveCount(0);
    await expect(page.locator('a[href*="vercel.com"]')).toHaveCount(0);
    await expect(page.locator('img[src*="next.svg"]')).toHaveCount(0);
  });

  for (const file of [
    "file.svg",
    "globe.svg",
    "next.svg",
    "vercel.svg",
    "window.svg",
  ]) {
    test(`/${file} is no longer served`, async ({ request }) => {
      const response = await request.get(`/${file}`);
      expect(response.status()).toBe(404);
    });
  }
});

type AxeViolation = { id: string; impact: string | null; help: string };

test("axe finds no serious or critical issues", async ({ page }) => {
  await page.goto("/");
  // axe-core is already installed (transitive dependency of eslint-config-next).
  await page.addScriptTag({
    path: join(process.cwd(), "node_modules/axe-core/axe.min.js"),
  });
  const violations = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: { run: () => Promise<{ violations: AxeViolation[] }> };
      }
    ).axe;
    const result = await axe.run();
    return result.violations.map(({ id, impact, help }) => ({
      id,
      impact,
      help,
    }));
  });
  const serious = violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious).toEqual([]);
});

test("visual check screenshots (375px and 1280px)", async ({
  page,
}, testInfo) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toBeVisible();
    await page.screenshot({
      path: `test-results/soc-2-tokens-${testInfo.project.name}-${width}.png`,
      fullPage: true,
    });
  }
});
