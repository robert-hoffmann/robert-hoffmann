/* ============================================================
   Desktop Startup Profiles - Shared usable-area selection
   ============================================================ */

import {
  resolveDesktopIconGridMetrics,
  type DesktopLayoutSize,
} from './desktopGrid'

export type CanonicalStartupProfileId = 'small' | 'medium' | 'large'

/*
 * Profile contracts are based on actual usable desktop area, not raw monitor
 * dimensions. Width gives the design family; icon grid rows downgrade profiles
 * when browser chrome, scaling, topbar, or dock leave less vertical room.
 */
const WIDTH_MEDIUM_MIN_PX  = 1400
const WIDTH_LARGE_MIN_PX   = 1800
const GRID_ROWS_MEDIUM_MIN = 6
const GRID_ROWS_LARGE_MIN  = 8

function profileRank(profile: CanonicalStartupProfileId) {
  switch (profile) {
    case 'large'  : return 2
    case 'medium' : return 1
    case 'small'  : return 0
  }
}

function profileForRank(rank: number): CanonicalStartupProfileId {
  if (rank >= 2) return 'large'
  if (rank >= 1) return 'medium'
  return 'small'
}

export function resolveStartupProfileIdForWidth(usableWidth: number): CanonicalStartupProfileId {
  const width = Math.max(1, usableWidth)
  if (width >= WIDTH_LARGE_MIN_PX) return 'large'
  if (width >= WIDTH_MEDIUM_MIN_PX) return 'medium'
  return 'small'
}

export function resolveStartupProfileIdForGridRows(gridRows: number): CanonicalStartupProfileId {
  const rows = Math.max(1, gridRows)
  if (rows >= GRID_ROWS_LARGE_MIN) return 'large'
  if (rows >= GRID_ROWS_MEDIUM_MIN) return 'medium'
  return 'small'
}

export function resolveStartupProfileIdForUsableArea(area: DesktopLayoutSize): CanonicalStartupProfileId {
  const widthProfile = resolveStartupProfileIdForWidth(area.w)
  const gridMetrics  = resolveDesktopIconGridMetrics(area)
  const gridProfile  = resolveStartupProfileIdForGridRows(gridMetrics.rowCount)

  return profileForRank(Math.min(profileRank(widthProfile), profileRank(gridProfile)))
}
