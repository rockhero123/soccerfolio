---
id: "003"
title: "About"
status: draft
jira_epic: ""
depends_on: ["001"]
---

# 003 — About

## Summary
A short personal and professional story with a few key facts.

## Goals
- Give context beyond the CV: background, approach and interests.

## User stories

### US-1: About me text
**As a** hiring manager, **I want** to read a short bio, **so that** I understand Ricardo's background and how he works.

**Acceptance criteria**
- [ ] AC1 — Section `#about` has an `<h2>` "About me" and 2–4 paragraphs of bio from `src/content/about.ts`.
- [ ] AC2 — Text width is limited for readability (about 65–75 characters per line).

**Jira:** —

### US-2: Key facts
**As a** recruiter, **I want** key facts at a glance, **so that** I can scan quickly.

**Acceptance criteria**
- [ ] AC1 — Shows 3–4 highlight items (e.g. "X+ years of experience", "Y projects delivered", location, availability), from content.
- [ ] AC2 — Highlights show in a row on desktop and a 2-column grid on mobile.

**Jira:** —

### US-3: Download CV
**As a** recruiter, **I want** to download a CV, **so that** I can share it internally.

**Acceptance criteria**
- [ ] AC1 — A "Download CV" button links to `/cv/ricardo-martinez-cv.pdf` with the `download` attribute.
- [ ] AC2 — The PDF exists in `public/cv/`, and a Playwright test confirms the link returns 200.

**Jira:** —

## Content / data model
```ts
// src/content/about.ts
export const about = {
  paragraphs: ["TODO", "TODO"],
  highlights: [
    { value: "TODO", label: "Years of experience" },
    { value: "TODO", label: "Projects delivered" },
    { value: "TODO", label: "Based in" },
  ],
  cvUrl: "/cv/ricardo-martinez-cv.pdf",
};
```

## Design notes
- `TODO` — see `design/`.

## Testing notes
- Vitest: renders all paragraphs and highlights from content.
- Playwright: the CV link returns 200.

## Open questions
- [ ] Bio text, highlights, and the final CV PDF.
