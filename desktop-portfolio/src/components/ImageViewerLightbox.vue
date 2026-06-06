<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import type { ImageViewerSlide } from '../data/apps/gallery'
import {
  buildCarouselSlides,
  handleCarouselTrackScrollEnd,
  logicalIndexToTrackIndex as getLogicalTrackIndex,
  normalizeCarouselIndex,
  scrollElementToTrackIndex,
  setTrackElementFreeDrag,
  snapTrackElementToNearestSlide,
} from '../composables/useCarouselSnapTrack'

const FULLSCREEN_MIN_SCALE        = 1
const FULLSCREEN_MAX_SCALE        = 4
const FULLSCREEN_DOUBLE_TAP_SCALE = 2.25
const FULLSCREEN_GESTURE_SLOP_PX  = 8
const FULLSCREEN_CLOSE_THRESHOLD  = 72
const FULLSCREEN_AXIS_LOCK_RATIO  = 1.15
const FULLSCREEN_ZOOM_EPSILON     = 0.01
const DOUBLE_TAP_MAX_DELAY_MS     = 300
const DOUBLE_TAP_MAX_DISTANCE_PX  = 30

type FullscreenGestureMode = 'idle' | 'pan' | 'pinch' | 'swipe' | 'close'

interface GesturePoint {
  pointerId : number
  x         : number
  y         : number
}

interface FullscreenTapState {
  pointerId   : number | null
  startX      : number
  startY      : number
  startTime   : number
  lastTapX    : number
  lastTapY    : number
  lastTapTime : number
}

interface FullscreenGestureState {
  pointerId       : number | null
  startX          : number
  startY          : number
  startTranslateX : number
  startTranslateY : number
  startScrollLeft : number
  startScale      : number
  startDistance   : number
  startCenterX    : number
  startCenterY    : number
  dragged         : boolean
}

const props = defineProps<{
  slides        : readonly [ImageViewerSlide, ...ImageViewerSlide[]]
  selectedIndex : number
  closeLabel    : string
  closeText     : string
  hintText      : string
  slideTitle    : (slide: ImageViewerSlide) => string
  slideAlt      : (slide: ImageViewerSlide) => string
}>()

const emit = defineEmits<{
  close                  : []
  'update:selectedIndex' : [index: number]
}>()

const fullscreenOverlayEl  = ref<HTMLElement | null>(null)
const fullscreenStageEl    = ref<HTMLElement | null>(null)
const fullscreenTrackEl    = ref<HTMLElement | null>(null)
const fullscreenImageEl    = ref<HTMLImageElement | null>(null)
const fullscreenScale      = ref(FULLSCREEN_MIN_SCALE)
const fullscreenTranslateX = ref(0)
const fullscreenTranslateY = ref(0)
const fullscreenDismissY   = ref(0)
const fullscreenGestureMode = ref<FullscreenGestureMode>('idle')

const fullscreenPointers = new Map<number, GesturePoint>()

const fullscreenTapState: FullscreenTapState = {
  pointerId   : null,
  startX      : 0,
  startY      : 0,
  startTime   : 0,
  lastTapX    : 0,
  lastTapY    : 0,
  lastTapTime : 0,
}

const fullscreenGestureState: FullscreenGestureState = {
  pointerId       : null,
  startX          : 0,
  startY          : 0,
  startTranslateX : 0,
  startTranslateY : 0,
  startScrollLeft : 0,
  startScale      : FULLSCREEN_MIN_SCALE,
  startDistance   : 0,
  startCenterX    : 0,
  startCenterY    : 0,
  dragged         : false,
}

