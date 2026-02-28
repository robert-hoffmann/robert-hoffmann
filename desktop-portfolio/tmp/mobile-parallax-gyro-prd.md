# PRD: Mobile Parallax With Gyroscope Driver

## Document Status
- Status: Draft for later execution
- Scope: Mobile shell only
- Date: 2026-02-28

## 1. Context
Desktop parallax was integrated with a dedicated background stack and LQIP-to-sharp transition. The next phase is to deliver the same visual depth on mobile, but driven by gyroscope (device orientation) instead of mouse.

This document captures:
1. What to build.
2. What mistakes to avoid (based on desktop integration issues).
3. Implementation decisions so execution is straightforward.

## 2. Goals
1. Reuse the same parallax scene/layer model across desktop and mobile.
2. On mobile, use gyroscope as the primary input driver.
3. Preserve LQIP/sharp/parallax transition quality (no blank frame, no flicker).
4. Keep reduced-motion behavior safe and deterministic.
5. Keep desktop behavior unchanged.

## 3. Non-Goals
1. Rebuilding the scene editor/export format.
2. Changing desktop interaction model.
3. Enabling AVIF runtime delivery in this phase (backlog item).
4. Reworking all image-generation pipeline logic beyond mobile requirements.

## 4. Desktop Lessons (Do Not Repeat)
1. Do not rely on pseudo-elements for critical background layering.
2. Do not use unbounded window z-index growth.
3. Do not trigger duplicate background refresh chains.
4. Do not downgrade to LQIP during breakpoint swaps after initial sharp commit.
5. Do not bind parallax behavior to unrelated components (for example About window logic).

## 5. Architecture Options (Pros / Cons)

### Option A: Separate mobile parallax component (forked logic)
- Pros:
  - Fast initial implementation.
  - Mobile-only logic can move quickly.
- Cons:
  - Divergence risk with desktop runtime.
  - Duplicate bugfix effort.

### Option B: Shared engine + input adapters (recommended)
- Pros:
  - One transform engine for both desktop and mobile.
  - Input strategy becomes pluggable (`mouse`, `gyro`, future `touch`).
  - Lower long-term maintenance.
- Cons:
  - Slightly higher upfront refactor effort.

### Option C: CSS-only motion (no runtime engine reuse)
- Pros:
  - Minimal JS.
- Cons:
  - Weak motion quality and less control.
  - Hard to match desktop scene fidelity.

## 6. Chosen Direction
Use **Option B**:
1. Keep shared scene/layer contracts.
2. Keep one animation runtime.
3. Add input driver abstraction.
4. Use gyroscope driver on mobile with fallback to pointer/touch-simulated input if unavailable or denied.

## 7. Product Behavior Requirements

### 7.1 Initial Render / Loading
1. Show LQIP immediately.
2. Commit sharp background once decoded.
3. Commit parallax only after all visible parallax layers for active bucket are preloaded.
4. On resize/bucket change, keep previous sharp/parallax visible until next bucket is ready (no flash fallback).

### 7.2 Input Priority (Mobile)
1. Preferred: gyroscope (`DeviceOrientationEvent`).
2. Fallback 1: static parallax (no live movement) if permission denied/unavailable.
3. Fallback 2 (optional): subtle pointer/touch delta if product decides.

### 7.3 Reduced Motion
1. If `prefers-reduced-motion: reduce` is active:
  - Keep LQIP -> sharp flow.
  - Disable animated parallax updates.
  - Keep stable sharp fallback visible.

## 8. Technical Design

### 8.1 Input Driver Abstraction
Create a composable-like interface:

```ts
interface ParallaxInputDriver {
  start(): void
  stop(): void
  onChange(cb: (x: number, y: number) => void): () => void
}
```

Drivers:
1. `PointerInputDriver` (desktop existing behavior).
2. `GyroInputDriver` (mobile new behavior).

Gyro normalization:
1. Map orientation angles into normalized `x/y` range `[-1, 1]`.
2. Clamp aggressively.
3. Apply low-pass smoothing to avoid jitter.
4. Invert axes only if visual direction is wrong after QA.

