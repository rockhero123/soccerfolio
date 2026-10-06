import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const field = '[data-testid="soccer-field"]';
const zone = (name: "play" | "contact") => `${field} [data-field-zone="${name}"]`;
const marking = (name: string) => `${field} [data-marking="${name}"]`;

async function box(page: Page, selector: string) {
  const b = await page.locator(selector).first().boundingBox();
  if (!b) throw new Error(`${selector} has no bounding box`);
  return b;
}

/** Adds tall content to a field zone, like real sections will. */
async function addContent(
  page: Page,
  zoneName: "play" | "contact",
  height: number,
) {
  await page.evaluate(
    ({ selector, h }) => {
      const content = document.querySelector(selector)!.lastElementChild!;
      const filler = document.createElement("section");
      filler.style.height = `${h}px`;
      filler.dataset.testFiller = "true";
      content.append(filler);
    },
    { selector: zone(zoneName), h: height },
  );
}

for (const width of [375, 768, 1280]) {
  test.describe(`at ${width}px`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
    });

    test("AC1 — the field wraps the content and shows every chalk marking", async ({
      page,
    }) => {
      const f = await box(page, field);
      const main = await box(page, "main");
      expect(f.x).toBeGreaterThanOrEqual(main.x);
      expect(f.x + f.width).toBeLessThanOrEqual(main.x + main.width + 0.5);

      // The page content is inside the field.
      const heading = await box(page, `${field} h1`);
      expect(heading.y).toBeGreaterThan(f.y);
      expect(heading.y + heading.height).toBeLessThan(f.y + f.height);

      const boundary = await box(page, marking("boundary"));
      const topArea = await box(page, marking("penalty-area-top"));
      const bottomArea = await box(page, marking("penalty-area-bottom"));
      const halfway = await box(page, marking("halfway-line"));
      const circle = await box(page, marking("center-circle"));

      // Top penalty area hangs from the top line, bottom one stands on the bottom line.
      expect(topArea.y).toBeCloseTo(boundary.y, -1);
      expect(bottomArea.y + bottomArea.height).toBeCloseTo(
        boundary.y + boundary.height,
        -1,
      );
      // Halfway line spans the boundary; the centre circle sits on it.
      expect(halfway.width).toBeCloseTo(boundary.width, 0);
      expect(circle.y + circle.height / 2).toBeCloseTo(
        halfway.y + halfway.height / 2,
        0,
      );
      // Even with little content, the centre circle clears the penalty areas.
      expect(circle.y).toBeGreaterThan(topArea.y + topArea.height);
      expect(circle.y + circle.height).toBeLessThan(bottomArea.y);
      await expect(page.locator(marking("corner-arc"))).toHaveCount(4);
      for (const name of [
        "penalty-box",
        "goal-area",
        "penalty-spot",
        "penalty-arc",
        "goal",
        "center-spot",
      ]) {
        await expect(page.locator(marking(name)).first()).toBeVisible();
      }
    });

    test("AC2 — the field grows with its content and keeps the markings in proportion", async ({
      page,
    }) => {
      const before = await box(page, marking("penalty-area-top"));
      await addContent(page, "play", 2400);
      await addContent(page, "contact", 700);

      const f = await box(page, field);
      for (const filler of await page.locator("[data-test-filler]").all()) {
        const b = await filler.boundingBox();
        expect(b!.y).toBeGreaterThanOrEqual(f.y);
        expect(b!.y + b!.height).toBeLessThanOrEqual(f.y + f.height);
      }
      // The contact content sits above the bottom penalty area, not under it.
      const contactFiller = await box(page, `${zone("contact")} [data-test-filler]`);
      const bottomArea = await box(page, marking("penalty-area-bottom"));
      expect(contactFiller.y + contactFiller.height).toBeLessThanOrEqual(
        bottomArea.y,
      );

      // Shapes keep their drawn proportions however tall the field gets.
      const topArea = await box(page, marking("penalty-area-top"));
      expect(topArea.width).toBeCloseTo(before.width, 0);
      expect(topArea.width / topArea.height).toBeCloseTo(400 / 170, 1);
      const circle = await box(page, marking("center-circle"));
      expect(circle.width).toBeCloseTo(circle.height, 0);

      // The centre circle stays in the middle of the playing zone.
      const play = await box(page, zone("play"));
      expect(circle.y + circle.height / 2).toBeCloseTo(
        play.y + play.height / 2,
        0,
      );

      // No horizontal overflow at this width.
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test("AC3 — mown pitch grass and a pitch-dark contact zone", async ({
      page,
    }) => {
      const play = page.locator(zone("play"));
      await expect(play).toHaveCSS("background-color", "rgb(0, 178, 98)");
      await expect(play).toHaveCSS(
        "background-image",
        /repeating-linear-gradient/,
      );
      const contact = page.locator(zone("contact"));
      await expect(contact).toHaveCSS("background-color", "rgb(0, 82, 45)");
      // The grass strip edges the contact zone, rising into the bright grass.
      const grass = await box(page, `${zone("contact")} [data-grass-strip]`);
      const contactBox = await box(page, zone("contact"));
      expect(grass.y + grass.height).toBeCloseTo(contactBox.y, 0);
    });

    test("AC5 — an axe scan finds no serious issues on the shell", async ({
      page,
    }) => {
      await page.evaluate((selector) => {
        const contact = document.querySelector(selector)!.lastElementChild!;
        const p = document.createElement("p");
        p.textContent = "Contact text on dark grass";
        contact.append(p);
      }, zone("contact"));
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
      // Markings are hidden from assistive tech.
      const markings = page.locator(`${field} [data-field-markings], ${marking("boundary")}`);
      for (const m of await markings.all()) {
        await expect(m).toHaveAttribute("aria-hidden", "true");
      }
    });
  });
}

test("visual check screenshots (375px and 1280px)", async ({ page }, testInfo) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.screenshot({
      path: `test-results/soc-4-field-${testInfo.project.name}-${width}.png`,
      fullPage: true,
    });
  }
});
