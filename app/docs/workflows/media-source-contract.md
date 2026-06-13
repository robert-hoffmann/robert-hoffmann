# Media Source Contract

`public/` is the deployed runtime surface. Anything placed there is copied by
Vite into `dist`, so it must be intentionally served by the app or by static
site infrastructure.

`design/` owns source, design, and review media. Files in `design/` are inputs
for scripts or human review and must not be referenced directly by runtime Vue,
CSS, HTML, manifest, or generated public document output.

Repository-level Markdown assets, such as GitHub README icons, live outside the
app tree in `.github/assets/`. They are not app runtime files and should not be
stored in `app/public/`.

## Runtime Files

Keep only these categories in `public/`:

- App-loaded media referenced from `src/`, `index.html`, manifests, or static
  platform files.
- Generated runtime media written by `scripts/optimize-images.mjs`.
- Final generated CV PDF written by `scripts/generate-cv-docs.mjs`.
- Generated social preview output written by `scripts/generate-og-image.mjs`.
- Hand-owned runtime assets that are intentionally served from `public/`, such
  as `404.html`, `fonts/`, `music.mp3`, `nope-penguin.gif`, and
  `parallax/desktop.scene.json`.
- Static deploy files such as `CNAME`, `.nojekyll`, `robots.txt`,
  `sitemap.xml`, `site.webmanifest`, and `llms.txt`.

## Source And Review Files

Keep source and review media under logical `design/` folders:

- `design/gallery/` for gallery screenshots, plus ignored temporary review
  output under `design/gallery/_test-normalized/`.
- `design/identity/` for profile and banner identity sources, plus generated
  CV HTML, preview PNG, and flattened hero used to produce the public PDF.
- `design/parallax/` for parallax source layers.
- `design/icons/` for design-exported icon sprites and metadata.
- `design/video/` for video poster source media.
- `design/music/` for music artwork source media.

Before committing media changes, run the generator that owns the runtime output
and confirm `dist/` does not contain source-only folders or review outputs.
