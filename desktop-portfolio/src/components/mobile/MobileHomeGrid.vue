<script setup lang="ts">
import { computed } from 'vue'
import type { DesktopSpriteKey } from '../../types/desktop'
import { getRegistryTitle, windowRegistry } from '../../data/registry'
import { useLocale } from '../../composables/useLocale'

interface MobileHomeGridItem {
  id        : string
  title     : string
  icon      : string
  iconUrl?  : string
  iconSprite?: DesktopSpriteKey
}

const emit = defineEmits<{
  launch : [itemId: string]
}>()

const { locale } = useLocale()

const HOME_ITEM_IDS = [
  'about',
  'projects',
  'resume',
  'twitter',
  'linkedin',
  'github',
  'music',
  'video'
] as const

const items = computed(() => {
  const nextItems: MobileHomeGridItem[] = []

  for (const id of HOME_ITEM_IDS) {
    const def = windowRegistry[id]
    if (!def) continue

    nextItems.push({
      id,
      title     : getRegistryTitle(id, locale.value),
      icon      : def.icon,
      iconUrl   : def.iconUrl,
      iconSprite: def.iconSprite,
    })
  }

  return nextItems
})
</script>

<template>
  <section class="mobile-home-icons" aria-label="Application shortcuts">
    <div class="mobile-home-icon-grid">
      <button
        v-for="item in items"
        :key="item.id"
        class="desktop-icon desktop-icon--mobile-grid"
        type="button"
        :data-item-id="item.id"
        :aria-label="item.title"
        @click="emit('launch', item.id)"
      >
        <span
          v-if="item.iconSprite"
          class="icon-sprite desktop-icon-sprite"
          :class="`icon-sprite--${item.iconSprite}`"
          aria-hidden="true"
        />
        <img
          v-else-if="item.iconUrl"
          :src="item.iconUrl"
          :alt="item.title"
          class="desktop-icon-img"
          width="48"
          height="48"
        />
        <span v-else class="desktop-icon-glyph" aria-hidden="true">{{ item.icon }}</span>
        <span class="desktop-icon-label">{{ item.title }}</span>
      </button>
    </div>
  </section>
</template>
