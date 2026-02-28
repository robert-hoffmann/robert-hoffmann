<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, ref } from 'vue'
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { ParallaxSceneConfig, ResolvedParallaxLayer } from '../types/parallax'

const props = withDefaults(defineProps<{
  scene : ParallaxSceneConfig
  layers : ResolvedParallaxLayer[]
  enabled? : boolean
}>(), {
  enabled : true,
})

interface LayerRuntimeState {
  currentX     : number
  currentY     : number
  currentScale : number
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
let viewportWidth = Math.max(typeof window !== 'undefined' ? window.innerWidth : 1280, 1)
let viewportHeight = Math.max(typeof window !== 'undefined' ? window.innerHeight : 720, 1)
let startTime = 0
let targetX = 0
let targetY = 0
let currentRotX = 0
let currentRotY = 0

const isSceneVisible = computed(() =>
  Boolean(props.enabled && props.layers.some(layer => layer.visible)),
)

const containerStyle = computed<CSSProperties>(() => ({
  perspective : `${props.scene.scene.perspective}px`,
}))

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

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
  targetX = 0
  targetY = 0
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

function updateTargetFromCursor(clientX: number, clientY: number) {
  targetX = clamp(((clientX / viewportWidth) - 0.5) * 2, -1, 1)
  targetY = clamp(((clientY / viewportHeight) - 0.5) * 2, -1, 1)
}

function onPointerMove(event: PointerEvent) {
  updateTargetFromCursor(event.clientX, event.clientY)
}

function onMouseMove(event: MouseEvent) {
  updateTargetFromCursor(event.clientX, event.clientY)
}

function onPointerLeave() {
  targetX = 0
  targetY = 0
}

function onResize() {
  viewportWidth = Math.max(window.innerWidth, 1)
  viewportHeight = Math.max(window.innerHeight, 1)
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
    resetRuntimeState()
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
  viewportWidth = Math.max(window.innerWidth, 1)
  viewportHeight = Math.max(window.innerHeight, 1)

  window.addEventListener('pointermove', onPointerMove, { passive : true })
  window.addEventListener('mousemove', onMouseMove, { passive : true })
  window.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('blur', onPointerLeave)
  window.addEventListener('resize', onResize, { passive : true })
  document.addEventListener('visibilitychange', onVisibilityChange)

  ensureAnimation()
})

onUnmounted(() => {
  stopAnimation()

  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('blur', onPointerLeave)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibilityChange)

  layerElementById.clear()
  layerRuntimeStateById.clear()
})
</script>

<template>
  <div
    class="desktop-parallax-scene"
    :class="{ 'desktop-parallax-scene--ready': isSceneVisible }"
    aria-hidden="true"
  >
    <div ref="containerRef" class="desktop-parallax-container" :style="containerStyle">
      <div
        v-for="layer in props.layers"
        :key="layer.id"
        :ref="(node) => setLayerRef(layer.id, node)"
        class="desktop-parallax-layer"
        :style="layerStaticStyle(layer)"
      />
    </div>
  </div>
</template>
