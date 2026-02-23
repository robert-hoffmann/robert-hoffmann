/* ============================================================
   Startup Window Layout Profiles — Pixel-based first-visit presets
   ============================================================ */

import type { WindowRect } from '../types/desktop'

export interface StartupWindowLayout {
  itemId : string
  rect   : WindowRect
  zIndex : number
}

type StartupLayoutProfileId = 'compact' | 'standard' | 'wide'

const STARTUP_LAYOUTS: Record<StartupLayoutProfileId, StartupWindowLayout[]> = {
  compact : [
    { itemId : 'projects', rect : { x : 56,  y : 72,  w : 469, h : 620 }, zIndex : 100 },
    { itemId : 'about',    rect : { x : 548, y : 48,  w : 497, h : 700 }, zIndex : 101 },
    { itemId : 'video',    rect : { x : 760, y : 364, w : 420, h : 320 }, zIndex : 102 },
    { itemId : 'music',    rect : { x : 640, y : 644, w : 388, h : 203 }, zIndex : 103 },
    { itemId : 'resume',   rect : { x : 1038, y : 58, w : 520, h : 680 }, zIndex : 104 },
  ],
  standard : [
    { itemId : 'projects', rect : { x : 110, y : 82,  w : 469, h : 691 }, zIndex : 100 },
    { itemId : 'about',    rect : { x : 540, y : 40,  w : 497, h : 794 }, zIndex : 101 },
    { itemId : 'video',    rect : { x : 890, y : 410, w : 466, h : 393 }, zIndex : 102 },
    { itemId : 'music',    rect : { x : 710, y : 650, w : 388, h : 203 }, zIndex : 103 },
    { itemId : 'resume',   rect : { x : 1260, y : 64, w : 546, h : 760 }, zIndex : 104 },
  ],
  wide : [
    { itemId : 'projects', rect : { x : 150,  y : 90,  w : 469, h : 691 }, zIndex : 100 },
    { itemId : 'about',    rect : { x : 558,  y : 37,  w : 497, h : 794 }, zIndex : 101 },
    { itemId : 'video',    rect : { x : 886,  y : 403, w : 466, h : 393 }, zIndex : 102 },
    { itemId : 'music',    rect : { x : 721,  y : 650, w : 388, h : 203 }, zIndex : 103 },
    { itemId : 'resume',   rect : { x : 1433, y : 69,  w : 546, h : 760 }, zIndex : 104 },
  ],
}

export function getStartupLayoutProfile(viewportWidth: number): StartupLayoutProfileId {
  if (viewportWidth >= 1920) return 'wide'
  if (viewportWidth >= 1440) return 'standard'
  return 'compact'
}

export function getStartupWindowLayouts(viewportWidth: number): StartupWindowLayout[] {
  const profile = getStartupLayoutProfile(viewportWidth)
  return STARTUP_LAYOUTS[profile].map(layout => ({
    ...layout,
    rect : { ...layout.rect },
  }))
}

