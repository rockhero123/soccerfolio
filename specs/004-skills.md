---
id: "004"
title: "Skills"
status: draft
jira_epic: ""
depends_on: ["001"]
---

# 004 — Skills

## Summary
The technologies and tools Ricardo works with, grouped by category.

## Goals
- Let a visitor see the main stack in seconds (manifest G3).

## Non-goals
- Percentage bars or star ratings. They are subjective and not meaningful.

## User stories

### US-1: Skills grouped by category
**As a** technical lead, **I want** skills grouped by category, **so that** I can quickly match them to my needs.

**Acceptance criteria**
- [ ] AC1 — Section `#skills` has an `<h2>` "Skills" and renders each category (e.g. Languages, Frontend, Backend, Cloud & DevOps, Tools) from `src/content/skills.ts`.
- [ ] AC2 — Each skill shows as a chip or badge with its name and, optionally, an icon.
- [ ] AC3 — Categories use a responsive grid: 1 column on mobile, 2–3 on desktop.
- [ ] AC4 — Adding a skill to the content file shows it on the page without any component change.

**Jira:** —

## Content / data model
```ts
// src/content/skills.ts
export type SkillCategory = { name: string; skills: { name: string; icon?: string }[] };
export const skills: SkillCategory[] = [
  { name: "Languages", skills: [{ name: "TODO" }] },
  { name: "Frontend",  skills: [{ name: "TODO" }] },
  { name: "Backend",   skills: [{ name: "TODO" }] },
  { name: "Cloud & DevOps", skills: [{ name: "TODO" }] },
];
```

## Design notes
- `TODO` — see `design/`.

## Testing notes
- Vitest: renders every category and skill from a fixture.

## Open questions
- [ ] Final list of skills.
- [ ] Use icons (e.g. Simple Icons) or text only?
