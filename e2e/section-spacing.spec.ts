import { expect, test } from "@playwright/test";

/** Measured gaps between the playing-zone sections, and from each title banner to its content. */
async function spacing(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const sections = ["hero", "skills", "projects"].map((id) =>
      document.getElementById(id)!,
    );
    const between = sections.slice(1).map((el, i) => {
      const nextBanner = el
        .querySelector("[data-title-banner]")!
        .getBoundingClientRect();
      const prevContent = sections[i].lastElementChild!.getBoundingClientRect();
      return nextBanner.top - prevContent.bottom;
    });
    const titleToBody = [...document.querySelectorAll("main section")].map(
      (el) => {
        const banner = el
          .querySelector("[data-title-banner]")!
          .getBoundingClientRect();
        return el.children[1].getBoundingClientRect().top - banner.bottom;
      },
    );
    return { between, titleToBody };
  });
}

for (const [width, minBetween, minTitle] of [
  [375, 96, 36],
  [1280, 160, 52],
] as const) {
  test(`at ${width}px sections and titles have room to breathe`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const { between, titleToBody } = await spacing(page);
    between.forEach((gap) => expect(gap).toBeGreaterThanOrEqual(minBetween));
    expect(titleToBody).toHaveLength(4);
    titleToBody.forEach((gap) => expect(gap).toBeGreaterThanOrEqual(minTitle));
  });
}
