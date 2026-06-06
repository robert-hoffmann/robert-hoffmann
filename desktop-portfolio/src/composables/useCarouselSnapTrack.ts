export type ScrollTrackToIndex = (trackIndex: number, behavior: ScrollBehavior) => void

export interface CarouselSlide<TSlide extends { id: string | number }> {
  key        : string
  slide      : TSlide
  slideIndex : number
  isClone    : boolean
}

export interface CarouselScrollEndOptions {
  track                    : HTMLElement | null
  slideCount               : number
  scrollToTrackIndex       : ScrollTrackToIndex
  setSelectedIndex         : (index: number) => void
  programmaticTarget       : number | null
  programmaticTrack        : number | null
  onProgrammaticTrackClear : (() => void) | null
}

const SCROLL_SETTLE_TOLERANCE = 1

export function normalizeCarouselIndex(index: number, slideCount: number) {
  return ((index % slideCount) + slideCount) % slideCount
}

export function logicalIndexToTrackIndex(index: number, slideCount: number) {
  return normalizeCarouselIndex(index, slideCount) + 1
}

export function trackIndexToLogicalIndex(index: number, slideCount: number) {
  return normalizeCarouselIndex(index - 1, slideCount)
}

export function getRoundedTrackIndex(track: HTMLElement) {
  if (track.clientWidth === 0) return 0

  return Math.round(track.scrollLeft / track.clientWidth)
}

export function scrollElementToTrackIndex(
  track: HTMLElement | null,
  trackIndex: number,
  behavior: ScrollBehavior,
) {
  if (!track) return

  track.scrollTo({
    left     : trackIndex * track.clientWidth,
    top      : 0,
    behavior : behavior,
  })
}

export function snapTrackElementToNearestSlide(
  track: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth',
) {
  if (!track || track.clientWidth === 0) return

  scrollElementToTrackIndex(track, getRoundedTrackIndex(track), behavior)
}

export function setTrackElementFreeDrag(track: HTMLElement | null, enabled: boolean) {
  if (!track) return

  track.style.scrollSnapType = enabled ? 'none' : ''
  track.style.scrollBehavior = enabled ? 'auto' : ''
}

export function buildCarouselSlides<TSlide extends { id: string | number }>(
  slides: readonly TSlide[],
): CarouselSlide<TSlide>[] {
  const firstSlide = slides[0]
  const lastSlide  = slides[slides.length - 1] ?? firstSlide

  if (!firstSlide || !lastSlide) return []

  return [
    {
      key        : `${lastSlide.id}-before`,
      slide      : lastSlide,
      slideIndex : slides.length - 1,
      isClone    : true,
    },
    ...slides.map((slide, index) => ({
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
}

function isTrackElementSettledAtIndex(track: HTMLElement, trackIndex: number) {
  return Math.abs(track.scrollLeft - (trackIndex * track.clientWidth)) <= SCROLL_SETTLE_TOLERANCE
}

export function handleCarouselTrackScrollEnd({
  track,
  slideCount,
  scrollToTrackIndex,
  setSelectedIndex,
  programmaticTarget,
  programmaticTrack,
  onProgrammaticTrackClear,
}: CarouselScrollEndOptions) {
  if (!track || track.clientWidth === 0) return

  const trackIndex  = getRoundedTrackIndex(track)
  const targetIndex = programmaticTarget ?? trackIndexToLogicalIndex(trackIndex, slideCount)

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
