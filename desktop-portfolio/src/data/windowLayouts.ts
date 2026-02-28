/* ============================================================
   Startup Window Layout Profiles — Width-only desktop selection
   ============================================================
   Uses raw viewport width to classify the screen into one of
   three canonical startup layout profiles (`small`, `medium`,
   `large`).

   Height is intentionally ignored here. The window manager still
   clamps final geometry against the desktop work area, so startup
   layouts remain usable on short/tall viewport variants.
   ============================================================ */

import type { WindowSize } from '../types/desktop'

export type CanonicalStartupProfileId = 'small' | 'medium' | 'large'

export interface StartupWindowLayout {
  itemId  : string
  x       : number
  y       : number
  zIndex  : number
  size?   : Partial<WindowSize>
}

interface ViewportSize {
  w : number
}

/*
 * Viewport thresholds (raw viewport width, not work area):
 * - `small`  : widths below 1440 (1280/1366 classes)
 * - `medium` : widths from 1440 through 1920 (1440/1536/1600/1920 classes)
 * - `large`  : widths above 1920 (2560+ classes; ultrawide falls into this
 *              bucket by design and may show extra side breathing room)
 *
 * The window manager still clamps final geometry to the WORK AREA.
 */
const WIDTH_SMALL_MAX_EXCLUSIVE = 1440
const WIDTH_LARGE_MIN_EXCLUSIVE = 1920

const STARTUP_LAYOUTS: Record<CanonicalStartupProfileId, StartupWindowLayout[]> = {
  /*
   * `small` targets compact 16:9 desktop classes.
   * Typical desktop classes this bucket is tuned for:
   * - 1280x720
   * - 1366x768
   *
   * Final geometry still goes through window-manager clamping.
   * We override sizes only where needed; other windows inherit registry defaults.
   */
  small : [
    {
      itemId : 'projects',
      x      : 40,
      y      : 58,
      zIndex : 100,
      size   : { w : 440, h : 560 },
    },
    {
      itemId : 'about',
      x      : 498,
      y      : 42,
      zIndex : 101,
      size   : { w : 455, h : 610 },
    },
    {
      itemId : 'video',
      x      : 724,
      y      : 392,
      zIndex : 102,
      size   : { w : 386, h : 274 },
    },
    {
      itemId : 'music',
      x      : 470,
      y      : 500,
      zIndex : 103,
    },
    {
      itemId : 'resume',
      x      : 840,
      y      : 56,
      zIndex : 104,
      size   : { w : 480, h : 612 },
    },
  ],
  /*
   * `medium` targets mainstream 16:9 desktop classes.
   * Typical classes this bucket is tuned for:
   * - 1440x810 / 1440x900
   * - 1536x864
   * - 1600x900
   * - 1920x1080
   */
  medium : [
    { itemId : 'projects', x : 110,  y : 82,  zIndex : 100 },
    { itemId : 'about',    x : 540,  y : 40,  zIndex : 101 },
    { itemId : 'video',    x : 890,  y : 410, zIndex : 102 },
    { itemId : 'music',    x : 710,  y : 650, zIndex : 103 },
    { itemId : 'resume',   x : 1260, y : 64,  zIndex : 104 },
  ],
  /*
   * `large` targets roomy desktop classes.
   * Typical desktop classes this bucket is tuned for:
   * - 2560x1440
   * - larger widths (including ultrawide fallback)
   */
  large : [
    { itemId : 'projects', x : 150,  y : 90,  zIndex : 100 },
    { itemId : 'about',    x : 558,  y : 37,  zIndex : 101 },
    { itemId : 'video',    x : 886,  y : 403, zIndex : 102 },
    { itemId : 'music',    x : 721,  y : 650, zIndex : 103 },
    { itemId : 'resume',   x : 1433, y : 69,  zIndex : 104 },
  ],
}

export function resolveStartupProfileIdForWidth(viewportWidth: number): CanonicalStartupProfileId {
  const width = Math.max(1, viewportWidth)
  if (width > WIDTH_LARGE_MIN_EXCLUSIVE) return 'large'
  if (width >= WIDTH_SMALL_MAX_EXCLUSIVE) return 'medium'
  return 'small'
}

export function getStartupWindowLayoutsForViewport(viewport: ViewportSize): StartupWindowLayout[] {
  const profile = resolveStartupProfileIdForWidth(viewport.w)

  return STARTUP_LAYOUTS[profile].map(layout => ({
    ...layout,
    ...(layout.size ? { size : { ...layout.size } } : {}),
  }))
}
