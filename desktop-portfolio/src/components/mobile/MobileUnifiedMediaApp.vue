<script setup lang="ts">
import UnifiedMediaPlayer from '../UnifiedMediaPlayer.vue'
import type { MediaPreset } from '../../types/media'

defineProps<{
  preset : MediaPreset
}>()
</script>

<template>
  <UnifiedMediaPlayer :preset="preset" />
</template>
