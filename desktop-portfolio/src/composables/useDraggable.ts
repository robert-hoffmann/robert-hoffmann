/* ============================================================
   useDraggable — Pointer-event-based drag composable
   ============================================================ */

import { clamp } from '../utils'
import type { WindowState } from '../types/desktop'

interface DragContext {
  windowId : string
  offsetX  : number
  offsetY  : number
}

let dragCtx: DragContext | null = null

/** Shared drag handlers — only one drag active at a time */
function onDragMove(e: PointerEvent, findWindow: (id: string) => WindowState | undefined) {
  if (!dragCtx) return
  const win = findWindow(dragCtx.windowId)
  if (!win) return

  const minY = 32
  const maxY = window.innerHeight - 60
  const maxX = window.innerWidth - 40

  win.x = clamp(e.clientX - dragCtx.offsetX, 0, maxX)
  win.y = clamp(e.clientY - dragCtx.offsetY, minY, maxY)
}

function onDragEnd() {
  dragCtx = null
  document.removeEventListener('pointermove', boundMove)
  document.removeEventListener('pointerup', onDragEnd)
}

/* We need a closure to pass findWindow through — set during startDrag */
let boundMove: (e: PointerEvent) => void = () => {}

export function useDraggable(findWindow: (id: string) => WindowState | undefined) {
  function startDrag(event: PointerEvent, windowId: string) {
    const win = findWindow(windowId)
    if (!win) return

    dragCtx = {
      windowId,
      offsetX : event.clientX - win.x,
      offsetY : event.clientY - win.y,
    }

    boundMove = (e: PointerEvent) => onDragMove(e, findWindow)
    document.addEventListener('pointermove', boundMove)
    document.addEventListener('pointerup', onDragEnd)
  }

  return { startDrag }
}
