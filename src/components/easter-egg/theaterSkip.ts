/**
 * The theater (spec 900 US-2 AC6) opens on every page load. Automated tests
 * (and developers) can skip it for a browser session by setting this
 * sessionStorage key; the page then loads as if the visitor entered without
 * music. Visitors never set it.
 */
export const SKIP_THEATER_KEY = "soccerfolio-skip-theater";

/** Runs before the page paints, so a skipped theater never flashes. */
export const SKIP_THEATER_SCRIPT = `try{if(sessionStorage.getItem("${SKIP_THEATER_KEY}"))document.documentElement.setAttribute("data-skip-theater","")}catch(e){}`;

export function theaterSkipped(): boolean {
  try {
    return sessionStorage.getItem(SKIP_THEATER_KEY) !== null;
  } catch {
    return false;
  }
}
