<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'
import {
  SOCIAL_TOAST_DURATION_MS,
  TOAST_ENTRY_EXIT_MS,
  TOAST_STACK_REFLOW_MS,
  TOAST_SWIPE_DISMISS_MS,
  TOAST_SWIPE_SETTLE_MS,
} from '../constants/notificationTimings'

type NotificationStackVariant = 'mobile' | 'desktop'
type MobileToastCtaVariant = 'soft' | 'outline' | 'accent'
type ToastEntryOrigin = 'top' | 'stack'
type SwipeAxis = 'x' | 'y' | null

interface MobileToastOptions {
  title? : string
  message? : string
  duration? : number
  url? : string
  ctaLabel? : string
  ctaVariants? : string[]
}

interface MobileToastItem {
  id : number
  title : string
  message : string
  duration : number
  url : string
  ctaLabel : string
  ctaVariants : MobileToastCtaVariant[]
  visible : boolean
  closing : boolean
  entryOrigin : ToastEntryOrigin
  timeLabel : string
}

interface ToastSwipeState {
  pointerId : number | null
  startX : number
  startY : number
  deltaX : number
  axis : SwipeAxis
  isDragging : boolean
  isClosing : boolean
}

interface ToastRuntimeRecord {
  hideTimerId : number | null
  settleTimerId : number | null
  removeTimerId : number | null
  ignoreNextClick : boolean
  activeLinkUrl : string
  swipe : ToastSwipeState
}

const props = withDefaults(defineProps<{
  variant? : NotificationStackVariant
}>(), {
  variant : 'desktop',
})

const DEFAULT_TOAST_TITLE = 'Portfolio'
const DEFAULT_TOAST_MESSAGE = 'Test mobile notification'
const DEFAULT_TOAST_DURATION_MS = SOCIAL_TOAST_DURATION_MS
const DEFAULT_TOAST_CTA_LABEL = 'Click to open'

const SWIPE_AXIS_LOCK_SLOP_PX = 8
const SWIPE_AXIS_LOCK_RATIO = 1.1
const SWIPE_CLOSE_THRESHOLD_MIN_PX = 72
const SWIPE_CLOSE_THRESHOLD_RATIO = 0.2

const ALLOWED_CTA_VARIANTS = new Set<MobileToastCtaVariant>([
  'soft',
  'outline',
  'accent',
])

const toastItems = ref<MobileToastItem[]>([])

const toastElementById = new Map<number, HTMLElement>()
const toastRuntimeById = new Map<number, ToastRuntimeRecord>()

let nextToastId = 1

function createToastRuntimeRecord(url: string): ToastRuntimeRecord {
  return {
    hideTimerId    : null,
    settleTimerId  : null,
    removeTimerId  : null,
    ignoreNextClick: false,
    activeLinkUrl  : url,
    swipe          : {
      pointerId   : null,
      startX      : 0,
      startY      : 0,
      deltaX      : 0,
      axis        : null,
      isDragging  : false,
      isClosing   : false,
    },
  }
}

function findToastIndex(toastId: number) {
  return toastItems.value.findIndex(item => item.id === toastId)
}

function findToastItem(toastId: number) {
  const index = findToastIndex(toastId)
  return index >= 0 ? toastItems.value[index] : null
}

function normalizeToastCtaVariants(value: string[] | undefined): MobileToastCtaVariant[] {
  if (!Array.isArray(value)) return []

  return value
    .map((variant) => String(variant).trim().toLowerCase())
    .filter((variant, index, array): variant is MobileToastCtaVariant =>
      ALLOWED_CTA_VARIANTS.has(variant as MobileToastCtaVariant) &&
      array.indexOf(variant) === index,
    )
    .map(variant => variant as MobileToastCtaVariant)
}

