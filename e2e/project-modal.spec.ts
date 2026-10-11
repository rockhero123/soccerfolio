import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function openProject(page: Page, name: string) {
  const open = page.getByRole("link", { name: `${name} — view details` });
  await open.scrollIntoViewIfNeeded();
  await open.click();
  const dialog = page.getByRole("dialog", { name });
  await expect(dialog).toBeVisible();
  return { open, dialog };
}

test("clicking a card opens its modal; Close returns focus to the card", async ({
  page,
}) => {
  await page.goto("/");
  const { open, dialog } = await openProject(page, "Jogo");
  await expect(page).toHaveURL(/#project-jogo$/);
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await expect(dialog).toContainText("Heavy Frames");
  await expect(dialog.getByRole("link", { name: /Live site/ })).toHaveAttribute(
    "href",
    "https://ricardomartinez10.github.io/jogo/",
  );
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
  await expect(page).not.toHaveURL(/#project-/);
});

test("Escape closes the modal", async ({ page }) => {
  await page.goto("/");
  const { dialog } = await openProject(page, "Borondo");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("a click on the backdrop closes the modal", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const { dialog } = await openProject(page, "Ingaser");
  await page.mouse.click(40, 450);
  await expect(dialog).toBeHidden();
});

test("keyboard focus stays inside the open modal", async ({ page }) => {
  await page.goto("/");
  const { dialog } = await openProject(page, "Jogo");
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(
      () =>
        document.activeElement?.closest("dialog") !== null ||
        document.activeElement === document.body,
    );
    expect(inside).toBe(true);
  }
  await expect(dialog).toBeVisible();
});

test("long content scrolls inside the modal while the page stays still", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/");
  await openProject(page, "Lime Delivery");
  const panel = page.locator("[data-modal-panel]");
  const pageY = await page.evaluate(() => window.scrollY);
  const scrollable = await panel.evaluate(
    (el) => el.scrollHeight > el.clientHeight,
  );
  expect(scrollable).toBe(true);
  await panel.hover();
  await page.mouse.wheel(0, 800);
  await expect
    .poll(() => panel.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
});

test("projects without portraits show their preview image", async ({
  page,
}) => {
  await page.goto("/");
  const { dialog } = await openProject(page, "Hockey Town");
  await expect(dialog.getByRole("img")).toHaveCount(1);
  await expect(dialog.getByRole("img")).toHaveAttribute("alt", /Hockey Town/);
});

test("a deep link opens the project directly", async ({ page }) => {
  await page.goto("/#project-wild-friends");
  const dialog = page.getByRole("dialog", { name: "Wild Friends" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveCount(3);
});

for (const width of [375, 768, 1280]) {
  test(`at ${width}px the modal fits the screen`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const { dialog } = await openProject(page, "Move On");
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.height).toBeLessThanOrEqual(800);
  });
}

test("an axe scan finds no serious issues with the modal open and closed", async ({
  page,
}) => {
  await page.goto("/");
  for (const open of [false, true]) {
    if (open) await openProject(page, "Jogo");
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  }
});

test("visual check screenshots (375px and 1280px)", async ({
  page,
}, testInfo) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#project-wild-friends");
    await page.getByRole("dialog").waitFor();
    await page.screenshot({
      path: `test-results/soc-19-modal-${testInfo.project.name}-${width}.png`,
    });
  }
});
