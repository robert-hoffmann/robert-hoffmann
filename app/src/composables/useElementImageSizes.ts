import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useElementImageSizes(
  target: Ref<HTMLElement | null>,
  fallbackWidthPx = 960,
) {
  const sizes = ref(`${Math.max(1, Math.round(fallbackWidthPx))}px`)
  let resizeObserver: ResizeObserver | null = null

  function updateSizes() {
    const width = target.value?.clientWidth ?? fallbackWidthPx
    sizes.value = `${Math.max(1, Math.round(width))}px`
  }

  onMounted(() => {
    updateSizes()

    if (typeof ResizeObserver !== 'function') return
    if (!target.value) return

    resizeObserver = new ResizeObserver(() => {
      updateSizes()
    })
    resizeObserver.observe(target.value)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return sizes
}
