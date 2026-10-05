---
id: "002"
title: "Hero"
status: draft
jira_epic: ""
depends_on: ["001"]
---

# 002 — Hero

## Summary
The first screen: who Ricardo is, what he does, and the two main actions (view projects, contact).

## Goals
- Communicate name, role and value proposition in a few seconds (manifest G1).

## Non-goals
- Heavy animations or video backgrounds.

## User stories

### US-1: Hero introduction
**As a** recruiter, **I want** to see name, role and a short pitch right away, **so that** I know immediately if the profile is relevant.

**Acceptance criteria**
- [ ] AC1 — The hero shows a greeting, the full name as the only `<h1>` on the page, the role, and a one- or two-sentence tagline. All text comes from `src/content/hero.ts`.
- [ ] AC2 — The hero fills at least the first viewport on desktop and is fully visible without scrolling at 375×667.
- [ ] AC3 — An optional profile photo uses `next/image` with `priority` and descriptive alt text.

**Jira:** —

### US-2: Call-to-action buttons
**As a** visitor, **I want** clear buttons, **so that** I can go straight to projects or contact.

**Acceptance criteria**
- [ ] AC1 — A primary button "View my work" scrolls to `#projects`.
- [ ] AC2 — A secondary button "Contact me" scrolls to `#contact`.
- [ ] AC3 — Both buttons have visible focus and hover states and meet WCAG AA contrast.

**Jira:** —

### US-3: Social links
**As a** technical lead, **I want** GitHub and LinkedIn links in the hero, **so that** I can check the profile quickly.

**Acceptance criteria**
- [ ] AC1 — Icon links to GitHub and LinkedIn open in a new tab with `rel="noopener noreferrer"`.
- [ ] AC2 — Each icon link has an accessible name (e.g. `aria-label="GitHub profile"`).

**Jira:** —

## Content / data model
```ts
// src/content/hero.ts
export const hero = {
  greeting: "Hi, I'm",
  name: "Ricardo Martinez",
  role: "TODO e.g. Full-Stack Software Developer",
  tagline: "TODO one or two sentences about what you build",
  photo: { src: "/images/profile.jpg", alt: "Portrait of Ricardo Martinez" }, // optional
};
```
Social links are defined once in `src/content/social.ts` and shared with spec 007.

## Design notes
- Layout: `TODO` (text left and photo right, or centered?) — see `design/`.
- Mobile: elements stack vertically.

## Testing notes
- Vitest: renders the name in an `<h1>`, the role and the tagline; buttons have the correct `href`.
- Playwright: "View my work" scrolls to the projects section.

## Open questions
- [ ] Final role title and tagline text.
- [ ] Include a profile photo?
