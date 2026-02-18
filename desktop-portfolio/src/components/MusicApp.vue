<script setup lang="ts">
import { computed, reactive, shallowRef, triggerRef, onUnmounted, useTemplateRef } from 'vue'
import { formatTime } from '../utils'
import type { MusicPlayerState } from '../types/desktop'
import { useLocale } from '../composables/useLocale'
import { useSeekBar } from '../composables/useSeekBar'

const { t } = useLocale()

const EQ_BARS   = 16
const FFT_SIZE  = 64  /* smallest power-of-2 ≥ 2×EQ_BARS → 32 bins */
const TRACK_URL = `${import.meta.env.BASE_URL}music.mp3`

const audioRef = useTemplateRef<HTMLAudioElement>('audio')

const state = reactive<MusicPlayerState>({
  playing  : false,
  paused   : false,
  loop     : true,
  elapsed  : 0,
  duration : 0,
  volume   : 0.8,
  muted    : false,
})

/**
 * Per-bar heights (0–100 %) driven by real FFT data.
 * shallowRef avoids deep tracking — triggerRef is used for
 * explicit, low-overhead updates at ~60 fps.
 */
const barHeights = shallowRef<number[]>(Array.from<number>({ length: EQ_BARS }).fill(0))

/* -- Web Audio analyser ------------------------------------- */

let audioCtx  : AudioContext | null = null
let analyser  : AnalyserNode | null = null
let sourceNode: MediaElementAudioSourceNode | null = null
let rafId     : number | null = null
let freqData  : Uint8Array<ArrayBuffer> | null = null

/**
 * Lazily connect the <audio> element to an AnalyserNode.
 * Creating the AudioContext is deferred to the first user-gesture
 * play to satisfy browser autoplay policy.
 */
function ensureAnalyser() {
  const el = audioRef.value
  if (!el || analyser) return

  audioCtx   = new AudioContext()
  analyser   = audioCtx.createAnalyser()
  analyser.fftSize              = FFT_SIZE
  analyser.smoothingTimeConstant = 0.7
  freqData   = new Uint8Array(analyser.frequencyBinCount)

  sourceNode = audioCtx.createMediaElementSource(el)
  sourceNode.connect(analyser)
  analyser.connect(audioCtx.destination)
}

/** rAF loop — read frequency bins and map to bar heights */
function tickEq() {
  if (!analyser || !freqData) return

  analyser.getByteFrequencyData(freqData)

  /* Map frequencyBinCount bins → EQ_BARS bars (average when >16 bins) */
  const binCount  = analyser.frequencyBinCount
  const binsPerBar = Math.max(1, Math.floor(binCount / EQ_BARS))
  const heights    = barHeights.value

  for (let i = 0; i < EQ_BARS; i++) {
    let sum = 0
    for (let j = 0; j < binsPerBar; j++) {
      sum += freqData[i * binsPerBar + j] ?? 0
    }
    /* Normalise 0-255 → 0-100 % with a slight minimum so idle bars show a nub */
    heights[i] = Math.max(8, (sum / binsPerBar / 255) * 100)
  }

  /* Explicit trigger — no self-assignment, no deep tracking overhead */
  triggerRef(barHeights)

  rafId = requestAnimationFrame(tickEq)
}

function startEqLoop() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(tickEq)
}

function stopEqLoop() {
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
  /* Drop bars to baseline */
  barHeights.value.fill(0)
  triggerRef(barHeights)
}

/* -- Helpers ------------------------------------------------ */

const seekBar = useSeekBar()

function progressValue(): number {
  if (!state.duration) return 0
  return Math.max(0, Math.min(100, (state.elapsed / state.duration) * 100))
}

function progressPct(): string {
  return `${progressValue()}%`
}

/** Seek to a position based on click/pointer location on the progress bar */
function onSeek(event: MouseEvent) {
  const el  = audioRef.value
  if (!el || !state.duration) return
  const pct = seekBar.pointerRatio(event)
  if (pct === null) return
  el.currentTime = pct * state.duration
}

function onSeekHover(event: MouseEvent) {
  seekBar.hover(event, state.duration)
}

function onSeekLeave() {
  seekBar.leave()
}

const seekPreview = computed(() => seekBar.preview(progressValue()))

/* -- Transport controls ------------------------------------- */

/** Flag to distinguish user-initiated pauses from loop-boundary pauses */
let userPause = false

function onPlayPause() {
  const el = audioRef.value
  if (!el) return

  if (state.playing && !state.paused) {
    userPause = true
    el.pause()
  } else {
    ensureAnalyser()
    if (audioCtx?.state === 'suspended') void audioCtx.resume()
    void el.play()
  }
}

function onStop() {
  const el = audioRef.value
  if (!el) return
  userPause = true
  el.pause()
  el.currentTime = 0
  state.playing = false
  state.paused  = false
  state.elapsed = 0
  stopEqLoop()
}

function toggleLoop() {
  state.loop = !state.loop
  if (audioRef.value) audioRef.value.loop = state.loop
}

/* -- Volume controls ---------------------------------------- */

/** Volume level stored before muting so it can be restored */
let preMuteVolume = state.volume

function setVolume(vol: number) {
  const clamped = Math.max(0, Math.min(1, vol))
  state.volume = clamped
  state.muted  = clamped === 0
  if (audioRef.value) {
    audioRef.value.volume = clamped
    audioRef.value.muted  = clamped === 0
  }
}

