<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import MobileParallaxScene from './MobileParallaxScene.vue'
import { useMobileOrientationParallax } from '../composables/useMobileOrientationParallax'
import type {
  BackgroundAnchorX,
  BackgroundAnchorY,
  BackgroundSizeMode,
  MobileParallaxWidthBucket,
  ParallaxSceneConfig,
  ResolvedParallaxLayer,
} from '../types/parallax'
import {
  MOBILE_PARALLAX_SCENE_CONFIG,
  resolveMobileParallaxWidthBucket,
} from '../types/parallax'

const props = withDefaults(defineProps<{
  sceneUrl? : string
  enabled? : boolean
  motionEnabled? : boolean
}>(), {
  sceneUrl      : '/parallax/mobile.scene.json',
  enabled       : true,
  motionEnabled : true,
})

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const LQIP_HIDE_OVERLAP_MS = 180

const orientationControls = useMobileOrientationParallax()
const sceneConfig = ref<ParallaxSceneConfig>(MOBILE_PARALLAX_SCENE_CONFIG)
const activeBucket = ref<MobileParallaxWidthBucket | null>(null)
const activeLayers = ref<ResolvedParallaxLayer[]>([])
const activeSharpUrl = ref<string | null>(null)
const sharpReady = ref(false)
const parallaxReady = ref(false)
const isReducedMotion = ref(false)
const lqipHidden = ref(false)

const widthBucket = ref<MobileParallaxWidthBucket>(
  resolveMobileParallaxWidthBucket(
    typeof window !== 'undefined' ? window.innerWidth : 390,
    typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  ),
)

let reducedMotionMedia: MediaQueryList | null = null
let pendingTicket = 0
let lqipHideTimer: number | null = null
let gestureListenersActive = false
let accessRequested = false

const parallaxEnabled = computed(() =>
  Boolean(props.enabled && !isReducedMotion.value),
)

const orientationEnabled = computed(() =>
  Boolean(parallaxEnabled.value && props.motionEnabled),
)

const sceneMotionEnabled = computed(() =>
  Boolean(orientationEnabled.value && parallaxReady.value),
)

const sharpLayerStyle = computed<CSSProperties>(() => ({
  '--mobile-sharp-image' : activeSharpUrl.value ? `url("${activeSharpUrl.value}")` : 'none',
}))