const slideCount = computed(() => props.slides.length)
const fullscreenSlide = computed<ImageViewerSlide>(() =>
  props.slides[props.selectedIndex] ?? props.slides[0],
)
const carouselSlides = computed(() => buildCarouselSlides(props.slides))
const isFullscreenZoomed = computed(() =>
  fullscreenScale.value > FULLSCREEN_MIN_SCALE + FULLSCREEN_ZOOM_EPSILON,
)
const isFullscreenCloseLocked = computed(() =>
  fullscreenGestureMode.value === 'pan' || fullscreenGestureMode.value === 'pinch',
)
const fullscreenImageStyle = computed(() =>
  `transform: translate3d(${fullscreenTranslateX.value}px, ${fullscreenTranslateY.value}px, 0) ` +
  `scale(${fullscreenScale.value});`,
)
const fullscreenOverlayStyle = computed(() => {
  if (fullscreenDismissY.value <= 0) return ''

  const opacity = Math.max(0.46, 1 - fullscreenDismissY.value / 360)

  return `transform: translate3d(0, ${fullscreenDismissY.value}px, 0); opacity: ${opacity};`
})
const fullscreenCounterText = computed(() =>
  `${props.selectedIndex + 1} / ${slideCount.value}`,
)

function normalizeIndex(index: number) {
  if (slideCount.value <= 0) return 0

  return normalizeCarouselIndex(index, slideCount.value)
}

function logicalIndexToTrackIndex(index: number) {
  return getLogicalTrackIndex(index, slideCount.value)
}

function setSelectedIndex(index: number) {
  emit('update:selectedIndex', normalizeIndex(index))
}

function scrollFullscreenTrackToTrackIndex(
  trackIndex: number,
  behavior: ScrollBehavior,
) {
  scrollElementToTrackIndex(fullscreenTrackEl.value, trackIndex, behavior)
}

function snapFullscreenTrackToNearestSlide(behavior: ScrollBehavior = 'smooth') {
  snapTrackElementToNearestSlide(fullscreenTrackEl.value, behavior)
}

function setFullscreenTrackFreeDrag(enabled: boolean) {
  setTrackElementFreeDrag(fullscreenTrackEl.value, enabled)
}

