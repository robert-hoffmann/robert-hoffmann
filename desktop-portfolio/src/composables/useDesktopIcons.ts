/* ============================================================
   useDesktopIcons — Icon selection, keyboard nav, drag
   ============================================================ */

import { ref, reactive } from 'vue'
import type { DesktopItem, Locale } from '../types/desktop'
import { getDefaultDesktopItems, getRegistryTitle } from '../data/registry'
import { applyStartupIconLayout, type StartupIconLayout } from '../data/iconLayouts'

const selectedIconId = ref<string | null>(null)
const items          = reactive<DesktopItem[]>(getDefaultDesktopItems())

const ICON_GRID_COL_STEP_PX = 100
const ICON_GRID_COL_OFFSET_PX = 24
const ICON_GRID_ROW_COUNT = 9
const ICON_GRID_ROW_TOP_OFFSET_PX = 24
const ICON_GRID_ROW_BOTTOM_OFFSET_PX = 28

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getDesktopAreaHeight() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 900

  const area = document.querySelector<HTMLElement>('.desktop-area')
  if (area) return Math.max(area.clientHeight, 1)

  return Math.max(window.innerHeight, 1)
}

function getIconRowStepPx() {
  const usableHeight = Math.max(
    1,
    getDesktopAreaHeight() - ICON_GRID_ROW_TOP_OFFSET_PX - ICON_GRID_ROW_BOTTOM_OFFSET_PX,
  )
  return ICON_GRID_ROW_COUNT > 1
    ? usableHeight / (ICON_GRID_ROW_COUNT - 1)
    : 0
}

function resolveIconTopPx(row: number, rowStepPx: number) {
  const normalizedRow = clamp(row, 1, ICON_GRID_ROW_COUNT)
  return ICON_GRID_ROW_TOP_OFFSET_PX + (normalizedRow - 1) * rowStepPx
}

function resolveRowFromTopPx(topPx: number, rowStepPx: number) {
  if (rowStepPx <= 0) return 1
  const rawRow = Math.round((topPx - ICON_GRID_ROW_TOP_OFFSET_PX) / rowStepPx) + 1
  return clamp(rawRow, 1, ICON_GRID_ROW_COUNT)
}

function resolveColFromLeftPx(leftPx: number) {
  return Math.max(1, Math.round((leftPx - ICON_GRID_COL_OFFSET_PX) / ICON_GRID_COL_STEP_PX) + 1)
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
    const rowStepPx = getIconRowStepPx()
    return {
      top  : `${Math.round(resolveIconTopPx(item.row, rowStepPx))}px`,
      left : `${Math.round((item.col - 1) * ICON_GRID_COL_STEP_PX + ICON_GRID_COL_OFFSET_PX)}px`,
    }
  }

  function navigateIcons(key: string) {
    const current = items.find(i => i.id === selectedIconId.value)
    if (!current) {
      selectedIconId.value = items[0]?.id ?? null
      return
    }

    let targetCol = current.col
    let targetRow = current.row

    switch (key) {
      case 'ArrowUp'    : targetRow--; break
      case 'ArrowDown'  : targetRow++; break
      case 'ArrowLeft'  : targetCol--; break
      case 'ArrowRight' : targetCol++; break
    }

    const target = items.find(i => i.col === targetCol && i.row === targetRow)
    if (target) selectedIconId.value = target.id
  }

  /** Re-derive all desktop icon titles from the registry for the given locale */
  function updateTitlesForLocale(locale: Locale) {
    for (const item of items) {
      item.title = getRegistryTitle(item.id, locale)
    }
  }

  function resetToDefaults(locale: Locale, layout?: StartupIconLayout[]) {
    const defaults = getDefaultDesktopItems(locale)
    const nextItems = layout ? applyStartupIconLayout(defaults, layout) : defaults
    items.length = 0
    items.push(...nextItems)
    selectedIconId.value = null
  }

  function onIconPointerDown(ev: PointerEvent, iconId: string) {
    if (!isPrimaryPointerActivation(ev)) return

    const item = items.find(i => i.id === iconId)
    if (!item) return

    selectIcon(iconId)

    const startX   = ev.clientX
    const startY   = ev.clientY
    const rowStepPx = getIconRowStepPx()
    const origLeft = (item.col - 1) * ICON_GRID_COL_STEP_PX + ICON_GRID_COL_OFFSET_PX
    const origTop  = resolveIconTopPx(item.row, rowStepPx)
    let moved      = false

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      moved = true
      item.col = resolveColFromLeftPx(origLeft + dx)
      item.row = resolveRowFromTopPx(origTop + dy, rowStepPx)
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
    updateTitlesForLocale,
    resetToDefaults,
  }
}
