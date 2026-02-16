<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import TopBar from './components/TopBar.vue'
import Dock from './components/Dock.vue'
import AppWindow from './components/AppWindow.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import NotificationToast from './components/NotificationToast.vue'
import AboutSiteModal from './components/AboutSiteModal.vue'
import { useWindowManager } from './composables/useWindowManager'
import { useDesktopIcons } from './composables/useDesktopIcons'
import { useTheme } from './composables/useTheme'
import { useToast } from './composables/useToast'
import { useLocale } from './composables/useLocale'
import { useDraggable } from './composables/useDraggable'
import { useResizable } from './composables/useResizable'
import { useSessionPersistence } from './composables/useSessionPersistence'
import { useViewMode } from './composables/useViewMode'
import { windowRegistry } from './data/registry'

/* Keep mobile-only graph out of initial desktop bundle. */
const MobileApp = defineAsyncComponent(() => import('./components/MobileApp.vue'))

/* ---- shared composables (used in both views) ---- */
const theme = useTheme()
const toast = useToast()
const { t, locale } = useLocale()
const { isMobile }  = useViewMode()

/* ---- desktop-only composables ---- */
const wm    = useWindowManager()
const icons = useDesktopIcons()

const findWindow = (id: string) => wm.state.windows.find(w => w.id === id)
const { startDrag }   = useDraggable(findWindow)
const { startResize } = useResizable(findWindow)
const session         = useSessionPersistence(icons.items)

/* ---- constants ---- */
const OWNER_NAME = 'Robert Hoffmann'

const showAboutSite = ref(false)
const wallpaperReady = ref(false)

const STARTUP_INITIAL_BATCH = 2
const STARTUP_STAGGER_MS    = 120

let startupRafId: number | null = null
const startupTimerIds: number[] = []
let wallpaperLoader: HTMLImageElement | null = null

/* ---- default windows to open on first visit ---- */
const DEFAULT_WINDOWS = [
  { itemId : 'projects', x : 150,  y : 90,  w : 469, h : 691, zIndex : 100 },
  { itemId : 'about',    x : 558,  y : 37,  w : 497, h : 794, zIndex : 101 },
  { itemId : 'video',    x : 886,  y : 403, w : 466, h : 388, zIndex : 102 },
  { itemId : 'music',    x : 721,  y : 650, w : 391, h : 227, zIndex : 103 },
  { itemId : 'resume',   x : 1433, y : 69,  w : 546, h : 760, zIndex : 104 },
]

/* ---- helpers ---- */
function clearStartupSchedule() {
  if (startupRafId !== null) {
    window.cancelAnimationFrame(startupRafId)
    startupRafId = null
  }
  for (const id of startupTimerIds) window.clearTimeout(id)
  startupTimerIds.length = 0
}

/* Keep default desktop layout deterministic while deferring heavy mounts. */
function applyWindowLayout(def: (typeof DEFAULT_WINDOWS)[number]) {
  const newWin = wm.openWindow(def.itemId, locale.value)
  if (!newWin) return
  newWin.x = def.x
  newWin.y = def.y
  newWin.w = def.w
  newWin.h = def.h
  newWin.zIndex = def.zIndex
}

function openDefaultWindowsStaggered() {
  clearStartupSchedule()

  /* Delay first app mounts until the shell has had a chance to paint once. */
  startupRafId = window.requestAnimationFrame(() => {
    startupRafId = null

    for (const def of DEFAULT_WINDOWS.slice(0, STARTUP_INITIAL_BATCH)) {
      applyWindowLayout(def)
    }

    DEFAULT_WINDOWS.slice(STARTUP_INITIAL_BATCH).forEach((def, idx) => {
      const timerId = window.setTimeout(() => {
        applyWindowLayout(def)
      }, STARTUP_STAGGER_MS * (idx + 1))
      startupTimerIds.push(timerId)
    })
  })
}

function resolveWallpaperWidth(): 1280 | 1920 | 2560 {
  const viewportWidth = window.innerWidth
  if (viewportWidth >= 1921) return 2560
  if (viewportWidth >= 1281) return 1920
  return 1280
}

/* Blur-up: keep LQIP visible until the selected sharp wallpaper is decoded. */
function preloadDesktopWallpaper() {
  wallpaperReady.value = false

  const width = resolveWallpaperWidth()
  const loader = new Image()
  wallpaperLoader = loader
  loader.decoding = 'async'

  const finish = () => {
    if (wallpaperLoader !== loader) return
    wallpaperReady.value = true
    wallpaperLoader = null
  }

  loader.addEventListener('load', finish, { once : true })
  loader.addEventListener('error', finish, { once : true })
  loader.src = `${import.meta.env.BASE_URL}wallpaper-${width}.webp`
}

function openItem(itemId: string) {
  const def = windowRegistry[itemId]
  if (def?.type === 'link' && def.url) {
    window.open(def.url, '_blank', 'noopener')
    return
  }
  wm.openWindow(itemId, locale.value)
}

/* Expose openItem to child components (used by TerminalApp) */
provide('openApp', openItem)


function resetDesktop() {
  clearStartupSchedule()
  session.reset()
  wm.closeAll()
  openDefaultWindowsStaggered()
  theme.setTheme('dark')
  toast.show(t('toast.desktopReset'))
}

