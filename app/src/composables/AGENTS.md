# Composables Guide

This file applies to `app/src/composables/`.

## Contract

Composables own reusable Vue state, browser integration, media transports,
persistence, drag/resize behavior, terminal logic, and cross-app navigation.
They should expose typed behavior that components can consume without
duplicating state or browser-side services.

Before changing a composable contract, inspect the relevant files in
`../types/`, `../data/registry.ts`, and `../constants/`.

## Boundaries

- Keep window lifecycle, geometry, z-index, focus, minimize, maximize, and
  persistence rules centralized in `useWindowManager`.
- Keep versioned local storage behavior centralized through
  `usePortfolioState`; do not add compatibility or fallback layers without
  asking first.
- Keep media transports aligned with `../types/media.ts` and their owning
  player components.
- Keep cross-app navigation on the existing custom-event boundary unless the
  app deliberately changes navigation architecture.
- Clean up listeners, timers, animation frames, observers, audio nodes,
  external players, and pointer captures.

## Anti-Patterns

- Do not duplicate shared shell state inside components.
- Do not bypass typed contracts with ad hoc object shapes.
- Do not add barrel files, broad helper layers, or compatibility shims only for
  convenience.

## Maintenance

Update this guide when shared runtime state ownership, persistence format, media
transport contracts, or cross-app navigation boundaries change.
