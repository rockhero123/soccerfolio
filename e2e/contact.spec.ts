import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const lineup = '[data-field-zone="contact"] #contact [data-contact-lineup]';
const sign = (kind: string) => `${lineup} [data-contact="${kind}"]`;

test("AC1 — every contact item stands on its own wooden sign with leaves at its foot", async ({
  page,
}) => {
  await page.goto("/");
  for (const kind of ["phone", "email", "linkedin", "github"]) {
    const plank = (await page.locator(`${sign(kind)} [data-wood="plank"]`).boundingBox())!;
    const leaves = (await page.locator(`${sign(kind)} [data-leaf-garland]`).boundingBox())!;
    expect(leaves.y).toBeLessThan(plank.y + plank.height);
    expect(leaves.y + leaves.height).toBeGreaterThan(plank.y + plank.height);
  }
  await expect(page.locator(`${lineup} [data-wood="plank"]`)).toHaveCount(4);
});

test("AC2 — at 1280px two midfielders sit close together above two forwards wide apart", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const box = async (kind: string) => (await page.locator(sign(kind)).boundingBox())!;
  const [phone, email, linkedin, github] = await Promise.all(
    ["phone", "email", "linkedin", "github"].map(box),
  );
  // Rows: midfielders above forwards.
  expect(Math.abs(phone.y - email.y)).toBeLessThan(2);
  expect(Math.abs(linkedin.y - github.y)).toBeLessThan(2);
  expect(linkedin.y).toBeGreaterThan(phone.y + phone.height);
  // The midfielders are closer together than the forwards.
  const midGap = email.x - (phone.x + phone.width);
  const fwdGap = github.x - (linkedin.x + linkedin.width);
  expect(midGap).toBeLessThan(fwdGap);
  // The forwards stand outside the midfielders.
  expect(linkedin.x).toBeLessThan(phone.x);
  expect(github.x + github.width).toBeGreaterThan(email.x + email.width);
});

test("AC2 — at 375px the signs stack in one column", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const ys = [];
  for (const kind of ["phone", "email", "linkedin", "github"])
    ys.push((await page.locator(sign(kind)).boundingBox())!.y);
  expect(ys).toEqual([...ys].sort((a, b) => a - b));
  expect(new Set(ys).size).toBe(4);
});

test("AC3 — each sign links out; no email buttons", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(sign("phone"))).toHaveAttribute("href", "tel:+573105911019");
  await expect(page.locator(sign("email"))).toHaveAttribute(
    "href",
    "mailto:ricardo.martinezc10@gmail.com",
  );
  await expect(page.locator(sign("linkedin"))).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/ricardomartinez10",
  );
  await expect(page.locator(sign("github"))).toHaveAttribute(
    "href",
    "https://github.com/rockhero123",
  );
  await expect(page.locator("#contact").getByRole("button")).toHaveCount(0);
});

test("AC4 — the invitation is painted in white on the grass", async ({ page }) => {
  await page.goto("/");
  const paint = page.locator(`${lineup} [data-grass-paint]`);
  await expect(paint).toHaveText("Want to build something together, or just talk football?");
  await expect(paint).toHaveCSS("color", "rgb(255, 251, 239)");
});

for (const width of [375, 768, 1280]) {
  test(`AC5 — at ${width}px the lineup fits without horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const zone = (await page.locator("#contact").boundingBox())!;
    for (const kind of ["phone", "email", "linkedin", "github"]) {
      const b = (await page.locator(sign(kind)).boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(zone.x - 1);
      expect(b.x + b.width).toBeLessThanOrEqual(zone.x + zone.width + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("AC5 — the signs are keyboard reachable with a visible focus ring", async ({ page }) => {
  await page.goto("/");
  await page.locator(sign("phone")).focus();
  for (const kind of ["email", "linkedin", "github"]) {
    await page.keyboard.press("Tab");
    const link = page.locator(sign(kind));
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
  }
});

test("an axe scan of the contact section finds no serious issues", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).include("#contact").analyze();
  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
