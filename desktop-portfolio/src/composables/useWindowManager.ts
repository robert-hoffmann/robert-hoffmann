/* ============================================================
   useWindowManager — Window lifecycle + geometry manager
   ============================================================
   Owns all runtime window state transitions and geometry writes:
   open, close, minimize, restore, maximize, focus, move, resize,
   z-index stacking, layout actions, and session normalization.
   ============================================================ */

import { computed, reactive } from 'vue'
import type {
  Locale,
  ResolvedWindowPolicy,
  WindowMode,
  WindowPoint,
  WindowPolicyConfig,
  WindowRect,
  WindowSize,
  WindowState,
} from '../types/desktop'
import { windowRegistry, getRegistryTitle } from '../data/registry'
import { clamp, uid } from '../utils'

const CASCADE = 30
const DEFAULT_WINDOW_POINT = { x : 120, y : 60 } as const
const TOP_BAR_HEIGHT_PX = 32
const DOCK_SAFE_MARGIN_PX = 60
const RIGHT_VISIBLE_EDGE_PX = 40

interface WindowManagerState {
  windows         : WindowState[]
  focusedWindowId : string | null
  nextZIndex      : number
}

interface OpenWindowOptions {
  rect?   : Partial<WindowRect>
  zIndex? : number
  focus?  : boolean
}

interface WindowCapabilities {
  canMinimize : boolean
  canMaximize : boolean
  canResize   : boolean
  canMove     : boolean
}

const DEFAULT_WINDOW_POLICY: ResolvedWindowPolicy = {
  size : {
    default : { w : 560, h : 420 },
    min     : { w : 320, h : 200 },
    max     : { w : 4096, h : 4096 },
  },
  behavior : {
    resizable       : true,
    movable         : true,
    minimizable     : true,
    maximizable     : true,
    singleInstance  : true,
    persistGeometry : true,
  },
  placement : {
    openStrategy        : 'cascade',
    defaultPosition     : null,
    keepTitlebarVisible : true,
  },
}

const state = reactive<WindowManagerState>({
  windows         : [],
  focusedWindowId : null,
  nextZIndex      : 103,
})

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function parseWindowMode(value: unknown): WindowMode {
  return value === 'minimized' || value === 'maximized' ? value : 'normal'
}

function parseRestoreMode(value: unknown): Exclude<WindowMode, 'minimized'> | null {
  return value === 'normal' || value === 'maximized' ? value : null
}

function toWindowRect(value: Partial<WindowRect> | null | undefined): WindowRect | null {
  if (!value) return null
  const { x, y, w, h } = value
  if (!isFiniteNumber(x) || !isFiniteNumber(y) || !isFiniteNumber(w) || !isFiniteNumber(h)) {
    return null
  }
  return { x, y, w, h }
}

function currentViewport() {
  if (typeof window === 'undefined') {
    return { width : 1440, height : 900 }
  }
  return {
    width  : Math.max(window.innerWidth, 1),
    height : Math.max(window.innerHeight, TOP_BAR_HEIGHT_PX + 1),
  }
}

function getWorkAreaRect(): WindowRect {
  const viewport = currentViewport()
  return {
    x : 0,
    y : TOP_BAR_HEIGHT_PX,
    w : viewport.width,
    h : Math.max(1, viewport.height - TOP_BAR_HEIGHT_PX - DOCK_SAFE_MARGIN_PX),
  }
}

function mergeSize(
  base : WindowSize,
  next : WindowSize | undefined,
): WindowSize {
  if (!next) return { ...base }
  return {
    w : isFiniteNumber(next.w) ? next.w : base.w,
    h : isFiniteNumber(next.h) ? next.h : base.h,
  }
}

function mergePoint(
  base : WindowPoint | null,
  next : WindowPoint | undefined,
): WindowPoint | null {
  if (!next) return base ? { ...base } : null
  if (!isFiniteNumber(next.x) || !isFiniteNumber(next.y)) return base ? { ...base } : null
  return { x : next.x, y : next.y }
}

