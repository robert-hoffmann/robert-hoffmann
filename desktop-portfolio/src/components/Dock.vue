<script setup lang="ts">
import { computed } from 'vue'
import type { DesktopItem, WindowState } from '../types/desktop'
import { windowRegistry } from '../data/registry'

const props = defineProps<{
  desktopItems    : DesktopItem[]
  windows         : WindowState[]
  focusedWindowId : string | null
}>()

const emit = defineEmits<{
  launch     : [itemId: string]
  toggleDock : [windowId: string]
}>()

/** Dock launchers follow registry key order (canonical) */
const orderedItems = computed(() => {
  const ids = Object.keys(windowRegistry)
  return [...props.desktopItems].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
})

function iconForItem(itemId: string): string {
  return windowRegistry[itemId]?.icon ?? '◻︎'
}

function iconUrlForItem(itemId: string): string | undefined {
  return windowRegistry[itemId]?.iconUrl
}
</script>

<template>
  <footer class="dock" aria-label="Dock">
    <div class="dock-tray">
      <!-- Launcher icons -->
      <button
        v-for="item in orderedItems"
        :key="`launch-${item.id}`"
        class="dock-launch"
        type="button"
        :aria-label="`Launch ${item.title}`"
        @click="emit('launch', item.id)"
      >
        <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.title" class="dock-icon-img" width="32" height="32" />
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
          'dock-launch--active'   : focusedWindowId === ws.id && !ws.isMinimized,
          'dock-launch--minimized': ws.isMinimized,
        }"
        type="button"
        :aria-label="`Toggle ${ws.title}`"
        @click="emit('toggleDock', ws.id)"
      >
        <img v-if="iconUrlForItem(ws.itemId)" :src="iconUrlForItem(ws.itemId)" :alt="ws.title" class="dock-icon-img" width="32" height="32" />
        <span v-else class="dock-launch-icon" aria-hidden="true">{{ iconForItem(ws.itemId) }}</span>
        <span class="dock-tooltip">{{ ws.title }}</span>
        <span class="dock-window-dot" aria-hidden="true" />
      </button>

      <span class="dock-separator" aria-hidden="true" />

      <!-- Trash -->
      <button class="dock-launch dock-launch--trash" type="button" aria-label="Trash">
        <span class="dock-launch-icon" aria-hidden="true">🗑️</span>
        <span class="dock-tooltip">Trash</span>
      </button>
    </div>
  </footer>
</template>
