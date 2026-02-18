import { ref } from 'vue'

type SeekDirection = 'forward' | 'backward'

interface SeekPreview {
  direction : SeekDirection
  start     : number
  width     : number
}

/**
 * Shared seek-bar interaction logic for media players.
 * Provides identical pointer → percentage mapping for hover preview and seeks.
 */
export function useSeekBar() {
  const seekHoverPct = ref<number | null>(null)

  function clampPct(value: number): number {
    return Math.max(0, Math.min(100, value))
  }

  function pointerRatio(event: MouseEvent): number | null {
    const bar = event.currentTarget as HTMLElement | null
    if (!bar) return null

    const rect = bar.getBoundingClientRect()
    if (rect.width <= 0) return null

    return Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  }

  function hover(event: MouseEvent, duration: number) {
    if (duration <= 0) return
    const ratio = pointerRatio(event)
    if (ratio === null) return
    seekHoverPct.value = ratio * 100
  }

  function leave() {
    seekHoverPct.value = null
  }

  function preview(currentPct: number): SeekPreview | null {
    if (seekHoverPct.value === null) return null

    const current = clampPct(currentPct)
    const hoverPct = clampPct(seekHoverPct.value)
    const delta = hoverPct - current

    if (Math.abs(delta) < 0.1) return null
    if (delta > 0) return { direction: 'forward', start: current, width: delta }
    return { direction: 'backward', start: hoverPct, width: Math.abs(delta) }
  }

  return { seekHoverPct, pointerRatio, hover, leave, preview }
}
