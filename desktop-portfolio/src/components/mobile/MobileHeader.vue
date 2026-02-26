<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
import { useTheme } from '../../composables/useTheme'
import { useViewMode } from '../../composables/useViewMode'

defineProps<{
  ownerName : string
}>()

const { t, locale, toggleLocale } = useLocale()
const theme = useTheme()
const { isPreview, toggleViewMode } = useViewMode()
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
        v-if="isPreview"
        class="topbar-icon-btn"
        type="button"
        :aria-label="t('topbar.viewToggle')"
        @click="toggleViewMode()"
      >🖥</button>
    </div>
  </header>
</template>