function normalizePolicy(config?: WindowPolicyConfig): ResolvedWindowPolicy {
  const merged: ResolvedWindowPolicy = {
    size : {
      default : mergeSize(DEFAULT_WINDOW_POLICY.size.default, config?.size?.default),
      min     : mergeSize(DEFAULT_WINDOW_POLICY.size.min, config?.size?.min),
      max     : mergeSize(DEFAULT_WINDOW_POLICY.size.max, config?.size?.max),
    },
    behavior : {
      resizable       : config?.behavior?.resizable ?? DEFAULT_WINDOW_POLICY.behavior.resizable,
      movable         : config?.behavior?.movable ?? DEFAULT_WINDOW_POLICY.behavior.movable,
      minimizable     : config?.behavior?.minimizable ?? DEFAULT_WINDOW_POLICY.behavior.minimizable,
      maximizable     : config?.behavior?.maximizable ?? DEFAULT_WINDOW_POLICY.behavior.maximizable,
      singleInstance  : config?.behavior?.singleInstance ?? DEFAULT_WINDOW_POLICY.behavior.singleInstance,
      persistGeometry : config?.behavior?.persistGeometry ?? DEFAULT_WINDOW_POLICY.behavior.persistGeometry,
    },
    placement : {
      openStrategy        : config?.placement?.openStrategy ?? DEFAULT_WINDOW_POLICY.placement.openStrategy,
      defaultPosition     : mergePoint(DEFAULT_WINDOW_POLICY.placement.defaultPosition, config?.placement?.defaultPosition),
      keepTitlebarVisible : config?.placement?.keepTitlebarVisible ?? DEFAULT_WINDOW_POLICY.placement.keepTitlebarVisible,
    },
  }

  const maxW = Math.max(1, merged.size.max.w)
  const maxH = Math.max(1, merged.size.max.h)
  const minW = clamp(merged.size.min.w, 1, maxW)
  const minH = clamp(merged.size.min.h, 1, maxH)
  const defW = clamp(merged.size.default.w, minW, maxW)
  const defH = clamp(merged.size.default.h, minH, maxH)

  return {
    ...merged,
    size : {
      default : { w : defW, h : defH },
      min     : { w : minW, h : minH },
      max     : { w : maxW, h : maxH },
    },
  }
}

export function resolveWindowPolicy(itemId: string): ResolvedWindowPolicy {
  return normalizePolicy(windowRegistry[itemId]?.window)
}

function clampSizeToPolicy(itemId: string, size: WindowSize): WindowSize {
  const policy = resolveWindowPolicy(itemId)
  const work = getWorkAreaRect()

  const maxW = Math.max(1, Math.min(policy.size.max.w, work.w))
  const maxH = Math.max(1, Math.min(policy.size.max.h, work.h))
  const minW = Math.max(1, Math.min(policy.size.min.w, maxW))
  const minH = Math.max(1, Math.min(policy.size.min.h, maxH))

  return {
    w : clamp(size.w, minW, maxW),
    h : clamp(size.h, minH, maxH),
  }
}

function clampPositionToViewport(itemId: string, point: WindowPoint): WindowPoint {
  const policy = resolveWindowPolicy(itemId)
  if (!policy.placement.keepTitlebarVisible) {
    return { x : point.x, y : point.y }
  }

  const viewport = currentViewport()
  const minX = 0
  const maxX = Math.max(0, viewport.width - RIGHT_VISIBLE_EDGE_PX)
  const minY = TOP_BAR_HEIGHT_PX
  const maxY = Math.max(minY, viewport.height - DOCK_SAFE_MARGIN_PX)

  return {
    x : clamp(point.x, minX, maxX),
    y : clamp(point.y, minY, maxY),
  }
}

function normalizeRectForWindow(itemId: string, rect: WindowRect): WindowRect {
  const clampedSize = clampSizeToPolicy(itemId, { w : rect.w, h : rect.h })
  const clampedPos = clampPositionToViewport(itemId, { x : rect.x, y : rect.y })
  return {
    ...clampedPos,
    ...clampedSize,
  }
}

function computeMaximizedRect(itemId: string): WindowRect {
  const work = getWorkAreaRect()
  const policy = resolveWindowPolicy(itemId)

  const w = Math.max(1, Math.min(policy.size.max.w, work.w))
  const h = Math.max(1, Math.min(policy.size.max.h, work.h))
  const x = work.x + Math.max(0, Math.floor((work.w - w) / 2))
  const y = work.y + Math.max(0, Math.floor((work.h - h) / 2))

  return normalizeRectForWindow(itemId, { x, y, w, h })
}

function pickTopVisibleWindow(): WindowState | null {
  let top: WindowState | null = null
  for (const win of state.windows) {
    if (win.mode === 'minimized') continue
    if (!top || win.zIndex > top.zIndex) top = win
  }
  return top
}

