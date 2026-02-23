/* ============================================================
   useResizable — Pointer-event-based resize composable
   ============================================================
   Tracks pointer deltas only; window manager owns size constraints.
   ============================================================ */

import type { WindowState } from '../types/desktop'

interface ResizeContext {
  windowId : string
  startX   : number
  startY   : number
  startW   : number
  startH   : number
}

let resizeCtx: ResizeContext | null = null
let boundResizeMove: (e: PointerEvent) => void = () => {}

function onResizeMove(
  e            : PointerEvent,
  findWindow   : (id: string) => WindowState | undefined,
  resizeWindowTo: (id: string, w: number, h: number) => void,
) {
  if (!resizeCtx) return
  const win = findWindow(resizeCtx.windowId)
  if (!win) return

  const dx = e.clientX - resizeCtx.startX
  const dy = e.clientY - resizeCtx.startY

  resizeWindowTo(
    resizeCtx.windowId,
    resizeCtx.startW + dx,
    resizeCtx.startH + dy,
  )
}

function onResizeEnd() {
  resizeCtx = null
  document.removeEventListener('pointermove', boundResizeMove)
  document.removeEventListener('pointerup', onResizeEnd)
}

export function useResizable(
  findWindow   : (id: string) => WindowState | undefined,
  resizeWindowTo: (id: string, w: number, h: number) => void,
) {
  function startResize(event: PointerEvent, windowId: string) {
    const win = findWindow(windowId)
    if (!win) return

    resizeCtx = {
      windowId,
      startX : event.clientX,
      startY : event.clientY,
      startW : win.w,
      startH : win.h,
    }

    boundResizeMove = (e: PointerEvent) => onResizeMove(e, findWindow, resizeWindowTo)
    document.addEventListener('pointermove', boundResizeMove)
    document.addEventListener('pointerup', onResizeEnd)
  }

  return { startResize }
}