function getPointDistance(first: GesturePoint, second: GesturePoint) {
  return Math.hypot(first.x - second.x, first.y - second.y)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getFullscreenLocalPoint(clientX: number, clientY: number) {
  const stage = fullscreenStageEl.value

  if (!stage) {
    return {
      x : 0,
      y : 0,
    }
  }

  const rect = stage.getBoundingClientRect()

  return {
    x : clientX - rect.left - rect.width / 2,
    y : clientY - rect.top - rect.height / 2,
  }
}

function getFullscreenPinchMetrics() {
  const points = Array.from(fullscreenPointers.values())
  const first  = points[0]
  const second = points[1]

  if (!first || !second) return null

  const centerX = (first.x + second.x) / 2
  const centerY = (first.y + second.y) / 2
  const local   = getFullscreenLocalPoint(centerX, centerY)

  return {
    distance : getPointDistance(first, second),
    x        : local.x,
    y        : local.y,
  }
}

function clampFullscreenTranslate(scale: number, x: number, y: number) {
  const stage = fullscreenStageEl.value
  const image = fullscreenImageEl.value

  if (!stage || !image || scale <= FULLSCREEN_MIN_SCALE + FULLSCREEN_ZOOM_EPSILON) {
    return {
      x : 0,
      y : 0,
    }
  }

  const stageRect   = stage.getBoundingClientRect()
  const imageWidth  = image.clientWidth || stageRect.width
  const imageHeight = image.clientHeight || stageRect.height
  const maxX        = Math.max((imageWidth * scale - stageRect.width) / 2, 0)
  const maxY        = Math.max((imageHeight * scale - stageRect.height) / 2, 0)

  return {
    x : clamp(x, -maxX, maxX),
    y : clamp(y, -maxY, maxY),
  }
}

function applyFullscreenTransform(scale: number, x: number, y: number) {
  const nextScale = clamp(scale, FULLSCREEN_MIN_SCALE, FULLSCREEN_MAX_SCALE)
  const nextPan   = clampFullscreenTranslate(nextScale, x, y)

  fullscreenScale.value      = nextScale
  fullscreenTranslateX.value = nextPan.x
  fullscreenTranslateY.value = nextPan.y
}

function resetFullscreenZoom() {
  fullscreenDismissY.value = 0
  applyFullscreenTransform(FULLSCREEN_MIN_SCALE, 0, 0)
}

function releaseFullscreenPointerCapture(pointerId: number) {
  const stage = fullscreenStageEl.value

  if (!stage?.hasPointerCapture(pointerId)) return

  stage.releasePointerCapture(pointerId)
}

function resetFullscreenGestureState() {
  fullscreenPointers.forEach(point => releaseFullscreenPointerCapture(point.pointerId))
  fullscreenPointers.clear()
  setFullscreenTrackFreeDrag(false)

  fullscreenGestureState.pointerId       = null
  fullscreenGestureState.startX          = 0
  fullscreenGestureState.startY          = 0
  fullscreenGestureState.startTranslateX = 0
  fullscreenGestureState.startTranslateY = 0
  fullscreenGestureState.startScrollLeft = 0
  fullscreenGestureState.startScale      = FULLSCREEN_MIN_SCALE
  fullscreenGestureState.startDistance   = 0
  fullscreenGestureState.startCenterX    = 0
  fullscreenGestureState.startCenterY    = 0
  fullscreenGestureState.dragged         = false
  fullscreenGestureMode.value            = 'idle'
  fullscreenDismissY.value               = 0
  fullscreenTapState.pointerId           = null
  fullscreenTapState.lastTapTime         = 0
}

function requestClose(force = false) {
  if (!force && isFullscreenCloseLocked.value) return

  emit('close')
}

function zoomFullscreenAtPoint(clientX: number, clientY: number, scale: number) {
  const local      = getFullscreenLocalPoint(clientX, clientY)
  const nextScale  = clamp(scale, FULLSCREEN_MIN_SCALE, FULLSCREEN_MAX_SCALE)
  const scaleRatio = nextScale / fullscreenScale.value
  const nextX      = local.x - (local.x - fullscreenTranslateX.value) * scaleRatio
  const nextY      = local.y - (local.y - fullscreenTranslateY.value) * scaleRatio

  applyFullscreenTransform(nextScale, nextX, nextY)
}

function toggleFullscreenZoom(clientX: number, clientY: number) {
  if (isFullscreenZoomed.value) {
    resetFullscreenZoom()
    return
  }

  zoomFullscreenAtPoint(clientX, clientY, FULLSCREEN_DOUBLE_TAP_SCALE)
}

function getAdjacentSlideTarget(direction: 'previous' | 'next') {
  const currentIndex = props.selectedIndex
  const isPrevious   = direction === 'previous'
  const targetIndex  = normalizeIndex(currentIndex + (isPrevious ? -1 : 1))
  let trackIndex     = logicalIndexToTrackIndex(targetIndex)

  if (isPrevious && currentIndex === 0) {
    trackIndex = 0
  }

  if (!isPrevious && currentIndex === slideCount.value - 1) {
    trackIndex = slideCount.value + 1
  }

  return {
    targetIndex : targetIndex,
    trackIndex  : trackIndex,
  }
}

function showFullscreenAdjacentSlide(direction: 'previous' | 'next') {
  const {
    targetIndex,
    trackIndex,
  } = getAdjacentSlideTarget(direction)

  setSelectedIndex(targetIndex)
  resetFullscreenZoom()

  void nextTick(() => {
    scrollFullscreenTrackToTrackIndex(trackIndex, 'smooth')
  })
}

function showFullscreenPrevious() {
  showFullscreenAdjacentSlide('previous')
}

function showFullscreenNext() {
  showFullscreenAdjacentSlide('next')
}

function onFullscreenTrackScrollEnd() {
  handleCarouselTrackScrollEnd({
    track                    : fullscreenTrackEl.value,
    slideCount               : slideCount.value,
    scrollToTrackIndex       : scrollFullscreenTrackToTrackIndex,
    setSelectedIndex         : setSelectedIndex,
    programmaticTarget       : null,
    programmaticTrack        : null,
    onProgrammaticTrackClear : null,
  })
}

function beginFullscreenPinchGesture() {
  const metrics = getFullscreenPinchMetrics()

  if (!metrics || metrics.distance <= 0) return

  fullscreenGestureState.pointerId       = null
  fullscreenGestureState.startScale      = fullscreenScale.value
  fullscreenGestureState.startTranslateX = fullscreenTranslateX.value
  fullscreenGestureState.startTranslateY = fullscreenTranslateY.value
  fullscreenGestureState.startDistance   = metrics.distance
  fullscreenGestureState.startCenterX    = metrics.x
  fullscreenGestureState.startCenterY    = metrics.y
  fullscreenGestureState.dragged         = true
  fullscreenGestureMode.value            = 'pinch'
  fullscreenDismissY.value               = 0
}

function updateFullscreenPinchGesture() {
  const metrics = getFullscreenPinchMetrics()

  if (!metrics || fullscreenGestureState.startDistance <= 0) return

  const nextScale  = fullscreenGestureState.startScale *
    (metrics.distance / fullscreenGestureState.startDistance)
  const scaleRatio = nextScale / fullscreenGestureState.startScale
  const nextX      = metrics.x -
    (fullscreenGestureState.startCenterX - fullscreenGestureState.startTranslateX) * scaleRatio
  const nextY      = metrics.y -
    (fullscreenGestureState.startCenterY - fullscreenGestureState.startTranslateY) * scaleRatio

  applyFullscreenTransform(nextScale, nextX, nextY)
}

function beginFullscreenSinglePointerGesture(event: PointerEvent) {
  fullscreenGestureState.pointerId       = event.pointerId
  fullscreenGestureState.startX          = event.clientX
  fullscreenGestureState.startY          = event.clientY
  fullscreenGestureState.startTranslateX = fullscreenTranslateX.value
  fullscreenGestureState.startTranslateY = fullscreenTranslateY.value
  fullscreenGestureState.startScrollLeft = fullscreenTrackEl.value?.scrollLeft ?? 0
  fullscreenGestureState.startScale      = fullscreenScale.value
  fullscreenGestureState.dragged         = false
  fullscreenGestureMode.value            = 'idle'
  fullscreenDismissY.value               = 0

  fullscreenTapState.pointerId = event.pointerId
  fullscreenTapState.startX    = event.clientX
  fullscreenTapState.startY    = event.clientY
  fullscreenTapState.startTime = performance.now()
}

function setFullscreenImageRef(element: Element | ComponentPublicInstance | null) {
  fullscreenImageEl.value = element instanceof HTMLImageElement ? element : null
}

function isPointInsideFullscreenImage(clientX: number, clientY: number) {
  const image = fullscreenImageEl.value

  if (!image) return false

  const rect = image.getBoundingClientRect()

  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  )
}

