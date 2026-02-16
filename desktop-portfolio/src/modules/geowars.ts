/* ============================================================
   Geometry Wars — Three.js Neon Twin-Stick Mini-Game
   ============================================================
   Proper ES module — no window globals.
   Import and call init/destroy/restart/togglePause directly.
   ============================================================ */

import * as THREE from 'three'
import { EffectComposer }  from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass }      from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { clamp } from '../utils'
import type { GameState } from '../types/desktop'

/* ----------------------------------------------------------
   CONSTANTS
   ---------------------------------------------------------- */
const PI2             = Math.PI * 2
const MAX_BULLETS     = 80
const MAX_PARTICLES   = 200
const MAX_ENEMIES     = 60
const PLAYER_SPEED    = 4.2
const PLAYER_DRAG     = 0.92
const THRUST_DEADZONE = 0.8
const THRUST_MAX_DIST = 12
const BULLET_SPEED    = 9
const BULLET_LIFE     = 80
const FIRE_COOLDOWN   = 6
const PARTICLE_LIFE   = 40
const ENEMY_BASE_SPD  = 1.0
const SPAWN_MARGIN    = 3
const HIT_RADIUS_MULT = 1.15
const BLOOM_STRENGTH  = 1.3
const BLOOM_RADIUS    = 0.45
const BLOOM_THRESHOLD = 0.1
const GRID_DIVISIONS  = 24
const GRID_HALF_Y     = 18
const GRID_HALF_X     = GRID_HALF_Y * (4 / 3) // 4:3 aspect

/* Neon palette */
const COL = {
  cyan    : 0x00ffff,
  green   : 0x39ff14,
  magenta : 0xff00ff,
  orange  : 0xff6600,
  red     : 0xff2244,
  pink    : 0xff44aa,
  purple  : 0xaa44ff,
  yellow  : 0xffee00,
  white   : 0xffffff,
  grid    : 0x114488,
} as const

/* Enemy archetypes */
const ENEMY_TYPES = [
  { name : 'square',   color : COL.red,    sides : 4, size : 0.5,  speed : 1.0, score : 10 },
  { name : 'diamond',  color : COL.orange, sides : 4, size : 0.55, speed : 1.4, score : 25 },
  { name : 'triangle', color : COL.pink,   sides : 3, size : 0.45, speed : 1.8, score : 50 },
  { name : 'hexagon',  color : COL.purple, sides : 6, size : 0.65, speed : 0.7, score : 15 },
] as const

type EnemyType = typeof ENEMY_TYPES[number]

/* ----------------------------------------------------------
   INTERNAL TYPES
   ---------------------------------------------------------- */
interface Bullet {
  mesh  : THREE.LineLoop
  alive : boolean
  x     : number
  y     : number
  vx    : number
  vy    : number
  life  : number
}

interface Enemy {
  mesh   : THREE.LineLoop
  alive  : boolean
  x      : number
  y      : number
  vx     : number
  vy     : number
  type   : EnemyType
  hp     : number
  radius : number
}

interface Particle {
  mesh  : THREE.Mesh
  alive : boolean
  x     : number
  y     : number
  vx    : number
  vy    : number
  life  : number
}

interface Player {
  x      : number
  y      : number
  radius : number
  alive  : boolean
}

/* ----------------------------------------------------------
   STATE
   ---------------------------------------------------------- */
export const state: GameState = {
  score    : 0,
  wave     : 1,
  lives    : 3,
  paused   : false,
  gameOver : false,
}

/* ----------------------------------------------------------
   INTERNAL RUNTIME REFS
   ---------------------------------------------------------- */
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null            = null
let camera: THREE.OrthographicCamera | null = null
let composer: EffectComposer | null      = null
let bloomPass: UnrealBloomPass | null    = null
let container: HTMLElement | null        = null
let raf: number | null                   = null
let running                              = false
let frameCount                           = 0
let fireCooldown                         = 0
let enemiesLeft                          = 0

/* Input */
const keys: Record<string, boolean> = {}
let mouseX    = 0
let mouseY    = 0
let mouseDown = false
let manualPauseRequested = false
let autoPauseRequested   = false

/* Player velocity */
let playerVX = 0
let playerVY = 0

/* Object pools */
let player: Player | null                  = null
let playerGroup: THREE.Group | null        = null
const bullets: Bullet[]                    = []
const enemies: Enemy[]                     = []
const particles: Particle[]                = []
let gridMesh: THREE.LineSegments | null    = null

/* Reusable vector */
const _v3 = new THREE.Vector3()

/* Observers */
let resizeObs: ResizeObserver | null = null

