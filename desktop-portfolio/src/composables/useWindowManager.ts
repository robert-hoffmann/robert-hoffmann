/* ============================================================
   useWindowManager — Window lifecycle composable
   ============================================================
   Manages open windows: open, close, minimize, restore, focus,
   z-index stacking, single-instance enforcement.
   ============================================================ */

import { reactive, computed } from 'vue'
import type { Locale, WindowState } from '../types/desktop'
import { windowRegistry, getRegistryTitle } from '../data/registry'
import { uid } from '../utils'

const BASE_WINDOW = { w : 560, h : 420, x : 120, y : 60 }
const CASCADE     = 30

interface WindowManagerState {
  windows         : WindowState[]
  focusedWindowId : string | null
  nextZIndex      : number
}

const state = reactive<WindowManagerState>({
  windows         : [],
  focusedWindowId : null,
  nextZIndex      : 103,
})

export function useWindowManager() {
  /* ---- computed ---- */
  const visibleWindows = computed(() =>
    state.windows
      .filter(w => !w.isMinimized)
      .sort((a, b) => a.zIndex - b.zIndex),
  )

  const focusedWindowTitle = computed(() => {
    const win = state.windows.find(w => w.id === state.focusedWindowId)
    return win && !win.isMinimized ? win.title : null
  })

  /* ---- lifecycle ---- */

  /** Open a window — single-instance: re-focuses if already open */
  function openWindow(itemId: string, locale: Locale = 'en'): WindowState | null {
    const existing = state.windows.find(w => w.itemId === itemId)
    if (existing) {
      restoreWindow(existing.id)
      focusWindow(existing.id)
      return existing
    }

    const def = windowRegistry[itemId]
    if (!def) return null

    const cascade   = state.windows.length * CASCADE
    const isMusic   = itemId === 'music'
    const newWindow: WindowState = {
      id          : uid(),
      itemId      : def.id,
      title       : getRegistryTitle(def.id, locale),
      x           : isMusic ? 672 : BASE_WINDOW.x + cascade,
      y           : isMusic ? 580 : BASE_WINDOW.y + cascade,
      w           : def.defaultWidth,
      h           : def.defaultHeight,
      zIndex      : state.nextZIndex++,
      isMinimized : false,
    }

    state.windows.push(newWindow)
    state.focusedWindowId = newWindow.id
    return newWindow
  }

  function closeWindow(id: string) {
    const idx = state.windows.findIndex(w => w.id === id)
    if (idx === -1) return null

    const win = state.windows[idx]!
    state.windows.splice(idx, 1)

    if (state.focusedWindowId === id) {
      const top = visibleWindows.value.at(-1)
      state.focusedWindowId = top?.id ?? null
    }

    return win
  }

  function minimizeWindow(id: string) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return
    win.isMinimized = true
    if (state.focusedWindowId === id) {
      const top = visibleWindows.value.at(-1)
      state.focusedWindowId = top?.id ?? null
    }
  }

  function restoreWindow(id: string) {
    const win = state.windows.find(w => w.id === id)
    if (win) win.isMinimized = false
  }

  function focusWindow(id: string) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return
    win.zIndex = state.nextZIndex++
    state.focusedWindowId = id
  }

  function closeAll() {
    state.windows.length = 0
    state.focusedWindowId = null
  }

  function minimizeAll() {
    for (const w of state.windows) w.isMinimized = true
    state.focusedWindowId = null
  }

  function restoreAll() {
    for (const w of state.windows) w.isMinimized = false
  }

  function tileWindows() {
    const wins = state.windows.filter(w => !w.isMinimized)
    if (!wins.length) return 0
    const cols  = Math.ceil(Math.sqrt(wins.length))
    const rows  = Math.ceil(wins.length / cols)
    const areaW = window.innerWidth
    const areaH = window.innerHeight - 92
    const tileW = Math.floor(areaW / cols)
    const tileH = Math.floor(areaH / rows)
    wins.forEach((w, i) => {
      w.x = (i % cols) * tileW
      w.y = Math.floor(i / cols) * tileH + 32
      w.w = tileW
      w.h = tileH
    })
    return wins.length
  }

  function cascadeWindows() {
    state.windows.forEach((w, i) => {
      w.x = BASE_WINDOW.x + i * CASCADE
      w.y = BASE_WINDOW.y + i * CASCADE
      w.w = BASE_WINDOW.w
      w.h = BASE_WINDOW.h
    })
  }

  /** Replace windows array (used by session restore) */
  function setWindows(windows: WindowState[]) {
    state.windows.length = 0
    state.windows.push(...windows)
  }

  function setFocusedId(id: string | null) {
    state.focusedWindowId = id
  }

  function setNextZIndex(z: number) {
    state.nextZIndex = z
  }

  /** Re-derive all window titles from the registry for the given locale */
  function updateTitlesForLocale(locale: Locale) {
    for (const w of state.windows) {
      w.title = getRegistryTitle(w.itemId, locale)
    }
  }

  return {
    state,
    visibleWindows,
    focusedWindowTitle,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    closeAll,
    minimizeAll,
    restoreAll,
    tileWindows,
    cascadeWindows,
    setWindows,
    setFocusedId,
    setNextZIndex,
    updateTitlesForLocale,
  }
}