### 8.2 Permission Flow (iOS/Safari)
1. Add permission gate for `DeviceOrientationEvent.requestPermission()` where required.
2. Trigger permission request from explicit user gesture (for example first tap on desktop area or dedicated prompt CTA).
3. If denied:
  - Persist "denied" session state.
  - Skip repeated intrusive prompts in same session.

### 8.3 Component Reuse Strategy
1. Keep `DesktopParallaxScene.vue` as core renderer OR move to neutral `ParallaxSceneRuntime.vue` for shared usage.
2. Keep `DesktopBackgroundStack.vue` logic pattern for mobile equivalent (`MobileBackgroundStack.vue`) with same no-flash commit pattern.
3. Share helpers:
  - width bucket resolution
  - scene parsing
  - preload pipeline
  - atomic active/pending commit

### 8.4 Mobile Crop & Asset Plan
1. Keep separate mobile wallpaper fallback assets (`wallpaper-mobile-left.*`) for shell home background.
2. Add mobile parallax layer exports only if desktop crops look wrong on phone aspect ratios.
3. If mobile-specific layers are needed:
  - Use naming with clear suffix (for example `layer-bg-mobile-1280.webp`).
  - Avoid replacing desktop assets.

## 9. Public API / Type Impact (Planned)
1. No breaking change to existing desktop props.
2. Add shared driver type definitions (new file suggested):
  - `src/types/parallax-input.ts`
3. Potential non-breaking prop additions to runtime scene component:
  - `inputMode?: 'pointer' | 'gyro' | 'none'`
  - `gyroEnabled?: boolean`

## 10. Performance Targets
1. Keep composited transform-only animation updates.
2. Cap effective gyro update frequency to animation frame cadence.
3. Avoid layout-triggering writes in animation loop.
4. Keep mobile CPU/GPU usage stable on mid-tier devices.

## 11. QA / Acceptance Matrix

### Functional
1. iOS Safari: permission prompt -> motion active after allow.
2. iOS Safari: deny permission -> stable sharp fallback, no errors.
3. Android Chrome: gyro motion active without user confusion.
4. Desktop unaffected.

### Visual
1. No flash/blank frame during initial load.
2. No blur flash on bucket changes.
3. Layer ordering identical to desktop quality baseline.

### Accessibility
1. Reduced-motion disables active motion.
2. No blocking UI for denied gyro permission.

### Regression
1. Window docking/topbar interactions unaffected.
2. Mobile app surface interactions remain usable.

## 12. Risk Register
1. iOS permission friction can reduce feature adoption.
2. Gyro noise can produce nauseating jitter if smoothing/clamp are weak.
3. Device orientation differences can invert or skew axis mapping.
4. Mobile cropping mismatch can reveal layer edges.

## 13. Implementation Phases (Later)
1. **Phase 1**: Extract shared parallax runtime + input driver interfaces.
2. **Phase 2**: Implement gyro driver + permission UX.
3. **Phase 3**: Mobile background stack integration with no-flash commit.
4. **Phase 4**: Asset crop pass + QA matrix run.
5. **Phase 5**: Cleanup and docs finalization.

## 14. Public Folder Cleanup Notes (Completed in this pass)
Conservative cleanup was applied:
1. Removed unused AVIF wallpaper variants:
  - `public/wallpaper-1280.avif`
  - `public/wallpaper-1920.avif`
  - `public/wallpaper-2560.avif`
2. Removed unused AVIF desktop parallax variants:
  - `public/parallax/desktop/layer-*.avif`
3. Updated `scripts/optimize-images.mjs` so these AVIF files are no longer regenerated.

Deferred cleanup:
1. `public/wallpaper.webp` kept as build source for:
  - responsive wallpaper webp outputs
  - `wallpaper-lqip.webp`
  - `wallpaper-mobile-left.*`
2. Any move to `layer-bg-*` as the sharp fallback source is deferred until we validate visual parity against current static wallpaper fallback quality.

## 15. Open Decisions For Execution Phase
1. Permission UX surface:
  - passive "enable motion" CTA vs first-interaction prompt.
2. Fallback behavior when gyro unavailable:
  - static only vs optional subtle touch-driven fallback.
3. Whether to introduce mobile-specific parallax layer crops immediately or after first QA.