function formatToastTime() {
  try {
    return new Date().toLocaleTimeString([], {
      hour      : '2-digit',
      minute    : '2-digit',
      hour12    : false,
      hourCycle : 'h23',
    }).toLowerCase()
  } catch {
    return 'now'
  }
}

function setToastElementRef(toastId: number, element: unknown) {
  if (element instanceof HTMLElement) {
    toastElementById.set(toastId, element)
    return
  }

  toastElementById.delete(toastId)
}

function getToastElement(toastId: number) {
  return toastElementById.get(toastId) ?? null
}

function clearToastTimers(toastId: number) {
  const record = toastRuntimeById.get(toastId)
  if (!record) return

  if (record.hideTimerId !== null) {
    window.clearTimeout(record.hideTimerId)
    record.hideTimerId = null
  }

  if (record.settleTimerId !== null) {
    window.clearTimeout(record.settleTimerId)
    record.settleTimerId = null
  }

  if (record.removeTimerId !== null) {
    window.clearTimeout(record.removeTimerId)
    record.removeTimerId = null
  }
}

function clearToastHideTimer(toastId: number) {
  const record = toastRuntimeById.get(toastId)
  if (!record) return

  if (record.hideTimerId !== null) {
    window.clearTimeout(record.hideTimerId)
    record.hideTimerId = null
  }
}

function resetToastSwipePointerState(toastId: number) {
  const record = toastRuntimeById.get(toastId)
  if (!record) return

  record.swipe.pointerId = null
  record.swipe.startX = 0
  record.swipe.startY = 0
  record.swipe.deltaX = 0
  record.swipe.axis = null
  record.swipe.isDragging = false
  record.swipe.isClosing = false
}

function resetMobileToastGestureStyles(toastId: number) {
  const toastElement = getToastElement(toastId)
  if (!toastElement) return

  toastElement.style.transition = ''
  toastElement.style.transform = ''
  toastElement.style.opacity = ''
}

function getMountedToastElements() {
  return toastItems.value
    .map(item => ({
      id      : item.id,
      element  : getToastElement(item.id),
    }))
    .filter((entry): entry is { id: number; element: HTMLElement } => entry.element instanceof HTMLElement)
}

function measureToastTopMap() {
  const topMap = new Map<number, number>()

  for (const { id, element } of getMountedToastElements()) {
    topMap.set(id, element.getBoundingClientRect().top)
  }

  return topMap
}

function animateToastStackReflow(previousTopByToastId: Map<number, number>) {
  if (!(previousTopByToastId instanceof Map) || previousTopByToastId.size === 0) return

  for (const { id, element } of getMountedToastElements()) {
    const previousTop = previousTopByToastId.get(id)
    if (typeof previousTop !== 'number') continue

    const nextTop = element.getBoundingClientRect().top
    const deltaY = previousTop - nextTop
    if (!Number.isFinite(deltaY) || Math.abs(deltaY) < 0.5) continue

    element.style.transition = 'none'
    element.style.transform = `translate3d(0, ${deltaY}px, 0)`

    window.requestAnimationFrame(() => {
      if (!element.isConnected) return

      element.style.transition = `transform ${TOAST_STACK_REFLOW_MS}ms var(--ease-spring)`
      element.style.transform = 'translate3d(0, 0, 0)'

      const record = toastRuntimeById.get(id)
      if (!record) return

      if (record.settleTimerId !== null) {
        window.clearTimeout(record.settleTimerId)
      }

      record.settleTimerId = window.setTimeout(() => {
        if (!element.isConnected) return

        /* Preserve inline opacity if another dismiss animation is running. */
        element.style.transition = ''
        element.style.transform = ''
        record.settleTimerId = null
      }, TOAST_STACK_REFLOW_MS)
    })
  }
}

async function finalizeToastRemoval(toastId: number, previousTopByToastId: Map<number, number>) {
  clearToastTimers(toastId)
  toastRuntimeById.delete(toastId)
  toastElementById.delete(toastId)

  const nextItems = toastItems.value.filter(item => item.id !== toastId)
  if (nextItems.length === toastItems.value.length) return
  toastItems.value = nextItems

  await nextTick()
  animateToastStackReflow(previousTopByToastId)
}

