/* ============================================================
   useSessionPersistence — localStorage persistence composable
   ============================================================
   Saves/restores window state, theme, locale, icon positions.
   ============================================================ */

import { watch } from 'vue'
import type { DesktopItem, SessionState, WindowState } from '../types/desktop'
import { useWindowManager } from './useWindowManager'
import { useTheme } from './useTheme'
import { useLocale } from './useLocale'
import { debounce, safeParse } from '../utils'
import { getDefaultDesktopItems } from '../data/registry'

const STORAGE_KEY       = 'desktop-portfolio-state'

/**
 * Schema version for persisted desktop state.
 * Any version mismatch is treated as incompatible and reset.
 */
const SETTINGS_VERSION  = 2

export function useSessionPersistence(desktopItems: DesktopItem[]) {
  const wm    = useWindowManager()
  const th    = useTheme()
  const i18n  = useLocale()
  const defaults = getDefaultDesktopItems(i18n.locale.value)

  /* ---- save ---- */
  const save = debounce(() => {
    try {
      const data: SessionState = {
        version         : SETTINGS_VERSION,
        theme           : th.theme.value,
        locale          : i18n.locale.value,
        desktopItems    : desktopItems,
        focusedWindowId : wm.state.focusedWindowId,
        nextZIndex      : wm.state.nextZIndex,
        windows         : wm.state.windows.map(w => ({
          id : w.id, itemId : w.itemId, title : w.title,
          x : w.x, y : w.y, w : w.w, h : w.h,
          zIndex : w.zIndex,
          mode : w.mode,
          restoreBounds : w.restoreBounds,
          restoreMode : w.restoreMode,
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

      /* Incompatible persisted schema → discard and reinitialize */
      if (parsed.version !== SETTINGS_VERSION) {
        reset()
        return false
      }

      if (parsed.theme === 'dark' || parsed.theme === 'light') {
        th.setTheme(parsed.theme)
      }

      if (parsed.locale === 'en' || parsed.locale === 'fr') {
        i18n.setLocale(parsed.locale)
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

  /* ---- reset ---- */
  function reset() {
    localStorage.removeItem(STORAGE_KEY)
  }

  /* ---- auto-save watcher ---- */
  function startAutoSave() {
    watch(() => [wm.state.windows, wm.state.focusedWindowId, th.theme.value, i18n.locale.value, desktopItems], save, { deep : true })
  }

  return { save, restore, reset, startAutoSave }
}
