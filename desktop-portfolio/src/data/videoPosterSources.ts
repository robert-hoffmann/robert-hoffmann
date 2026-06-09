import type { MediaPosterSources } from '../types/media'
import { publicAssetUrl } from '../utils/publicAssets'

const VIDEO_POSTER_VARIANTS = [
  { suffix : '-640', width : 640 },
  { suffix : '-960', width : 960 },
  { suffix : '',     width : 1280 },
] as const

function buildVideoPosterSrcset(format: 'avif' | 'webp') {
  return VIDEO_POSTER_VARIANTS
    .map(({ suffix, width }) => `${publicAssetUrl(`video-poster${suffix}.${format}`)} ${width}w`)
    .join(', ')
}

/* Match desktop windowed usage while still scaling correctly on mobile. */
export const VIDEO_POSTER_SIZES = '(max-width: 767px) 92vw, (max-width: 1366px) 60vw, 960px'

export const VIDEO_POSTER_AVIF_SRCSET = buildVideoPosterSrcset('avif')
export const VIDEO_POSTER_WEBP_SRCSET = buildVideoPosterSrcset('webp')

export const VIDEO_POSTER_SOURCES = {
  avif       : publicAssetUrl('video-poster-960.avif'),
  webp       : publicAssetUrl('video-poster-960.webp'),
  avifSrcset : VIDEO_POSTER_AVIF_SRCSET,
  webpSrcset : VIDEO_POSTER_WEBP_SRCSET,
  sizes      : VIDEO_POSTER_SIZES,
} as const satisfies MediaPosterSources
