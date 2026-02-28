<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { formatTime } from '../utils'
import { useLocale } from '../composables/useLocale'
import { useSeekBar } from '../composables/useSeekBar'
import { useAudioMediaTransport } from '../composables/useAudioMediaTransport'
import { useElementImageSizes } from '../composables/useElementImageSizes'
import { useYouTubePlaylistTransport } from '../composables/useYouTubePlaylistTransport'
import { MEDIA_PLAYER_PRESETS } from '../data/mediaPlayerPresets'
import type {
  MediaPreset,
  MediaPresetConfig,
  UnifiedMediaTransport,
} from '../types/media'

const props = defineProps<{
  preset : MediaPreset
}>()

const { t } = useLocale()
const seekBar = useSeekBar()

const transport: UnifiedMediaTransport = props.preset === 'music'
  ? useAudioMediaTransport()
  : useYouTubePlaylistTransport()

const audioTransport = transport.kind === 'audio' ? transport : null
const videoTransport = transport.kind === 'video' ? transport : null

const presetConfig = computed<MediaPresetConfig>(() => MEDIA_PLAYER_PRESETS[props.preset])
const layoutConfig = computed(() => presetConfig.value.layout)
const videoFrameRef = useTemplateRef<HTMLDivElement>('videoFrame')
const posterSizes = useElementImageSizes(videoFrameRef, 960)

const rootClasses = computed(() => [
  'unified-media-player',
  `unified-media-player--${props.preset}`,
  'unified-media-player--mobile',
])

const showArtwork = computed(() => layoutConfig.value.visualSurface === 'artwork')
const showVideoSurface = computed(() => layoutConfig.value.visualSurface === 'video' && videoTransport !== null)
const showMetadata = computed(() => layoutConfig.value.showMetadata)
const showEq = computed(() => layoutConfig.value.showEq && audioTransport !== null)
const showMetaFullscreenAction = computed(() => showVideoSurface.value && videoTransport !== null)
const titleDiscActive = computed(() =>
  transport.state.playing && !transport.state.paused,
)
const eqBars = computed(() => audioTransport?.eqBars.value ?? [])
const eqActive = computed(() => Boolean(audioTransport && transport.state.playing && !transport.state.paused))

function progressValue(): number {
  if (!transport.state.duration) return 0
  return Math.max(0, Math.min(100, (transport.state.elapsed / transport.state.duration) * 100))
}

const progressPct = computed(() => `${progressValue()}%`)
const seekPreview = computed(() => seekBar.preview(progressValue()))

function onSeek(event: MouseEvent) {
  if (!transport.capabilities.canSeek || transport.state.duration <= 0) return
  const ratio = seekBar.pointerRatio(event)
  if (ratio === null) return
  transport.actions.seekToRatio(ratio)
}

function onSeekHover(event: MouseEvent) {
  seekBar.hover(event, transport.state.duration)
}

function onSeekLeave() {
  seekBar.leave()
}

function onPlayPause() {
  if (videoTransport?.showFacade.value) {
    void videoTransport.bootstrapPlayer(true)
    return
  }

  transport.actions.playPause()
}

function onPrevious() {
  transport.actions.previous?.()
}

function onNext() {
  transport.actions.next?.()
}

function onToggleLoop() {
  transport.actions.toggleLoop?.()
}

function onToggleMute() {
  transport.actions.toggleMute()
}

function onVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target) return
  transport.actions.setVolume(Number(target.value))
}

const prevDisabled = computed(() => {
  if (!transport.capabilities.canSkipPrevious) return true
  if (videoTransport) return !transport.state.ready || videoTransport.showFacade.value
  return false
})

const nextDisabled = computed(() => {
  if (!transport.capabilities.canSkipNext) return true
  if (videoTransport) return !transport.state.ready || videoTransport.showFacade.value
  return false
})

const playPauseDisabled = computed(() => {
  if (!transport.capabilities.canPlayPause) return true
  if (videoTransport) {
    return !videoTransport.showFacade.value && !transport.state.ready
  }
  return false
})

const volumeSliderValue = computed(() =>
  transport.state.muted ? 0 : transport.state.volume,
)

const musicLikeSeekLabel = computed(() => t('music.seek'))
const playPauseLabel = computed(() => t(`${props.preset}.playPause`))
const previousLabel = computed(() => t('video.previous'))
const nextLabel = computed(() => t('video.next'))
const loopLabel = computed(() =>
  transport.state.loop
    ? t('music.disableLoop')
    : t('music.enableLoop'),
)
const muteLabel = computed(() => {
  if (props.preset === 'music') {
    return transport.state.muted ? t('music.unmute') : t('music.mute')
  }
  return t('video.toggleMute')
})
const volumeLabel = computed(() => t(`${props.preset}.volume`))
const fullscreenLabel = computed(() => t('video.fullscreen'))

