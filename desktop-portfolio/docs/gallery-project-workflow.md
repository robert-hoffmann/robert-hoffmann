# Gallery And Project Image Workflow

This document explains how the Projects app, Gallery app, and gallery image
assets work together, and how to regenerate standardized gallery images from
source screenshots.

All paths below are relative to the app package root, which is
`desktop-portfolio/` from the repository root.

The durable rule is simple: `projects.ts` links each project to one
representative gallery slide, while `gallery.ts` may contain many slides that
link back to the same project.

<!-- #region Runtime System -->

## Runtime Architecture

The gallery/project system is split across typed data modules, Vue components,
and one shared navigation composable.

Key files:

- `src/data/apps/projects.ts`
- `src/data/apps/gallery.ts`
- `src/components/ProjectsApp.vue`
- `src/components/ImageViewerApp.vue`
- `src/composables/usePortfolioNavigation.ts`
- `public/image-gallery/images/`
- `public/image-gallery/thumbs/`

### Data Contract

`projects.ts` owns project cards. Each project has an `id`, localized content,
stack data, optional links, and optionally one `imageId`.

The `imageId` in `projects.ts` is the representative slide opened from the
project card. It should point to the best gallery slide for that project.

`gallery.ts` owns gallery slides. Each slide has an `imageId`, a `projectId`,
localized title/summary/alt text, image metadata, thumbnail metadata, and any
slide-level presentation data.

The `projectId` in `gallery.ts` must match an `id` from `projects.ts`.
Multiple gallery slides may share the same `projectId`.

Example relationship:

```text
projects.ts
  proj-chatapp -> imageId 1

gallery.ts
  imageId 1 -> projectId proj-chatapp
  imageId 2 -> projectId proj-chatapp
  imageId 3 -> projectId proj-chatapp
  imageId 4 -> projectId proj-chatapp
```

This means:

- Projects -> Gallery opens one representative slide.
- Gallery  -> Projects always opens the matching project card.
- Gallery can show multiple screenshots for one project without duplicating
  project cards.

### Navigation Flow

Projects to Gallery:

1. `ProjectsApp.vue` renders an image button only when a project has numeric
   `imageId`.
2. The click handler calls `showGalleryImage(imageId)`.
3. `usePortfolioNavigation.ts` stores `galleryImageRequest` and dispatches the
   `portfolio:open-app` event with `itemId: 'gallery'`.
4. The desktop/mobile shell opens or focuses the Gallery app.
5. `ImageViewerApp.vue` consumes the request, finds the slide by `imageId`, and
   scrolls/selects it.

Gallery to Projects:

1. `ImageViewerApp.vue` calls `showProjectInfo(activeSlide.projectId)` from the
   Project Info button.
2. `usePortfolioNavigation.ts` stores `projectInfoRequest` and dispatches the
   `portfolio:open-app` event with `itemId: 'projects'`.
3. The desktop/mobile shell opens or focuses the Projects app.
4. `ProjectsApp.vue` consumes the request, scrolls to the project element, and
   highlights it briefly.

The event opens/focuses the target app. The reactive request lets the target
component consume the requested `imageId` or `projectId`, including when the
component mounts after the event is dispatched.

## Asset Contract

Runtime gallery assets live in:

```text
public/image-gallery/images/
public/image-gallery/thumbs/
```

The runtime file names are numeric and zero-padded:

```text
public/image-gallery/images/01.webp
public/image-gallery/thumbs/01.webp
```

`gallery.ts` derives these URLs from `imageId`:

```text
imageId 1  -> images/01.webp and thumbs/01.webp
imageId 12 -> images/12.webp and thumbs/12.webp
```

Current runtime dimensions:

- Full image : `1600x1000`
- Thumbnail  : `360x360`

Do not publish a full image without the matching thumbnail. Do not publish
either asset without a matching `gallery.ts` slide.

## Source Image Contract

Raw/final source screenshots live in:

```text
public/image-gallery/src/
```

Use this naming convention:

```text
<gallery-position>-<projectId>.<ext>
```

Examples:

```text
1-proj-chatapp.jpg
2-proj-chatapp.jpg
5-proj-desktop-portfolio.png
```

Rules:

- `gallery-position` is the numeric slide position and becomes `imageId`.
- `projectId` must match a project `id` in `projects.ts`.
- Several files may use the same `projectId`.
- The extension may be `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`.
- Source images may have mixed dimensions and aspect ratios.
- Keep source images in this directory after publishing. They are the reusable
  inputs for future regeneration.

## Adding Or Replacing A Source Image

To add a new gallery slide:

1. Pick the next available numeric `gallery-position`.
2. Save the screenshot as `public/image-gallery/src/<gallery-position>-<projectId>.<ext>`.
3. Run the test generator.
4. Review the generated `blur-card` result.
5. Publish the matching full image and thumbnail.
6. Add one matching `gallery.ts` slide.
7. Update `projects.ts` only when this new slide should become the project's
   representative image.

To replace an existing slide:

1. Keep the same `gallery-position` and `projectId` in the source file name.
2. Replace the source screenshot in `public/image-gallery/src/`.
3. Regenerate and republish the same numbered runtime image and thumbnail.
4. Update `gallery.ts` copy only when the title, summary, alt text, or project
   relationship changed.

Do not add an `imageId` to a project just because a gallery slide exists for
that project. `projects.ts` should expose only the best representative slide
for that project card.

<!-- #endregion Runtime System -->

<!-- #region Normalization -->

## Normalization Strategy

The selected normalization style is `blur-card`.

`blur-card` creates a consistent `1600x1000` canvas by:

1. Resizing the source image as a cover-fill blurred background.
2. Dimming and slightly desaturating the background.
3. Resizing the original source image to fit inside the canvas.
4. Centering the preserved source image as a foreground card.
5. Adding a subtle border/shadow treatment.
6. Generating a square thumbnail from the normalized result.

Why `blur-card` is preferred:

- It preserves full UI screenshots without cropping important evidence.
- It gives every slide the same visual frame.
- It avoids generated or invented visual content.
- It works for wide, portrait, and irregular screenshot sizes.

Rejected options:

`cover-crop`
- Strength : fills the frame cleanly.
- Weakness : crops UI screenshots and can remove important context.

`clean-card`
- Strength : creates a more uniform dark gallery mood.
- Weakness : loses some connection to the source image and can feel less
  specific.

## Test Generation Workflow

Use the test workflow before updating runtime assets.

From the repository root:

```sh
cd desktop-portfolio
npm run gallery:generate-test
```

If already in the app package root, run only `npm run gallery:generate-test`.

This command runs `scripts/generate-gallery-test-images.mjs`.

The generator reads:

```text
public/image-gallery/src/
```

It writes only to:

```text
public/image-gallery/_test-normalized/
```

Generated test folders:

```text
public/image-gallery/_test-normalized/images/blur-card/
public/image-gallery/_test-normalized/images/clean-card/
public/image-gallery/_test-normalized/images/cover-crop/
public/image-gallery/_test-normalized/thumbs/blur-card/
public/image-gallery/_test-normalized/thumbs/clean-card/
public/image-gallery/_test-normalized/thumbs/cover-crop/
```

Generated support files:

```text
public/image-gallery/_test-normalized/index.html
public/image-gallery/_test-normalized/manifest.json
```

Review `index.html` in a browser or inspect individual WebP files. The test
script intentionally leaves runtime `images/` and `thumbs/` untouched.
Generated test output is temporary and should be removed after publishing or
reviewing.

The manifest preserves the mapping from numeric output file to `projectId`:

```json
[
  {
    "fileName"   : "01.webp",
    "position"   : 1,
    "projectId"  : "proj-chatapp",
    "sourceFile" : "1-proj-chatapp.jpg"
  }
]
```

<!-- #endregion Normalization -->

<!-- #region Publishing -->

## Publishing Workflow

After reviewing the `blur-card` test output:

Approved `blur-card` outputs live in:

```text
public/image-gallery/_test-normalized/images/blur-card/
public/image-gallery/_test-normalized/thumbs/blur-card/
```

1. For a single new or replaced slide, copy only the matching numbered pair:

   ```sh
   SLIDE=08
   cp \
     "public/image-gallery/_test-normalized/images/blur-card/${SLIDE}.webp" \
     "public/image-gallery/images/${SLIDE}.webp"
   cp \
     "public/image-gallery/_test-normalized/thumbs/blur-card/${SLIDE}.webp" \
     "public/image-gallery/thumbs/${SLIDE}.webp"
   ```

   For a full refresh, copy the entire approved `blur-card` set:

   ```sh
   cp public/image-gallery/_test-normalized/images/blur-card/*.webp public/image-gallery/images/
   cp public/image-gallery/_test-normalized/thumbs/blur-card/*.webp public/image-gallery/thumbs/
   ```

   Use full refresh only when `public/image-gallery/src/` contains all current
   source images that should remain published.

2. Update `src/data/apps/gallery.ts` so each slide matches the manifest:

   - `imageId`   : numeric gallery position
   - `projectId` : matching project ID from `projects.ts`
   - `title`     : localized slide title
   - `summary`   : localized slide summary
   - `alt`       : localized image alt text

3. Update `src/data/apps/projects.ts` only when a project's representative
   gallery slide should change.

4. Keep only one `imageId` per project in `projects.ts`.

5. Allow many `gallery.ts` slides to point to the same `projectId`.

6. Remove generated test output:

   ```sh
   rm -rf public/image-gallery/_test-normalized
   ```

7. Remove obsolete runtime assets when no `gallery.ts` slide references them.
   Runtime `images/` and `thumbs/` should contain only published gallery slide
   pairs.

8. Run validation:

   ```sh
   npm run build
   ```

9. Review the Gallery app and Projects app manually.

## Manual Review Checklist

Before committing gallery changes:

- Every source file follows `<gallery-position>-<projectId>.<ext>`.
- Every `projectId` exists in `projects.ts`.
- Every generated full image is `1600x1000`.
- Every generated thumbnail is `360x360`.
- `blur-card` preserves important UI details.
- Thumbnails are recognizable enough for filmstrip navigation.
- The manifest order matches intended gallery order.
- `gallery.ts` has one slide per published image.
- `projects.ts` has only one representative `imageId` per project.
- Runtime `images/` and `thumbs/` contain only published slide pairs.
- `public/image-gallery/_test-normalized/` is removed before commit.
- The selected project card opens the intended representative slide.
- Each gallery slide's Project Info button returns to the right project.

Useful checks:

```sh
file public/image-gallery/images/*.webp
file public/image-gallery/thumbs/*.webp
npm run build
```

## Future Maintenance Notes

Keep the image-generation workflow deterministic. Prefer Sharp transforms for
screenshots because they preserve the actual product evidence.

Keep `scripts/generate-gallery-test-images.mjs` under version control. It is
the reusable generator for future gallery additions.

Use generated imagery only when the asset is an illustration, texture, or
non-evidentiary visual. Do not use AI-generated backgrounds for product or UI
screenshots unless the goal explicitly changes.

If the gallery design changes its runtime aspect ratio, update these together:

- `scripts/generate-gallery-test-images.mjs`
- `src/data/apps/gallery.ts` image dimensions
- `public/image-gallery/images/`
- `public/image-gallery/thumbs/`
- this document

<!-- #endregion Publishing -->