function ensureNormalGeometryState(win: WindowState) {
  if (win.mode === 'maximized') {
    win.mode = 'normal'
    win.restoreBounds = null
    win.restoreMode = null
  }
}

function applyRectToWindow(win: WindowState, nextRect: Partial<WindowRect>) {
  const rect = normalizeRectForWindow(win.itemId, {
    x : isFiniteNumber(nextRect.x) ? nextRect.x : win.x,
    y : isFiniteNumber(nextRect.y) ? nextRect.y : win.y,
    w : isFiniteNumber(nextRect.w) ? nextRect.w : win.w,
    h : isFiniteNumber(nextRect.h) ? nextRect.h : win.h,
  })

  win.x = rect.x
  win.y = rect.y
  win.w = rect.w
  win.h = rect.h
}

function resolveOpenRect(itemId: string, index: number): WindowRect {
  const policy = resolveWindowPolicy(itemId)
  const size = clampSizeToPolicy(itemId, policy.size.default)
  const cascadeOffset = index * CASCADE
  const basePoint = policy.placement.defaultPosition ?? DEFAULT_WINDOW_POINT
  const work = getWorkAreaRect()

  let point: WindowPoint
  switch (policy.placement.openStrategy) {
    case 'fixed':
      point = policy.placement.defaultPosition ?? basePoint
      break
    case 'center':
      point = {
        x : Math.floor(work.x + (work.w - size.w) / 2),
        y : Math.floor(work.y + (work.h - size.h) / 2),
      }
      break
    case 'cascade':
    default:
      point = {
        x : basePoint.x + cascadeOffset,
        y : basePoint.y + cascadeOffset,
      }
      break
  }

  return normalizeRectForWindow(itemId, { ...point, ...size })
}

function normalizeRestoredWindow(saved: WindowState): WindowState | null {
  const def = windowRegistry[saved.itemId]
  if (!def || def.type === 'link') return null

  const policy = resolveWindowPolicy(saved.itemId)
  const openRect = resolveOpenRect(saved.itemId, state.windows.length)
  const savedRect = normalizeRectForWindow(saved.itemId, {
    x : isFiniteNumber(saved.x) ? saved.x : openRect.x,
    y : isFiniteNumber(saved.y) ? saved.y : openRect.y,
    w : isFiniteNumber(saved.w) ? saved.w : openRect.w,
    h : isFiniteNumber(saved.h) ? saved.h : openRect.h,
  })

  const restoreBounds = toWindowRect(saved.restoreBounds)
  const normalizedRestoreBounds = restoreBounds
    ? normalizeRectForWindow(saved.itemId, restoreBounds)
    : null

  const mode = parseWindowMode(saved.mode)
  const restoreMode = parseRestoreMode(saved.restoreMode)

  const normalized: WindowState = {
    id           : typeof saved.id === 'string' && saved.id ? saved.id : uid(),
    itemId       : saved.itemId,
    title        : typeof saved.title === 'string' && saved.title ? saved.title : def.title,
    x            : savedRect.x,
    y            : savedRect.y,
    w            : savedRect.w,
    h            : savedRect.h,
    zIndex       : isFiniteNumber(saved.zIndex) ? saved.zIndex : state.nextZIndex++,
    mode,
    restoreBounds: normalizedRestoreBounds,
    restoreMode  : restoreMode,
  }

  if (!policy.behavior.maximizable && normalized.mode === 'maximized') {
    normalized.mode = 'normal'
  }
  if (!policy.behavior.minimizable && normalized.mode === 'minimized') {
    normalized.mode = 'normal'
  }

  if (normalized.mode === 'maximized') {
    normalized.restoreBounds = normalized.restoreBounds ?? savedRect
    const maxRect = computeMaximizedRect(normalized.itemId)
    normalized.x = maxRect.x
    normalized.y = maxRect.y
    normalized.w = maxRect.w
    normalized.h = maxRect.h
    normalized.restoreMode = null
  } else if (normalized.mode === 'minimized') {
    normalized.restoreMode = normalized.restoreMode ?? 'normal'
  } else {
    normalized.restoreBounds = null
    normalized.restoreMode = null
  }

  return normalized
}