function hideToast(
  toastId: number,
  options: {
    preserveGestureStyles? : boolean
    exitBySwipe? : boolean
  } = {},
) {
  const toastItem = findToastItem(toastId)
  const record = toastRuntimeById.get(toastId)
  if (!toastItem || !record) return
  if (toastItem.closing) return

  const {
    preserveGestureStyles = false,
    exitBySwipe = false,
  } = options

  clearToastTimers(toastId)
  record.activeLinkUrl = ''
  record.ignoreNextClick = false
  record.swipe.isClosing = true

  const previousTopByToastId = measureToastTopMap()
  toastItem.closing = true
  toastItem.visible = false

  if (!preserveGestureStyles && !exitBySwipe) {
    resetMobileToastGestureStyles(toastId)
  }

  record.removeTimerId = window.setTimeout(() => {
    void finalizeToastRemoval(toastId, previousTopByToastId)
  }, TOAST_ENTRY_EXIT_MS)
}

function scheduleAutoHide(toastId: number, durationMs: number) {
  const record = toastRuntimeById.get(toastId)
  if (!record) return

  clearToastHideTimer(toastId)
  record.hideTimerId = window.setTimeout(() => {
    hideToast(toastId)
  }, Math.max(900, Number(durationMs) || 0))
}

function dismissToastBySwipe(toastId: number) {
  const toastElement = getToastElement(toastId)
  const record = toastRuntimeById.get(toastId)
  const toastItem = findToastItem(toastId)
  if (!toastElement || !record || !toastItem) return
  if (!toastItem.visible) return

  record.swipe.isClosing = true
  record.ignoreNextClick = true
  clearToastTimers(toastId)

  const travel = -Math.max(toastElement.clientWidth + 28, 260)
  toastElement.style.transition = `transform ${TOAST_SWIPE_DISMISS_MS}ms var(--ease-out), opacity ${TOAST_SWIPE_DISMISS_MS}ms var(--ease-out)`
  toastElement.style.transform = `translate3d(${travel}px, 0, 0) rotate(-4deg)`
  toastElement.style.opacity = '0.2'

  record.settleTimerId = window.setTimeout(() => {
    hideToast(toastId, { preserveGestureStyles : true, exitBySwipe : true })
    record.swipe.isClosing = false
    record.settleTimerId = null

    window.requestAnimationFrame(() => {
      resetMobileToastGestureStyles(toastId)
    })
  }, TOAST_SWIPE_DISMISS_MS)
}

function releasePointerCapture(toastId: number, pointerId: number | null) {
  const toastElement = getToastElement(toastId)
  if (!toastElement || pointerId === null) return
  if (!toastElement.hasPointerCapture(pointerId)) return
  toastElement.releasePointerCapture(pointerId)
}

function onToastPointerDown(event: PointerEvent, toastId: number) {
  const toastItem = findToastItem(toastId)
  const record = toastRuntimeById.get(toastId)
  if (!toastItem || !record) return
  if (!toastItem.visible) return
  if (record.swipe.isClosing) return
  if (!event.isPrimary) return
  if (event.pointerType === 'mouse' && event.button !== 0) return

  clearToastTimers(toastId)
  record.swipe.pointerId = event.pointerId
  record.swipe.startX = event.clientX
  record.swipe.startY = event.clientY
  record.swipe.deltaX = 0
  record.swipe.axis = null
  record.swipe.isDragging = false

  const toastElement = getToastElement(toastId)
  if (toastElement) {
    toastElement.setPointerCapture(event.pointerId)
  }
}

