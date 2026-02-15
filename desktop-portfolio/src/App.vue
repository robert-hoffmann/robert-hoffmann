<script setup lang="ts">
import { onMounted, watch } from 'vue'
import TopBar from './components/TopBar.vue'
import Dock from './components/Dock.vue'
import AppWindow from './components/AppWindow.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import { useWindowManager } from './composables/useWindowManager'
import { useDesktopIcons } from './composables/useDesktopIcons'
import { useTheme } from './composables/useTheme'
import { useToast } from './composables/useToast'
import { useLocale } from './composables/useLocale'
import { useDraggable } from './composables/useDraggable'
import { useResizable } from './composables/useResizable'
import { useSessionPersistence } from './composables/useSessionPersistence'
import { windowRegistry } from './data/registry'

/* ---- composables ---- */
const wm    = useWindowManager()
const icons = useDesktopIcons()
const theme = useTheme()
const toast = useToast()
const { t, locale } = useLocale()

const findWindow = (id: string) => wm.state.windows.find(w => w.id === id)
const { startDrag }   = useDraggable(findWindow)
const { startResize } = useResizable(findWindow)
const session         = useSessionPersistence(icons.items)

/* ---- constants ---- */
const OWNER_NAME    = 'Robert Hoffmann'
const WEATHER_LABEL = '22 °C ☀'

/* ---- default windows to open on first visit ---- */
const DEFAULT_WINDOWS = [
  { itemId : 'projects', x : 150,  y : 90,  w : 561, h : 768, zIndex : 100 },
  { itemId : 'about',    x : 557,  y : 36,  w : 497, h : 794, zIndex : 101 },
  { itemId : 'video',    x : 886,  y : 403, w : 466, h : 388, zIndex : 102 },
  { itemId : 'music',    x : 721,  y : 650, w : 452, h : 221, zIndex : 103 },
  { itemId : 'resume',   x : 1454, y : 70,  w : 565, h : 763, zIndex : 104 },
]

/* ---- helpers ---- */
function openItem(itemId: string) {
  const def = windowRegistry[itemId]
  if (def?.type === 'link' && def.url) {
    window.open(def.url, '_blank', 'noopener')
    return
  }
  wm.openWindow(itemId, locale.value)
}


function resetDesktop() {
  session.reset()
  wm.closeAll()
  for (const def of DEFAULT_WINDOWS) {
    const newWin = wm.openWindow(def.itemId, locale.value)
    if (newWin) {
      newWin.x = def.x
      newWin.y = def.y
      newWin.w = def.w
      newWin.h = def.h
      newWin.zIndex = def.zIndex
    }
  }
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
      toast.show(t('toast.aboutSite'), 4000)
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
  /* Restore saved state or apply deep-link params */
  const hasDeepLinks = session.applyDeepLinks()
  if (!hasDeepLinks) {
    const restored = session.restore()
    if (!restored) {
      /* First visit — open default windows */
      for (const def of DEFAULT_WINDOWS) {
        const newWin = wm.openWindow(def.itemId, locale.value)
        if (newWin) {
          newWin.x = def.x
          newWin.y = def.y
          newWin.w = def.w
          newWin.h = def.h
          newWin.zIndex = def.zIndex
        }
      }
    }
  }
  session.startAutoSave()
})

/* ---- locale watcher — re-derive titles when locale changes ---- */
watch(locale, (loc) => {
  wm.updateTitlesForLocale(loc)
  icons.updateTitlesForLocale(loc)
})
</script>

<template>
  <div class="desktop-root" :data-theme="theme.theme.value">
    <TopBar
      :owner-name="OWNER_NAME"
      :focused-window-title="wm.focusedWindowTitle.value"
      :theme="theme.theme.value"
      :weather-label="WEATHER_LABEL"
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
  </div>
</template>
