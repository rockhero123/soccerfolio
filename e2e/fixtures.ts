import { test as base, expect, type Page } from "@playwright/test";
import { SKIP_THEATER_KEY } from "../src/components/easter-egg/theaterSkip";

/**
 * The theater (spec 900 US-2 AC6) opens in front of the page on every load.
 * These fixtures skip it (see `theaterSkip.ts`), so each test sees the page,
 * silent. Tests of the theater itself import from `@playwright/test` directly.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(
      ([key]) => {
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          // Storage blocked: the theater shows, as for a visitor.
        }
      },
      [SKIP_THEATER_KEY],
    );
    await provide(page);
  },
});

export { expect, type Page };
