<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, useTemplateRef } from 'vue'
import {
  destroy,
  init,
  restart,
  setManualPause,
  start,
  state as engineState,
} from '../modules/geowars'
import type { GameState } from '../types/desktop'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const canvasHostRef = useTemplateRef<HTMLDivElement>('geowarsCanvasHost')
const interactionHostRef = useTemplateRef<HTMLDivElement>('geowarsInteractionHost')

/* Reactive copy synced from the engine's plain object at 10 Hz */
const gameState = reactive<GameState>({
  started  : false,
  score    : 0,
  wave     : 1,
  lives    : 3,
  paused   : true,
  gameOver : false,
})
let syncTimer: ReturnType<typeof setInterval> | null = null

function startSync() {
  if (syncTimer) return
  syncTimer = setInterval(() => {
    gameState.started  = engineState.started
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
  if (canvasHostRef.value) {
    init({
      canvasHost      : canvasHostRef.value,
      interactionHost : interactionHostRef.value ?? canvasHostRef.value,
    })
  }
  startSync()
})

onUnmounted(() => {
  stopSync()
  destroy()
})

const showIntroOverlay = computed(() => !gameState.started && !gameState.gameOver)
const showPauseOverlay = computed(() => gameState.started && gameState.paused && !gameState.gameOver)
const showGameOverOverlay = computed(() => gameState.gameOver)
const canPause = computed(() => gameState.started && !gameState.gameOver)

function onStart() {
  start()
}

function onTogglePause() {
  if (!gameState.started) {
    start()
    return
  }
  setManualPause(!gameState.paused)
}

function onRestart() {
  restart()
}

function onRestartFromGameOver() {
  restart()
  start()
}
</script>

<template>
  <div class="geowars-wrapper">
    <div ref="geowarsInteractionHost" class="geowars-stage">
      <div ref="geowarsCanvasHost" class="geowars-canvas" />

      <div class="geowars-hud">
        <div class="geowars-hud-group" role="status" aria-live="polite">
          <span class="geowars-chip">
            <span class="geowars-label">{{ t('geowars.score') }}</span>
            <span class="geowars-value">{{ gameState.score }}</span>
          </span>
          <span class="geowars-chip">
            <span class="geowars-label">{{ t('geowars.wave') }}</span>
            <span class="geowars-value">{{ gameState.wave }}</span>
          </span>
          <span class="geowars-chip">
            <span class="geowars-label">{{ t('geowars.lives') }}</span>
            <span class="geowars-value">{{ gameState.lives }}</span>
          </span>
        </div>

        <div class="geowars-hud-group geowars-hud-group--controls">
          <button
            class="geowars-btn"
            type="button"
            :disabled="!canPause"
            @click="onTogglePause"
          >
            {{ gameState.paused ? t('geowars.resume') : t('geowars.pause') }}
          </button>
          <button
            class="geowars-btn"
            type="button"
            @click="onRestart"
          >
            {{ t('geowars.restart') }}
          </button>
        </div>
      </div>

      <div
        v-if="showIntroOverlay"
        class="geowars-center-overlay"
        role="status"
        aria-live="polite"
      >
        <div class="geowars-card">
          <p class="geowars-card-eyebrow">{{ t('geowars.pausedLabel') }}</p>
          <h3 class="geowars-card-title">{{ t('geowars.introTitle') }}</h3>
          <p class="geowars-card-copy">{{ t('geowars.controlsHint') }}</p>
          <button class="geowars-btn geowars-btn--primary" type="button" @click="onStart">
            {{ t('geowars.startCta') }}
          </button>
        </div>
      </div>

      <div
        v-else-if="showPauseOverlay"
        class="geowars-center-overlay"
        role="status"
        aria-live="polite"
      >
        <div class="geowars-card">
          <p class="geowars-card-eyebrow">{{ t('geowars.pausedLabel') }}</p>
          <h3 class="geowars-card-title">{{ t('geowars.pausedLabel') }}</h3>
          <button class="geowars-btn geowars-btn--primary" type="button" @click="onTogglePause">
            {{ t('geowars.resume') }}
          </button>
        </div>
      </div>

      <div
        v-else-if="showGameOverOverlay"
        class="geowars-center-overlay"
        role="status"
        aria-live="polite"
      >
        <div class="geowars-card">
          <h3 class="geowars-card-title">{{ t('geowars.gameOver') }}</h3>
          <p class="geowars-card-copy">
            {{ t('geowars.finalScore') }}
            <span class="geowars-value">{{ gameState.score }}</span>
          </p>
          <button class="geowars-btn geowars-btn--primary" type="button" @click="onRestartFromGameOver">
            {{ t('geowars.restart') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.geowars-wrapper {
  block-size     : 100%;
  min-block-size : 0;
}

.geowars-stage {
  position       : relative;
  block-size     : 100%;
  min-block-size : 240px;
  border-radius  : var(--radius-md);
  overflow       : hidden;
  border         : 1px solid oklch(68% 0.17 235 / 0.62);
  box-shadow     : inset 0 0 0 1px oklch(76% 0.2 230 / 0.12),
                   0 0 18px oklch(58% 0.16 230 / 0.22);
  background     : radial-gradient(circle at 50% -20%, oklch(68% 0.15 240 / 0.22), transparent 62%),
                   radial-gradient(circle at 50% 120%, oklch(64% 0.15 290 / 0.14), transparent 52%),
                   #040412;
  container      : geowars-stage / inline-size;
}

.geowars-canvas {
  inline-size : 100%;
  block-size  : 100%;

  & canvas {
    display     : block;
    inline-size : 100%;
    block-size  : 100%;
  }
}

.geowars-hud {
  position           : absolute;
  inset-block-start  : var(--space-3);
  inset-inline       : var(--space-3);
  z-index            : 2;
  display            : flex;
  justify-content    : space-between;
  gap                : var(--space-2);
  flex-wrap          : wrap;
  pointer-events     : none;
}

.geowars-hud-group {
  display     : flex;
  align-items : center;
  flex-wrap   : wrap;
  gap         : var(--space-2);
}

.geowars-hud-group--controls {
  justify-content : flex-end;
}

.geowars-chip {
  display         : inline-flex;
  align-items     : baseline;
  gap             : 0.35rem;
  padding         : 0;
  background      : transparent;
  border          : none;
  box-shadow      : none;
}

.geowars-label {
  color          : oklch(88% 0.07 230 / 0.92);
  font-family    : var(--font-mono);
  font-size      : 0.82rem;
  font-weight    : 500;
  text-transform : uppercase;
  letter-spacing : 0.07em;
  text-shadow    : 0 0 6px oklch(68% 0.16 220 / 0.2);
}

.geowars-value {
  font-family  : var(--font-mono);
  font-size    : 0.82rem;
  font-weight  : 600;
  line-height  : 1;
  color        : oklch(86% 0.16 205 / 0.94);
  text-shadow  : 0 0 8px oklch(70% 0.18 210 / 0.3);
}

.geowars-btn {
  pointer-events : auto;
  padding-inline : var(--space-3);
  padding-block  : var(--space-1);
  border-radius  : var(--radius-full);
  border         : 1px solid oklch(72% 0.19 220 / 0.8);
  background     : transparent;
  color          : oklch(92% 0.05 240);
  box-shadow     : inset 0 0 0 1px oklch(90% 0.22 220 / 0.08),
                   0 0 14px oklch(62% 0.17 220 / 0.22);
  font-size      : var(--text-xs);
  font-weight    : 600;
  transition     : background var(--dur-fast) var(--ease-out),
                   color var(--dur-fast) var(--ease-out),
                   border-color var(--dur-fast) var(--ease-out),
                   box-shadow var(--dur-fast) var(--ease-out),
                   transform var(--dur-fast) var(--ease-out);

  &:hover:not(:disabled) {
    background   : transparent;
    border-color : oklch(84% 0.24 215 / 0.92);
    box-shadow   : inset 0 0 0 1px oklch(94% 0.28 215 / 0.2),
                   0 0 18px oklch(68% 0.2 215 / 0.34);
    color        : oklch(98% 0.04 230);
    transform    : translateY(-1px);
  }

  &:focus-visible {
    outline        : 2px solid oklch(88% 0.2 220 / 0.9);
    outline-offset : 2px;
  }

  &:disabled {
    opacity : 0.5;
  }
}

.geowars-btn--primary {
  padding-inline : var(--space-4);
  border-color   : oklch(75% 0.24 210 / 0.92);
  box-shadow     : inset 0 0 0 1px oklch(96% 0.25 210 / 0.12),
                   0 0 22px oklch(70% 0.21 210 / 0.35);
}

.geowars-center-overlay {
  position       : absolute;
  inset          : 0;
  z-index        : 3;
  display        : grid;
  place-items    : center;
  padding        : var(--space-4);
  pointer-events : none;
}

.geowars-card {
  pointer-events : auto;
  inline-size    : min(100%, 32rem);
  text-align     : center;
  padding        : var(--space-4);
  border-radius  : var(--radius-lg);
  border         : 1px solid oklch(74% 0.2 220 / 0.72);
  background     : linear-gradient(180deg, oklch(12% 0.03 255 / 0.42), oklch(8% 0.02 255 / 0.3));
  box-shadow     : inset 0 0 0 1px oklch(94% 0.27 220 / 0.09),
                   0 0 32px oklch(63% 0.18 220 / 0.22);
}

.geowars-card-eyebrow {
  margin-block-end : var(--space-1);
  font-size        : var(--text-xs);
  letter-spacing   : 0.08em;
  text-transform   : uppercase;
  color            : oklch(84% 0.04 255 / 0.8);
}

.geowars-card-title {
  margin-block-end : var(--space-2);
  font-size        : clamp(1.05rem, 2.2cqi, 1.35rem);
  font-weight      : 700;
  color            : oklch(97% 0.02 250);
}

.geowars-card-copy {
  margin-block-end : var(--space-3);
  color            : oklch(88% 0.03 250 / 0.9);
  line-height      : var(--leading-relaxed);
  font-size        : var(--text-sm);
}

@container geowars-stage (max-width: 540px) {
  .geowars-hud {
    inset-inline : var(--space-2);
  }

  .geowars-btn {
    padding-inline : var(--space-2);
  }

  .geowars-label,
  .geowars-value {
    font-size : 0.74rem;
  }

  .geowars-card {
    padding : var(--space-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .geowars-btn {
    transition : none;
  }
}
</style>
