# Project Constitution — Soccerfolio

These rules apply to every contributor, human or agent. If a spec or ticket conflicts with this file, this file wins. Change it only through a PR that the owner approves.

## 1. Purpose

A personal portfolio website for Ricardo Martinez, software developer. The visual reference lives in `design/`. Content is in **English**.

## 2. Spec-driven workflow

1. **Specs are the source of truth.** Every feature starts as a spec in `specs/`. No code without a spec; no requirement that is not in a spec.
2. **Spec → Jira → Code → Review → Merge.**
   - Spec agent: reads a spec and creates Jira stories with acceptance criteria.
   - Developer agent: implements exactly one Jira story per branch/PR.
   - Reviewer agent: checks the PR against the story, the spec and this constitution.
   - Easter-egg agent: implements the hidden feature defined in its own spec.
3. If a spec is ambiguous or incomplete, **stop and ask** — do not guess. Propose a spec change instead.
4. Each spec has a status: `draft` → `approved` → `in-progress` → `done`. Only `approved` specs may be turned into Jira stories.

## 3. Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router, `src/` dir) |
| Language | TypeScript, `strict` mode |
| Styling | Tailwind CSS v4 |
| Unit/component tests | Vitest + React Testing Library |
| End-to-end tests | Playwright |
| Lint | ESLint (`eslint-config-next`) |
| Package manager | npm |
| Hosting | GitHub Pages (static export, deployed by `.github/workflows/deploy-pages.yml`) |

- Next.js 16 has breaking changes. Read `node_modules/next/dist/docs/` before using an API you are not sure about (see `AGENTS.md`).
- Do not add a new dependency unless the story requires it. Explain any new dependency in the PR description.

## 4. Code standards

- Prefer Server Components. Add `"use client"` only when you need interactivity.
- One component per file, PascalCase file names, in `src/components/`.
- Site content (projects, experience, skills) lives in typed data files in `src/content/`, not hard-coded in JSX.
- No `any`. No unused code. No `console.log` in committed code.
- Accessibility: semantic HTML, alt text on every image, keyboard navigable, color contrast WCAG AA.
- Responsive: mobile-first; must work at 375px, 768px and 1280px+.
- Performance: use `next/image` and `next/font`. Target Lighthouse ≥ 90 in all categories.

## 5. Testing

- Every story includes tests that prove its acceptance criteria.
- Components with logic or interaction: Vitest tests next to the component (`*.test.tsx`).
- Key user flows (navigation, contact, easter egg): Playwright tests in `e2e/`.
- All of these must pass before a PR can be merged: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run build`.

## 6. Git and Jira conventions

- Jira site: `https://soccerfolio.atlassian.net` — project key: `SOC`.
- Branch names: `feature/SOC-<n>-short-title`, or `fix/SOC-<n>-short-title` for bugs.
- Commits: Conventional Commits that include the key, e.g. `feat(SOC-12): add hero section`.
- Do not push directly to `main`. All changes go through a PR.
- PR title: `SOC-<n>: <story title>`. PR body: link to the Jira story, the spec it implements, a checklist of acceptance criteria, and how it was tested.
- One story = one branch = one PR.

## 7. Review and merge

- The Reviewer agent checks: acceptance criteria met, matches the spec and design, follows this constitution, tests present and passing, no secrets or credentials in code.
- The Reviewer either requests changes or approves.
- **Merging requires the owner's explicit OK.** After the owner confirms, the Reviewer squash-merges and deletes the branch.
- After merging, the Jira story moves to **Done**.

## 8. Definition of Done

- [ ] All acceptance criteria met
- [ ] Tests written and passing; lint, typecheck and build all green
- [ ] Responsive and accessible (section 4)
- [ ] PR approved by the Reviewer and merged with the owner's OK
- [ ] Jira story set to Done

## 9. Security

- Never commit secrets. Keep Jira and GitHub tokens in `.env.local` or in the agent's environment; `.env*` is git-ignored.
- The easter egg must not expose private data and must not affect normal site behavior.
- Exception (owner decision, spec 900): the easter egg's music video player loads with the page instead of on a trigger. It must use YouTube's privacy-enhanced embed, give visitors pause/mute controls, respect `prefers-reduced-motion`, and the page must work normally if it fails to load.
