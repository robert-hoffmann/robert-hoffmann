<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { useTheme } from '../../composables/useTheme'
import { useViewMode } from '../../composables/useViewMode'

defineProps<{
  ownerName : string
}>()

const { t, locale, toggleLocale } = useLocale()
const theme = useTheme()
const { isPreview, toggleViewMode } = useViewMode()
const isFullscreen = ref(false)

const supportsFullscreen = computed(() => {
  if (typeof document === 'undefined') return false
  return typeof document.documentElement.requestFullscreen === 'function'
})

function toggleFullscreen() {
  if (!supportsFullscreen.value) return

  if (document.fullscreenElement) {
    void document.exitFullscreen()
    return
  }

  void document.documentElement.requestFullscreen()
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  onFullscreenChange()
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <header class="topbar mobile" aria-label="Site header">
    <div class="topbar-group">
      <span class="topbar-brand">{{ ownerName }}</span>
    </div>

    <div class="topbar-group topbar-group--right">
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
        :aria-label="t('topbar.switchTheme', { theme: t(`theme.${theme.theme.value === 'dark' ? 'light' : 'dark'}`) })"
        @click="theme.toggle()"
      >{{ theme.theme.value === 'dark' ? '☀︎' : '☾' }}</button>

      <button
        v-if="supportsFullscreen"
        class="topbar-icon-btn"
        type="button"
        :aria-label="t('topbar.toggleFullscreen')"
        @click="toggleFullscreen"
      ><svg class="topbar-fs-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><template v-if="!isFullscreen"><polyline points="1 5.5 1 1 5.5 1" /><polyline points="10.5 1 15 1 15 5.5" /><polyline points="15 10.5 15 15 10.5 15" /><polyline points="5.5 15 1 15 1 10.5" /></template><template v-else><polyline points="5.5 1 5.5 5.5 1 5.5" /><polyline points="15 5.5 10.5 5.5 10.5 1" /><polyline points="10.5 15 10.5 10.5 15 10.5" /><polyline points="1 10.5 5.5 10.5 5.5 15" /></template></svg></button>

      <button
        v-if="isPreview"
        class="topbar-icon-btn"
        type="button"
        :aria-label="t('topbar.viewToggle')"
        @click="toggleViewMode()"
      >🖥</button>
    </div>
  </header>
</template>
