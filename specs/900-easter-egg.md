---
id: "900"
title: "Easter egg"
status: approved
jira_epic: "SOC-21"
depends_on: ["001", "002"]
---

# 900 — Easter egg

## Summary
A pixel-art waterfall pours across the top of the soccer field, from the forest edge down to the Introduction section. Hidden behind the falling water, a music video plays — only its music is heard — a fun, surprising detail that shows Ricardo's personality. Every page load opens as a pixel-art theater with its curtain closed and a poster asking "Ready to start the match?"; "Start" starts the music and the curtain rises to reveal the portfolio.

## Goals
- Surprise and delight visitors (manifest G6) with a feature that fits the enchanted-forest concept.

## Non-goals
- A playlist, video picker or any other video than the one below.
- Hiding the content: the waterfall never covers the Introduction section or anything below it. (The theater covers the page only until the visitor begins the match.)

## Constraints
- Must not expose private data: the video uses YouTube's privacy-enhanced embed (`youtube-nocookie.com`).
- Must respect `prefers-reduced-motion`: the water stands still and the video does not start by itself.
- Must stay accessible: anything that plays sound or moves by itself has a visible control to pause it (WCAG 1.4.2 and 2.2.2).
- **Owner decision (constitution §9 exception):** the video player loads with the page instead of lazily on a trigger. Everything else stays lightweight: the waterfall is SVG/CSS, and the player is the only external code.

## User stories

### US-1: Animated cartoon waterfall
**As a** visitor, **I want** a lively pixel-art waterfall at the top of the field, **so that** the page opens with a surprising, magical scene.

**Context**
The waterfall spans the top strip of the field — from the top edge of the field, behind the top goal area, down to just above the "Introduction" title banner — pouring from the forest edge. It is drawn in the site's pixel-art style and palette (manifest §6): a three-tier cascade down a mossy stone cliff, with jungle hanging over the cliff and leaves, sticks and rocks in and around the water.

**Acceptance criteria**
- [ ] AC1 — A `Waterfall` component draws an original pixel-art waterfall (inline SVG sprites and patterns, token colours only) with rocks along its edges and leaves and sticks carried by the water.
- [ ] AC2 — It is placed across the top of the field, from the field's top edge to just above the Introduction title banner, at 375px, 768px and 1280px+, without covering the banner or any section content.
- [ ] AC3 — The water looks like it is moving: falling streaks, sideways ripples, flickering foam and drifting leaves, animated with pixel-stepped CSS (`steps()`, no JavaScript animation loop), with no visible scroll jank.
- [ ] AC4 — With `prefers-reduced-motion: reduce` the water is drawn but does not move.
- [ ] AC5 — The artwork is decorative (`aria-hidden="true"`), never receives focus, and adds no raster images.

