# App Package Guide

This file applies to `app/` and its descendants unless a deeper `AGENTS.md`
narrows the guidance.

## Contract

`app/` is the actual Vue/Vite package for the desktop portfolio. Run package
commands from this directory unless a command explicitly says otherwise.

The repository root `AGENTS.md` owns global agent policy, skill invocation,
Conventional Commit prefixes, and the compatibility/fallback escalation rule.
This file adds app-specific routing for package tooling, build steps, generated
assets, and local maintenance docs.

Use this guide as a routing aid, not source truth. Before changing behavior,
inspect the relevant config, source, workflow docs, and generated-output
contracts directly.

## First-Read Order

For non-trivial work in `app/`:

1. Read the repository root `AGENTS.md`.
2. Read this `app/AGENTS.md`.
3. Read the deeper local guide when the work is under `src/`, `scripts/`,
   `design/`, or `docs/`.
4. Read `package.json` for command wiring and dependency context.
5. Inspect the relevant app config, workflow doc, source file, or generated
   output boundary before editing.

## Local Atlases

- `src/AGENTS.md`     : Vue source, data, composables, components, styles,
  types, utilities, and runtime app change routes.
- `scripts/AGENTS.md` : Node ESM generator scripts, package command bindings,
  read/write targets, and generated artifact rules.
- `design/AGENTS.md`  : source and review media ownership for image, icon,
  parallax, video, music, identity, gallery, and CV assets.
- `docs/AGENTS.md`    : workflow docs, profile notes, content guidance, and
  source/output documentation boundaries.

## App Shape

- Runtime framework : Vue 3 SFC app with TypeScript and Vite.
- Styling           : Tailwind CSS v4 through the Vite plugin plus source CSS
  under `src/assets/css/`.
- Desktop shell     : macOS-inspired windowing surface for portfolio apps,
  media, terminal, and GeoWars.
- Mobile shell      : dedicated mobile experience plus desktop-triggered
  mobile preview mode.
- Static output     : production build writes `dist/`; runtime static assets
  live under `public/`.
- Generated media   : image, OG, gallery review, and CV artifacts are produced
  by scripts under `scripts/`.

## Package Command Map

- `npm run dev`                      : start the Vite dev server.
- `npm run build`                    : run `prebuild`, then `vue-tsc -b` and
  `vite build`.
- `npm run prebuild`                 : regenerate canonical content artifacts,
  runtime media, and the OG image before `build`.
- `npm run preview`                  : preview the existing production build.
- `npm run prod`                     : build, then preview production output.
- `npm run check`                    : run lint and typecheck together.
- `npm run lint`                     : run ESLint with zero warnings allowed.
- `npm run lint:fix`                 : run ESLint autofix.
- `npm run typecheck`                : run `vue-tsc -b`.
- `npm run content:generate`         : generate canonical public knowledge,
  `llms.txt`, sitemap, and robots artifacts.
- `npm run content:validate`         : validate canonical content contracts and
  generated artifact determinism/staleness.
- `npm run seo:validate`             : validate prerendered canonical HTML in
  `dist/` after a production build.
- `npm run verify`                   : run check, content validation, build,
  and SEO validation.
- `npm run audit`                    : run `npm audit --audit-level=moderate`.
- `npm run optimize-images`          : generate committed runtime media under
  `public/` from source media under `design/`.
- `npm run generate-og-image`        : generate `public/og-image.png`.
- `npm run gallery:generate-test`    : generate ignored gallery review output
  under `design/gallery/_test-normalized/`.
- `npm run docs:cv`                  : generate CV review artifacts under
  `design/identity/` and the deployed PDF under `public/docs/`.
- `npm run docs:cv:install-browsers` : install Playwright Chromium when
  `docs:cv` cannot find the local browser binary.

Use `npm run build` rather than raw `vite build` when regenerated runtime media
or OG output matters; npm runs `prebuild` automatically before `build`.

## Config TOC

- `package.json`       : package metadata, npm scripts, runtime dependencies,
  and dev tooling dependencies.
- `package-lock.json`  : npm lockfile; update together with dependency changes.
- `vite.config.ts`     : Vite plugins for Vue, Tailwind, prerendering, public
  asset version tokens, and deferred entry stylesheet loading.
- `prerender.ts`       : route-aware crawler/social static HTML renderer
  sourced from canonical portfolio data.
- `index.html`         : root HTML shell, global boot metadata, boot script,
  and public asset references. Route SEO is injected by prerendering.
- `eslint.config.mjs`  : flat ESLint config for browser source files and Node
  tooling files.
- `tsconfig.json`      : TypeScript project references for app and Node config.
- `tsconfig.app.json`  : strict Vue/browser TypeScript project for `src/`.
- `tsconfig.node.json` : strict Node-side TypeScript project for Vite config.
- `.gitignore`         : app-local ignores for dependencies, build output,
  local files, and temporary gallery review output.

ESLint covers `prerender.ts` and `scripts/**/*.mjs`; `vue-tsc -b` typechecks
the referenced TypeScript projects, currently `src/` and `vite.config.ts`.

## Generated Asset Boundaries

- `design/`                          : source and review media; read
  `design/AGENTS.md` before changing ownership or generator inputs.
- `public/`                          : committed runtime static assets and
  metadata served by Vite and copied into production builds.
- `public/knowledge/`                : generated canonical JSON artifacts for
  person, projects, and portfolio retrieval.
- `public/docs/`                     : deployed generated documents, currently
  the CV PDF.
- `design/identity/`                 : identity sources plus generated CV review
  artifacts.
- `design/gallery/_test-normalized/` : ignored temporary gallery review output.
- `dist/`                            : generated production build output; do
  not hand-edit.

Generated files are verification targets, not primary edit targets. Change the
owning source, generator, or workflow first, then regenerate and verify the
output.

## Common Change Routes

- Change Vue source or app content  : start with `src/AGENTS.md`, then inspect
  the owning component, composable, data file, type, and CSS.
- Change media or generated assets  : start with `design/AGENTS.md` and
  `scripts/AGENTS.md`, then inspect the source media, generator, and output
  path.
- Change build behavior             : start with `package.json` and
  `vite.config.ts`; include `prerender.ts` when crawler/static HTML changes.
- Change SEO, canonical retrieval, or social previews : start with
  `src/data/portfolio/`, `src/data/apps/projects.ts`, `prerender.ts`,
  `index.html`, `vite.config.ts`, `scripts/generate-content-artifacts.mjs`,
  `scripts/validate-content-artifacts.mjs`,
  `scripts/validate-dist-seo.mjs`, and `scripts/generate-og-image.mjs`.
- Change lint or type policy        : start with `eslint.config.mjs`,
  `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`.
- Change package commands           : start with `package.json`, then update
  this guide and any affected deeper guide or workflow doc in the same change.
- Change CV or gallery workflows    : start with `docs/AGENTS.md` and the
  matching doc under `docs/workflows/`, then inspect the related data, design
  media, script, and generated output boundary.

## Commit Scope Reminder

Root commit policy still applies. For app-only changes, scopes such as
`docs(app):`, `feat(app):`, `fix(app):`, `build(app):`, or `chore(app):` are
reasonable when they improve clarity, but the prefix must remain a valid
Conventional Commit prefix.

Do not invent aliases such as `feature:` or `bugfix:`.

## Maintenance

Keep this guide up to date in the same change whenever app-level commands,
config entrypoints, build or prerender behavior, generated-output boundaries,
or local `AGENTS.md` routing changes.

When updating this guide, keep it strategic. Prefer package contracts, command
routes, config ownership, and source/output boundaries over a full file
inventory.
