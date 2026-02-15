<script setup lang="ts">
import { onMounted } from 'vue'
import TopBar from './components/TopBar.vue'
import Dock from './components/Dock.vue'
import AppWindow from './components/AppWindow.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import { useWindowManager } from './composables/useWindowManager'
import { useDesktopIcons } from './composables/useDesktopIcons'
import { useTheme } from './composables/useTheme'
import { useToast } from './composables/useToast'
import { useDraggable } from './composables/useDraggable'
import { useResizable } from './composables/useResizable'
import { useSessionPersistence } from './composables/useSessionPersistence'
import { windowRegistry } from './data/registry'

/* ---- composables ---- */
const wm    = useWindowManager()
const icons = useDesktopIcons()
const theme = useTheme()
const toast = useToast()

const findWindow = (id: string) => wm.state.windows.find(w => w.id === id)
const { startDrag }   = useDraggable(findWindow)
const { startResize } = useResizable(findWindow)
const session         = useSessionPersistence(icons.items)

/* ---- constants ---- */
const OWNER_NAME    = 'Robert Hoffmann'
const WEATHER_LABEL = '22 °C ☀'

/* ---- default windows to open on first visit ---- */
const DEFAULT_WINDOWS = [
  { itemId : 'projects', title : 'Projects', x : 150,  y : 90,  w : 561, h : 768, zIndex : 100 },
  { itemId : 'about',    title : 'About Me', x : 557,  y : 36,  w : 497, h : 794, zIndex : 101 },
  { itemId : 'video',    title : 'Video',    x : 886,  y : 403, w : 466, h : 388, zIndex : 102 },
  { itemId : 'music',    title : 'Music',    x : 721,  y : 650, w : 452, h : 221, zIndex : 103 },
  { itemId : 'resume',   title : 'Resume',   x : 1454, y : 70,  w : 565, h : 763, zIndex : 104 },
]

/* ---- helpers ---- */
function openItem(itemId: string) {
  const def = windowRegistry[itemId]
  if (def?.type === 'link' && def.url) {
    window.open(def.url, '_blank', 'noopener')
    return
  }
  wm.openWindow(itemId)
}


function resetDesktop() {
  session.reset()
  wm.closeAll()
  for (const def of DEFAULT_WINDOWS) {
    const newWin = wm.openWindow(def.itemId)
    if (newWin) {
      newWin.x = def.x
      newWin.y = def.y
      newWin.w = def.w
      newWin.h = def.h
      newWin.zIndex = def.zIndex
    }
  }
  theme.setTheme('dark')
  toast.show('Desktop reset')
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
      toast.show('All windows closed')
      break

    case 'reset':
      resetDesktop()
      break

    case 'copyUrl':
      void navigator.clipboard?.writeText(window.location.href)
        .then(() => toast.show('Page URL copied'))
        .catch(() => toast.show('Copy failed — use browser address bar'))
      break

    case 'copyShareLink': {
      const openIds = wm.state.windows.map(w => w.itemId).join(',')
      const focused = wm.state.windows.find(w => w.id === wm.state.focusedWindowId)?.itemId ?? ''
      const url     = new URL(window.location.href)
      url.search    = ''
      if (openIds) url.searchParams.set('open', openIds)
      if (focused) url.searchParams.set('focus', focused)
      url.searchParams.set('theme', theme.theme.value)
      void navigator.clipboard?.writeText(url.toString())
        .then(() => toast.show('Share link copied'))
        .catch(() => toast.show('Copy failed'))
      break
    }

    case 'toggleTheme':
      theme.toggle()
      break

    case 'tileWindows': {
      const n = wm.tileWindows()
      if (n) toast.show(`Tiled ${n} windows`)
      break
    }

    case 'cascadeWindows':
      wm.cascadeWindows()
      toast.show('Windows cascaded')
      break

    case 'minimizeAll':
      wm.minimizeAll()
      toast.show('All windows minimized')
      break

    case 'restoreAll':
      wm.restoreAll()
      toast.show('All windows restored')
      break

    case 'aboutSite':
      toast.show('Desktop Portfolio — a macOS-inspired static portfolio by Robert Hoffmann', 4000)
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
        const newWin = wm.openWindow(def.itemId)
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
      aria-label="Desktop area"
      @click.self="onClearSelection"
    >
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
