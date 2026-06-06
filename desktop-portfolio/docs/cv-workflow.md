# Repeatable CV / Resume PDF Workflow

This workflow regenerates the public CV artifacts from curated repository data.
Do not hand-edit the generated files in `public/docs/`.

## Artifact Contract

The generator owns these outputs:

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

- `src/data/docs/cv.ts`: the one-page English CV selection, wording, metrics, and source ids.

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
2. Writes the one-page A4 HTML to `public/docs/robert-hoffmann-cv.html`.
3. Uses Playwright Chromium to render `public/docs/robert-hoffmann-cv.pdf`.
4. Uses Playwright Chromium to screenshot the `.sheet` preview to `public/docs/robert-hoffmann-cv.png`.
5. Verifies the outputs are non-empty, the PDF starts with `%PDF`, and the PNG is `794x1123`.

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
3. Run `npm run docs:cv`.
4. Review `public/docs/robert-hoffmann-cv.png` visually for overflow, clipping, and one-page fit.
5. Open `public/docs/robert-hoffmann-cv.pdf` and confirm it is one page.
6. Run `npm run build`.
7. Smoke-test desktop and mobile:
   - `Resume` opens the existing app window.
   - `CV PDF` opens `docs/robert-hoffmann-cv.pdf` in a new tab.

## Design Notes

The v1 goal is stability, not editorial redesign. Keep layout and content close
to the current artifact until the workflow is trusted. Editorial improvements
should be made after regeneration is deterministic and reviewed.

The CV stays English-only for now. If a French PDF is added later, prefer a
second curated document object or an explicit locale field rather than deriving
translated claims implicitly from the app.
