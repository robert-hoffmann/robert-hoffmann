<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { MenuItem, MenuGroup } from '../types/desktop'

defineProps<{
  ownerName          : string
  focusedWindowTitle : string | null
  theme              : string
  weatherLabel       : string
}>()

const emit = defineEmits<{
  menuAction  : [action: string]
  toggleTheme : []
  reset       : []
}>()

/* ---- menu definitions ---- */
const menuDefinitions: MenuGroup[] = [
  {
    label : 'File',
    items : [
      { id : 'f-about',    label : 'Open About',         shortcut : '⌘1', action : 'open:about' },
      { id : 'f-projects', label : 'Open Projects',      shortcut : '⌘2', action : 'open:projects' },
      { id : 'f-resume',   label : 'Open Resume',        shortcut : '⌘3', action : 'open:resume' },
      { id : 'f-extras',   label : 'Open GeoWars',       shortcut : '⌘4', action : 'open:extras' },
      { id : 'f-music',    label : 'Open Music',         shortcut : '⌘5', action : 'open:music' },
      { id : 'f-video',    label : 'Open Video',         shortcut : '⌘6', action : 'open:video' },
      { type : 'separator' },
      { id : 'f-twitter',  label : 'Open X (Twitter)',                     action : 'open:twitter' },
      { id : 'f-linkedin', label : 'Open LinkedIn',                        action : 'open:linkedin' },
      { id : 'f-github',   label : 'Open GitHub',                          action : 'open:github' },
      { type : 'separator' },
      { id : 'f-closeall', label : 'Close All Windows',  shortcut : '⇧⌘W', action : 'closeAll' },
    ],
  },
  {
    label : 'Edit',
    items : [
      { id : 'e-reset', label : 'Reset Desktop',   shortcut : '⌘R',  action : 'reset' },
      { type : 'separator' },
      { id : 'e-copy',  label : 'Copy Page URL',   shortcut : '⌘C',  action : 'copyUrl' },
      { id : 'e-share', label : 'Copy Share Link', shortcut : '⇧⌘C', action : 'copyShareLink' },
    ],
  },
  {
    label : 'View',
    items : [
      { id : 'v-theme',   label : 'Toggle Theme',       shortcut : '⌘T',  action : 'toggleTheme' },
      { type : 'separator' },
      { id : 'v-tile',    label : 'Tile All Windows',    shortcut : '⌘G',  action : 'tileWindows' },
      { id : 'v-cascade', label : 'Cascade Windows',     shortcut : '⇧⌘G', action : 'cascadeWindows' },
      { type : 'separator' },
      { id : 'v-minim',   label : 'Minimize All',        shortcut : '⌘M',  action : 'minimizeAll' },
      { id : 'v-restore', label : 'Restore All',         shortcut : '⇧⌘M', action : 'restoreAll' },
    ],
  },
  {
    label : 'Help',
    items : [
      { id : 'h-about',  label : 'About This Site',       action : 'aboutSite' },
      { type : 'separator' },
      { id : 'h-github', label : 'View Source on GitHub',  action : 'github' },
    ],
  },
]

/* ---- menu interaction state ---- */
const openMenuId = ref<string | null>(null)
let menuLeaveTimer: ReturnType<typeof setTimeout> | null = null

function toggleMenu(label: string) {
  openMenuId.value = openMenuId.value === label ? null : label
}

function onMenuHover(label: string) {
  if (menuLeaveTimer) clearTimeout(menuLeaveTimer)
  if (openMenuId.value && openMenuId.value !== label) {
    openMenuId.value = label
  }
}

function onMenuLeave() {
  menuLeaveTimer = setTimeout(() => {
    openMenuId.value = null
  }, 300)
}

function onAction(item: MenuItem) {
  openMenuId.value = null
  if ('action' in item && item.action) {
    emit('menuAction', item.action)
  }
}

/* ---- clock ---- */
const timeLabel = ref('')
let clockInterval: ReturnType<typeof setInterval> | null = null

function updateClock() {
  timeLabel.value = new Date().toLocaleTimeString(undefined, {
    hour   : '2-digit',
    minute : '2-digit',
  })
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 15_000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
  if (menuLeaveTimer) clearTimeout(menuLeaveTimer)
})
</script>

<template>
  <header class="topbar" aria-label="Desktop top bar">
    <div class="topbar-group">
      <span class="topbar-brand">{{ ownerName }}</span>
      <div
        v-for="menu in menuDefinitions"
        :key="menu.label"
        class="topbar-menu"
        @mouseenter="onMenuHover(menu.label)"
        @mouseleave="onMenuLeave"
      >
        <button
          class="topbar-menu-btn"
          :class="{ 'topbar-menu-btn--open': openMenuId === menu.label }"
          type="button"
          @click="toggleMenu(menu.label)"
        >{{ menu.label }}</button>
        <div
          v-if="openMenuId === menu.label"
          class="topbar-dropdown"
          role="menu"
          :aria-label="`${menu.label} menu`"
        >
          <template v-for="item in menu.items" :key="'type' in item && item.type === 'separator' ? `sep-${menu.label}` : ('id' in item ? item.id : undefined)">
            <hr v-if="'type' in item && item.type === 'separator'" class="topbar-dropdown-sep" />
            <button
              v-else-if="'action' in item"
              class="topbar-dropdown-item"
              :class="{ 'topbar-dropdown-item--disabled': 'disabled' in item && item.disabled }"
              role="menuitem"
              type="button"
              :disabled="'disabled' in item && item.disabled === true"
              @click="onAction(item)"
            >
              <span class="topbar-dropdown-label">{{ item.label }}</span>
              <span v-if="'shortcut' in item && item.shortcut" class="topbar-dropdown-shortcut">{{ item.shortcut }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="topbar-center" aria-live="polite">
      <span class="topbar-context">{{ focusedWindowTitle || 'Desktop' }}</span>
    </div>

    <div class="topbar-group topbar-group--right">
      <span class="status-pill">{{ weatherLabel }}</span>
      <span class="status-pill mono">{{ timeLabel }}</span>
      <button
        class="topbar-icon-btn"
        type="button"
        :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
        @click="emit('toggleTheme')"
      >{{ theme === 'dark' ? '☀︎' : '☾' }}</button>
      <button class="topbar-icon-btn" type="button" aria-label="Reset desktop" @click="emit('reset')">↺</button>
    </div>
  </header>
</template>
