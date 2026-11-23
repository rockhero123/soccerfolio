import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const cards = "section#projects [data-project]";

test("clicking a filter changes the visible cards and announces the count", async ({
  page,
}) => {
  await page.goto("/");
  const group = page.getByRole("group", {
    name: "Filter projects by category",
  });
  await expect(group.getByRole("button")).toHaveText([
    "All",
    "Web",
    "Mobile app",
    "Interactive installation",
    "Java game",
  ]);
  await expect(page.locator(cards)).toHaveCount(8);
  await expect(
    group.getByRole("button", { name: "All", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  await group.getByRole("button", { name: "Java game" }).click();
  await expect(page.locator(`${cards} h3`)).toHaveText([
    "Hockey Town",
    "Wild Friends",
  ]);
  await expect(
    group.getByRole("button", { name: "Java game" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    group.getByRole("button", { name: "All", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#projects").getByRole("status")).toHaveText("2 projects");
  await expect(group.getByRole("button", { name: "Java game" })).toHaveCSS(
    "background-color",
    "rgb(0, 82, 45)",
  );

  await group.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(cards)).toHaveCount(8);
  await expect(page.locator("#projects").getByRole("status")).toHaveText("8 projects");
});

test("filters work from the keyboard and filtered cards still open their modal", async ({
  page,
}) => {
  await page.goto("/");
  const web = page.getByRole("button", { name: "Web", exact: true });
  await web.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(`${cards} h3`)).toHaveText(["Jogo", "Ingaser"]);
  await page.getByRole("link", { name: "Ingaser — view details" }).click();
  await expect(page.getByRole("dialog", { name: "Ingaser" })).toBeVisible();
});

for (const width of [375, 768, 1280]) {
  test(`at ${width}px the filters wrap without horizontal scroll`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const group = page.getByRole("group", {
      name: "Filter projects by category",
    });
    const box = (await group.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    for (const b of await group.getByRole("button").all()) {
      const bb = (await b.boundingBox())!;
      expect(bb.x + bb.width).toBeLessThanOrEqual(width);
    }
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("an axe scan finds no serious issues with a filter active", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mobile app" }).click();
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
    await page.getByRole("button", { name: "Mobile app" }).click();
    await page.locator("section#projects").screenshot({
      path: `test-results/soc-20-filters-${testInfo.project.name}-${width}.png`,
    });
  }
});
