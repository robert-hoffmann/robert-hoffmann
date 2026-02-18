import type { InjectionKey } from 'vue'

export interface AboutWallpaperParallaxBridge {
  publish: (normX: number, normY: number) => void
  reset: () => void
}

export const aboutWallpaperParallaxKey: InjectionKey<AboutWallpaperParallaxBridge> =
  Symbol('aboutWallpaperParallax')
