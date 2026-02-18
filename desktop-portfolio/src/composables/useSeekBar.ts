import { ref } from 'vue'

/**
 * Shared seek-bar interaction logic for media players.
 * Provides identical pointer → percentage mapping for hover preview and seeks.
 */
export function useSeekBar() {
  const seekHoverPct = ref<number | null>(null)

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

  return { seekHoverPct, pointerRatio, hover, leave }
}