/* ----------------------------------------------------------
   THRUST AUDIO — Rocket thruster roar
   ----------------------------------------------------------
   Rocket thrust is mostly turbulent noise, not tonal.
   Two noise layers (low rumble + mid crackle) through a
   waveshaper for grit, plus a subtle sub-bass sine for body.
   ---------------------------------------------------------- */
const THRUST_VOL_MAX = 0.09

let thrustNoiseLow: AudioBufferSourceNode | null  = null
let thrustNoiseHigh: AudioBufferSourceNode | null  = null
let thrustSub: OscillatorNode | null               = null
let thrustLowGain: GainNode | null                 = null
let thrustHighGain: GainNode | null                = null
let thrustSubGain: GainNode | null                 = null
let thrustLowFilter: BiquadFilterNode | null       = null
let thrustHighFilter: BiquadFilterNode | null      = null
let thrustShaper: WaveShaperNode | null            = null

/** Soft-clip distortion curve for crackle/grit. */
function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const n = 256
  const curve = new Float32Array(n) as Float32Array<ArrayBuffer>
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

function startThrust() {
  const ctx = ensureAudio()
  if (!ctx || thrustNoiseLow) return

  /* Shared noise buffer — 4 s of white noise */
  const dur  = 4
  const buf  = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  /* Waveshaper on a shared bus for crackle */
  thrustShaper = ctx.createWaveShaper()
  thrustShaper.curve = makeDistortionCurve(8)
  thrustShaper.oversample = '2x'
  thrustShaper.connect(ctx.destination)

  /* Low rumble noise — lowpass filtered, drives the body */
  thrustNoiseLow        = ctx.createBufferSource()
  thrustNoiseLow.buffer = buf
  thrustNoiseLow.loop   = true
  thrustLowFilter       = ctx.createBiquadFilter()
  thrustLowFilter.type  = 'lowpass'
  thrustLowFilter.frequency.value = 150
  thrustLowFilter.Q.value = 0.5
  thrustLowGain = ctx.createGain()
  thrustLowGain.gain.value = 0
  thrustNoiseLow.connect(thrustLowFilter).connect(thrustLowGain).connect(thrustShaper)
  thrustNoiseLow.start()

  /* Mid-high crackle noise — bandpass for turbulence texture */
  thrustNoiseHigh        = ctx.createBufferSource()
  thrustNoiseHigh.buffer = buf
  thrustNoiseHigh.loop   = true
  /* Offset start so the two layers don't correlate */
  thrustNoiseHigh.loopStart = 1.7
  thrustHighFilter       = ctx.createBiquadFilter()
  thrustHighFilter.type  = 'bandpass'
  thrustHighFilter.frequency.value = 800
  thrustHighFilter.Q.value = 0.4
  thrustHighGain = ctx.createGain()
  thrustHighGain.gain.value = 0
  thrustNoiseHigh.connect(thrustHighFilter).connect(thrustHighGain).connect(thrustShaper)
  thrustNoiseHigh.start()

  /* Sub-bass sine — subtle physical rumble you feel more than hear */
  thrustSub           = ctx.createOscillator()
  thrustSub.type      = 'sine'
  thrustSub.frequency.value = 30
  thrustSubGain       = ctx.createGain()
  thrustSubGain.gain.value = 0
  thrustSub.connect(thrustSubGain).connect(ctx.destination)
  thrustSub.start()
}

function stopThrust() {
  try { thrustNoiseLow?.stop() }  catch { /* already stopped */ }
  try { thrustNoiseHigh?.stop() } catch { /* already stopped */ }
  thrustSub?.stop()
  thrustNoiseLow = null; thrustNoiseHigh = null; thrustSub = null
  thrustLowGain = null; thrustHighGain = null; thrustSubGain = null
  thrustLowFilter = null; thrustHighFilter = null
  if (thrustShaper) { try { thrustShaper.disconnect() } catch { /* ok */ } thrustShaper = null }
}

/** Call every frame with the ship's current speed normalised 0…1. */
function updateThrustAudio(t: number) {
  if (!thrustLowGain || !thrustHighGain || !thrustSubGain
    || !thrustLowFilter || !thrustHighFilter || !thrustSub || !audioCtx) return
  const now = audioCtx.currentTime
  const s   = 0.04                                     // smoothing time constant

  /* Low rumble — volume scales linearly, filter opens with thrust */
  thrustLowGain.gain.setTargetAtTime(t * THRUST_VOL_MAX, now, s)
  thrustLowFilter.frequency.setTargetAtTime(150 + t * 350, now, s)

  /* Mid crackle — kicks in harder at higher thrust (quadratic) */
  thrustHighGain.gain.setTargetAtTime(t * t * THRUST_VOL_MAX * 0.7, now, s)
  thrustHighFilter.frequency.setTargetAtTime(800 + t * 1400, now, s)

  /* Sub-bass rumble — gentle pitch rise */
  thrustSubGain.gain.setTargetAtTime(t * THRUST_VOL_MAX * 0.5, now, s)
  thrustSub.frequency.setTargetAtTime(30 + t * 18, now, s)
}

