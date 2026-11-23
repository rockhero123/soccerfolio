import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const grid = "[data-project-grid]";
const ORDER = [
  "Jogo",
  "Lime Delivery",
  "Sensturo",
  "Ingaser",
  "Borondo",
  "Move On",
  "Hockey Town",
  "Wild Friends",
];

test("AC1 — eight cards in order under the Projects banner", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("section#projects");
  await expect(section.locator(`${grid} h3`)).toHaveText(ORDER);
  const banner = (await section.locator("[data-title-banner]").boundingBox())!;
  const first = (await section
    .locator("[data-project]")
    .first()
    .boundingBox())!;
  expect(first.y).toBeGreaterThan(banner.y + banner.height - 1);
});

test("AC2 — preview images load lazily and only existing links show", async ({
  page,
}) => {
  await page.goto("/");
  const imgs = page.locator(`${grid} img`);
  await expect(imgs).toHaveCount(8);
  for (const img of await imgs.all()) {
    await expect(img).toHaveAttribute("loading", "lazy");
    expect((await img.getAttribute("alt"))!.length).toBeGreaterThan(5);
  }
  await expect(
    page
      .locator('[data-project="jogo"]')
      .getByRole("link", { name: /Live site/ }),
  ).toHaveAttribute("href", "https://ricardomartinez10.github.io/jogo/");
  await expect(
    page
      .locator('[data-project="sensturo"]')
      .getByRole("link", { name: /Live site|Code/ }),
  ).toHaveCount(0);
});

test("AC4 — clicking anywhere on a card, or Enter on its title, opens its detail link", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator('[data-project="borondo"]');
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.3);
  await expect(page).toHaveURL(/#project-borondo$/);

  await page.goto("/");
  const open = page.getByRole("link", { name: "Move On — view details" });
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#project-move-on$/);
});

test("AC4 — the live link still works on its own", async ({ page }) => {
  await page.goto("/");
  const live = page
    .locator('[data-project="ingaser"]')
    .getByRole("link", { name: /Live site/ });
  await live.scrollIntoViewIfNeeded();
  const box = (await live.boundingBox())!;
  const hit = await page.evaluate(
    ({ x, y }) =>
      document.elementFromPoint(x, y)?.closest("a")?.getAttribute("href"),
    { x: box.x + box.width / 2, y: box.y + box.height / 2 },
  );
  expect(hit).toBe("http://ingaser.com.co/");
});

for (const [width, cols] of [
  [375, 1],
  [768, 2],
  [1280, 3],
] as const) {
  test(`AC5 — ${cols} column(s) at ${width}px, no horizontal scroll`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const columns = await page
      .locator(grid)
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(cols);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

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
    await page.locator(`${grid} img`).evaluateAll((imgs) =>
      Promise.all(
        imgs.map((i) => {
          (i as HTMLImageElement).loading = "eager";
          return (i as HTMLImageElement).decode().catch(() => {});
        }),
      ),
    );
    await page.locator("section#projects").screenshot({
      path: `test-results/soc-18-grid-${testInfo.project.name}-${width}.png`,
    });
  }
});
