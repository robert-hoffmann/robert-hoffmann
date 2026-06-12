/* ============================================================
   useDesktopIcons - Icon selection, keyboard nav, drag
   ============================================================ */

import { ref, reactive } from 'vue'
import type { DesktopItem, Locale } from '../types/desktop'
import { getDefaultDesktopItems, getRegistryIconTitle } from '../data/registry'
import { applyStartupIconLayout, type StartupIconLayout } from '../data/iconLayouts'
import {
  DESKTOP_ICON_GRID,
  resolveDesktopIconGridMetrics,
  type DesktopIconGridMetrics,
  type DesktopLayoutSize,
} from '../data/desktopGrid'

const selectedIconId = ref<string | null>(null)
const items          = reactive<DesktopItem[]>(getDefaultDesktopItems())
const iconGridTick   = ref(0)

interface IconGridPosition {
  col : number
  row : number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getDesktopAreaSize(): DesktopLayoutSize {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { w : 1440, h : 900 }
  }

  const area = document.querySelector<HTMLElement>('.desktop-area')
  if (area) {
    return {
      w : Math.max(area.clientWidth, 1),
      h : Math.max(area.clientHeight, 1),
    }
  }

  return {
    w : Math.max(window.innerWidth, 1),
    h : Math.max(window.innerHeight, 1),
  }
}

function getIconGridMetrics(): DesktopIconGridMetrics {
  return resolveDesktopIconGridMetrics(getDesktopAreaSize())
}

function resolveIconLeftPx(col: number) {
  return (col - 1) * DESKTOP_ICON_GRID.colStepPx + DESKTOP_ICON_GRID.colOffsetPx
}

function resolveIconTopPx(row: number) {
  return DESKTOP_ICON_GRID.rowTopOffsetPx + (row - 1) * DESKTOP_ICON_GRID.rowStepPx
}

function clampGridPosition(
  position : IconGridPosition,
  metrics  : DesktopIconGridMetrics,
): IconGridPosition {
  return {
    col : clamp(position.col, 1, metrics.colCount),
    row : clamp(position.row, 1, metrics.rowCount),
  }
}

function gridKey(position: IconGridPosition) {
  return `${position.col}:${position.row}`
}

function resolveNearestAvailablePosition(
  desired  : IconGridPosition,
  metrics  : DesktopIconGridMetrics,
  occupied : Set<string>,
): IconGridPosition {
  const clamped = clampGridPosition(desired, metrics)
  if (!occupied.has(gridKey(clamped))) return clamped

  let best: IconGridPosition | null = null
  let bestScore = Number.POSITIVE_INFINITY

  for (let row = 1; row <= metrics.rowCount; row++) {
    for (let col = 1; col <= metrics.colCount; col++) {
      const candidate = { col, row }
      if (occupied.has(gridKey(candidate))) continue

      const rowDelta = Math.abs(row - clamped.row)
      const colDelta = Math.abs(col - clamped.col)
      const score    = rowDelta + colDelta

      if (
        score < bestScore ||
        (
          score === bestScore &&
          best &&
          (rowDelta < Math.abs(best.row - clamped.row) ||
            (rowDelta === Math.abs(best.row - clamped.row) && col < best.col))
        )
      ) {
        best = candidate
        bestScore = score
      }
    }
  }

  return best ?? clamped
}

function resolveGridPositionFromPoint(
  leftPx  : number,
  topPx   : number,
  metrics : DesktopIconGridMetrics,
): IconGridPosition {
  return clampGridPosition({
    col : Math.round((leftPx - DESKTOP_ICON_GRID.colOffsetPx) / DESKTOP_ICON_GRID.colStepPx) + 1,
    row : Math.round((topPx - DESKTOP_ICON_GRID.rowTopOffsetPx) / DESKTOP_ICON_GRID.rowStepPx) + 1,
  }, metrics)
}

