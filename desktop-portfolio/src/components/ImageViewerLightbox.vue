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
import type {
  GalleryImageId,
  ImageViewerSlide,
} from '../data/apps/gallery'
import {
  buildCarouselSlides,
  handleCarouselTrackScrollEnd,
  logicalIndexToTrackIndex as getLogicalTrackIndex,
  normalizeCarouselIndex,
  scrollElementToTrackIndex,
  setTrackElementFreeDrag,
  snapTrackElementToNearestSlide,
  type CarouselSlide,
} from '../composables/useCarouselSnapTrack'
import { preloadGalleryImage } from '../composables/useGalleryImagePreload'
import { useElementImageSizes } from '../composables/useElementImageSizes'

const FULLSCREEN_MIN_SCALE        = 1
const FULLSCREEN_MAX_SCALE        = 4
const FULLSCREEN_DOUBLE_TAP_SCALE = 2.25
const FULLSCREEN_GESTURE_SLOP_PX  = 8
const FULLSCREEN_CLOSE_THRESHOLD  = 72
const FULLSCREEN_AXIS_LOCK_RATIO  = 1.15
const FULLSCREEN_ZOOM_EPSILON     = 0.01
const FULLSCREEN_SWIPE_DECAY      = 0.92
const FULLSCREEN_SWIPE_FRAME_MS   = 16.67
const FULLSCREEN_SWIPE_MAX_FRAME  = 32
const FULLSCREEN_SWIPE_MIN_SPEED  = 0.02
const FULLSCREEN_SWIPE_RELEASE_MS = 120
const DOUBLE_TAP_MAX_DELAY_MS     = 300
const DOUBLE_TAP_MAX_DISTANCE_PX  = 30

type FullscreenGestureMode = 'idle' | 'pan' | 'pinch' | 'swipe' | 'close'

type FullscreenCarouselSlide = CarouselSlide<ImageViewerSlide>

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
  lastTime        : number
  lastX           : number
  velocityX       : number
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

const fullscreenOverlayEl   = ref<HTMLElement | null>(null)
const fullscreenStageEl     = ref<HTMLElement | null>(null)
const fullscreenTrackEl     = ref<HTMLElement | null>(null)
const fullscreenImageEl     = ref<HTMLImageElement | null>(null)
const fullscreenScale       = ref(FULLSCREEN_MIN_SCALE)
const fullscreenTranslateX  = ref(0)
const fullscreenTranslateY  = ref(0)
const fullscreenDismissY    = ref(0)
const fullscreenGestureMode = ref<FullscreenGestureMode>('idle')
const loadedImageIds        = ref<Set<GalleryImageId>>(new Set())
const fullscreenImageSizes  = useElementImageSizes(fullscreenStageEl, 960)

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
  lastTime        : 0,
  lastX           : 0,
  velocityX       : 0,
  dragged         : false,
}

let fullscreenSwipeFrame: number | null = null
let fullscreenAdjacentImagePreloadFrame: number | null = null

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

function getSlideAtIndex(index: number) {
  return props.slides[normalizeIndex(index)] ?? props.slides[0]
}

function isSelectedFullscreenSlide(entry: FullscreenCarouselSlide) {
  return entry.slideIndex === props.selectedIndex && !entry.isClone
}

function fullscreenSlideLoading(entry: FullscreenCarouselSlide) {
  return isSelectedFullscreenSlide(entry) ? 'eager' : 'lazy'
}

function fullscreenSlideFetchPriority(entry: FullscreenCarouselSlide) {
  return isSelectedFullscreenSlide(entry) ? 'high' : 'low'
}

function fullscreenSlideAlt(entry: FullscreenCarouselSlide) {
  return isSelectedFullscreenSlide(entry) ? props.slideAlt(entry.slide) : ''
}

function isSlideImageLoaded(slide: ImageViewerSlide) {
  return loadedImageIds.value.has(slide.galleryImageId)
}

function markSlideImageLoaded(slide: ImageViewerSlide) {
  if (isSlideImageLoaded(slide)) return

  const nextLoadedImageIds = new Set(loadedImageIds.value)
  nextLoadedImageIds.add(slide.galleryImageId)
  loadedImageIds.value = nextLoadedImageIds
}

function maybeMarkSlideImageElementLoaded(
  slide   : ImageViewerSlide,
  element : Element | ComponentPublicInstance | null,
) {
  const imageElement = element instanceof HTMLImageElement
    ? element
    : element instanceof Element && element.tagName === 'IMG'
      ? element as HTMLImageElement
      : null

  if (!imageElement?.complete || imageElement.naturalWidth <= 0) return

  markSlideImageLoaded(slide)
}

function setSlideImageElement(
  slide   : ImageViewerSlide,
  element : Element | ComponentPublicInstance | null,
) {
  maybeMarkSlideImageElementLoaded(slide, element)

  if (typeof window === 'undefined') return

  window.requestAnimationFrame(() => {
    maybeMarkSlideImageElementLoaded(slide, element)
  })
}

