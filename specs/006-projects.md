---
id: "006"
title: "Projects"
status: approved
jira_epic: ""
depends_on: ["001"]
---

# 006 — Projects

## Summary
A grid of selected projects on the field: each card shows a preview image, title, short description, tech stack and links, and opens a detail modal with the full story and portrait images. Category filters narrow the grid.

## Goals
- Prove ability with real work (manifest G2).

## Non-goals
- Individual project detail pages (possible v2).
- A CMS or remote data: projects live in `src/content/projects.ts`.

## User stories

### US-1: Project cards grid
**As a** technical lead, **I want** to browse Ricardo's selected projects as a grid of cards, **so that** I can quickly see what he has built.

**Context**
The eight projects come from Ricardo's previous portfolio (ricardomartinez10.github.io), with their texts cleaned up. Preview images are the thumbnails in `design/`:

| Preview | Project | Category |
|---|---|---|
| `p10.png` | Jogo | Web |
| `p3.png` | Lime Delivery | Mobile app |
| `p1.png` | Sensturo | Interactive installation |
| `p12.png` | Ingaser | Web |
| `p2.png` | Borondo | Mobile app |
| `p9.png` | Move On | Interactive installation |
| `p4.png` | Hockey Town | Java game |
| `p7.png` | Wild Friends | Java game |

**Acceptance criteria**
- [ ] AC1 — Section `#projects` renders a card for each project in `src/content/projects.ts`, in the order above, below its "Projects" title banner.
- [ ] AC2 — Each card shows the preview image (`next/image`, lazy-loaded, descriptive alt text), the title, a 1–2 sentence description, the tech stack as tags, and links to the live site and the repository when those URLs exist (no empty links).
- [ ] AC3 — Cards are drawn in the site's cartoon style (ink outline, rounded corners, an allowed text/surface pair from manifest §6) and each has tall grass (`GrassStrip`) along its bottom edge, like the section title banners.
- [ ] AC4 — The whole card opens the project's detail modal (US-2) by mouse, touch and keyboard (Enter/Space on a focusable "view details" control) without nesting interactive elements; the live/repo links still work on their own.
- [ ] AC5 — The grid is responsive: 1 column at 375px, 2 at 768px, 3 from 1280px, with no horizontal scroll.

**Jira:** —

### US-2: Project detail modal
**As a** recruiter, **I want** a detail view for each project, **so that** I can read the full story and see more images without leaving the page.

**Context**
Portrait images live in `design/`: `p10_portrait.png` (Jogo), `p3_portrait.jpg` (Lime Delivery), `p12_portrait.png` (Ingaser), `p2_portrait.png` (Borondo) and `p7_portrait2.png`, `p7_portrait3.png`, `p7_portrait4.png` (Wild Friends). Sensturo, Move On and Hockey Town have no portraits and show their preview image instead.

**Acceptance criteria**
- [ ] AC1 — The modal shows the project's title, full description, date, client, category, tech stack, live URL and repository URL (each link only when it exists) and its portrait images (`next/image`, descriptive alt text); projects without portraits show their preview image.
- [ ] AC2 — The modal content scrolls inside the modal when it is taller than the screen; the page behind does not scroll while it is open.
- [ ] AC3 — An "X" button in the corner (accessible name "Close") closes it, and so does the Escape key; clicking the backdrop closes it too.
- [ ] AC4 — It is an accessible dialog: `role="dialog"`, `aria-modal="true"`, labelled by the project title; focus moves into it on open, stays inside while open, and returns to the card that opened it on close.
- [ ] AC5 — The modal matches the site's cartoon style (ink outline, rounded panel, allowed text/surface pairs from manifest §6) and works at 375px, 768px and 1280px.

**Jira:** —

### US-3: Project category filters
**As a** visitor, **I want** to filter the projects by category, **so that** I only see the kind of work I care about.

**Acceptance criteria**
- [ ] AC1 — Filter buttons above the grid: "All", then each category used by the projects (Web, Mobile app, Interactive installation, Java game), taken from `src/content/projects.ts`.
- [ ] AC2 — Choosing a filter shows only that category's cards; "All" (the default) shows every project.
- [ ] AC3 — The active filter is indicated visually and with `aria-pressed="true"`; the others have `aria-pressed="false"`.
- [ ] AC4 — The number of visible projects is announced to screen readers when the filter changes (a polite live region, e.g. "3 projects").
- [ ] AC5 — The filters are keyboard accessible, wrap on small screens with no horizontal scroll, and meet WCAG AA contrast in both states.

**Jira:** —

## Content / data model
```ts
// src/content/projects.ts
export type ProjectCategory =
  | "Web"
  | "Mobile app"
  | "Interactive installation"
  | "Java game";

export type ProjectImage = { src: string; alt: string };

export type Project = {
  slug: string;
  title: string;
  /** 1–2 sentences, shown on the card. */
  summary: string;
  /** Full text, shown in the modal. */
  description: string;
  category: ProjectCategory;
  date: string; // e.g. "July 2018"
  client: string;
  tech: string[];
  image: ProjectImage; // card preview
  portraits: ProjectImage[]; // modal images; empty → the preview is shown
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [/* the eight projects above */];
```
Images are copied from `design/` to `public/images/projects/` and served with `next/image`.

## Design notes
- Matches the design guidelines in `manifest.md` §6 (cartoon style, ink outlines, token palette, text on surfaces).
- Cards and modal reuse existing pieces where they fit: `GrassStrip`, the wooden/silver sign looks, the `mint` card surface.
- Source content: the project modals of ricardomartinez10.github.io (titles, descriptions, dates, clients, tech, live links for Jogo and Ingaser), typos fixed.

## Testing notes
- Vitest: cards render from `projects.ts`; links are hidden when their URLs are missing; the modal shows every field and falls back to the preview image; Escape and the X close it; filter logic returns the right projects and sets `aria-pressed`.
- Playwright: clicking a card opens its modal and focus returns on close; Escape closes it; the modal scrolls; clicking a filter changes the visible cards and announces the count; the grid has 1/2/3 columns at 375/768/1280px; an axe check (modal open and closed) finds no serious issues.

## Open questions
- [x] Which projects to include: the eight above, from the previous portfolio (owner).
- [x] Filters: yes, by category (owner decision).
- [x] Projects without portraits show their preview image (owner decision).
- [x] Texts: reuse the old site's content, cleaned up (owner decision).
- [ ] Repository URLs: none known yet; repo links stay hidden until the owner adds them.
