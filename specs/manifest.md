# Soccerfolio — Project Manifest

> Main reference for the project: what we are building, why, and which specs describe it.
> Rules for *how* we build it are in [`constitution.md`](./constitution.md).

## 1. Vision

A fast, clean, accessible personal portfolio that presents **Ricardo Martinez** as a software developer. In under 30 seconds a recruiter or client should know who Ricardo is, what he builds, and how to contact him.

## 2. Audience

| Audience | What they need |
|----------|----------------|
| Recruiters / hiring managers | Role, years of experience, stack, CV download, contact |
| Technical leads | Real projects, code links, technical depth |
| Potential clients | What he can build, proof of results, an easy way to reach him |

## 3. Goals

- G1 — Show identity and value proposition above the fold.
- G2 — Showcase selected projects with links to live demos and code.
- G3 — Show skills and tools at a glance.
- G4 — Make contact take one click (email, LinkedIn, GitHub, CV).
- G5 — Show craftsmanship: Lighthouse ≥ 90, accessible, responsive.
- G6 — Delight curious visitors with a hidden easter egg.

## 4. Non-goals (for v1)

- No blog or CMS.
- No user accounts or authentication.
- No backend database. Content lives in typed files in `src/content/`.
- English only.

## 5. Site map

Single-page site with anchor navigation:

```
/            Home (one page)
 ├─ #hero        Introduction
 ├─ #skills      Skills / tech stack
 ├─ #projects    Selected projects
 └─ #contact     Contact
/404         Not found page
```

## 6. Design guidelines

The images in [`design/`](../design/) are **visual references only**: use them for mood, layout ideas and style. Do not copy them pixel-for-pixel.

The design should be a rubber hose animation style, vintage cartoon style like disney characters from from the 1920s and 1930s or cuphead style. Specially get inspired in Cuphead game art style.(see reference images).

### Main Design Concept
The main idea is a soccer field surrounded by enchanted forest. All the porgfolio body should be inside the soccer field.

### Reference images

| File | What to take from it |
|------|----------------------|
| `main.jpg`, `design_2.ai.pdf` | Original layout and soccer metaphor: "RM" logo, profile card, skills as **jerseys** in a team lineup, field markings (penalty boxes, center circle), **grass strips** under section titles, projects grid with filters, contact in a dark-grass zone ending with a goal, project detail modal |
| `c1`–`c5` | Cuphead-style enchanted forest: watercolor backgrounds, muted greens and browns, mossy ledges, light rays, characters with faces |
| `profile.jpg` | Ricardo's avatar (used in spec 002) |

`c2`–`c5` are screenshots of copyrighted game art. They are **mood references only**. Never ship them or trace them; all artwork in the site must be original.

### Art direction

- **Medium:** hand-coded **SVG** illustrations, created by the Developer agent. No raster artwork except photos and project thumbnails.
- **Style:** 1930s rubber-hose / Cuphead look: thick, slightly uneven ink outlines, "pie-cut" eyes, big round shapes, exaggerated expressions, muted vintage colors.
- **Motion:** illustrations are **static**. No character animation.
- **Vintage film effect:** a subtle film-grain and vignette overlay covers the whole page. It never blocks clicks (`pointer-events: none`) and is removed when the user has `prefers-reduced-motion` set.
- **Composition:** the enchanted forest is the page background. A soccer field sits in the middle of it and contains all the content sections. On mobile the forest shrinks to a decorative frame around the field.

### Design tokens

| Token | Value | Use |
|-------|-------|-----|
| `pitch` | `#00B262` | Field grass, primary buttons, section title banners |
| `pitch-dark` | `#00522D` | Dark grass strips, jerseys, contact zone |
| `mint` | `#A8F0D8` | Cards on the field |
| `chalk` | `#FFFBEF` | Field lines, text on dark green |
| `parchment` | `#F3E7C9` | Vintage paper surfaces, wooden-sign text background |
| `ink` | `#1E1A16` | Outlines and main text |
| `forest-deep` | `#2F3B2A` | Darkest forest layer |
| `moss` | `#A9BF5A` | Moss and light foliage |
| `bark` | `#7A5236` | Tree trunks, wooden sign |
| `cartoon-red` | `#C8312B` | Accent (mushroom caps, highlights) |
| `cartoon-yellow` | `#E8B630` | Accent (flowers, eyes, active nav link) |
| Heading font | **Lilita One** (Google Fonts, via `next/font`) | Bold vintage-cartoon headings |
| Body font | **Source Sans 3** (Google Fonts, via `next/font`) | Body text (same family as the mockup) |
| Theme | Light only | Matches the cartoon look |
| Outline width | `3px` (`4px` for large shapes) | All illustrations and cards |
| Radius | `12px` cards, `9999px` pills | |

Defined once as Tailwind theme tokens in `src/app/globals.css`. Components must use the tokens, never raw hex values.

### Text color rules (WCAG AA)

| Background | Allowed text | Contrast |
|------------|--------------|----------|
| `pitch-dark`, `forest-deep`, `bark` | `chalk` or `parchment` | ≥ 5.5:1 |
| `pitch`, `mint`, `moss`, `parchment`, `chalk`, `cartoon-yellow` | `ink` | ≥ 6:1 |

- **Never put `chalk` (white) text on `pitch` (bright green).** It is only about 2.7:1 and fails WCAG AA.
- Section title banners with white text use `pitch-dark`. Bright `pitch` banners use `ink` text.
- Bright `pitch` remains fine for grass, field areas, borders and decoration.

## 7. Spec index

Each spec becomes a **Jira Epic**. Each user story (`US-x`) inside a spec becomes a **Jira Story**.

| ID | Spec | Status | Jira Epic |
|----|------|--------|-----------|
| 001 | [Foundation: layout, theme and navigation](./001-foundation-layout.md) | approved | [SOC-1](https://soccerfolio.atlassian.net/browse/SOC-1) |
| 002 | [Hero](./002-hero.md) | draft | — |
| 004 | [Skills](./004-skills.md) | draft | — |
| 006 | [Projects](./006-projects.md) | draft | — |
| 007 | [Contact and footer](./007-contact.md) | draft | — |
| 008 | [SEO, performance and accessibility](./008-seo-performance.md) | draft | — |
| 900 | [Easter egg](./900-easter-egg.md) | draft | — |

Statuses: `draft` → `approved` → `in-progress` → `done`. Only `approved` specs go to Jira.
New specs start from [`_template.md`](./_template.md).

## 8. Build order

001 → 002 → 004 → 006 → 007 → 008 → 900

Spec 001 comes first because every other section depends on its layout and theme.

## 9. Open questions

- [x] Color palette and fonts: see §6 (adjust if you prefer others).
- [x] Theme: light only.
- [x] "Soccerfolio": yes, the soccer theme is the core concept.
- [ ] Custom domain name?