/* ----------------------------------------------------------
   AUDIO — Web Audio SFX (procedural)
   ---------------------------------------------------------- */
let audioCtx: AudioContext | null = null

function ensureAudio(): AudioContext | null {
  if (audioCtx) return audioCtx
  try { audioCtx = new AudioContext() }
  catch { /* silent */ }
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', vol = 0.12, detune = 0) {
  const ctx = ensureAudio()
  if (!ctx) return
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type            = type
  osc.frequency.value = freq
  if (detune) osc.detune.value = detune
  gain.gain.setValueAtTime(vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function sfxShoot() {
  const ctx = ensureAudio()
  if (!ctx) return
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)
  gain.gain.setValueAtTime(0.09, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
  osc.connect(gain).connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.12)
}
/** Enemy explosion — filtered noise burst + low thump */
function sfxKill() {
  const ctx = ensureAudio()
  if (!ctx) return
  const t = ctx.currentTime

  /* Noise burst through a decaying band-pass filter */
  const dur   = 0.22
  const buf   = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data  = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src   = ctx.createBufferSource()
  src.buffer  = buf
  const bpf   = ctx.createBiquadFilter()
  bpf.type    = 'bandpass'
  bpf.frequency.setValueAtTime(2000, t)
  bpf.frequency.exponentialRampToValueAtTime(200, t + dur)
  bpf.Q.value = 1.2
  const nGain = ctx.createGain()
  nGain.gain.setValueAtTime(0.16, t)
  nGain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  src.connect(bpf).connect(nGain).connect(ctx.destination)
  src.start(t)

  /* Low-frequency thump for impact body */
  const osc  = ctx.createOscillator()
  osc.type   = 'sine'
  osc.frequency.setValueAtTime(120, t)
  osc.frequency.exponentialRampToValueAtTime(30, t + 0.15)
  const oGain = ctx.createGain()
  oGain.gain.setValueAtTime(0.14, t)
  oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
  osc.connect(oGain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.2)
}

/** Player-hit explosion — heavier version with longer tail */
function sfxHit() {
  const ctx = ensureAudio()
  if (!ctx) return
  const t = ctx.currentTime

  /* Longer noise burst */
  const dur   = 0.35
  const buf   = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data  = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src   = ctx.createBufferSource()
  src.buffer  = buf
  const lpf   = ctx.createBiquadFilter()
  lpf.type    = 'lowpass'
  lpf.frequency.setValueAtTime(3000, t)
  lpf.frequency.exponentialRampToValueAtTime(100, t + dur)
  const nGain = ctx.createGain()
  nGain.gain.setValueAtTime(0.22, t)
  nGain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  src.connect(lpf).connect(nGain).connect(ctx.destination)
  src.start(t)

  /* Deep thump */
  const osc  = ctx.createOscillator()
  osc.type   = 'sine'
  osc.frequency.setValueAtTime(80, t)
  osc.frequency.exponentialRampToValueAtTime(20, t + 0.25)
  const oGain = ctx.createGain()
  oGain.gain.setValueAtTime(0.18, t)
  oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
  osc.connect(oGain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.32)
}
function sfxWave()     { playTone(660, 0.10, 'sine', 0.10); setTimeout(() => playTone(880, 0.12, 'sine', 0.10), 120) }
function sfxGameOver() { playTone(220, 0.4, 'sawtooth', 0.15); setTimeout(() => playTone(160, 0.5, 'sawtooth', 0.12), 250) }

/* ----------------------------------------------------------
   BACKGROUND MUSIC — Procedural synthwave loop
   ----------------------------------------------------------
   A look-ahead scheduler plays bass + arpeggio patterns
   through a shared GainNode so volume and muting are cheap.
   ---------------------------------------------------------- */
const MUSIC_BPM               = 128
const MUSIC_STEP              = 60 / MUSIC_BPM / 4   // 16th-note duration (s)
const MUSIC_LOOK_AHEAD        = 0.12                 // schedule window (s)
const MUSIC_SCHEDULE_INTERVAL = 50                    // scheduler tick (ms)
const MUSIC_VOL_BASS          = 0.010
const MUSIC_VOL_ARP           = 0.007

/* Frequencies — A minor key */
const N = {
  A2 : 110.00, C3 : 130.81, D3 : 146.83, E3 : 164.81,
  F2 : 87.31,  G2 : 98.00,  F3 : 174.61, G3 : 196.00,
  A3 : 220.00, C4 : 261.63, D4 : 293.66, E4 : 329.63,
  F4 : 349.23, G4 : 392.00, A4 : 440.00,
} as const

/* 16-step bass pattern (0 = rest) */
const BASS_PATTERN: readonly number[] = [
  N.A2, 0, 0, N.A2,  0, 0, N.A2, 0,
  N.F2, 0, 0, N.F2,  N.G2, 0, N.G2, 0,
]

/* 16-step arpeggio pattern */
const ARP_PATTERN: readonly number[] = [
  N.A4, N.E4, N.C4, N.E4,  N.A4, N.E4, N.C4, N.E4,
  N.F4, N.C4, N.A3, N.C4,  N.G4, N.D4, N.A3, N.D4,
]

let musicGain: GainNode | null                       = null
let musicScheduler: ReturnType<typeof setInterval> | null = null
let musicStep                                         = 0
let musicNextTime                                     = 0
let musicPlaying                                      = false

/** Schedule a single oscillator note on the music bus. */
function scheduleMusicNote(
  freq : number, time : number, dur : number,
  type : OscillatorType, vol : number,
) {
  if (!audioCtx || !musicGain) return
  const osc  = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type            = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur)
  osc.connect(gain).connect(musicGain)
  osc.start(time)
  osc.stop(time + dur + 0.02)
}

