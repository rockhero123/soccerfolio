---
id: "004"
title: "Skills"
status: approved
jira_epic: ""
depends_on: ["001"]
---

# 004 — Skills

## Summary
The technologies and tools Ricardo works with, shown as a soccer team: eleven skills line up as players in a 1-4-3-3 formation on a tactics board, each one a jersey with the skill's name and logo.

## Goals
- Let a visitor see the main stack in seconds (manifest G3).
- Tie the skills to the soccer theme: the stack is "the team".

## Non-goals
- Percentage bars or star ratings. They are subjective and not meaningful.
- Skill categories (Languages, Frontend, …). The formation replaces them.
- Animation or drag-and-drop on the board. It is static.

## User stories

### US-1: Skill player jerseys
**As a** visitor, **I want** each skill shown as a player's jersey with its name and logo, **so that** I recognise every technology at a glance.

**Context**
Each skill is a "player": a cartoon soccer jersey (manifest §6: skills as jerseys) with the skill's name in the middle of the chest and its logo below the name. Logos are the official brand marks, copied as inline SVG paths (for example from Simple Icons, CC0) and recoloured to manifest tokens; they identify the tools and are trademarks of their owners.

**Acceptance criteria**
- [ ] AC1 — A `SkillJersey` component renders one skill as a cartoon soccer jersey (inline SVG, bold `ink` outline, `pitch-dark` body per manifest §6), with the skill name centred on the chest and the skill's logo below the name.
- [ ] AC2 — Every skill has its own logo: JavaScript, TypeScript, React, Angular, Node.js, HTML, CSS, SCSS, MongoDB, Kiro Code and Claude Code. Logos are inline SVG components (no raster images, no icon-font or icon-package dependency) in token colours only.
- [ ] AC3 — The name is real text in `chalk` on `pitch-dark` (an allowed pair in manifest §6), stays ≥ 4.5:1 under the film overlay, and long names ("Claude Code", "TypeScript") fit inside the jersey without overflowing.
- [ ] AC4 — The logo is decorative (`aria-hidden="true"`) because the name is already text; the jersey is not focusable and has no interactive behaviour.
- [ ] AC5 — Skills (name, logo key, position) come from the typed data file `src/content/skills.ts`.

**Jira:** —

### US-2: Tactics board with the 1-4-3-3 formation
**As a** recruiter, **I want** the skills laid out as a team formation on a tactics board, **so that** I can scan Ricardo's whole stack in one look.

**Context**
The board is a coach's tactics board placed in the `#skills` section, under its title banner: a framed board with pitch markings, the eleven skill jerseys standing in a 1-4-3-3 formation (goalkeeper at the bottom, forwards at the top).

Lineup:

| Line | Skills (left to right) |
|---|---|
| Forwards (3) | React, Claude Code, Kiro Code |
| Midfielders (3) | JavaScript, TypeScript, Angular |
| Defenders (4) | CSS, SCSS, MongoDB, Node.js |
| Goalkeeper (1) | HTML |

**Acceptance criteria**
- [ ] AC1 — A `TacticsBoard` component renders a framed tactics board (cartoon style: `ink` outline, wooden or metal frame from the existing `WoodPlank`/silver look, `pitch-dark` surface with `parchment` pitch markings: outline, halfway line, centre circle, penalty boxes).
- [ ] AC2 — The eleven skills from `src/content/skills.ts` stand on the board as `SkillJersey` players in a 1-4-3-3 formation, in the lineup above: 1 goalkeeper, 4 defenders, 3 midfielders and 3 forwards, each line evenly spaced and centred.
- [ ] AC3 — The board replaces the skills placeholder card in `#skills`, below the "Skills" title banner.
- [ ] AC4 — The formation stays a recognisable 1-4-3-3 and fits without horizontal scroll at 375px, 768px and 1280px+: all eleven jerseys visible, none overlapping, names readable (≥ 0.75rem on mobile, ≥ 0.875rem from 768px).
- [ ] AC5 — For screen readers the team is a list grouped by line ("Forwards", "Midfielders", "Defenders", "Goalkeeper"), each line listing its skill names; the board artwork is decorative.

**Jira:** —

## Content / data model
```ts
// src/content/skills.ts
export type SkillLine = "goalkeeper" | "defenders" | "midfielders" | "forwards";
export type Skill = {
  name: string; // shown on the jersey
  logo: SkillLogo; // key of the inline SVG logo component
  line: SkillLine;
};
export type SkillLogo =
  | "javascript" | "typescript" | "react" | "angular" | "nodejs" | "html"
  | "css" | "scss" | "mongodb" | "kiro" | "claude-code";

// Order inside each line = left to right on the board.
export const skills: Skill[] = [
  { name: "React", logo: "react", line: "forwards" },
  { name: "Claude Code", logo: "claude-code", line: "forwards" },
  { name: "Kiro Code", logo: "kiro", line: "forwards" },
  { name: "JavaScript", logo: "javascript", line: "midfielders" },
  { name: "TypeScript", logo: "typescript", line: "midfielders" },
  { name: "Angular", logo: "angular", line: "midfielders" },
  { name: "CSS", logo: "css", line: "defenders" },
  { name: "SCSS", logo: "scss", line: "defenders" },
  { name: "MongoDB", logo: "mongodb", line: "defenders" },
  { name: "Node.js", logo: "nodejs", line: "defenders" },
  { name: "HTML", logo: "html", line: "goalkeeper" },
];
```

## Design notes
- Matches the design guidelines in `manifest.md` §6: hand-coded SVG, rubber-hose style, bold ink outlines, token palette. Brand logos are the one exception to "original artwork" (see manifest §6 "Skill logos").
- Jerseys follow the "skills as jerseys in a team lineup" idea from `design/main.jpg`.
- Text sits on surfaces (manifest §6): names are on the jerseys, never directly on the board or grass.
- The board sits on the field inside `#skills`; it reuses existing pieces where they fit (`WoodPlank`, silver tokens, field-marking style from `SoccerField`).

## Testing notes
- Vitest: every skill renders its name and its logo; logos are `aria-hidden`; names are `chalk` on `pitch-dark`; the board shows 1/4/3/3 players per line in the lineup order; the screen-reader list groups skills by line; tokens only, no raster images.
- Playwright: at 375, 768 and 1280px all eleven jerseys are visible, not overlapping, in four rows of 3/3/4/1 from top to bottom, with no horizontal scroll; an axe check finds no serious issues.

## Open questions
- [x] Final list of skills: the eleven above (owner).
- [x] Icons: official logos as inline SVG, recoloured to tokens (owner decision).
- [x] Positions: the lineup above (owner decision).
- [x] Stories: two (jersey component, then tactics board) (owner decision).
