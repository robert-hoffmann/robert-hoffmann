<script setup lang="ts">
import type { DesktopItem } from '../types/desktop'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

defineProps<{
  item       : DesktopItem
  isSelected : boolean
  style      : Record<string, string>
}>()

const emit = defineEmits<{
  select      : [id: string]
  open        : [id: string]
  pointerdown : [event: PointerEvent, id: string]
}>()
</script>

<template>
  <button
    class="desktop-icon"
    :class="{ 'desktop-icon--selected': isSelected }"
    type="button"
    :style="style"
    :aria-label="`${item.title} ${t(`iconType.${item.type}`)}`"
    @click.stop="emit('select', item.id)"
    @dblclick.stop="emit('open', item.id)"
    @pointerdown="emit('pointerdown', $event, item.id)"
  >
    <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.title" class="desktop-icon-img" width="48" height="48" />
    <span v-else class="desktop-icon-glyph" aria-hidden="true">{{ item.icon }}</span>
    <span class="desktop-icon-label">{{ item.title }}</span>
  </button>
</template>