/** Look-ahead scheduler tick — schedules notes within the look-ahead window. */
function musicTick() {
  if (!audioCtx || !musicGain) return
  const deadline = audioCtx.currentTime + MUSIC_LOOK_AHEAD
  while (musicNextTime < deadline) {
    const step = musicStep % BASS_PATTERN.length
    const bass = BASS_PATTERN[step]!
    const arp  = ARP_PATTERN[step]!

    if (bass > 0) scheduleMusicNote(bass, musicNextTime, MUSIC_STEP * 1.8, 'triangle', MUSIC_VOL_BASS)
    if (arp  > 0) scheduleMusicNote(arp,  musicNextTime, MUSIC_STEP * 0.55, 'square',   MUSIC_VOL_ARP)

    musicStep++
    musicNextTime += MUSIC_STEP
  }
}

function startMusic() {
  const ctx = ensureAudio()
  if (!ctx || musicPlaying) return
  musicGain = ctx.createGain()
  musicGain.gain.value = 1
  musicGain.connect(ctx.destination)
  musicStep     = 0
  musicNextTime = ctx.currentTime + 0.05
  musicPlaying  = true
  musicScheduler = setInterval(musicTick, MUSIC_SCHEDULE_INTERVAL)
}

function stopMusic() {
  if (musicScheduler) { clearInterval(musicScheduler); musicScheduler = null }
  if (musicGain) {
    try { musicGain.disconnect() } catch { /* already disconnected */ }
    musicGain = null
  }
  musicPlaying = false
}

function pauseMusic() {
  if (musicScheduler) { clearInterval(musicScheduler); musicScheduler = null }
}

function resumeMusic() {
  if (!musicPlaying || musicScheduler) return
  if (!audioCtx) return
  musicNextTime = audioCtx.currentTime + 0.05
  musicScheduler = setInterval(musicTick, MUSIC_SCHEDULE_INTERVAL)
}

function syncPauseState() {
  const nextPaused = manualPauseRequested || autoPauseRequested
  if (state.paused === nextPaused) return
  state.paused = nextPaused
  if (state.paused) { pauseMusic(); updateThrustAudio(0) }
  else resumeMusic()
}

/* ----------------------------------------------------------
   GEOMETRY HELPERS
   ---------------------------------------------------------- */
function makeRing(sides: number, radius: number, color: number): THREE.LineLoop {
  const pts: THREE.Vector3[] = []
  const rot = sides === 3 ? -Math.PI / 2 : 0
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * PI2 + rot
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts)
  const mat = new THREE.LineBasicMaterial({ color, linewidth : 2, transparent : true, opacity : 1 })
  return new THREE.LineLoop(geo, mat)
}

function makeGlow(color: number, size: number): THREE.Mesh {
  const geo = new THREE.CircleGeometry(size, 12)
  const mat = new THREE.MeshBasicMaterial({
    color, transparent : true, opacity : 0.7,
    blending : THREE.AdditiveBlending, depthWrite : false,
  })
  return new THREE.Mesh(geo, mat)
}