function imageViewerPreviewStyle(slide: ImageViewerSlide) {
  return {
    '--image-viewer-preview': `url("${slide.preview.src}")`,
  }
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

function cancelFullscreenSwipeMomentum() {
  if (fullscreenSwipeFrame !== null) {
    cancelAnimationFrame(fullscreenSwipeFrame)
    fullscreenSwipeFrame = null
  }
}

function cancelFullscreenAdjacentImagePreload() {
  if (fullscreenAdjacentImagePreloadFrame !== null) {
    cancelAnimationFrame(fullscreenAdjacentImagePreloadFrame)
    fullscreenAdjacentImagePreloadFrame = null
  }
}

function preloadFullscreenAdjacentGalleryImages() {
  if (slideCount.value <= 1) return

  const nextSlide     = getSlideAtIndex(props.selectedIndex + 1)
  const previousSlide = getSlideAtIndex(props.selectedIndex - 1)

  preloadGalleryImage(nextSlide.image, fullscreenImageSizes.value, 'low')

  if (previousSlide.galleryImageId !== nextSlide.galleryImageId) {
    preloadGalleryImage(previousSlide.image, fullscreenImageSizes.value, 'low')
  }
}

function scheduleFullscreenAdjacentImagePreload() {
  if (typeof window === 'undefined') return

  cancelFullscreenAdjacentImagePreload()

  fullscreenAdjacentImagePreloadFrame = window.requestAnimationFrame(() => {
    fullscreenAdjacentImagePreloadFrame = null
    preloadFullscreenAdjacentGalleryImages()
  })
}

function shouldSkipFullscreenSwipeMomentum(velocityX: number) {
  return Math.abs(velocityX) < FULLSCREEN_SWIPE_MIN_SPEED
}

function finishFullscreenSwipeMomentum() {
  fullscreenSwipeFrame = null
  setFullscreenTrackFreeDrag(false)
  snapFullscreenTrackToNearestSlide('smooth')
}

function scrollFullscreenTrackWithMomentum(velocityX: number) {
  const track = fullscreenTrackEl.value

  if (!track || shouldSkipFullscreenSwipeMomentum(velocityX)) {
    finishFullscreenSwipeMomentum()
    return
  }

  cancelFullscreenSwipeMomentum()

  let currentVelocityX = velocityX
  let previousFrame    = performance.now()

  const tick = (timestamp: number) => {
    const elapsed     = Math.min(timestamp - previousFrame, FULLSCREEN_SWIPE_MAX_FRAME)
    const maxScrollX  = Math.max(track.scrollWidth - track.clientWidth, 0)
    const rawScrollX  = track.scrollLeft + (currentVelocityX * elapsed)
    const nextScrollX = clamp(rawScrollX, 0, maxScrollX)
    const decay       = Math.pow(
      FULLSCREEN_SWIPE_DECAY,
      elapsed / FULLSCREEN_SWIPE_FRAME_MS,
    )

    previousFrame    = timestamp
    track.scrollLeft = nextScrollX

    currentVelocityX = nextScrollX === rawScrollX ? currentVelocityX * decay : 0

    if (shouldSkipFullscreenSwipeMomentum(currentVelocityX)) {
      finishFullscreenSwipeMomentum()
      return
    }

    fullscreenSwipeFrame = requestAnimationFrame(tick)
  }

  fullscreenSwipeFrame = requestAnimationFrame(tick)
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
  cancelFullscreenSwipeMomentum()
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
  fullscreenGestureState.lastTime        = 0
  fullscreenGestureState.lastX           = 0
  fullscreenGestureState.velocityX       = 0
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

  cancelFullscreenSwipeMomentum()
  setFullscreenTrackFreeDrag(false)
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

  cancelFullscreenSwipeMomentum()
  setFullscreenTrackFreeDrag(false)
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
  cancelFullscreenSwipeMomentum()
  setFullscreenTrackFreeDrag(false)

  fullscreenGestureState.pointerId       = event.pointerId
  fullscreenGestureState.startX          = event.clientX
  fullscreenGestureState.startY          = event.clientY
  fullscreenGestureState.startTranslateX = fullscreenTranslateX.value
  fullscreenGestureState.startTranslateY = fullscreenTranslateY.value
  fullscreenGestureState.startScrollLeft = fullscreenTrackEl.value?.scrollLeft ?? 0
  fullscreenGestureState.startScale      = fullscreenScale.value
  fullscreenGestureState.lastTime        = performance.now()
  fullscreenGestureState.lastX           = event.clientX
  fullscreenGestureState.velocityX       = 0
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

function setFullscreenSlideImageElement(
  entry   : FullscreenCarouselSlide,
  element : Element | ComponentPublicInstance | null,
) {
  if (isSelectedFullscreenSlide(entry)) {
    setFullscreenImageRef(element)
  }

  setSlideImageElement(entry.slide, element)
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

function updateFullscreenSwipeVelocity(event: PointerEvent) {
  const now     = performance.now()
  const elapsed = Math.max(now - fullscreenGestureState.lastTime, 1)

  fullscreenGestureState.velocityX = -(event.clientX - fullscreenGestureState.lastX) / elapsed
  fullscreenGestureState.lastTime  = now
  fullscreenGestureState.lastX     = event.clientX
}

function getFullscreenReleaseVelocity(event: PointerEvent) {
  const now     = performance.now()
  const elapsed = Math.max(now - fullscreenGestureState.lastTime, 1)
  const deltaX  = event.clientX - fullscreenGestureState.lastX

  if (deltaX !== 0) {
    fullscreenGestureState.velocityX = -deltaX / elapsed
    fullscreenGestureState.lastTime  = now
    fullscreenGestureState.lastX     = event.clientX

    return fullscreenGestureState.velocityX
  }

  if (elapsed > FULLSCREEN_SWIPE_RELEASE_MS) return 0

  return fullscreenGestureState.velocityX
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

    updateFullscreenSwipeVelocity(event)
    event.preventDefault()
  }
}

function finishFullscreenSinglePointerGesture(event: PointerEvent) {
  const mode    = fullscreenGestureMode.value
  const deltaY  = event.clientY - fullscreenGestureState.startY
  const dragged = fullscreenGestureState.dragged

  const velocityX = mode === 'swipe'
    ? getFullscreenReleaseVelocity(event)
    : fullscreenGestureState.velocityX

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
    scrollFullscreenTrackWithMomentum(velocityX)
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
  cancelFullscreenSwipeMomentum()
  setFullscreenTrackFreeDrag(false)
  resetFullscreenZoom()
  scrollFullscreenTrackToTrackIndex(logicalIndexToTrackIndex(props.selectedIndex), 'instant')
}

watch(
  () => props.selectedIndex,
  () => {
    resetFullscreenZoom()
  },
)

watch(
  [
    () => props.selectedIndex,
    fullscreenImageSizes,
  ],
  () => {
    scheduleFullscreenAdjacentImagePreload()
  },
  {
    flush     : 'post',
    immediate : true,
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
  cancelFullscreenAdjacentImagePreload()
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
              'image-viewer-lightbox-panel--loaded': isSlideImageLoaded(entry.slide),
            }"
            :style="imageViewerPreviewStyle(entry.slide)"
            :aria-hidden="entry.slideIndex === selectedIndex && !entry.isClone ? undefined : 'true'"
          >
            <img
              class="image-viewer-lightbox-image"
              :class="{
                'image-viewer-lightbox-image--adjacent':
                  entry.slideIndex !== selectedIndex || entry.isClone,
              }"
              :ref="element => setFullscreenSlideImageElement(entry, element)"
              :src="entry.slide.image.src"
              :srcset="entry.slide.image.webpSrcset"
              :sizes="fullscreenImageSizes"
              :width="entry.slide.image.width"
              :height="entry.slide.image.height"
              :alt="fullscreenSlideAlt(entry)"
              :aria-hidden="isSelectedFullscreenSlide(entry) ? undefined : 'true'"
              :loading="fullscreenSlideLoading(entry)"
              decoding="async"
              draggable="false"
              :fetchpriority="fullscreenSlideFetchPriority(entry)"
              :style="isSelectedFullscreenSlide(entry)
                ? fullscreenImageStyle
                : undefined"
              @load="markSlideImageLoaded(entry.slide)"
            />
          </div>
        </div>
      </div>

      <div class="image-viewer-lightbox-bottombar">
        <span class="image-viewer-lightbox-counter">{{ fullscreenCounterText }}</span>
        <span class="image-viewer-lightbox-hint" v-html="hintText"></span>
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

.image-viewer-lightbox-track {
  position                   : relative;
  z-index                    : 1;
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
  position          : relative;
  display           : grid;
  place-items       : center;
  flex              : 0 0 100%;
  inline-size       : 100%;
  block-size        : 100%;
  min-inline-size   : 100%;
  min-block-size    : 0;
  overflow          : hidden;
  scroll-snap-align : start;
  scroll-snap-stop  : normal;
}

.image-viewer-lightbox-panel::before {
  content               : '';
  position              : absolute;
  inset                 : -2rem;
  z-index               : 1;
  background            : var(--image-viewer-preview) center / cover no-repeat;
  opacity               : 1;
  filter                : blur(24px) saturate(0.92) brightness(0.46);
  transform             : scale(1.05);
  transition            : opacity var(--dur-fast) var(--ease-out);
  pointer-events        : none;
}

.image-viewer-lightbox-panel--loaded::before {
  opacity : 0;
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