function toBaseUrl(pathname: string) {
  const trimmed = pathname.trim()
  if (!trimmed) return `${import.meta.env.BASE_URL}parallax/mobile.scene.json`

  const isAbsolute = /^(https?:|data:|blob:)/i.test(trimmed)
  if (isAbsolute) return trimmed

  if (trimmed.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${trimmed.slice(1)}`
  }

  return `${import.meta.env.BASE_URL}${trimmed}`
}

function layerImageUrl(layerId: string, width: MobileParallaxWidthBucket) {
  return `${import.meta.env.BASE_URL}parallax/mobile/${layerId}-${width}.webp`
}

function sharpImageUrlForBucket(width: MobileParallaxWidthBucket) {
  return `${import.meta.env.BASE_URL}parallax/mobile/layer-bg-${width}.webp`
}

function uniqueImageUrls(urls: string[]) {
  return Array.from(new Set(urls))
}

function resolveSceneLayers(
  scene: ParallaxSceneConfig,
  bucket: MobileParallaxWidthBucket,
): ResolvedParallaxLayer[] {
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
    let isSettled = false

    const cleanup = () => {
      loader.removeEventListener('load', onLoad)
      loader.removeEventListener('error', onError)
    }

    const settle = (result: boolean) => {
      if (isSettled) return
      isSettled = true
      cleanup()
      resolve(result)
    }

    const onLoad = () => {
      if (typeof loader.decode !== 'function') {
        settle(true)
        return
      }

      void loader.decode()
        .then(() => settle(true))
        .catch(() => settle(loader.complete && loader.naturalWidth > 0))
    }

    const onError = () => {
      settle(false)
    }

    loader.addEventListener('load', onLoad)
    loader.addEventListener('error', onError)
    loader.src = url

    if (loader.complete && loader.naturalWidth > 0) {
      onLoad()
    }
  })
}

function clearLqipHideTimer() {
  if (lqipHideTimer === null) return
  window.clearTimeout(lqipHideTimer)
  lqipHideTimer = null
}

function scheduleLqipHide() {
  if (lqipHidden.value) return
  clearLqipHideTimer()
  lqipHideTimer = window.setTimeout(() => {
    lqipHideTimer = null
    lqipHidden.value = true
  }, LQIP_HIDE_OVERLAP_MS)
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

      const fallbackLayer = MOBILE_PARALLAX_SCENE_CONFIG.layers[0]
      if (!fallbackLayer) return null
      const defaultLayer = MOBILE_PARALLAX_SCENE_CONFIG.layers[index] ?? fallbackLayer

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
      maxRot                  : asNumber(sceneRaw.maxRot, MOBILE_PARALLAX_SCENE_CONFIG.scene.maxRot),
      containerLerp           : asNumber(sceneRaw.containerLerp, MOBILE_PARALLAX_SCENE_CONFIG.scene.containerLerp),
      perspective             : asNumber(sceneRaw.perspective, MOBILE_PARALLAX_SCENE_CONFIG.scene.perspective),
      documentBackgroundColor : asString(
        sceneRaw.documentBackgroundColor,
        MOBILE_PARALLAX_SCENE_CONFIG.scene.documentBackgroundColor,
      ),
    },
    harmonics : {
      freqA : asNumber(harmonicsRaw.freqA, MOBILE_PARALLAX_SCENE_CONFIG.harmonics.freqA),
      freqB : asNumber(harmonicsRaw.freqB, MOBILE_PARALLAX_SCENE_CONFIG.harmonics.freqB),
      ampB  : asNumber(harmonicsRaw.ampB, MOBILE_PARALLAX_SCENE_CONFIG.harmonics.ampB),
      freqC : asNumber(harmonicsRaw.freqC, MOBILE_PARALLAX_SCENE_CONFIG.harmonics.freqC),
      freqD : asNumber(harmonicsRaw.freqD, MOBILE_PARALLAX_SCENE_CONFIG.harmonics.freqD),
      ampD  : asNumber(harmonicsRaw.ampD, MOBILE_PARALLAX_SCENE_CONFIG.harmonics.ampD),
    },
    layers : parsedLayers,
  }
}

async function loadSceneConfig() {
  try {
    const response = await fetch(toBaseUrl(props.sceneUrl))
    if (!response.ok) {
      sceneConfig.value = MOBILE_PARALLAX_SCENE_CONFIG
      return
    }

    const raw = await response.json() as unknown
    const parsed = parseSceneConfig(raw)
    sceneConfig.value = parsed ?? MOBILE_PARALLAX_SCENE_CONFIG
  } catch {
    sceneConfig.value = MOBILE_PARALLAX_SCENE_CONFIG
  }
}

function syncReducedMotion() {
  isReducedMotion.value = Boolean(reducedMotionMedia?.matches)
}

function removeGestureListeners() {
  if (!gestureListenersActive) return

  window.removeEventListener('click', onFirstGesture, { capture : true })
  window.removeEventListener('touchend', onFirstGesture, { capture : true })
  gestureListenersActive = false
}

function addGestureListeners() {
  if (gestureListenersActive || accessRequested || !orientationEnabled.value) return

  window.addEventListener('click', onFirstGesture, { capture : true, once : true })
  window.addEventListener('touchend', onFirstGesture, {
    capture : true,
    once    : true,
    passive : true,
  })
  gestureListenersActive = true
}

function syncGestureListeners() {
  if (orientationEnabled.value) {
    addGestureListeners()
    return
  }

  removeGestureListeners()
}

async function requestOrientationAccess() {
  if (!orientationEnabled.value) return

  const canUseOrientation = await orientationControls.requestAccessFromUserGesture()
  if (canUseOrientation && sceneMotionEnabled.value) {
    orientationControls.start()
  }
}

function onFirstGesture() {
  if (accessRequested) return

  accessRequested = true
  removeGestureListeners()
  void requestOrientationAccess()
}

function onReducedMotionChange() {
  syncReducedMotion()
  syncGestureListeners()
  void refreshAssets()
}

async function refreshAssets() {
  const ticket = ++pendingTicket
  const nextBucket = widthBucket.value
  const nextSharpUrl = sharpImageUrlForBucket(nextBucket)
  const nextLayers = resolveSceneLayers(sceneConfig.value, nextBucket)
  const shouldEnableParallax = parallaxEnabled.value
  const previousBucket = activeBucket.value

  const sharpLoaded = await preloadImage(nextSharpUrl)
  if (ticket !== pendingTicket) return

  if (!sharpLoaded) {
    console.warn(
      `[MobileBackgroundStack] Failed to preload sharp background layer for ${nextBucket}px (previous: ${previousBucket ?? 'none'}). Keeping current background.`,
    )
    return
  }

  const isFirstSharpReveal = !sharpReady.value
  activeBucket.value = nextBucket
  activeSharpUrl.value = nextSharpUrl
  sharpReady.value = true
  if (isFirstSharpReveal) {
    scheduleLqipHide()
  }
  parallaxReady.value = false

  if (!shouldEnableParallax) {
    activeLayers.value = nextLayers
    return
  }

  const visibleLayerUrls = uniqueImageUrls(
    nextLayers
      .filter(layer => layer.visible)
      .map(layer => layer.imageUrl)
      .filter(url => url !== nextSharpUrl),
  )

  if (visibleLayerUrls.length > 0) {
    const layerResults = await Promise.all(visibleLayerUrls.map(url => preloadImage(url)))
    if (ticket !== pendingTicket) return

    if (!layerResults.every(Boolean)) {
      console.warn(
        `[MobileBackgroundStack] Failed to preload parallax layers for ${nextBucket}px (previous: ${previousBucket ?? 'none'}). Keeping sharp background only.`,
      )
      return
    }
  }

  if (ticket !== pendingTicket) return

  activeLayers.value = nextLayers
  parallaxReady.value = true
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
  const nextBucket = resolveMobileParallaxWidthBucket(window.innerWidth, window.devicePixelRatio)
  orientationControls.resetCalibration()
  if (nextBucket === widthBucket.value) return

  widthBucket.value = nextBucket
  void refreshAssets()
}

watch(() => props.sceneUrl, async () => {
  await reloadSceneAndAssets()
})

watch(() => props.enabled, () => {
  syncGestureListeners()
  void refreshAssets()
})

watch(() => props.motionEnabled, () => {
  syncGestureListeners()
})

watch(sceneMotionEnabled, (enabled) => {
  if (!enabled) {
    orientationControls.stop()
    return
  }

  orientationControls.start()
}, { immediate : true })

onMounted(async () => {
  reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY)
  reducedMotionMedia.addEventListener('change', onReducedMotionChange)
  syncReducedMotion()
  syncGestureListeners()

  window.addEventListener('resize', onResize, { passive : true })

  await initializeSceneAndAssets()
})

onUnmounted(() => {
  clearLqipHideTimer()
  removeGestureListeners()
  orientationControls.stop()
  reducedMotionMedia?.removeEventListener('change', onReducedMotionChange)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="mobile-background-stack" aria-hidden="true">
    <div
      class="mobile-bg-layer mobile-bg-layer--lqip"
      :class="{ 'mobile-bg-layer--hidden': lqipHidden }"
    />

    <div
      class="mobile-bg-layer mobile-bg-layer--sharp"
      :class="{ 'mobile-bg-layer--visible': sharpReady }"
      :style="sharpLayerStyle"
    />

    <div
      class="mobile-bg-layer mobile-bg-layer--parallax"
      :class="{ 'mobile-bg-layer--visible': parallaxReady && parallaxEnabled }"
    >
      <MobileParallaxScene
        :enabled="sceneMotionEnabled"
        :scene="sceneConfig"
        :layers="activeLayers"
        :read-target="orientationControls.readTarget"
      />
    </div>
  </div>
</template>
