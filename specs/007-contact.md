---
id: "007"
title: "Contact and footer"
status: approved
jira_epic: "SOC-24"
depends_on: ["001"]
---

# 007 — Contact and footer

## Summary
An easy way to get in touch: Ricardo's phone, email, LinkedIn and GitHub on a pixel-art wooden board with leaves growing along its bottom edge, in the dark-grass contact zone of the field. Plus the site footer.

## Goals
- Contact in one click (manifest G4).

## Non-goals
- A contact form with a backend (v1 uses direct links; a form is possible in v2).
- A CV download (manifest G4). It comes later, when the owner publishes the PDF.

## User stories

### US-1: Contact board
**As a** recruiter, **I want** clear contact options, **so that** I can reach Ricardo right away.

**Context**
The `#contact` section keeps its "Contact" title banner (spec 001 US-6). Below it stands a **contact board**: a light pixel wooden plank (`WoodPlank`, like the intro sign) with a garland of shaded pixel leaves along its bottom edge. On the board, burned into the wood in `ink`: a short invitation, the four contact items, each with a small pixel icon, and the actions.

Invitation text: "Want to build something together, or just talk football? Pick a path and say hello." Contact details come from the owner's CV (`cv_source_data/`).

| Item | Shown as | Link |
|---|---|---|
| Phone | +57 310 591 1019 | `tel:+573105911019` |
| Email | ricardo.martinezc10@gmail.com | `mailto:ricardo.martinezc10@gmail.com` |
| LinkedIn | linkedin.com/in/ricardomartinez10 | `https://www.linkedin.com/in/ricardomartinez10` (new tab) |
| GitHub | github.com/rockhero123 | `https://github.com/rockhero123` (new tab) |

**Acceptance criteria**
- [ ] AC1 — A `ContactBoard` component renders a pixel wooden plank (`WoodPlank`) with a seamless garland of shaded pixel leaves (`leaf-*` ramp, dark-green outline) along its bottom edge, in the `#contact` section below its title banner. It replaces the contact placeholder card.
- [ ] AC2 — The board shows a short invitation text and a list of the four contact items in the table above (phone, email, LinkedIn, GitHub), in that order. Each item has a decorative pixel icon (`aria-hidden`), a visible label and its value, and is one link with the href in the table. LinkedIn and GitHub open in a new tab with `rel="noopener noreferrer"` and say so to screen readers.
- [ ] AC3 — A primary pixel button "Send an email" links to the `mailto:` address.
- [ ] AC4 — A "Copy email" pixel button copies the address to the clipboard and shows "Email copied!" for about 2 seconds, announced to screen readers through a polite `aria-live` region. If the clipboard is not available, it says "Copy failed" instead.
- [ ] AC5 — The data comes from `src/content/social.ts`.
- [ ] AC6 — Text is `ink` on light wood (manifest §6), at least 1rem, ≥ 4.5:1 under the film overlay. Links and buttons have the visible red focus ring and are keyboard reachable. Nothing overflows at 375px, 768px or 1280px+; long values (the email) wrap instead of overflowing.