function handleFullscreenTap(event: PointerEvent) {
  const now         = performance.now()
  const isDoubleTap = (
    now - fullscreenTapState.lastTapTime <= DOUBLE_TAP_MAX_DELAY_MS &&
    Math.hypot(
      event.clientX - fullscreenTapState.lastTapX,
      event.clientY - fullscreenTapState.lastTapY,
    ) <= DOUBLE_TAP_MAX_DISTANCE_PX
  )

  if (isDoubleTap) {
    fullscreenTapState.lastTapTime = 0
    toggleFullscreenZoom(event.clientX, event.clientY)
    return
  }

  const isInsideImage = isPointInsideFullscreenImage(event.clientX, event.clientY)

  if (isFullscreenZoomed.value) {
    if (isInsideImage) {
      fullscreenTapState.lastTapX    = event.clientX
      fullscreenTapState.lastTapY    = event.clientY
      fullscreenTapState.lastTapTime = now
    }

    return
  }

  if (!isInsideImage) {
    requestClose()
    return
  }

  fullscreenTapState.lastTapX    = event.clientX
  fullscreenTapState.lastTapY    = event.clientY
  fullscreenTapState.lastTapTime = now
}

function onFullscreenPointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  fullscreenPointers.set(event.pointerId, {
    pointerId : event.pointerId,
    x         : event.clientX,
    y         : event.clientY,
  })

  fullscreenStageEl.value?.setPointerCapture(event.pointerId)

  if (fullscreenPointers.size >= 2) {
    beginFullscreenPinchGesture()
  } else {
    beginFullscreenSinglePointerGesture(event)
  }

  event.preventDefault()
}

