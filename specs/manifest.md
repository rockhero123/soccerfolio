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

The design is **detailed pixel art** in the style of cozy farming RPGs, with Stardew Valley as the main mood reference (`design/pixel_art/`). It replaces the first rubber-hose / Cuphead cartoon direction (owner decision, pixel-art redesign).

### Main Design Concept
The main idea is a soccer field surrounded by enchanted forest. All the portfolio body should be inside the soccer field.

### Reference images

| File | What to take from it |
|------|----------------------|
| `pixel_art/*` | **Pixel-art mood**: rich colour ramps, soft top-left lighting, clumpy shaded tree crowns, dark hue outlines (not black), wooden signs and paper menu boxes, cosy flowers and critters |
| `main.jpg`, `design_2.ai.pdf` | Original layout and soccer metaphor: "RM" logo, profile card, skills as **jerseys** in a team lineup, field markings (penalty boxes, center circle), **grass strips** under section titles, projects grid with filters, contact in a dark-grass zone ending with a goal, project detail modal |
| `c1`–`c5` | First (cartoon) direction: enchanted-forest mood only (superseded style) |
| `profile.jpg` | Old flat avatar from the mockup (superseded) |
| `profile_reference.jpeg` | Photo of Ricardo: likeness reference for the pixel portrait (spec 002). Never shipped. |

`pixel_art/*` and `c2`–`c5` are screenshots of copyrighted game art. They are **mood references only**. Never ship them or trace them; all artwork in the site must be original.

### Art direction

- **Medium:** hand-coded **pixel art**, created by the Developer agent: sprites are typed as pixel grids or painted by small seeded generators (shapes, shaded leaf clumps, outlines) in `src/components/pixel/`, at build time, and rendered as crisp inline SVG (`shape-rendering: crispEdges`, one path per colour). Large surfaces (forest, lawn, cliffs) are small tiles repeated as SVG patterns. No raster artwork except photos and project thumbnails.
- **Pixel size:** one art pixel is `--px` CSS pixels: **3px** below 768px, **4px** from 768px (`--px-scale` is the same number without a unit). Sprites are drawn at whole multiples so every pixel stays square.
- **Skill logos:** the skills section (spec 004) shows the official logos of the technologies, copied as SVG path data (e.g. Simple Icons, CC0) and **rasterised to pixels** at build time, in token colours. They are the only non-original artwork, identify the tools, and remain trademarks of their owners.
- **Style:** Stardew-like detail: 4–8 shade colour ramps per material, light from the top left, a 1-pixel outline in the darkest shade of the material (`wood-900`, `leaf-900`, `stone-900`, `ink`), hand-placed highlights and sparkles, checkered dithering where two shades meet. Characters keep big, exaggerated faces (large eyes with a "pie-cut" notch in the pupil, brows, toothy grins).
- **UI surfaces:** Stardew-style pixel frames (`pixel-frame-paper`, `-wood`, `-stone`, `-board`) and pixel buttons (`pixel-button`): notched pixel corners, bevel bands, a crisp drop shadow. No rounded corners.
- **Motion:** illustrations are **static**. No character animation. The one exception is the easter egg's waterfall (spec 900), whose water moves with pixel-stepped CSS animations (`steps()`) and stands still with `prefers-reduced-motion`.
- **Scene light:** a subtle vignette in hard-edged bands covers the whole page (replacing the cartoon film grain). It never blocks clicks (`pointer-events: none`) and is removed when the user has `prefers-reduced-motion` set.
- **Composition:** the enchanted forest is the page background. A soccer field sits in the middle of it and contains all the content sections. On mobile the forest shrinks to a decorative frame around the field.

### Design tokens

| Token | Value | Use |
|-------|-------|-----|
| `pitch` | `#00B262` | Field grass (`grass-500`), section highlights |
| `pitch-dark` | `#00522D` | Dark grass (`grass-800`), jerseys, contact zone, pressed filter |
| `mint` | `#A8F0D8` | Mirror glass |
| `chalk` | `#FFFBEF` | Text on dark green, chalk lines (`paper-100`) |
| `parchment` | `#F3E7C9` | Paper surfaces (`paper-200`) |
| `ink` | `#1E1A16` | Main text, outlines of icons and faces |
| `forest-deep` | `#2F3B2A` | Base dark forest tone |
| `moss` | `#A9BF5A` | Base moss tone |
| `bark` | `#7A5236` | Wood (`wood-600`) |
| `cartoon-red` | `#C8312B` | Accent (`red-600`): active link, focus ring, mushroom caps |
| `cartoon-yellow` | `#E8B630` | Accent (`gold-600`): shirt, gold ornaments |
| Colour ramps | `grass`, `leaf`, `wood`, `stone`, `water`, `paper`, `red`, `gold`, `pink`, `violet`, `skin`, `hair` | Pixel-art shading, 4–8 shades each (`--color-wood-300`, …), defined in `globals.css` |
| `--px` / `--px-scale` | 3px / 4px from 768px | Size of one art pixel |
| Heading font | **Jersey 10** (Google Fonts, via `next/font`) | Chunky pixel headings, like jersey lettering |
| Body font | **Pixelify Sans** (Google Fonts, via `next/font`) | Readable pixel body text |
| Theme | Light only | |

Defined once as Tailwind theme tokens in `src/app/globals.css`. Components must use the tokens, never raw hex values.

### Text color rules (WCAG AA)

| Background | Allowed text | Contrast |
|------------|--------------|----------|
| `pitch-dark`, `forest-deep`, `bark` | `chalk` or `parchment` | ≥ 5.5:1 |
| `pitch`, `mint`, `moss`, `parchment`, `chalk`, `cartoon-yellow`, `paper-*`, `wood-300`/`wood-400` (light wood), `stone-200`, `gold-400`/`gold-500`, `red-400` | `ink` | ≥ 4.5:1 |

- **Never put `chalk` (white) text on `pitch` (bright green).** It is only about 2.7:1 and fails WCAG AA.
- Signs are **light wood with `ink` text** (burned-in lettering), like the reference signs.
- **Text on the field always sits on a surface** (a title banner, card, button or wooden sign), never directly on the grass. Every pair above stays ≥ 4.5:1 under the vignette's darkest band.

## 7. Spec index

Each spec becomes a **Jira Epic**. Each user story (`US-x`) inside a spec becomes a **Jira Story**.

| ID | Spec | Status | Jira Epic |
|----|------|--------|-----------|
| 001 | [Foundation: layout, theme and navigation](./001-foundation-layout.md) | approved | [SOC-1](https://soccerfolio.atlassian.net/browse/SOC-1) |
| 002 | [Hero](./002-hero.md) | approved | [SOC-10](https://soccerfolio.atlassian.net/browse/SOC-10) |
| 004 | [Skills](./004-skills.md) | approved | [SOC-14](https://soccerfolio.atlassian.net/browse/SOC-14) |
| 006 | [Projects](./006-projects.md) | approved | [SOC-17](https://soccerfolio.atlassian.net/browse/SOC-17) |
| 007 | [Contact and footer](./007-contact.md) | approved | [SOC-24](https://soccerfolio.atlassian.net/browse/SOC-24) |
| 008 | [SEO, performance and accessibility](./008-seo-performance.md) | draft | — |
| 900 | [Easter egg](./900-easter-egg.md) | approved | [SOC-21](https://soccerfolio.atlassian.net/browse/SOC-21) |

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
