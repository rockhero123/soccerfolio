---
id: "001"
title: "Foundation: layout, theme and navigation"
status: approved
jira_epic: "SOC-1"
depends_on: []
---

# 001 — Foundation: layout, theme and navigation

## Summary
The base every section depends on: the main design concept (an enchanted forest with a soccer field inside), design tokens, fonts, the page shell, the header navigation, and the 404 page.

## Main design concept
The design is detailed pixel art in the style of cozy farming RPGs, with Stardew Valley as the mood reference (see `design/pixel_art/` and manifest §6). It replaces the first rubber-hose / Cuphead cartoon direction (owner decision, pixel-art redesign).

The main idea is a **soccer field surrounded by an enchanted forest**. All of the portfolio body is inside the soccer field.

The forest has fantastic pixel-art characters with exaggerated expressions: plants, mushrooms, trees with faces, flowers with eyes, birds with big eyes, an owl, etc.

## Goals
- One source of design tokens (colors and colour ramps, fonts, pixel size).
- An immersive pixel-art world: forest background, characters, and the field as the content container.
- A sticky header with anchor navigation that works on mobile and desktop.
- Remove the default Next.js starter page.

## Non-goals
- Section content (covered by specs 002–007).
- Character animation (illustrations are static; see manifest §6).

## User stories

### US-1: Design tokens and fonts
**As a** developer, **I want** the theme defined once as tokens, **so that** every section looks consistent.

**Acceptance criteria**
- [ ] AC1 — All colors, colour ramps and the pixel size (`--px`, `--px-scale`) from manifest §6 are defined as Tailwind v4 theme tokens / variables in `globals.css` (e.g. `bg-pitch`, `text-ink`, `bg-wood-300`).
- [ ] AC2 — Jersey 10 (headings) and Pixelify Sans (body) load with `next/font/google` and are exposed as `font-heading` and `font-body`, with no layout shift.
- [ ] AC3 — The default create-next-app styles, starter page content and unused `public/` SVGs are removed.

