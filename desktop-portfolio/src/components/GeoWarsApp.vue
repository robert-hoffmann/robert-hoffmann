<script setup lang="ts">
import { reactive, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { init, destroy, restart, togglePause, state as engineState } from '../modules/geowars'
import { easterEgg } from '../data/content'
import type { GameState } from '../types/desktop'

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
      <span>Score: <span class="geowars-value">{{ gameState.score }}</span></span>
      <span>Wave: <span class="geowars-value">{{ gameState.wave }}</span></span>
      <span>Lives: <span class="geowars-value">{{ gameState.lives }}</span></span>
      <button class="geowars-btn" type="button" @click="onTogglePause">
        {{ gameState.paused ? '▶ Resume' : '⏸ Pause' }}
      </button>
      <button class="geowars-btn" type="button" @click="onRestart">↻ Restart</button>
    </div>
    <div
      ref="geowarsContainer"
      class="geowars-container"
    />
    <p class="panel-meta">{{ easterEgg.body }}</p>
  </div>
</template>
