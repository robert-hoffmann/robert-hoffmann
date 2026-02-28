export type BackgroundAnchorX = 'left' | 'center' | 'right'
export type BackgroundAnchorY = 'top' | 'center' | 'bottom'
export type BackgroundSizeMode = 'cover' | 'contain' | 'custom'
export type ParallaxWidthBucket = 1280 | 1920 | 2560

export interface SceneConfig {
  maxRot                  : number
  containerLerp           : number
  perspective             : number
  documentBackgroundColor : string
}

export interface HarmonicsConfig {
  freqA : number
  freqB : number
  ampB  : number
  freqC : number
  freqD : number
  ampD  : number
}

export interface LayerGeometryConfig {
  topPct    : number
  leftPct   : number
  widthPct  : number
  heightPct : number
  zIndex    : number
  baseZ     : number
  baseScale : number
}

export interface LayerBackgroundConfig {
  position : {
    anchorX    : BackgroundAnchorX
    anchorY    : BackgroundAnchorY
    offsetXPct : number
    offsetYPct : number
  }
  size : {
    mode      : BackgroundSizeMode
    widthPct  : number
    heightPct : number
  }
  repeat : {
    x : string
    y : string
  }
  color     : string
  blendMode : string
  origin    : string
  clip      : string
}

export interface LayerMotionConfig {
  lerp       : number
  scaleBoost : number
  moveX      : number
  moveY      : number
  floatX     : number
  floatY     : number
  floatSpeed : number
}

export interface ParallaxLayerConfig {
  id         : string
  presetKey  : string
  name       : string
  imageSrc   : string
  visible    : boolean
  geometry   : LayerGeometryConfig
  background : LayerBackgroundConfig
  motion     : LayerMotionConfig
}

export interface ParallaxSceneConfig {
  scene     : SceneConfig
  harmonics : HarmonicsConfig
  layers    : ParallaxLayerConfig[]
}

export interface ResolvedParallaxLayer extends ParallaxLayerConfig {
  imageUrl : string
  bucket   : ParallaxWidthBucket
}

export const DESKTOP_PARALLAX_WIDTH_BUCKETS = [1280, 1920, 2560] as const

export function resolveParallaxWidthBucket(viewportWidth: number): ParallaxWidthBucket {
  if (viewportWidth >= 1921) return 2560
  if (viewportWidth >= 1281) return 1920
  return 1280
}

export const DEFAULT_PARALLAX_SCENE_CONFIG: ParallaxSceneConfig = {
  scene : {
    maxRot                  : 2,
    containerLerp           : 0.05,
    perspective             : 800,
    documentBackgroundColor : '#000000',
  },
  harmonics : {
    freqA : 1,
    freqB : 0.7,
    ampB  : 0.3,
    freqC : 0.8,
    freqD : 0.5,
    ampD  : 0.4,
  },
  layers : [
    {
      id        : 'layer-bg',
      presetKey : 'layer-bg',
      name      : 'Background',
      imageSrc  : 'media/background.png',
      visible   : true,
      geometry  : {
        topPct    : -5,
        leftPct   : -5,
        widthPct  : 110,
        heightPct : 110,
        zIndex    : 1,
        baseZ     : -100,
        baseScale : 1.125,
      },
      background : {
        position : {
          anchorX    : 'center',
          anchorY    : 'center',
          offsetXPct : 0,
          offsetYPct : 0,
        },
        size : {
          mode      : 'cover',
          widthPct  : 100,
          heightPct : 100,
        },
        repeat : {
          x : 'no-repeat',
          y : 'no-repeat',
        },
        color     : '#00000000',
        blendMode : 'normal',
        origin    : 'padding-box',
        clip      : 'border-box',
      },
      motion : {
        lerp       : 0.025,
        scaleBoost : 0.005,
        moveX      : 12,
        moveY      : 8,
        floatX     : 3,
        floatY     : 1.5,
        floatSpeed : 0.00008,
      },
    },
    {
      id        : 'layer-mid',
      presetKey : 'layer-mid',
      name      : 'Middle',
      imageSrc  : 'media/middle.png',
      visible   : true,
      geometry  : {
        topPct    : -6,
        leftPct   : -6,
        widthPct  : 112,
        heightPct : 112,
        zIndex    : 2,
        baseZ     : -40,
        baseScale : 1.05,
      },
      background : {
        position : {
          anchorX    : 'center',
          anchorY    : 'center',
          offsetXPct : 0,
          offsetYPct : 0,
        },
        size : {
          mode      : 'cover',
          widthPct  : 100,
          heightPct : 100,
        },
        repeat : {
          x : 'no-repeat',
          y : 'no-repeat',
        },
        color     : '#00000000',
        blendMode : 'normal',
        origin    : 'padding-box',
        clip      : 'border-box',
      },
      motion : {
        lerp       : 0.005,
        scaleBoost : 0.1,
        moveX      : 14,
        moveY      : 10,
        floatX     : 20,
        floatY     : 20,
        floatSpeed : 0.0004,
      },
    },
    {
      id        : 'layer-fg',
      presetKey : 'layer-fg',
      name      : 'Foreground',
      imageSrc  : 'media/foreground.png',
      visible   : true,
      geometry  : {
        topPct    : -12,
        leftPct   : -12,
        widthPct  : 124,
        heightPct : 124,
        zIndex    : 4,
        baseZ     : 10,
        baseScale : 0.9875,
      },
      background : {
        position : {
          anchorX    : 'center',
          anchorY    : 'center',
          offsetXPct : 0,
          offsetYPct : 0,
        },
        size : {
          mode      : 'cover',
          widthPct  : 100,
          heightPct : 100,
        },
        repeat : {
          x : 'no-repeat',
          y : 'no-repeat',
        },
        color     : '#00000000',
        blendMode : 'normal',
        origin    : 'padding-box',
        clip      : 'border-box',
      },
      motion : {
        lerp       : 0.03,
        scaleBoost : 0.004,
        moveX      : 30,
        moveY      : 18,
        floatX     : 0,
        floatY     : 0,
        floatSpeed : 0,
      },
    },
  ],
}