export function useWindowManager() {
  const visibleWindows = computed(() =>
    state.windows.filter(w => w.mode !== 'minimized'),
  )

  const focusedWindowTitle = computed(() => {
    const win = state.windows.find(w => w.id === state.focusedWindowId)
    return win && win.mode !== 'minimized' ? win.title : null
  })

  function getWindowPolicy(itemId: string): ResolvedWindowPolicy {
    return resolveWindowPolicy(itemId)
  }

  function getWindowCapabilities(id: string): WindowCapabilities {
    const win = state.windows.find(w => w.id === id)
    if (!win) {
      return {
        canMinimize : false,
        canMaximize : false,
        canResize   : false,
        canMove     : false,
      }
    }

    const policy = resolveWindowPolicy(win.itemId)
    return {
      canMinimize : policy.behavior.minimizable,
      canMaximize : policy.behavior.maximizable,
      canResize   : policy.behavior.resizable && win.mode === 'normal',
      canMove     : policy.behavior.movable && win.mode === 'normal',
    }
  }

  function focusWindow(id: string) {
    const win = state.windows.find(w => w.id === id)
    if (!win || win.mode === 'minimized') return
    win.zIndex = state.nextZIndex++
    state.focusedWindowId = id
  }

  function openWindow(
    itemId : string,
    locale : Locale = 'en',
    options: OpenWindowOptions = {},
  ): WindowState | null {
    const def = windowRegistry[itemId]
    if (!def || def.type === 'link') return null

    const policy = resolveWindowPolicy(itemId)
    if (policy.behavior.singleInstance) {
      const existing = state.windows.find(w => w.itemId === itemId)
      if (existing) {
        restoreWindow(existing.id)
        focusWindow(existing.id)
        return existing
      }
    }

    const openRect = resolveOpenRect(itemId, state.windows.length)
    const newWindow: WindowState = {
      id           : uid(),
      itemId       : def.id,
      title        : getRegistryTitle(def.id, locale),
      x            : openRect.x,
      y            : openRect.y,
      w            : openRect.w,
      h            : openRect.h,
      zIndex       : isFiniteNumber(options.zIndex) ? options.zIndex : state.nextZIndex++,
      mode         : 'normal',
      restoreBounds: null,
      restoreMode  : null,
    }

    if (options.rect) {
      applyRectToWindow(newWindow, options.rect)
    }

    if (isFiniteNumber(options.zIndex)) {
      state.nextZIndex = Math.max(state.nextZIndex, options.zIndex + 1)
    }

    state.windows.push(newWindow)

    if (options.focus !== false) {
      state.focusedWindowId = newWindow.id
    }

    return newWindow
  }

  function closeWindow(id: string) {
    const idx = state.windows.findIndex(w => w.id === id)
    if (idx === -1) return null

    const win = state.windows[idx]!
    state.windows.splice(idx, 1)

    if (state.focusedWindowId === id) {
      state.focusedWindowId = pickTopVisibleWindow()?.id ?? null
    }

    return win
  }

  function minimizeWindow(id: string) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return

    const policy = resolveWindowPolicy(win.itemId)
    if (!policy.behavior.minimizable || win.mode === 'minimized') return

    win.restoreMode = win.mode === 'maximized' ? 'maximized' : 'normal'
    win.mode = 'minimized'

    if (state.focusedWindowId === id) {
      state.focusedWindowId = pickTopVisibleWindow()?.id ?? null
    }
  }

  function restoreWindow(id: string) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return

    if (win.mode === 'minimized') {
      const targetMode = win.restoreMode ?? 'normal'
      if (targetMode === 'maximized') {
        const maxRect = computeMaximizedRect(win.itemId)
        win.x = maxRect.x
        win.y = maxRect.y
        win.w = maxRect.w
        win.h = maxRect.h
        win.mode = 'maximized'
      } else {
        win.mode = 'normal'
        applyRectToWindow(win, {})
      }
      win.restoreMode = null
      return
    }

    if (win.mode === 'maximized') {
      const restoreRect = win.restoreBounds
      win.mode = 'normal'
      win.restoreBounds = null
      win.restoreMode = null
      if (restoreRect) {
        applyRectToWindow(win, restoreRect)
      } else {
        applyRectToWindow(win, {})
      }
    }
  }

  function toggleMaximizeWindow(id: string) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return

    const policy = resolveWindowPolicy(win.itemId)
    if (!policy.behavior.maximizable) return
    if (win.mode === 'minimized') return

    if (win.mode === 'maximized') {
      restoreWindow(id)
      focusWindow(id)
      return
    }

    win.restoreBounds = { x : win.x, y : win.y, w : win.w, h : win.h }
    win.restoreMode = null
    const maxRect = computeMaximizedRect(win.itemId)
    win.x = maxRect.x
    win.y = maxRect.y
    win.w = maxRect.w
    win.h = maxRect.h
    win.mode = 'maximized'
    focusWindow(id)
  }

  function moveWindowTo(id: string, x: number, y: number) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return

    const policy = resolveWindowPolicy(win.itemId)
    if (!policy.behavior.movable || win.mode !== 'normal') return

    const point = clampPositionToViewport(win.itemId, { x, y })
    win.x = point.x
    win.y = point.y
  }

  function resizeWindowTo(id: string, w: number, h: number) {
    const win = state.windows.find(winState => winState.id === id)
    if (!win) return

    const policy = resolveWindowPolicy(win.itemId)
    if (!policy.behavior.resizable || win.mode !== 'normal') return

    const size = clampSizeToPolicy(win.itemId, { w, h })
    win.w = size.w
    win.h = size.h
  }

  function closeAll() {
    state.windows.length = 0
    state.focusedWindowId = null
  }

  function minimizeAll() {
    for (const win of state.windows) minimizeWindow(win.id)
    state.focusedWindowId = pickTopVisibleWindow()?.id ?? null
  }

  function restoreAll() {
    for (const win of state.windows) {
      if (win.mode === 'minimized') restoreWindow(win.id)
    }
  }

  function tileWindows() {
    const wins = state.windows.filter(w => w.mode !== 'minimized')
    if (!wins.length) return 0

    const cols = Math.ceil(Math.sqrt(wins.length))
    const rows = Math.ceil(wins.length / cols)
    const work = getWorkAreaRect()
    const tileW = Math.max(1, Math.floor(work.w / cols))
    const tileH = Math.max(1, Math.floor(work.h / rows))

    wins.forEach((win, index) => {
      ensureNormalGeometryState(win)
      const x = work.x + (index % cols) * tileW
      const y = work.y + Math.floor(index / cols) * tileH
      const policy = resolveWindowPolicy(win.itemId)
      if (policy.behavior.resizable) {
        applyRectToWindow(win, { x, y, w : tileW, h : tileH })
      } else {
        applyRectToWindow(win, { x, y })
      }
    })

    return wins.length
  }

  function cascadeWindows() {
    state.windows.forEach((win, index) => {
      if (win.mode === 'maximized') ensureNormalGeometryState(win)
      const policy = resolveWindowPolicy(win.itemId)
      const basePoint = policy.placement.defaultPosition ?? DEFAULT_WINDOW_POINT
      const x = basePoint.x + index * CASCADE
      const y = basePoint.y + index * CASCADE

      if (policy.behavior.resizable) {
        applyRectToWindow(win, {
          x,
          y,
          w : policy.size.default.w,
          h : policy.size.default.h,
        })
        return
      }

      applyRectToWindow(win, { x, y })
    })
  }

  function setWindows(windows: WindowState[]) {
    state.windows.length = 0
    for (const saved of windows) {
      const normalized = normalizeRestoredWindow(saved)
      if (!normalized) continue
      state.windows.push(normalized)
    }
    const maxZ = state.windows.reduce((top, win) => Math.max(top, win.zIndex), 102)
    state.nextZIndex = Math.max(state.nextZIndex, maxZ + 1)
    if (state.focusedWindowId) {
      const stillExists = state.windows.some(w => w.id === state.focusedWindowId)
      if (!stillExists) state.focusedWindowId = null
    }
  }

  function setFocusedId(id: string | null) {
    if (id === null) {
      state.focusedWindowId = null
      return
    }
    const win = state.windows.find(w => w.id === id)
    state.focusedWindowId = win && win.mode !== 'minimized' ? win.id : null
  }

  function setNextZIndex(z: number) {
    if (!isFiniteNumber(z)) return
    state.nextZIndex = Math.max(103, Math.floor(z))
  }

  function updateTitlesForLocale(locale: Locale) {
    for (const win of state.windows) {
      win.title = getRegistryTitle(win.itemId, locale)
    }
  }

  return {
    state,
    visibleWindows,
    focusedWindowTitle,
    getWindowPolicy,
    getWindowCapabilities,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximizeWindow,
    focusWindow,
    moveWindowTo,
    resizeWindowTo,
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
