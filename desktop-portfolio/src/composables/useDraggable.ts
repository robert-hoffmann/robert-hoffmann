/* ============================================================
   useDraggable — Pointer-event-based drag composable
   ============================================================
   Tracks pointer offsets only; window manager owns geometry rules.
   ============================================================ */

import type { WindowState } from '../types/desktop'

interface DragContext {
  windowId     : string
  offsetX      : number
  offsetY      : number
  pointerId    : number
  captureTarget: Element | null
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

function cleanupDrag() {
  const ctx = dragCtx
  dragCtx = null

  if (ctx?.captureTarget instanceof Element && 'releasePointerCapture' in ctx.captureTarget) {
    try {
      ;(ctx.captureTarget as Element & { releasePointerCapture(pointerId: number): void })
        .releasePointerCapture(ctx.pointerId)
    } catch {
      /* Pointer capture may already be released/canceled. */
    }
  }

  document.removeEventListener('pointermove', boundMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointercancel', onPointerCancel)
}

function onPointerUp() {
  cleanupDrag()
}

function onPointerCancel() {
  cleanupDrag()
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
    event.preventDefault()

    let captureTarget: Element | null = null
    if (event.currentTarget instanceof Element && 'setPointerCapture' in event.currentTarget) {
      try {
        ;(event.currentTarget as Element & { setPointerCapture(pointerId: number): void })
          .setPointerCapture(event.pointerId)
        captureTarget = event.currentTarget
      } catch {
        /* Ignore capture failures; document listeners remain as fallback. */
      }
    }

    dragCtx = {
      windowId,
      offsetX : event.clientX - win.x,
      offsetY : event.clientY - win.y,
      pointerId : event.pointerId,
      captureTarget,
    }

    boundMove = (e: PointerEvent) => onDragMove(e, findWindow, moveWindowTo)
    document.addEventListener('pointermove', boundMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointercancel', onPointerCancel)
  }

  return { startDrag }
}
