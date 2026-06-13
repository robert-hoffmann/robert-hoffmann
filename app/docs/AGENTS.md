# App Docs Guide

This file applies to `app/docs/` and its descendants.

## Contract

`docs/` contains human-maintained project documentation for app maintenance,
content decisions, profile positioning, and repeatable workflows. It is not
runtime app source and is not parsed automatically by generators unless a
workflow explicitly says otherwise.

Workflow docs are higher-risk operational docs. They describe source ownership,
generator commands, generated-output boundaries, and review steps. Keep them
accurate before changing scripts, generated artifacts, or media ownership.

Profile docs are human-owned notes and drafts. Promote stable claims manually
into canonical app data under `src/data/apps/` or `src/data/docs/`; do not
treat profile notes as generator input.

Use this guide as a routing aid, not source truth. After choosing likely docs
from this map, inspect the actual doc, related app source, generator, and output
boundary before editing.

## First-Read Order

For non-trivial work in `app/docs/`:

1. Read the repository root `AGENTS.md`.
2. Read `app/AGENTS.md`.
3. Read this `app/docs/AGENTS.md`.
4. Read the relevant workflow or profile doc below.
5. Inspect related source, script, design media, or generated output paths.

## Folder TOC

- `workflows/` : operational workflow and contract docs for generators, media,
  and source/output boundaries.
- `profile/`   : profile, positioning, LinkedIn, project-claim, and portfolio
  content guidance notes.

## Doc TOC

- `workflows/cv-workflow.md`                                   : repeatable CV PDF and review
  artifact generation workflow.
- `workflows/gallery-project-workflow.md`                      : gallery/project image data,
  source screenshot, test generation, and publishing workflow.
- `workflows/media-source-contract.md`                         : boundary contract for
  `public/` runtime files versus `design/` source and review media.
- `profile/positioning-guide.md`                               : durable target narrative,
  role fit, environment fit, AI framing, and claim-safety guidance.
- `profile/hiring-brief.md`                                    : human-owned backup/source
  material for the generated `/hiring-brief/` canonical route.
- `profile/project-evidence.md`                                : project-claim evidence,
  claim ledger, ordering, interview prompts, and rough content research.
- `profile/linkedin.md`                                        : LinkedIn-specific headline,
  featured-link, About, and experience copy drafts.
- `profile/archive/`                                           : dated historical
  audits. Current archive file:
  `2026-06-07-cv-portfolio-optimization-audit.md`.

## Common Change Routes

- Change CV document workflow      : start with `workflows/cv-workflow.md`,
  then inspect `scripts/generate-cv-docs.mjs`, `src/data/docs/cv.ts`,
  `design/identity/`, and generated CV outputs.
- Change gallery image workflow    : start with
  `workflows/gallery-project-workflow.md`, then inspect `design/gallery/`,
  `scripts/generate-gallery-test-images.mjs`, `scripts/optimize-images.mjs`,
  `src/data/apps/gallery.ts`, and `src/data/apps/projects.ts`.
- Change media ownership policy    : start with
  `workflows/media-source-contract.md`, then inspect `app/design/AGENTS.md`,
  `app/scripts/AGENTS.md`, and the generator that owns the output.
- Change public profile copy       : start with `profile/positioning-guide.md`
  and the relevant channel note, then manually promote stable facts into
  `src/data/apps/`, `src/data/docs/cv.ts`, `src/data/portfolio/`, or
  `public/llms.txt` when they become source truth.
- Change project claims            : start with `profile/project-evidence.md`,
  then verify current app data, public links, private/self-attested boundaries,
  and CV/public-brief usage.
- Read historical strategy         : use
  `profile/archive/2026-06-07-cv-portfolio-optimization-audit.md` only for
  dated reasoning. Promote any still-active guidance into living profile docs
  before using it for app changes.

## Maintenance

Keep this guide up to date in the same change whenever docs are moved, merged,
renamed, deleted, or given new responsibility.

When updating docs, preserve the boundary between operational workflow docs and
profile scratchpad material. Prefer source/output contracts, ownership, and
routing guidance over duplicating full workflow bodies in this atlas.
