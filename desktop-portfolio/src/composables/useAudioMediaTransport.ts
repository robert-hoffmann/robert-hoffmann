import { reactive, ref, shallowRef, triggerRef, watch, onUnmounted } from 'vue'
import type { AudioMediaTransport, MediaTransportCapabilities } from '../types/media'

const EQ_BARS   = 16
const FFT_SIZE  = 64
const TRACK_URL = `${import.meta.env.BASE_URL}music.mp3`

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function safeMediaNumber(value: number | undefined) {
  return Number.isFinite(value) ? Number(value) : 0
}

export function useAudioMediaTransport(): AudioMediaTransport {
  const audioRef = ref<HTMLAudioElement | null>(null)

  const state = reactive({
    ready    : false,
    playing  : false,
    paused   : false,
    loop     : true,
    elapsed  : 0,
    duration : 0,
    volume   : 0.8,
    muted    : false,
  })

  const capabilities: MediaTransportCapabilities = {
    canPlayPause    : true,
    canSeek         : true,
    canToggleLoop   : true,
    canSkipPrevious : false,
    canSkipNext     : false,
    canAdjustVolume : true,
    canToggleMute   : true,
  }

  const eqBars = shallowRef<number[]>(Array.from<number>({ length: EQ_BARS }).fill(0))

  let audioCtx   : AudioContext | null = null
  let analyser   : AnalyserNode | null = null
  let sourceNode : MediaElementAudioSourceNode | null = null
  let rafId      : number | null = null
  let freqData   : Uint8Array<ArrayBuffer> | null = null
  let userPause  = false
  let preMuteVolume = state.volume

  watch(audioRef, (el) => {
    if (!el) return
    el.loop = state.loop
    el.volume = state.volume
    el.muted = state.muted
  }, { immediate : true })

  function ensureAnalyser() {
    const el = audioRef.value
    if (!el || analyser) return

    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = FFT_SIZE
    analyser.smoothingTimeConstant = 0.7
    freqData = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>

    sourceNode = audioCtx.createMediaElementSource(el)
    sourceNode.connect(analyser)
    analyser.connect(audioCtx.destination)
  }

  function tickEq() {
    if (!analyser || !freqData) return

    analyser.getByteFrequencyData(freqData)

    const binCount = analyser.frequencyBinCount
    const binsPerBar = Math.max(1, Math.floor(binCount / EQ_BARS))
    const heights = eqBars.value

    for (let i = 0; i < EQ_BARS; i += 1) {
      let sum = 0
      for (let j = 0; j < binsPerBar; j += 1) {
        sum += freqData[i * binsPerBar + j] ?? 0
      }
      heights[i] = Math.max(8, (sum / binsPerBar / 255) * 100)
    }

    triggerRef(eqBars)
    rafId = requestAnimationFrame(tickEq)
  }

  function startEqLoop() {
    if (rafId !== null) return
    rafId = requestAnimationFrame(tickEq)
  }

  function stopEqLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    eqBars.value.fill(0)
    triggerRef(eqBars)
  }

  function seekToRatio(ratio: number) {
    const el = audioRef.value
    if (!el || state.duration <= 0) return
    el.currentTime = clamp01(ratio) * state.duration
  }

  function setVolume(volume: number) {
    const next = clamp01(volume)
    state.volume = next
    state.muted = next === 0

    const el = audioRef.value
    if (!el) return
    el.volume = next
    el.muted = state.muted
  }

  function toggleMute() {
    if (state.muted) {
      setVolume(preMuteVolume || 0.8)
      return
    }
    preMuteVolume = state.volume
    setVolume(0)
  }

  function toggleLoop() {
    state.loop = !state.loop
    if (audioRef.value) audioRef.value.loop = state.loop
  }

  function playPause() {
    const el = audioRef.value
    if (!el) return

    if (state.playing && !state.paused) {
      userPause = true
      el.pause()
      return
    }

    ensureAnalyser()
    if (audioCtx?.state === 'suspended') void audioCtx.resume()
    void el.play()
  }

  function onAudioPlay() {
    state.ready = true
    state.playing = true
    state.paused = false
    startEqLoop()
  }

  function onAudioPause() {
    if (!state.playing) return
    if (!userPause) return

    userPause = false
    state.paused = true
    stopEqLoop()
  }

  function onAudioEnded() {
    state.playing = false
    state.paused = false
    state.elapsed = 0
    stopEqLoop()
  }

  function onAudioDurationChange() {
    const el = audioRef.value
    state.duration = safeMediaNumber(el?.duration)
    if (state.duration > 0) state.ready = true
  }

  function onAudioTimeUpdate() {
    const el = audioRef.value
    state.elapsed = safeMediaNumber(el?.currentTime)
  }

  onUnmounted(() => {
    stopEqLoop()

    const el = audioRef.value
    if (el) {
      el.pause()
      el.currentTime = 0
    }

    if (audioCtx) {
      void audioCtx.close()
      audioCtx = null
    }

    analyser = null
    sourceNode = null
    freqData = null
  })

  return {
    kind         : 'audio',
    sourceUrl    : TRACK_URL,
    audioRef,
    state,
    capabilities,
    eqBars,
    actions      : {
      playPause,
      seekToRatio,
      setVolume,
      toggleMute,
      toggleLoop,
    },
    onAudioPlay,
    onAudioPause,
    onAudioEnded,
    onAudioDurationChange,
    onAudioTimeUpdate,
  }
}
