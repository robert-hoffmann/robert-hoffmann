<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { MenuItem, MenuGroup } from '../types/desktop'
import { useLocale } from '../composables/useLocale'
import { useViewMode } from '../composables/useViewMode'

const { t, locale, toggleLocale } = useLocale()
const { viewMode, toggleViewMode } = useViewMode()

const isFullscreen = ref(false)

function toggleFullscreen() {
  if (document.fullscreenElement) {
    void document.exitFullscreen()
  } else {
    void document.documentElement.requestFullscreen()
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

defineProps<{
  ownerName          : string
  focusedWindowTitle : string | null
  theme              : string
}>()

const emit = defineEmits<{
  menuAction  : [action: string]
  toggleTheme : []
  reset       : []
}>()

/* ---- menu definitions (reactive to locale) ---- */
const menuDefinitions = computed<MenuGroup[]>(() => [
  {
    label : t('topbar.file'),
    items : [
      { id : 'f-about',    label : t('topbar.openAbout'),     shortcut : '⌘1', action : 'open:about' },
      { id : 'f-projects', label : t('topbar.openProjects'),  shortcut : '⌘2', action : 'open:projects' },
      { id : 'f-resume',   label : t('topbar.openResume'),    shortcut : '⌘3', action : 'open:resume' },
      { id : 'f-extras',   label : t('topbar.openGeoWars'),   shortcut : '⌘4', action : 'open:extras' },
      { id : 'f-music',    label : t('topbar.openMusic'),     shortcut : '⌘5', action : 'open:music' },
      { id : 'f-video',    label : t('topbar.openVideo'),     shortcut : '⌘6', action : 'open:video' },
      { id : 'f-terminal', label : t('topbar.openTerminal'),  shortcut : '⌘7', action : 'open:terminal' },
      { type : 'separator' },
      { id : 'f-twitter',  label : t('topbar.openTwitter'),                     action : 'open:twitter' },
      { id : 'f-linkedin', label : t('topbar.openLinkedIn'),                    action : 'open:linkedin' },
      { id : 'f-github',   label : t('topbar.openGitHub'),                      action : 'open:github' },
      { type : 'separator' },
      { id : 'f-closeall', label : t('topbar.closeAll'),      shortcut : '⇧⌘W', action : 'closeAll' },
    ],
  },
  {
    label : t('topbar.edit'),
    items : [
      { id : 'e-reset', label : t('topbar.resetDesktop'),   shortcut : '⌘R',  action : 'reset' },
      { type : 'separator' },
      { id : 'e-copy',  label : t('topbar.copyPageUrl'),    shortcut : '⌘C',  action : 'copyUrl' },
      { id : 'e-share', label : t('topbar.copyShareLink'),  shortcut : '⇧⌘C', action : 'copyShareLink' },
    ],
  },
  {
    label : t('topbar.view'),
    items : [
      { id : 'v-theme',   label : t('topbar.toggleTheme'),       shortcut : '⌘T',  action : 'toggleTheme' },
      { type : 'separator' },
      { id : 'v-tile',    label : t('topbar.tileWindows'),       shortcut : '⌘G',  action : 'tileWindows' },
      { id : 'v-cascade', label : t('topbar.cascadeWindows'),    shortcut : '⇧⌘G', action : 'cascadeWindows' },
      { type : 'separator' },
      { id : 'v-minim',   label : t('topbar.minimizeAll'),       shortcut : '⌘M',  action : 'minimizeAll' },
      { id : 'v-restore', label : t('topbar.restoreAll'),        shortcut : '⇧⌘M', action : 'restoreAll' },
    ],
  },
  {
    label : t('topbar.help'),
    items : [
      { id : 'h-about',  label : t('topbar.aboutSite'),       action : 'aboutSite' },
      { type : 'separator' },
      { id : 'h-github', label : t('topbar.viewSource'),      action : 'github' },
    ],
  },
])

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
  timeLabel.value = new Date().toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : undefined, {
    hour   : '2-digit',
    minute : '2-digit',
  })
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 15_000)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
  if (menuLeaveTimer) clearTimeout(menuLeaveTimer)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
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
      <span class="topbar-context">{{ focusedWindowTitle || t('topbar.desktop') }}</span>
    </div>

    <div class="topbar-group topbar-group--right">
      <span class="status-pill mono">{{ timeLabel }}</span>

      <!-- View-mode toggle (desktop ↔ mobile preview) -->
      <span class="locale-toggle" role="radiogroup" :aria-label="t('topbar.viewToggle')">
        <button
          class="locale-toggle-btn"
          :class="{ 'locale-toggle-btn--active': viewMode === 'desktop' }"
          type="button"
          role="radio"
          :aria-checked="viewMode === 'desktop'"
          @click="viewMode !== 'desktop' && toggleViewMode()"
        >🖥</button>
        <button
          class="locale-toggle-btn"
          :class="{ 'locale-toggle-btn--active': viewMode === 'mobile' }"
          type="button"
          role="radio"
          :aria-checked="viewMode === 'mobile'"
          @click="viewMode !== 'mobile' && toggleViewMode()"
        >📱</button>
      </span>

      <!-- Locale toggle -->
      <span class="locale-toggle" role="radiogroup" :aria-label="t('topbar.toggleLocale')">
        <button
          class="locale-toggle-btn"
          :class="{ 'locale-toggle-btn--active': locale === 'en' }"
          type="button"
          role="radio"
          :aria-checked="locale === 'en'"
          @click="locale !== 'en' && toggleLocale()"
        >EN</button>
        <button
          class="locale-toggle-btn"
          :class="{ 'locale-toggle-btn--active': locale === 'fr' }"
          type="button"
          role="radio"
          :aria-checked="locale === 'fr'"
          @click="locale !== 'fr' && toggleLocale()"
        >FR</button>
      </span>
      <button
        class="topbar-icon-btn"
        type="button"
        :aria-label="t('topbar.switchTheme', { theme: t(`theme.${theme === 'dark' ? 'light' : 'dark'}`) })"
        @click="emit('toggleTheme')"
      >{{ theme === 'dark' ? '☀︎' : '☾' }}</button>
      <button
        class="topbar-icon-btn"
        type="button"
        :aria-label="t('topbar.toggleFullscreen')"
        @click="toggleFullscreen"
      ><svg class="topbar-fs-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><template v-if="!isFullscreen"><polyline points="1 5.5 1 1 5.5 1" /><polyline points="10.5 1 15 1 15 5.5" /><polyline points="15 10.5 15 15 10.5 15" /><polyline points="5.5 15 1 15 1 10.5" /></template><template v-else><polyline points="5.5 1 5.5 5.5 1 5.5" /><polyline points="15 5.5 10.5 5.5 10.5 1" /><polyline points="10.5 15 10.5 10.5 15 10.5" /><polyline points="1 10.5 5.5 10.5 5.5 15" /></template></svg></button>
      <button class="topbar-icon-btn" type="button" :aria-label="t('topbar.resetDesktopAria')" @click="emit('reset')">↺</button>
    </div>
  </header>
</template>
