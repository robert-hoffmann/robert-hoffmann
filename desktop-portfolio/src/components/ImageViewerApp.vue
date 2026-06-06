<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from 'vue'
import {
  galleryMessages,
  imageViewerSlides,
  type ImageViewerSlide,
} from '../data/apps/gallery'
import { useLocale } from '../composables/useLocale'
import {
  OPEN_PORTFOLIO_APP_EVENT,
  type OpenPortfolioAppEventDetail,
  usePortfolioNavigation,
} from '../composables/usePortfolioNavigation'
import { useViewMode } from '../composables/useViewMode'

const { l, t } = useLocale(galleryMessages)
const {
  clearGalleryImageRequest,
  galleryImageRequest,
  showProjectInfo,
} = usePortfolioNavigation()

const { isMobile } = useViewMode()

const selectedIndex = ref(0)
const captionIndex  = ref(0)
const slideCount    = imageViewerSlides.length

const FILMSTRIP_REPEAT_COUNT          = 2
const MOUSE_DRAG_THRESHOLD_PX         = 4
const SCROLL_SETTLE_TOLERANCE         = 1
const FILMSTRIP_MOMENTUM_DECAY        = 0.92
const FILMSTRIP_MOMENTUM_FRAME_MS     = 16.67
const FILMSTRIP_MOMENTUM_MAX_FRAME_MS = 32
const FILMSTRIP_MOMENTUM_MIN_VELOCITY = 0.02
const DOUBLE_TAP_MAX_DELAY_MS         = 300
const DOUBLE_TAP_MAX_DISTANCE_PX      = 30
const TAP_MAX_DISTANCE_PX             = 10
const FULLSCREEN_MIN_SCALE            = 1
const FULLSCREEN_MAX_SCALE            = 4
const FULLSCREEN_DOUBLE_TAP_SCALE     = 2.25
const FULLSCREEN_GESTURE_SLOP_PX      = 8
const FULLSCREEN_CLOSE_THRESHOLD_PX   = 72
const FULLSCREEN_AXIS_LOCK_RATIO      = 1.15
const FULLSCREEN_ZOOM_EPSILON         = 0.01

interface CarouselSlide {
  key        : string
  slide      : ImageViewerSlide
  slideIndex : number
  isClone    : boolean
}

interface FilmstripSlide {
  key        : string
  slide      : ImageViewerSlide
  slideIndex : number
}

interface PointerScrollDragState {
  pointerId  : number | null
  scrollLeft : number
  scrollTop  : number
  startX     : number
  startY     : number
  lastTime   : number
  lastX      : number
  lastY      : number
  velocityX  : number
  velocityY  : number
  dragged    : boolean
}

interface GesturePoint {
  pointerId : number
  x         : number
  y         : number
}

type FullscreenGestureMode = 'idle' | 'pan' | 'pinch' | 'swipe' | 'close'
type ScrollTrackToIndex = (trackIndex: number, behavior: ScrollBehavior) => void