/* ----------------------------------------------------------
   SCENE SETUP
   ---------------------------------------------------------- */
function buildScene(w: number, h: number) {
  renderer = new THREE.WebGLRenderer({ antialias : true, alpha : false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)
  renderer.setClearColor(0x040412)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container!.appendChild(renderer.domElement)

  scene  = new THREE.Scene()
  camera = new THREE.OrthographicCamera(
    -GRID_HALF_X, GRID_HALF_X, GRID_HALF_Y, -GRID_HALF_Y, 0.1, 100,
  )
  camera.position.z = 10

  try {
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD)
    composer.addPass(bloomPass)
  } catch {
    composer = null
  }

  buildGrid()
  buildPlayer()
}

function buildGrid() {
  const stepX = (GRID_HALF_X * 2) / GRID_DIVISIONS
  const stepY = (GRID_HALF_Y * 2) / GRID_DIVISIONS
  const pts: THREE.Vector3[] = []
  /* Vertical lines */
  for (let i = 0; i <= GRID_DIVISIONS; i++) {
    const x = -GRID_HALF_X + i * stepX
    pts.push(new THREE.Vector3(x, -GRID_HALF_Y, 0), new THREE.Vector3(x, GRID_HALF_Y, 0))
  }
  /* Horizontal lines */
  for (let i = 0; i <= GRID_DIVISIONS; i++) {
    const y = -GRID_HALF_Y + i * stepY
    pts.push(new THREE.Vector3(-GRID_HALF_X, y, 0), new THREE.Vector3(GRID_HALF_X, y, 0))
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts)
  const mat = new THREE.LineBasicMaterial({
    color : COL.grid, transparent : true, opacity : 0.18,
    blending : THREE.AdditiveBlending, depthWrite : false,
  })
  gridMesh = new THREE.LineSegments(geo, mat)
  scene!.add(gridMesh)
}

function buildPlayer() {
  playerGroup = new THREE.Group()
  playerGroup.add(makeRing(3, 0.6, COL.cyan))
  playerGroup.add(makeGlow(COL.cyan, 0.25))
  scene!.add(playerGroup)
  player = { x : 0, y : 0, radius : 0.5, alive : true }
  playerGroup.position.set(0, 0, 0)
}

/* ----------------------------------------------------------
   BULLET POOL
   ---------------------------------------------------------- */
function spawnBullet(x: number, y: number, angle: number) {
  let b = bullets.find(b => !b.alive)
  if (!b) {
    if (bullets.length >= MAX_BULLETS) return
    const mesh = makeRing(6, 0.15, COL.green)
    scene!.add(mesh)
    b = { mesh, alive : false, x : 0, y : 0, vx : 0, vy : 0, life : 0 }
    bullets.push(b)
  }
  b.alive   = true
  b.x       = x
  b.y       = y
  b.vx      = Math.cos(angle) * BULLET_SPEED
  b.vy      = Math.sin(angle) * BULLET_SPEED
  b.life    = BULLET_LIFE
  b.mesh.visible = true
  b.mesh.position.set(x, y, 0)
  ;(b.mesh.material as THREE.Material).opacity = 1
}

function updateBullets() {
  for (const b of bullets) {
    if (!b.alive) continue
    b.x += b.vx * 0.016
    b.y += b.vy * 0.016
    b.life--
    if (b.life <= 0 || Math.abs(b.x) > GRID_HALF_X || Math.abs(b.y) > GRID_HALF_Y) {
      b.alive = false; b.mesh.visible = false; continue
    }
    b.mesh.position.set(b.x, b.y, 0)
    ;(b.mesh.material as THREE.Material).opacity = Math.min(1, b.life / 20)
  }
}

/* ----------------------------------------------------------
   ENEMY POOL
   ---------------------------------------------------------- */