const displayTitle = computed(() => presetConfig.value.metadata.title)
const displaySubtitle = computed(() => presetConfig.value.metadata.subtitle)
const displayArtworkSrc = computed(() => presetConfig.value.metadata.artworkSrc ?? '')
const displayArtworkAlt = computed(() => presetConfig.value.metadata.artworkAlt)
const displayVideoPoster = computed(() => videoTransport?.poster ?? presetConfig.value.metadata.videoPoster ?? {})

type FullscreenHost = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

async function requestFullscreenForHost(host: FullscreenHost) {
  if (typeof host.requestFullscreen === 'function') {
    await host.requestFullscreen()
    return
  }

  host.webkitRequestFullscreen?.()
}

async function onMetaFullscreen() {
  if (!videoTransport) return

  const wrapper = videoTransport.wrapperRef.value as FullscreenHost | null
  if (!wrapper) return

  try {
    const activeFullscreen = document.fullscreenElement
    const wrapperOwnsFullscreen = Boolean(
      activeFullscreen &&
      (activeFullscreen === wrapper || wrapper.contains(activeFullscreen)),
    )

    if (wrapperOwnsFullscreen) {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
      return
    }

    await requestFullscreenForHost(wrapper)
  } catch {
    // Browsers may reject fullscreen if the user agent blocks it in the current context.
  }

  if (videoTransport.showFacade.value) {
    void videoTransport.bootstrapPlayer(true)
  }
}
</script>

