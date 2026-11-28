/**
 * The CONTACT button (spec 900 US-3) shows on every page load. Automated
 * tests can unlock the contact signs for a browser session by setting this
 * sessionStorage key, so they see the signs without playing. Visitors never
 * set it.
 */
export const CONTACT_UNLOCKED_KEY = "soccerfolio-contact-unlocked";

/** Runs before the page paints, so unlocked contact signs never flash the button first. */
export const CONTACT_UNLOCKED_SCRIPT = `try{if(sessionStorage.getItem("${CONTACT_UNLOCKED_KEY}"))document.documentElement.setAttribute("data-contact-unlocked","")}catch(e){}`;

export function contactUnlocked(): boolean {
  try {
    return sessionStorage.getItem(CONTACT_UNLOCKED_KEY) !== null;
  } catch {
    return false;
  }
}
