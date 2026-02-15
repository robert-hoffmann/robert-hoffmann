/* ============================================================
   useDesktopIcons — Icon selection, keyboard nav, drag
   ============================================================ */

import { ref, reactive } from 'vue'
import type { DesktopItem } from '../types/desktop'
import { getDefaultDesktopItems } from '../data/registry'

const selectedIconId = ref<string | null>(null)
const items          = reactive<DesktopItem[]>(getDefaultDesktopItems())

export function useDesktopIcons() {
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

  function onIconPointerDown(event: PointerEvent, iconId: string) {
    if (event.button !== 0) return

    const item = items.find(i => i.id === iconId)
    if (!item) return

    selectIcon(iconId)

    const startX   = event.clientX
    const startY   = event.clientY
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
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  return {
    items,
    selectedIconId,
    selectIcon,
    clearSelection,
    iconStyle,
    navigateIcons,
    onIconPointerDown,
  }
}
