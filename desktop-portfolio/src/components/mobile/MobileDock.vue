<script setup lang="ts">
import { computed } from 'vue'
import type { DesktopSpriteKey, MobileAppState } from '../../types/desktop'
import { windowRegistry } from '../../data/registry'
import { useLocale } from '../../composables/useLocale'

interface MobileDockWindow {
  id     : string
  itemId : string
  title  : string
}

const props = defineProps<{
  windows         : MobileDockWindow[]
  currentWindowId : string | null
  mobileAppState  : MobileAppState
  currentAppTitle : string
}>()

const emit = defineEmits<{
  selectWindow      : [windowId: string]
  toggleCurrentApp  : []
}>()

const { t } = useLocale()

const hasCurrentWindow = computed(() =>
  Boolean(props.currentWindowId),
)

const isCurrentExpanded = computed(() =>
  hasCurrentWindow.value && props.mobileAppState === 'expanded',
)

const toggleButtonLabel = computed(() => {
  if (!hasCurrentWindow.value) return 'Select an app to enable minimize or restore'
  const baseLabel = isCurrentExpanded.value ? t('window.minimize') : t('window.restore')
  return props.currentAppTitle ? `${baseLabel}: ${props.currentAppTitle}` : baseLabel
})

const toggleTooltipLabel = computed(() => {
  if (!hasCurrentWindow.value) return 'No App'
  if (!props.currentAppTitle) return isCurrentExpanded.value ? 'Hide App' : 'Show App'
  return isCurrentExpanded.value
    ? `Hide ${props.currentAppTitle}`
    : `Show ${props.currentAppTitle}`
})

function isCurrentWindow(windowId: string) {
  return props.currentWindowId === windowId
}

function iconForItem(itemId: string) {
  return windowRegistry[itemId]?.icon ?? '◻︎'
}

function iconUrlForItem(itemId: string) {
  return windowRegistry[itemId]?.iconUrl
}

function iconSpriteForItem(itemId: string): DesktopSpriteKey | undefined {
  return windowRegistry[itemId]?.iconSprite
}
</script>

<template>
  <footer class="dock mobile" :aria-label="t('dock.label')">
    <div class="dock-tray mobile" role="toolbar" aria-label="App dock">
      <div class="dock-tray-scroll mobile" role="group" aria-label="Open apps">
        <button
          v-for="ws in windows"
          :key="`mobile-dock-${ws.id}`"
          class="dock-launch dock-launch--window"
          :class="{
            'dock-launch--active'   : isCurrentWindow(ws.id) && mobileAppState === 'expanded',
            'dock-launch--minimized': isCurrentWindow(ws.id) && mobileAppState === 'minimized',
          }"
          type="button"
          :data-item-id="ws.itemId"
          :data-window-id="ws.id"
          :data-mobile-current-window="isCurrentWindow(ws.id) ? '' : undefined"
          :aria-label="t('dock.toggle', { title: ws.title })"
          @click="emit('selectWindow', ws.id)"
        >
          <span
            v-if="iconSpriteForItem(ws.itemId)"
            class="icon-sprite dock-icon-sprite"
            :class="`icon-sprite--${iconSpriteForItem(ws.itemId)}`"
            aria-hidden="true"
          />
          <img
            v-else-if="iconUrlForItem(ws.itemId)"
            :src="iconUrlForItem(ws.itemId)"
            :alt="ws.title"
            class="dock-icon-img"
            width="48"
            height="48"
          />
          <span v-else class="dock-launch-icon" aria-hidden="true">{{ iconForItem(ws.itemId) }}</span>
          <span class="dock-tooltip">{{ ws.title }}</span>
          <span class="dock-window-dot" aria-hidden="true" />
        </button>
      </div>

      <span class="dock-separator" aria-hidden="true" />

      <div class="dock-tray-fixed mobile" role="group" aria-label="Current app controls">
        <button
          class="dock-launch dock-launch--control"
          type="button"
          data-mobile-action="toggle-current-app"
          :aria-pressed="isCurrentExpanded"
          :aria-label="toggleButtonLabel"
          :disabled="!hasCurrentWindow"
          @click="emit('toggleCurrentApp')"
        >
          <svg
            class="dock-control-icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <g class="dock-control-icon-graphic dock-control-icon-graphic--expand">
              <polyline points="1 5.5 1 1 5.5 1" />
              <polyline points="10.5 1 15 1 15 5.5" />
              <polyline points="15 10.5 15 15 10.5 15" />
              <polyline points="5.5 15 1 15 1 10.5" />
            </g>
            <g class="dock-control-icon-graphic dock-control-icon-graphic--collapse">
              <polyline points="5.5 1 5.5 5.5 1 5.5" />
              <polyline points="15 5.5 10.5 5.5 10.5 1" />
              <polyline points="10.5 15 10.5 10.5 15 10.5" />
              <polyline points="1 10.5 5.5 10.5 5.5 15" />
            </g>
          </svg>
          <span class="dock-tooltip" data-mobile-toggle-tooltip>{{ toggleTooltipLabel }}</span>
        </button>
      </div>
    </div>
  </footer>
</template>