function spawnEnemy() {
  if (enemies.filter(e => e.alive).length >= MAX_ENEMIES) return
  const typeIdx = Math.floor(Math.random() * ENEMY_TYPES.length)
  const type    = ENEMY_TYPES[typeIdx]!

  let ex = 0, ey = 0, attempts = 0
  do {
    const edge = Math.floor(Math.random() * 4)
    switch (edge) {
      case 0 : { const t = (Math.random() - 0.5) * 2 * (GRID_HALF_X - 1); ex = t; ey =  GRID_HALF_Y - 1; break }
      case 1 : { const t = (Math.random() - 0.5) * 2 * (GRID_HALF_X - 1); ex = t; ey = -GRID_HALF_Y + 1; break }
      case 2 : { const t = (Math.random() - 0.5) * 2 * (GRID_HALF_Y - 1); ex =  GRID_HALF_X - 1; ey = t; break }
      default: { const t = (Math.random() - 0.5) * 2 * (GRID_HALF_Y - 1); ex = -GRID_HALF_X + 1; ey = t; break }
    }
    attempts++
  } while (player && Math.hypot(ex - player.x, ey - player.y) < SPAWN_MARGIN && attempts < 20)

  let e = enemies.find(e => !e.alive)
  if (!e) {
    const mesh = makeRing(type.sides, type.size, type.color)
    scene!.add(mesh)
    e = { mesh, alive : false, x : 0, y : 0, vx : 0, vy : 0, type, hp : 1, radius : 0.4 }
    enemies.push(e)
  } else {
    scene!.remove(e.mesh)
    e.mesh.geometry.dispose()
    ;(e.mesh.material as THREE.Material).dispose()
    e.mesh = makeRing(type.sides, type.size, type.color)
    scene!.add(e.mesh)
  }

  e.alive  = true
  e.x      = ex
  e.y      = ey
  e.type   = type
  e.hp     = 1
  e.radius = type.size * 0.8
  e.mesh.visible = true
  e.mesh.position.set(ex, ey, 0)
  ;(e.mesh.material as THREE.Material).opacity = 1
}

function updateEnemies() {
  if (!player) return
  for (const e of enemies) {
    if (!e.alive) continue
    const dx   = player.x - e.x
    const dy   = player.y - e.y
    const dist = Math.hypot(dx, dy) || 1
    const spd  = ENEMY_BASE_SPD * e.type.speed * (0.85 + state.wave * 0.05)
    e.vx = (dx / dist) * spd
    e.vy = (dy / dist) * spd
    e.x += e.vx * 0.016
    e.y += e.vy * 0.016
    e.x = clamp(e.x, -GRID_HALF_X + 0.5, GRID_HALF_X - 0.5)
    e.y = clamp(e.y, -GRID_HALF_Y + 0.5, GRID_HALF_Y - 0.5)
    e.mesh.position.set(e.x, e.y, 0)
    e.mesh.rotation.z += 0.02 * e.type.speed
  }
}

function killEnemy(e: Enemy) {
  e.alive = false
  e.mesh.visible = false
  state.score += e.type.score
  enemiesLeft--
  burstParticles(e.x, e.y, e.type.color, 8)
  sfxKill()
}

/* ----------------------------------------------------------
   PARTICLE POOL
   ---------------------------------------------------------- */
function spawnParticle(x: number, y: number, color: number) {
  let p = particles.find(p => !p.alive)
  if (!p) {
    if (particles.length >= MAX_PARTICLES) return
    const mesh = makeGlow(color, 0.1)
    scene!.add(mesh)
    p = { mesh, alive : false, x : 0, y : 0, vx : 0, vy : 0, life : 0 }
    particles.push(p)
  }
  const angle = Math.random() * PI2
  const speed = 2 + Math.random() * 4
  p.alive = true
  p.x = x; p.y = y
  p.vx = Math.cos(angle) * speed
  p.vy = Math.sin(angle) * speed
  p.life = PARTICLE_LIFE
  p.mesh.visible = true
  ;(p.mesh.material as THREE.MeshBasicMaterial).color.setHex(color)
  ;(p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9
  p.mesh.position.set(x, y, 0)
}

function burstParticles(x: number, y: number, color: number, count: number) {
  for (let i = 0; i < count; i++) spawnParticle(x, y, color)
}

function updateParticles() {
  for (const p of particles) {
    if (!p.alive) continue
    p.x += p.vx * 0.016; p.y += p.vy * 0.016
    p.vx *= 0.96; p.vy *= 0.96
    p.life--
    if (p.life <= 0) { p.alive = false; p.mesh.visible = false; continue }
    ;(p.mesh.material as THREE.MeshBasicMaterial).opacity = p.life / PARTICLE_LIFE
    p.mesh.position.set(p.x, p.y, 0)
  }
}

/* ----------------------------------------------------------
   WAVE SYSTEM
   ---------------------------------------------------------- */
function startWave() {
  const count = 4 + state.wave * 3
  enemiesLeft = count
  sfxWave()
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (!running || state.paused || state.gameOver) return
      spawnEnemy()
    }, i * 350)
  }
}

function checkWaveComplete() {
  if (enemiesLeft <= 0 && enemies.every(e => !e.alive)) {
    state.wave++
    startWave()
  }
}

/* ----------------------------------------------------------
   COLLISION
   ---------------------------------------------------------- */
