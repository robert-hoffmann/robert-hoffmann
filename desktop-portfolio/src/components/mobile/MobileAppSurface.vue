<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import type { WindowState } from '../../types/desktop'
import MobileWindowFrame from './MobileWindowFrame.vue'

const props = defineProps<{
  windowState : WindowState | null
  isExpanded  : boolean
  title       : string
  canMinimize : boolean
  canMaximize : boolean
}>()

const emit = defineEmits<{
  close          : [windowId: string]
  minimize       : [windowId: string]
  toggleMaximize : [windowId: string]
  focus          : [windowId: string]
}>()

const surfaceRef = ref<HTMLElement | null>(null)
const surfaceShellRef = ref<HTMLElement | null>(null)
/*
 * Avoid loading the current app component while the mobile surface is still
 * minimized on first paint. Once a window is expanded, keep it mounted while
 * that same window remains selected (including when minimized/restored).
 */
const mountedWindowId = ref<string | null>(
  props.windowState && props.isExpanded ? props.windowState.id : null,
)
const shouldRenderWindow = computed(() =>
  Boolean(props.windowState && mountedWindowId.value === props.windowState.id),
)

const SWIPE_AXIS_LOCK_SLOP_PX = 10
const SWIPE_AXIS_LOCK_RATIO = 1.15
const SWIPE_CLOSE_THRESHOLD_RATIO = 0.22
const SWIPE_CLOSE_THRESHOLD_MIN_PX = 96
const SWIPE_SETTLE_MS = 180
const SWIPE_CLOSE_MS = 220

type SwipeAxis = 'x' | 'y' | null

const swipeState = {
  pointerId       : null as number | null,
  startX          : 0,
  startY          : 0,
  deltaX          : 0,
  axis            : null as SwipeAxis,
  isDragging      : false,
  isClosing       : false,
  settleTimeoutId : null as number | null,
}
let swipeDocumentListenersAttached = false

function clearSwipeTimer() {
  if (swipeState.settleTimeoutId === null) return
  window.clearTimeout(swipeState.settleTimeoutId)
  swipeState.settleTimeoutId = null
}

function resetSwipePointerState() {
  swipeState.pointerId = null
  swipeState.startX = 0
  swipeState.startY = 0
  swipeState.deltaX = 0
  swipeState.axis = null
  swipeState.isDragging = false
}

function resetSwipeStyles() {
  const shell = surfaceShellRef.value
  if (!shell) return
  clearSwipeTimer()
  shell.style.transition = ''
  shell.style.transform = ''
  shell.style.opacity = ''
}

function releasePointerCapture(pointerId: number | null) {
  const surface = surfaceRef.value
  if (!surface || pointerId === null) return
  if (!surface.hasPointerCapture(pointerId)) return
  surface.releasePointerCapture(pointerId)
}

function addSwipeDocumentListeners() {
  if (swipeDocumentListenersAttached) return
  swipeDocumentListenersAttached = true
  document.addEventListener('pointermove', onSurfacePointerMove, { passive : false })
  document.addEventListener('pointerup', finishSurfaceSwipe)
  document.addEventListener('pointercancel', finishSurfaceSwipe)
}

function removeSwipeDocumentListeners() {
  if (!swipeDocumentListenersAttached) return
  swipeDocumentListenersAttached = false
  document.removeEventListener('pointermove', onSurfacePointerMove)
  document.removeEventListener('pointerup', finishSurfaceSwipe)
  document.removeEventListener('pointercancel', finishSurfaceSwipe)
}

function canStartSwipeFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return true

  /*
    Keep titlebar controls and common interactive widgets click-first.
    Allow the titlebar background itself as a swipe handle on mobile.
  */
  if (target.closest('.traffic-lights')) return false
  if (target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return false

  return true
}

function onSurfacePointerDown(event: PointerEvent) {
  if (swipeState.isClosing) return
  if (!event.isPrimary) return
  if (!props.windowState || !props.isExpanded) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  if (!canStartSwipeFromTarget(event.target)) return

  clearSwipeTimer()
  resetSwipeStyles()
  resetSwipePointerState()

  swipeState.pointerId = event.pointerId
  swipeState.startX = event.clientX
  swipeState.startY = event.clientY

  const surface = surfaceRef.value
  if (surface) {
    surface.setPointerCapture(event.pointerId)
  }
  addSwipeDocumentListeners()
}

