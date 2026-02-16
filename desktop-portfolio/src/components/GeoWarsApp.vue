<script setup lang="ts">
import { reactive, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { init, destroy, restart, togglePause, state as engineState } from '../modules/geowars'
import { easterEgg } from '../data/content'
import type { GameState } from '../types/desktop'
import { useLocale } from '../composables/useLocale'

const { t, l } = useLocale()

const containerRef = useTemplateRef<HTMLDivElement>('geowarsContainer')

/* Reactive copy synced from the engine's plain object at 10 Hz */
const gameState = reactive<GameState>({
  score    : 0,
  wave     : 1,
  lives    : 3,
  paused   : false,
  gameOver : false,
})

let syncTimer: ReturnType<typeof setInterval> | null = null

function startSync() {
  if (syncTimer) return
  syncTimer = setInterval(() => {
    gameState.score    = engineState.score
    gameState.wave     = engineState.wave
    gameState.lives    = engineState.lives
    gameState.paused   = engineState.paused
    gameState.gameOver = engineState.gameOver
  }, 100)
}

function stopSync() {
  if (syncTimer) clearInterval(syncTimer)
  syncTimer = null
}

onMounted(() => {
  if (containerRef.value) init(containerRef.value)
  startSync()
})

onUnmounted(() => {
  stopSync()
  destroy()
})

function onTogglePause() { togglePause() }
function onRestart()     { restart() }
</script>

<template>
  <div class="geowars-wrapper">
    <div class="geowars-hud">
      <span>{{ t('geowars.score') }} <span class="geowars-value">{{ gameState.score }}</span></span>
      <span>{{ t('geowars.wave') }} <span class="geowars-value">{{ gameState.wave }}</span></span>
      <span>{{ t('geowars.lives') }} <span class="geowars-value">{{ gameState.lives }}</span></span>
      <button class="geowars-btn" type="button" @click="onTogglePause">
        {{ gameState.paused ? t('geowars.resume') : t('geowars.pause') }}
      </button>
      <button class="geowars-btn" type="button" @click="onRestart">{{ t('geowars.restart') }}</button>
    </div>
    <div
      ref="geowarsContainer"
      class="geowars-container"
    />
    <p class="panel-meta">{{ l(easterEgg.body) }}</p>
  </div>
</template>

<style scoped>
.geowars-wrapper {
  display        : flex;
  flex-direction : column;
  gap            : var(--space-3);
  block-size     : 100%;
}

.geowars-container {
  position       : relative;
  flex           : 1 1 0;
  min-block-size : 240px;
  border-radius  : var(--radius-md);
  overflow       : hidden;
  background     : #040412;

  & canvas {
    display     : block;
    inline-size : 100%;
    block-size  : 100%;
  }
}

.geowars-hud {
  display     : flex;
  align-items : center;
  gap         : var(--space-4);
  font-size   : var(--text-sm);
  color       : var(--text-secondary);
  flex-wrap   : wrap;
}

.geowars-value {
  font-family : var(--font-mono);
  font-weight : 600;
  color       : var(--c-accent);
}

.geowars-btn {
  padding-inline : var(--space-3);
  padding-block  : var(--space-1);
  border-radius  : var(--radius-md);
  background     : var(--icon-selected-bg);
  color          : var(--c-accent);
  font-size      : var(--text-sm);
  font-weight    : 500;
  transition     : background var(--dur-fast) var(--ease-out);

  &:hover {
    background : var(--c-accent);
    color      : var(--c-white);
  }
}
</style>