<template>
  <div
    :class="rootClasses"
    :data-media-preset="props.preset"
  >
    <audio
      v-if="audioTransport"
      :ref="audioTransport.audioRef"
      class="unified-media-player__audio"
      :src="audioTransport.sourceUrl"
      :loop="transport.state.loop"
      preload="metadata"
      @play="audioTransport.onAudioPlay"
      @pause="audioTransport.onAudioPause"
      @ended="audioTransport.onAudioEnded"
      @durationchange="audioTransport.onAudioDurationChange"
      @timeupdate="audioTransport.onAudioTimeUpdate"
    />

    <div v-if="showVideoSurface && videoTransport" class="unified-media-player__visual unified-media-player__visual--video">
      <div :ref="videoTransport.wrapperRef" class="unified-media-player__video-wrapper">
        <div ref="videoFrame" class="unified-media-player__video-frame">
          <template v-if="videoTransport.showFacade.value">
            <picture>
              <source
                v-if="displayVideoPoster.avif"
                :srcset="displayVideoPoster.avifSrcset || displayVideoPoster.avif"
                :sizes="posterSizes"
                type="image/avif"
              />
              <source
                v-if="displayVideoPoster.webp"
                :srcset="displayVideoPoster.webpSrcset || displayVideoPoster.webp"
                :sizes="posterSizes"
                type="image/webp"
              />
              <img
                class="unified-media-player__video-poster"
                :src="displayVideoPoster.webp || displayVideoPoster.avif || ''"
                :srcset="displayVideoPoster.webpSrcset || undefined"
                :sizes="posterSizes"
                width="1280"
                height="720"
                alt=""
                loading="eager"
                fetchpriority="high"
                decoding="async"
              >
            </picture>

            <div class="unified-media-player__video-facade-play">
              <button
                type="button"
                class="unified-media-player__video-facade-play-button"
                :aria-label="playPauseLabel"
                data-mobile-swipe-lock
                @click="videoTransport.onOverlayPointerDown"
              >
                <svg width="64" height="64" viewBox="0 0 68 48" aria-hidden="true">
                  <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#212121" fill-opacity="0.8" />
                  <path d="M45 24 27 14v20" fill="#fff" />
                </svg>
              </button>
            </div>
          </template>

          <template v-else>
            <div :ref="videoTransport.containerRef" class="unified-media-player__yt-target" />
            <div
              class="unified-media-player__video-overlay"
              @click="videoTransport.onOverlayPointerDown"
            />
          </template>
        </div>
      </div>
    </div>

    <div v-else-if="showArtwork && displayArtworkSrc" class="unified-media-player__visual unified-media-player__visual--art" aria-hidden="true">
      <img
        class="unified-media-player__art-image"
        :src="displayArtworkSrc"
        :alt="displayArtworkAlt"
        loading="eager"
        decoding="async"
      >
    </div>

    <div class="unified-media-player__body">
      <div
        v-if="showMetadata"
        :class="[
          'unified-media-player__meta',
          'unified-media-player__meta--with-disc',
          { 'unified-media-player__meta--with-action': showMetaFullscreenAction },
        ]"
      >
        <span
          class="unified-media-player__title-disc"
          :class="{ 'unified-media-player__title-disc--active': titleDiscActive }"
          aria-hidden="true"
        >
          <span
            class="unified-media-player__title-disc-icon"
            :class="{ 'unified-media-player__title-disc-icon--spinning': titleDiscActive }"
          >💿</span>
          <span class="unified-media-player__title-disc-ring" :class="{ 'unified-media-player__title-disc-ring--active': titleDiscActive }" />
        </span>
        <h3 class="unified-media-player__title">{{ displayTitle }}</h3>
        <p class="unified-media-player__subtitle">{{ displaySubtitle }}</p>
        <button
          v-if="showMetaFullscreenAction"
          type="button"
          class="unified-media-player__btn unified-media-player__btn--sm unified-media-player__meta-action"
          :aria-label="fullscreenLabel"
          data-mobile-swipe-lock
          @click="onMetaFullscreen"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 3h7v7" />
            <path d="M21 3l-8 8" />
            <path d="M10 21H3v-7" />
            <path d="M3 21l8-8" />
          </svg>
        </button>
      </div>

      <div class="unified-media-player__progress">
        <div
          class="unified-media-player__seek-track"
          role="slider"
          tabindex="0"
          data-mobile-swipe-lock
          :aria-label="musicLikeSeekLabel"
          :aria-valuemin="0"
          :aria-valuemax="Math.round(transport.state.duration)"
          :aria-valuenow="Math.round(transport.state.elapsed)"
          @click="onSeek"
          @pointermove="onSeekHover"
          @pointerleave="onSeekLeave"
        >
          <div
            v-if="seekPreview"
            :class="['unified-media-player__seek-hover', `seek-preview--${seekPreview.direction}`]"
            :style="{ inlineSize: `${seekPreview.width}%`, insetInlineStart: `${seekPreview.start}%` }"
          />
          <div
            class="unified-media-player__seek-fill"
            :class="{ 'seek-fill--backward': seekPreview?.direction === 'backward' }"
            :style="{ width: progressPct }"
          />
        </div>

        <div class="unified-media-player__times">
          <span>{{ formatTime(transport.state.elapsed) }}</span>
          <span>{{ formatTime(transport.state.duration) }}</span>
        </div>
      </div>

      <div class="unified-media-player__transport">
        <button
          v-if="transport.capabilities.canToggleLoop"
          class="unified-media-player__btn unified-media-player__btn--sm"
          type="button"
          :class="{ 'unified-media-player__btn--active': transport.state.loop }"
          :aria-label="loopLabel"
          @click="onToggleLoop"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 2l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 22l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>

        <button
          class="unified-media-player__btn unified-media-player__btn--sm"
          type="button"
          :disabled="prevDisabled"
          :aria-label="previousLabel"
          @click="onPrevious"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 5h2v14H6zM19 6l-9 6 9 6V6z" />
          </svg>
        </button>

        <button
          class="unified-media-player__btn unified-media-player__btn--main"
          type="button"
          :disabled="playPauseDisabled"
          :aria-label="playPauseLabel"
          @click="onPlayPause"
        >
          <svg v-if="transport.state.playing && !transport.state.paused" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        </button>

        <button
          class="unified-media-player__btn unified-media-player__btn--sm"
          type="button"
          :disabled="nextDisabled"
          :aria-label="nextLabel"
          @click="onNext"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 5h2v14h-2zM5 6l9 6-9 6V6z" />
          </svg>
        </button>
      </div>

      <div class="unified-media-player__aux">
        <div
          v-if="transport.capabilities.canToggleMute || transport.capabilities.canAdjustVolume"
          class="unified-media-player__volume"
        >
          <button
            v-if="transport.capabilities.canToggleMute"
            class="unified-media-player__btn unified-media-player__btn--sm unified-media-player__volume-icon"
            type="button"
            :aria-label="muteLabel"
            @click="onToggleMute"
          >
            <svg v-if="transport.state.muted || volumeSliderValue === 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <svg v-else-if="volumeSliderValue < 0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>

          <input
            v-if="transport.capabilities.canAdjustVolume"
            class="unified-media-player__volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volumeSliderValue"
            :aria-label="volumeLabel"
            @input="onVolumeInput"
          >

          <span
            v-if="layoutConfig.showVolumePercent && transport.capabilities.canAdjustVolume"
            class="unified-media-player__volume-pct"
          >
            {{ Math.round(volumeSliderValue * 100) }}%
          </span>
        </div>
      </div>

      <div
        v-if="showEq"
        class="unified-media-player__eq"
        :class="{ 'unified-media-player__eq--active': eqActive }"
        aria-hidden="true"
      >
        <span
          v-for="(height, index) in eqBars"
          :key="index"
          class="eq-bar"
          :style="{ blockSize: `${height}%` }"
        />
      </div>
    </div>
  </div>
</template>
