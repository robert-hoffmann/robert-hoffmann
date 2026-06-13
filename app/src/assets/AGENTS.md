# Assets Guide

This file applies to `app/src/assets/` and its descendants.

## Contract

`app/src/assets/` is the source-owned frontend asset area. It currently owns
CSS only. Runtime public media belongs in `app/public/`, and source or review
media belongs under `app/design/`.

Read `app/design/AGENTS.md` before changing media source ownership or generated
asset workflows.

## CSS Ownership

- `css/main.css` owns Tailwind import order, design tokens, root/base rules,
  and global accessibility helpers.
- `css/components.css` owns desktop shell, app-window, dock, notification, and
  shared desktop component styling.
- `css/mobile.css` owns mobile shell layout and should stay scoped to mobile
  shell selectors such as `.mobile-root--shell`.

## Boundaries

- Preserve `__PUBLIC_ASSET_VERSION__` in source CSS URLs that refer to versioned
  public assets.
- Preserve reduced-motion, accessibility, and responsive behavior when changing
  global or shell styles.
- Do not add runtime media, generated images, fonts, or document artifacts
  here; use the existing `public/`, `design/`, and script-owned boundaries.

## Maintenance

Keep this guide focused on CSS and source-asset ownership. Do not add selector
inventories or duplicate the media workflow guides.