function checkCollisions() {
  for (const b of bullets) {
    if (!b.alive) continue
    for (const e of enemies) {
      if (!e.alive) continue
      if (Math.hypot(b.x - e.x, b.y - e.y) < (e.radius + 0.15) * HIT_RADIUS_MULT) {
        b.alive = false; b.mesh.visible = false
        e.hp--
        if (e.hp <= 0) killEnemy(e)
        break
      }
    }
  }
  if (!player?.alive) return
  for (const e of enemies) {
    if (!e.alive) continue
    if (Math.hypot(e.x - player.x, e.y - player.y) < (player.radius + e.radius) * 0.8) {
      onPlayerHit()
      break
    }
  }
}

function onPlayerHit() {
  if (!player || !playerGroup) return
  state.lives--
  burstParticles(player.x, player.y, COL.cyan, 16)
  sfxHit()
  if (state.lives <= 0) {
    state.gameOver = true
    player.alive = false
    playerGroup.visible = false
    pauseMusic()
    sfxGameOver()
    return
  }
  player.x = 0; player.y = 0
  playerGroup.position.set(0, 0, 0)
  for (const e of enemies) {
    if (!e.alive) continue
    if (Math.hypot(e.x, e.y) < 4) killEnemy(e)
  }
}

/* ----------------------------------------------------------
   INPUT
   ---------------------------------------------------------- */
function onKeyDown(e: KeyboardEvent) {
  keys[e.key] = true
  if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
    e.preventDefault()
    if (!state.gameOver) togglePause()
  }
}

function onKeyUp(e: KeyboardEvent) { keys[e.key] = false }

function onPointerMove(e: PointerEvent) {
  if (!renderer) return
  const rect = renderer.domElement.getBoundingClientRect()
  mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1
}

function onPointerDown(e: PointerEvent) { if (e.button === 0) mouseDown = true }
function onPointerUp()                  { mouseDown = false }

function onMouseEnterCanvas() {
  if (state.gameOver) return
  autoPauseRequested = false
  syncPauseState()
}

function onMouseLeaveCanvas() {
  if (state.gameOver) return
  autoPauseRequested = true
  mouseDown = false
  syncPauseState()
}

function bindInput() {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  renderer?.domElement.addEventListener('pointermove', onPointerMove)
  renderer?.domElement.addEventListener('pointerdown', onPointerDown)
  renderer?.domElement.addEventListener('pointerup', onPointerUp)
  renderer?.domElement.addEventListener('mouseenter', onMouseEnterCanvas)
  renderer?.domElement.addEventListener('mouseleave', onMouseLeaveCanvas)
}

function unbindInput() {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
  renderer?.domElement.removeEventListener('pointermove', onPointerMove)
  renderer?.domElement.removeEventListener('pointerdown', onPointerDown)
  renderer?.domElement.removeEventListener('pointerup', onPointerUp)
  renderer?.domElement.removeEventListener('mouseenter', onMouseEnterCanvas)
  renderer?.domElement.removeEventListener('mouseleave', onMouseLeaveCanvas)
}

/* ----------------------------------------------------------
   PLAYER UPDATE
   ---------------------------------------------------------- */
function ndcToWorld(nx: number, ny: number) {
  if (!camera) return { x : 0, y : 0 }
  _v3.set(nx, ny, 0).unproject(camera)
  return { x : _v3.x, y : _v3.y }
}

function updatePlayer() {
  if (!player?.alive || !playerGroup) return
  const wc       = ndcToWorld(mouseX, mouseY)
  const dx       = wc.x - player.x
  const dy       = wc.y - player.y
  const dist     = Math.hypot(dx, dy)
  const aimAngle = Math.atan2(dy, dx)

  if (dist > THRUST_DEADZONE) {
    const t      = clamp((dist - THRUST_DEADZONE) / (THRUST_MAX_DIST - THRUST_DEADZONE), 0, 1)
    const thrust = t * PLAYER_SPEED * 0.016
    playerVX += Math.cos(aimAngle) * thrust
    playerVY += Math.sin(aimAngle) * thrust
  }

  playerVX *= PLAYER_DRAG
  playerVY *= PLAYER_DRAG

  /* Update thrust audio based on current speed */
  const speed = Math.hypot(playerVX, playerVY)
  const maxSpeed = PLAYER_SPEED * 0.25          // practical max after drag
  updateThrustAudio(clamp(speed / maxSpeed, 0, 1))

  player.x = clamp(player.x + playerVX, -GRID_HALF_X + 0.6, GRID_HALF_X - 0.6)
  player.y = clamp(player.y + playerVY, -GRID_HALF_Y + 0.6, GRID_HALF_Y - 0.6)
  playerGroup.position.set(player.x, player.y, 0)
  playerGroup.rotation.z = aimAngle + Math.PI / 2

  if (mouseDown && fireCooldown <= 0) {
    spawnBullet(player.x, player.y, aimAngle)
    sfxShoot()
    fireCooldown = FIRE_COOLDOWN
  }
  if (fireCooldown > 0) fireCooldown--
}

