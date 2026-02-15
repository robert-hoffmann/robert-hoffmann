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