function toggleMute() {
  if (state.muted) {
    /* Unmute — restore previous level (fallback to 0.8 if it was 0) */
    setVolume(preMuteVolume || 0.8)
  } else {
    preMuteVolume = state.volume
    setVolume(0)
  }
}

function onVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement
  setVolume(Number(target.value))
}

/* -- Audio event handlers ----------------------------------- */

function onAudioPlay()       { state.playing = true;  state.paused = false; startEqLoop() }
function onAudioPause() {
  if (!state.playing) return
  /*
   * When <audio loop> cycles, some browsers fire a transient
   * pause → play pair.  Tearing down the rAF loop here causes
   * allocation churn and a visible EQ flash every loop.
   * Only act on explicit user-initiated pauses.
   */
  if (!userPause) return
  userPause = false
  state.paused = true
  stopEqLoop()
}
function onAudioEnded()      { state.playing = false; state.paused = false; state.elapsed = 0; stopEqLoop() }
function onDurationChange()  { state.duration = audioRef.value?.duration ?? 0 }
function onTimeUpdate()      { state.elapsed  = audioRef.value?.currentTime ?? 0 }

/* -- Lifecycle ---------------------------------------------- */

onUnmounted(() => {
  stopEqLoop()
  const el = audioRef.value
  if (el) { el.pause(); el.currentTime = 0 }
  if (audioCtx) { void audioCtx.close(); audioCtx = null }
  analyser   = null
  sourceNode = null
  freqData   = null
})
</script>

<template>
  <div class="music-player">
    <!-- Hidden native audio element -->
    <audio
      ref="audio"
      :src="TRACK_URL"
      :loop="state.loop"
      preload="metadata"
      @play="onAudioPlay"
      @pause="onAudioPause"
      @ended="onAudioEnded"
      @durationchange="onDurationChange"
      @timeupdate="onTimeUpdate"
    />

    <div class="music-player-row">
      <!-- Disc art -->
      <div class="music-player-art" aria-hidden="true">
        <span class="music-player-art-icon" :class="{ spinning: state.playing && !state.paused }">💿</span>
        <div class="music-player-art-ring" :class="{ active: state.playing && !state.paused }" />
      </div>

      <!-- Track info + progress -->
      <div class="music-player-body">
        <div class="music-player-info">
          <h3 class="music-player-title">Rockstar</h3>
          <p class="music-player-artist">Post Malone ft. 21 Savage</p>
        </div>
        <div class="music-player-progress">
          <div
            class="music-player-bar music-player-bar--seekable"
            role="slider"
            tabindex="0"
            :aria-label="t('music.seek')"
            :aria-valuemin="0"
            :aria-valuemax="Math.round(state.duration)"
            :aria-valuenow="Math.round(state.elapsed)"
            @click="onSeek"
            @pointermove="onSeekHover"
            @pointerleave="onSeekLeave"
          >
            <div
              v-if="seekPreview"
              :class="['music-player-bar-hover', `seek-preview--${seekPreview.direction}`]"
              :style="{ inlineSize: `${seekPreview.width}%`, insetInlineStart: `${seekPreview.start}%` }"
            />
            <div
              class="music-player-bar-fill"
              :class="{ 'seek-fill--backward': seekPreview?.direction === 'backward' }"
              :style="{ width: progressPct() }"
            />
          </div>
          <div class="music-player-times">
            <span>{{ formatTime(state.elapsed) }}</span>
            <span>{{ formatTime(state.duration) }}</span>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="music-player-controls">
        <button
          class="music-player-btn music-player-btn--sm"
          type="button"
          :class="{ 'music-player-btn--active': state.loop }"
          :aria-label="state.loop ? t('music.disableLoop') : t('music.enableLoop')"
          @click="toggleLoop"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 2l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 22l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
        <button
          class="music-player-btn music-player-btn--main"
          type="button"
          :aria-label="t('music.playPause')"
          @click="onPlayPause"
        >
          <!-- Pause icon -->
          <svg v-if="state.playing && !state.paused" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <!-- Play icon -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        </button>
        <button
          class="music-player-btn music-player-btn--sm"
          type="button"
          :disabled="!state.playing"
          :aria-label="t('music.stop')"
          @click="onStop"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Volume control -->
    <div class="music-player-volume">
      <button
        class="music-player-btn music-player-btn--sm music-player-volume-icon"
        type="button"
        :aria-label="state.muted ? t('music.unmute') : t('music.mute')"
        @click="toggleMute"
      >
        <!-- Muted / zero -->
        <svg v-if="state.muted || state.volume === 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
        <!-- Low volume -->
        <svg v-else-if="state.volume < 0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <!-- High volume -->
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      </button>
      <input
        class="music-player-volume-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="state.muted ? 0 : state.volume"
        :aria-label="t('music.volume')"
        @input="onVolumeInput"
      />
      <span class="music-player-volume-pct">{{ Math.round((state.muted ? 0 : state.volume) * 100) }}%</span>
    </div>

    <!-- EQ bars — driven by Web Audio FFT data -->
    <div
      class="music-player-eq"
      :class="{ active: state.playing && !state.paused }"
      aria-hidden="true"
    >
      <span
        v-for="(h, i) in barHeights"
        :key="i"
        class="eq-bar"
        :style="{ blockSize: `${h}%` }"
      />
    </div>
  </div>
</template>
