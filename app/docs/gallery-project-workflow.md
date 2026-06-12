# Gallery And Project Image Workflow

This document explains how the Projects app, Gallery app, and gallery image
assets work together, and how to regenerate standardized gallery images from
source screenshots.

All paths below are relative to the app package root, which is `app/` from the
repository root.

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
stack data, optional links, and optionally one `galleryImageId`.

The `galleryImageId` in `projects.ts` is the representative slide opened from
the project card. It should point to the best gallery slide for that project.

`gallery.ts` owns gallery slide content and display order. Each slide has a
stable `galleryImageId`, a `projectId`, localized title/summary/alt text,
image metadata, thumbnail metadata, and any slide-level presentation data.

The `projectId` in `gallery.ts` must match an `id` from `projects.ts`.
Multiple gallery slides may share the same `projectId`.

Example relationship:

```text
projects.ts
  proj-chatapp -> galleryImageId proj-chatapp-1

gallery.ts
  galleryImageDisplayOrder -> proj-chatapp-1, proj-chatapp-2, ...
  proj-chatapp-1 -> projectId proj-chatapp
  proj-chatapp-2 -> projectId proj-chatapp
  proj-chatapp-3 -> projectId proj-chatapp
```

This means:

- Projects -> Gallery opens one representative slide.
- Gallery  -> Projects always opens the matching project card.
- Gallery can show multiple screenshots for one project without duplicating
  project cards.
- Gallery order is controlled by `galleryImageDisplayOrder`, not by file names.

### Navigation Flow

Projects to Gallery:

1. `ProjectsApp.vue` renders an image button only when a project has
   `galleryImageId`.
2. The click handler calls `showGalleryImage(galleryImageId)`.
3. `usePortfolioNavigation.ts` stores `galleryImageRequest` and dispatches the
   `portfolio:open-app` event with `itemId: 'gallery'`.
4. The desktop/mobile shell opens or focuses the Gallery app.
5. `ImageViewerApp.vue` consumes the request, finds the slide by
   `galleryImageId`, and scrolls/selects it.

Gallery to Projects:

1. `ImageViewerApp.vue` calls `showProjectInfo(activeSlide.projectId)` from the
   Project Info button.
2. `usePortfolioNavigation.ts` stores `projectInfoRequest` and dispatches the
   `portfolio:open-app` event with `itemId: 'projects'`.
3. The desktop/mobile shell opens or focuses the Projects app.
4. `ProjectsApp.vue` consumes the request, scrolls to the project element, and
   highlights it briefly.

The event opens/focuses the target app. The reactive request lets the target
component consume the requested `galleryImageId` or `projectId`, including when
the component mounts after the event is dispatched.

## Asset Contract

Runtime gallery assets live in:

```text
public/image-gallery/images/
public/image-gallery/previews/
public/image-gallery/thumbs/
```

Runtime file names match the stable `galleryImageId`:

```text
public/image-gallery/images/proj-chatapp-1.webp
public/image-gallery/thumbs/proj-chatapp-1.webp
```

`gallery.ts` derives these URLs from `galleryImageId`:

```text
galleryImageId proj-chatapp-1
  -> images/proj-chatapp-1.webp and thumbs/proj-chatapp-1.webp
```

Current runtime dimensions:

- Full image : `1600x1000`
- Thumbnail  : `360x360`

Do not publish a full image without the matching thumbnail. Do not publish
either asset without a matching `gallery.ts` slide.

## Source Image Contract

Raw/final source screenshots live in:

```text
design/gallery/
```

Use this naming convention:

```text
<projectId>-<local-image-number>.<ext>
```

Examples:

```text
proj-chatapp-1.jpg
proj-chatapp-2.jpg
proj-desktop-portfolio-1.png
```

Rules:

- `projectId` must match a project `id` in `projects.ts`.
- `local-image-number` is a stable project-scoped suffix, not the gallery
  display order.
- Several files may use the same `projectId`.
- The extension may be `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`.
- Source images may have mixed dimensions and aspect ratios.
- Keep source images in this directory after publishing. They are the reusable
  inputs for future regeneration.
- Reorder the gallery by editing `galleryImageDisplayOrder`; do not rename
  assets just to move prettier or more representative images earlier.

## Adding Or Replacing A Source Image

To add a new gallery slide:

1. Pick the next available `local-image-number` for that `projectId`.
2. Save the screenshot as
   `design/gallery/<projectId>-<local-image-number>.<ext>`.
3. Run the test generator.
4. Review the generated `blur-card` result.
5. Run `npm run optimize-images` to publish runtime images, thumbnails, and
   previews into `public/image-gallery/`.
6. Add one matching `gallery.ts` content entry and include its ID in
   `galleryImageDisplayOrder`.
7. Update `projects.ts` only when this new slide should become the project's
   representative image.

To replace an existing slide:

1. Keep the same `galleryImageId` in the source file name.
2. Replace the source screenshot in `design/gallery/`.
3. Run `npm run optimize-images` to regenerate the same runtime image,
   thumbnail, and preview.
4. Update `gallery.ts` copy only when the title, summary, alt text, or project
   relationship changed.

Do not add a `galleryImageId` to a project just because a gallery slide exists
for that project. `projects.ts` should expose only the best representative
slide for that project card.

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
cd app
npm run gallery:generate-test
```

If already in the app package root, run only `npm run gallery:generate-test`.

This command runs `scripts/generate-gallery-test-images.mjs`.

The generator reads:

```text
design/gallery/
```

It writes only to:

```text
design/gallery/_test-normalized/
```

Generated test folders:

```text
design/gallery/_test-normalized/images/blur-card/
design/gallery/_test-normalized/images/clean-card/
design/gallery/_test-normalized/images/cover-crop/
design/gallery/_test-normalized/thumbs/blur-card/
design/gallery/_test-normalized/thumbs/clean-card/
design/gallery/_test-normalized/thumbs/cover-crop/
```

Generated support files:

```text
design/gallery/_test-normalized/index.html
design/gallery/_test-normalized/manifest.json
```

Review `index.html` in a browser or inspect individual WebP files. The test
script intentionally leaves runtime `images/` and `thumbs/` untouched.
Generated test output is temporary and should be removed after publishing or
reviewing.

The manifest preserves the mapping from generated output file to source ID:

```json
[
  {
    "fileName"         : "proj-chatapp-1.webp",
    "galleryImageId"   : "proj-chatapp-1",
    "localImageNumber" : 1,
    "projectId"        : "proj-chatapp",
    "sourceFile"       : "proj-chatapp-1.jpg"
  }
]
```

<!-- #endregion Normalization -->

<!-- #region Publishing -->

## Publishing Workflow

After reviewing the `blur-card` test output, publish runtime media with:

```sh
npm run optimize-images
```

The optimizer reads `design/gallery/` and regenerates:

```text
public/image-gallery/images/
public/image-gallery/previews/
public/image-gallery/thumbs/
```

1. Update `src/data/apps/gallery.ts` so each slide matches the manifest:

   - `galleryImageId` : stable project-scoped image ID
   - `projectId`      : matching project ID from `projects.ts`
   - `title`          : localized slide title
   - `summary`        : localized slide summary
   - `alt`            : localized image alt text

   Reorder gallery UX by changing `galleryImageDisplayOrder`. Do not rename
   files for display-order changes.

2. Update `src/data/apps/projects.ts` only when a project's representative
   gallery slide should change.

3. Keep only one `galleryImageId` per project in `projects.ts`.

4. Allow many `gallery.ts` slides to point to the same `projectId`.

5. Remove generated test output:

   ```sh
   rm -rf design/gallery/_test-normalized
   ```

6. Remove obsolete runtime assets when no `gallery.ts` slide references them.
   Runtime `images/` and `thumbs/` should contain only published gallery slide
   pairs.

7. Run validation:

   ```sh
   npm run build
   ```

8. Review the Gallery app and Projects app manually.

## Manual Review Checklist

Before committing gallery changes:

- Every source file follows `<projectId>-<local-image-number>.<ext>`.
- Every `projectId` exists in `projects.ts`.
- Every generated full image is `1600x1000`.
- Every generated thumbnail is `360x360`.
- `blur-card` preserves important UI details.
- Thumbnails are recognizable enough for filmstrip navigation.
- `galleryImageDisplayOrder` matches intended gallery order.
- `gallery.ts` has one slide per published image.
- `projects.ts` has only one representative `galleryImageId` per project.
- Runtime `images/` and `thumbs/` contain only published slide pairs.
- `design/gallery/_test-normalized/` is removed before commit.
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
