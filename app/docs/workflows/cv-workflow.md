# Repeatable CV / Resume PDF Workflow

This workflow regenerates the public EN/FR CV PDFs and design-side review
artifacts from curated repository data. Do not hand-edit generated files in
`public/docs/` or generated CV review files in `design/identity/`.

## Artifact Contract

The generator owns these runtime outputs:

- `public/docs/robert-hoffmann-cv.pdf`
- `public/docs/robert-hoffmann-cv-fr.pdf`

The generator also owns these design-side review artifacts:

- `design/identity/robert-hoffmann-cv-hero.jpeg`
- `design/identity/robert-hoffmann-cv.html`
- `design/identity/robert-hoffmann-cv-fr.html`
- `design/identity/robert-hoffmann-cv.png`
- `design/identity/robert-hoffmann-cv-fr.png`

The HTML must contain a generated-file notice pointing back to
`scripts/generate-cv-docs.mjs` and this workflow document.

Keep `public/docs/robert-hoffmann-cv.pdf` as the English PDF. That URL is the
stable external download path and must not change during build or deploy.

## Source Ownership

Runtime app modules own canonical facts used by the portfolio UI:

- `src/data/apps/about.ts`   : profile, certifications, and public profile links.
- `src/data/apps/resume.ts`  : employment history and role summaries.
- `src/data/apps/projects.ts`: project facts, project metrics, links, and portfolio ordering.
- `src/data/apps/gallery.ts` : gallery images that can provide visual evidence for projects.

Document selection is owned by:

- `src/data/docs/cv.ts`                    : the one-page EN/FR CV selections,
  wording, metrics, source ids, labels, and visual identity asset references.
  Keep translatable CV copy side-by-side as `{ en, fr }`, matching
  `src/data/apps/*`, so both locales remain easy to compare and edit.
- `design/identity/x-banner-1500x500.jpeg` : the compact CV hero background,
  shared with the X profile visual identity.
- `design/identity/profile_400x400.jpg`    : the circular CV profile/avatar
  image, shared with the X profile visual identity.

Freeform research and channel-copy notes stay human-owned:

- `docs/profile/project-evidence.md` : evidence, rough notes, claim ledger, and project-claim research.
- `docs/profile/linkedin.md`         : LinkedIn-specific profile/channel copy.

Do not parse the Markdown notes automatically. Promote stable claims manually into
the canonical app modules or into `src/data/docs/cv.ts`, depending on whether the
fact belongs to the runtime app or only to the one-page CV.

## Commands

Install the Playwright browser once per machine if Chromium is missing:

```sh
npm run docs:cv:install-browsers
```

Regenerate the CV artifacts:

```sh
npm run docs:cv
```

The generator:

1. Loads `src/data/docs/cv.ts` through Vite SSR so TS data and
   `import.meta.env.BASE_URL` resolve like the app.
2. Checks `design/identity/profile_400x400.jpg` and
   `design/identity/x-banner-1500x500.jpeg` are readable and non-empty.
3. Uses Sharp to generate `design/identity/robert-hoffmann-cv-hero.jpeg` from
   `design/identity/x-banner-1500x500.jpeg` with the configured overlay blend.
4. Writes one-page A4 HTML review files for English and French under
   `design/identity/`.
5. Uses Playwright Chromium to render the English and French PDFs under
   `public/docs/`.
6. Uses Playwright Chromium to screenshot each `.sheet` preview to
   `design/identity/`.
7. Verifies the outputs are non-empty, each HTML has the expected `lang`, each
   PDF starts with `%PDF`, and each PNG is `794x1123`.

## App Shortcut

The PDF shortcut is a normal registry `link` item:

- id                : `cv-pdf`
- title             : `CV PDF`
- URL               : `${BASE_URL}docs/robert-hoffmann-cv.pdf`
- desktop placement : near the existing `Resume` icon
- mobile placement  : after `Gallery` in the mobile home grid

The existing `Resume` item remains the interactive in-app resume window. `CV PDF`
opens the generated English PDF in a new browser tab through the same link
behavior used by social shortcuts.

In-app download links in About, Resume, and Projects use
`src/composables/useCvDownload.ts` to choose the English or French PDF from the
current interface locale.

## Update Checklist

When adding or revising CV content:

1. Update canonical facts first in `about.ts`, `resume.ts`, `projects.ts`, or
   `gallery.ts` when the app should also show them.
2. Update `src/data/docs/cv.ts` when the change is a one-page CV selection or wording decision.
3. Update `design/identity/x-banner-1500x500.jpeg` or
   `design/identity/profile_400x400.jpg` only when the CV/X visual identity
   should change.
4. Run `npm run docs:cv`.
5. Review `design/identity/robert-hoffmann-cv.png` and
   `design/identity/robert-hoffmann-cv-fr.png` visually for overflow,
   clipping, and one-page fit.
6. Open `public/docs/robert-hoffmann-cv.pdf` and
   `public/docs/robert-hoffmann-cv-fr.pdf` and confirm each is one page.
7. Run `npm run build`.
8. Smoke-test desktop and mobile:
   - `Resume` opens the existing app window.
   - `CV PDF` opens `docs/robert-hoffmann-cv.pdf` in a new tab.
   - In-app CV download links open the PDF for the current interface locale.

## Design Notes

The CV uses compact X-inspired identity sources in `design/identity/`:
`x-banner-1500x500.jpeg` as the header background source and
`profile_400x400.jpg` as the circular identity image. The PDF does not render
the source banner with layered CSS transparency; the generator first flattens
the banner and overlays into `robert-hoffmann-cv-hero.jpeg`. This avoids PDF
viewer differences, especially PDF.js-based previews.

The circular profile image stays separate from the flattened hero so screen
HTML and PDF output share one avatar source. Keep `.mark` background rendering
explicit (`background-repeat`, `background-origin`, and `background-clip`);
Apple PDF renderers can distort Chromium-generated circular background images
when those defaults are implicit.

Tune the banner merge in `scripts/generate-cv-docs.mjs`:

- `HERO_BACKGROUND_OVERLAY.horizontal`: left-to-right dark overlay.
- `HERO_BACKGROUND_OVERLAY.vertical`  : top-to-bottom dark overlay.
- `HERO_BACKGROUND_JPEG_QUALITY`      : flattened JPEG quality.

Keep the header compact enough to preserve one-page density; avoid expanding it
into a full social-profile hero unless the body content is intentionally reduced.

English and French CVs are curated explicitly in `src/data/docs/cv.ts`. Do not
derive translated claims implicitly from the app or profile notes.