/* ----------------------------------------------------------
   RESIZE
   ---------------------------------------------------------- */
function handleResize() {
  if (!container || !renderer || !camera) return
  const w = container.clientWidth
  const h = container.clientHeight
  if (w === 0 || h === 0) return
  renderer.setSize(w, h)
  camera.left   = -GRID_HALF_X
  camera.right  =  GRID_HALF_X
  camera.top    =  GRID_HALF_Y
  camera.bottom = -GRID_HALF_Y
  camera.updateProjectionMatrix()
  if (composer) {
    composer.setSize(w, h)
    bloomPass?.resolution.set(w, h)
  }
}

/* ----------------------------------------------------------
   GAME LOOP
   ---------------------------------------------------------- */
function tick() {
  if (!running) return
  raf = requestAnimationFrame(tick)
  if (state.paused || state.gameOver) { render(); return }
  frameCount++
  updatePlayer()
  updateBullets()
  updateEnemies()
  updateParticles()
  checkCollisions()
  checkWaveComplete()
  render()
}

function render() {
  if (composer) composer.render()
  else renderer?.render(scene!, camera!)
}

/* ----------------------------------------------------------
   RESET
   ---------------------------------------------------------- */
function resetGameState() {
  state.score = 0; state.wave = 1; state.lives = 3
  state.paused = false; state.gameOver = false
  frameCount = 0; fireCooldown = 0; playerVX = 0; playerVY = 0
  manualPauseRequested = false
  autoPauseRequested = false

  if (player && playerGroup) {
    player.x = 0; player.y = 0; player.alive = true
    playerGroup.visible = true
    playerGroup.position.set(0, 0, 0)
  }

  for (const b of bullets)   { b.alive = false; b.mesh.visible = false }
  for (const e of enemies)   { e.alive = false; e.mesh.visible = false }
  for (const p of particles) { p.alive = false; p.mesh.visible = false }
  Object.keys(keys).forEach(k => { keys[k] = false })
  mouseDown = false
}

/* ----------------------------------------------------------
   PUBLIC API
   ---------------------------------------------------------- */

export function init(containerEl: HTMLElement) {
  if (running) return
  container = containerEl
  if (!container) return
  const w = container.clientWidth  || 400
  const h = container.clientHeight || 300
  buildScene(w, h)
  bindInput()
  resizeObs = new ResizeObserver(() => handleResize())
  resizeObs.observe(container)
  running = true
  resetGameState()
  startMusic()
  startThrust()
  startWave()
  tick()
}

export function destroy() {
  running = false
  stopMusic()
  stopThrust()
  manualPauseRequested = false
  autoPauseRequested = false
  unbindInput()
  if (raf) { cancelAnimationFrame(raf); raf = null }
  if (resizeObs) { resizeObs.disconnect(); resizeObs = null }
  if (composer) { composer.dispose(); composer = null }

  const disposeMesh = (obj: { mesh: THREE.Object3D }) => {
    const m = obj.mesh as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
    const mat = m.material
    if (mat) {
      if (Array.isArray(mat)) mat.forEach(m => m.dispose())
      else (mat as THREE.Material).dispose()
    }
    scene?.remove(obj.mesh)
  }

  bullets.forEach(disposeMesh)
  enemies.forEach(disposeMesh)
  particles.forEach(disposeMesh)
  bullets.length = 0; enemies.length = 0; particles.length = 0

  if (gridMesh) {
    gridMesh.geometry?.dispose()
    ;(gridMesh.material as THREE.Material).dispose()
    scene?.remove(gridMesh)
    gridMesh = null
  }

  if (playerGroup) {
    playerGroup.traverse(child => {
      const c = child as THREE.Mesh
      c.geometry?.dispose()
      ;(c.material as THREE.Material | undefined)?.dispose()
    })
    scene?.remove(playerGroup)
    playerGroup = null; player = null
  }

  if (renderer) { renderer.dispose(); renderer.domElement?.remove(); renderer = null }
  scene = null; camera = null; bloomPass = null; container = null
}

export function restart() {
  if (!running) return
  stopMusic()
  stopThrust()
  resetGameState()
  startMusic()
  startThrust()
  startWave()
}

export function togglePause() {
  if (state.gameOver) return
  manualPauseRequested = !manualPauseRequested
  syncPauseState()
}
