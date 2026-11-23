import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const sign = '[data-site-header] nav[aria-label="Main"]';
const links = [
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Contact", id: "contact" },
];

type Box = { x: number; y: number; width: number; height: number };
const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width &&
  b.x < a.x + a.width &&
  a.y < b.y + b.height &&
  b.y < a.y + a.height;

/** Waits until smooth scrolling has settled. */
async function settle(page: Page) {
  let last = -1;
  await expect
    .poll(
      async () => {
        const y = await page.evaluate(() => window.scrollY);
        const done = y === last;
        last = y;
        return done;
      },
      { intervals: [150] },
    )
    .toBe(true);
}

/** Checks the section is on screen with its heading fully below the header sign. */
async function expectSectionUnderSign(page: Page, id: string) {
  const header = (await page.locator(sign).boundingBox())!;
  const heading = page.locator(`section#${id} h2`);
  await expect(heading).toBeInViewport();
  const box = (await heading.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(header.y + header.height);
}

test.describe("desktop (1280px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
  });

  test("AC1 — a pixel wooden sign with the RM logo and the section links", async ({
    page,
  }) => {
    const nav = page.locator(sign);
    // The sign's own plank (the closed menu has a second one).
    await expect(nav.locator('[data-wood="plank"]').first()).toBeVisible();
    await expect(nav.getByRole("link", { name: /^RM/ })).toHaveAttribute(
      "href",
      "#hero",
    );
    for (const { name, id } of links) {
      const link = nav.getByRole("link", { name, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", `#${id}`);
      await expect(link).toHaveCSS("color", "rgb(30, 26, 22)"); // ink, burned into light wood
    }
    await expect(page.getByRole("button", { name: /menu/i })).toBeHidden();
  });

  test("AC2 — stays fixed; each link scrolls smoothly to its section, below the sign", async ({
    page,
  }) => {
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
    const before = (await page.locator(sign).boundingBox())!;
    for (const { name, id } of links) {
      await page.locator(sign).getByRole("link", { name, exact: true }).click();
      await settle(page);
      expect(page.url()).toContain(`#${id}`);
      await expectSectionUnderSign(page, id);
      expect((await page.locator(sign).boundingBox())!.y).toBe(before.y);
    }
    await page.locator(sign).getByRole("link", { name: /^RM/ }).click();
    await settle(page);
    await expect(page.locator("section#hero h2")).toBeInViewport();
  });

  test("AC2 — quick successive clicks still land on the last section chosen", async ({
    page,
  }) => {
    const nav = page.locator(sign);
    await nav.getByRole("link", { name: "Skills", exact: true }).click();
    await nav.getByRole("link", { name: "Contact", exact: true }).click();
    await settle(page);
    await expectSectionUnderSign(page, "contact");
  });

  test("AC4 — highlights the link of the section in view with a red pixel underline", async ({
    page,
  }) => {
    for (const { name } of links) {
      const link = page.locator(sign).getByRole("link", { name, exact: true });
      await link.click();
      await settle(page);
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(link).toHaveCSS("border-bottom-color", "rgb(200, 49, 43)"); // cartoon-red
      await expect(
        page.locator(`${sign} [aria-current="location"]:visible`),
      ).toHaveCount(1);
    }
  });
});

test.describe("mobile (375px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 });
    await page.goto("/");
  });

  test("AC3 — the links fold into a hamburger menu that opens and closes", async ({
    page,
  }) => {
    const button = page.getByRole("button", { name: /menu/i });
    const menu = page.locator("#site-menu");
    await expect(page.locator(`${sign} > div > ul`)).toBeHidden();
    await expect(menu).toBeHidden();
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await button.click();
    await expect(menu).toBeHidden();
  });

  test("AC3 — works with the keyboard: Enter opens, Esc closes and returns focus", async ({
    page,
  }) => {
    const button = page.getByRole("button", { name: /menu/i });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#site-menu")).toBeVisible();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-menu")).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("AC3 — a tap outside the sign closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: /menu/i }).click();
    await page.mouse.click(180, 600);
    await expect(page.locator("#site-menu")).toBeHidden();
  });

  test("AC2/AC3 — each menu link scrolls to its section and closes the menu", async ({
    page,
  }) => {
    for (const { name, id } of links) {
      await page.getByRole("button", { name: /menu/i }).click();
      await page
        .locator("#site-menu")
        .getByRole("link", { name, exact: true })
        .click();
      await expect(page.locator("#site-menu")).toBeHidden();
      await settle(page);
      await expectSectionUnderSign(page, id);
    }
  });
});

test("AC3 — the menu opens with a touch tap", async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, "needs a touch device");
  test.skip(browserName !== "chromium");
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/");
  await page.getByRole("button", { name: /menu/i }).tap();
  await expect(page.locator("#site-menu")).toBeVisible();
  await page.getByRole("button", { name: /menu/i }).tap();
  await expect(page.locator("#site-menu")).toBeHidden();
});

test("AC5 — no smooth scrolling with prefers-reduced-motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page
    .locator(sign)
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  // Jumps straight there, with no animation in between.
  await expectSectionUnderSign(page, "projects");
});

for (const width of [375, 768, 1024, 1280]) {
  test(`at ${width}px the sign covers none of the forest characters`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const header = (await page.locator(sign).boundingBox())!;
    for (const character of await page.locator("[data-character]").all()) {
      if (!(await character.isVisible())) continue;
      const box = (await character.boundingBox())!;
      expect(
        overlaps(header, box),
        `${await character.getAttribute("data-character")} is under the sign`,
      ).toBe(false);
    }
  });
}

test("an axe scan finds no serious issues, with the menu closed and open", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/");
  for (const open of [false, true]) {
    if (open) await page.getByRole("button", { name: /menu/i }).click();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  }
});

test("visual check screenshots (375px with the menu open, and 1280px)", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#projects");
  await settle(page);
  await page.screenshot({
    path: `test-results/soc-8-header-${testInfo.project.name}-1280.png`,
  });
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/");
  await page.getByRole("button", { name: /menu/i }).click();
  await page.screenshot({
    path: `test-results/soc-8-header-${testInfo.project.name}-375.png`,
  });
});

test("AC1 — keyboard focus on the header links shows the red focus ring", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const links = page.locator("header a");
  const count = await links.count();
  expect(count).toBeGreaterThan(1);
  // Focus the first link, then Tab through the rest, as a keyboard user would.
  await links.first().focus();
  for (let i = 1; i < count; i++) {
    await page.keyboard.press("Tab");
    const link = links.nth(i);
    if (!(await link.isVisible())) continue;
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
    await expect(link).toHaveCSS("outline-color", "rgb(200, 49, 43)");
  }
});
