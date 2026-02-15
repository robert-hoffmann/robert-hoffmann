<script setup lang="ts">
import { reactive, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { formatTime } from '../utils'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const VIDEO_ID = 'YkEVCFfms30'

const containerRef = useTemplateRef<HTMLDivElement>('playerContainer')
const wrapperRef   = useTemplateRef<HTMLDivElement>('videoWrapper')

const state = reactive({
  ready    : false,
  playing  : false,
  paused   : false,
  muted    : false,
  elapsed  : 0,
  duration : 0,
  volume   : 80,
})

let player    : YT.Player | null = null
let tickTimer    : ReturnType<typeof setInterval> | null = null

/* -- YouTube IFrame API loader ------------------------------ */

function loadYTApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag    = document.createElement('script')
      tag.src      = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
}

/* -- Tick: poll player time --------------------------------- */

function startTick() {
  stopTick()
  tickTimer = setInterval(() => {
    if (!player || !state.playing) return
    state.elapsed  = player.getCurrentTime?.() ?? 0
    state.duration = player.getDuration?.()    ?? 0
  }, 250)
}

function stopTick() {
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null }
}

/* -- Helpers ------------------------------------------------ */

function progressPct(): string {
  if (!state.duration) return '0%'
  return `${(state.elapsed / state.duration) * 100}%`
}

/* -- Transport controls ------------------------------------- */

function onPlayPause() {
  if (!player || !state.ready) return
  if (state.playing && !state.paused) {
    player.pauseVideo()
  } else {
    player.playVideo()
  }
}

function onStop() {
  if (!player) return
  player.stopVideo()
  state.playing = false
  state.paused  = false
  state.elapsed = 0
  stopTick()
}

function onSeek(e: MouseEvent) {
  if (!player || !state.duration) return
  const bar  = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  player.seekTo(pct * state.duration, true)
  state.elapsed = pct * state.duration
}

function onVolumeChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  state.volume = val
  if (player) {
    player.setVolume(val)
    if (val === 0) { player.mute(); state.muted = true }
    else if (state.muted) { player.unMute(); state.muted = false }
  }
}

function toggleMute() {
  if (!player) return
  if (state.muted) { player.unMute(); state.muted = false }
  else             { player.mute();   state.muted = true }
}

function toggleFullscreen() {
  const el = wrapperRef.value
  if (!el) return
  if (document.fullscreenElement) void document.exitFullscreen()
  else void el.requestFullscreen()
}

/* -- Lifecycle ---------------------------------------------- */

onMounted(async () => {
  await loadYTApi()
  const el = containerRef.value
  if (!el) return

  player = new YT.Player(el, {
    videoId : VIDEO_ID,
    width   : '100%',
    height  : '100%',
    playerVars : {
      controls       : 0,    /* hide native controls */
      disablekb      : 1,
      rel            : 0,
      modestbranding : 1,
      playsinline    : 1,
      enablejsapi    : 1,
      origin         : window.location.origin,
    },
    events : {
      onReady(e: YT.PlayerEvent) {
        state.ready    = true
        state.duration = e.target.getDuration?.() ?? 0
        e.target.setVolume(state.volume)

        /* Ensure the YT-injected iframe allows fullscreen */
        const iframe = wrapperRef.value?.querySelector('iframe')
        if (iframe) {
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen')
          iframe.setAttribute('allowfullscreen', '')
        }
      },
      onStateChange(e: YT.OnStateChangeEvent) {
        const s = e.data
        if (s === YT.PlayerState.PLAYING) {
          state.playing = true
          state.paused  = false
          startTick()
        } else if (s === YT.PlayerState.PAUSED) {
          state.paused = true
          stopTick()
        } else if (s === YT.PlayerState.ENDED) {
          state.playing = false
          state.paused  = false
          state.elapsed = state.duration
          stopTick()
        }
      },
    },
  })
})

onUnmounted(() => {
  stopTick()
  if (player) { player.destroy(); player = null }
})
</script>

<template>
  <div ref="videoWrapper" class="video-player">
    <!-- YouTube player target div (replaced by iframe) -->
    <div ref="playerContainer" class="video-player-frame" />

    <!-- Controls bar underneath the video -->
    <div class="video-player-controls">
      <!-- Progress bar (clickable to seek) -->
      <div class="video-player-bar" @click="onSeek">
        <div class="video-player-bar-fill" :style="{ width: progressPct() }" />
      </div>

      <div class="video-player-controls-row">
        <!-- Play / Pause -->
        <button
          class="vp-btn vp-btn--main"
          type="button"
          :disabled="!state.ready"
          :aria-label="t('video.playPause')"
          @click="onPlayPause"
        >
          <!-- Pause icon -->
          <svg v-if="state.playing && !state.paused" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <!-- Play icon -->
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        </button>

        <!-- Stop -->
        <button
          class="vp-btn"
          type="button"
          :disabled="!state.playing"
          :aria-label="t('video.stop')"
          @click="onStop"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>

        <!-- Time -->
        <span class="video-player-time">
          {{ formatTime(state.elapsed) }} / {{ formatTime(state.duration) }}
        </span>

        <!-- Spacer -->
        <span class="video-player-spacer" />

        <!-- Volume -->
        <button
          class="vp-btn"
          type="button"
          :aria-label="t('video.toggleMute')"
          @click="toggleMute"
        >
          <!-- Muted -->
          <svg v-if="state.muted || state.volume === 0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          <!-- On -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </button>
        <input
          class="video-player-volume"
          type="range"
          min="0"
          max="100"
          :value="state.muted ? 0 : state.volume"
          :aria-label="t('video.volume')"
          @input="onVolumeChange"
        />

        <!-- Fullscreen -->
        <button
          class="vp-btn"
          type="button"
          :aria-label="t('video.fullscreen')"
          @click="toggleFullscreen"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