function onFullscreenPointerMove(event: PointerEvent) {
  if (!fullscreenPointers.has(event.pointerId)) return

  fullscreenPointers.set(event.pointerId, {
    pointerId : event.pointerId,
    x         : event.clientX,
    y         : event.clientY,
  })

  if (fullscreenPointers.size >= 2) {
    if (fullscreenGestureMode.value !== 'pinch') {
      beginFullscreenPinchGesture()
    }

    updateFullscreenPinchGesture()
    event.preventDefault()
    return
  }

  if (fullscreenGestureState.pointerId !== event.pointerId) return

  const deltaX      = event.clientX - fullscreenGestureState.startX
  const deltaY      = event.clientY - fullscreenGestureState.startY
  const absX        = Math.abs(deltaX)
  const absY        = Math.abs(deltaY)
  const hasMoved    = Math.max(absX, absY) >= FULLSCREEN_GESTURE_SLOP_PX
  const isZoomedNow = isFullscreenZoomed.value

  if (!hasMoved && fullscreenGestureMode.value === 'idle') return

  if (isZoomedNow) {
    fullscreenGestureState.dragged = true
    fullscreenGestureMode.value    = 'pan'
    applyFullscreenTransform(
      fullscreenScale.value,
      fullscreenGestureState.startTranslateX + deltaX,
      fullscreenGestureState.startTranslateY + deltaY,
    )
    event.preventDefault()
    return
  }

  if (fullscreenGestureMode.value === 'idle') {
    if (deltaY > 0 && absY > absX * FULLSCREEN_AXIS_LOCK_RATIO) {
      fullscreenGestureMode.value = 'close'
      setFullscreenTrackFreeDrag(false)
    } else if (absX > absY * FULLSCREEN_AXIS_LOCK_RATIO) {
      fullscreenGestureMode.value = 'swipe'
      fullscreenDismissY.value    = 0
      setFullscreenTrackFreeDrag(true)
    } else {
      return
    }
  }

  fullscreenGestureState.dragged = true

  if (fullscreenGestureMode.value === 'close') {
    fullscreenDismissY.value = Math.max(0, deltaY)
    event.preventDefault()
    return
  }

  if (fullscreenGestureMode.value === 'swipe') {
    const track = fullscreenTrackEl.value

    if (track) {
      track.scrollLeft = fullscreenGestureState.startScrollLeft - deltaX
    }

    event.preventDefault()
  }
}

function finishFullscreenSinglePointerGesture(event: PointerEvent) {
  const mode    = fullscreenGestureMode.value
  const deltaY  = event.clientY - fullscreenGestureState.startY
  const dragged = fullscreenGestureState.dragged

  fullscreenGestureState.pointerId = null
  fullscreenGestureState.dragged   = false
  fullscreenGestureMode.value      = 'idle'

  if (mode === 'close') {
    if (deltaY >= FULLSCREEN_CLOSE_THRESHOLD) {
      requestClose(true)
      return
    }

    fullscreenDismissY.value = 0
    return
  }

  if (mode === 'swipe') {
    setFullscreenTrackFreeDrag(false)
    snapFullscreenTrackToNearestSlide('smooth')
    return
  }

  if (!dragged) {
    handleFullscreenTap(event)
  }
}

function onFullscreenPointerUp(event: PointerEvent) {
  if (!fullscreenPointers.has(event.pointerId)) return

  fullscreenPointers.delete(event.pointerId)
  releaseFullscreenPointerCapture(event.pointerId)

  if (fullscreenGestureMode.value === 'pinch') {
    if (fullscreenPointers.size >= 2) {
      beginFullscreenPinchGesture()
      return
    }

    fullscreenGestureState.pointerId = null
    fullscreenGestureState.dragged   = false
    fullscreenGestureMode.value      = 'idle'
    return
  }

  if (fullscreenGestureState.pointerId === event.pointerId) {
    finishFullscreenSinglePointerGesture(event)
  }
}

function onFullscreenPointerCancel(event: PointerEvent) {
  if (!fullscreenPointers.has(event.pointerId)) return

  fullscreenPointers.delete(event.pointerId)
  releaseFullscreenPointerCapture(event.pointerId)

  if (fullscreenGestureState.pointerId === event.pointerId || fullscreenPointers.size === 0) {
    fullscreenGestureState.pointerId = null
    fullscreenGestureState.dragged   = false
    fullscreenGestureMode.value      = 'idle'
    fullscreenDismissY.value         = 0
    setFullscreenTrackFreeDrag(false)
  }
}

function onFullscreenKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      requestClose()
      break

    case 'ArrowLeft':
      event.preventDefault()
      if (!isFullscreenZoomed.value) showFullscreenPrevious()
      break

    case 'ArrowRight':
      event.preventDefault()
      if (!isFullscreenZoomed.value) showFullscreenNext()
      break
  }
}

function onWindowResize() {
  resetFullscreenZoom()
  scrollFullscreenTrackToTrackIndex(logicalIndexToTrackIndex(props.selectedIndex), 'instant')
}

watch(
  () => props.selectedIndex,
  () => {
    resetFullscreenZoom()
  },
)

onMounted(() => {
  window.addEventListener('keydown', onFullscreenKeydown)
  window.addEventListener('resize', onWindowResize, { passive : true })

  void nextTick(() => {
    scrollFullscreenTrackToTrackIndex(logicalIndexToTrackIndex(props.selectedIndex), 'instant')
    fullscreenOverlayEl.value?.focus({ preventScroll : true })
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onFullscreenKeydown)
  window.removeEventListener('resize', onWindowResize)
  resetFullscreenGestureState()
  resetFullscreenZoom()
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="fullscreenOverlayEl"
      class="image-viewer-lightbox"
      data-mobile-swipe-lock
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      :aria-label="slideTitle(fullscreenSlide)"
      :class="{ 'image-viewer-lightbox--dragging': fullscreenGestureMode === 'close' }"
      :style="fullscreenOverlayStyle"
      @keydown="onFullscreenKeydown"
    >
      <div class="image-viewer-lightbox-topbar">
        <p class="image-viewer-lightbox-title">{{ slideTitle(fullscreenSlide) }}</p>

        <button
          class="image-viewer-lightbox-close"
          type="button"
          :aria-label="closeLabel"
          :disabled="isFullscreenCloseLocked"
          @pointerdown.stop
          @click="requestClose()"
        >
          <svg
            class="image-viewer-lightbox-close-icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M3 3l10 10" />
            <path d="M13 3L3 13" />
          </svg>
        </button>
      </div>

      <div
        ref="fullscreenStageEl"
        class="image-viewer-lightbox-stage"
        :class="{
          'image-viewer-lightbox-stage--gesture': fullscreenGestureMode !== 'idle',
          'image-viewer-lightbox-stage--zoomed': isFullscreenZoomed,
        }"
        @pointerdown="onFullscreenPointerDown"
        @pointermove="onFullscreenPointerMove"
        @pointerup="onFullscreenPointerUp"
        @pointercancel="onFullscreenPointerCancel"
        @lostpointercapture="onFullscreenPointerCancel"
      >
        <img
          class="image-viewer-lightbox-backdrop"
          :src="fullscreenSlide.image.src"
          :width="fullscreenSlide.image.width"
          :height="fullscreenSlide.image.height"
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        <div
          ref="fullscreenTrackEl"
          class="image-viewer-lightbox-track"
          @scrollend="onFullscreenTrackScrollEnd"
        >
          <div
            v-for="entry in carouselSlides"
            :key="`fullscreen-${entry.key}`"
            class="image-viewer-lightbox-panel"
            :class="{
              'image-viewer-lightbox-panel--active':
                entry.slideIndex === selectedIndex && !entry.isClone,
            }"
            :aria-hidden="entry.slideIndex === selectedIndex && !entry.isClone ? undefined : 'true'"
          >
            <img
              class="image-viewer-lightbox-image"
              :class="{
                'image-viewer-lightbox-image--adjacent':
                  entry.slideIndex !== selectedIndex || entry.isClone,
              }"
              :ref="entry.slideIndex === selectedIndex && !entry.isClone
                ? setFullscreenImageRef
                : undefined"
              :src="entry.slide.image.src"
              :width="entry.slide.image.width"
              :height="entry.slide.image.height"
              :alt="entry.slideIndex === selectedIndex && !entry.isClone ? slideAlt(entry.slide) : ''"
              :aria-hidden="entry.slideIndex === selectedIndex && !entry.isClone ? undefined : 'true'"
              :loading="entry.slideIndex === selectedIndex ? 'eager' : 'lazy'"
              decoding="async"
              draggable="false"
              :style="entry.slideIndex === selectedIndex && !entry.isClone
                ? fullscreenImageStyle
                : undefined"
            />
          </div>
        </div>
      </div>

      <div class="image-viewer-lightbox-bottombar">
        <span class="image-viewer-lightbox-counter">{{ fullscreenCounterText }}</span>
        <span class="image-viewer-lightbox-hint">{{ hintText }}</span>
        <button
          class="image-viewer-lightbox-action"
          type="button"
          :disabled="isFullscreenCloseLocked"
          @pointerdown.stop
          @click="requestClose()"
        >{{ closeText }}</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.image-viewer-lightbox {
  position                 : fixed;
  inset                    : 0;
  z-index                  : calc(var(--z-toast) + 30);
  display                  : grid;
  grid-template-rows       : auto minmax(0, 1fr) auto;
  gap                      : var(--space-3);
  min-inline-size          : 0;
  min-block-size           : 0;
  padding-inline           : max(var(--space-4), env(safe-area-inset-left, 0px));
  padding-block-start      : max(var(--space-3), env(safe-area-inset-top, 0px));
  padding-block-end        : max(var(--space-3), env(safe-area-inset-bottom, 0px));
  overflow                 : hidden;
  background               : oklch(4% 0.006 255 / 0.96);
  color                    : var(--c-gray-50);
  outline                  : none;
  touch-action             : none;
  user-select              : none;
  backdrop-filter          : blur(16px) saturate(1.1);
  -webkit-backdrop-filter  : blur(16px) saturate(1.1);
  transition               : opacity var(--dur-fast) var(--ease-out),
                             transform var(--dur-fast) var(--ease-out);
  -webkit-user-select      : none;
}

