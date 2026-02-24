/* ============================================================
   usePointerCapabilities — Pointer capability media queries
   ============================================================
   Detects coarse/fine pointer availability via matchMedia.
   Shared singleton state keeps desktop touch adaptations
   explicit without relying on user-agent sniffing.
   ============================================================ */

import { computed, ref } from 'vue'

const ANY_COARSE_QUERY = '(any-pointer: coarse)'
const ANY_FINE_QUERY   = '(any-pointer: fine)'

const hasCoarsePointerRaw = ref(false)
const hasFinePointerRaw   = ref(true)

let listenersAttached = false

function ensurePointerCapabilityListeners() {
  if (listenersAttached || typeof window === 'undefined') return
  listenersAttached = true

  const coarseMql = window.matchMedia(ANY_COARSE_QUERY)
  const fineMql = window.matchMedia(ANY_FINE_QUERY)

  const sync = () => {
    hasCoarsePointerRaw.value = coarseMql.matches
    hasFinePointerRaw.value = fineMql.matches
  }

  sync()
  coarseMql.addEventListener('change', sync)
  fineMql.addEventListener('change', sync)
}

export function usePointerCapabilities() {
  ensurePointerCapabilityListeners()

  const hasCoarsePointer = computed(() => hasCoarsePointerRaw.value)
  const hasFinePointer = computed(() => hasFinePointerRaw.value)

  return {
    hasCoarsePointer,
    hasFinePointer,
  }
}

