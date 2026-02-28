<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import DesktopParallaxScene from './DesktopParallaxScene.vue'
import type {
  BackgroundAnchorX,
  BackgroundAnchorY,
  BackgroundSizeMode,
  ParallaxSceneConfig,
  ParallaxWidthBucket,
  ResolvedParallaxLayer,
} from '../types/parallax'
import {
  DEFAULT_PARALLAX_SCENE_CONFIG,
  resolveParallaxWidthBucket,
} from '../types/parallax'

const props = withDefaults(defineProps<{
  sceneUrl? : string
  enabled? : boolean
}>(), {
  sceneUrl : '/parallax/desktop.scene.json',
  enabled : true,
})

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const sceneConfig = ref<ParallaxSceneConfig>(DEFAULT_PARALLAX_SCENE_CONFIG)
const activeBucket = ref<ParallaxWidthBucket | null>(null)
const activeLayers = ref<ResolvedParallaxLayer[]>([])
const activeSharpUrl = ref<string | null>(null)
const sharpReady = ref(false)
const parallaxReady = ref(false)
const isReducedMotion = ref(false)

const widthBucket = ref<ParallaxWidthBucket>(
  resolveParallaxWidthBucket(typeof window !== 'undefined' ? window.innerWidth : 1280),
)

let reducedMotionMedia: MediaQueryList | null = null
let pendingTicket = 0

const parallaxEnabled = computed(() =>
  Boolean(props.enabled && !isReducedMotion.value),
)

const sharpLayerStyle = computed<CSSProperties>(() => ({
  '--desktop-sharp-image' : activeSharpUrl.value ? `url("${activeSharpUrl.value}")` : 'none',
}))

