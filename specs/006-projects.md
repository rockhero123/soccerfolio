---
id: "006"
title: "Projects"
status: draft
jira_epic: ""
depends_on: ["001"]
---

# 006 — Projects

## Summary
A grid of selected projects with image, description, tech stack and links.

## Goals
- Prove ability with real work (manifest G2).

## Non-goals
- Individual project detail pages (possible v2).

## User stories

### US-1: Project cards grid
**As a** technical lead, **I want** to browse selected projects, **so that** I can judge the quality of the work.

**Acceptance criteria**
- [ ] AC1 — Section `#projects` has an `<h2>` "Projects" and renders a card for each project in `src/content/projects.ts`.
- [ ] AC2 — Each card shows a thumbnail (`next/image`, lazy-loaded, with alt text), title, a 1–2 sentence description, and tech tags.
- [ ] AC3 — Each card shows "Live demo" and/or "Source code" links only when those URLs exist. They open in a new tab.
- [ ] AC4 — The grid has 1 column on mobile, 2 on tablet and 3 on desktop.
- [ ] AC5 — Cards have a hover or focus effect and are fully keyboard accessible.

**Jira:** —

### US-2: Featured projects first
**As a** visitor, **I want** the best projects shown first, **so that** I see the strongest work immediately.

**Acceptance criteria**
- [ ] AC1 — Projects with `featured: true` are shown first and visually emphasized (e.g. a larger card or a badge).

**Jira:** —

### US-3: Filter by technology
**As a** visitor, **I want** to filter projects by technology, **so that** I can find relevant work.

**Acceptance criteria**
- [ ] AC1 — Filter buttons ("All" plus each tech used by at least 2 projects) appear above the grid.
- [ ] AC2 — Selecting a filter shows only matching projects; "All" resets the filter.
- [ ] AC3 — The active filter is indicated visually and with `aria-pressed`.

**Jira:** —

## Content / data model
```ts
// src/content/projects.ts
export type Project = {
  slug: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};
export const projects: Project[] = [/* TODO */];
```
Images go in `public/images/projects/`.

## Design notes
- `TODO` — see `design/`.

## Testing notes
- Vitest: cards render from a fixture; links are hidden when their URLs are missing; filter logic.
- Playwright: clicking a filter changes the visible cards.

## Open questions
- [ ] Which projects to include, plus screenshots and links.
