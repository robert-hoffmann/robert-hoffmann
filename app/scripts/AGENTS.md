# App Scripts Guide

This file applies to `app/scripts/` and its descendants.

## Contract

`scripts/` contains Node ESM generator scripts for app media, document, and
metadata artifacts. Treat these scripts as build tooling, not runtime app code.
`app/package.json` owns the public npm command names that invoke them.

Generated outputs are not all disposable. Some outputs under `public/` and
`design/identity/` are tracked project artifacts, while
`design/gallery/_test-normalized/` is ignored temporary review output. Identify
the target paths and related workflow docs before changing generator behavior.

Use this guide as a routing aid, not source truth. After choosing likely files
from this map, inspect the script, command wiring, source media, workflow docs,
and output contracts before editing.

## First-Read Order

For non-trivial work in `app/scripts/`:

1. Read the repository root `AGENTS.md`.
2. Read `app/AGENTS.md`.
3. Read this `app/scripts/AGENTS.md`.
4. Read `app/package.json` for command wiring.
5. Open the relevant script and nearby workflow docs.
6. Inspect source inputs under `design/`, `src/`, or embedded script data.
7. Identify generated-output paths before changing write behavior.

## Generated Artifact Rule

Generated files are verification targets, not primary edit targets. Inspect the
generator, source inputs, command wiring, and workflow docs before changing
behavior. After regeneration, verify generated artifacts for existence,
expected type or dimensions, and visual and content sanity where relevant. Do not
hand-edit generated HTML, PDF, or image outputs unless a workflow doc explicitly
calls for it.

## Script TOC

- `optimize-images.mjs`              : runtime media generator. Reads source
  media under `design/` and writes committed runtime assets under `public/`.
- `generate-gallery-test-images.mjs` : gallery review generator. Reads
  `design/gallery/` and writes ignored temporary review output under
  `design/gallery/_test-normalized/`.
- `generate-og-image.mjs`            : social preview generator. Renders the
  embedded SVG card and writes the generated PNG to `public/og-image.png`.
- `generate-cv-docs.mjs`             : CV document generator. Loads
  `src/data/docs/cv.ts` through Vite SSR, reads identity source assets, writes
  generated review artifacts under `design/identity/`, and writes the deployed
  PDF under `public/docs/`.

## Generator Map

- `npm run optimize-images`          : runs `scripts/optimize-images.mjs`; reads
  `design/gallery/`, `design/identity/`, `design/icons/`, `design/music/`,
  `design/parallax/`, and `design/video/`; writes runtime media to `public/`.
- `npm run generate-og-image`        : runs `scripts/generate-og-image.mjs`;
  writes `public/og-image.png`.
- `npm run gallery:generate-test`    : runs
  `scripts/generate-gallery-test-images.mjs`; reads `design/gallery/`; writes
  ignored review output to `design/gallery/_test-normalized/`.
- `npm run docs:cv`                  : runs `scripts/generate-cv-docs.mjs`; loads
  `src/data/docs/cv.ts`; reads `design/identity/`; writes generated CV review
  artifacts to `design/identity/` and the deployed PDF to `public/docs/`.
- `npm run docs:cv:install-browsers` : installs Playwright Chromium for
  `docs:cv` when the local browser dependency is missing.
- `npm run prebuild`                 : runs `scripts/optimize-images.mjs` and
  `scripts/generate-og-image.mjs` directly before the production build.

## Adjacent Truth

- Design media ownership      : `app/design/AGENTS.md`.
- Gallery workflow            : `app/docs/gallery-project-workflow.md`.
- CV generation workflow      : `app/docs/cv-workflow.md`.
- Source/runtime media policy : `app/docs/media-source-contract.md`.
- Npm command wiring          : `app/package.json`.

## Common Change Routes

- Change runtime media generation   : start with `optimize-images.mjs`, then
  inspect `app/design/AGENTS.md`, `app/docs/media-source-contract.md`, source
  media under `design/`, and the relevant `public/` output layout; after
  regeneration, verify expected runtime assets.
- Change gallery review generation  : start with
  `generate-gallery-test-images.mjs`, then inspect
  `app/docs/gallery-project-workflow.md` and `design/gallery/`.
- Change OG image output            : start with `generate-og-image.mjs`, then
  inspect `app/index.html` metadata; after regeneration, verify
  `public/og-image.png` exists and matches the intended social preview.
- Change CV docs generation         : start with `generate-cv-docs.mjs`, then
  inspect `app/docs/cv-workflow.md`, `src/data/docs/cv.ts`,
  `design/identity/` source and review paths; after regeneration, verify
  `public/docs/robert-hoffmann-cv.pdf` exists, opens, and matches the intended
  CV output.
- Change command wiring             : start with `app/package.json`, then
  update this guide and any related workflow docs in the same change.

## Maintenance

Keep this guide up to date in the same change whenever scripts are created,
deleted, moved, renamed, rebound in `app/package.json`, or given new read/write
targets or responsibilities.

When updating this guide, keep it as navigation guidance. Prefer generator
roles, command routes, and source/output boundaries over exhaustive
implementation summaries.
