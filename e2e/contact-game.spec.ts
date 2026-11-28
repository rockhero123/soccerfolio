// The contact game (spec 900 US-3). Uses Playwright's own `test`, not the
// shared fixtures (which unlock the contact signs), and skips only the theater.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { SKIP_THEATER_KEY } from "../src/components/easter-egg/theaterSkip";

const game = "[data-contact-game]";
const phase = (page: Page) => page.locator(game).getAttribute("data-phase");
const contactButton = (page: Page) => page.getByRole("button", { name: "Contact", exact: true });

test.beforeEach(async ({ page }) => {
  await page.route(/youtube(-nocookie)?\.com|ytimg\.com/, (route) => route.abort());
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), SKIP_THEATER_KEY);
});

test("AC1 — the contact signs are hidden behind a gold-ingot CONTACT button", async ({ page }) => {
  await page.goto("/");
  await expect(contactButton(page)).toBeVisible();
  await expect(contactButton(page).locator("[data-gold-ingot]").first()).toBeVisible();
  await expect(page.locator("#contact [data-contact-lineup]")).toBeHidden();
  // Still in the HTML for search engines.
  expect(await page.locator('#contact a[href^="mailto:"]').count()).toBeGreaterThan(0);
});

test("AC2 — the ingot splits in two, then the pitch grows in the page (not a modal)", async ({ page }) => {
  await page.goto("/");
  await contactButton(page).click();
  // The two halves fly apart.
  await expect(page.locator('[data-contact-gate="splitting"]')).toBeAttached();
  await expect(page.locator('[data-ingot-half="left"]')).toHaveClass(/-translate-x-\[45%\]/);
  await expect(page.locator('[data-ingot-half="right"]')).toHaveClass(/translate-x-\[45%\]/);
  const game = page.getByRole("region", { name: /score 3 goals/i });
  await expect(game).toBeVisible();
  await expect(game).toHaveAttribute("data-grown", "", { timeout: 3000 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await game.evaluate((el) => !!el.closest("#contact"))).toBe(true);
  await expect(contactButton(page)).toHaveCount(0);
});

for (const [width, height] of [
  [375, 740],
  [768, 1024],
  [1280, 800],
]) {
  test(`AC2 — at ${width}×${height} the whole vertical game is in view below the header`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await contactButton(page).click();
    const game = page.getByRole("region", { name: /score 3 goals/i });
    await expect(game).toHaveAttribute("data-grown", "", { timeout: 3000 });
    await expect.poll(async () => (await game.boundingBox())!.y, { timeout: 3000 }).toBeGreaterThan(0);
    await page.waitForTimeout(700); // let the smooth scroll settle
    const box = (await game.boundingBox())!;
    const header = (await page.locator("header").boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(header.y + header.height - 40);
    expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    const canvas = (await game.locator("canvas").boundingBox())!;
    expect(canvas.height).toBeGreaterThan(canvas.width);
    expect(canvas.y + canvas.height).toBeLessThanOrEqual(height + 1);
    await expect(game.getByRole("button", { name: /skip/i })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("AC4/AC5 — countdown, the machine kicks off, then the visitor drags to shoot", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await contactButton(page).click();
  await expect(page.locator(`${game} [data-countdown]`)).toHaveText("3");
  await expect(page.locator(`${game} [data-countdown]`)).toHaveText("1", { timeout: 4000 });
  await expect.poll(() => phase(page), { timeout: 4000 }).toBe("machine-aim");
  await expect.poll(() => phase(page), { timeout: 20000 }).toBe("visitor");
  await expect(page.locator(`${game} [data-hint]`)).toContainText("drag back");

  // Drag back from a green pin. The machine's kick-off may have knocked some
  // off their starting spots, so try each spot until a shot is taken.
  const box = (await page.locator(`${game} canvas`).boundingBox())!;
  const at = (x: number, y: number) => [box.x + ((x + 6) / 132) * box.width, box.y + ((y + 14) / 218) * box.height];
  const spots = [[36, 120], [84, 120], [36, 148], [84, 148], [60, 176]];
  for (const [x, y] of spots) {
    const [px, py] = at(x, y);
    await page.mouse.move(px, py);
    await page.mouse.down();
    const [dx, dy] = at(x, y + 40);
    await page.mouse.move(dx, dy, { steps: 6 });
    await page.mouse.up();
    if ((await phase(page)) === "moving") break;
  }
  await expect.poll(() => phase(page)).toBe("moving");
});

test("AC2 — Escape (or Close) puts the game away and returns focus to CONTACT", async ({ page }) => {
  await page.goto("/");
  await contactButton(page).click();
  await expect(page.locator(game)).toBeVisible();
  await expect(page.getByRole("button", { name: "Close the game" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(game)).toHaveCount(0);
  await expect(contactButton(page)).toBeFocused();
  await expect(page.locator("#contact [data-contact-lineup]")).toBeHidden();
});

test("an axe scan of the contact button and the game finds no serious issues", async ({ page }) => {
  await page.goto("/");
  const serious = async (include: string) =>
    (await new AxeBuilder({ page }).include(include).analyze()).violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
  expect(await serious("#contact")).toEqual([]);
  await contactButton(page).click();
  await expect(page.locator(game)).toBeVisible();
  expect(await serious(game)).toEqual([]);
});
