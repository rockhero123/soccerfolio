---
id: "001"
title: "Foundation: layout, theme and navigation"
status: draft
jira_epic: ""
depends_on: []
---

# 001 — Foundation: layout, theme and navigation

## Summary
The base every section depends on: the main design concept (an enchanted forest with a soccer field inside), design tokens, fonts, the page shell, the header navigation, and the 404 page.

## Main design concept
The design should be in the rubber-hose animation style: vintage cartoons like the Disney characters of the 1920s and 1930s, and especially the Cuphead game art style (see `design/c1`–`c5` and manifest §6).

The main idea is a **soccer field surrounded by an enchanted forest**. All of the portfolio body is inside the soccer field.

The forest has fantastic characters with exaggerated expressions: plants, mushrooms, trees with faces, flowers with eyes, birds with big eyes, an owl, etc.

## Goals
- One source of design tokens (colors, fonts, outlines).
- An immersive cartoon world: forest background, characters, and the field as the content container.
- A sticky header with anchor navigation that works on mobile and desktop.
- Remove the default Next.js starter page.

## Non-goals
- Section content (covered by specs 002–007).
- Character animation (illustrations are static; see manifest §6).

## User stories

### US-1: Design tokens and fonts
**As a** developer, **I want** the theme defined once as tokens, **so that** every section looks consistent.

**Acceptance criteria**
- [ ] AC1 — All colors, the outline width and the radius from manifest §6 are defined as Tailwind v4 theme tokens in `globals.css` (e.g. `bg-pitch`, `text-ink`).
- [ ] AC2 — Lilita One (headings) and Source Sans 3 (body) load with `next/font/google` and are exposed as `font-heading` and `font-body`, with no layout shift.
- [ ] AC3 — The default create-next-app styles, starter page content and unused `public/` SVGs are removed.

**Jira:** —

### US-2: Enchanted forest background
**As a** visitor, **I want** the page to sit inside an enchanted cartoon forest, **so that** the portfolio feels unique and memorable.

**Acceptance criteria**
- [ ] AC1 — A `ForestBackground` component renders an original SVG forest in the rubber-hose/Cuphead style: at least 3 depth layers (pale distant trees, mid trees, dark foreground foliage), thick ink outlines, and muted tokens (`forest-deep`, `moss`, `bark`).
- [ ] AC2 — The forest fills the full page height behind the content and frames the field on the left and right on desktop (≥ 1024px). Below 1024px it shrinks to a narrow decorative border, with a top and bottom band.
- [ ] AC3 — The forest is decorative: it has `aria-hidden="true"` and cannot receive focus.
- [ ] AC4 — The forest is built from inline SVG components or optimized SVG files, with no raster images. Its total weight is ≤ 150 KB (gzipped).

**Jira:** —

### US-3: Soccer field container
**As a** visitor, **I want** all the portfolio content to be on a soccer field, **so that** the soccer theme ties the whole site together.

**Acceptance criteria**
- [ ] AC1 — A `SoccerField` component wraps all the content sections and renders field markings in `chalk`: outer boundary, corner arcs, a penalty box and goal area at the top, a halfway line with a center circle and spot, and a penalty box and goal at the bottom (as in `design/main.jpg`).
- [ ] AC2 — The field grows with its content: markings stay in proportion and the field never clips sections, at 375px, 768px and 1280px+.
- [ ] AC3 — The grass uses `pitch`, with subtle mowing stripes, and the contact area at the bottom uses `pitch-dark` (see `main.jpg`).
- [ ] AC4 — A reusable `GrassStrip` SVG component (based on the grass in `design_2.ai.pdf`) exists for section title banners.
- [ ] AC5 — Field markings are decorative (`aria-hidden="true"`), and text on the field meets WCAG AA contrast.

**Jira:** —

### US-4: Forest characters
**As a** curious visitor, **I want** to discover fantastic cartoon characters in the forest, **so that** the site feels alive and fun.