/* ---- menu actions ---- */
function onMenuAction(action: string) {
  if (!action) return

  if (action.startsWith('open:')) {
    openItem(action.slice(5))
    return
  }

  switch (action) {
    case 'closeAll':
      wm.closeAll()
      toast.show(t('toast.allWindowsClosed'))
      break

    case 'reset':
      resetDesktop()
      break

    case 'copyUrl':
      void navigator.clipboard?.writeText(window.location.href)
        .then(() => toast.show(t('toast.pageUrlCopied')))
        .catch(() => toast.show(t('toast.copyFailed')))
      break

    case 'copyShareLink': {
      const openIds = wm.state.windows.map(w => w.itemId).join(',')
      const focused = wm.state.windows.find(w => w.id === wm.state.focusedWindowId)?.itemId ?? ''
      const url     = new URL(window.location.href)
      url.search    = ''
      if (openIds) url.searchParams.set('open', openIds)
      if (focused) url.searchParams.set('focus', focused)
      url.searchParams.set('theme', theme.theme.value)
      url.searchParams.set('lang', locale.value)
      void navigator.clipboard?.writeText(url.toString())
        .then(() => toast.show(t('toast.shareLinkCopied')))
        .catch(() => toast.show(t('toast.copyFailedShort')))
      break
    }

    case 'toggleTheme':
      theme.toggle()
      break

    case 'tileWindows': {
      const n = wm.tileWindows()
      if (n) toast.show(t('toast.tiledWindows', { n }))
      break
    }

    case 'cascadeWindows':
      wm.cascadeWindows()
      toast.show(t('toast.cascaded'))
      break

    case 'minimizeAll':
      wm.minimizeAll()
      toast.show(t('toast.minimizedAll'))
      break

    case 'restoreAll':
      wm.restoreAll()
      toast.show(t('toast.restoredAll'))
      break

    case 'aboutSite':
      showAboutSite.value = true
      break

    case 'github':
      window.open('https://github.com/robert-hoffmann', '_blank', 'noopener')
      break
  }
}


function onClearSelection() {
  icons.clearSelection()
}

/* ---- drag / resize forwarding ---- */
function onDragStart(event: PointerEvent, windowId: string) {
  wm.focusWindow(windowId)
  startDrag(event, windowId)
}

function onResizeStart(event: PointerEvent, windowId: string) {
  startResize(event, windowId)
}

/* ---- dock ---- */
function onDockLaunch(itemId: string) {
  openItem(itemId)
}

function onDockToggle(windowId: string) {
  const win = wm.state.windows.find(w => w.id === windowId)
  if (!win) return
  if (win.isMinimized) {
    wm.restoreWindow(win.id)
    wm.focusWindow(win.id)
  } else if (wm.state.focusedWindowId === win.id) {
    wm.minimizeWindow(win.id)
  } else {
    wm.focusWindow(win.id)
  }
}

/* ---- lifecycle ---- */
onMounted(() => {
  /* Skip desktop window initialisation when in mobile mode */
  if (isMobile.value) return

  preloadDesktopWallpaper()

  /* Restore saved state or apply deep-link params */
  const hasDeepLinks = session.applyDeepLinks()
  if (!hasDeepLinks) {
    const restored = session.restore()
    if (!restored) {
      /* First visit — open default windows in staggered batches */
      openDefaultWindowsStaggered()
    }
  }
  session.startAutoSave()
})

onUnmounted(() => {
  clearStartupSchedule()
  if (wallpaperLoader) wallpaperLoader.src = ''
  wallpaperLoader = null
})

/* ---- locale watcher — re-derive titles when locale changes ---- */
watch(locale, (loc) => {
  if (isMobile.value) return
  wm.updateTitlesForLocale(loc)
  icons.updateTitlesForLocale(loc)
})
</script>

<template>
  <!-- ---- Mobile layout ---- -->
  <MobileApp v-if="isMobile" />

  <!-- ---- Desktop layout ---- -->
  <div
    v-else
    class="desktop-root"
    :class="{ 'desktop-root--wallpaper-ready': wallpaperReady }"
    :data-theme="theme.theme.value"
  >
    <TopBar
      :owner-name="OWNER_NAME"
      :focused-window-title="wm.focusedWindowTitle.value"
      :theme="theme.theme.value"
      @menu-action="onMenuAction"
      @toggle-theme="theme.toggle()"
      @reset="resetDesktop"
    />

    <main
      class="desktop-area"
      :aria-label="t('desktop.area')"
      @click.self="onClearSelection"
    >
      <h1 class="sr-only">{{ t('desktop.srTitle') }}</h1>
      <div class="desktop-vignette" aria-hidden="true" />

      <DesktopIcon
        v-for="item in icons.items"
        :key="item.id"
        :item="item"
        :is-selected="icons.selectedIconId.value === item.id"
        :style="icons.iconStyle(item)"
        @select="icons.selectIcon"
        @open="openItem"
        @pointerdown="icons.onIconPointerDown"
      />
    </main>

    <AppWindow
      v-for="ws in wm.visibleWindows.value"
      :key="ws.id"
      :window-state="ws"
      :is-focused="wm.state.focusedWindowId === ws.id"
      @close="wm.closeWindow"
      @minimize="wm.minimizeWindow"
      @restore="wm.restoreWindow"
      @focus="wm.focusWindow"
      @drag-start="onDragStart"
      @resize-start="onResizeStart"
    />

    <Dock
      :desktop-items="icons.items"
      :windows="wm.state.windows"
      :focused-window-id="wm.state.focusedWindowId"
      @launch="onDockLaunch"
      @toggle-dock="onDockToggle"
    />

    <aside v-if="toast.message.value" class="toast" aria-live="polite">
      {{ toast.message.value }}
    </aside>

    <AboutSiteModal v-if="showAboutSite" @close="showAboutSite = false" />

    <div class="notification-stack">
      <NotificationToast
        message-key="notification.followMessage"
        cta-key="notification.followCta"
        url="https://x.com/itechnologynet"
        :delay="12000"
      />
      <NotificationToast
        message-key="notification.connectMessage"
        cta-key="notification.connectCta"
        url="https://www.linkedin.com/in/hoffmannrobert"
        :delay="15000"
      />
    </div>
  </div>
</template>
