---
id: "001"
title: "Foundation: layout, theme and navigation"
status: draft
jira_epic: ""
depends_on: []
---

# 001 — Foundation: layout, theme and navigation

## Summary
The base every section depends on: design tokens, fonts, the page shell, the header navigation, and the 404 page.

## Goals
- One source of design tokens (colors, fonts, spacing).
- Sticky header with anchor navigation that works on mobile and desktop.
- Remove the default Next.js starter page.

## Non-goals
- Section content (covered by specs 002–007).

## User stories

### US-1: Design tokens and fonts
**As a** developer, **I want** the theme defined once as tokens, **so that** every section looks consistent.

**Acceptance criteria**
- [ ] AC1 — Colors, fonts, radius and spacing from manifest §6 are defined as Tailwind v4 theme tokens in `globals.css`.
- [ ] AC2 — Fonts load with `next/font`, with no layout shift.
- [ ] AC3 — The default create-next-app styles and starter page content are removed.

**Jira:** —

### US-2: Page shell and sections
**As a** visitor, **I want** a single scrollable page with clear sections, **so that** I can browse everything easily.

**Acceptance criteria**
- [ ] AC1 — `page.tsx` renders the sections in this order: hero, about, skills, experience, projects, contact. Each is an empty `<section id="…">` placeholder.
- [ ] AC2 — `layout.tsx` uses semantic `<header>`, `<main>` and `<footer>`, and sets `lang="en"`.
- [ ] AC3 — Content width is constrained and centered, with responsive padding.

**Jira:** —

### US-3: Header navigation
**As a** visitor, **I want** a navigation bar, **so that** I can jump to any section.

**Acceptance criteria**
- [ ] AC1 — The header shows the logo or name (links to `#hero`) and links to About, Skills, Experience, Projects and Contact.
- [ ] AC2 — The header stays fixed at the top while scrolling. Clicking a link scrolls smoothly, and the section heading is not hidden under the header.
- [ ] AC3 — Below 768px, the links collapse into a hamburger menu that opens and closes with mouse, touch and keyboard (Esc closes it). The menu closes after a link is chosen.
- [ ] AC4 — The link for the section currently in view is visually highlighted.
- [ ] AC5 — Smooth scrolling is disabled when the user has `prefers-reduced-motion` set.

**Jira:** —

### US-4: 404 page
**As a** visitor who followed a broken link, **I want** a friendly 404 page, **so that** I can get back home.

**Acceptance criteria**
- [ ] AC1 — Unknown routes show a themed `not-found.tsx` page with a link to `/`.

**Jira:** —

## Content / data model
```ts
// src/content/site.ts
export const site = {
  name: "Ricardo Martinez",
  role: "Software Developer",
  nav: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
} as const;
```

## Design notes
- Header style and logo: `TODO` (see reference images in `design/`).

## Testing notes
- Vitest: the mobile menu toggles open and closed; Esc closes it.
- Playwright: each nav link scrolls to its section, on both desktop and mobile; an unknown route shows the 404 page.

## Open questions
- [ ] Text logo (name or initials) or an image logo?
- [ ] Theme toggle (light/dark) in the header?