**Jira:** [SOC-2](https://soccerfolio.atlassian.net/browse/SOC-2)

### US-2: Enchanted forest background
**As a** visitor, **I want** the page to sit inside an enchanted pixel-art forest, **so that** the portfolio feels unique and memorable.

**Acceptance criteria**
- [ ] AC1 — A `ForestBackground` component renders an original, detailed pixel-art forest: at least 3 depth layers (dark understory and shade, rows of shaded oaks and pines, bushes, flowers and mossy rocks in front) on a textured forest floor, with 1-pixel dark-hue outlines and the `leaf`, `wood` and `stone` ramps.
- [ ] AC2 — The forest fills the full page height behind the content and frames the field on the left and right on desktop (≥ 1024px). Below 1024px it shrinks to a narrow decorative border, with a top and bottom band.
- [ ] AC3 — The forest is decorative: it has `aria-hidden="true"` and cannot receive focus.
- [ ] AC4 — The forest is built from seeded pixel tiles rendered as inline SVG patterns, with no raster images. Its total weight is ≤ 150 KB (gzipped).

**Jira:** [SOC-3](https://soccerfolio.atlassian.net/browse/SOC-3)

### US-3: Soccer field container
**As a** visitor, **I want** all the portfolio content to be on a soccer field, **so that** the soccer theme ties the whole site together.

**Acceptance criteria**
- [ ] AC1 — A `SoccerField` component wraps all the content sections and renders pixel-art chalk markings, two art pixels wide, in `parchment`/`chalk` with a crisp dark-grass drop shadow: outer boundary, corner arcs, a penalty box and goal area at the top, a halfway line with a center circle and spot, and a penalty box and goal (posts and net) at the bottom (as in `design/main.jpg`).
- [ ] AC2 — The field grows with its content: markings stay in proportion and the field never clips sections, at 375px, 768px and 1280px+.
- [ ] AC3 — The grass is a pixel lawn around `pitch`, with two-tone mowing stripes and speckled blades, and the contact area at the bottom uses a `pitch-dark` lawn (see `main.jpg`).
- [ ] AC4 — A reusable `GrassStrip` pixel component (tufts of 1-pixel blades, based on the grass in `design_2.ai.pdf`) exists for section title banners.
- [ ] AC5 — Field markings are decorative (`aria-hidden="true"`), and text on the field meets WCAG AA contrast.

**Jira:** [SOC-4](https://soccerfolio.atlassian.net/browse/SOC-4)

### US-4: Forest characters
**As a** curious visitor, **I want** to discover fantastic cartoon characters in the forest, **so that** the site feels alive and fun.

**Acceptance criteria**
- [ ] AC1 — At least 15 original static pixel-art characters, each with an exaggerated face (big eyes with a pie-cut notch in the pupil, brows, grins): a tree with a face, a mushroom, a flower with eyes, a big-eyed bird, an owl, and a plant.
- [ ] AC2 — Characters are placed in the forest around the field, are visible at desktop widths, and never overlap the field content.
- [ ] AC3 — On mobile, at least 10 characters remain visible in the top and bottom forest bands.
- [ ] AC4 — Each character is its own component in `src/components/forest/`, so it can be reused or replaced.
- [ ] AC5 — Characters are decorative (`aria-hidden="true"`).

**Jira:** [SOC-5](https://soccerfolio.atlassian.net/browse/SOC-5)

### US-5: Scene light
**As a** visitor, **I want** a subtle game-scene light, **so that** the site feels like a pixel-art game.

**Acceptance criteria**
- [ ] AC1 — A fixed full-screen overlay adds a subtle vignette in hard-edged bands (it replaces the cartoon film grain of the first design).
- [ ] AC2 — The overlay has `pointer-events: none` and does not reduce text contrast below WCAG AA.
- [ ] AC3 — The overlay is not rendered when `prefers-reduced-motion: reduce` is set.
- [ ] AC4 — The overlay causes no visible scroll jank (it is a static CSS gradient, not a JavaScript animation loop).

**Jira:** [SOC-6](https://soccerfolio.atlassian.net/browse/SOC-6)

### US-6: Page shell and sections
**As a** visitor, **I want** a single scrollable page with clear sections, **so that** I can browse everything easily.

Use placeholders for future page sections.

**Acceptance criteria**
- [ ] AC1 — `page.tsx` renders the sections inside `SoccerField` in this order: hero, skills, projects, contact. Each is a placeholder `<section id="…">` with an `<h2>` on a title banner that uses `GrassStrip`.
- [ ] AC2 — `layout.tsx` uses semantic `<header>`, `<main>` and `<footer>`, and sets `lang="en"`.
- [ ] AC3 — Content width inside the field is constrained (max ~1100px) and centered, with responsive padding.

**Jira:** [SOC-7](https://soccerfolio.atlassian.net/browse/SOC-7)

### US-7: Header navigation (wooden sign)
**As a** visitor, **I want** a navigation bar, **so that** I can jump to any section.

**Acceptance criteria**
- [ ] AC1 — The header looks like a pixel-art **wooden sign** (light wood boards, dark wood outline, `ink` lettering, nails) hanging from pixel vines in the forest. It shows the pixel "RM" logo (links to `#hero`) and links to Skills, Projects and Contact.
- [ ] AC2 — The header stays fixed at the top while scrolling. Clicking a link scrolls smoothly, and the section heading is not hidden under the header.
- [ ] AC3 — Below 768px, the links collapse into a hamburger menu that opens and closes with mouse, touch and keyboard (Esc closes it). The menu closes after a link is chosen.
- [ ] AC4 — The link for the section currently in view is highlighted (a `cartoon-red` pixel underline).
- [ ] AC5 — Smooth scrolling is disabled when the user has `prefers-reduced-motion` set.

**Jira:** [SOC-8](https://soccerfolio.atlassian.net/browse/SOC-8)

### US-8: 404 page
**As a** visitor who followed a broken link, **I want** a friendly 404 page, **so that** I can get back home.

**Acceptance criteria**
- [ ] AC1 — Unknown routes show a themed `not-found.tsx` page, e.g. "Out of bounds!" with a forest character and a link back to `/`.

**Jira:** [SOC-9](https://soccerfolio.atlassian.net/browse/SOC-9)

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
- Logo: the "RM" blocks from `main.jpg`, redrawn as bevelled pixel blocks.
- Field (US-3): the field sits in the forest as a pixel lawn — chalk markings, a notched dark border with two bands of forest shade on its edges, and fallen forest debris (pixel leaves, twigs, clovers, little flowers, pebbles) scattered over it, from the token ramps. Debris is static, decorative and stays clear of the content.

## Testing notes
- Vitest: the mobile menu toggles open and closed, and Esc closes it; decorative SVGs have `aria-hidden`; nav links come from `site.nav`.
- Playwright: each nav link scrolls to its section, on desktop and mobile; an unknown route shows the 404 page; an axe check finds no serious issues on the shell.

## Open questions
- [x] Logo: "RM" text logo, redrawn in cartoon style.
- [x] Theme toggle: none (light only).
