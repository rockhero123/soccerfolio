---
id: "002"
title: "Hero"
status: approved
jira_epic: "SOC-10"
depends_on: ["001"]
---

# 002 — Hero

## Summary
The first screen: who Ricardo is and what he does. A hand-drawn cartoon portrait of Ricardo as a vintage soccer player sits in an enchanted mirror with his nickname and role, next to a wooden sign with a short introduction.

## Goals
- Communicate name, role and value proposition in a few seconds (manifest G1).
- Make the first impression memorable and on-theme: a rubber-hose cartoon of Ricardo in a Colombia shirt.

## Non-goals
- Heavy animations or video backgrounds. The portrait and mirror are static.
- Call-to-action buttons and social links. Contact lives in the Contact section (spec 007).
- Raster or AI-generated artwork. The portrait is hand-coded SVG (manifest §6).

## User stories

### US-1: Cartoon profile portrait
**As a** recruiter, **I want** to see a cartoon portrait of Ricardo in the hero, **so that** I get a visual sense of who I'm looking at.

**Context**
Art brief, adapted from the owner's prompt: draw the person in `design/profile_reference.jpeg` as a vintage cartoon soccer player in the classic rubber-hose style (mood: Cuphead, Pizza Tower, Rocko's Modern Life, early Ed, Edd n Eddy; manifest §6). Clearly keep his identity: short dark hair, a moustache and a partial beard along the jaw, dark eyes, strong eyebrows, big ears. He wears the yellow Colombia national-team shirt with a round collar and has a roguish, toothy smirk. A sunburst, speed lines and smoke puffs show he is fast. Style references are mood only; never trace them.

**Acceptance criteria**
- [ ] AC1 — A `CartoonPortrait` component renders an original, hand-coded, static SVG portrait of Ricardo in the rubber-hose style (bold `ink` outlines, pie-cut eyes, manifest palette) that keeps the recognisable features listed in the art brief.
- [ ] AC2 — He wears the yellow Colombia shirt (`cartoon-yellow`, manifest §6).
- [ ] AC3 — The portrait is clipped to a circle, and the top of the head (the hair) breaks out of the circle above its edge.
- [ ] AC4 — The portrait is meaningful, not decorative: it has `role="img"` and an accessible name from `src/content/hero.ts` (e.g. "Cartoon portrait of Ricardo Martinez as a vintage soccer player in a Colombia shirt").
- [ ] AC5 — It uses design tokens only (no raw hex) and contains no raster images.

**Jira:** [SOC-11](https://soccerfolio.atlassian.net/browse/SOC-11)

### US-2: Enchanted mirror profile card
**As a** visitor, **I want** the portrait shown in a magical frame with Ricardo's name and role, **so that** I know immediately who he is and what he does.

**Acceptance criteria**
- [ ] AC1 — The portrait sits inside a rounded rectangle drawn as an **enchanted mirror**: an ornate cartoon frame with an `ink` outline, a glass surface with painted shine, and tall grass (`GrassStrip`) along its bottom edge, like the section title banners.
- [ ] AC2 — Below the portrait, inside the mirror, the nickname "Richi" is shown in bold (`font-heading`), and below it the role "Software Engineer" in regular weight (`font-body`).
- [ ] AC3 — The nickname is the page's only `<h1>`. It shows "Richi", and its accessible name is "Ricardo Martinez (Richi)", so screen readers and search engines get the full name. The visible text stays part of the accessible name (WCAG 2.5.3).
- [ ] AC4 — The role is "Software Engineer" everywhere: `site.role` in `src/content/site.ts` and the page `<title>` use it. Name, nickname and role come from `src/content/hero.ts` / `src/content/site.ts`.
- [ ] AC5 — Text on the mirror meets WCAG AA and uses an allowed text pair from manifest §6. It stays ≥ 4.5:1 under the film overlay.

**Jira:** [SOC-12](https://soccerfolio.atlassian.net/browse/SOC-12)

### US-3: Profile introduction sign
**As a** recruiter, **I want** a short introduction next to the portrait, **so that** I quickly learn Ricardo's background and interests.

**Acceptance criteria**
- [ ] AC1 — An introduction paragraph is shown on a wooden plank in the same style as the section title banners (`WoodPlank`), with the text engraved in the wood (`parchment` on `bark`, manifest §6).
- [ ] AC2 — The text comes from `src/content/hero.ts` (`intro`).
- [ ] AC3 — From 768px the sign sits next to the enchanted mirror. Below 768px it stacks under the mirror. Nothing overflows at 375px, 768px or 1280px+.
- [ ] AC4 — The engraved text is readable: at least 1.125rem, line height ≥ 1.5, and WCAG AA contrast on every part of the plank. It stays ≥ 4.5:1 under the film overlay.

**Jira:** [SOC-13](https://soccerfolio.atlassian.net/browse/SOC-13)

## Content / data model
```ts
// src/content/hero.ts
export const hero = {
  name: "Ricardo Martinez",
  nickname: "Richi",
  // role comes from site.role ("Software Engineer")
  intro: "TODO — final introduction text from the owner",
  portrait: {
    label:
      "Cartoon portrait of Ricardo Martinez as a vintage soccer player in a Colombia shirt",
  },
};
```

## Design notes
- All artwork matches the design guidelines in `manifest.md` §6: hand-coded SVG, rubber-hose style, bold ink outlines and the token palette.
- The hero section keeps its "Introduction" title banner from spec 001 (US-6). The mirror and sign replace the placeholder card.
- The portrait reference photo is `design/profile_reference.jpeg`. Use it for likeness only; it is never shipped.
- Layout: mirror and sign side by side from 768px (mirror first), stacked below 768px.
- The mirror glass is a light surface (for example `mint` or `chalk`), so the name and role use `ink` text.

## Testing notes
- Vitest: the `<h1>` shows "Richi" and has the accessible name "Ricardo Martinez (Richi)"; the role and intro render from the content files; the portrait has `role="img"` and its label; the shirt is `cartoon-yellow`; tokens only.
- Playwright: at 1280px the hair breaks out above the portrait circle; the mirror and sign sit side by side at 1280px and stack at 375px; the page title contains "Software Engineer"; an axe check finds no serious issues.

## Open questions
- [x] Final introduction text (US-3): the first paragraph of the profile in the owner's CV, now in `hero.intro`.
- [x] Profile photo? A hand-coded SVG cartoon portrait instead of a photo (owner decision).
- [x] Name and role: "Richi" shown, "Ricardo Martinez (Richi)" as the `<h1>` name; role "Software Engineer" (owner decision).
- [x] CTA buttons and social links: dropped from the hero (owner decision).
