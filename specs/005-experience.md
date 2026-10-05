---
id: "005"
title: "Experience"
status: draft
jira_epic: ""
depends_on: ["001"]
---

# 005 — Experience

## Summary
A timeline of professional experience, newest first.

## Goals
- Show career progression and impact (manifest G3).

## User stories

### US-1: Experience timeline
**As a** recruiter, **I want** a timeline of roles, **so that** I can understand the career path.

**Acceptance criteria**
- [ ] AC1 — Section `#experience` has an `<h2>` "Experience" and lists each job from `src/content/experience.ts`, sorted by start date with the newest first.
- [ ] AC2 — Each entry shows the role, company (linked if a URL is given), location or remote, and dates (e.g. "Mar 2022 — Present").
- [ ] AC3 — Each entry shows 2–4 bullets of achievements and the tech used as small tags.
- [ ] AC4 — On desktop it shows as a vertical timeline; on mobile, as stacked cards.
- [ ] AC5 — Uses semantic list markup (`<ol>`) and `<time datetime="…">`.

**Jira:** —

## Content / data model
```ts
// src/content/experience.ts
export type Job = {
  company: string;
  companyUrl?: string;
  role: string;
  location: string;
  start: string;   // "YYYY-MM"
  end?: string;    // undefined = Present
  highlights: string[];
  tech: string[];
};
export const experience: Job[] = [/* TODO */];
```

## Design notes
- `TODO` — see `design/`.

## Testing notes
- Vitest: sorting (newest first), "Present" when there is no end date, date formatting.

## Open questions
- [ ] Job list (could be extracted from the existing CV).
