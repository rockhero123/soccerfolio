# Soccerfolio

The personal portfolio of **Ricardo Martinez**, software developer, presented as a soccer match.

**Live site:** https://rockhero123.github.io/soccerfolio/

All content sits on a soccer field in the middle of an enchanted forest, drawn in a 1930s rubber-hose cartoon style. Skills are jerseys in a team lineup, projects are on a filterable grid, and the contact zone ends at the goal.

## Features

- **Hero:** a hand-drawn SVG cartoon portrait in an enchanted mirror, with a wooden intro sign.
- **Skills:** a tactics board with technology jerseys in a team lineup.
- **Projects:** a project grid with category filters and a detail modal.
- **Enchanted forest:** original SVG background, forest characters, field markings and a vintage film-grain overlay.
- **Accessible and responsive:** semantic HTML, keyboard navigation, WCAG AA contrast, `prefers-reduced-motion` support, and layouts for 375px, 768px and 1280px+.

All artwork is original, hand-coded SVG. The only exceptions are the official technology logos in the skills section.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, `src/` dir) |
| Language | TypeScript (`strict`) |
| Styling | Tailwind CSS v4 |
| Unit and component tests | Vitest + React Testing Library |
| End-to-end tests | Playwright + axe-core |
| Lint | ESLint (`eslint-config-next`) |
| Hosting | GitHub Pages (static export, deployed by `.github/workflows/deploy-pages.yml`) |

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm test` | Run unit and component tests (Vitest) |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run check` | Lint, type-check, unit tests and build in one go |

Before the first end-to-end run, install the Playwright browsers with `npx playwright install`.

## Deployment

Every push to `main` deploys the site to GitHub Pages through [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).

The workflow builds a static export served from `/soccerfolio/`. It sets `GITHUB_PAGES=true`, which turns on `output: "export"`, the base path and unoptimized images in `next.config.ts`. Local development and tests keep the default config.

To preview the Pages build locally:

```bash
GITHUB_PAGES=true PAGES_BASE_PATH=/soccerfolio npm run build
```

The files land in `out/`.

## Project structure

```
src/
  app/          Layout, page, global styles and design tokens
  components/   One component per file (header, forest, skills, projects…)
  content/      Typed site content: hero, skills, projects
e2e/            Playwright end-to-end tests
specs/          Specs, project manifest and constitution
design/         Visual references (mood only, not shipped)
```

Site content (projects, skills, hero text) lives in typed files in `src/content/`, not in JSX. To update the portfolio, edit those files.

## How this project is built

Soccerfolio is **spec-driven**. The specs in [`specs/`](./specs) are the source of truth:

- [`specs/manifest.md`](./specs/manifest.md): vision, audience, design guidelines, design tokens and the spec index.
- [`specs/constitution.md`](./specs/constitution.md): the rules for every contributor, human or agent.

Workflow: **Spec → Jira story → branch and PR → review → merge.**

- Each spec becomes a Jira epic, and each user story becomes one branch and one PR.
- Branches: `feature/SOC-<n>-short-title` or `fix/SOC-<n>-short-title`.
- Commits follow Conventional Commits with the Jira key, for example `feat(SOC-12): add hero section`.
- Nobody pushes directly to `main`. Merging requires the owner's approval.
- Lint, type-check, unit tests, end-to-end tests and build must all pass before merge.

### Spec status

| Spec | Area | Status |
|------|------|--------|
| 001 | Foundation: layout, theme and navigation | approved |
| 002 | Hero | approved |
| 004 | Skills | approved |
| 006 | Projects | approved |
| 007 | Contact and footer | draft |
| 008 | SEO, performance and accessibility | draft |
| 900 | Easter egg | approved |

See [`specs/manifest.md`](./specs/manifest.md) for the latest status and Jira links.
