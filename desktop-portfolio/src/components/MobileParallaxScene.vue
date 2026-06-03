<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { MobileParallaxTarget, ParallaxSceneConfig, ResolvedParallaxLayer } from '../types/parallax'

const props = withDefaults(defineProps<{
  scene : ParallaxSceneConfig
  layers : ResolvedParallaxLayer[]
  enabled? : boolean
  readTarget? : () => MobileParallaxTarget
}>(), {
  enabled : true,
})

interface LayerRuntimeState {
  currentX     : number
  currentY     : number
  currentScale : number
}

const NEUTRAL_TARGET: MobileParallaxTarget = {
  x      : 0,
  y      : 0,
  active : false,
}

const ANCHOR_X_TO_PCT = {
  left   : 0,
  center : 50,
  right  : 100,
} as const

const ANCHOR_Y_TO_PCT = {
  top    : 0,
  center : 50,
  bottom : 100,
} as const

const containerRef = ref<HTMLElement | null>(null)

const layerElementById = new Map<string, HTMLElement>()
const layerRuntimeStateById = new Map<string, LayerRuntimeState>()

let rafId: number | null = null
let startTime = 0
let currentRotX = 0
let currentRotY = 0

const isSceneVisible = computed(() =>
  Boolean(props.enabled && props.layers.some(layer => layer.visible)),
)

const containerStyle = computed<CSSProperties>(() => ({
  perspective : `${props.scene.scene.perspective}px`,
}))

function composeBackgroundPosition(layer: ResolvedParallaxLayer) {
  const xPct = ANCHOR_X_TO_PCT[layer.background.position.anchorX] + layer.background.position.offsetXPct
  const yPct = ANCHOR_Y_TO_PCT[layer.background.position.anchorY] + layer.background.position.offsetYPct
  return `${xPct}% ${yPct}%`
}

function composeBackgroundSize(layer: ResolvedParallaxLayer) {
  if (layer.background.size.mode === 'custom') {
    return `${layer.background.size.widthPct}% ${layer.background.size.heightPct}%`
  }

  return layer.background.size.mode
}

function layerStaticStyle(layer: ResolvedParallaxLayer) {
  return {
    top                              : `${layer.geometry.topPct}%`,
    left                             : `${layer.geometry.leftPct}%`,
    width                            : `${layer.geometry.widthPct}%`,
    height                           : `${layer.geometry.heightPct}%`,
    zIndex                           : `${layer.geometry.zIndex}`,
    backgroundPosition               : composeBackgroundPosition(layer),
    backgroundSize                   : composeBackgroundSize(layer),
    backgroundRepeat                 : `${layer.background.repeat.x} ${layer.background.repeat.y}`,
    backgroundColor                  : layer.background.color,
    backgroundBlendMode              : layer.background.blendMode,
    backgroundOrigin                 : layer.background.origin,
    backgroundClip                   : layer.background.clip,
    display                          : layer.visible ? 'block' : 'none',
    '--parallax-layer-image'         : `url("${layer.imageUrl}")`,
  } as CSSProperties
}

