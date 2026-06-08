# Repeatable CV / Resume PDF Workflow

This workflow regenerates the public CV artifacts from curated repository data.
Do not hand-edit the generated files in `public/docs/`.

## Artifact Contract

The generator owns these outputs:

- `public/docs/robert-hoffmann-cv-hero.jpeg`
- `public/docs/robert-hoffmann-cv.html`
- `public/docs/robert-hoffmann-cv.pdf`
- `public/docs/robert-hoffmann-cv.png`

The HTML must contain a generated-file notice pointing back to
`scripts/generate-cv-docs.mjs` and this workflow document.

## Source Ownership

Runtime app modules own canonical facts used by the portfolio UI:

- `src/data/apps/about.ts`: profile, certifications, and public profile links.
- `src/data/apps/resume.ts`: employment history and role summaries.
- `src/data/apps/projects.ts`: project facts, project metrics, links, and portfolio ordering.
- `src/data/apps/gallery.ts`: gallery images that can provide visual evidence for projects.

Document selection is owned by:

- `src/data/docs/cv.ts`: the one-page English CV selection, wording, metrics, source ids, and visual identity asset references.
- `public/docs/x-banner-1500x500.jpeg`: the compact CV hero background, shared with the X profile visual identity.
- `public/docs/profile_400x400.jpg`: the circular CV profile/avatar image, shared with the X profile visual identity.
- `public/docs/robert-hoffmann-cv-hero.jpeg`: generated flattened hero background used by the HTML/PDF; do not edit directly.

Freeform research and channel-copy notes stay human-owned:

- `docs/project-highlights-scratchpad.md`: evidence, rough notes, and project-claim research.
- `docs/linkedin.md`: LinkedIn-specific profile/channel copy.

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

1. Loads `src/data/docs/cv.ts` through Vite SSR so TS data and `import.meta.env.BASE_URL` resolve like the app.
2. Uses Sharp to generate `public/docs/robert-hoffmann-cv-hero.jpeg` from `x-banner-1500x500.jpeg` with the configured overlay blend.
3. Writes the one-page A4 HTML to `public/docs/robert-hoffmann-cv.html`.
4. Uses Playwright Chromium to render `public/docs/robert-hoffmann-cv.pdf`.
5. Uses Playwright Chromium to screenshot the `.sheet` preview to `public/docs/robert-hoffmann-cv.png`.
6. Verifies the outputs are non-empty, the PDF starts with `%PDF`, and the PNG is `794x1123`.

## App Shortcut

The PDF shortcut is a normal registry `link` item:

- id: `cv-pdf`
- title: `CV PDF`
- URL: `${BASE_URL}docs/robert-hoffmann-cv.pdf`
- desktop placement: near the existing `Resume` icon
- mobile placement: after `Resume`

The existing `Resume` item remains the interactive in-app resume window. `CV PDF`
opens the generated PDF in a new browser tab through the same link behavior used
by social shortcuts.

## Update Checklist

When adding or revising CV content:

1. Update canonical facts first in `about.ts`, `resume.ts`, `projects.ts`, or `gallery.ts` when the app should also show them.
2. Update `src/data/docs/cv.ts` when the change is a one-page CV selection or wording decision.
3. Update `public/docs/x-banner-1500x500.jpeg` or `public/docs/profile_400x400.jpg` only when the CV/X visual identity should change.
4. Run `npm run docs:cv`.
5. Review `public/docs/robert-hoffmann-cv.png` visually for overflow, clipping, and one-page fit.
6. Open `public/docs/robert-hoffmann-cv.pdf` and confirm it is one page.
7. Run `npm run build`.
8. Smoke-test desktop and mobile:
   - `Resume` opens the existing app window.
   - `CV PDF` opens `docs/robert-hoffmann-cv.pdf` in a new tab.

## Design Notes

The CV uses a compact X-inspired hero: `x-banner-1500x500.jpeg` as the header
background source and `profile_400x400.jpg` as the circular identity image. The
PDF does not render the source banner with layered CSS transparency; the
generator first flattens the banner and overlays into
`robert-hoffmann-cv-hero.jpeg`. This avoids PDF viewer differences, especially
PDF.js-based previews.

The circular profile image stays separate from the flattened hero so screen
HTML and PDF output share one avatar source. Keep `.mark` background rendering
explicit (`background-repeat`, `background-origin`, and `background-clip`);
Apple PDF renderers can distort Chromium-generated circular background images
when those defaults are implicit.

Tune the banner merge in `scripts/generate-cv-docs.mjs`:

- `HERO_BACKGROUND_OVERLAY.horizontal`: left-to-right dark overlay.
- `HERO_BACKGROUND_OVERLAY.vertical`: top-to-bottom dark overlay.
- `HERO_BACKGROUND_JPEG_QUALITY`: flattened JPEG quality.

Keep the header compact enough to preserve one-page density; avoid expanding it
into a full social-profile hero unless the body content is intentionally reduced.

The CV stays English-only for now. If a French PDF is added later, prefer a
second curated document object or an explicit locale field rather than deriving
translated claims implicitly from the app.