**Jira:** [SOC-22](https://soccerfolio.atlassian.net/browse/SOC-22)

### US-2: Music video behind the waterfall
**As a** visitor, **I want** a music video to play behind the waterfall when the page loads, **so that** I discover a fun, personal surprise.

**Context**
Video: https://www.youtube.com/watch?v=Yq2HC4_Zxgo. Browsers block videos with sound from starting on their own until the visitor has interacted with the page, so the video tries sound first and falls back to muted (owner decision). To get the music playing with sound, every page load opens as a **theater with its curtain closed** (owner decision, replacing the earlier "Kick off!" overlay): the video loads behind it without playing, and the "Start" click unlocks sound.

**Acceptance criteria**
- [ ] AC1 — The video (`Yq2HC4_Zxgo`, from `src/content/easterEgg.ts`) is embedded behind the waterfall from `youtube-nocookie.com`, completely hidden (only the music is heard), and loops.
- [ ] AC2 — When the theater is not shown (AC6), on page load it starts playing with sound. If the browser blocks autoplay with sound, it plays muted instead and turns the sound on at the visitor's first click, tap or key press on the page; a "Sound on" button is also shown.
- [ ] AC3 — A visible, keyboard-accessible control always lets the visitor pause/play and mute/unmute the video; each control has an accessible name and reflects its state.
- [ ] AC4 — With `prefers-reduced-motion: reduce` the video does not start by itself; the visitor can start it with the play control.
- [ ] AC5 — The rest of the page works normally while the video loads or if YouTube is unavailable (the waterfall still shows), and the video never covers or blocks the Introduction section or the header navigation.
- [ ] AC6 — The theater is behind a switch (`easterEgg.theater.enabled` in `src/content/easterEgg.ts`), **on** (owner decision); while off, every load follows AC2. When on, on **every page load** (owner decision):
  - A full-screen pixel-art **theater with its curtain closed** covers the page from the first paint (server-rendered, so the portfolio never flashes first). Original art in token colours, after the mood of the references `design/pixel_art/t1`–`t4`, with **balanced colours** (owner decision, like `t4`): a **red** velvet curtain (dark creases, mostly deep reds, a thin sheen) under a swagged valance with gold fringe and a match crest; a **brown** wooden stage floor with seams running back towards the curtain and a striped wooden skirt; and the audience's seats in **dark blue-gray**.
  - Meanwhile the music video loads behind it but does **not** play.
  - **Stage light** (owner decision): a soft, blurred circular shadow darkens the corners of the theater, and a warm pool of light brightens the lower curtain and the wooden floor. It is a smooth overlay (not pixel-stepped) that never blocks clicks and fades as the curtain rises.
  - On the curtain, a paper **poster** hanging from two gold cords reads **"Ready to start the match?"**; below it, a pixel button **"Start"**.
  - It is a keyboard-accessible modal dialog named by the poster, with focus on "Start"; the page behind does not scroll.
  - Pressing "Start" starts the music with sound right away and the curtain **rises smoothly** (a fluid eased transition, about 1.8 s, not pixel-stepped) off the top of the screen, while the stage and seats sink and the dark hall fades, revealing the portfolio; then the theater is removed and scrolling returns.
  - Escape enters without music (the curtain rises the same way).
  - With `prefers-reduced-motion: reduce` the curtain is removed at once, without the lift.
  - Nothing is remembered: reloading the page shows the closed curtain again.

**Jira:** [SOC-23](https://soccerfolio.atlassian.net/browse/SOC-23)

## Content / data model
```ts
// src/content/easterEgg.ts
export const easterEgg = {
  video: {
    id: "Yq2HC4_Zxgo",
    title: "Music video behind the waterfall",
  },
  /** The theater with its curtain closed before the page (US-2 AC6). */
  theater: { enabled: true },
};
```

## Design notes
- Matches the design guidelines in `manifest.md` §6: hand-coded pixel art, token ramps. The waterfall is the one animated illustration (manifest §6 "Motion" exception); it stands still with reduced motion.
- Water: the `water` ramp with `chalk` foam; cliffs and rocks from the `stone` ramp with moss; leaves and sticks as small pixel sprites.
- The pause/mute controls follow the site's pixel-button style (as the project filters) and sit at the top corner of the waterfall.
- The waterfall art is rendered on the server and passed to the client player as `scene`, so the pixel art is not bundled for the browser. The theater art is passed the same way, as `theater.drapes` (`TheaterDrapes`: curtain, spotlight, hem, valance, crest) and `theater.stalls` (`TheaterStalls`: stage and seats); `TheaterCurtain` is the client dialog that holds them and runs the lift.
- Theater (`theaterArt.ts`): curtain, hem, valance, stage lip and seats are small repeating tiles, so the scene fits any screen; the stage floor is one 480-art-pixel-wide perspective sprite, centred, with `wood-500` continuing past its edges. Colours: velvet `ink` / `red-800`–`red-600` with a thin `red-500` sheen and a checkered dither; fringe, rail and crest in the `gold` ramp; floor and skirt in the `wood` ramp; seats `water-900` with `water-700`/`water-800` rims on `stone-900`. Side shadows on the curtain are hard-edged bands. Over the whole theater, `STAGE_LIGHT` (in `TheaterCurtain.tsx`) adds two smooth radial gradients: a shadow ellipse centred a little below the middle (clear to 30%, then `ink` 40% → 72% → 88% at the edges) and a `gold-400` glow at 50% / 66% blended with `mix-blend-mode: screen`.
- Layout: the curtain fills the space above the stalls (floor up to 40 art pixels but at most 17vh, lip 9, seats up to 60 but at most 21vh), so short screens keep room for the poster and button. The poster is a `pixel-frame-paper` box with the heading in `ink` (`font-heading`, uppercase); the "Start" button is a `gold-500` pixel button with `ink` text and a pixel soccer ball.
- Tests skip the theater by setting the `sessionStorage` key `soccerfolio-skip-theater` (`theaterSkip.ts`); a small inline script in `<head>` then marks `html[data-skip-theater]` so CSS hides it before paint. Visitors never set it.
- The lift is the one smooth (non-stepped) animation on the site (owner decision: "a fluid animation"): `translate` with `cubic-bezier(0.7, 0, 0.3, 1)` over 1.8 s.

## Testing notes
- Vitest: the waterfall is `aria-hidden` and token-only with rocks, leaves and sticks; the embed URL uses `youtube-nocookie.com` with the video id from `easterEgg.ts`; the controls have accessible names and states; reduced motion disables autoplay.
- Vitest (`TheaterCurtain.test.tsx`, `MusicWaterfall.test.tsx`): the theater is an open dialog named by its poster ("Ready to start the match?", a paper poster above the "Start" button), with focus on "Start" and scrolling locked; "Start" calls `onBegin` at once and the curtain lifts for `LIFT_MS` before `onDone`; Escape skips; only the first choice counts; reduced motion removes it at once; the curtain is dark velvet with a thin sheen, the stalls are brown wood and blue-gray seats with no red, tokens only; the player shows the theater on every load, keeps it while the curtain rises, stores nothing, and is skipped by the test key.
- Playwright: the waterfall sits between the field's top edge and the Introduction banner at 375/768/1280px without covering it; the water animates (and is still with reduced motion); the pause/mute controls work from the keyboard; the page works with YouTube blocked; an axe check finds no serious issues.
- Playwright (`e2e/theater.spec.ts`, with YouTube blocked): at 375/768/1280px the closed curtain covers the whole viewport, the poster sits above the "Start" button and the button above the stage; it is a modal named by the poster with focus on "Start" and the page does not scroll; clicking lifts the curtain (higher mid-way, then removed) and reveals the page; Escape enters too; every reload shows the curtain again; reduced motion removes it at once; axe finds no serious issues. All other e2e specs import `e2e/fixtures.ts`, which sets the skip key so the theater stays out of the way.

## Open questions
- [x] Trigger: plays on page load, with sound when the browser allows it (owner decision).
- [x] Placement: across the top of the field, down to the Introduction section (owner decision).
- [x] Stories: two (waterfall, then video) (owner decision).
- [x] Kick off overlay: once per session, with an "Enter without music" choice (owner decision) — built but switched off for now (owner decision).
- [x] Replaced by the theater: a closed curtain before the page, the video loading but not playing, a button that starts the music and lifts the curtain with a fluid animation (owner decision). Escape enters without music.
- [x] Theater revision (owner decisions): balanced colours like `t4` (red curtain, brown floor, blue-gray audience); shown on every page load, not once per session; a "Ready to start the match?" poster above a "Start" button; a blurred circular shadow darkening the corners with more light on the floor and curtain.