export function useDesktopIcons() {
  function isPrimaryPointerActivation(ev: PointerEvent) {
    if (!ev.isPrimary) return false
    if (ev.pointerType === 'touch') return ev.button === 0 || ev.button === -1
    return ev.button === 0
  }

  function selectIcon(id: string) {
    selectedIconId.value = id
  }

  function clearSelection() {
    selectedIconId.value = null
  }

  function iconStyle(item: DesktopItem) {
    void iconGridTick.value
    const position = getProjectedIconPositions().get(item.id) ?? clampGridPosition(
      { col : item.col, row : item.row },
      getIconGridMetrics(),
    )

    return {
      top  : `${Math.round(resolveIconTopPx(position.row))}px`,
      left : `${Math.round(resolveIconLeftPx(position.col))}px`,
    }
  }

  function getProjectedIconPositions(excludeId?: string) {
    const metrics = getIconGridMetrics()
    const occupied = new Set<string>()
    const projected = new Map<string, IconGridPosition>()

    for (const item of items) {
      if (item.id === excludeId) continue

      const position = resolveNearestAvailablePosition(
        { col : item.col, row : item.row },
        metrics,
        occupied,
      )

      occupied.add(gridKey(position))
      projected.set(item.id, position)
    }

    return projected
  }

  function navigateIcons(key: string) {
    const current = items.find(i => i.id === selectedIconId.value)
    if (!current) {
      selectedIconId.value = items[0]?.id ?? null
      return
    }

    const projected = getProjectedIconPositions()
    const currentPosition = projected.get(current.id) ?? { col : current.col, row : current.row }
    let targetCol = currentPosition.col
    let targetRow = currentPosition.row

    switch (key) {
      case 'ArrowUp'    : targetRow--; break
      case 'ArrowDown'  : targetRow++; break
      case 'ArrowLeft'  : targetCol--; break
      case 'ArrowRight' : targetCol++; break
    }

    const target = items.find(i => {
      const position = projected.get(i.id)
      return position?.col === targetCol && position.row === targetRow
    })
    if (target) selectedIconId.value = target.id
  }

  /** Re-derive all desktop icon titles from the registry for the given locale */
  function updateTitlesForLocale(locale: Locale) {
    for (const item of items) {
      item.title = getRegistryIconTitle(item.id, locale)
    }
  }

  function resetToDefaults(locale: Locale, layout?: StartupIconLayout[]) {
    const defaults = getDefaultDesktopItems(locale)
    const nextItems = layout ? applyStartupIconLayout(defaults, layout) : defaults
    items.length = 0
    items.push(...nextItems)
    selectedIconId.value = null
  }

  function refreshViewportGrid() {
    iconGridTick.value++
  }

  function onIconPointerDown(ev: PointerEvent, iconId: string) {
    if (!isPrimaryPointerActivation(ev)) return

    const item = items.find(i => i.id === iconId)
    if (!item) return

    selectIcon(iconId)

    const startX   = ev.clientX
    const startY   = ev.clientY
    const metrics  = getIconGridMetrics()
    const projected = getProjectedIconPositions()
    const startPosition = projected.get(iconId) ?? clampGridPosition(
      { col : item.col, row : item.row },
      metrics,
    )
    const origLeft = resolveIconLeftPx(startPosition.col)
    const origTop  = resolveIconTopPx(startPosition.row)
    let moved      = false

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      moved = true

      const nextMetrics = getIconGridMetrics()
      const occupied = new Set(
        [...getProjectedIconPositions(iconId).values()].map(position => gridKey(position)),
      )
      const nextPosition = resolveNearestAvailablePosition(
        resolveGridPositionFromPoint(origLeft + dx, origTop + dy, nextMetrics),
        nextMetrics,
        occupied,
      )

      item.col = nextPosition.col
      item.row = nextPosition.row
    }

    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
  }

  return {
    items,
    selectedIconId,
    selectIcon,
    clearSelection,
    iconStyle,
    navigateIcons,
    onIconPointerDown,
    refreshViewportGrid,
    updateTitlesForLocale,
    resetToDefaults,
  }
}
