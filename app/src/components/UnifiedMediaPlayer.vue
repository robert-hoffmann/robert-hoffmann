<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { formatTime } from '../utils'
import { useLocale } from '../composables/useLocale'
import { useSeekBar } from '../composables/useSeekBar'
import { useAudioMediaTransport } from '../composables/useAudioMediaTransport'
import { useElementImageSizes } from '../composables/useElementImageSizes'
import { useYouTubePlaylistTransport } from '../composables/useYouTubePlaylistTransport'
import { MEDIA_PLAYER_PRESETS } from '../data/mediaPlayerPresets'
import { musicMessages } from '../data/apps/music'
import { videoMessages } from '../data/apps/video'
import type {
  MediaPreset,
  MediaPresetConfig,
  UnifiedMediaTransport,
} from '../types/media'

const props = defineProps<{
  preset : MediaPreset
}>()

const { t } = useLocale({
  ...musicMessages,
  ...videoMessages,
})
const seekBar = useSeekBar()

const transport: UnifiedMediaTransport = props.preset === 'music'
  ? useAudioMediaTransport()
  : useYouTubePlaylistTransport()

const audioTransport = transport.kind === 'audio' ? transport : null
const videoTransport = transport.kind === 'video' ? transport : null

const presetConfig = computed<MediaPresetConfig>(() => MEDIA_PLAYER_PRESETS[props.preset])
const layoutConfig = computed(() => presetConfig.value.layout)
const videoFrameRef = useTemplateRef<HTMLDivElement>('videoFrame')
const posterSizes = useElementImageSizes(videoFrameRef, 416)

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
                draggable="false"
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
        draggable="false"
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

<style scoped>
.unified-media-player {
  position       : relative;
  display        : flex;
  flex-direction : column;
  gap            : var(--space-3);
  inline-size    : 100%;
  block-size     : 100%;
  min-block-size : 0;
  padding        : var(--space-3);
  overflow       : hidden;
  background     : var(--surface-window);
  color          : var(--text-primary);
}

.unified-media-player__audio {
  display : none;
}

.unified-media-player__visual {
  position        : relative;
  flex-shrink     : 0;
  min-inline-size : 0;
}

.unified-media-player__visual--art {
  align-self    : center;
  inline-size   : min(100%, 26rem);
  aspect-ratio  : 1;
  overflow      : hidden;
  border        : 1px solid var(--border-subtle);
  border-radius : var(--radius-xl);
  background    : linear-gradient(180deg, oklch(23% 0.03 6), oklch(14% 0.02 8));
  box-shadow    : inset 0 0 0 1px oklch(100% 0 0 / 0.03);
}

.unified-media-player__art-image {
  display            : block;
  inline-size        : 100%;
  block-size         : 100%;
  object-fit         : cover;
  object-position    : 50% 22%;
  user-select        : none;
  -webkit-user-drag : none;
}

.unified-media-player__visual--video {
  min-block-size : 0;
  overflow       : hidden;
  background     : #000;
}

.unified-media-player--video .unified-media-player__visual--video {
  aspect-ratio  : 16 / 9;
  border        : 1px solid var(--border-subtle);
  border-radius : var(--radius-xl);
}

.unified-media-player__video-wrapper {
  inline-size     : 100%;
  block-size      : 100%;
  min-block-size  : 0;
}

.unified-media-player__video-frame {
  position       : relative;
  inline-size    : 100%;
  block-size     : 100%;
  min-block-size : 0;
  background     : #000;
}

.unified-media-player__video-poster {
  position          : absolute;
  inset             : 0;
  inline-size       : 100%;
  block-size        : 100%;
  object-fit        : cover;
  user-select       : none;
  -webkit-user-drag : none;
}

.unified-media-player__video-facade-play {
  position       : absolute;
  inset          : 0;
  z-index        : 1;
  display        : grid;
  place-items    : center;
  pointer-events : none;
}

