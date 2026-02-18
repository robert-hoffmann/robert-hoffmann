/* ============================================================
   useWindowSfx — Subtle desktop window swoosh effects
   ============================================================
   Manual single-window actions only:
   - minimize (downward sweep)
   - restore  (upward sweep)
   ============================================================ */

interface SweepConfig {
  duration        : number
  bodyStartHz     : number
  bodyEndHz       : number
  bodyQ           : number
  bodyPeakGain    : number
  airStartHz      : number
  airEndHz        : number
  airPeakGain     : number
  lowpassCutoffHz : number
  panStart        : number
  panEnd          : number
}

const REPLAY_GUARD_MS = 70
const ATTACK_SECONDS  = 0.016
const TAIL_GAIN       = 0.0001
const NOISE_SECONDS   = 0.48
const BODY_DECAY_RATIO = 0.42
const AIR_ATTACK_RATIO = 0.72

const MINIMIZE_SWEEP: SweepConfig = {
  duration        : 0.23,
  bodyStartHz     : 4200,
  bodyEndHz       : 420,
  bodyQ           : 1.35,
  bodyPeakGain    : 0.042,
  airStartHz      : 1800,
  airEndHz        : 6200,
  airPeakGain     : 0.020,
  lowpassCutoffHz : 9800,
  panStart        : 0.12,
  panEnd          : -0.08,
}

const RESTORE_SWEEP: SweepConfig = {
  duration        : 0.22,
  bodyStartHz     : 460,
  bodyEndHz       : 5200,
  bodyQ           : 1.18,
  bodyPeakGain    : 0.038,
  airStartHz      : 1200,
  airEndHz        : 7000,
  airPeakGain     : 0.018,
  lowpassCutoffHz : 10200,
  panStart        : -0.12,
  panEnd          : 0.10,
}

let audioCtx: AudioContext | null = null
let noiseBuffer: AudioBuffer | null = null
let lastPlayMs = -Infinity

function nowMs(): number {
  return typeof performance !== 'undefined'
    ? performance.now()
    : Date.now()
}

function isReplayBlocked(): boolean {
  const now = nowMs()
  if (now - lastPlayMs < REPLAY_GUARD_MS) return true
  lastPlayMs = now
  return false
}

function ensureAudioContext(): AudioContext | null {
  if (audioCtx) return audioCtx
  try { audioCtx = new AudioContext() }
  catch { /* silent fallback when Web Audio is unavailable */ }
  return audioCtx
}

function ensureNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer
  }

  const frameCount = Math.floor(ctx.sampleRate * NOISE_SECONDS)
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  noiseBuffer = buffer
  return buffer
}

async function resumeIfNeeded(ctx: AudioContext): Promise<boolean> {
  try {
    if (ctx.state === 'suspended') await ctx.resume()
  } catch {
    return false
  }
  return ctx.state === 'running'
}

function renderSweep(ctx: AudioContext, config: SweepConfig) {
  const now = ctx.currentTime
  const bodySource = ctx.createBufferSource()
  const airSource = ctx.createBufferSource()
  bodySource.buffer = ensureNoiseBuffer(ctx)
  airSource.buffer = ensureNoiseBuffer(ctx)

  const bodyFilter = ctx.createBiquadFilter()
  bodyFilter.type = 'bandpass'
  bodyFilter.Q.setValueAtTime(config.bodyQ, now)
  bodyFilter.frequency.setValueAtTime(config.bodyStartHz, now)
  bodyFilter.frequency.exponentialRampToValueAtTime(config.bodyEndHz, now + config.duration)

  const airFilter = ctx.createBiquadFilter()
  airFilter.type = 'highpass'
  airFilter.frequency.setValueAtTime(config.airStartHz, now)
  airFilter.frequency.exponentialRampToValueAtTime(config.airEndHz, now + config.duration)

  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.setValueAtTime(config.lowpassCutoffHz, now)

  const bodyGain = ctx.createGain()
  bodyGain.gain.setValueAtTime(TAIL_GAIN, now)
  bodyGain.gain.linearRampToValueAtTime(config.bodyPeakGain, now + ATTACK_SECONDS)
  bodyGain.gain.linearRampToValueAtTime(config.bodyPeakGain * BODY_DECAY_RATIO, now + config.duration * 0.58)
  bodyGain.gain.exponentialRampToValueAtTime(TAIL_GAIN, now + config.duration)

  const airGain = ctx.createGain()
  airGain.gain.setValueAtTime(TAIL_GAIN, now)
  airGain.gain.linearRampToValueAtTime(config.airPeakGain, now + config.duration * AIR_ATTACK_RATIO)
  airGain.gain.exponentialRampToValueAtTime(TAIL_GAIN, now + config.duration)

  const panner = ctx.createStereoPanner()
  panner.pan.setValueAtTime(config.panStart, now)
  panner.pan.linearRampToValueAtTime(config.panEnd, now + config.duration)

  const master = ctx.createGain()
  master.gain.setValueAtTime(1, now)

  bodySource.connect(bodyFilter).connect(bodyGain).connect(lowpass)
  airSource.connect(airFilter).connect(airGain).connect(lowpass)
  lowpass.connect(panner).connect(master).connect(ctx.destination)

  bodySource.start(now)
  airSource.start(now)
  bodySource.stop(now + config.duration)
  airSource.stop(now + config.duration)
}

function playSweep(config: SweepConfig) {
  if (isReplayBlocked()) return

  const ctx = ensureAudioContext()
  if (!ctx) return

  void (async () => {
    const ready = await resumeIfNeeded(ctx)
    if (!ready) return
    renderSweep(ctx, config)
  })()
}

export function useWindowSfx() {
  return {
    playMinimize() { playSweep(MINIMIZE_SWEEP) },
    playRestore()  { playSweep(RESTORE_SWEEP) },
  }
}
