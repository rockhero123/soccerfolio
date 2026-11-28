---
id: "007"
title: "Contact and footer"
status: approved
jira_epic: "SOC-24"
depends_on: ["001"]
---

# 007 — Contact and footer

## Summary
An easy way to get in touch: Ricardo's phone, email, LinkedIn and GitHub, each on its own pixel-art wooden sign with leaves at its foot, lined up like players in the dark-grass contact zone of the field, under an invitation painted on the grass. Plus the site footer.

## Goals
- Contact in one click (manifest G4).

## Non-goals
- A contact form with a backend (v1 uses direct links; a form is possible in v2).
- A CV download (manifest G4). It comes later, when the owner publishes the PDF.

> **Easter egg (spec 900 US-3):** the contact signs below are hidden behind a CONTACT gold-ingot button and revealed by winning a short soccer game (or with "Skip the game").

## User stories

### US-1: Contact board
**As a** recruiter, **I want** clear contact options, **so that** I can reach Ricardo right away.

**Context**
The `#contact` section keeps its "Contact" title banner (spec 001 US-6). Below it, the invitation "Want to build something together, or just talk football?" is **painted in white on the dark grass** (manifest §6 exception). Below that, the four contact items stand as **separate wooden signs**, lined up like players (owner decision):

```
        [ Phone ][ Email ]          ← midfielders: close together, centred
[ LinkedIn ]              [ GitHub ] ← forwards: wide apart, out on the wings
```

Each sign is a light pixel wooden plank (`WoodPlank`) with a garland of shaded pixel leaves along its bottom edge, showing a small pixel icon, the label and the value burned into the wood in `ink`. There are no email buttons (owner decision); the email sign itself is the `mailto:` link. Contact details come from the owner's CV (`cv_source_data/`).

| Item | Line | Shown as | Link |
|---|---|---|---|
| Phone | midfielder (left) | +57 310 591 1019 | `tel:+573105911019` |
| Email | midfielder (right) | ricardo.martinezc10@gmail.com | `mailto:ricardo.martinezc10@gmail.com` |
| LinkedIn | forward (left) | linkedin.com/in/ricardomartinez10 | `https://www.linkedin.com/in/ricardomartinez10` (new tab) |
| GitHub | forward (right) | github.com/rockhero123 | `https://github.com/rockhero123` (new tab) |

**Acceptance criteria**
- [ ] AC1 — Each contact item is its own `ContactSign`: a pixel wooden plank (`WoodPlank`, nails and knot) with a seamless garland of shaded pixel leaves (`leaf-*` ramp, `leaf-900` outline) along its bottom edge. The signs replace the contact placeholder card in `#contact`, below its title banner.
- [ ] AC2 — The signs are lined up as in the table: from 768px, phone and email (midfielders) form the top row, leaning in towards the middle and close together; LinkedIn and GitHub (forwards) form the row below, pushed out to the sides, so the gap between the forwards is larger than the gap between the midfielders. Below 768px the signs stack in one column in the same order. For screen readers they are one list, "Contact details", in that order.
- [ ] AC3 — Each sign is one link with the href in the table, with a decorative pixel icon (`aria-hidden`), a visible label and its value. LinkedIn and GitHub open in a new tab with `rel="noopener noreferrer"` and say so to screen readers. There are no "Send an email" or "Copy email" buttons.
- [ ] AC4 — The invitation "Want to build something together, or just talk football?" is the only text besides the signs. It is painted on the grass in `chalk` (`paper-100`) heading text with a crisp `grass-900` pixel edge, ≥ 4.5:1 on both contact-zone grass stripes under the film overlay.
- [ ] AC5 — Sign text is `ink` on light wood (manifest §6), at least 1rem, ≥ 4.5:1 under the film overlay. Signs have the visible red focus ring and are keyboard reachable. Nothing overflows at 375px, 768px or 1280px+; long values (the email, the URLs) wrap after `@` and `/` instead of overflowing.
- [ ] AC6 — The data (items, their line, the invitation) comes from `src/content/social.ts`.

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

export const contactInvite =
  "Want to build something together, or just talk football?";

export type ContactKind = "phone" | "email" | "linkedin" | "github";
export type ContactLine = "midfielders" | "forwards";

export type ContactItem = {
  kind: ContactKind;
  label: string;     // "Email"
  value: string;     // the visible value, e.g. "github.com/rockhero123"
  href: string;
  external: boolean; // opens in a new tab
  line: ContactLine; // within a line, the first item is on the left
};

