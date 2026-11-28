import AxeBuilder from "@axe-core/playwright";
import { expect, test, sectionTitle } from "./fixtures";

const field = '[data-testid="soccer-field"]';
const sections = ["hero", "skills", "projects", "contact"];

test("AC1 — the four sections sit on the field in order, each with a grassy title banner", async ({
  page,
}) => {
  await page.goto("/");
  const ids = await page
    .locator(`${field} section`)
    .evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(sections);
  let previousBottom = 0;
  for (const id of sections) {
    const section = page.locator(`section#${id}`);
    if (id === "contact") {
      // No wooden banner: the CONTACT ingot (spec 900 US-3) or the contact
      // signs stand in, and the <h2> is for screen readers.
      await expect(section.locator("[data-title-banner]")).toHaveCount(0);
      await expect(section.getByRole("heading", { level: 2, name: "Contact" })).toBeAttached();
    } else {
      const banner = section.locator("[data-title-banner]");
      await expect(banner.getByRole("heading", { level: 2 })).toBeVisible();
      await expect(banner.locator("[data-grass-strip]")).toBeVisible();
    }
    const box = (await section.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(previousBottom);
    previousBottom = box.y + box.height;
  }
  await expect(
    page.locator('[data-field-zone="contact"] section#contact'),
  ).toHaveCount(1);
});

test("AC2 — semantic header, main and footer, and lang=en", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("body > header")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("main")).toContainText("Projects");
  await expect(page.locator("main " + field)).toHaveCount(1);
  await expect(page.locator("footer")).toBeVisible();
  // The footer closes the page below the field.
  const main = (await page.locator("main").boundingBox())!;
  const footer = (await page.locator("footer").boundingBox())!;
  expect(footer.y).toBeGreaterThanOrEqual(main.y + main.height - 1);
});

test("AC2 — the skip link appears on focus and jumps to the main content", async ({
  page,
}) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

for (const width of [375, 768, 1280, 1600]) {
  test(`AC3 — at ${width}px the content is centred, at most 1100px wide, with padding`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const boundary = (await page
      .locator(`${field} [data-marking="boundary"]`)
      .boundingBox())!;
    for (const zone of ["play", "contact"]) {
      const content = (await page
        .locator(
          `${field} [data-field-zone="${zone}"] [data-field-content] > div`,
        )
        .boundingBox())!;
      expect(content.width).toBeLessThanOrEqual(1100);
      // Centred within the field lines, with padding on both sides.
      const left = content.x - boundary.x;
      const right = boundary.x + boundary.width - (content.x + content.width);
      expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
      expect(left).toBeGreaterThanOrEqual(width < 768 ? 12 : 24);
    }
  });
}

for (const width of [375, 1280]) {
  test(`every section is reachable by its #hash at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const id of sections) {
      // A deep link: open the page fresh at each #hash.
      await page.goto("about:blank");
      await page.goto(`/#${id}`);
      await expect(sectionTitle(page, id)).toBeInViewport();
    }
  });
}

test("an axe scan finds no serious issues on the page shell", async ({
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
    await page.screenshot({
      path: `test-results/soc-7-shell-${testInfo.project.name}-${width}.png`,
      fullPage: true,
    });
  }
});