**Acceptance criteria**
- [ ] AC1 — At least 6 original static SVG characters in the rubber-hose style, each with an exaggerated face (pie-cut eyes, big expressions): a tree with a face, a mushroom, a flower with eyes, a big-eyed bird, an owl, and a plant.
- [ ] AC2 — Characters are placed in the forest around the field, are visible at desktop widths, and never overlap the field content.
- [ ] AC3 — On mobile, at least 2 characters remain visible in the top and bottom forest bands.
- [ ] AC4 — Each character is its own component in `src/components/forest/`, so it can be reused or replaced.
- [ ] AC5 — Characters are decorative (`aria-hidden="true"`).

**Jira:** —

### US-5: Vintage film effect
**As a** visitor, **I want** a subtle old-film look, **so that** the site feels like a 1930s cartoon.

**Acceptance criteria**
- [ ] AC1 — A fixed full-screen overlay adds subtle film grain and a soft vignette.
- [ ] AC2 — The overlay has `pointer-events: none` and does not reduce text contrast below WCAG AA.
- [ ] AC3 — The overlay is not rendered when `prefers-reduced-motion: reduce` is set.
- [ ] AC4 — The overlay causes no visible scroll jank (it uses CSS or a static SVG noise texture, not a JavaScript animation loop).

**Jira:** —

### US-6: Page shell and sections
**As a** visitor, **I want** a single scrollable page with clear sections, **so that** I can browse everything easily.

Use placeholders for future page sections.

**Acceptance criteria**
- [ ] AC1 — `page.tsx` renders the sections inside `SoccerField` in this order: hero, skills, projects, contact. Each is a placeholder `<section id="…">` with an `<h2>` on a title banner that uses `GrassStrip`.
- [ ] AC2 — `layout.tsx` uses semantic `<header>`, `<main>` and `<footer>`, and sets `lang="en"`.
- [ ] AC3 — Content width inside the field is constrained (max ~1100px) and centered, with responsive padding.

**Jira:** —

### US-7: Header navigation (wooden sign)
**As a** visitor, **I want** a navigation bar, **so that** I can jump to any section.

**Acceptance criteria**
- [ ] AC1 — The header looks like a hand-drawn vintage **wooden sign** (`bark` wood, `ink` outline, `parchment` text) hanging in the forest. It shows the "RM" logo (links to `#hero`) and links to Skills, Projects and Contact.
- [ ] AC2 — The header stays fixed at the top while scrolling. Clicking a link scrolls smoothly, and the section heading is not hidden under the header.
- [ ] AC3 — Below 768px, the links collapse into a hamburger menu that opens and closes with mouse, touch and keyboard (Esc closes it). The menu closes after a link is chosen.
- [ ] AC4 — The link for the section currently in view is highlighted (e.g. a `cartoon-yellow` underline).
- [ ] AC5 — Smooth scrolling is disabled when the user has `prefers-reduced-motion` set.

**Jira:** —

### US-8: 404 page
**As a** visitor who followed a broken link, **I want** a friendly 404 page, **so that** I can get back home.

**Acceptance criteria**
- [ ] AC1 — Unknown routes show a themed `not-found.tsx` page, e.g. "Out of bounds!" with a forest character and a link back to `/`.

**Jira:** —

## Content / data model
```ts
// src/content/site.ts
export const site = {
  name: "Ricardo Martinez",
  shortName: "RM",
  role: "Software Developer",
  nav: [
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
} as const;
```

## Design notes
- Page structure from top to bottom: wooden-sign header → forest top band → field (top goal → hero → skills around the center circle → projects → contact in dark grass → bottom goal) → forest bottom band.
- Suggested components: `ForestBackground`, `forest/*` characters, `SoccerField`, `GrassStrip`, `FilmOverlay`, `Header`, `MobileMenu`.
- Logo: the "RM" blocks from `main.jpg`, redrawn with ink outlines.

## Testing notes
- Vitest: the mobile menu toggles open and closed, and Esc closes it; decorative SVGs have `aria-hidden`; nav links come from `site.nav`.
- Playwright: each nav link scrolls to its section, on desktop and mobile; an unknown route shows the 404 page; an axe check finds no serious issues on the shell.

## Open questions
- [x] Logo: "RM" text logo, redrawn in cartoon style.
- [x] Theme toggle: none (light only).
