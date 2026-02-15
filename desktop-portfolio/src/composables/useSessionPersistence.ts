/* ============================================================
   useSessionPersistence — localStorage + deep-link composable
   ============================================================
   Saves/restores window state, theme, icon positions.
   Deep-link URL params override localStorage on mount.
   ============================================================ */

import { watch } from 'vue'
import type { DesktopItem, SessionState, WindowState } from '../types/desktop'
import { useWindowManager } from './useWindowManager'
import { useTheme } from './useTheme'
import { debounce, safeParse } from '../utils'
import { getDefaultDesktopItems, windowRegistry } from '../data/registry'

const STORAGE_KEY = 'desktop-portfolio-state'

export function useSessionPersistence(desktopItems: DesktopItem[]) {
  const wm    = useWindowManager()
  const th    = useTheme()
  const defaults = getDefaultDesktopItems()

  /* ---- save ---- */
  const save = debounce(() => {
    try {
      const data: SessionState = {
        theme           : th.theme.value,
        desktopItems    : desktopItems,
        focusedWindowId : wm.state.focusedWindowId,
        nextZIndex      : wm.state.nextZIndex,
        windows         : wm.state.windows.map(w => ({
          id : w.id, itemId : w.itemId, title : w.title,
          x : w.x, y : w.y, w : w.w, h : w.h,
          zIndex : w.zIndex, isMinimized : w.isMinimized,
        })),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* Quota exceeded or private browsing — fail silently */
    }
  }, 500)

  /* ---- restore ---- */
  function restore(): boolean {
    try {
      const raw    = localStorage.getItem(STORAGE_KEY)
      const parsed = safeParse<SessionState>(raw)
      if (!parsed || typeof parsed !== 'object') return false

      if (parsed.theme === 'dark' || parsed.theme === 'light') {
        th.setTheme(parsed.theme)
      }

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

  /* ---- deep links ---- */
  function applyDeepLinks(): boolean {
    try {
      const params = new URLSearchParams(window.location.search)
      const themeParam = params.get('theme')
      const openParam  = params.get('open')
      const focusParam = params.get('focus')

      if (themeParam === 'light' || themeParam === 'dark') {
        th.setTheme(themeParam)
      }

      if (openParam) {
        const ids = openParam.split(',').map(s => s.trim()).filter(Boolean)
        for (const id of ids) {
          if (windowRegistry[id]) wm.openWindow(id)
        }
      }

      if (focusParam) {
        const win = wm.state.windows.find(w => w.itemId === focusParam)
        if (win) wm.focusWindow(win.id)
      }

      return !!(themeParam || openParam || focusParam)
    } catch {
      return false
    }
  }

  /* ---- reset ---- */
  function reset() {
    localStorage.removeItem(STORAGE_KEY)
  }

  /* ---- auto-save watcher ---- */
  function startAutoSave() {
    watch(() => [wm.state.windows, wm.state.focusedWindowId, th.theme.value, desktopItems], save, { deep : true })
  }

  return { save, restore, applyDeepLinks, reset, startAutoSave }
}