.image-viewer-lightbox--dragging {
  transition : none;
}

.image-viewer-lightbox-topbar,
.image-viewer-lightbox-bottombar {
  position                 : relative;
  z-index                  : 4;
  display                  : flex;
  align-items              : center;
  gap                      : var(--space-3);
  min-inline-size          : 0;
  border                   : 1px solid oklch(100% 0 0 / 0.14);
  border-radius            : var(--radius-xl);
  background               : oklch(10% 0.01 255 / 0.62);
  box-shadow               : 0 14px 32px oklch(0% 0 0 / 0.28);
  backdrop-filter          : blur(14px) saturate(1.08);
  -webkit-backdrop-filter  : blur(14px) saturate(1.08);
}

.image-viewer-lightbox-topbar {
  justify-content : space-between;
  padding-inline  : var(--space-3);
  padding-block   : var(--space-2);
}

.image-viewer-lightbox-title {
  min-inline-size : 0;
  overflow        : hidden;
  color           : var(--c-gray-50);
  font-size       : var(--text-sm);
  font-weight     : 700;
  line-height     : var(--leading-tight);
  text-overflow   : ellipsis;
  white-space     : nowrap;
}

.image-viewer-lightbox-close,
.image-viewer-lightbox-action {
  display         : inline-flex;
  align-items     : center;
  justify-content : center;
  flex            : 0 0 auto;
  border          : 1px solid oklch(100% 0 0 / 0.24);
  background      : oklch(100% 0 0 / 0.08);
  color           : var(--c-gray-50);
  cursor          : pointer;
  touch-action    : manipulation;
  transition      : background var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out),
                    opacity var(--dur-fast) var(--ease-out),
                    transform var(--dur-fast) var(--ease-out);
}

.image-viewer-lightbox-close {
  inline-size   : 2.35rem;
  block-size    : 2.35rem;
  padding       : 0;
  border-radius : var(--radius-full);
}

.image-viewer-lightbox-close-icon {
  inline-size : 1rem;
  block-size  : 1rem;
}

.image-viewer-lightbox-action {
  min-block-size : 2rem;
  padding-inline : var(--space-3);
  border-radius  : var(--radius-full);
  font-size      : var(--text-xs);
  font-weight    : 700;
  line-height    : var(--leading-tight);
}

.image-viewer-lightbox-close:hover,
.image-viewer-lightbox-action:hover,
.image-viewer-lightbox-close:focus-visible,
.image-viewer-lightbox-action:focus-visible {
  border-color : var(--c-accent);
  background   : oklch(100% 0 0 / 0.14);
  transform    : translateY(-1px);
}

