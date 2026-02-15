/* ============================================================
   useResizable — Pointer-event-based resize composable
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

function onResizeMove(e: PointerEvent, findWindow: (id: string) => WindowState | undefined) {
  if (!resizeCtx) return
  const win = findWindow(resizeCtx.windowId)
  if (!win) return

  const dx = e.clientX - resizeCtx.startX
  const dy = e.clientY - resizeCtx.startY

  win.w = Math.max(320, resizeCtx.startW + dx)
  win.h = Math.max(200, resizeCtx.startH + dy)
}

function onResizeEnd() {
  resizeCtx = null
  document.removeEventListener('pointermove', boundResizeMove)
  document.removeEventListener('pointerup', onResizeEnd)
}

export function useResizable(findWindow: (id: string) => WindowState | undefined) {
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

    boundResizeMove = (e: PointerEvent) => onResizeMove(e, findWindow)
    document.addEventListener('pointermove', boundResizeMove)
    document.addEventListener('pointerup', onResizeEnd)
  }

  return { startResize }
}
