import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  type Ref,
} from 'vue'
import { useWindowContentState } from './useWindowContentState'

const SCROLL_SAVE_DELAY_MS = 200

interface PersistedWindowScrollOptions {
  shouldRestore? : () => boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function usePersistedWindowScroll(
  scrollRef : Readonly<Ref<HTMLElement | null>>,
  options   : PersistedWindowScrollOptions = {},
) {
  const injectedWindowContentState = useWindowContentState()
  let restoreFrameId : number | null = null
  let saveTimerId    : ReturnType<typeof setTimeout> | null = null

  if (!injectedWindowContentState) return

  const windowContentState = injectedWindowContentState

  function canRestore() {
    return options.shouldRestore?.() ?? true
  }

  function clearSaveTimer() {
    if (saveTimerId === null) return

    clearTimeout(saveTimerId)
    saveTimerId = null
  }

  function clearRestoreFrame() {
    if (restoreFrameId === null) return
    if (typeof window !== 'undefined') window.cancelAnimationFrame(restoreFrameId)
    restoreFrameId = null
  }

  function restoreScrollPosition() {
    const element = scrollRef.value
    const scroll  = windowContentState.state.value?.scroll

    if (!element || !scroll || !canRestore()) return

    const maxX = Math.max(element.scrollWidth - element.clientWidth, 0)
    const maxY = Math.max(element.scrollHeight - element.clientHeight, 0)

    element.scrollLeft = clamp(scroll.x, 0, maxX)
    element.scrollTop  = clamp(scroll.y, 0, maxY)
  }

  function scheduleRestoreScrollPosition() {
    if (typeof window === 'undefined') return

    void nextTick(() => {
      clearRestoreFrame()
      restoreFrameId = window.requestAnimationFrame(() => {
        restoreFrameId = null
        restoreScrollPosition()
      })
    })
  }

  function saveScrollPosition() {
    const element = scrollRef.value
    if (!element) return

    windowContentState.patch({
      scroll : {
        x : element.scrollLeft,
        y : element.scrollTop,
      },
    })
  }

  function queueScrollSave() {
    clearSaveTimer()
    saveTimerId = setTimeout(() => {
      saveTimerId = null
      saveScrollPosition()
    }, SCROLL_SAVE_DELAY_MS)
  }

  onMounted(() => {
    const element = scrollRef.value
    if (!element) return

    scheduleRestoreScrollPosition()
    element.addEventListener('scroll', queueScrollSave, { passive : true })
  })

  onBeforeUnmount(() => {
    scrollRef.value?.removeEventListener('scroll', queueScrollSave)
    clearRestoreFrame()
    clearSaveTimer()
  })
}
