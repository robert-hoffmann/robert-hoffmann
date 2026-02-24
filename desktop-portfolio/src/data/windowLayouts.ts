/* ============================================================
   Startup Window Layout Profiles — 2D viewport band selection
   ============================================================
   Uses raw viewport size (w + h) to classify the screen into
   width/height bands, then maps those bands into one of three
   canonical startup layout profiles.
   ============================================================ */

import type { WindowSize } from '../types/desktop'

export type ViewportWidthBand = 'narrow' | 'medium' | 'wide'
export type ViewportHeightBand = 'short' | 'medium' | 'tall'
export type CanonicalStartupProfileId = 'small' | 'medium' | 'large'

export interface StartupLayoutBands {
  widthBand  : ViewportWidthBand
  heightBand : ViewportHeightBand
}

export interface StartupWindowLayout {
  itemId  : string
  x       : number
  y       : number
  zIndex  : number
  size?   : Partial<WindowSize>
}

interface ViewportSize {
  w : number
  h : number
}

/*
 * Viewport thresholds (raw viewport, not work area):
 * - Width bands are tuned to keep 1920x1080-class desktops in `medium`
 * - Height bands are tuned around 768/900/1080/1440 desktop classes
 *
 * The window manager still clamps final geometry to the WORK AREA
 * (below the top bar and above the dock for maximize).
 */
const WIDTH_NARROW_MAX_EXCLUSIVE = 1450
const WIDTH_WIDE_MIN_INCLUSIVE   = 2100
const HEIGHT_SHORT_MAX_EXCLUSIVE = 860
const HEIGHT_TALL_MIN_INCLUSIVE  = 1200

const STARTUP_PROFILE_MATRIX: Record<
  ViewportHeightBand,
  Record<ViewportWidthBand, CanonicalStartupProfileId>
> = {
  short : {
    narrow : 'small',
    medium : 'small',
    wide   : 'small',
  },
  medium : {
    narrow : 'small',
    medium : 'medium',
    wide   : 'medium',
  },
  tall : {
    narrow : 'medium',
    medium : 'large',
    wide   : 'large',
  },
}

const STARTUP_LAYOUTS: Record<CanonicalStartupProfileId, StartupWindowLayout[]> = {
  /*
   * `small` targets short-height desktop viewport classes.
   * Typical desktop classes this bucket is tuned for:
   * - 1366x768
   * - 1440x900
   * - 1536x864
   * - 1600x900
   *
   * Selection is based on RAW VIEWPORT size.
   * Final geometry still goes through window-manager clamping, so windows
   * remain constrained to the actual desktop work area as needed.
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
   * `medium` targets 1080p-class desktop viewports.
   * Typical desktop class this bucket is tuned for:
   * - 1920x1080
   *
   * This is the main "standard desktop" tuning set for most users.
   */
  medium : [
    { itemId : 'projects', x : 110,  y : 82,  zIndex : 100 },
    { itemId : 'about',    x : 540,  y : 40,  zIndex : 101 },
    { itemId : 'video',    x : 890,  y : 410, zIndex : 102 },
    { itemId : 'music',    x : 710,  y : 650, zIndex : 103 },
    { itemId : 'resume',   x : 1260, y : 64,  zIndex : 104 },
  ],
  /*
   * `large` targets 1440p+ and ultrawide/tall desktop viewports.
   * Typical desktop classes this bucket is tuned for:
   * - 2560x1440
   * - larger ultrawide desktops (depending on browser window size)
   *
   * This bucket is for roomier compositions with wider spacing.
   */
  large : [
    { itemId : 'projects', x : 150,  y : 90,  zIndex : 100 },
    { itemId : 'about',    x : 558,  y : 37,  zIndex : 101 },
    { itemId : 'video',    x : 886,  y : 403, zIndex : 102 },
    { itemId : 'music',    x : 721,  y : 650, zIndex : 103 },
    { itemId : 'resume',   x : 1433, y : 69,  zIndex : 104 },
  ],
}

export function classifyStartupBands(viewport: ViewportSize): StartupLayoutBands {
  const widthBand: ViewportWidthBand =
    viewport.w >= WIDTH_WIDE_MIN_INCLUSIVE
      ? 'wide'
      : viewport.w >= WIDTH_NARROW_MAX_EXCLUSIVE
        ? 'medium'
        : 'narrow'

  const heightBand: ViewportHeightBand =
    viewport.h >= HEIGHT_TALL_MIN_INCLUSIVE
      ? 'tall'
      : viewport.h >= HEIGHT_SHORT_MAX_EXCLUSIVE
        ? 'medium'
        : 'short'

  return { widthBand, heightBand }
}

export function resolveStartupProfileId(bands: StartupLayoutBands): CanonicalStartupProfileId {
  return STARTUP_PROFILE_MATRIX[bands.heightBand][bands.widthBand]
}

export function getStartupWindowLayoutsForViewport(viewport: ViewportSize): StartupWindowLayout[] {
  const bands = classifyStartupBands(viewport)
  const profile = resolveStartupProfileId(bands)

  return STARTUP_LAYOUTS[profile].map(layout => ({
    ...layout,
    ...(layout.size ? { size : { ...layout.size } } : {}),
  }))
}
