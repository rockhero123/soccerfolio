/**
 * Google Analytics 4 (spec 900 US-3 AC10): the measurement ID comes from the
 * build environment (`NEXT_PUBLIC_GA_ID`). Without it nothing is loaded and
 * `track` does nothing, so local development and tests send no data.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** The events the site reports. */
export type AnalyticsEvent = "contact_click" | "game_win" | "game_lose";

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: Record<string, unknown>) => void;
  }
}

/** Sends an event to Google Analytics, if it is loaded. Never throws. */
export function track(event: AnalyticsEvent, params?: Record<string, unknown>) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    // Analytics must never break the page.
  }
}