interface EmbeddedTapState {
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

interface CarouselScrollEndOptions {
  track                    : HTMLElement | null
  scrollToTrackIndex       : ScrollTrackToIndex
  programmaticTarget       : number | null
  programmaticTrack        : number | null
  onProgrammaticTrackClear : (() => void) | null
}

const trackEl                    = ref<HTMLElement | null>(null)
const filmstripEl                = ref<HTMLElement | null>(null)
const fullscreenOverlayEl        = ref<HTMLElement | null>(null)
const fullscreenStageEl          = ref<HTMLElement | null>(null)
const fullscreenTrackEl          = ref<HTMLElement | null>(null)
const fullscreenImageEl          = ref<HTMLImageElement | null>(null)
const isMouseDragging            = ref(false)
const isFilmstripDragging        = ref(false)
const isFullscreenOpen           = ref(false)
const fullscreenScale            = ref(FULLSCREEN_MIN_SCALE)
const fullscreenTranslateX       = ref(0)
const fullscreenTranslateY       = ref(0)
const fullscreenDismissY         = ref(0)
const fullscreenGestureMode      = ref<FullscreenGestureMode>('idle')
const lockedCaptionIndex         = ref<number | null>(null)
let trackResizeObserver        : ResizeObserver | null = null
let filmstripPointerSlideIndex : number | null          = null
let filmstripMomentumFrame     : number | null          = null
let filmstripFollowFrame       : number | null          = null
let programmaticScrollTarget   : number | null          = null
let programmaticScrollTrack    : number | null          = null

let suppressFilmstripClick = false

const embeddedPointers = new Map<number, GesturePoint>()
const fullscreenPointers = new Map<number, GesturePoint>()

const embeddedTapState: EmbeddedTapState = {
  pointerId   : null,
  startX      : 0,
  startY      : 0,
  startTime   : 0,
  lastTapX    : 0,
  lastTapY    : 0,
  lastTapTime : 0,
}

const fullscreenTapState: EmbeddedTapState = {
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

const trackDragState: PointerScrollDragState = {
  pointerId  : null,
  scrollLeft : 0,
  scrollTop  : 0,
  startX     : 0,
  startY     : 0,
  lastTime   : 0,
  lastX      : 0,
  lastY      : 0,
  velocityX  : 0,
  velocityY  : 0,
  dragged    : false,
}

const filmstripDragState: PointerScrollDragState = {
  pointerId  : null,
  scrollLeft : 0,
  scrollTop  : 0,
  startX     : 0,
  startY     : 0,
  lastTime   : 0,
  lastX      : 0,
  lastY      : 0,
  velocityX  : 0,
  velocityY  : 0,
  dragged    : false,
}

const activeSlide = computed<ImageViewerSlide>(() =>
  imageViewerSlides[lockedCaptionIndex.value ?? captionIndex.value] ?? imageViewerSlides[0],
)
const fullscreenSlide = computed<ImageViewerSlide>(() =>
  imageViewerSlides[selectedIndex.value] ?? imageViewerSlides[0],
)
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
const fullscreenOpenLabel = computed(() =>
  l({
    en : 'Open full-screen image',
    fr : 'Afficher l’image en plein écran',
  }),
)
const fullscreenCloseLabel = computed(() =>
  l({
    en : 'Close full-screen image',
    fr : 'Fermer l’image en plein écran',
  }),
)
const fullscreenCloseText = computed(() =>
  l({
    en : 'Close',
    fr : 'Fermer',
  }),
)
const fullscreenHintText = computed(() =>
  l({
    en : 'Pinch to zoom. Swipe down to close.',
    fr : 'Pincez pour zoomer. Glissez vers le bas pour fermer.',
  }),
)
const fullscreenCounterText = computed(() => `${selectedIndex.value + 1} / ${slideCount}`)

function normalizeIndex(index: number) {
  return ((index % slideCount) + slideCount) % slideCount
}

function logicalIndexToTrackIndex(index: number) {
  return normalizeIndex(index) + 1
}

function trackIndexToLogicalIndex(index: number) {
  return normalizeIndex(index - 1)
}

function setSelectedIndex(index: number, updateCaption = lockedCaptionIndex.value === null) {
  const normalizedIndex = normalizeIndex(index)

  selectedIndex.value = normalizedIndex

  if (updateCaption) {
    captionIndex.value = normalizedIndex
  }
}

function lockCaption(index: number) {
  const normalizedIndex = normalizeIndex(index)

  captionIndex.value        = normalizedIndex
  lockedCaptionIndex.value = normalizedIndex
}

function clearCaptionLock() {
  if (lockedCaptionIndex.value !== null) {
    captionIndex.value = lockedCaptionIndex.value
  }

  lockedCaptionIndex.value = null
}

function beginProgrammaticScroll(targetIndex: number, trackIndex: number) {
  const normalizedIndex = normalizeIndex(targetIndex)

  programmaticScrollTarget = normalizedIndex
  programmaticScrollTrack  = trackIndex
  lockCaption(normalizedIndex)
}

function getRoundedTrackIndex(track: HTMLElement) {
  if (track.clientWidth === 0) return 0

  return Math.round(track.scrollLeft / track.clientWidth)
}

function scrollElementToTrackIndex(
  track: HTMLElement | null,
  trackIndex: number,
  behavior: ScrollBehavior,
) {
  if (!track) return

  track.scrollTo({
    left     : trackIndex * track.clientWidth,
    top      : 0,
    behavior,
  })
}

function scrollTrackToTrackIndex(
  trackIndex: number,
  behavior: ScrollBehavior,
) {
  scrollElementToTrackIndex(trackEl.value, trackIndex, behavior)
}

function scrollFullscreenTrackToTrackIndex(
  trackIndex: number,
  behavior: ScrollBehavior,
) {
  scrollElementToTrackIndex(fullscreenTrackEl.value, trackIndex, behavior)
}

function clearProgrammaticScrollTarget() {
  programmaticScrollTarget = null
  programmaticScrollTrack  = null
  clearCaptionLock()
}

function scrollTrackToIndex(index: number, behavior: ScrollBehavior) {
  scrollTrackToTrackIndex(logicalIndexToTrackIndex(index), behavior)
}

function selectSlide(index: number, behavior: ScrollBehavior = 'smooth') {
  const normalizedIndex = normalizeIndex(index)
  const trackIndex      = logicalIndexToTrackIndex(normalizedIndex)

  if (behavior === 'smooth') {
    beginProgrammaticScroll(normalizedIndex, trackIndex)
  }

  setSelectedIndex(normalizedIndex)

  void nextTick(() => {
    scrollTrackToTrackIndex(trackIndex, behavior)
  })
}

function findSlideIndexByImageId(imageId: number) {
  return imageViewerSlides.findIndex(slide => slide.imageId === imageId)
}

function selectImageById(imageId: number, behavior: ScrollBehavior = 'smooth') {
  const slideIndex = findSlideIndexByImageId(imageId)

  if (slideIndex < 0) return

  selectSlide(slideIndex, behavior)
}

const carouselSlides = computed<CarouselSlide[]>(() => {
  const firstSlide = imageViewerSlides[0]
  const lastSlide  = imageViewerSlides[slideCount - 1] ?? firstSlide

  return [
    {
      key        : `${lastSlide.id}-before`,
      slide      : lastSlide,
      slideIndex : slideCount - 1,
      isClone    : true,
    },
    ...imageViewerSlides.map((slide, index) => ({
      key        : `${slide.id}-main`,
      slide      : slide,
      slideIndex : index,
      isClone    : false,
    })),
    {
      key        : `${firstSlide.id}-after`,
      slide      : firstSlide,
      slideIndex : 0,
      isClone    : true,
    },
  ]
})

const filmstripSlides = computed<FilmstripSlide[]>(() =>
  Array.from({ length : slideCount * FILMSTRIP_REPEAT_COUNT }, (_, index) => {
    const slideIndex = normalizeIndex(index)
    const slide      = imageViewerSlides[slideIndex] ?? imageViewerSlides[0]

    return {
      key        : `${slide.id}-${index}`,
      slide      : slide,
      slideIndex : slideIndex,
    }
  }),
)

function getAdjacentSlideTarget(direction: 'previous' | 'next') {
  const currentIndex = selectedIndex.value
  const isPrevious   = direction === 'previous'
  const targetIndex  = normalizeIndex(currentIndex + (isPrevious ? -1 : 1))
  let trackIndex     = logicalIndexToTrackIndex(targetIndex)

  if (isPrevious && currentIndex === 0) {
    trackIndex = 0
  }

  if (!isPrevious && currentIndex === slideCount - 1) {
    trackIndex = slideCount + 1
  }

  return {
    targetIndex : targetIndex,
    trackIndex  : trackIndex,
  }
}

function showAdjacentSlide(direction: 'previous' | 'next') {
  const {
    targetIndex,
    trackIndex,
  } = getAdjacentSlideTarget(direction)

  beginProgrammaticScroll(targetIndex, trackIndex)
  setSelectedIndex(targetIndex)

  void nextTick(() => {
    scrollTrackToTrackIndex(trackIndex, 'smooth')
  })
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

function showPrevious() {
  showAdjacentSlide('previous')
}

function showNext() {
  showAdjacentSlide('next')
}

function showFullscreenPrevious() {
  showFullscreenAdjacentSlide('previous')
}

function showFullscreenNext() {
  showFullscreenAdjacentSlide('next')
}

function thumbnailLabel(slide: ImageViewerSlide, index: number) {
  return t('imageViewer.thumbnail', {
    index : index + 1,
    title : slideTitle(slide),
  })
}

function slideTitle(slide: ImageViewerSlide) {
  return l(slide.title)
}

function slideSummary(slide: ImageViewerSlide) {
  return l(slide.summary)
}

function slideAlt(slide: ImageViewerSlide) {
  return l(slide.image.alt)
}

function openProjectInfo() {
  showProjectInfo(activeSlide.value.projectId)
}

function onOpenPortfolioApp(event: Event) {
  const detail = (event as CustomEvent<OpenPortfolioAppEventDetail>).detail

  if (detail?.itemId !== 'gallery' || typeof detail.imageId !== 'number') return

  selectImageById(detail.imageId)
}

function resetEmbeddedGestureState() {
  embeddedPointers.clear()
  embeddedTapState.pointerId = null
}

function openFullscreenFromEmbeddedGesture(event: PointerEvent) {
  event.preventDefault()
  event.stopPropagation()
  resetEmbeddedGestureState()
  openFullscreen()
}

function onEmbeddedImagePointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  embeddedPointers.set(event.pointerId, {
    pointerId : event.pointerId,
    x         : event.clientX,
    y         : event.clientY,
  })

  if (event.isPrimary) {
    embeddedTapState.pointerId = event.pointerId
    embeddedTapState.startX    = event.clientX
    embeddedTapState.startY    = event.clientY
    embeddedTapState.startTime = performance.now()
  }

  if (embeddedPointers.size >= 2) {
    openFullscreenFromEmbeddedGesture(event)
  }
}

function onEmbeddedImagePointerMove(event: PointerEvent) {
  if (!embeddedPointers.has(event.pointerId)) return

  embeddedPointers.set(event.pointerId, {
    pointerId : event.pointerId,
    x         : event.clientX,
    y         : event.clientY,
  })

  if (embeddedPointers.size >= 2) {
    openFullscreenFromEmbeddedGesture(event)
  }
}

function onEmbeddedImagePointerUp(event: PointerEvent) {
  embeddedPointers.delete(event.pointerId)

  if (embeddedTapState.pointerId !== event.pointerId) return

  const now      = performance.now()
  const distance = Math.hypot(
    event.clientX - embeddedTapState.startX,
    event.clientY - embeddedTapState.startY,
  )

  embeddedTapState.pointerId = null

  if (distance > TAP_MAX_DISTANCE_PX) return

  const isDoubleTap = (
    now - embeddedTapState.lastTapTime <= DOUBLE_TAP_MAX_DELAY_MS &&
    Math.hypot(
      event.clientX - embeddedTapState.lastTapX,
      event.clientY - embeddedTapState.lastTapY,
    ) <= DOUBLE_TAP_MAX_DISTANCE_PX
  )

  if (isDoubleTap) {
    embeddedTapState.lastTapTime = 0
    openFullscreenFromEmbeddedGesture(event)
    return
  }

  embeddedTapState.lastTapX    = event.clientX
  embeddedTapState.lastTapY    = event.clientY
  embeddedTapState.lastTapTime = now
}

function onEmbeddedImagePointerCancel(event: PointerEvent) {
  embeddedPointers.delete(event.pointerId)

  if (embeddedTapState.pointerId === event.pointerId) {
    embeddedTapState.pointerId = null
  }
}

function onEmbeddedTrackClick(event: MouseEvent) {
  if (event.detail < 2) return

  event.preventDefault()
  event.stopPropagation()
  openFullscreen()
}

function resetPointerScrollDragState(
  state: PointerScrollDragState,
  dragging: Ref<boolean>,
) {
  state.pointerId = null
  state.velocityX = 0
  state.velocityY = 0
  state.dragged   = false
  dragging.value  = false
}

function startPointerScrollDrag(
  event: PointerEvent,
  element: HTMLElement | null,
  state: PointerScrollDragState,
  capturePointer = true,
) {
  if (!element || !event.isPrimary || event.pointerType === 'touch' || event.button !== 0) {
    return false
  }

  state.pointerId  = event.pointerId
  state.scrollLeft = element.scrollLeft
  state.scrollTop  = element.scrollTop
  state.startX     = event.clientX
  state.startY     = event.clientY
  state.lastTime   = performance.now()
  state.lastX      = event.clientX
  state.lastY      = event.clientY
  state.velocityX  = 0
  state.velocityY  = 0
  state.dragged    = false

  if (capturePointer) {
    element.setPointerCapture(event.pointerId)
  }

  return true
}

function releasePointerScrollDrag(event: PointerEvent, element: HTMLElement | null) {
  if (element?.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId)
  }
}

function updatePointerScrollVelocity(
  event: PointerEvent,
  state: PointerScrollDragState,
) {
  const now     = performance.now()
  const elapsed = Math.max(now - state.lastTime, 1)

  state.velocityX = -(event.clientX - state.lastX) / elapsed
  state.velocityY = -(event.clientY - state.lastY) / elapsed
  state.lastTime  = now
  state.lastX     = event.clientX
  state.lastY     = event.clientY
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getPointDistance(first: GesturePoint, second: GesturePoint) {
  return Math.hypot(first.x - second.x, first.y - second.y)
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

function openFullscreen() {
  if (isFullscreenOpen.value) return

  resetFullscreenZoom()
  resetFullscreenGestureState()
  isFullscreenOpen.value = true

  void nextTick(() => {
    scrollFullscreenTrackToTrackIndex(logicalIndexToTrackIndex(selectedIndex.value), 'instant')
    fullscreenOverlayEl.value?.focus({ preventScroll : true })
  })
}

function closeFullscreen(force = false) {
  if (!isFullscreenOpen.value) return
  if (!force && isFullscreenCloseLocked.value) return

  isFullscreenOpen.value = false
  resetFullscreenGestureState()
  resetFullscreenZoom()

  void nextTick(() => {
    scrollTrackToIndex(selectedIndex.value, 'instant')
  })
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

function updateSelectedIndexFromTrackElement(track: HTMLElement | null) {
  if (!track || track.clientWidth === 0) return

  setSelectedIndex(trackIndexToLogicalIndex(getRoundedTrackIndex(track)))
}

function updateSelectedIndexFromTrack() {
  updateSelectedIndexFromTrackElement(trackEl.value)
}

function isTrackElementSettledAtIndex(track: HTMLElement, trackIndex: number) {
  return Math.abs(track.scrollLeft - (trackIndex * track.clientWidth)) <= SCROLL_SETTLE_TOLERANCE
}

function updateSelectedIndexFromScroll() {
  if (programmaticScrollTarget !== null || !isMouseDragging.value) return

  updateSelectedIndexFromTrack()
}

function snapTrackElementToNearestSlide(
  track: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth',
) {
  if (!track || track.clientWidth === 0) return

  scrollElementToTrackIndex(track, getRoundedTrackIndex(track), behavior)
}

function snapTrackToNearestSlide(behavior: ScrollBehavior = 'smooth') {
  snapTrackElementToNearestSlide(trackEl.value, behavior)
}

function snapFullscreenTrackToNearestSlide(behavior: ScrollBehavior = 'smooth') {
  snapTrackElementToNearestSlide(fullscreenTrackEl.value, behavior)
}

function setTrackElementFreeDrag(track: HTMLElement | null, enabled: boolean) {
  if (!track) return

  track.style.scrollSnapType = enabled ? 'none' : ''
  track.style.scrollBehavior = enabled ? 'auto' : ''
}

function setTrackFreeDrag(enabled: boolean) {
  setTrackElementFreeDrag(trackEl.value, enabled)
}

function setFullscreenTrackFreeDrag(enabled: boolean) {
  setTrackElementFreeDrag(fullscreenTrackEl.value, enabled)
}

function resetTrackDragState() {
  setTrackFreeDrag(false)
  clearProgrammaticScrollTarget()
  resetPointerScrollDragState(trackDragState, isMouseDragging)
}

function onTrackPointerDown(event: PointerEvent) {
  startPointerScrollDrag(event, trackEl.value, trackDragState)
}

function onTrackPointerMove(event: PointerEvent) {
  if (trackDragState.pointerId !== event.pointerId) return

  const track = trackEl.value

  if (!track) return

  const deltaX = event.clientX - trackDragState.startX
  const deltaY = event.clientY - trackDragState.startY
  const absX   = Math.abs(deltaX)
  const absY   = Math.abs(deltaY)

  if (!trackDragState.dragged && absX < MOUSE_DRAG_THRESHOLD_PX) return
  if (!trackDragState.dragged && absY > absX) return

  if (!trackDragState.dragged) {
    trackDragState.dragged = true
    isMouseDragging.value  = true
    setTrackFreeDrag(true)
  }

  event.preventDefault()
  track.scrollLeft = trackDragState.scrollLeft - deltaX
  updateSelectedIndexFromScroll()
}

function onTrackPointerUp(event: PointerEvent) {
  if (trackDragState.pointerId !== event.pointerId) return

  const shouldSnap = trackDragState.dragged

  releasePointerScrollDrag(event, trackEl.value)
  resetTrackDragState()

  if (shouldSnap) {
    snapTrackToNearestSlide('smooth')
  }
}

function onTrackPointerCancel(event: PointerEvent) {
  if (trackDragState.pointerId !== event.pointerId) return

  releasePointerScrollDrag(event, trackEl.value)
  resetTrackDragState()
}

function handleCarouselTrackScrollEnd({
  track,
  scrollToTrackIndex,
  programmaticTarget,
  programmaticTrack,
  onProgrammaticTrackClear,
}: CarouselScrollEndOptions) {
  if (!track || track.clientWidth === 0) return

  const trackIndex  = getRoundedTrackIndex(track)
  const targetIndex = programmaticTarget ?? trackIndexToLogicalIndex(trackIndex)

  setSelectedIndex(targetIndex)

  if (
    programmaticTrack !== null &&
    !isTrackElementSettledAtIndex(track, programmaticTrack)
  ) {
    return
  }

  onProgrammaticTrackClear?.()

  if (trackIndex === 0) {
    scrollToTrackIndex(slideCount, 'instant')
  }

  if (trackIndex === slideCount + 1) {
    scrollToTrackIndex(1, 'instant')
  }
}

function onTrackScrollEnd() {
  handleCarouselTrackScrollEnd({
    track                    : trackEl.value,
    scrollToTrackIndex       : scrollTrackToTrackIndex,
    programmaticTarget       : programmaticScrollTarget,
    programmaticTrack        : programmaticScrollTrack,
    onProgrammaticTrackClear : clearProgrammaticScrollTarget,
  })
}

function onFullscreenTrackScrollEnd() {
  handleCarouselTrackScrollEnd({
    track                    : fullscreenTrackEl.value,
    scrollToTrackIndex       : scrollFullscreenTrackToTrackIndex,
    programmaticTarget       : null,
    programmaticTrack        : null,
    onProgrammaticTrackClear : null,
  })
}

function resetFilmstripDragState() {
  filmstripPointerSlideIndex = null
  resetPointerScrollDragState(filmstripDragState, isFilmstripDragging)
}

function cancelFilmstripMomentum() {
  if (filmstripMomentumFrame !== null) {
    cancelAnimationFrame(filmstripMomentumFrame)
    filmstripMomentumFrame = null
  }
}

function shouldSkipFilmstripMomentum(velocityX: number, velocityY: number) {
  return (
    Math.abs(velocityX) < FILMSTRIP_MOMENTUM_MIN_VELOCITY &&
    Math.abs(velocityY) < FILMSTRIP_MOMENTUM_MIN_VELOCITY
  )
}

function scrollFilmstripWithMomentum(velocityX: number, velocityY: number) {
  const filmstrip = filmstripEl.value

  if (!filmstrip || shouldSkipFilmstripMomentum(velocityX, velocityY)) return

  cancelFilmstripMomentum()

  let currentVelocityX = velocityX
  let currentVelocityY = velocityY
  let previousFrame    = performance.now()

  const tick = (timestamp: number) => {
    const elapsed     = Math.min(timestamp - previousFrame, FILMSTRIP_MOMENTUM_MAX_FRAME_MS)
    const maxScrollX  = Math.max(filmstrip.scrollWidth - filmstrip.clientWidth, 0)
    const maxScrollY  = Math.max(filmstrip.scrollHeight - filmstrip.clientHeight, 0)
    const rawScrollX  = filmstrip.scrollLeft + (currentVelocityX * elapsed)
    const rawScrollY  = filmstrip.scrollTop + (currentVelocityY * elapsed)
    const nextScrollX = clamp(rawScrollX, 0, maxScrollX)
    const nextScrollY = clamp(rawScrollY, 0, maxScrollY)
    const decay       = Math.pow(
      FILMSTRIP_MOMENTUM_DECAY,
      elapsed / FILMSTRIP_MOMENTUM_FRAME_MS,
    )

    previousFrame = timestamp

    filmstrip.scrollLeft = nextScrollX
    filmstrip.scrollTop  = nextScrollY

    currentVelocityX = nextScrollX === rawScrollX ? currentVelocityX * decay : 0
    currentVelocityY = nextScrollY === rawScrollY ? currentVelocityY * decay : 0

    if (shouldSkipFilmstripMomentum(currentVelocityX, currentVelocityY)) {
      filmstripMomentumFrame = null
      return
    }

    filmstripMomentumFrame = requestAnimationFrame(tick)
  }

  filmstripMomentumFrame = requestAnimationFrame(tick)
}

function cancelFilmstripFollow() {
  if (filmstripFollowFrame !== null) {
    cancelAnimationFrame(filmstripFollowFrame)
    filmstripFollowFrame = null
  }
}

function getThumbnailAxisMetrics(
  filmstrip: HTMLElement,
  thumbnail: HTMLElement,
  horizontal: boolean,
) {
  const filmstripRect = filmstrip.getBoundingClientRect()
  const thumbnailRect = thumbnail.getBoundingClientRect()
  const scroll        = horizontal ? filmstrip.scrollLeft : filmstrip.scrollTop
  const viewportSize  = horizontal ? filmstrip.clientWidth : filmstrip.clientHeight
  const start         = horizontal
    ? thumbnailRect.left - filmstripRect.left + scroll
    : thumbnailRect.top - filmstripRect.top + scroll
  const size          = horizontal ? thumbnailRect.width : thumbnailRect.height
  const end           = start + size

  return {
    center         : start + (size / 2),
    distance       : Math.abs(start + (size / 2) - (scroll + (viewportSize / 2))),
    end            : end,
    start          : start,
    viewportEnd    : scroll + viewportSize,
    viewportSize   : viewportSize,
    viewportStart  : scroll,
  }
}

function isThumbnailFullyVisible(
  metrics: ReturnType<typeof getThumbnailAxisMetrics>,
) {
  const visibilityInset = 4

  return (
    metrics.start >= metrics.viewportStart + visibilityInset &&
    metrics.end <= metrics.viewportEnd - visibilityInset
  )
}

function scrollActiveThumbnailIntoView(behavior: ScrollBehavior = 'smooth') {
  const filmstrip = filmstripEl.value

  if (!filmstrip || isFilmstripDragging.value) return

  const thumbnails = Array.from(
    filmstrip.querySelectorAll<HTMLElement>(
      `.image-viewer-thumb[data-slide-index="${selectedIndex.value}"]`,
    ),
  )

  if (thumbnails.length === 0) return

  const horizontal = getComputedStyle(filmstrip).flexDirection.startsWith('row')
  const maxScroll  = horizontal
    ? Math.max(filmstrip.scrollWidth - filmstrip.clientWidth, 0)
    : Math.max(filmstrip.scrollHeight - filmstrip.clientHeight, 0)

  if (maxScroll <= 0) return

  const candidates = thumbnails.map(thumbnail =>
    getThumbnailAxisMetrics(filmstrip, thumbnail, horizontal),
  )

  if (candidates.some(isThumbnailFullyVisible)) return

  const nearest = candidates.reduce((best, candidate) =>
    candidate.distance < best.distance ? candidate : best,
  )
  const targetScroll = clamp(nearest.center - (nearest.viewportSize / 2), 0, maxScroll)

  cancelFilmstripMomentum()
  filmstrip.scrollTo({
    left     : horizontal ? targetScroll : 0,
    top      : horizontal ? 0 : targetScroll,
    behavior : behavior,
  })
}

function scheduleActiveThumbnailIntoView(behavior: ScrollBehavior = 'smooth') {
  cancelFilmstripFollow()

  void nextTick(() => {
    filmstripFollowFrame = requestAnimationFrame(() => {
      filmstripFollowFrame = null
      scrollActiveThumbnailIntoView(behavior)
    })
  })
}

function suppressNextFilmstripClick() {
  suppressFilmstripClick = true
  window.setTimeout(() => {
    suppressFilmstripClick = false
  }, 0)
}

function onFilmstripPointerDown(event: PointerEvent) {
  const thumbnail = event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>('.image-viewer-thumb')
    : null

  cancelFilmstripMomentum()

  filmstripPointerSlideIndex = thumbnail?.dataset.slideIndex
    ? Number(thumbnail.dataset.slideIndex)
    : null

  startPointerScrollDrag(event, filmstripEl.value, filmstripDragState)
}

function onFilmstripPointerMove(event: PointerEvent) {
  if (filmstripDragState.pointerId !== event.pointerId) return

  const filmstrip = filmstripEl.value

  if (!filmstrip) return

  const deltaX = event.clientX - filmstripDragState.startX
  const deltaY = event.clientY - filmstripDragState.startY

  if (
    !filmstripDragState.dragged &&
    Math.max(Math.abs(deltaX), Math.abs(deltaY)) < MOUSE_DRAG_THRESHOLD_PX
  ) {
    return
  }

  if (!filmstripDragState.dragged) {
    filmstripDragState.dragged = true
    isFilmstripDragging.value  = true
    filmstrip.setPointerCapture(event.pointerId)
  }

  event.preventDefault()
  updatePointerScrollVelocity(event, filmstripDragState)
  filmstrip.scrollLeft = filmstripDragState.scrollLeft - deltaX
  filmstrip.scrollTop  = filmstripDragState.scrollTop - deltaY
}

function onFilmstripPointerUp(event: PointerEvent) {
  if (filmstripDragState.pointerId !== event.pointerId) return

  const shouldSuppressClick = filmstripDragState.dragged
  const targetIndex         = filmstripPointerSlideIndex
  const velocityX           = filmstripDragState.velocityX
  const velocityY           = filmstripDragState.velocityY

  releasePointerScrollDrag(event, filmstripEl.value)
  resetFilmstripDragState()

  if (shouldSuppressClick) {
    suppressNextFilmstripClick()
    scrollFilmstripWithMomentum(velocityX, velocityY)
    return
  }

  if (targetIndex !== null && Number.isInteger(targetIndex)) {
    suppressNextFilmstripClick()
    selectSlide(targetIndex)
  }
}

function onFilmstripPointerCancel(event: PointerEvent) {
  if (filmstripDragState.pointerId !== event.pointerId) return

  releasePointerScrollDrag(event, filmstripEl.value)
  resetFilmstripDragState()
}

function onThumbnailClick(index: number, event: MouseEvent) {
  if (suppressFilmstripClick) {
    event.preventDefault()
    return
  }

  selectSlide(index)
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
    closeFullscreen()
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
    if (deltaY >= FULLSCREEN_CLOSE_THRESHOLD_PX) {
      closeFullscreen(true)
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
  if (!isFullscreenOpen.value) return

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      closeFullscreen()
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

function onViewerKeydown(event: KeyboardEvent) {
  if (isFullscreenOpen.value) {
    onFullscreenKeydown(event)
    return
  }

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      showPrevious()
      break

    case 'ArrowRight':
      event.preventDefault()
      showNext()
      break

    case 'Home':
      event.preventDefault()
      selectSlide(0, 'smooth')
      break

    case 'End':
      event.preventDefault()
      selectSlide(slideCount - 1, 'smooth')
      break
  }
}

function onWindowResize() {
  if (isFullscreenOpen.value) {
    resetFullscreenZoom()
    scrollFullscreenTrackToTrackIndex(logicalIndexToTrackIndex(selectedIndex.value), 'instant')
  }
}

watch(
  () => galleryImageRequest.value,
  (request) => {
    if (!request) return

    selectImageById(request.imageId)
    clearGalleryImageRequest(request.requestId)
  },
  { immediate : true },
)

watch(selectedIndex, () => {
  scheduleActiveThumbnailIntoView(isMouseDragging.value ? 'auto' : 'smooth')

  if (isFullscreenOpen.value) {
    resetFullscreenZoom()
  }
})

onMounted(() => {
  window.addEventListener(OPEN_PORTFOLIO_APP_EVENT, onOpenPortfolioApp)
  window.addEventListener('keydown', onFullscreenKeydown)
  window.addEventListener('resize', onWindowResize, { passive : true })

  void nextTick(() => {
    scrollTrackToIndex(selectedIndex.value, 'instant')
    scrollActiveThumbnailIntoView('instant')
  })

  trackResizeObserver = new ResizeObserver(() => {
    scrollTrackToIndex(selectedIndex.value, 'instant')
  })

  if (trackEl.value) {
    trackResizeObserver.observe(trackEl.value)
  }
})

onBeforeUnmount(() => {
  cancelFilmstripFollow()
  cancelFilmstripMomentum()
  window.removeEventListener(OPEN_PORTFOLIO_APP_EVENT, onOpenPortfolioApp)
  window.removeEventListener('keydown', onFullscreenKeydown)
  window.removeEventListener('resize', onWindowResize)
  trackResizeObserver?.disconnect()
  trackResizeObserver = null
  resetEmbeddedGestureState()
  resetFullscreenGestureState()
})
</script>

<template>
  <div
    class="image-viewer-shell"
    tabindex="0"
    @keydown="onViewerKeydown"
  >
    <div class="image-viewer">
      <section class="image-viewer-main" :aria-label="slideTitle(activeSlide)">
        <figure class="image-viewer-figure">
          <figcaption class="image-viewer-caption">
            <div class="image-viewer-title-row">
              <h3 class="image-viewer-title">{{ slideTitle(activeSlide) }}</h3>

              <button
                class="image-viewer-link"
                type="button"
                @click="openProjectInfo"
              >{{ t('imageViewer.projectInfo') }}</button>
            </div>

            <p class="image-viewer-summary">{{ slideSummary(activeSlide) }}</p>
          </figcaption>

          <div class="image-viewer-frame">
            <div
              ref="trackEl"
              class="image-viewer-track"
              data-mobile-swipe-lock
              :class="{ 'image-viewer-track--dragging': isMouseDragging }"
              @scroll="updateSelectedIndexFromScroll"
              @pointerdown="onTrackPointerDown"
              @pointermove="onTrackPointerMove"
              @pointerup="onTrackPointerUp"
              @pointercancel="onTrackPointerCancel"
              @scrollend="onTrackScrollEnd"
              @lostpointercapture="resetTrackDragState"
              @click="onEmbeddedTrackClick"
              @dblclick.stop.prevent="openFullscreen"
            >
              <div
                v-for="entry in carouselSlides"
                :key="entry.key"
                class="image-viewer-slide"
                :aria-hidden="entry.slideIndex === selectedIndex && !entry.isClone ? undefined : 'true'"
              >
                <img
                  class="image-viewer-image image-viewer-image--backdrop"
                  :src="entry.slide.image.src"
                  :width="entry.slide.image.width"
                  :height="entry.slide.image.height"
                  alt=""
                  aria-hidden="true"
                  :loading="entry.slideIndex === selectedIndex ? 'eager' : 'lazy'"
                  decoding="async"
                  draggable="false"
                />

                <div
                  class="image-viewer-image-stage"
                  @pointerdown="onEmbeddedImagePointerDown"
                  @pointermove="onEmbeddedImagePointerMove"
                  @pointerup="onEmbeddedImagePointerUp"
                  @pointercancel="onEmbeddedImagePointerCancel"
                  @dblclick.stop.prevent="openFullscreen"
                >
                  <img
                    class="image-viewer-image image-viewer-image--foreground"
                    :src="entry.slide.image.src"
                    :width="entry.slide.image.width"
                    :height="entry.slide.image.height"
                    :alt="slideAlt(entry.slide)"
                    :loading="entry.slideIndex === selectedIndex ? 'eager' : 'lazy'"
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>
            </div>

            <button
              v-if="isMobile"
              class="image-viewer-expand"
              type="button"
              :aria-label="fullscreenOpenLabel"
              @pointerdown.stop
              @click.stop="openFullscreen"
            >
              <svg
                class="image-viewer-expand-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="1 6 1 1 6 1" />
                <polyline points="10 1 15 1 15 6" />
                <polyline points="15 10 15 15 10 15" />
                <polyline points="6 15 1 15 1 10" />
              </svg>
            </button>

            <button
              v-if="!isMobile"
              class="image-viewer-arrow image-viewer-arrow--previous"
              type="button"
              :aria-label="t('imageViewer.previous')"
              @pointerdown.stop
              @click.stop="showPrevious"
            >
              <span aria-hidden="true">&lsaquo;</span>
            </button>

            <button
              v-if="!isMobile"
              class="image-viewer-arrow image-viewer-arrow--next"
              type="button"
              :aria-label="t('imageViewer.next')"
              @pointerdown.stop
              @click.stop="showNext"
            >
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        </figure>
      </section>

      <aside
        ref="filmstripEl"
        class="image-viewer-filmstrip"
        data-mobile-swipe-lock
        :class="{ 'image-viewer-filmstrip--dragging': isFilmstripDragging }"
        :aria-label="t('imageViewer.thumbnails')"
        @pointerdown="onFilmstripPointerDown"
        @pointermove="onFilmstripPointerMove"
        @pointerup="onFilmstripPointerUp"
        @pointercancel="onFilmstripPointerCancel"
        @lostpointercapture="resetFilmstripDragState"
      >
        <button
          v-for="entry in filmstripSlides"
          :key="entry.key"
          class="image-viewer-thumb"
          :class="{ 'image-viewer-thumb--active': entry.slideIndex === selectedIndex }"
          type="button"
          :data-slide-index="entry.slideIndex"
          :aria-label="thumbnailLabel(entry.slide, entry.slideIndex)"
          :aria-current="entry.slideIndex === selectedIndex ? 'true' : undefined"
          @click="onThumbnailClick(entry.slideIndex, $event)"
        >
          <img
            class="image-viewer-thumb-image"
            :src="entry.slide.thumbnail.src"
            :width="entry.slide.thumbnail.width"
            :height="entry.slide.thumbnail.height"
            :alt="slideAlt(entry.slide)"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </button>
      </aside>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="isFullscreenOpen"
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
          :aria-label="fullscreenCloseLabel"
          :disabled="isFullscreenCloseLocked"
          @pointerdown.stop
          @click="closeFullscreen()"
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
              :ref="entry.slideIndex === selectedIndex && !entry.isClone ? setFullscreenImageRef : undefined"
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
        <span class="image-viewer-lightbox-hint">{{ fullscreenHintText }}</span>
        <button
          class="image-viewer-lightbox-action"
          type="button"
          :disabled="isFullscreenCloseLocked"
          @pointerdown.stop
          @click="closeFullscreen()"
        >{{ fullscreenCloseText }}</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.image-viewer-shell {
  container      : image-viewer / inline-size;
  inline-size    : 100%;
  block-size     : 100%;
  min-block-size : 0;
  overflow       : hidden;
  outline        : none;
}

.image-viewer {
  --image-viewer-accent            : var(--c-accent);
  --image-viewer-bg                : oklch(15% 0.01 250);
  --image-viewer-frame-bg          : oklch(4% 0.004 255);
  --image-viewer-frame-border      : oklch(100% 0 0 / 0.66);
  --image-viewer-frame-shadow      : inset 0 0 0 1px oklch(0% 0 0 / 0.7),
                                     0 0 0 1px oklch(0% 0 0 / 0.8),
                                     0 18px 36px oklch(0% 0 0 / 0.36);
  --image-viewer-arrow-bg          : oklch(7% 0.006 255 / 0.34);
  --image-viewer-arrow-border      : oklch(100% 0 0 / 0.22);
  --image-viewer-arrow-color       : var(--c-gray-50);
  --image-viewer-link-bg           : oklch(24% 0.012 250);
  --image-viewer-link-border       : oklch(42% 0.012 250 / 0.72);
  --image-viewer-thumb-bg          : oklch(8% 0.006 255);
  --image-viewer-thumb-border      : oklch(100% 0 0 / 0.28);
  --image-viewer-thumb-hover       : oklch(100% 0 0 / 0.48);
  --image-viewer-thumb-shadow      : inset 0 0 0 1px oklch(0% 0 0 / 0.7);
  --image-viewer-thumb-active-shadow :
                                      inset 0 0 0 1px oklch(0% 0 0 / 0.7),
                                      0 0 0 1px var(--image-viewer-accent),
                                      0 8px 18px oklch(0% 0 0 / 0.34);

  display                          : grid;
  grid-template-columns            : minmax(0, 1fr) minmax(5.5rem, 7.25rem);
  grid-template-rows               : minmax(0, 1fr);
  gap                              : var(--space-4);
  block-size                       : 100%;
  min-block-size                   : 0;
  padding                          : var(--space-4);
  color                            : var(--text-primary);
  background                       : var(--image-viewer-bg);
  outline                          : none;
}

:global([data-theme="light"] .image-viewer) {
  --image-viewer-bg                : oklch(96% 0.006 280);
  --image-viewer-frame-bg          : oklch(99% 0.002 250);
  --image-viewer-frame-border      : oklch(76% 0.012 250 / 0.72);
  --image-viewer-frame-shadow      : inset 0 0 0 1px oklch(100% 0 0 / 0.8),
                                     0 0 0 1px oklch(65% 0.02 250 / 0.26),
                                     0 18px 34px oklch(58% 0.026 260 / 0.18);
  --image-viewer-arrow-bg          : oklch(99% 0.004 250 / 0.42);
  --image-viewer-arrow-border      : oklch(68% 0.018 250 / 0.22);
  --image-viewer-arrow-color       : var(--text-primary);
  --image-viewer-link-bg           : oklch(100% 0 0 / 0.72);
  --image-viewer-link-border       : oklch(76% 0.012 250 / 0.68);
  --image-viewer-thumb-bg          : oklch(22% 0.01 250);
  --image-viewer-thumb-border      : oklch(100% 0 0 / 0.38);
  --image-viewer-thumb-hover       : oklch(100% 0 0 / 0.62);
  --image-viewer-thumb-shadow      : inset 0 0 0 1px oklch(0% 0 0 / 0.42),
                                     0 1px 2px oklch(58% 0.026 260 / 0.18);
  --image-viewer-thumb-active-shadow :
                                      inset 0 0 0 1px oklch(0% 0 0 / 0.42),
                                      0 0 0 1px var(--image-viewer-accent),
                                      0 8px 18px oklch(58% 0.026 260 / 0.18);
}

.image-viewer-main,
.image-viewer-figure,
.image-viewer-frame {
  min-inline-size : 0;
  min-block-size  : 0;
}

.image-viewer-main {
  display : grid;
}

.image-viewer-figure {
  display            : grid;
  grid-template-rows : auto minmax(0, 1fr);
  gap                : var(--space-3);
}

.image-viewer-frame {
  position        : relative;
  display         : grid;
  place-items     : center;
  overflow        : hidden;
  border          : 1px solid var(--image-viewer-frame-border);
  background      : var(--image-viewer-frame-bg);
  box-shadow      : var(--image-viewer-frame-shadow);
  user-select     : none;
}

.image-viewer-track {
  position                   : relative;
  z-index                    : 1;
  display                    : flex;
  inline-size                : 100%;
  block-size                 : 100%;
  overflow-x                 : auto;
  overflow-y                 : hidden;
  scroll-behavior            : auto;
  scroll-snap-type           : x mandatory;
  scrollbar-width            : none;
  overscroll-behavior-inline : contain;
  cursor                     : grab;
  touch-action               : pan-x pan-y;
}

.image-viewer-track--dragging {
  cursor : grabbing;
}

.image-viewer-slide {
  position          : relative;
  display           : grid;
  place-items       : center;
  flex              : 0 0 100%;
  inline-size       : 100%;
  block-size        : 100%;
  min-inline-size   : 100%;
  scroll-snap-align : start;
  scroll-snap-stop  : normal;
}

.image-viewer-image {
  user-select         : none;
  pointer-events      : none;
  -webkit-user-drag   : none;
  -webkit-user-select : none;
}

.image-viewer-image-stage {
  position     : relative;
  z-index      : 2;
  display      : grid;
  place-items  : center;
  inline-size  : 100%;
  block-size   : 100%;
  overflow     : hidden;
  touch-action : pan-x pan-y;
}

.image-viewer-image--backdrop {
  position    : absolute;
  inset       : -1rem;
  z-index     : 1;
  inline-size : calc(100% + 2rem);
  block-size  : calc(100% + 2rem);
  object-fit  : cover;
  filter      : blur(18px) saturate(0.95) brightness(0.62);
  opacity     : 0;
  transform   : scale(1.05);
}

.image-viewer-image--foreground {
  inline-size : 100%;
  block-size  : 100%;
  object-fit  : cover;
}

.image-viewer-arrow {
  position        : absolute;
  z-index         : 3;
  inset-block     : 50%;
  display         : flex;
  align-items     : center;
  justify-content : center;
  inline-size     : 2.75rem;
  block-size      : 2.75rem;
  padding         : 0;
  border          : 1px solid var(--image-viewer-arrow-border);
  border-radius   : var(--radius-full);
  background      : var(--image-viewer-arrow-bg);
  color           : var(--image-viewer-arrow-color);
  font-size       : var(--text-3xl);
  line-height     : 1;
  box-shadow      : 0 10px 24px oklch(0% 0 0 / 0.16);
  transform       : translateY(-50%);
  transition      : background var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out),
                    transform var(--dur-fast) var(--ease-out);

  &:hover {
    transform : translateY(-50%) scale(1.04);
  }

  &:focus-visible {
    outline        : 2px solid var(--focus-ring);
    outline-offset : 3px;
  }
}

.image-viewer-expand {
  position         : absolute;
  z-index          : 4;
  inset-inline-end : var(--space-3);
  inset-block-end  : var(--space-3);
  display          : flex;
  align-items      : center;
  justify-content  : center;
  inline-size      : 2.55rem;
  block-size       : 2.55rem;
  padding          : 0;
  border           : 1px solid oklch(100% 0 0 / 0.42);
  border-radius    : var(--radius-lg);
  background       : oklch(7% 0.006 255 / 0.58);
  color            : var(--c-gray-50);
  box-shadow       : 0 10px 28px oklch(0% 0 0 / 0.36);
  cursor           : pointer;
  touch-action     : manipulation;
  transition       : background var(--dur-fast) var(--ease-out),
                     border-color var(--dur-fast) var(--ease-out),
                     transform var(--dur-fast) var(--ease-out);

  &:hover {
    border-color : var(--image-viewer-accent);
    background   : oklch(12% 0.012 255 / 0.72);
    transform    : translateY(-1px);
  }

  &:focus-visible {
    outline        : 2px solid var(--focus-ring);
    outline-offset : 3px;
  }
}

.image-viewer-expand-icon {
  inline-size : 1.15rem;
  block-size  : 1.15rem;
}

.image-viewer-arrow span {
  display     : grid;
  place-items : center;
  inline-size : 1em;
  block-size  : 1em;
  line-height : 1;
  transform   : translateY(-0.06em);
}

.image-viewer-arrow--previous span {
  transform : translate(-0.03em, -0.06em);
}

.image-viewer-arrow--next span {
  transform : translate(0.03em, -0.06em);
}

.image-viewer-arrow--previous {
  inset-inline-start : var(--space-3);
}

.image-viewer-arrow--next {
  inset-inline-end : var(--space-3);
}

.image-viewer-caption {
  display            : grid;
  grid-template-rows : 1.75rem 3rem;
  gap                : var(--space-1);
  block-size         : 5rem;
  min-inline-size    : 0;
}

.image-viewer-title-row {
  display               : grid;
  grid-template-columns : minmax(0, 1fr) auto;
  gap                   : var(--space-3);
  align-items           : center;
  min-block-size        : 1.75rem;
  min-inline-size       : 0;
}

.image-viewer-title {
  font-size   : var(--text-lg);
  font-weight : 700;
  line-height : var(--leading-tight);
  color       : var(--text-primary);
}

.image-viewer-summary {
  display            : -webkit-box;
  max-inline-size    : 54rem;
  overflow           : hidden;
  font-size          : var(--text-sm);
  line-height        : var(--leading-relaxed);
  color              : var(--text-secondary);
  -webkit-box-orient : vertical;
  -webkit-line-clamp : 2;
  line-clamp         : 2;
}

.image-viewer-link {
  display         : inline-flex;
  align-items     : center;
  justify-content : center;
  min-inline-size : max-content;
  min-block-size  : 1.5rem;
  padding-inline  : var(--space-3);
  padding-block   : 0;
  appearance      : none;
  border          : 1px solid var(--image-viewer-link-border);
  border-radius   : var(--radius-full);
  background      : var(--image-viewer-link-bg);
  color           : var(--text-primary);
  font-size       : var(--text-xs);
  font-weight     : 600;
  line-height     : var(--leading-tight);
  white-space     : nowrap;
  cursor          : pointer;
}

.image-viewer-filmstrip {
  grid-column         : 2;
  grid-row            : 1;
  display             : flex;
  flex-direction      : column;
  gap                 : var(--space-1);
  min-block-size      : 0;
  overflow-x          : hidden;
  overflow-y          : auto;
  padding-inline      : 0.125rem;
  overscroll-behavior : contain;
  scroll-behavior     : auto;
  scrollbar-width     : none;
  cursor              : grab;
  touch-action        : pan-x pan-y;
  user-select         : none;
}

.image-viewer-track::-webkit-scrollbar,
.image-viewer-filmstrip::-webkit-scrollbar {
  display : none;
}

.image-viewer-filmstrip--dragging {
  cursor : grabbing;
}

.image-viewer-thumb {
  position              : relative;
  display               : grid;
  grid-template         : minmax(0, 1fr) / minmax(0, 1fr);
  place-items           : stretch;
  inline-size           : 100%;
  flex                  : 0 0 auto;
  aspect-ratio          : 1 / 1;
  padding               : 0.28rem 0.66rem;
  overflow              : hidden;
  border                : 1px solid var(--image-viewer-thumb-border);
  background            : var(--image-viewer-thumb-bg);
  box-shadow            : var(--image-viewer-thumb-shadow);
  opacity               : 0.68;
  transition            : opacity var(--dur-fast) var(--ease-out),
                          border-color var(--dur-fast) var(--ease-out),
                          transform var(--dur-fast) var(--ease-out);

  &::before,
  &::after {
    content          : '';
    position         : absolute;
    inset-block      : 0.25rem;
    inline-size      : 0.28rem;
    background       : repeating-linear-gradient(
                         to bottom,
                         oklch(100% 0 0 / 0.88) 0 0.18rem,
                         transparent 0.18rem 0.48rem
                       );
    pointer-events   : none;
  }

  &::before {
    inset-inline-start : 0.18rem;
  }

  &::after {
    inset-inline-end : 0.18rem;
  }

  &:hover {
    opacity      : 0.92;
    border-color : var(--image-viewer-thumb-hover);
    transform    : translateY(-1px);
  }
}

.image-viewer-thumb--active {
  border-color : var(--image-viewer-accent);
  box-shadow   : var(--image-viewer-thumb-active-shadow);
  opacity      : 1;
}

.image-viewer-thumb-image {
  inline-size     : 100%;
  block-size      : 100%;
  min-inline-size : 0;
  min-block-size  : 0;
  max-inline-size : 100%;
  max-block-size  : 100%;
  object-fit      : cover;
}

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

@container image-viewer (max-width: 42rem) {
  .image-viewer {
    grid-template-columns : minmax(0, 1fr);
    grid-template-rows    : minmax(0, 1fr) auto;
    gap                   : var(--space-3);
    padding               : var(--space-3);
  }

  .image-viewer-image--backdrop {
    opacity : 1;
  }

  .image-viewer-image--foreground {
    object-fit : contain;
  }

  .image-viewer-filmstrip {
    grid-column    : 1;
    grid-row       : 2;
    flex-direction : row;
    overflow-x     : auto;
    overflow-y     : hidden;
    padding-block  : 0.125rem;
  }

  .image-viewer-thumb {
    inline-size : 5.5rem;
    padding     : 0.66rem 0.28rem;
  }

  .image-viewer-thumb::before,
  .image-viewer-thumb::after {
    inset-inline : 0.25rem;
    block-size   : 0.28rem;
    inline-size  : auto;
    background   : repeating-linear-gradient(
                     to right,
                     oklch(100% 0 0 / 0.88) 0 0.18rem,
                     transparent 0.18rem 0.48rem
                   );
  }

  .image-viewer-thumb::before {
    inset-block-start : 0.18rem;
    inset-block-end   : auto;
  }

  .image-viewer-thumb::after {
    inset-block-start : auto;
    inset-block-end   : 0.18rem;
  }

  .image-viewer-title-row {
    gap : var(--space-2);
  }

  .image-viewer-link {
    padding-inline : var(--space-2);
  }
}

@container image-viewer (max-width: 30rem) {
  .image-viewer-arrow {
    inline-size : 2.35rem;
    block-size  : 2.35rem;
    font-size   : var(--text-2xl);
  }

  .image-viewer-title {
    font-size : var(--text-base);
  }
}

@media (prefers-reduced-motion: reduce) {
  .image-viewer-arrow,
  .image-viewer-expand,
  .image-viewer-link,
  .image-viewer-thumb,
  .image-viewer-lightbox,
  .image-viewer-lightbox-close,
  .image-viewer-lightbox-action,
  .image-viewer-lightbox-image {
    transition : none;
  }
}
</style>
