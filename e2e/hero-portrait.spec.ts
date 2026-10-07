import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const label = /Cartoon portrait of Ricardo Martinez/;

for (const width of [375, 1280]) {
  test(`AC3 — at ${width}px the hair breaks out above the portrait circle`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const portrait = page.getByRole("img", { name: label });
    await expect(portrait).toBeVisible();
    const frame = (await portrait
      .locator('[data-portrait-part="frame"]')
      .boundingBox())!;
    const hair = (await portrait
      .locator('[data-portrait-part="hair"]')
      .boundingBox())!;
    // The hair rises clearly above the circle and stays centred on it.
    expect(hair.y).toBeLessThan(frame.y - 8);
    expect(
      Math.abs(hair.x + hair.width / 2 - (frame.x + frame.width / 2)),
    ).toBeLessThan(2);
    // The portrait stays inside its container.
    const card = (await portrait.locator("xpath=..").boundingBox())!;
    expect(hair.y).toBeGreaterThanOrEqual(card.y);
  });
}

test("AC4 — the portrait is announced as one image with its label", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main")).toMatchAriaSnapshot(
    `- img /Cartoon portrait of Ricardo Martinez/`,
  );
});

test("AC2 — the shirt shows the three Colombia flag colours", async ({
  page,
}) => {
  await page.goto("/");
  const portrait = page.getByRole("img", { name: label });
  await expect(portrait.locator('[data-portrait-part="shirt"]')).toHaveCSS(
    "fill",
    "rgb(232, 182, 48)",
  );
  await expect(
    portrait.locator('[data-portrait-part="flag"] rect').nth(0),
  ).toHaveCSS("fill", "rgb(44, 84, 145)");
  await expect(
    portrait.locator('[data-portrait-part="flag"] rect').nth(1),
  ).toHaveCSS("fill", "rgb(200, 49, 43)");
});

test("an axe scan finds no serious issues with the portrait", async ({
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
    await page.getByRole("img", { name: label }).screenshot({
      path: `test-results/soc-11-portrait-${testInfo.project.name}-${width}.png`,
      scale: "device",
    });
  }
});
