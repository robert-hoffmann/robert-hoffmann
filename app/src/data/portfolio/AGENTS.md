# Canonical Portfolio Data Guide

This file applies to `app/src/data/portfolio/`.

## Contract

This folder owns canonical route resolution, SEO/head data, JSON-LD, text-first
route models, public knowledge artifact builders, `llms.txt`, sitemap/robots
content, and content validation helpers.

Canonical output derives from typed source data in `../apps/` and `../docs/`.
Do not treat generated `public/knowledge/*`, `public/llms.txt`,
`public/sitemap.xml`, `public/robots.txt`, or `dist/` as source truth.

## Boundaries

- Add project routes through route metadata in `../apps/projects.ts`;
  `projectRoutes.ts` derives route manifests from route-enabled projects.
- Add or change source IDs in `sources.ts` before referencing them from project
  metadata, highlights, generated artifacts, or schema data.
- Preserve complete `en` and `fr` localized fields for canonical route content.
- Preserve `/` as `x-default` and keep localized canonical routes under
  `/en/...` and `/fr/...`.
- Keep structured data conservative and visible-page-aligned.

## Validation

Run from `app/` after canonical or retrieval-content changes:

- `npm run content:validate`

For route, SEO, sitemap, robots, JSON-LD, or prerender behavior changes, run:

- `npm run build`
- `npm run seo:validate`

Use `npm run verify` when a change crosses app source, generation, build, and
SEO validation boundaries.

## Maintenance

Update this guide when canonical route shape, generated artifact ownership,
locale policy, or validation commands change. Keep general app-content guidance
in `../AGENTS.md` and workflow-level documentation in `app/docs/`.
