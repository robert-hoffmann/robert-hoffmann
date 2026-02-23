/* ============================================================
   Startup Window Layout Profiles — 2D work-area band selection
   ============================================================
   Uses usable desktop work area (w + h) to classify a viewport
   into width/height bands, then maps those bands into one of
   three canonical startup layout profiles.
   ============================================================ */

import type { WindowSize } from '../types/desktop'

export type WorkAreaWidthBand = 'narrow' | 'medium' | 'wide'
export type WorkAreaHeightBand = 'short' | 'medium' | 'tall'
export type CanonicalStartupProfileId = 'compact' | 'standard' | 'wide'

export interface StartupLayoutBands {
  widthBand  : WorkAreaWidthBand
  heightBand : WorkAreaHeightBand
}

export interface StartupWindowLayout {
  itemId  : string
  x       : number
  y       : number
  zIndex  : number
  size?   : Partial<WindowSize>
}

interface WorkAreaSize {
  w : number
  h : number
}

/*
 * Work-area thresholds (not raw viewport):
 * - Width bands are tuned to keep 1920x1080-class desktops in `medium`
 * - Height bands are tuned around 768/900/1080/1440 desktop classes
 */
const WIDTH_NARROW_MAX_EXCLUSIVE = 1450
const WIDTH_WIDE_MIN_INCLUSIVE   = 2100
const HEIGHT_SHORT_MAX_EXCLUSIVE = 860
const HEIGHT_TALL_MIN_INCLUSIVE  = 1200

const STARTUP_PROFILE_MATRIX: Record<
  WorkAreaHeightBand,
  Record<WorkAreaWidthBand, CanonicalStartupProfileId>
> = {
  short : {
    narrow : 'compact',
    medium : 'compact',
    wide   : 'compact',
  },
  medium : {
    narrow : 'compact',
    medium : 'standard',
    wide   : 'standard',
  },
  tall : {
    narrow : 'standard',
    medium : 'wide',
    wide   : 'wide',
  },
}

const STARTUP_LAYOUTS: Record<CanonicalStartupProfileId, StartupWindowLayout[]> = {
  /*
   * Compact is tuned for short-height desktop work areas (768/864/900 class).
   * We override sizes only where needed; other windows inherit registry defaults.
   */
  compact : [
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
  standard : [
    { itemId : 'projects', x : 110,  y : 82,  zIndex : 100 },
    { itemId : 'about',    x : 540,  y : 40,  zIndex : 101 },
    { itemId : 'video',    x : 890,  y : 410, zIndex : 102 },
    { itemId : 'music',    x : 710,  y : 650, zIndex : 103 },
    { itemId : 'resume',   x : 1260, y : 64,  zIndex : 104 },
  ],
  wide : [
    { itemId : 'projects', x : 150,  y : 90,  zIndex : 100 },
    { itemId : 'about',    x : 558,  y : 37,  zIndex : 101 },
    { itemId : 'video',    x : 886,  y : 403, zIndex : 102 },
    { itemId : 'music',    x : 721,  y : 650, zIndex : 103 },
    { itemId : 'resume',   x : 1433, y : 69,  zIndex : 104 },
  ],
}

export function classifyStartupBands(workArea: WorkAreaSize): StartupLayoutBands {
  const widthBand: WorkAreaWidthBand =
    workArea.w >= WIDTH_WIDE_MIN_INCLUSIVE
      ? 'wide'
      : workArea.w >= WIDTH_NARROW_MAX_EXCLUSIVE
        ? 'medium'
        : 'narrow'

  const heightBand: WorkAreaHeightBand =
    workArea.h >= HEIGHT_TALL_MIN_INCLUSIVE
      ? 'tall'
      : workArea.h >= HEIGHT_SHORT_MAX_EXCLUSIVE
        ? 'medium'
        : 'short'

  return { widthBand, heightBand }
}

export function resolveStartupProfileId(bands: StartupLayoutBands): CanonicalStartupProfileId {
  return STARTUP_PROFILE_MATRIX[bands.heightBand][bands.widthBand]
}

export function getStartupWindowLayoutsForWorkArea(workArea: WorkAreaSize): StartupWindowLayout[] {
  const bands = classifyStartupBands(workArea)
  const profile = resolveStartupProfileId(bands)

  return STARTUP_LAYOUTS[profile].map(layout => ({
    ...layout,
    ...(layout.size ? { size : { ...layout.size } } : {}),
  }))
}