**Jira:** [SOC-25](https://soccerfolio.atlassian.net/browse/SOC-25)

### US-2: Footer
**As a** visitor, **I want** a footer, **so that** the page ends cleanly and I can find links again.

**Acceptance criteria**
- [ ] AC1 — The footer shows "© <current year> Ricardo Martinez", with the year calculated automatically.
- [ ] AC2 — The footer repeats the social icon links and has a "Back to top" link.

**Jira:** [SOC-26](https://soccerfolio.atlassian.net/browse/SOC-26)

## Content / data model
```ts
// src/content/social.ts
export const social = {
  phone: { label: "+57 310 591 1019", href: "tel:+573105911019" },
  email: "ricardo.martinezc10@gmail.com",
  linkedin: "https://www.linkedin.com/in/ricardomartinez10",
  github: "https://github.com/rockhero123",
} as const;

export type ContactKind = "phone" | "email" | "linkedin" | "github";

export type ContactItem = {
  kind: ContactKind;
  label: string;    // "Email"
  value: string;    // the visible value, e.g. "github.com/rockhero123"
  href: string;
  external: boolean; // opens in a new tab
};

/** The items on the board, in order: phone, email, LinkedIn, GitHub. */
export const contactItems: readonly ContactItem[];
```
The footer (US-2) reuses `social` for its icon links.

## Design notes
- Matches manifest §6: hand-coded pixel art in token ramps, light wood signs with `ink` lettering, text always on a surface.
- The board reuses `WoodPlank` (nails, knot, notched outline). The leaf garland is a repeating pixel tile, so it fits any board width; it hangs a few pixels below the plank like the grass on the title banners.
- Icons (phone handset, envelope, "in" badge, cat-shaped GitHub mark) are small hand-drawn pixel sprites in `ink` on a `paper-200` chip, not copies of the brand files.
- Layout: the items sit in one column below 1024px and in two columns from 1024px, so the email never breaks mid-word on wide screens. The board is at most `max-w-4xl` wide, with less side padding on phones.
- Long values get soft line breaks after `@` and `/` (`<wbr>`), so on phones the email wraps as "ricardo.martinezc10@ / gmail.com" and the URLs after their slashes; `overflow-wrap: anywhere` is the last resort.
- The leaf garland is a 48 × 12 art-pixel tile of shaded leaf clumps (`LEAF` ramp, lit from the top left), with a few lower hanging leaves and tiny `pink-300` / `gold-400` flowers, outlined in `leaf-900`. It sits 7 art pixels below the plank's bottom edge.
- Buttons: "Send an email" is `gold-500` (hover `gold-400`); "Copy email" is `paper-200` (hover `paper-100`); both are `pixel-button`s in `font-heading` with `ink` text. The copy confirmation is shown under the button, in `ink` on the wood.
- Focus: links and buttons use `focus-visible:outline-3 outline-red-600 outline-offset-4`. Do **not** add `outline-none` to the same element: in Tailwind v4 it sets `--tw-outline-style: none`, which the focus-visible outline inherits, so the ring disappears (the same bug was fixed in the header).

## Implementation (US-1)
| File | Role |
|---|---|
| `src/content/social.ts` | `social` and `contactItems` (AC5) |
| `src/components/contact/ContactBoard.tsx` | The board: plank, garland, invitation, items, actions (server component) |
| `src/components/contact/LeafGarland.tsx` | The repeating leaf strip (`PixelPattern`) |
| `src/components/contact/CopyEmailButton.tsx` | Client component: clipboard copy and the 2 s `role="status"` message; the timer restarts on every click |
| `src/components/contact/contactArt.ts` | The four 9 × 9 icons and the garland tile |
| `src/app/page.tsx` | Renders `ContactBoard` in `#contact`; `PlaceholderCard` was deleted (no section uses it any more) |

## Testing notes
- Vitest (`ContactBoard.test.tsx`, `CopyEmailButton.test.tsx`): the plank, nails and leaf garland render; the four items render in order with the right hrefs and visible values; external links open in a new tab and say so; icons are decorative pixel sprites; "Send an email" links to `mailto:`; the copy button calls the clipboard API with the email, shows "Email copied!" in a polite `aria-live` region, clears it after 2 s and restarts the timer on a second click; "Copy failed" shows when the clipboard rejects; ink stays ≥ 4.5:1 on the wood, paper and gold under the vignette; focus-ring classes; tokens only.
- Playwright (`e2e/contact.spec.ts`): the board is in the dark-grass contact zone with the garland over its bottom edge; every link has the right href; Copy email puts the address on the clipboard and the message disappears (Chromium); at 375, 768 and 1280px nothing overflows horizontally; Tab reaches "Send an email" and "Copy email" with a solid focus outline; an axe check of `#contact` finds no serious issues.
- Because the copy message is a second `role="status"` on the page, tests that read the project filter count scope it to `#projects`.

## Open questions
- [x] Which email to show publicly? ricardo.martinezc10@gmail.com, plus the phone number (owner decision, from the CV).
- [x] Visual: a wooden board with leaves at the bottom (owner decision).
- [ ] CV download link: when the owner publishes the PDF.