function onToastPointerMove(event: PointerEvent, toastId: number) {
  const toastElement = getToastElement(toastId)
  const record = toastRuntimeById.get(toastId)
  if (!toastElement || !record) return
  if (record.swipe.pointerId !== event.pointerId) return
  if (record.swipe.isClosing) return

  const dx = event.clientX - record.swipe.startX
  const dy = event.clientY - record.swipe.startY

  if (record.swipe.axis === null) {
    if (Math.abs(dx) < SWIPE_AXIS_LOCK_SLOP_PX && Math.abs(dy) < SWIPE_AXIS_LOCK_SLOP_PX) return
    record.swipe.axis = Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_LOCK_RATIO ? 'x' : 'y'
  }

  if (record.swipe.axis !== 'x') return

  const dragX = Math.min(0, dx)
  if (dragX === 0 && dx >= 0) return

  record.swipe.deltaX = dragX
  record.swipe.isDragging = true

  const fade = Math.max(0.4, 1 - Math.abs(dragX) / 220)
  toastElement.style.transition = 'none'
  toastElement.style.transform = `translate3d(${dragX}px, 0, 0)`
  toastElement.style.opacity = String(fade)

  event.preventDefault()
}

function finishToastSwipe(event: PointerEvent, toastId: number) {
  const record = toastRuntimeById.get(toastId)
  const toastItem = findToastItem(toastId)
  const toastElement = getToastElement(toastId)
  if (!record || !toastItem || !toastElement) return
  if (record.swipe.pointerId !== event.pointerId) return

  const shouldHandleSwipe = record.swipe.axis === 'x' && record.swipe.isDragging
  const dragX = record.swipe.deltaX

  releasePointerCapture(toastId, event.pointerId)

  record.ignoreNextClick = shouldHandleSwipe
  resetToastSwipePointerState(toastId)

  if (!shouldHandleSwipe) {
    if (toastItem.visible) {
      scheduleAutoHide(toastId, toastItem.duration)
    }
    return
  }

  const closeThreshold = Math.max(
    SWIPE_CLOSE_THRESHOLD_MIN_PX,
    toastElement.clientWidth * SWIPE_CLOSE_THRESHOLD_RATIO,
  )

  if (Math.abs(dragX) >= closeThreshold) {
    dismissToastBySwipe(toastId)
    return
  }

  toastElement.style.transition = `transform ${TOAST_SWIPE_SETTLE_MS}ms var(--ease-out), opacity ${TOAST_SWIPE_SETTLE_MS}ms var(--ease-out)`
  toastElement.style.transform = 'translate3d(0, 0, 0)'
  toastElement.style.opacity = '1'

  if (record.settleTimerId !== null) {
    window.clearTimeout(record.settleTimerId)
  }

  record.settleTimerId = window.setTimeout(() => {
    resetMobileToastGestureStyles(toastId)
    record.settleTimerId = null
  }, TOAST_SWIPE_SETTLE_MS)

  scheduleAutoHide(toastId, toastItem.duration)
}

function onToastClick(event: MouseEvent, toastId: number) {
  const toastItem = findToastItem(toastId)
  const record = toastRuntimeById.get(toastId)
  if (!toastItem || !record) return
  if (!toastItem.visible) return

  if (record.ignoreNextClick) {
    record.ignoreNextClick = false
    event.preventDefault()
    return
  }

  const url = record.activeLinkUrl
  if (!url) return

  event.preventDefault()

  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener')
  }

  hideToast(toastId)
}

