/* ============================================================
   useSessionPersistence - localStorage persistence composable
   ============================================================
   Saves/restores desktop window state and icon positions.
   ============================================================ */

import { watch } from 'vue'
import type {
  DesktopItem,
  PortfolioDesktopState,
  WindowState,
} from '../types/desktop'
import { useWindowManager } from './useWindowManager'
import { useLocale } from './useLocale'
import { debounce } from '../utils'
import { getDefaultDesktopItems } from '../data/registry'
import {
  clearDesktopState,
  readDesktopState,
  writeDesktopState,
} from './usePortfolioState'

export function useSessionPersistence(desktopItems: DesktopItem[]) {
  const wm    = useWindowManager()
  const i18n  = useLocale()
  const defaults = getDefaultDesktopItems(i18n.locale.value)

  /* ---- save ---- */
  const save = debounce(() => {
    const data: PortfolioDesktopState = {
      desktopItems    : desktopItems,
      focusedWindowId : wm.state.focusedWindowId,
      nextZIndex      : wm.state.nextZIndex,
      windows         : wm.state.windows.map(w => ({
        id            : w.id,
        itemId        : w.itemId,
        title         : w.title,
        x             : w.x,
        y             : w.y,
        w             : w.w,
        h             : w.h,
        zIndex        : w.zIndex,
        mode          : w.mode,
        restoreBounds : w.restoreBounds,
        restoreMode   : w.restoreMode,
        contentState  : w.contentState,
      })),
    }

    writeDesktopState(data)
  }, 500)

  /* ---- restore ---- */
  function restore(): boolean {
    try {
      const parsed = readDesktopState()
      if (!parsed) return false

      if (Array.isArray(parsed.desktopItems)) {
        const defaultMap = new Map(defaults.map(d => [d.id, d]))
        const merged: DesktopItem[] = []
        const seen = new Set<string>()

        for (const saved of parsed.desktopItems) {
          const def = defaultMap.get(saved.id)
          if (!def) continue
          seen.add(saved.id)
          merged.push({ ...def, col : saved.col ?? def.col, row : saved.row ?? def.row })
        }
        for (const def of defaults) {
          if (!seen.has(def.id)) merged.push({ ...def })
        }
        desktopItems.length = 0
        desktopItems.push(...merged)
      }

      if (typeof parsed.nextZIndex === 'number') {
        wm.setNextZIndex(parsed.nextZIndex)
      }

      if (Array.isArray(parsed.windows)) {
        const knownIds = new Set(defaults.map(d => d.id))
        const validWindows = parsed.windows.filter(
          (w): w is WindowState => !!w && typeof w === 'object' && knownIds.has(w.itemId),
        )
        wm.setWindows(validWindows)
      }

      if (parsed.focusedWindowId) {
        wm.setFocusedId(parsed.focusedWindowId)
      }

      return true
    } catch {
      return false
    }
  }

  /* ---- reset ---- */
  function reset() {
    clearDesktopState()
  }

  /* ---- auto-save watcher ---- */
  function startAutoSave() {
    watch(
      () => [
        wm.state.windows,
        wm.state.focusedWindowId,
        wm.state.nextZIndex,
        desktopItems,
      ],
      save,
      { deep : true },
    )
  }

  return { save, restore, reset, startAutoSave }
}
