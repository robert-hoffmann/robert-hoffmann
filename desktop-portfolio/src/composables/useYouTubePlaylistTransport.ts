import { inject, onUnmounted, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import type { MediaPosterSources, MediaTransportCapabilities, VideoMediaTransport } from '../types/media'

const PLAYLIST_ID = 'PLLBhCscredzYvSwHG3PJm4w-LIC4xwYaJ'
const YT_NOCOOKIE_HOST = 'https://www.youtube-nocookie.com'

const poster: MediaPosterSources = {
  avif : `${import.meta.env.BASE_URL}video-poster.avif`,
  webp : `${import.meta.env.BASE_URL}video-poster.webp`,
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function safePlayerNumber(value: number | undefined) {
  return Number.isFinite(value) ? Number(value) : 0
}

export function useYouTubePlaylistTransport(): VideoMediaTransport {
  const windowFocused = inject<Readonly<Ref<boolean>>>('windowFocused', ref(true))

  const wrapperRef = ref<HTMLDivElement | null>(null)
  const containerRef = ref<HTMLDivElement | null>(null)
  const showFacade = ref(true)

  const state = reactive({
    ready    : false,
    playing  : false,
    paused   : false,
    loop     : true,
    muted    : false,
    elapsed  : 0,
    duration : 0,
    volume   : 0.8,
  })

  const capabilities: MediaTransportCapabilities = {
    canPlayPause    : true,
    canSeek         : true,
    canToggleLoop   : true,
    canSkipPrevious : true,
    canSkipNext     : true,
    canAdjustVolume : true,
    canToggleMute   : true,
  }

  let player: YT.Player | null = null
  let tickTimer: ReturnType<typeof setInterval> | null = null

  function loadYTApi(): Promise<void> {
    if (window.YT?.Player) return Promise.resolve()

    return new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.()
        resolve()
      }

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    })
  }

  function startTick() {
    stopTick()

    tickTimer = setInterval(() => {
      if (!player || !state.playing) return
      state.elapsed = safePlayerNumber(player.getCurrentTime?.())
      state.duration = safePlayerNumber(player.getDuration?.())
    }, 250)
  }

  function stopTick() {
    if (!tickTimer) return
    clearInterval(tickTimer)
    tickTimer = null
  }

  function playPause() {
    if (!player || !state.ready) return
    if (state.playing && !state.paused) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  function previous() {
    if (!player || !state.ready) return
    player.previousVideo()
    state.elapsed = 0
  }

  function next() {
    if (!player || !state.ready) return
    player.nextVideo()
    state.elapsed = 0
  }

  function seekToRatio(ratio: number) {
    if (!player || state.duration <= 0) return
    const nextTime = clamp01(ratio) * state.duration
    player.seekTo(nextTime, true)
    state.elapsed = nextTime
  }

  function setVolume(volume: number) {
    const next = clamp01(volume)
    state.volume = next

    if (!player) return

    player.setVolume(Math.round(next * 100))

    if (next === 0) {
      player.mute()
      state.muted = true
      return
    }

    if (state.muted) {
      player.unMute()
      state.muted = false
    }
  }

  function toggleMute() {
    if (!player) return

    if (state.muted) {
      player.unMute()
      state.muted = false
      if (state.volume === 0) {
        state.volume = 0.8
        player.setVolume(80)
      }
      return
    }

    player.mute()
    state.muted = true
  }

  function applyPlaylistLoop(enabled: boolean) {
    if (!player || !state.ready) return

    /*
      YT playlist loop is all-or-nothing here:
      on  = wrap playlist back to the start
      off = stop at playlist end
    */
    if (typeof player.setLoop === 'function') {
      player.setLoop(enabled)
    }
  }

  function toggleLoop() {
    state.loop = !state.loop
    applyPlaylistLoop(state.loop)
  }

  async function bootstrapPlayer(autoplay = true) {
    showFacade.value = false

    await loadYTApi()

    const el = containerRef.value
    if (!el) return

    player = new YT.Player(el, {
      host   : YT_NOCOOKIE_HOST,
      width  : '100%',
      height : '100%',
      playerVars : {
        controls       : 0,
        disablekb      : 1,
        listType       : 'playlist',
        list           : PLAYLIST_ID,
        loop           : state.loop ? 1 : 0,
        rel            : 0,
        modestbranding : 1,
        playsinline    : 1,
        enablejsapi    : 1,
        autoplay       : autoplay ? 1 : 0,
        origin         : window.location.origin,
      },
      events : {
        onReady(event: YT.PlayerEvent) {
          state.ready = true
          state.duration = safePlayerNumber(event.target.getDuration?.())
          event.target.setVolume(Math.round(state.volume * 100))
          applyPlaylistLoop(state.loop)

          const iframe = wrapperRef.value?.querySelector('iframe')
          if (iframe) {
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen')
            iframe.setAttribute('allowfullscreen', '')
          }
        },
        onStateChange(event: YT.OnStateChangeEvent) {
          if (!window.YT) return

          if (event.data === YT.PlayerState.PLAYING) {
            state.playing = true
            state.paused = false
            startTick()
            return
          }

          if (event.data === YT.PlayerState.PAUSED) {
            state.paused = true
            stopTick()
            return
          }

          if (event.data === YT.PlayerState.ENDED) {
            state.playing = false
            state.paused = false
            state.elapsed = state.duration
            stopTick()
          }
        },
      },
    })
  }

  function onOverlayPointerDown() {
    if (showFacade.value) {
      void bootstrapPlayer(true)
      return
    }

    if (!player || !state.ready) return

    if (!windowFocused.value) {
      if (!state.playing) player.playVideo()
      return
    }

    playPause()
  }

  onUnmounted(() => {
    stopTick()
    if (player) {
      player.destroy()
      player = null
    }
  })

  return {
    kind         : 'video',
    wrapperRef,
    containerRef,
    showFacade,
    poster,
    state,
    capabilities,
    actions      : {
      playPause,
      seekToRatio,
      setVolume,
      toggleMute,
      toggleLoop,
      previous,
      next,
    },
    bootstrapPlayer,
    onOverlayPointerDown,
  }
}