.unified-media-player__video-facade-play-button {
  display        : grid;
  place-items    : center;
  padding        : 0;
  border         : none;
  background     : none;
  color          : inherit;
  line-height    : 0;
  cursor         : pointer;
  pointer-events : auto;
  touch-action   : manipulation;
  transition     : opacity var(--dur-fast) var(--ease-out);

  &:hover {
    opacity : 0.86;
  }
}

.unified-media-player__video-overlay {
  position     : absolute;
  inset        : 0;
  z-index      : 1;
  cursor       : pointer;
  touch-action : manipulation;
}

.unified-media-player__yt-target {
  inline-size : 100%;
  block-size  : 100%;
}

.unified-media-player__video-frame iframe {
  inline-size : 100%;
  block-size  : 100%;
  border      : none;
}

.unified-media-player__body {
  display         : flex;
  flex            : 1 1 auto;
  flex-direction  : column;
  gap             : var(--space-3);
  min-inline-size : 0;
  min-block-size  : 0;
  padding         : var(--space-2) 0 0;
}

.unified-media-player__meta {
  min-inline-size : 0;
}

.unified-media-player__meta--with-disc {
  display               : grid;
  grid-template-columns : auto minmax(0, 1fr);
  grid-template-rows    : auto auto;
  align-items           : center;
  column-gap            : var(--space-3);
}

.unified-media-player__meta--with-action {
  grid-template-columns : auto minmax(0, 1fr) auto;
}

.unified-media-player__title-disc {
  position        : relative;
  display         : inline-flex;
  align-items     : center;
  align-self      : center;
  justify-content : center;
  inline-size     : 56px;
  block-size      : 56px;
  flex-shrink     : 0;
  border-radius   : 50%;
  background      : linear-gradient(135deg, var(--icon-selected-bg), var(--surface-raised));
  box-shadow      : 0 0 0 1px oklch(100% 0 0 / 0.05),
                    0 10px 24px oklch(0% 0 0 / 0.24),
                    0 0 14px color-mix(in srgb, var(--c-accent) 10%, transparent);
  transition      : box-shadow var(--dur-fast) var(--ease-out),
                    transform var(--dur-fast) var(--ease-out);
}

.unified-media-player__meta--with-disc .unified-media-player__title-disc {
  grid-column : 1;
  grid-row    : 1 / span 2;
}

.unified-media-player__meta--with-disc .unified-media-player__title {
  grid-column : 2;
  grid-row    : 1;
}

.unified-media-player__meta--with-disc .unified-media-player__subtitle {
  grid-column : 2;
  grid-row    : 2;
}

.unified-media-player__meta-action {
  grid-column  : 3;
  grid-row     : 1 / span 2;
  align-self   : center;
  justify-self : end;
  inline-size  : 2.35rem;
  block-size   : 2.35rem;
  flex-shrink  : 0;

  svg {
    display : block;
  }
}

.unified-media-player__title-disc-icon {
  position    : relative;
  z-index     : 1;
  display     : block;
  color       : inherit;
  font-size   : 1.75rem;
  line-height : 1;
  filter      : drop-shadow(0 1px 2px oklch(0% 0 0 / 0.32));
  transition  : transform 0.3s var(--ease-out);
}

.unified-media-player__title-disc-icon--spinning {
  animation : unified-disc-spin 3s linear infinite;
}

.unified-media-player__title-disc-ring {
  position      : absolute;
  inset         : -3px;
  border        : 2px solid transparent;
  border-radius : 50%;
  transition    : border-color 0.4s var(--ease-out),
                  box-shadow 0.4s var(--ease-out);
}

.unified-media-player__title-disc--active {
  box-shadow : 0 0 0 1px oklch(100% 0 0 / 0.06),
               0 10px 24px oklch(0% 0 0 / 0.24),
               0 0 24px color-mix(in srgb, var(--c-accent) 38%, transparent),
               0 0 42px color-mix(in srgb, var(--c-accent) 18%, transparent);
}

