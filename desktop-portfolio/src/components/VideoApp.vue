<script setup lang="ts">
import { computed, reactive, ref, inject, onUnmounted, useTemplateRef } from 'vue'
import { formatTime } from '../utils'
import { useLocale } from '../composables/useLocale'
import { useSeekBar } from '../composables/useSeekBar'

const { t } = useLocale()

/** Injected from AppWindow — true when this window is front-most */
const windowFocused = inject<Readonly<import('vue').Ref<boolean>>>('windowFocused', ref(true))

const PLAYLIST_ID = 'PLLBhCscredzYvSwHG3PJm4w-LIC4xwYaJ'
/* Local poster avoids third-party handshake cost on initial desktop load. */
const VIDEO_POSTER_AVIF = `${import.meta.env.BASE_URL}video-poster.avif`
const VIDEO_POSTER_WEBP = `${import.meta.env.BASE_URL}video-poster.webp`

/** Privacy-enhanced embed host — avoids most YouTube tracking cookies */
const YT_NOCOOKIE_HOST = 'https://www.youtube-nocookie.com'

const containerRef = useTemplateRef<HTMLDivElement>('playerContainer')
const wrapperRef   = useTemplateRef<HTMLDivElement>('videoWrapper')

/** True while showing the static thumbnail facade (before first play) */
const showFacade = ref(true)

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
let tickTimer : ReturnType<typeof setInterval> | null = null

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
  return `${progressValue()}%`
}

function progressValue(): number {
  if (!state.duration) return 0
  return Math.max(0, Math.min(100, (state.elapsed / state.duration) * 100))
}

const seekBar = useSeekBar()
const seekPreview = computed(() => seekBar.preview(progressValue()))

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

function onPrevious() {
  if (!player || !state.ready) return
  player.previousVideo()
  state.elapsed = 0
}

function onNext() {
  if (!player || !state.ready) return
  player.nextVideo()
  state.elapsed = 0
}

function onSeek(e: MouseEvent) {
  if (!player || !state.duration) return
  const pct = seekBar.pointerRatio(e)
  if (pct === null) return
  player.seekTo(pct * state.duration, true)
  state.elapsed = pct * state.duration
}

function onSeekHover(e: MouseEvent) {
  seekBar.hover(e, state.duration)
}

function onSeekLeave() {
  seekBar.leave()
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

/* -- Lifecycle — lazy facade -------------------------------- */

/**
 * Bootstrap the real YouTube player on first user interaction.
 * Until called, only a lightweight thumbnail facade is shown,
 * which avoids loading the IFrame API script and the ~19
 * third-party cookies that come with it.
 */
async function bootstrapPlayer(autoplay = true) {
  showFacade.value = false

  await loadYTApi()
  const el = containerRef.value
  if (!el) return

  player = new YT.Player(el, {
    host    : YT_NOCOOKIE_HOST,
    width   : '100%',
    height  : '100%',
    playerVars : {
      controls       : 0,    /* hide native controls */
      disablekb      : 1,
      listType       : 'playlist',
      list           : PLAYLIST_ID,
      loop           : 1,
      rel            : 0,
      modestbranding : 1,
      playsinline    : 1,
      enablejsapi    : 1,
      autoplay       : autoplay ? 1 : 0,
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
}

/**
 * Handle pointerdown on the transparent overlay covering the iframe.
 * - Unfocused window → auto-play (focus is handled by event bubbling)
 * - Focused window   → toggle play / pause
 *
 * The overlay also prevents YouTube's native click behaviour
 * (opening YouTube links, triggering fullscreen, etc.).
 */
function onOverlayPointerDown() {
  /* Facade click → bootstrap and auto-play */
  if (showFacade.value) { void bootstrapPlayer(true); return }
  if (!player || !state.ready) return
  if (!windowFocused.value) {
    // Window is about to receive focus via event bubbling — auto-play
    if (!state.playing) player.playVideo()
  } else {
    // Already focused — toggle play/pause
    onPlayPause()
  }
}

onUnmounted(() => {
  stopTick()
  if (player) { player.destroy(); player = null }
})
</script>

<template>
  <div ref="videoWrapper" class="video-player">
    <!-- YouTube player target (YT API replaces inner div with iframe) -->
    <div class="video-player-frame">
      <!-- Lite facade — static thumbnail shown until the user clicks play.
           Avoids loading the YouTube IFrame API (and its cookies) on page load. -->
      <template v-if="showFacade">
        <picture>
          <source :srcset="VIDEO_POSTER_AVIF" type="image/avif" />
          <source :srcset="VIDEO_POSTER_WEBP" type="image/webp" />
          <img
            class="video-player-poster"
            :src="VIDEO_POSTER_WEBP"
            alt=""
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
        <button
          class="video-player-facade-play"
          type="button"
          :aria-label="t('video.playPause')"
          @click="onOverlayPointerDown"
        >
          <svg width="64" height="64" viewBox="0 0 68 48" aria-hidden="true">
            <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#212121" fill-opacity="0.8" />
            <path d="M45 24 27 14v20" fill="#fff" />
          </svg>
        </button>
      </template>
      <template v-else>
        <div ref="playerContainer" />
      </template>
      <!-- Transparent overlay — intercepts all clicks so YouTube's
           native link / fullscreen handling never fires -->
      <div v-if="!showFacade" class="video-player-overlay" @pointerdown="onOverlayPointerDown" />
    </div>

    <!-- Controls bar underneath the video -->
    <div class="video-player-controls">
      <!-- Progress bar (clickable to seek) -->
      <div class="video-player-bar" @click="onSeek" @pointermove="onSeekHover" @pointerleave="onSeekLeave">
        <div
          v-if="seekPreview"
          :class="['video-player-bar-hover', `seek-preview--${seekPreview.direction}`]"
          :style="{ inlineSize: `${seekPreview.width}%`, insetInlineStart: `${seekPreview.start}%` }"
        />
        <div
          class="video-player-bar-fill"
          :class="{ 'seek-fill--backward': seekPreview?.direction === 'backward' }"
          :style="{ width: progressPct() }"
        />
      </div>

      <div class="video-player-controls-row">
        <!-- Previous -->
        <button
          class="unified-media-player__btn unified-media-player__btn--sm"
          type="button"
          :disabled="showFacade || !state.ready"
          :aria-label="t('video.previous')"
          @click="onPrevious"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 5h2v14H6zM19 6l-9 6 9 6V6z" />
          </svg>
        </button>

        <!-- Play / Pause -->
        <button
          class="unified-media-player__btn unified-media-player__btn--main"
          type="button"
          :disabled="!showFacade && !state.ready"
          :aria-label="t('video.playPause')"
          @click="showFacade ? bootstrapPlayer(true) : onPlayPause()"
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

        <!-- Next -->
        <button
          class="unified-media-player__btn unified-media-player__btn--sm"
          type="button"
          :disabled="showFacade || !state.ready"
          :aria-label="t('video.next')"
          @click="onNext"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 5h2v14h-2zM5 6l9 6-9 6V6z" />
          </svg>
        </button>

        <!-- Stop -->
        <button
          class="unified-media-player__btn unified-media-player__btn--sm"
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
          class="unified-media-player__btn unified-media-player__btn--sm"
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
          class="unified-media-player__btn unified-media-player__btn--sm"
          type="button"
          :aria-label="t('video.fullscreen')"
          @click="toggleFullscreen"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 3h7v7" />
            <path d="M21 3l-8 8" />
            <path d="M10 21H3v-7" />
            <path d="M3 21l8-8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