function resetRuntimeState() {
  currentRotX = 0
  currentRotY = 0
  startTime = 0
  layerRuntimeStateById.clear()

  const container = containerRef.value
  if (container) {
    container.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  for (const layer of props.layers) {
    const layerElement = layerElementById.get(layer.id)
    if (!layerElement) continue

    layerElement.style.transform =
      `translate3d(0px, 0px, ${layer.geometry.baseZ}px) scale(${layer.geometry.baseScale})`
  }
}

function ensureLayerRuntime(layer: ResolvedParallaxLayer) {
  const runtime = layerRuntimeStateById.get(layer.id)
  if (runtime) return runtime

  const nextRuntime: LayerRuntimeState = {
    currentX     : 0,
    currentY     : 0,
    currentScale : layer.geometry.baseScale,
  }

  layerRuntimeStateById.set(layer.id, nextRuntime)
  return nextRuntime
}

function readCurrentTarget() {
  return props.readTarget?.() ?? NEUTRAL_TARGET
}

function animate(timestamp: number) {
  if (!props.enabled) {
    stopAnimation()
    return
  }

  const container = containerRef.value
  if (!container) {
    rafId = null
    return
  }

  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const target = readCurrentTarget()
  const targetX = target.x
  const targetY = target.y

  const targetRotX = -targetY * props.scene.scene.maxRot
  const targetRotY = targetX * props.scene.scene.maxRot

  currentRotX += (targetRotX - currentRotX) * props.scene.scene.containerLerp
  currentRotY += (targetRotY - currentRotY) * props.scene.scene.containerLerp

  container.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`

  const dist = Math.sqrt((targetX * targetX) + (targetY * targetY)) / Math.SQRT2

  for (const layer of props.layers) {
    if (!layer.visible) continue

    const layerElement = layerElementById.get(layer.id)
    if (!layerElement) continue

    const runtime = ensureLayerRuntime(layer)

    let floatOffsetX = 0
    let floatOffsetY = 0

    if (layer.motion.floatSpeed > 0) {
      const t = elapsed * layer.motion.floatSpeed
      floatOffsetX =
        (Math.sin(t * props.scene.harmonics.freqA) * layer.motion.floatX) +
        (Math.sin(t * props.scene.harmonics.freqB) * layer.motion.floatX * props.scene.harmonics.ampB)

      floatOffsetY =
        (Math.sin(t * props.scene.harmonics.freqC) * layer.motion.floatY) +
        (Math.cos(t * props.scene.harmonics.freqD) * layer.motion.floatY * props.scene.harmonics.ampD)
    }

    const targetLayerX = (-targetX * layer.motion.moveX) + floatOffsetX
    const targetLayerY = (-targetY * layer.motion.moveY) + floatOffsetY

    runtime.currentX += (targetLayerX - runtime.currentX) * layer.motion.lerp
    runtime.currentY += (targetLayerY - runtime.currentY) * layer.motion.lerp

    const targetScale = layer.geometry.baseScale + (dist * layer.motion.scaleBoost)
    runtime.currentScale += (targetScale - runtime.currentScale) * layer.motion.lerp

    layerElement.style.transform =
      `translate3d(${runtime.currentX}px, ${runtime.currentY}px, ${layer.geometry.baseZ}px) ` +
      `scale(${runtime.currentScale})`
  }

  rafId = window.requestAnimationFrame(animate)
}

function ensureAnimation() {
  if (!props.enabled || rafId !== null || document.hidden) return
  rafId = window.requestAnimationFrame(animate)
}

function stopAnimation() {
  if (rafId === null) return
  window.cancelAnimationFrame(rafId)
  rafId = null
}

function onVisibilityChange() {
  if (document.hidden) {
    stopAnimation()
    return
  }

  ensureAnimation()
}

function setLayerRef(layerId: string, node: Element | ComponentPublicInstance | null) {
  if (!(node instanceof HTMLElement)) {
    layerElementById.delete(layerId)
    return
  }

  layerElementById.set(layerId, node)
}

watch(() => props.enabled, (enabled) => {
  if (!enabled) {
    stopAnimation()
    return
  }

  ensureAnimation()
}, { immediate : true })

watch(() => props.layers, () => {
  resetRuntimeState()
  ensureAnimation()
})

watch(() => props.scene, () => {
  resetRuntimeState()
  ensureAnimation()
})

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
  ensureAnimation()
})

onUnmounted(() => {
  stopAnimation()
  document.removeEventListener('visibilitychange', onVisibilityChange)
  layerElementById.clear()
  layerRuntimeStateById.clear()
})
</script>

<template>
  <div
    class="mobile-parallax-scene"
    :class="{ 'mobile-parallax-scene--ready': isSceneVisible }"
    aria-hidden="true"
  >
    <div ref="containerRef" class="mobile-parallax-container" :style="containerStyle">
      <div
        v-for="layer in props.layers"
        :key="layer.id"
        :ref="(node) => setLayerRef(layer.id, node)"
        class="mobile-parallax-layer"
        :style="layerStaticStyle(layer)"
      />
    </div>
  </div>
</template>
