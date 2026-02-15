<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import { useTheme } from '../composables/useTheme'
import { useViewMode } from '../composables/useViewMode'

defineProps<{
  ownerName : string
}>()

const { t, locale, toggleLocale } = useLocale()
const theme = useTheme()
const { isPreview, toggleViewMode } = useViewMode()
</script>

<template>
  <header class="mobile-header" aria-label="Site header">
    <span class="mobile-header-brand">{{ ownerName }}</span>

    <div class="mobile-header-actions">
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

      <!-- Theme toggle -->
      <button
        class="topbar-icon-btn"
        type="button"
        :aria-label="t('topbar.switchTheme', { theme: t(`theme.${theme.theme.value === 'dark' ? 'light' : 'dark'}`) })"
        @click="theme.toggle()"
      >{{ theme.theme.value === 'dark' ? '☀︎' : '☾' }}</button>

      <!-- Back to desktop (only shown when previewing mobile from desktop) -->
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

<style scoped>
.mobile-header {
  position         : sticky;
  inset-block-start: 0;
  z-index          : var(--z-topbar);
  display          : flex;
  align-items      : center;
  justify-content  : space-between;
  padding-inline   : var(--space-4);
  padding-block    : var(--space-3);
  background       : var(--surface-glass);
  backdrop-filter   : blur(16px) saturate(1.4);
  -webkit-backdrop-filter : blur(16px) saturate(1.4);
  border-block-end : 1px solid var(--border-subtle);
}

.mobile-header-brand {
  font-size   : var(--text-base);
  font-weight : 700;
  color       : var(--text-primary);
  white-space : nowrap;
}

.mobile-header-actions {
  display     : flex;
  align-items : center;
  gap         : var(--space-2);
}
</style>
