# Desktop Portfolio (macOS-Style Interactive Portfolio)

An interactive personal portfolio website that emulates a macOS-style desktop experience in the browser. It is not an operating system; it is a web app that uses desktop metaphors (windows, dock, top bar, icons) to present Robert Hoffmann's profile, projects, resume, and interactive extras.

The app includes a full desktop experience for larger screens and a dedicated mobile layout for phones, with a desktop-side mobile preview toggle for testing/demo purposes.

## What It Is

This project is Robert Hoffmann's personal portfolio built as a Vue + TypeScript single-page app with a macOS-inspired UI shell.

Instead of a traditional scrolling portfolio landing page, visitors can interact with:

- a desktop area with icons
- draggable/resizable windows for portfolio content
- a dock (doc bar) to launch and toggle apps
- a top bar with menus, clock, calendar, theme/locale/view toggles
- media apps, a terminal simulator, and a mini-game

## Key Highlights

- macOS-style desktop UI shell for portfolio navigation
- `About`, `Projects`, and `Resume` presented as desktop windows
- built-in `Terminal`, `Music`, `Video`, and `GeoWars.app` windows
- bilingual UI and content (`EN` / `FR`)
- dark/light themes with reduced-motion-aware transitions
- desktop session persistence (theme, locale, icon positions, open windows/layout)
- responsive mobile layout plus desktop-triggered mobile preview mode
- prerendered SEO-friendly content for crawlers/social previews

## Core Functionality

### Desktop Shell

- Desktop icons can be selected and dragged to reposition them.
- Windows support open/close, focus, z-index stacking, minimize, restore, and maximize.
- Resizable/movable behavior is enforced per-window via registry policies.
- Layout actions are available for tiling, cascading, minimizing all, and restoring all windows.
- The dock launches apps and toggles existing window visibility/focus.
- A desktop reset action restores default icon/window layout and theme.

### Top Bar and System UI

- Menu bar includes File/Edit/View/Help actions for opening apps and window management.
- Focused window title is shown in the top bar center.
- Live clock updates in the top bar.
- Clickable calendar popup is available from the clock.
- Theme toggle (dark/light), locale toggle (`EN`/`FR`), fullscreen toggle, and reset control are built in.
- Desktop/mobile preview toggle is available from the top bar on desktop.

### Persistence and State

- Session state is saved to `localStorage`.
- Restores theme, locale, desktop icon positions, open windows, window geometry, z-index order, and focused window.
- Persisted state uses a versioned schema and resets on incompatible changes.

### Mobile Experience

- Dedicated mobile layout renders stacked `About`, `Resume`, and `Projects` sections.
- Sticky mobile header includes locale/theme controls.
- Sticky section navigation links jump to each mobile section.
- Mobile footer includes social links and a desktop-experience teaser image.
- Desktop users can preview the mobile layout via a view-mode toggle.

### UX, Accessibility, and Interaction Details

- UI labels and messages are localized in English and French.
- ARIA labels are applied across desktop, dock, window controls, terminal input, and notifications.
- Theme transitions respect `prefers-reduced-motion`.
- Touch desktop mode adapts icon interactions for coarse pointers.
- Touch icon behavior supports tap-to-select, double-tap-to-open, and long-press drag.
- Notification toasts are delayed, dismissible, and localized.

### Performance and Loading Behavior

- Mobile app shell is lazy-loaded to keep the desktop initial bundle smaller.
- Window apps are async-loaded from a typed registry.
- Desktop wallpaper uses responsive sources with blur-up loading.
- Video player uses a lightweight poster facade before loading the YouTube IFrame API.

## Included Apps / Windows

### Portfolio Content Windows

- `About Me`
  - Profile, tagline, expertise pills, certifications, social links
  - Interactive profile photo effect with pointer-driven motion and reduced-motion fallback
- `Projects`
  - Localized project cards with summaries, highlights, stack tags, and optional external links
- `Resume`
  - Localized experience timeline with roles, employment type, location, bullets, and stack tags

### Interactive / Utility Windows

- `Terminal`
  - Fake `zsh`/`tmux`-style terminal UI
  - Command history and keyboard navigation (`ArrowUp` / `ArrowDown`)
  - Built-in commands include: `help`, `ls`, `pwd`, `whoami`, `date`, `echo`, `cat`, `top`, `neofetch`, `uptime`, `hostname`, `uname`, `history`, `clear`, `exit`, `quit`
  - Typing an app ID (for example `about`, `projects`, `music`, `video`, `terminal`) launches or focuses the corresponding app
- `Music`
  - Local MP3 playback with play/pause/stop, seek, loop, volume, mute
  - FFT-based equalizer visualization driven by Web Audio analysis
- `Video`
  - Custom YouTube playlist player UI with previous/next/play/pause/stop/seek/volume/fullscreen controls
  - Uses privacy-enhanced `youtube-nocookie.com` embed host
  - Lazy loads the YouTube API only after user interaction
- `GeoWars.app`
  - Embedded mini-game window with score/wave/lives HUD plus pause/restart controls

### External Link Icons / Entries

- `GitHub`
- `LinkedIn`
- `X` (Twitter)

These are exposed as desktop items and can also be launched from the menu bar and terminal.

## Tech Stack

- `Vue 3` (SFCs with `<script setup>`)
- `TypeScript`
- `Vite`
- `Tailwind CSS v4` (tooling integration)
- `Three.js` (used by the GeoWars mini-game module)

Supporting tooling and build features:

- `vite-prerender-plugin` for prerendered crawler/social content
- `sharp`-based image optimization and OG image generation scripts
- static-hosting-friendly build output with public assets and metadata

## Run Locally

From the `desktop-portfolio` directory:

```bash
npm install
npm run dev
```

Build and preview production output:

```bash
npm run build
npm run preview
```

Optional asset-generation scripts:

```bash
npm run optimize-images
npm run generate-og-image
```

## Project Notes / Implementation Highlights

- Prerendered HTML content for crawlers and social previews is generated via `vite-prerender-plugin` using `prerender.ts`.
- SEO metadata, Open Graph tags, Twitter card tags, and JSON-LD structured data are defined in `index.html`.
- `public/` includes PWA-style metadata and icons (`site.webmanifest`, favicons, touch icons) plus media/image assets.
- Vue mounts over prerendered content and sets a client-side hydration marker (`data-app-mounted`) after startup.
- Video playback is optimized for privacy/performance by deferring the YouTube IFrame API until first interaction and using `youtube-nocookie.com`.

## Content / Customization

If you want to adapt this portfolio for your own content, these are the main files to edit:

- `src/data/content.ts` for profile, projects, resume/experience, and content copy
- `src/data/registry.ts` for desktop items, app/window definitions, icons, and window sizing/behavior
- `src/data/translations.ts` for UI text and localization strings (`EN` / `FR`)

Useful supporting files:

- `src/App.vue` for desktop/mobile shell composition and top-level interactions
- `src/components/` for individual apps/windows and shell components
- `CHANGELOG.md` for release history

## Versioning / Changelog

Release history for this app is tracked in `CHANGELOG.md`.

The package version is maintained in `package.json`; the README intentionally avoids hardcoding a fixed version number so it stays accurate as releases continue.