function toBaseUrl(pathname: string) {
  const trimmed = pathname.trim()
  if (!trimmed) return `${import.meta.env.BASE_URL}parallax/desktop.scene.json`

  const isAbsolute = /^(https?:|data:|blob:)/i.test(trimmed)
  if (isAbsolute) return trimmed

  if (trimmed.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${trimmed.slice(1)}`
  }

  return `${import.meta.env.BASE_URL}${trimmed}`
}

function layerImageUrl(layerId: string, width: ParallaxWidthBucket) {
  return `${import.meta.env.BASE_URL}parallax/desktop/${layerId}-${width}.webp`
}

function wallpaperUrlForBucket(width: ParallaxWidthBucket) {
  return `${import.meta.env.BASE_URL}wallpaper-${width}.webp`
}

function resolveSceneLayers(scene: ParallaxSceneConfig, bucket: ParallaxWidthBucket): ResolvedParallaxLayer[] {
  return scene.layers.map(layer => ({
    ...layer,
    imageUrl : layerImageUrl(layer.id, bucket),
    bucket,
  }))
}

function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const loader = new Image()
    loader.decoding = 'async'

    const cleanup = () => {
      loader.removeEventListener('load', onLoad)
      loader.removeEventListener('error', onError)
    }

    const onLoad = () => {
      cleanup()
      resolve(true)
    }

    const onError = () => {
      cleanup()
      resolve(false)
    }

    loader.addEventListener('load', onLoad)
    loader.addEventListener('error', onError)
    loader.src = url
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asNumber(value: unknown, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return value
}

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function asAnchorX(value: unknown, fallback: BackgroundAnchorX): BackgroundAnchorX {
  if (value === 'left' || value === 'center' || value === 'right') return value
  return fallback
}

function asAnchorY(value: unknown, fallback: BackgroundAnchorY): BackgroundAnchorY {
  if (value === 'top' || value === 'center' || value === 'bottom') return value
  return fallback
}

function asBackgroundSizeMode(value: unknown, fallback: BackgroundSizeMode): BackgroundSizeMode {
  if (value === 'cover' || value === 'contain' || value === 'custom') return value
  return fallback
}

function parseSceneConfig(input: unknown): ParallaxSceneConfig | null {
  if (!isRecord(input)) return null

  const sceneRaw = isRecord(input.scene) ? input.scene : null
  const harmonicsRaw = isRecord(input.harmonics) ? input.harmonics : null
  const layersRaw = Array.isArray(input.layers) ? input.layers : null
  if (!sceneRaw || !harmonicsRaw || !layersRaw) return null

  const parsedLayers = layersRaw
    .map((layerRaw, index) => {
      if (!isRecord(layerRaw)) return null

      const fallbackLayer = DEFAULT_PARALLAX_SCENE_CONFIG.layers[0]
      if (!fallbackLayer) return null
      const defaultLayer = DEFAULT_PARALLAX_SCENE_CONFIG.layers[index] ?? fallbackLayer

      const geometryRaw = isRecord(layerRaw.geometry) ? layerRaw.geometry : null
      const backgroundRaw = isRecord(layerRaw.background) ? layerRaw.background : null
      const motionRaw = isRecord(layerRaw.motion) ? layerRaw.motion : null
      const positionRaw = backgroundRaw && isRecord(backgroundRaw.position) ? backgroundRaw.position : null
      const sizeRaw = backgroundRaw && isRecord(backgroundRaw.size) ? backgroundRaw.size : null
      const repeatRaw = backgroundRaw && isRecord(backgroundRaw.repeat) ? backgroundRaw.repeat : null

      if (!geometryRaw || !backgroundRaw || !motionRaw || !positionRaw || !sizeRaw || !repeatRaw) {
        return null
      }

      return {
        id         : asString(layerRaw.id, defaultLayer.id),
        presetKey  : asString(layerRaw.presetKey, defaultLayer.presetKey),
        name       : asString(layerRaw.name, defaultLayer.name),
        imageSrc   : asString(layerRaw.imageSrc, defaultLayer.imageSrc),
        visible    : asBoolean(layerRaw.visible, defaultLayer.visible),
        geometry   : {
          topPct    : asNumber(geometryRaw.topPct, defaultLayer.geometry.topPct),
          leftPct   : asNumber(geometryRaw.leftPct, defaultLayer.geometry.leftPct),
          widthPct  : asNumber(geometryRaw.widthPct, defaultLayer.geometry.widthPct),
          heightPct : asNumber(geometryRaw.heightPct, defaultLayer.geometry.heightPct),
          zIndex    : asNumber(geometryRaw.zIndex, defaultLayer.geometry.zIndex),
          baseZ     : asNumber(geometryRaw.baseZ, defaultLayer.geometry.baseZ),
          baseScale : asNumber(geometryRaw.baseScale, defaultLayer.geometry.baseScale),
        },
        background : {
          position : {
            anchorX    : asAnchorX(positionRaw.anchorX, defaultLayer.background.position.anchorX),
            anchorY    : asAnchorY(positionRaw.anchorY, defaultLayer.background.position.anchorY),
            offsetXPct : asNumber(positionRaw.offsetXPct, defaultLayer.background.position.offsetXPct),
            offsetYPct : asNumber(positionRaw.offsetYPct, defaultLayer.background.position.offsetYPct),
          },
          size : {
            mode      : asBackgroundSizeMode(sizeRaw.mode, defaultLayer.background.size.mode),
            widthPct  : asNumber(sizeRaw.widthPct, defaultLayer.background.size.widthPct),
            heightPct : asNumber(sizeRaw.heightPct, defaultLayer.background.size.heightPct),
          },
          repeat : {
            x : asString(repeatRaw.x, defaultLayer.background.repeat.x),
            y : asString(repeatRaw.y, defaultLayer.background.repeat.y),
          },
          color     : asString(backgroundRaw.color, defaultLayer.background.color),
          blendMode : asString(backgroundRaw.blendMode, defaultLayer.background.blendMode),
          origin    : asString(backgroundRaw.origin, defaultLayer.background.origin),
          clip      : asString(backgroundRaw.clip, defaultLayer.background.clip),
        },
        motion : {
          lerp       : asNumber(motionRaw.lerp, defaultLayer.motion.lerp),
          scaleBoost : asNumber(motionRaw.scaleBoost, defaultLayer.motion.scaleBoost),
          moveX      : asNumber(motionRaw.moveX, defaultLayer.motion.moveX),
          moveY      : asNumber(motionRaw.moveY, defaultLayer.motion.moveY),
          floatX     : asNumber(motionRaw.floatX, defaultLayer.motion.floatX),
          floatY     : asNumber(motionRaw.floatY, defaultLayer.motion.floatY),
          floatSpeed : asNumber(motionRaw.floatSpeed, defaultLayer.motion.floatSpeed),
        },
      }
    })
    .filter((layer): layer is ParallaxSceneConfig['layers'][number] => layer !== null)

  if (parsedLayers.length === 0) return null

  return {
    scene : {
      maxRot                  : asNumber(sceneRaw.maxRot, DEFAULT_PARALLAX_SCENE_CONFIG.scene.maxRot),
      containerLerp           : asNumber(sceneRaw.containerLerp, DEFAULT_PARALLAX_SCENE_CONFIG.scene.containerLerp),
      perspective             : asNumber(sceneRaw.perspective, DEFAULT_PARALLAX_SCENE_CONFIG.scene.perspective),
      documentBackgroundColor : asString(
        sceneRaw.documentBackgroundColor,
        DEFAULT_PARALLAX_SCENE_CONFIG.scene.documentBackgroundColor,
      ),
    },
    harmonics : {
      freqA : asNumber(harmonicsRaw.freqA, DEFAULT_PARALLAX_SCENE_CONFIG.harmonics.freqA),
      freqB : asNumber(harmonicsRaw.freqB, DEFAULT_PARALLAX_SCENE_CONFIG.harmonics.freqB),
      ampB  : asNumber(harmonicsRaw.ampB, DEFAULT_PARALLAX_SCENE_CONFIG.harmonics.ampB),
      freqC : asNumber(harmonicsRaw.freqC, DEFAULT_PARALLAX_SCENE_CONFIG.harmonics.freqC),
      freqD : asNumber(harmonicsRaw.freqD, DEFAULT_PARALLAX_SCENE_CONFIG.harmonics.freqD),
      ampD  : asNumber(harmonicsRaw.ampD, DEFAULT_PARALLAX_SCENE_CONFIG.harmonics.ampD),
    },
    layers : parsedLayers,
  }
}

async function loadSceneConfig() {
  try {
    const response = await fetch(toBaseUrl(props.sceneUrl))
    if (!response.ok) {
      sceneConfig.value = DEFAULT_PARALLAX_SCENE_CONFIG
      return
    }

    const raw = await response.json() as unknown
    const parsed = parseSceneConfig(raw)
    sceneConfig.value = parsed ?? DEFAULT_PARALLAX_SCENE_CONFIG
  } catch {
    sceneConfig.value = DEFAULT_PARALLAX_SCENE_CONFIG
  }
}

function syncReducedMotion() {
  isReducedMotion.value = Boolean(reducedMotionMedia?.matches)
}

function onReducedMotionChange() {
  syncReducedMotion()
  void refreshAssets()
}

async function refreshAssets() {
  const ticket = ++pendingTicket
  const nextBucket = widthBucket.value
  const nextSharpUrl = wallpaperUrlForBucket(nextBucket)
  const nextLayers = resolveSceneLayers(sceneConfig.value, nextBucket)
  const shouldEnableParallax = parallaxEnabled.value
  const previousBucket = activeBucket.value

  const sharpLoaded = await preloadImage(nextSharpUrl)
  if (ticket !== pendingTicket) return

  if (!sharpLoaded) {
    console.warn(
      `[DesktopBackgroundStack] Failed to preload wallpaper for ${nextBucket}px (previous: ${previousBucket ?? 'none'}). Keeping current background.`,
    )
    return
  }

  if (shouldEnableParallax) {
    const visibleLayerUrls = nextLayers
      .filter(layer => layer.visible)
      .map(layer => layer.imageUrl)

    const layerResults = await Promise.all(visibleLayerUrls.map(url => preloadImage(url)))
    if (ticket !== pendingTicket) return

    if (!layerResults.every(Boolean)) {
      console.warn(
        `[DesktopBackgroundStack] Failed to preload parallax layers for ${nextBucket}px (previous: ${previousBucket ?? 'none'}). Keeping current background.`,
      )
      return
    }
  }

  if (ticket !== pendingTicket) return

  activeBucket.value = nextBucket
  activeSharpUrl.value = nextSharpUrl
  activeLayers.value = nextLayers
  sharpReady.value = true
  parallaxReady.value = shouldEnableParallax
}

async function initializeSceneAndAssets() {
  await loadSceneConfig()
  await refreshAssets()
}

async function reloadSceneAndAssets() {
  await loadSceneConfig()
  await refreshAssets()
}

function onResize() {
  const nextBucket = resolveParallaxWidthBucket(window.innerWidth)
  if (nextBucket === widthBucket.value) return

  widthBucket.value = nextBucket
  void refreshAssets()
}

watch(() => props.sceneUrl, async () => {
  await reloadSceneAndAssets()
})

watch(() => props.enabled, () => {
  void refreshAssets()
})

onMounted(async () => {
  reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY)
  reducedMotionMedia.addEventListener('change', onReducedMotionChange)
  syncReducedMotion()

  window.addEventListener('resize', onResize, { passive : true })

  await initializeSceneAndAssets()
})

onUnmounted(() => {
  reducedMotionMedia?.removeEventListener('change', onReducedMotionChange)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="desktop-background-stack" aria-hidden="true">
    <div
      class="desktop-bg-layer desktop-bg-layer--lqip"
      :class="{ 'desktop-bg-layer--hidden': sharpReady }"
    />

    <div
      class="desktop-bg-layer desktop-bg-layer--sharp"
      :class="{ 'desktop-bg-layer--visible': sharpReady }"
      :style="sharpLayerStyle"
    />

    <div
      class="desktop-bg-layer desktop-bg-layer--parallax"
      :class="{ 'desktop-bg-layer--visible': parallaxReady && parallaxEnabled }"
    >
      <DesktopParallaxScene
        :enabled="parallaxEnabled && parallaxReady"
        :scene="sceneConfig"
        :layers="activeLayers"
      />
    </div>
  </div>
</template>
