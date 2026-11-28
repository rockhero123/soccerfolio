import { test as base, expect, type Page } from "@playwright/test";
import { CONTACT_UNLOCKED_KEY } from "../src/components/contact-game/unlock";
import { SKIP_THEATER_KEY } from "../src/components/easter-egg/theaterSkip";

/**
 * The theater (spec 900 US-2 AC6) opens in front of the page on every load.
 * These fixtures skip it (see `theaterSkip.ts`), so each test sees the page,
 * silent, and they unlock the contact signs (spec 900 US-3, `unlock.ts`), so
 * contact tests see them without playing the game. Tests of the theater and
 * the contact game import from `@playwright/test` directly.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(
      (keys) => {
        try {
          for (const key of keys) sessionStorage.setItem(key, "1");
        } catch {
          // Storage blocked: the theater shows, as for a visitor.
        }
      },
      [SKIP_THEATER_KEY, CONTACT_UNLOCKED_KEY],
    );
    await provide(page);
  },
});

/**
 * The section's visible title: its banner heading, or for #contact (whose
 * <h2> is for screen readers only, spec 900 US-3) its first visible content:
 * the CONTACT ingot or the painted invitation.
 */
export function sectionTitle(page: Page, id: string) {
  return id === "contact"
    ? page.locator("section#contact :is([data-contact-gate-button], [data-grass-paint])").first()
    : page.locator(`section#${id} h2`);
}

export { expect, type Page };
