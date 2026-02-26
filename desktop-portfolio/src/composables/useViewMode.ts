/* ============================================================
   useViewMode — Responsive desktop/mobile layout composable
   ============================================================
   Detects viewport size/orientation via matchMedia and exposes a
   reactive `isMobile` computed. A session-only `viewOverride` ref
   allows users to toggle between views for previewing — it is never
   persisted so nobody accidentally gets stuck on the wrong layout.
   ============================================================ */

import { ref, computed } from 'vue'
import type { ViewMode } from '../types/desktop'

/*
  Auto mobile rules:
  1) Compact widths stay mobile (existing phone behavior).
  2) Touch tablets up to iPad-width switch to mobile in portrait.
     In landscape they fall back to desktop mode.
*/
const MOBILE_PHONE_QUERY = '(max-width: 767px)'
const MOBILE_TABLET_PORTRAIT_TOUCH_QUERY = [
  '(any-pointer: coarse)',
  '(min-width: 768px)',
  '(max-width: 1024px)',
  '(orientation: portrait)',
].join(' and ')
const MOBILE_QUERY = `${MOBILE_PHONE_QUERY}, ${MOBILE_TABLET_PORTRAIT_TOUCH_QUERY}`

/* Module-level singleton — shared across all consumers */
const viewportIsMobile = ref(false)
const viewOverride     = ref<ViewMode | null>(null)

let listenerAttached = false

/** Attach the matchMedia listener once (idempotent) */
function ensureListener() {
  if (listenerAttached) return
  listenerAttached = true

  const mobileMql = window.matchMedia(MOBILE_QUERY)
  viewportIsMobile.value = mobileMql.matches

  const handler = (e: MediaQueryListEvent) => {
    viewportIsMobile.value = e.matches
    /* Reset override when viewport changes — prevents being stuck
       in desktop mode on a phone/tablet after rotation, for example */
    viewOverride.value = null
  }

  mobileMql.addEventListener('change', handler)

  /* Cleanup is intentionally omitted — singleton lives for the
     duration of the SPA. If this composable is ever used in
     tests, call onScopeDispose to remove the listener. */
}

export function useViewMode() {
  ensureListener()

  /** True when the effective view should render the mobile layout */
  const isMobile = computed(() =>
    viewOverride.value
      ? viewOverride.value === 'mobile'
      : viewportIsMobile.value,
  )

  /** Current effective view mode */
  const viewMode = computed<ViewMode>(() => isMobile.value ? 'mobile' : 'desktop')

  /** True when a desktop viewport is previewing the mobile layout */
  const isPreview = computed(() =>
    !viewportIsMobile.value && viewMode.value === 'mobile',
  )

  /** Toggle between desktop and mobile views (session-only, not persisted) */
  function toggleViewMode() {
    viewOverride.value = isMobile.value ? 'desktop' : 'mobile'
  }

  /** Set a specific view override (used by the desktop preview toggle) */
  function setViewOverride(mode: ViewMode | null) {
    viewOverride.value = mode
  }

  return {
    isMobile,
    isPreview,
    viewMode,
    viewOverride,
    toggleViewMode,
    setViewOverride,
  }
}
