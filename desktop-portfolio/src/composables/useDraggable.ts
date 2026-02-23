/* ============================================================
   useDraggable — Pointer-event-based drag composable
   ============================================================
   Tracks pointer offsets only; window manager owns geometry rules.
   ============================================================ */

import type { WindowState } from '../types/desktop'

interface DragContext {
  windowId : string
  offsetX  : number
  offsetY  : number
}

let dragCtx: DragContext | null = null

/** Shared drag handlers — only one drag active at a time */
function onDragMove(
  e            : PointerEvent,
  findWindow   : (id: string) => WindowState | undefined,
  moveWindowTo : (id: string, x: number, y: number) => void,
) {
  if (!dragCtx) return
  const win = findWindow(dragCtx.windowId)
  if (!win) return

  moveWindowTo(
    dragCtx.windowId,
    e.clientX - dragCtx.offsetX,
    e.clientY - dragCtx.offsetY,
  )
}

function onDragEnd() {
  dragCtx = null
  document.removeEventListener('pointermove', boundMove)
  document.removeEventListener('pointerup', onDragEnd)
}

/* We need a closure to pass findWindow through — set during startDrag */
let boundMove: (e: PointerEvent) => void = () => {}

export function useDraggable(
  findWindow  : (id: string) => WindowState | undefined,
  moveWindowTo: (id: string, x: number, y: number) => void,
) {
  function startDrag(event: PointerEvent, windowId: string) {
    const win = findWindow(windowId)
    if (!win) return

    dragCtx = {
      windowId,
      offsetX : event.clientX - win.x,
      offsetY : event.clientY - win.y,
    }

    boundMove = (e: PointerEvent) => onDragMove(e, findWindow, moveWindowTo)
    document.addEventListener('pointermove', boundMove)
    document.addEventListener('pointerup', onDragEnd)
  }

  return { startDrag }
}
