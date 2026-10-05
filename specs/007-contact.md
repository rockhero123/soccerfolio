---
id: "007"
title: "Contact and footer"
status: draft
jira_epic: ""
depends_on: ["001"]
---

# 007 — Contact and footer

## Summary
An easy way to get in touch, plus the site footer.

## Goals
- Contact in one click (manifest G4).

## Non-goals
- A contact form with a backend (v1 uses direct links; a form is possible in v2).

## User stories

### US-1: Contact section
**As a** recruiter, **I want** clear contact options, **so that** I can reach Ricardo right away.

**Acceptance criteria**
- [ ] AC1 — Section `#contact` has an `<h2>` (e.g. "Let's work together"), a short invitation text, and a primary `mailto:` button.
- [ ] AC2 — Lists links to email, LinkedIn and GitHub, using the shared `src/content/social.ts`.
- [ ] AC3 — A "Copy email" button copies the address to the clipboard and shows a confirmation for about 2 seconds, announced to screen readers through `aria-live`.

**Jira:** —

### US-2: Footer
**As a** visitor, **I want** a footer, **so that** the page ends cleanly and I can find links again.

**Acceptance criteria**
- [ ] AC1 — The footer shows "© <current year> Ricardo Martinez", with the year calculated automatically.
- [ ] AC2 — The footer repeats the social icon links and has a "Back to top" link.

**Jira:** —

## Content / data model
```ts
// src/content/social.ts
export const social = {
  email: "TODO",
  github: "TODO",
  linkedin: "TODO",
};
```

## Design notes
- `TODO` — see `design/`.

## Testing notes
- Vitest: the copy button calls the clipboard API and shows the confirmation; the footer shows the current year.

## Open questions
- [ ] Which email to show publicly?
