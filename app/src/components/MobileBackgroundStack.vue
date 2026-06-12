<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { CSSProperties } from 'vue'
import type { MobileBackgroundWidthBucket } from '../types/parallax'
import { resolveMobileBackgroundWidthBucket } from '../types/parallax'
import { publicAssetUrl } from '../utils/publicAssets'

const LQIP_HIDE_OVERLAP_MS = 180

const activeBucket = ref<MobileBackgroundWidthBucket | null>(null)
const activeWallpaperUrl = ref<string | null>(null)
const wallpaperReady = ref(false)
const lqipHidden = ref(false)

const widthBucket = ref<MobileBackgroundWidthBucket>(
  resolveMobileBackgroundWidthBucket(
    typeof window !== 'undefined' ? window.innerWidth : 390,
    typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  ),
)

let pendingTicket = 0
let lqipHideTimer: number | null = null

const wallpaperLayerStyle = computed<CSSProperties>(() => ({
  '--mobile-wallpaper-image' : activeWallpaperUrl.value ? `url("${activeWallpaperUrl.value}")` : 'none',
}))

function wallpaperImageUrlForBucket(width: MobileBackgroundWidthBucket) {
  return publicAssetUrl(`parallax/mobile/wallpaper-${width}.webp`)
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

function waitForAnimationFrame() {
  return new Promise<void>((resolve) => {
    if (document.hidden) {
      window.setTimeout(resolve, 16)
      return
    }

    window.requestAnimationFrame(() => resolve())
  })
}

async function waitForLayerPaint() {
  await nextTick()
  await waitForAnimationFrame()
  await waitForAnimationFrame()
}

async function refreshWallpaper() {
  const ticket = ++pendingTicket
  const nextBucket = widthBucket.value
  const nextWallpaperUrl = wallpaperImageUrlForBucket(nextBucket)
  const previousBucket = activeBucket.value

  const wallpaperLoaded = await preloadImage(nextWallpaperUrl)
  if (ticket !== pendingTicket) return

  if (!wallpaperLoaded) {
    console.warn(
      `[MobileBackgroundStack] Failed to preload mobile wallpaper for ${nextBucket}px (previous: ${previousBucket ?? 'none'}). Keeping current background.`,
    )
    return
  }

  const isFirstWallpaperReveal = !wallpaperReady.value
  activeBucket.value = nextBucket
  activeWallpaperUrl.value = nextWallpaperUrl
  await waitForLayerPaint()
  if (ticket !== pendingTicket) return

  wallpaperReady.value = true
  if (isFirstWallpaperReveal) {
    scheduleLqipHide()
  }
}

function onResize() {
  const nextBucket = resolveMobileBackgroundWidthBucket(window.innerWidth, window.devicePixelRatio)
  if (nextBucket === widthBucket.value) return

  widthBucket.value = nextBucket
  void refreshWallpaper()
}

onMounted(() => {
  window.addEventListener('resize', onResize, { passive : true })
  void refreshWallpaper()
})

onUnmounted(() => {
  clearLqipHideTimer()
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
      class="mobile-bg-layer mobile-bg-layer--wallpaper"
      :class="{ 'mobile-bg-layer--visible': wallpaperReady }"
      :style="wallpaperLayerStyle"
    />
  </div>
</template>