async function showToast(options: MobileToastOptions = {}) {
  const title = String(options.title ?? DEFAULT_TOAST_TITLE)
  const message = String(options.message ?? DEFAULT_TOAST_MESSAGE)
  const duration = Math.max(900, Number(options.duration) || DEFAULT_TOAST_DURATION_MS)
  const url = typeof options.url === 'string' ? options.url : ''
  const ctaLabel = String(options.ctaLabel ?? DEFAULT_TOAST_CTA_LABEL)
  const normalizedCtaVariants = normalizeToastCtaVariants(options.ctaVariants)
  const ctaVariants = url
    ? (normalizedCtaVariants.length
        ? normalizedCtaVariants
        : (['soft'] as MobileToastCtaVariant[]))
    : []

  const toastId = nextToastId++
  const entryOrigin: ToastEntryOrigin = toastItems.value.length > 0 ? 'stack' : 'top'

  const toastItem: MobileToastItem = {
    id         : toastId,
    title,
    message,
    duration,
    url,
    ctaLabel,
    ctaVariants,
    visible    : false,
    closing    : false,
    entryOrigin,
    timeLabel  : formatToastTime(),
  }

  toastItems.value = [...toastItems.value, toastItem]
  toastRuntimeById.set(toastId, createToastRuntimeRecord(url))

  await nextTick()

  const mountedToast = findToastItem(toastId)
  const toastElement = getToastElement(toastId)
  if (!mountedToast || !toastElement) return

  void toastElement.offsetHeight
  mountedToast.visible = true
  scheduleAutoHide(toastId, duration)
}

function dismissAllToasts() {
  const toastIds = toastItems.value.map(item => item.id)
  for (const toastId of toastIds) {
    clearToastTimers(toastId)
    toastRuntimeById.delete(toastId)
    toastElementById.delete(toastId)
  }

  toastItems.value = []
}

defineExpose({
  showToast,
  dismissAllToasts,
})

onUnmounted(() => {
  for (const toastId of toastItems.value.map(item => item.id)) {
    releasePointerCapture(toastId, toastRuntimeById.get(toastId)?.swipe.pointerId ?? null)
    clearToastTimers(toastId)
  }

  toastRuntimeById.clear()
  toastElementById.clear()
})
</script>

<template>
  <div
    class="notification-toast-stack"
    :class="`notification-toast-stack--${props.variant}`"
    aria-live="polite"
    aria-relevant="additions text"
  >
    <aside
      v-for="toast in toastItems"
      :key="toast.id"
      :ref="(el) => setToastElementRef(toast.id, el)"
      class="notification-toast-card"
      :class="`notification-toast-card--${props.variant}`"
      :data-visible="toast.visible ? 'true' : 'false'"
      :data-clickable="toast.url && toast.visible && !toast.closing ? 'true' : 'false'"
      :data-closing="toast.closing ? 'true' : 'false'"
      :data-entry-origin="toast.entryOrigin"
      role="status"
      aria-atomic="true"
      :aria-hidden="toast.visible ? 'false' : 'true'"
      @pointerdown="onToastPointerDown($event, toast.id)"
      @pointermove="onToastPointerMove($event, toast.id)"
      @pointerup="finishToastSwipe($event, toast.id)"
      @pointercancel="finishToastSwipe($event, toast.id)"
      @click="onToastClick($event, toast.id)"
    >
      <div class="notification-toast-meta">
        <span class="notification-toast-app">Portfolio</span>
        <span class="notification-toast-time">{{ toast.timeLabel }}</span>
      </div>

      <div class="notification-toast-title">{{ toast.title }}</div>
      <div class="notification-toast-message">{{ toast.message }}</div>

      <div
        class="notification-toast-cta-list"
        :hidden="!toast.url || toast.ctaVariants.length === 0"
        aria-hidden="true"
      >
        <div
          v-for="variant in toast.ctaVariants"
          :key="`${toast.id}-${variant}`"
          class="notification-toast-cta-bar"
          :class="`notification-toast-cta-bar--${variant}`"
          aria-hidden="true"
        >
          <span class="notification-toast-cta-bar-label">
            <span class="notification-toast-cta-bar-icon">↗</span>
            <span>{{ toast.ctaLabel }}</span>
          </span>
          <span class="notification-toast-cta-bar-trailing">Open</span>
        </div>
      </div>
    </aside>
  </div>
</template>
