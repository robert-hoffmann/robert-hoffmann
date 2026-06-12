/* ============================================================
   Startup Icon Layout Profiles - Separate Desktop Icon Defaults
   ============================================================
   Uses the same desktop-size startup profile selection as window
   layouts, while keeping icon-grid defaults in a dedicated module
   for clean separation of responsibilities.
   ============================================================ */

import type { DesktopItem } from '../types/desktop'
import {
  resolveStartupProfileIdForUsableArea,
  type CanonicalStartupProfileId,
} from './desktopProfiles'
import type { DesktopLayoutSize } from './desktopGrid'

export interface StartupIconLayout {
  itemId : string
  col    : number
  row    : number
}

/*
 * Initial icon profiles mirror current registry defaults.
 * Keep these separate from the registry so each desktop profile
 * can evolve independently without changing canonical metadata.
 *
 * These use the SAME usable-area profile mapping as `windowLayouts.ts`.
 */
const STARTUP_ICON_LAYOUTS: Record<CanonicalStartupProfileId, StartupIconLayout[]> = {
  /* `small` icon grid tuning bucket (compact or short desktop area) */
  small : [
    { itemId : 'about',    col : 1,  row : 1 },
    { itemId : 'projects', col : 1,  row : 2 },
    { itemId : 'resume',   col : 11, row : 2 },
    { itemId : 'twitter',  col : 12, row : 2 },
    { itemId : 'linkedin', col : 12, row : 1 },
    { itemId : 'github',   col : 12, row : 3 },
    { itemId : 'extras',   col : 1,  row : 4 },
    { itemId : 'music',    col : 11, row : 3 },
    { itemId : 'video',    col : 12, row : 4 },
    { itemId : 'terminal', col : 1,  row : 3 },
    { itemId : 'gallery',  col : 11, row : 4 },
    { itemId : 'cv-pdf',   col : 11, row : 1 },
  ],
  /* `medium` icon grid tuning bucket (medium width plus enough usable height) */
  medium : [
    { itemId : 'about',    col : 1,  row : 1 },
    { itemId : 'projects', col : 1,  row : 2 },
    { itemId : 'resume',   col : 11, row : 1 },
    { itemId : 'twitter',  col : 15, row : 3 },
    { itemId : 'linkedin', col : 14, row : 2 },
    { itemId : 'github',   col : 15, row : 2 },
    { itemId : 'extras',   col : 1,  row : 5 },
    { itemId : 'music',    col : 1,  row : 7 },
    { itemId : 'video',    col : 1,  row : 6 },
    { itemId : 'terminal', col : 1,  row : 4 },
    { itemId : 'gallery',  col : 11, row : 3 },
    { itemId : 'cv-pdf',   col : 11, row : 2 },
  ],
  /* `large` icon grid tuning bucket (large width plus roomy usable height) */
  large : [
    { itemId : 'about',    col : 1,  row : 1 },
    { itemId : 'projects', col : 1,  row : 2 },
    { itemId : 'resume',   col : 12, row : 1 },
    { itemId : 'twitter',  col : 14, row : 1 },
    { itemId : 'linkedin', col : 14, row : 2 },
    { itemId : 'github',   col : 14, row : 3 },
    { itemId : 'extras',   col : 1,  row : 5 },
    { itemId : 'music',    col : 1,  row : 7 },
    { itemId : 'video',    col : 1,  row : 6 },
    { itemId : 'terminal', col : 1,  row : 4 },
    { itemId : 'gallery',  col : 1,  row : 9 },
    { itemId : 'cv-pdf',   col : 12, row : 2 },
  ],
}

export function getStartupIconLayoutsForViewport(viewport: DesktopLayoutSize): StartupIconLayout[] {
  const profile = resolveStartupProfileIdForUsableArea(viewport)

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
