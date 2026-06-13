# App Source Guide

This file applies to `app/src/` and its descendants.

## Contract

Use this guide as a routing aid before opening implementation files. It is not
source truth. After choosing likely files from this map, inspect the actual
source, types, data, and styles before changing behavior.

This guide intentionally maps folders plus key entry files. Do not turn it into
a full file inventory unless the project explicitly chooses that maintenance
cost.

## First-Read Order

For non-trivial work in `app/src/`:

1. Read the repository root `AGENTS.md`.
2. Read `app/AGENTS.md`.
3. Read this `app/src/AGENTS.md`.
4. Read a deeper `AGENTS.md` when the owning folder provides one.
5. Identify the owning folder and key files below.
6. Search nearby source with `rg` before editing.
7. Inspect relevant data, types, styles, and tests if present before changing
   behavior.

## Folder TOC

- `./`                  : Vue app entry surface. `main.ts` mounts the app and
  imports global CSS; `App.vue` chooses the eager mobile shell or lazy desktop
  shell.
- `assets/`            : source-owned frontend assets area. Currently keeps
  CSS under `assets/css/`; runtime public media belongs in `app/public/`.
- `assets/css/`        : Tailwind v4 CSS-first entrypoint, design tokens,
  base styles, desktop shell styles, and mobile shell styles.
- `components/`        : Vue SFCs for app shells, desktop windows, desktop
  chrome, app content, media UI, gallery UI, notifications, and background
  surfaces.
- `components/mobile/` : mobile-only shell pieces: app surface, dock, header,
  home grid, toast stack, window frame, and mobile media wrapper.
- `composables/`       : shared Vue state and browser behavior: window
  management, mobile shell state, locale/theme, persistence, drag/resize,
  media transports, gallery helpers, terminal logic, and cross-app navigation.
- `constants/`         : shared constants that are not app content, including
  notification timings and portfolio state storage keys.
- `data/`              : typed app registry, interface messages, startup
  layouts, media presets, poster sources, desktop profiles, and icon/grid
  data.
- `data/apps/`         : app-specific content and message catalogs: about,
  gallery, GeoWars, music, projects, resume, terminal, and video.
- `data/docs/`         : document assembly data derived from app content,
  currently the CV data model used by document generation.
- `data/portfolio/`    : canonical retrieval contracts, source refs, route
  manifest, route HTML/SEO builders, generated artifact builders, and content
  validation helpers derived from app data.
- `modules/`           : non-Vue runtime modules, currently the Three.js
  GeoWars engine.
- `types/`             : shared TypeScript contracts for desktop/window state,
  media transports, parallax configuration, and YouTube globals.
- `utils/`             : generic utility helpers and public asset URL helpers.

## Key Files

- App entry/shell      : `main.ts`, `App.vue`, `components/DesktopShell.vue`,
  `components/MobileApp.vue`, `components/CanonicalPage.vue`.
- App registry         : `data/registry.ts`.
- Desktop state        : `composables/useWindowManager.ts`,
  `composables/useDesktopIcons.ts`.
- Mobile state         : `composables/useMobileShell.ts`.
- State persistence    : `constants/portfolioState.ts`,
  `composables/usePortfolioState.ts`.
- Cross-app navigation : `composables/usePortfolioNavigation.ts`.
- Global copy/i18n     : `data/interface.ts`, `composables/useLocale.ts`.
- Portfolio content    : `data/apps/projects.ts`, `data/apps/gallery.ts`,
  `data/apps/resume.ts`, `data/docs/cv.ts`, `data/portfolio/`.
- Media system         : `components/UnifiedMediaPlayer.vue`,
  `composables/useAudioMediaTransport.ts`,
  `composables/useYouTubePlaylistTransport.ts`,
  `data/mediaPlayerPresets.ts`.
- Styling system       : `assets/css/main.css`, `assets/css/components.css`,
  `assets/css/mobile.css`.
- Game system          : `components/GeoWarsApp.vue`, `modules/geowars.ts`.

## Common Change Routes

- Add or change an app/window : start with `data/registry.ts`, then the owning
  component in `components/`, app copy in `data/apps/`, and shared contracts in
  `types/desktop.ts` if the registry shape changes.
- Change desktop behavior     : start with `components/DesktopShell.vue`,
  `composables/useWindowManager.ts`, `composables/useDesktopIcons.ts`, and the
  desktop styles in `assets/css/components.css`.
- Change mobile behavior      : start with `components/MobileApp.vue`,
  `components/mobile/`, `composables/useMobileShell.ts`, and
  `assets/css/mobile.css`.
- Change portfolio content    : start with the relevant `data/apps/` file.
  Use `data/docs/cv.ts` when the same content is reused for generated CV data.
- Change copy or locale text  : start with `data/interface.ts` for global UI
  strings or the relevant `data/apps/` message catalog for app-specific text.
- Change gallery/projects     : start with `data/apps/projects.ts`,
  `data/apps/gallery.ts`, `components/ProjectsApp.vue`,
  `components/ImageViewerApp.vue`, and `components/ImageViewerLightbox.vue`.
- Change canonical routes     : start with `data/apps/projects.ts`,
  `data/portfolio/projectRoutes.ts`, `data/portfolio/canonical.ts`,
  `components/CanonicalPage.vue`, and `../../prerender.ts`.
- Change media playback       : start with `components/UnifiedMediaPlayer.vue`,
  the media transport composable, `types/media.ts`, and
  `data/mediaPlayerPresets.ts`.
- Change styling or tokens    : start with `assets/css/main.css` for tokens and
  base rules, `assets/css/components.css` for desktop components, or
  `assets/css/mobile.css` for mobile-specific layout and overrides.
- Change GeoWars              : start with `components/GeoWarsApp.vue` for Vue
  integration and `modules/geowars.ts` for Three.js game runtime behavior.

## Maintenance

Keep this TOC up to date in the same change whenever files or folders under
`app/src/` are created, deleted, moved, renamed, or take on a new
responsibility.

When updating this guide, keep it as navigation guidance. Prefer folder roles,
ownership boundaries, and key start files over exhaustive inventories.