.unified-media-player__title-disc-ring--active {
  border-color : var(--c-accent);
  box-shadow   : 0 0 0 2px color-mix(in srgb, var(--c-accent) 18%, transparent);
  animation    : unified-ring-pulse 2s ease-in-out infinite;
}

.unified-media-player__title {
  min-inline-size : 0;
  margin          : 0;
  overflow        : hidden;
  color           : var(--text-primary);
  font-size       : var(--text-base);
  font-weight     : 700;
  line-height     : 1.15;
  text-overflow   : ellipsis;
  white-space     : nowrap;
}

.unified-media-player__subtitle {
  margin        : 0.2rem 0 0;
  overflow      : hidden;
  color         : var(--text-secondary);
  font-size     : var(--text-sm);
  text-overflow : ellipsis;
  white-space   : nowrap;
}

.unified-media-player--mobile .unified-media-player__title {
  font-size : clamp(1.1rem, 1rem + 0.75vw, 1.4rem);
}

.unified-media-player--mobile .unified-media-player__subtitle {
  font-size : var(--text-base);
}

.unified-media-player__progress {
  display        : flex;
  flex-direction : column;
  gap            : 0.35rem;
}

.unified-media-player__seek-track {
  position      : relative;
  overflow      : hidden;
  block-size    : 8px;
  border-radius : 999px;
  background    : var(--surface-overlay);
  cursor        : pointer;
  touch-action  : none;
}

.unified-media-player__seek-hover {
  position           : absolute;
  inset-block        : 0;
  inset-inline-start : 0;
  z-index            : 2;
  border-radius      : inherit;
  pointer-events     : none;
}

