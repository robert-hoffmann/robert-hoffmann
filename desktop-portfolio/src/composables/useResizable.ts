/* ============================================================
   useResizable — Pointer-event-based resize composable
   ============================================================
   Tracks pointer deltas only; window manager owns size constraints.
   ============================================================ */

import type { WindowRect, WindowResizeHandle, WindowState } from '../types/desktop'

interface ResizeWindowFromHandleFn {
  (id: string, options: {
    handle    : WindowResizeHandle
    startRect : WindowRect
    dx        : number
    dy        : number
  }): void
}

interface ResizeContext {
  windowId   : string
  handle     : WindowResizeHandle
  startX     : number
  startY     : number
  startRect  : WindowRect
}

let resizeCtx: ResizeContext | null = null
let boundResizeMove: (e: PointerEvent) => void = () => {}

function onResizeMove(
  e                    : PointerEvent,
  findWindow           : (id: string) => WindowState | undefined,
  resizeWindowFromHandle: ResizeWindowFromHandleFn,
) {
  if (!resizeCtx) return
  const win = findWindow(resizeCtx.windowId)
  if (!win) return

  const dx = e.clientX - resizeCtx.startX
  const dy = e.clientY - resizeCtx.startY

  resizeWindowFromHandle(resizeCtx.windowId, {
    handle    : resizeCtx.handle,
    startRect : resizeCtx.startRect,
    dx,
    dy,
  })
}

function onResizeEnd() {
  resizeCtx = null
  document.removeEventListener('pointermove', boundResizeMove)
  document.removeEventListener('pointerup', onResizeEnd)
}

export function useResizable(
  findWindow           : (id: string) => WindowState | undefined,
  resizeWindowFromHandle: ResizeWindowFromHandleFn,
) {
  function startResize(
    event    : PointerEvent,
    windowId : string,
    handle   : WindowResizeHandle = 'se',
  ) {
    const win = findWindow(windowId)
    if (!win) return
    event.preventDefault()

    resizeCtx = {
      windowId,
      handle,
      startX : event.clientX,
      startY : event.clientY,
      startRect : {
        x : win.x,
        y : win.y,
        w : win.w,
        h : win.h,
      },
    }

    boundResizeMove = (e: PointerEvent) => onResizeMove(e, findWindow, resizeWindowFromHandle)
    document.addEventListener('pointermove', boundResizeMove)
    document.addEventListener('pointerup', onResizeEnd)
  }

  return { startResize }
}
