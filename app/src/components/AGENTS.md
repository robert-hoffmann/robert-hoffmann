# Components Guide

This file applies to `app/src/components/` and its descendants.

## Contract

Components are Vue UI and integration surfaces. Keep product facts, project
records, global copy, registry metadata, and generated canonical content in
their owning data or generator files.

Use this guide as a local boundary map. Before changing behavior, inspect the
component, its composables, registry entry, data source, and CSS owner.

## Boundaries

- Shared state, browser services, media transports, drag/resize logic, and
  persistence belong in `../composables/`, not duplicated inside components.
- App/window additions start in `../data/registry.ts`; components consume the
  registry contract rather than inventing separate launch metadata.
- Keep desktop and mobile shell behavior separate unless the shared contract is
  intentional and typed.
- Preserve registry-driven lazy loading and async component resolution in
  window surfaces.
- Preserve `data-mobile-swipe-lock` on interactive mobile content that should
  not be closed by shell swipe gestures.
- Clean up timers, listeners, observers, animation frames, media players, and
  external runtimes in lifecycle hooks.

## Styling

- Use scoped SFC styles for component-local UI.
- Use `../assets/css/` for shell-wide, token, reset, desktop, mobile, or shared
  global styling.
- Do not move app content or localized copy into component styles or templates
  when it belongs in `../data/`.

## Maintenance

Keep this guide small. Update it when component ownership, shell boundaries, or
registry-driven loading behavior changes; do not turn it into a component
inventory.