.seek-preview--forward {
  background : color-mix(in srgb, #8ed8ff 70%, transparent);
}

.seek-preview--backward {
  background : color-mix(in srgb, #ff9aa2 65%, transparent);
}

.seek-fill--backward {
  background : color-mix(in srgb, #8ed8ff 85%, transparent);
}

.unified-media-player__seek-fill {
  position      : relative;
  z-index       : 1;
  block-size    : 100%;
  border-radius : inherit;
  background    : var(--c-accent);
  transition    : width 0.3s linear;
}

.unified-media-player__times {
  display         : flex;
  justify-content : space-between;
  gap             : var(--space-3);
  color           : var(--text-secondary);
  font-family     : var(--font-mono);
  font-size       : 0.72rem;
}

.unified-media-player__transport {
  display            : flex;
  align-items        : center;
  justify-content    : center;
  gap                : var(--space-2);
  margin-block-start : auto;
}

.unified-media-player__btn {
  display         : inline-flex;
  align-items     : center;
  justify-content : center;
  border          : none;
  border-radius   : 999px;
  background      : var(--icon-selected-bg);
  color           : var(--c-accent);
  cursor          : pointer;
  touch-action    : manipulation;
  transition      : background var(--dur-fast) var(--ease-out),
                    transform var(--dur-fast) var(--ease-out),
                    box-shadow var(--dur-fast) var(--ease-out);

  &:focus-visible {
    outline        : 2px solid color-mix(in srgb, var(--c-accent) 70%, white);
    outline-offset : 2px;
  }

  &:disabled {
    opacity    : 0.4;
    cursor     : default;
    transform  : none;
    box-shadow : none;
  }
}

@media (hover: hover) and (pointer: fine) {
  .unified-media-player__btn:hover {
    background : var(--c-accent);
    color      : var(--c-white);
    transform  : scale(1.08);
  }

  .unified-media-player__btn--active:hover {
    background : var(--c-accent-hover);
  }
}

.unified-media-player__btn--main {
  inline-size : 3.4rem;
  block-size  : 3.4rem;
}

.unified-media-player__btn--sm {
  inline-size : 2.1rem;
  block-size  : 2.1rem;
}

.unified-media-player__btn--active {
  background : var(--c-accent);
  color      : var(--c-white);
}

.unified-media-player__aux {
  display         : flex;
  align-items     : center;
  justify-content : space-between;
  gap             : var(--space-3);
}

.unified-media-player__volume {
  display         : flex;
  align-items     : center;
  gap             : var(--space-2);
  flex            : 1;
  min-inline-size : 0;
}

.unified-media-player__volume-icon {
  flex-shrink : 0;
}

.unified-media-player__volume-slider {
  flex            : 1;
  min-inline-size : 0;
  appearance      : none;
  block-size      : 4px;
  border-radius   : 999px;
  background      : var(--surface-overlay);
  cursor          : pointer;
  transition      : block-size var(--dur-fast) var(--ease-out);

  &:hover {
    block-size : 6px;
  }

  &::-webkit-slider-thumb {
    appearance    : none;
    inline-size   : 12px;
    block-size    : 12px;
    border-radius : 50%;
    background    : var(--c-accent);
    box-shadow    : 0 0 6px color-mix(in srgb, var(--c-accent) 80%, transparent);
  }

  &::-moz-range-thumb {
    inline-size   : 12px;
    block-size    : 12px;
    border        : none;
    border-radius : 50%;
    background    : var(--c-accent);
    box-shadow    : 0 0 6px color-mix(in srgb, var(--c-accent) 80%, transparent);
  }
}

.unified-media-player__volume-pct {
  flex-shrink : 0;
  inline-size : 3ch;
  color       : var(--text-secondary);
  font-family : var(--font-mono);
  font-size   : 0.72rem;
  text-align  : end;
}

.unified-media-player__eq {
  display           : flex;
  align-items       : flex-end;
  justify-content   : center;
  gap               : 3px;
  min-block-size    : 40px;
  block-size        : 40px;
  padding-inline    : var(--space-2);
  padding-block-end : var(--space-1);
  flex-shrink       : 0;
}

.unified-media-player__eq .eq-bar {
  display        : block;
  inline-size    : 4px;
  min-block-size : 4px;
  border-radius  : 1px;
  background     : var(--icon-selected-bg);
  transition     : block-size 60ms linear, background 0.3s ease;
}

.unified-media-player__eq--active .eq-bar {
  background : var(--c-accent);
}

:global(.mobile-root--shell .unified-media-player) {
  overflow            : hidden;
  overscroll-behavior : contain;
}

:global(.mobile-root--shell .unified-media-player__visual) {
  flex-shrink    : 1;
  min-block-size : 0;
}

:global(.mobile-root--shell .unified-media-player__visual--art),
:global(.mobile-root--shell .unified-media-player--video.unified-media-player--mobile .unified-media-player__visual--video) {
  align-self      : center;
  inline-size     : 100%;
  max-inline-size : min(26rem, 100%);
}

:global(.mobile-root--shell .unified-media-player--video.unified-media-player--mobile .unified-media-player__visual--video) {
  aspect-ratio : 1;
  box-shadow   : inset 0 0 0 1px oklch(100% 0 0 / 0.03);
}

:global(.mobile-root--shell .unified-media-player__body) {
  flex : 1 0 auto;
  gap  : var(--space-3);
}

:global(.mobile-root--shell .unified-media-player__transport) {
  gap : var(--space-3);
}

:global(.mobile-root--shell .unified-media-player__btn--main) {
  inline-size : 4rem;
  block-size  : 4rem;
}

:global(.mobile-root--shell .unified-media-player__btn--sm) {
  inline-size : 2.4rem;
  block-size  : 2.4rem;
}

:global(.mobile-root--shell .unified-media-player__aux) {
  align-items : center;
}

:global(.mobile-root--shell .unified-media-player__times) {
  font-size : 0.9rem;
}

:global(.mobile-root--shell .unified-media-player__eq) {
  min-block-size : 52px;
  block-size     : 52px;
}

:global(.mobile-root--shell .unified-media-player__eq .eq-bar) {
  transition : background 0.2s ease;
}

@keyframes unified-disc-spin {
  from { transform : rotate(0deg); }
  to   { transform : rotate(360deg); }
}

@keyframes unified-ring-pulse {
  0%, 100% { opacity : 1; }
  50%      { opacity : 0.3; }
}
</style>
