import { computed, ref } from 'vue'
import type { MobileAppState, WindowMode, WindowState } from '../types/desktop'
import { windowRegistry, getRegistryTitle } from '../data/registry'
import { useLocale } from './useLocale'
import { resolveWindowPolicy } from './useWindowManager'

type MobileDockWindow = Pick<WindowState, 'id' | 'itemId' | 'title'>
type MobileWindowDisplayMode = Exclude<WindowMode, 'minimized'>

const DEFAULT_OPEN_ITEM_IDS = [
  'about',
  'projects',
  'resume',
] as const

const MOBILE_SURFACE_Z_INDEX = 101
const MOBILE_SURFACE_SIZE = {
  w : 430,
  h : 780,
} as const

function windowIdForItem(itemId: string) {
  return `${itemId}-1`
}

function itemIdFromWindowId(windowId: string, openItemIds: readonly string[]) {
  const match = openItemIds.find(itemId => windowIdForItem(itemId) === windowId)
  return match ?? null
}

function getDefaultOpenItemIds() {
  return DEFAULT_OPEN_ITEM_IDS.filter((itemId) => {
    const def = windowRegistry[itemId]
    return Boolean(def && def.type !== 'link' && def.component)
  })
}

function openExternalUrl(url: string) {
  if (typeof window === 'undefined') return
  window.open(url, '_blank', 'noopener')
}

export function useMobileShell() {
  const { locale } = useLocale()

  const openItemIds = ref<string[]>(getDefaultOpenItemIds())
  const currentMobileWindowId = ref<string | null>(
    openItemIds.value[0] ? windowIdForItem(openItemIds.value[0]) : null,
  )
  const mobileAppState = ref<MobileAppState>('minimized')
  const currentWindowMode = ref<MobileWindowDisplayMode>('normal')

  const openMobileWindows = computed<MobileDockWindow[]>(() =>
    openItemIds.value
      .map((itemId) => {
        const def = windowRegistry[itemId]
        if (!def || def.type === 'link') return null

        return {
          id    : windowIdForItem(itemId),
          itemId,
          title : getRegistryTitle(itemId, locale.value),
        }
      })
      .filter((windowState): windowState is MobileDockWindow => windowState !== null),
  )

  const currentItemId = computed(() =>
    currentMobileWindowId.value
      ? itemIdFromWindowId(currentMobileWindowId.value, openItemIds.value)
      : null,
  )

  const currentMobileWindow = computed<WindowState | null>(() => {
    const itemId = currentItemId.value
    const windowId = currentMobileWindowId.value
    if (!itemId || !windowId) return null

    const def = windowRegistry[itemId]
    if (!def || def.type === 'link' || !def.component) return null

    const policy = resolveWindowPolicy(itemId)
    const baseSize = currentWindowMode.value === 'maximized'
      ? MOBILE_SURFACE_SIZE
      : policy.size.default

    return {
      id           : windowId,
      itemId,
      title        : getRegistryTitle(itemId, locale.value),
      x            : 0,
      y            : 0,
      w            : Math.max(1, baseSize.w),
      h            : Math.max(1, baseSize.h),
      zIndex       : MOBILE_SURFACE_Z_INDEX,
      mode         : currentWindowMode.value,
      restoreBounds: null,
      restoreMode  : null,
    }
  })

  const currentAppTitle = computed(() => {
    const itemId = currentItemId.value
    if (!itemId) return ''
    return getRegistryTitle(itemId, locale.value)
  })

  function ensureDockEntry(itemId: string) {
    if (openItemIds.value.includes(itemId)) return
    openItemIds.value = [...openItemIds.value, itemId]
  }

  function launchFromIcon(itemId: string) {
    const def = windowRegistry[itemId]
    if (!def) return

    if (def.type === 'link' && def.url) {
      openExternalUrl(def.url)
      return
    }

    if (!def.component) return

    ensureDockEntry(itemId)
    currentMobileWindowId.value = windowIdForItem(itemId)
    currentWindowMode.value = 'normal'
    mobileAppState.value = 'expanded'
  }

  function selectDockWindow(windowId: string) {
    const itemId = itemIdFromWindowId(windowId, openItemIds.value)
    if (!itemId) return

    const isCurrent = currentMobileWindowId.value === windowId
    if (isCurrent && mobileAppState.value === 'expanded') {
      mobileAppState.value = 'minimized'
      currentWindowMode.value = 'normal'
      return
    }

    currentMobileWindowId.value = windowId
    currentWindowMode.value = 'normal'
    mobileAppState.value = 'expanded'
  }

  function toggleCurrentAppVisibility() {
    if (!currentMobileWindowId.value) return

    if (mobileAppState.value === 'expanded') {
      mobileAppState.value = 'minimized'
      currentWindowMode.value = 'normal'
      return
    }

    mobileAppState.value = 'expanded'
  }

  function closeWindowById(windowId: string) {
    const itemId = itemIdFromWindowId(windowId, openItemIds.value)
    if (!itemId) return

    openItemIds.value = openItemIds.value.filter(openId => openId !== itemId)

    if (currentMobileWindowId.value === windowId) {
      currentMobileWindowId.value = null
      mobileAppState.value = 'minimized'
      currentWindowMode.value = 'normal'
    }
  }

  function focusWindowById(windowId: string) {
    const itemId = itemIdFromWindowId(windowId, openItemIds.value)
    if (!itemId) return
    currentMobileWindowId.value = windowId
  }

  function minimizeWindowById(windowId: string) {
    const itemId = itemIdFromWindowId(windowId, openItemIds.value)
    if (!itemId) return
    currentMobileWindowId.value = windowId
    mobileAppState.value = 'minimized'
    currentWindowMode.value = 'normal'
  }

  function toggleMaximizeWindowById(windowId: string) {
    const itemId = itemIdFromWindowId(windowId, openItemIds.value)
    if (!itemId) return

    const capabilities = getWindowCapabilities(windowId)
    if (!capabilities.canMaximize) return

    currentMobileWindowId.value = windowId
    currentWindowMode.value = currentWindowMode.value === 'maximized'
      ? 'normal'
      : 'maximized'
    mobileAppState.value = 'expanded'
  }

  function getWindowCapabilities(windowId: string) {
    const itemId = itemIdFromWindowId(windowId, openItemIds.value)
    if (!itemId) {
      return {
        canMinimize : false,
        canMaximize : false,
        canResize   : false,
        canMove     : false,
      }
    }

    const policy = resolveWindowPolicy(itemId)
    return {
      canMinimize : policy.behavior.minimizable,
      canMaximize : policy.behavior.maximizable,
      canResize   : false,
      canMove     : false,
    }
  }

  return {
    currentMobileWindowId,
    currentMobileWindow,
    currentAppTitle,
    mobileAppState,
    openMobileWindows,
    launchFromIcon,
    selectDockWindow,
    toggleCurrentAppVisibility,
    closeWindowById,
    focusWindowById,
    minimizeWindowById,
    toggleMaximizeWindowById,
    getWindowCapabilities,
  }
}
