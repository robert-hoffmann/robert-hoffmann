/* ============================================================
   Startup Icon Layout Profiles — Separate Desktop Icon Defaults
   ============================================================
   Uses the same width-only startup profile selection as window
   layouts, while keeping icon-grid defaults in a dedicated module
   for clean separation of responsibilities.
   ============================================================ */

import type { DesktopItem } from '../types/desktop'
import {
  resolveStartupProfileIdForWidth,
  type CanonicalStartupProfileId,
} from './windowLayouts'

export interface StartupIconLayout {
  itemId : string
  col    : number
  row    : number
}

interface ViewportSize {
  w : number
}

/*
 * Initial icon profiles mirror current registry defaults.
 * Keep these separate from the registry so each desktop profile
 * can evolve independently without changing canonical metadata.
 *
 * These use the SAME width-only profile mapping as `windowLayouts.ts`:
 * - `small`  : widths below 1440
 * - `medium` : widths from 1440 through 1920
 * - `large`  : widths above 1920
 */
const STARTUP_ICON_LAYOUTS: Record<CanonicalStartupProfileId, StartupIconLayout[]> = {
  /* `small` icon grid tuning bucket (< 1440 viewport width) */
  small : [
    { itemId : 'about',    col : 1,  row : 1 },
    { itemId : 'projects', col : 1,  row : 2 },
    { itemId : 'resume',   col : 11, row : 2 },
    { itemId : 'twitter',  col : 14, row : 4 },
    { itemId : 'linkedin', col : 11, row : 5 },
    { itemId : 'github',   col : 11, row : 6 },
    { itemId : 'extras',   col : 1,  row : 5 },
    { itemId : 'music',    col : 1,  row : 8 },
    { itemId : 'video',    col : 1,  row : 7 },
    { itemId : 'terminal', col : 1,  row : 4 },
  ],
  /* `medium` icon grid tuning bucket (1440..1920 viewport width) */
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
  /* `large` icon grid tuning bucket (> 1920 viewport width) */
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
  const profile = resolveStartupProfileIdForWidth(viewport.w)

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
