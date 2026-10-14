---
id: "900"
title: "Easter egg"
status: approved
jira_epic: "SOC-21"
depends_on: ["001", "002"]
---

# 900 — Easter egg

## Summary
A cartoon waterfall pours across the top of the soccer field, from the forest edge down to the Introduction section. Hidden behind the falling water, a music video plays as soon as the page loads — only its music is heard — a fun, surprising detail that shows Ricardo's personality.

## Goals
- Surprise and delight visitors (manifest G6) with a feature that fits the enchanted-forest concept.

## Non-goals
- A playlist, video picker or any other video than the one below.
- Hiding the content: the waterfall never covers the Introduction section or anything below it.

## Constraints
- Must not expose private data: the video uses YouTube's privacy-enhanced embed (`youtube-nocookie.com`).
- Must respect `prefers-reduced-motion`: the water stands still and the video does not start by itself.
- Must stay accessible: anything that plays sound or moves by itself has a visible control to pause it (WCAG 1.4.2 and 2.2.2).
- **Owner decision (constitution §9 exception):** the video player loads with the page instead of lazily on a trigger. Everything else stays lightweight: the waterfall is SVG/CSS, and the player is the only external code.

## User stories

### US-1: Animated cartoon waterfall
**As a** visitor, **I want** a lively cartoon waterfall at the top of the field, **so that** the page opens with a surprising, magical scene.

**Context**
The waterfall spans the top strip of the field — from the top edge of the field, behind the top goal area, down to just above the "Introduction" title banner — pouring from the forest edge. It is drawn in the site's rubber-hose style and palette (manifest §6), with leaves, sticks and rocks in and around the water.

**Acceptance criteria**
- [ ] AC1 — A `Waterfall` component draws an original cartoon waterfall (inline SVG and CSS, bold `ink` outlines, token colours only) with rocks along its edges and leaves and sticks carried by the water.
- [ ] AC2 — It is placed across the top of the field, from the field's top edge to just above the Introduction title banner, at 375px, 768px and 1280px+, without covering the banner or any section content.
- [ ] AC3 — The water looks like it is moving: falling streaks, waves, foam at the bottom and currents, animated with CSS (no JavaScript animation loop), with no visible scroll jank.
- [ ] AC4 — With `prefers-reduced-motion: reduce` the water is drawn but does not move.
- [ ] AC5 — The artwork is decorative (`aria-hidden="true"`), never receives focus, and adds no raster images.

**Jira:** [SOC-22](https://soccerfolio.atlassian.net/browse/SOC-22)

### US-2: Music video behind the waterfall
**As a** visitor, **I want** a music video to play behind the waterfall when the page loads, **so that** I discover a fun, personal surprise.

**Context**
Video: https://www.youtube.com/watch?v=Yq2HC4_Zxgo. Browsers block videos with sound from starting on their own until the visitor has interacted with the page, so the video tries sound first and falls back to muted (owner decision).

**Acceptance criteria**
- [ ] AC1 — The video (`Yq2HC4_Zxgo`, from `src/content/easterEgg.ts`) is embedded behind the waterfall from `youtube-nocookie.com`, completely hidden behind the water (only the music is heard), and loops.
- [ ] AC2 — On page load it starts playing with sound. If the browser blocks autoplay with sound, it plays muted instead and turns the sound on at the visitor's first click, tap or key press on the page; a "Sound on" button is also shown.
- [ ] AC3 — A visible, keyboard-accessible control always lets the visitor pause/play and mute/unmute the video; each control has an accessible name and reflects its state.
- [ ] AC4 — With `prefers-reduced-motion: reduce` the video does not start by itself; the visitor can start it with the play control.
- [ ] AC5 — The rest of the page works normally while the video loads or if YouTube is unavailable (the waterfall still shows), and the video never covers or blocks the Introduction section or the header navigation.

**Jira:** [SOC-23](https://soccerfolio.atlassian.net/browse/SOC-23)

## Content / data model
```ts
// src/content/easterEgg.ts
export const easterEgg = {
  video: {
    id: "Yq2HC4_Zxgo",
    title: "Music video behind the waterfall",
  },
};
```

## Design notes
- Matches the design guidelines in `manifest.md` §6: hand-coded SVG, rubber-hose style, ink outlines, token palette. The waterfall is the one animated illustration (manifest §6 "Motion" exception); it stands still with reduced motion.
- Water: translucent light blues/whites mixed from the tokens (e.g. `chalk`, `mint`), so the video shows through; foam in `chalk`, rocks in `forest-deep`/`bark`, leaves and sticks reuse the field-debris pieces.
- The pause/mute controls follow the site's pill-button style (as the project filters) and sit at the bottom corner of the waterfall.

## Testing notes
- Vitest: the waterfall is `aria-hidden` and token-only with rocks, leaves and sticks; the embed URL uses `youtube-nocookie.com` with the video id from `easterEgg.ts`; the controls have accessible names and states; reduced motion disables autoplay.
- Playwright: the waterfall sits between the field's top edge and the Introduction banner at 375/768/1280px without covering it; the water animates (and is still with reduced motion); the pause/mute controls work from the keyboard; the page works with YouTube blocked; an axe check finds no serious issues.

## Open questions
- [x] Trigger: plays on page load, with sound when the browser allows it (owner decision).
- [x] Placement: across the top of the field, down to the Introduction section (owner decision).
- [x] Stories: two (waterfall, then video) (owner decision).