.image-viewer-lightbox-close:focus-visible,
.image-viewer-lightbox-action:focus-visible {
  outline        : 2px solid var(--focus-ring);
  outline-offset : 3px;
}

.image-viewer-lightbox-close:disabled,
.image-viewer-lightbox-action:disabled {
  opacity : 0.44;
  cursor  : not-allowed;
}

.image-viewer-lightbox-stage {
  position        : relative;
  z-index         : 2;
  display         : grid;
  place-items     : center;
  min-inline-size : 0;
  min-block-size  : 0;
  overflow        : hidden;
  border-radius   : var(--radius-lg);
  cursor          : zoom-in;
  isolation       : isolate;
  touch-action    : none;
}

.image-viewer-lightbox-stage--zoomed {
  cursor : grab;
}

.image-viewer-lightbox-stage--gesture {
  cursor : grabbing;
}

.image-viewer-lightbox-backdrop {
  position              : absolute;
  inset                 : -2rem;
  z-index               : 1;
  inline-size           : calc(100% + 4rem);
  block-size            : calc(100% + 4rem);
  object-fit            : cover;
  filter                : blur(24px) saturate(0.92) brightness(0.46);
  opacity               : 0.56;
  transform             : scale(1.05);
  transform-origin      : center;
  user-select           : none;
  pointer-events        : none;
  -webkit-user-drag     : none;
  -webkit-user-select   : none;
}

.image-viewer-lightbox-track {
  position                   : relative;
  z-index                    : 2;
  display                    : flex;
  inline-size                : 100%;
  block-size                 : 100%;
  min-inline-size            : 0;
  min-block-size             : 0;
  overflow-x                 : auto;
  overflow-y                 : hidden;
  scroll-behavior            : auto;
  scroll-snap-type           : x mandatory;
  scrollbar-width            : none;
  overscroll-behavior-inline : contain;
  touch-action               : none;
}

.image-viewer-lightbox-track::-webkit-scrollbar {
  display : none;
}

.image-viewer-lightbox-panel {
  display           : grid;
  place-items       : center;
  flex              : 0 0 100%;
  inline-size       : 100%;
  block-size        : 100%;
  min-inline-size   : 100%;
  min-block-size    : 0;
  scroll-snap-align : start;
  scroll-snap-stop  : normal;
}

.image-viewer-lightbox-image {
  position              : relative;
  z-index               : 2;
  display               : block;
  max-inline-size       : 100%;
  max-block-size        : 100%;
  inline-size           : auto;
  block-size            : auto;
  object-fit            : contain;
  box-shadow            : 0 18px 48px oklch(0% 0 0 / 0.42);
  transform-origin      : center;
  transition            : transform var(--dur-fast) var(--ease-out);
  user-select           : none;
  pointer-events        : none;
  -webkit-user-drag     : none;
  -webkit-user-select   : none;
}

.image-viewer-lightbox-image--adjacent {
  opacity : 0.9;
}

.image-viewer-lightbox-stage--gesture .image-viewer-lightbox-image {
  transition : none;
}

.image-viewer-lightbox-bottombar {
  justify-content : space-between;
  padding-inline  : var(--space-3);
  padding-block   : var(--space-2);
}

.image-viewer-lightbox-counter {
  flex          : 0 0 auto;
  color         : var(--c-gray-50);
  font-family   : var(--font-mono);
  font-size     : var(--text-xs);
  font-weight   : 700;
  line-height   : var(--leading-tight);
  white-space   : nowrap;
}

.image-viewer-lightbox-hint {
  min-inline-size : 0;
  overflow        : hidden;
  color           : oklch(92% 0.006 255 / 0.72);
  font-size       : var(--text-xs);
  font-weight     : 600;
  line-height     : var(--leading-tight);
  text-align      : center;
  text-overflow   : ellipsis;
  white-space     : nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .image-viewer-lightbox,
  .image-viewer-lightbox-close,
  .image-viewer-lightbox-action,
  .image-viewer-lightbox-image {
    transition : none;
  }
}
</style>
