<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const emit = defineEmits<{ close : [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

function onBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('about-modal-backdrop')) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Transition name="about-modal">
    <div class="about-modal-backdrop" @click="onBackdropClick">
      <div class="about-modal" role="dialog" aria-modal="true" :aria-label="t('aboutModal.title')">
        <!-- macOS-style traffic-light close button -->
        <div class="about-modal-close-row">
          <button
            class="about-modal-close"
            type="button"
            :aria-label="t('aboutModal.close')"
            @click="emit('close')"
          >
            <span class="about-modal-close-dot" aria-hidden="true" />
          </button>
        </div>

        <!-- App icon -->
        <div class="about-modal-icon" aria-hidden="true">🖥</div>

        <!-- Title -->
        <h2 class="about-modal-title">Desktop Portfolio</h2>

        <!-- Version -->
        <p class="about-modal-version">{{ t('aboutModal.version') }}</p>

        <!-- Description -->
        <p class="about-modal-desc">{{ t('aboutModal.description') }}</p>

        <!-- Author -->
        <p class="about-modal-author">{{ t('aboutModal.author') }}</p>

        <!-- Links row -->
        <div class="about-modal-links">
          <a href="https://github.com/robert-hoffmann" target="_blank" rel="noopener">GitHub</a>
          <span class="about-modal-sep" aria-hidden="true">·</span>
          <a href="https://www.linkedin.com/in/hoffmannrobert" target="_blank" rel="noopener">LinkedIn</a>
          <span class="about-modal-sep" aria-hidden="true">·</span>
          <a href="https://x.com/itechnologynet" target="_blank" rel="noopener">X</a>
        </div>

        <!-- Copyright -->
        <p class="about-modal-copy">&copy; {{ new Date().getFullYear() }} Robert Hoffmann</p>
      </div>
    </div>
  </Transition>
</template>