function onSurfacePointerMove(event: PointerEvent) {
  if (swipeState.pointerId !== event.pointerId) return
  if (swipeState.isClosing) return
  if (!props.windowState || !props.isExpanded) return

  const shell = surfaceShellRef.value
  if (!shell) return

  const dx = event.clientX - swipeState.startX
  const dy = event.clientY - swipeState.startY

  if (swipeState.axis === null) {
    if (Math.abs(dx) < SWIPE_AXIS_LOCK_SLOP_PX && Math.abs(dy) < SWIPE_AXIS_LOCK_SLOP_PX) return
    swipeState.axis = Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_LOCK_RATIO ? 'x' : 'y'
  }

  if (swipeState.axis !== 'x') return

  const dragX = Math.min(0, dx)
  if (dragX === 0 && dx >= 0) return

  swipeState.deltaX = dragX
  swipeState.isDragging = true

  const rotateDeg = Math.max(-7, dragX / 28)
  const fade = Math.max(0.62, 1 - Math.abs(dragX) / 360)

  shell.style.transition = 'none'
  shell.style.transform = `translate3d(${dragX}px, 0, 0) rotate(${rotateDeg}deg)`
  shell.style.opacity = String(fade)

  event.preventDefault()
}

function finishSurfaceSwipe(event: PointerEvent) {
  if (swipeState.pointerId !== event.pointerId) return
  if (!props.windowState) {
    removeSwipeDocumentListeners()
    releasePointerCapture(event.pointerId)
    resetSwipePointerState()
    return
  }

  const shell = surfaceShellRef.value
  const windowId = props.windowState.id
  const shouldHandleSwipe = swipeState.axis === 'x' && swipeState.isDragging
  const dragX = swipeState.deltaX

  removeSwipeDocumentListeners()
  releasePointerCapture(event.pointerId)
  resetSwipePointerState()

  if (!shouldHandleSwipe || !shell) return

  const closeThreshold = Math.max(
    SWIPE_CLOSE_THRESHOLD_MIN_PX,
    shell.clientWidth * SWIPE_CLOSE_THRESHOLD_RATIO,
  )

  if (Math.abs(dragX) >= closeThreshold) {
    swipeState.isClosing = true
    const travel = -Math.max(shell.clientWidth + 64, window.innerWidth || 0)
    shell.style.transition = 'transform 220ms var(--ease-out), opacity 220ms var(--ease-out)'
    shell.style.transform = `translate3d(${travel}px, 0, 0) rotate(-8deg)`
    shell.style.opacity = '0.24'

    clearSwipeTimer()
    swipeState.settleTimeoutId = window.setTimeout(() => {
      emit('close', windowId)
      swipeState.isClosing = false
      swipeState.settleTimeoutId = null

      window.requestAnimationFrame(() => {
        resetSwipeStyles()
      })
    }, SWIPE_CLOSE_MS)
    return
  }

  shell.style.transition = 'transform 180ms var(--ease-out), opacity 180ms var(--ease-out)'
  shell.style.transform = 'translate3d(0, 0, 0) rotate(0deg)'
  shell.style.opacity = '1'

  clearSwipeTimer()
  swipeState.settleTimeoutId = window.setTimeout(() => {
    resetSwipeStyles()
    swipeState.settleTimeoutId = null
  }, SWIPE_SETTLE_MS)
}

watch(
  () => [props.windowState?.id ?? null, props.isExpanded] as const,
  ([windowId, isExpanded], previous) => {
    const previousWindowId = previous?.[0] ?? null

    if (!windowId) {
      mountedWindowId.value = null
      return
    }

    if (isExpanded) {
      mountedWindowId.value = windowId
      return
    }

    if (windowId !== previousWindowId) {
      mountedWindowId.value = null
    }
  },
)

watch(
  () => [props.windowState?.id ?? null, props.isExpanded],
  () => {
    swipeState.isClosing = false
    removeSwipeDocumentListeners()
    releasePointerCapture(swipeState.pointerId)
    resetSwipePointerState()
    resetSwipeStyles()
  },
)

onUnmounted(() => {
  removeSwipeDocumentListeners()
  releasePointerCapture(swipeState.pointerId)
  clearSwipeTimer()
})
</script>

<template>
  <section
    ref="surfaceRef"
    class="app-window-content mobile"
    data-mobile-app-surface
    :aria-label="windowState ? title || windowState.title : 'Current mobile app'"
    :aria-hidden="windowState && isExpanded ? 'false' : 'true'"
    :inert="windowState && !isExpanded ? true : undefined"
    @pointerdown.capture="onSurfacePointerDown"
  >
    <div v-if="windowState && shouldRenderWindow" ref="surfaceShellRef" class="mobile-app-surface-shell">
      <MobileWindowFrame
        :key="windowState.id"
        :window-state="windowState"
        :is-focused="isExpanded"
        :can-minimize="canMinimize"
        :can-maximize="canMaximize"
        @close="emit('close', $event)"
        @minimize="emit('minimize', $event)"
        @toggle-maximize="emit('toggleMaximize', $event)"
        @focus="emit('focus', $event)"
      />
    </div>

    <div v-else-if="!windowState" class="mobile-app-surface-empty" aria-live="polite">
      <p class="mobile-app-surface-empty-kicker">Mobile</p>
      <p class="mobile-app-surface-empty-title">Select an app</p>
      <p class="mobile-app-surface-empty-copy">
        Open an app from the grid, then use the dock to hide or restore it.
      </p>
    </div>
  </section>
</template>
