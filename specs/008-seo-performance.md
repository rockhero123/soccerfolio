---
id: "008"
title: "SEO, performance and accessibility"
status: draft
jira_epic: ""
depends_on: ["001", "002", "004", "006", "007"]
---

# 008 — SEO, performance and accessibility

## Summary
Non-functional quality: the site is discoverable, fast and accessible (manifest G5).

## User stories

### US-1: Metadata and social sharing
**As a** person sharing the link, **I want** a nice preview, **so that** the portfolio looks professional on LinkedIn, Slack, etc.

**Acceptance criteria**
- [ ] AC1 — `layout.tsx` exports `metadata` with a title, description, `metadataBase`, Open Graph and Twitter card fields.
- [ ] AC2 — An Open Graph image (1200×630) is generated with `opengraph-image.tsx` or provided as a static file.
- [ ] AC3 — A favicon and Apple touch icon are present.

**Jira:** —

### US-2: Crawlability
**As a** search engine, **I want** a sitemap and robots file, **so that** I can index the site.

**Acceptance criteria**
- [ ] AC1 — `sitemap.ts` and `robots.ts` exist and return valid output.
- [ ] AC2 — JSON-LD `Person` structured data is included on the home page.

**Jira:** —

### US-3: Performance and accessibility audit
**As the** owner, **I want** high quality scores, **so that** the site itself shows my craftsmanship.

**Acceptance criteria**
- [ ] AC1 — Lighthouse (mobile) scores ≥ 90 for Performance, Accessibility, Best Practices and SEO.
- [ ] AC2 — An automated accessibility check (`@axe-core/playwright`) reports no serious or critical violations on the home page.
- [ ] AC3 — The whole page is usable with the keyboard only, with a visible focus ring and a "Skip to content" link.

**Jira:** —

### US-4: Continuous integration
**As the** owner, **I want** checks to run on every PR, **so that** the Reviewer agent and I can trust them.

**Acceptance criteria**
- [ ] AC1 — A GitHub Actions workflow runs lint, typecheck, test, build and test:e2e on every PR to `main`.
- [ ] AC2 — The PR shows the check status; a failing check blocks the merge.

**Jira:** —

## Testing notes
- Playwright + axe for accessibility; Lighthouse checked manually or with Lighthouse CI.

## Open questions
- [ ] Final production domain (needed for `metadataBase` and the sitemap).
- [ ] Should US-4 (CI) move earlier, so every story benefits from it?
