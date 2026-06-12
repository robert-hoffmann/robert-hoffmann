# Design Media Guide

This file applies to `app/design/` and its descendants.

## Contract

`design/` contains source, design, and review media used by generators or human
review. It is not a runtime/deploy surface. Files that the final site serves
belong in `public/` and should normally be written there by a generator.

Keep this tree shallow. Do not create empty parent folders or one-child
container folders such as `gallery/src/` or `parallax/desktop/` unless there is
a real sibling category. Do not duplicate a source file just to make generated
review output self-contained; prefer colocating review output with the source
or using a stable relative path.

Repository-level Markdown assets, such as GitHub README icons, live in
`.github/assets/`, not in this app design tree.

Use this guide as a routing aid, not source truth. After choosing likely media
or generator inputs from this map, inspect the actual assets, generator, and
workflow docs before changing ownership or output behavior.

## First-Read Order

For non-trivial work in `app/design/`:

1. Read the repository root `AGENTS.md`.
2. Read `app/AGENTS.md`.
3. Read this `app/design/AGENTS.md`.
4. Read `app/scripts/AGENTS.md` when generator inputs or outputs are involved.
5. Inspect the related workflow doc and source media before changing behavior.

## Folder TOC

- `gallery/`                  : gallery screenshot sources named
  `<projectId>-<local-image-number>.<ext>`. Consumed by
  `scripts/optimize-images.mjs` for runtime gallery assets and by
  `scripts/generate-gallery-test-images.mjs` for local review output.
- `gallery/_test-normalized/` : ignored generated gallery review output. It is
  safe to regenerate and should not be committed.
- `icons/`                    : desktop icon sprite design inputs. Keep
  editable `.af` files, sprite metadata, and the exported source sprite
  `desktop-profile-icons.webp` here. Run `npm run optimize-images` to regenerate
  `public/icons/desktop-profile-icons-runtime.webp`.
- `identity/`                 : profile and banner identity sources plus CV
  review artifacts. `profile_400x400.jpg` and `x-banner-1500x500.jpeg` are
  source files.
  `robert-hoffmann-cv.html`, `robert-hoffmann-cv.png`, and
  `robert-hoffmann-cv-hero.jpeg` are generated review artifacts; the deployed
  PDF belongs in `public/docs/robert-hoffmann-cv.pdf`.
- `music/`                    : music artwork source media.
  `rockstar-cover_1000x1000.jpg` generates the runtime artwork in `public/`.
- `parallax/`                 : source parallax layers: `background.png`,
  `middle.png`, and `foreground.png`. These generate desktop parallax layers,
  desktop LQIP, and mobile wallpaper outputs in `public/parallax/`.
- `video/`                    : video poster source media.
  `video-poster-source.jpg` generates the runtime poster variants in `public/`.

## Generator Map

- `npm run optimize-images`       : reads `design/gallery/`,
  `design/identity/`, `design/icons/`, `design/music/`, `design/parallax/`,
  and `design/video/`; writes runtime assets to `public/`.
- `npm run docs:cv`               : reads `design/identity/`; writes CV review
  artifacts to `design/identity/` and the deployed PDF to `public/docs/`.
- `npm run gallery:generate-test` : reads `design/gallery/`; writes temporary
  review output to `design/gallery/_test-normalized/`.
- `npm run generate-og-image`     : writes `public/og-image.png`.

`design/gallery/_test-normalized/` is ignored and should not be committed.

## Maintenance

Keep this guide up to date in the same change whenever design folders are
created, deleted, moved, renamed, or given new ownership, generator inputs,
generator outputs, or media responsibilities.

When updating this guide, keep it as navigation guidance. Prefer media
ownership, source/output boundaries, and generator routes over exhaustive file
inventories.