/** phone, email (midfielders), then linkedin, github (forwards). */
export const contactItems: readonly ContactItem[];
```
The footer (US-2) reuses `social` for its icon links.

## Design notes
- Matches manifest §6: hand-coded pixel art in token ramps, light wood signs with `ink` lettering. The painted invitation is the one documented exception to "text always sits on a surface".
- Each sign reuses `WoodPlank` (nails, knot, notched outline) and is at most 19rem wide. The leaf garland is a repeating 48 × 12 art-pixel tile of shaded leaf clumps (`LEAF` ramp, lit from the top left), with a few lower hanging leaves and tiny `pink-300` / `gold-400` flowers, outlined in `leaf-900`; it sits 7 art pixels below the sign's bottom edge.
- Lineup: a two-column grid from 768px (`gap-x-4`). Midfielders align to the inner edges of their columns (`justify-end` / `justify-start`) with an extra 1rem each side of the middle (about 3rem between them); forwards align to the outer edges, pulled in 3rem from each side from 1024px (owner tweak). On wide screens this reads clearly as a formation; at 768px the zone is only about 616px wide, so the two rows look almost the same.
- The invitation is `font-heading` (3xl, 4xl from 768px), centred, in `paper-100` with a one-pixel `grass-900` outline and drop shadow (`text-shadow`), so it looks painted onto the lawn.
- Icons (phone handset, envelope, "in" badge, cat-shaped GitHub mark) are small hand-drawn pixel sprites in `ink` on a `paper-200` chip, not copies of the brand files.
- Long values get soft line breaks after `@` and `/` (`<wbr>`); `overflow-wrap: anywhere` is the last resort.
- Hover: the sign rises one art pixel and the value is underlined (no movement with reduced motion).
- Focus: signs use `focus-visible:outline-3 outline-red-600 outline-offset-4`. Do **not** add `outline-none` to the same element: in Tailwind v4 it sets `--tw-outline-style: none`, which the focus-visible outline inherits, so the ring disappears (the same bug was fixed in the header).

## Implementation (US-1)
| File | Role |
|---|---|
| `src/content/social.ts` | `social`, `contactInvite` and `contactItems` (AC6) |
| `src/components/contact/ContactLineup.tsx` | The painted invitation and the list of signs in their formation |
| `src/components/contact/ContactSign.tsx` | One sign: plank, garland, icon, label and value; the whole sign is the link |
| `src/components/contact/LeafGarland.tsx` | The repeating leaf strip (`PixelPattern`) |
| `src/components/contact/contactArt.ts` | The four 9 × 9 icons and the garland tile |
| `src/app/page.tsx` | Renders `ContactLineup` in `#contact`; `PlaceholderCard` was deleted (no section uses it any more) |

History: the first version was a single board with all four items, a "Send an email" button and a "Copy email" button; the owner asked for one sign per item in a formation and for the buttons to be removed.

## Testing notes
- Vitest (`ContactLineup.test.tsx`): every sign has its plank, nails and leaf garland; the items are midfielders (phone, email) then forwards (LinkedIn, GitHub) with the inward/outward alignment classes and one column on phones; each sign links to its href and shows label and value; external links open in a new tab and say so; icons are decorative pixel sprites; there are no buttons; the invitation is `paper-100` with a `grass-900` edge and ≥ 4.5:1 on both grass stripes under the vignette; sign text is ink ≥ 4.5:1 on wood and paper; focus-ring classes without `outline-none`; tokens only.
- Playwright (`e2e/contact.spec.ts`): four signs, each with leaves over its bottom edge; at 1280px the midfielders are one row above the forwards and closer together than them, with the forwards outside; at 375px the signs stack; hrefs are right and there are no buttons; the invitation is white; nothing overflows at 375, 768 and 1280px; Tab moves through the signs with a solid focus outline; an axe check of `#contact` finds no serious issues.

## Open questions
- [x] Which email to show publicly? ricardo.martinezc10@gmail.com, plus the phone number (owner decision, from the CV).
- [x] Visual: one wooden sign with leaves at the bottom per item, in a 2-midfielders / 2-forwards lineup, the invitation painted in white on the grass, no email buttons (owner decisions).
- [ ] CV download link: when the owner publishes the PDF.
