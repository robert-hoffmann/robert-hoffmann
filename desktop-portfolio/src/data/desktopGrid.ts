/* ============================================================
   Desktop Grid Metrics - Shared usable-area grid math
   ============================================================ */

export interface DesktopLayoutSize {
  w : number
  h : number
}

export interface DesktopIconGridMetrics {
  colCount : number
  rowCount : number
}

export const DESKTOP_ICON_GRID = {
  colStepPx        : 100,
  rowStepPx        : 88,
  itemWidthPx      : 88,
  itemHeightPx     : 76,
  colOffsetPx      : 24,
  colRightInsetPx  : 24,
  rowTopOffsetPx   : 24,
  rowBottomInsetPx : 12,
} as const

export function resolveGridAxisCount(
  areaSize   : number,
  startInset : number,
  endInset   : number,
  itemSize   : number,
  step       : number,
) {
  const available = areaSize - startInset - endInset - itemSize
  return Math.max(1, Math.floor(available / step) + 1)
}

export function resolveDesktopIconGridMetrics(area: DesktopLayoutSize): DesktopIconGridMetrics {
  return {
    colCount : resolveGridAxisCount(
      area.w,
      DESKTOP_ICON_GRID.colOffsetPx,
      DESKTOP_ICON_GRID.colRightInsetPx,
      DESKTOP_ICON_GRID.itemWidthPx,
      DESKTOP_ICON_GRID.colStepPx,
    ),
    rowCount : resolveGridAxisCount(
      area.h,
      DESKTOP_ICON_GRID.rowTopOffsetPx,
      DESKTOP_ICON_GRID.rowBottomInsetPx,
      DESKTOP_ICON_GRID.itemHeightPx,
      DESKTOP_ICON_GRID.rowStepPx,
    ),
  }
}
