<script setup lang="ts">
import { computed } from 'vue'
import type { DesktopItem, DesktopSpriteKey, WindowState } from '../types/desktop'
import { windowRegistry } from '../data/registry'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const props = defineProps<{
  desktopItems    : DesktopItem[]
  windows         : WindowState[]
  focusedWindowId : string | null
}>()

const emit = defineEmits<{
  launch     : [itemId: string]
  toggleDock : [windowId: string]
  toggleAllWindows : []
}>()

/** Dock launchers follow registry key order (canonical) */
const orderedItems = computed(() => {
  const ids = Object.keys(windowRegistry)
  return [...props.desktopItems].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
})

const hasWindows = computed(() =>
  props.windows.length > 0,
)

const allWindowsMinimized = computed(() =>
  hasWindows.value && props.windows.every(windowState => windowState.mode === 'minimized'),
)

const isDockControlActive = computed(() =>
  hasWindows.value && !allWindowsMinimized.value,
)

const currentToggleLabel = computed(() => {
  if (!hasWindows.value) return t('dock.label')
  return allWindowsMinimized.value ? t('topbar.restoreAll') : t('topbar.minimizeAll')
})

const currentToggleTooltip = computed(() => {
  if (!hasWindows.value) return t('dock.label')
  return allWindowsMinimized.value ? t('topbar.restoreAll') : t('topbar.minimizeAll')
})

function iconForItem(itemId: string): string {
  return windowRegistry[itemId]?.icon ?? '◻︎'
}

function iconUrlForItem(itemId: string): string | undefined {
  return windowRegistry[itemId]?.iconUrl
}

function iconSpriteForItem(itemId: string): DesktopSpriteKey | undefined {
  return windowRegistry[itemId]?.iconSprite
}

function toggleCurrentWindow() {
  if (!hasWindows.value) return
  emit('toggleAllWindows')
}
</script>

<template>
  <footer class="dock" :aria-label="t('dock.label')">
    <div class="dock-tray">
      <!-- Launcher icons -->
      <button
        v-for="item in orderedItems"
        :key="`launch-${item.id}`"
        class="dock-launch"
        type="button"
        :aria-label="t('dock.launch', { title: item.title })"
        @click="emit('launch', item.id)"
      >
        <span
          v-if="item.iconSprite"
          class="icon-sprite dock-icon-sprite"
          :class="`icon-sprite--${item.iconSprite}`"
          aria-hidden="true"
        />
        <img v-else-if="item.iconUrl" :src="item.iconUrl" :alt="item.title" class="dock-icon-img" width="48" height="48" />
        <span v-else class="dock-launch-icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="dock-tooltip">{{ item.title }}</span>
      </button>

      <span v-if="windows.length" class="dock-separator" aria-hidden="true" />

      <!-- Open windows -->
      <button
        v-for="ws in windows"
        :key="`dock-${ws.id}`"
        class="dock-launch dock-launch--window"
        :class="{
          'dock-launch--active'   : focusedWindowId === ws.id && ws.mode !== 'minimized',
          'dock-launch--minimized': ws.mode === 'minimized',
        }"
        type="button"
        :aria-label="t('dock.toggle', { title: ws.title })"
        @click="emit('toggleDock', ws.id)"
      >
        <span
          v-if="iconSpriteForItem(ws.itemId)"
          class="icon-sprite dock-icon-sprite"
          :class="`icon-sprite--${iconSpriteForItem(ws.itemId)}`"
          aria-hidden="true"
        />
        <img v-else-if="iconUrlForItem(ws.itemId)" :src="iconUrlForItem(ws.itemId)" :alt="ws.title" class="dock-icon-img" width="48" height="48" />
        <span v-else class="dock-launch-icon" aria-hidden="true">{{ iconForItem(ws.itemId) }}</span>
        <span class="dock-tooltip">{{ ws.title }}</span>
        <span class="dock-window-dot" aria-hidden="true" />
      </button>

      <span class="dock-separator" aria-hidden="true" />

      <button
        class="dock-launch dock-launch--control"
        :class="{ 'dock-launch--active': isDockControlActive }"
        type="button"
        :aria-pressed="isDockControlActive"
        :aria-label="currentToggleLabel"
        :disabled="!hasWindows"
        @click="toggleCurrentWindow"
      >
        <svg
          class="dock-control-icon"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="0.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <g class="dock-control-icon-graphic dock-control-icon-graphic--expand">
            <polyline points="6 2 2 2 2 6" />
            <polyline points="10 14 14 14 14 10" />
            <polyline points="10 2 14 2 14 6" />
            <polyline points="6 14 2 14 2 10" />
            <path d="M5.5 10.5 10.5 5.5" />
            <polyline points="7.5 5.5 10.5 5.5 10.5 8.5" />
          </g>
          <g class="dock-control-icon-graphic dock-control-icon-graphic--collapse">
            <polyline points="6 2 2 2 2 6" />
            <polyline points="10 14 14 14 14 10" />
            <polyline points="10 2 14 2 14 6" />
            <polyline points="6 14 2 14 2 10" />
            <path d="M10.5 5.5 5.5 10.5" />
            <polyline points="8.5 10.5 5.5 10.5 5.5 7.5" />
          </g>
        </svg>
        <span class="dock-tooltip">{{ currentToggleTooltip }}</span>
      </button>
    </div>
  </footer>
</template>
