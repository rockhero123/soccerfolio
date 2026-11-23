import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const board = "#contact [data-contact-board]";

test("AC1 — the contact board stands in the dark-grass contact zone, leaves at its foot", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(`[data-field-zone="contact"] ${board}`)).toBeVisible();
  const plank = (await page.locator(`${board} [data-wood="plank"]`).boundingBox())!;
  const leaves = (await page.locator(`${board} [data-leaf-garland]`).boundingBox())!;
  // The garland covers the plank's bottom edge and hangs below it.
  expect(leaves.y).toBeLessThan(plank.y + plank.height);
  expect(leaves.y + leaves.height).toBeGreaterThan(plank.y + plank.height);
  expect(leaves.width).toBeGreaterThan(plank.width * 0.9);
});

test("AC2/AC3 — phone, email, LinkedIn, GitHub and the send button link out", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", { name: /Phone/ })).toHaveAttribute("href", "tel:+573105911019");
  await expect(contact.getByRole("link", { name: /^Email/ })).toHaveAttribute(
    "href",
    "mailto:ricardo.martinezc10@gmail.com",
  );
  await expect(contact.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/ricardomartinez10",
  );
  await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/rockhero123",
  );
  await expect(contact.getByRole("link", { name: "Send an email" })).toHaveAttribute(
    "href",
    "mailto:ricardo.martinezc10@gmail.com",
  );
});

test("AC4 — Copy email copies the address and confirms it", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator("#contact").getByRole("button", { name: "Copy email" }).click();
  await expect(page.locator("#contact [data-copy-status]")).toHaveText("Email copied!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "ricardo.martinezc10@gmail.com",
  );
  await expect(page.locator("#contact [data-copy-status]")).toHaveText("", { timeout: 4000 });
});

for (const width of [375, 768, 1280]) {
  test(`AC6 — at ${width}px the board fits without horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const box = (await page.locator(board).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    // Every value stays inside the board.
    for (const value of await page.locator(`${board} [data-contact]`).all()) {
      const v = (await value.boundingBox())!;
      expect(v.x + v.width).toBeLessThanOrEqual(box.x + box.width);
    }
  });
}

test("AC6 — the links and buttons are keyboard reachable with a visible focus ring", async ({
  page,
}) => {
  await page.goto("/");
  const github = page.locator('#contact [data-contact="github"]');
  await github.focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#contact").getByRole("link", { name: "Send an email" })).toBeFocused();
  await page.keyboard.press("Tab");
  const copy = page.locator("#contact").getByRole("button", { name: "Copy email" });
  await expect(copy).toBeFocused();
  await expect(copy).toHaveCSS("outline-style", "solid");
});

test("an axe scan of the contact section finds no serious issues", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).include("#contact").analyze();
  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
