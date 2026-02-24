/* ============================================================
   Startup Icon Layout Profiles — Separate Desktop Icon Defaults
   ============================================================
   Uses the same viewport band classification as window layouts,
   but keeps icon-grid defaults in a dedicated module for clean
   separation of responsibilities.
   ============================================================ */

import type { DesktopItem } from '../types/desktop'
import {
  classifyStartupBands,
  resolveStartupProfileId,
  type CanonicalStartupProfileId,
} from './windowLayouts'

export interface StartupIconLayout {
  itemId : string
  col    : number
  row    : number
}

interface ViewportSize {
  w : number
  h : number
}

/*
 * Initial icon profiles mirror current registry defaults.
 * Keep these separate from the registry so each desktop profile
 * can evolve independently without changing canonical metadata.
 *
 * These use the SAME profile mapping as `windowLayouts.ts`:
 * - `small`  : short-height/tighter desktop viewports (1366x768, 1440x900,
 *              1536x864, 1600x900 classes)
 * - `medium` : 1080p-class desktop viewports (1920x1080 class)
 * - `large`  : 1440p+ / ultrawide desktop viewports (2560x1440+ classes)
 */
const STARTUP_ICON_LAYOUTS: Record<CanonicalStartupProfileId, StartupIconLayout[]> = {
  /* `small` icon grid tuning bucket (short-height / tighter desktop classes) */
  small : [
    { itemId : 'about',    col : 1,  row : 1 },
    { itemId : 'projects', col : 1,  row : 2 },
    { itemId : 'resume',   col : 14, row : 2 },
    { itemId : 'twitter',  col : 14, row : 4 },
    { itemId : 'linkedin', col : 14, row : 5 },
    { itemId : 'github',   col : 14, row : 6 },
    { itemId : 'extras',   col : 1,  row : 5 },
    { itemId : 'music',    col : 1,  row : 8 },
    { itemId : 'video',    col : 1,  row : 7 },
    { itemId : 'terminal', col : 1,  row : 4 },
  ],
  /* `medium` icon grid tuning bucket (1920x1080-class desktops) */
  medium : [
    { itemId : 'about',    col : 1,  row : 1 },
    { itemId : 'projects', col : 1,  row : 2 },
    { itemId : 'resume',   col : 14, row : 2 },
    { itemId : 'twitter',  col : 14, row : 4 },
    { itemId : 'linkedin', col : 14, row : 5 },
    { itemId : 'github',   col : 14, row : 6 },
    { itemId : 'extras',   col : 1,  row : 5 },
    { itemId : 'music',    col : 1,  row : 8 },
    { itemId : 'video',    col : 1,  row : 7 },
    { itemId : 'terminal', col : 1,  row : 4 },
  ],
  /* `large` icon grid tuning bucket (1440p+ / ultrawide desktop classes) */
  large : [
    { itemId : 'about',    col : 1,  row : 1 },
    { itemId : 'projects', col : 1,  row : 2 },
    { itemId : 'resume',   col : 14, row : 2 },
    { itemId : 'twitter',  col : 14, row : 4 },
    { itemId : 'linkedin', col : 14, row : 5 },
    { itemId : 'github',   col : 14, row : 6 },
    { itemId : 'extras',   col : 1,  row : 5 },
    { itemId : 'music',    col : 1,  row : 8 },
    { itemId : 'video',    col : 1,  row : 7 },
    { itemId : 'terminal', col : 1,  row : 4 },
  ],
}

export function getStartupIconLayoutsForViewport(viewport: ViewportSize): StartupIconLayout[] {
  const bands = classifyStartupBands(viewport)
  const profile = resolveStartupProfileId(bands)

  return STARTUP_ICON_LAYOUTS[profile].map(layout => ({ ...layout }))
}

export function applyStartupIconLayout(
  items   : DesktopItem[],
  layout  : StartupIconLayout[],
): DesktopItem[] {
  const byId = new Map(layout.map(entry => [entry.itemId, entry] as const))
  return items.map(item => {
    const override = byId.get(item.id)
    if (!override) return { ...item }
    return {
      ...item,
      col : override.col,
      row : override.row,
    }
  })
}
