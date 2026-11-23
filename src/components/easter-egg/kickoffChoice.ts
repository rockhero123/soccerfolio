/**
 * The visitor's Kick off choice for this browser session (spec 900 US-2 AC6).
 * `music`: kicked off with music; `silent`: entered without music.
 */
export type KickOffChoice = "music" | "silent";

export const KICKOFF_KEY = "soccerfolio-kickoff";

/** Runs before the page paints, so the overlay never flashes on later loads. */
export const KICKOFF_INIT_SCRIPT = `try{if(sessionStorage.getItem("${KICKOFF_KEY}"))document.documentElement.setAttribute("data-kicked-off","")}catch(e){}`;

export function readChoice(): KickOffChoice | null {
  try {
    const value = sessionStorage.getItem(KICKOFF_KEY);
    return value === "music" || value === "silent" ? value : null;
  } catch {
    return null;
  }
}

export function saveChoice(choice: KickOffChoice): void {
  try {
    sessionStorage.setItem(KICKOFF_KEY, choice);
    document.documentElement.setAttribute("data-kicked-off", "");
  } catch {
    // Private mode or blocked storage: the overlay simply shows again next time.
  }
}
