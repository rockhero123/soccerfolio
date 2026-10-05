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
- G3 — Show professional experience and skills at a glance.
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
 ├─ #about       About me
 ├─ #skills      Skills / tech stack
 ├─ #experience  Work experience timeline
 ├─ #projects    Selected projects
 └─ #contact     Contact
/404         Not found page
```

## 6. Design guidelines

The images in [`design/`](../design/) are **visual references only**: use them for mood, layout ideas and style. Do not copy them pixel-for-pixel.

| Token | Value |
|-------|-------|
| Primary color | `TODO` (from reference) |
| Accent color | `TODO` |
| Background / surface | `TODO` |
| Text colors | `TODO` |
| Heading font | `TODO` (via `next/font`) |
| Body font | `TODO` (via `next/font`) |
| Theme | `TODO` light / dark / both |
| Border radius, spacing | `TODO` |

Defined once as Tailwind theme tokens in `src/app/globals.css`. Components must use the tokens, never raw hex values.

## 7. Spec index

Each spec becomes a **Jira Epic**. Each user story (`US-x`) inside a spec becomes a **Jira Story**.

| ID | Spec | Status | Jira Epic |
|----|------|--------|-----------|
| 001 | [Foundation: layout, theme and navigation](./001-foundation-layout.md) | draft | — |
| 002 | [Hero](./002-hero.md) | draft | — |
| 003 | [About](./003-about.md) | draft | — |
| 004 | [Skills](./004-skills.md) | draft | — |
| 005 | [Experience](./005-experience.md) | draft | — |
| 006 | [Projects](./006-projects.md) | draft | — |
| 007 | [Contact and footer](./007-contact.md) | draft | — |
| 008 | [SEO, performance and accessibility](./008-seo-performance.md) | draft | — |
| 900 | [Easter egg](./900-easter-egg.md) | draft | — |

Statuses: `draft` → `approved` → `in-progress` → `done`. Only `approved` specs go to Jira.
New specs start from [`_template.md`](./_template.md).

## 8. Build order

001 → 002 → 003 → 004 → 005 → 006 → 007 → 008 → 900

Spec 001 comes first because every other section depends on its layout and theme.

## 9. Open questions

- [ ] Final color palette and fonts (from the reference images).
- [ ] Light mode, dark mode, or both with a toggle?
- [ ] Does the name "Soccerfolio" mean the site has a soccer theme?
- [ ] Custom domain name?
