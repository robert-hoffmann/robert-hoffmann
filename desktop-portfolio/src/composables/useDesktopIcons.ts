/* ============================================================
   useDesktopIcons — Icon selection, keyboard nav, drag
   ============================================================ */

import { ref, reactive } from 'vue'
import type { DesktopItem, Locale } from '../types/desktop'
import { getDefaultDesktopItems, getRegistryTitle } from '../data/registry'
import { applyStartupIconLayout, type StartupIconLayout } from '../data/iconLayouts'

const selectedIconId = ref<string | null>(null)
const items          = reactive<DesktopItem[]>(getDefaultDesktopItems())

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
    return {
      top  : `${(item.row - 1) * 100 + 24}px`,
      left : `${(item.col - 1) * 100 + 24}px`,
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
    const origLeft = (item.col - 1) * 100 + 24
    const origTop  = (item.row - 1) * 100 + 24
    let moved      = false

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      moved = true
      item.col = Math.max(1, Math.round((origLeft + dx) / 100) + 1)
      item.row = Math.max(1, Math.round((origTop + dy) / 100) + 1)
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
