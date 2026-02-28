import type { MediaPresetConfig } from '../types/media'
import { VIDEO_POSTER_SOURCES } from './videoPosterSources'

const baseUrl = import.meta.env.BASE_URL

const MOBILE_SHARED_LAYOUT = {
  showMetadata      : true,
  showVolumePercent : true,
} as const

const MUSIC_LAYOUT = {
  ...MOBILE_SHARED_LAYOUT,
  visualSurface : 'artwork',
  showEq        : true,
} as const

const VIDEO_LAYOUT = {
  ...MOBILE_SHARED_LAYOUT,
  visualSurface : 'video',
  showEq        : false,
} as const

export const MEDIA_PLAYER_PRESETS = {
  music : {
    metadata : {
      title      : 'Rockstar',
      subtitle   : 'Post Malone ft. 21 Savage',
      artworkSrc : `${baseUrl}rockstar-cover_1000x1000.jpg`,
      artworkAlt : 'Rockstar album artwork placeholder',
    },
    layout : MUSIC_LAYOUT,
  },
  video : {
    metadata : {
      title       : 'Playlist',
      subtitle    : 'YouTube playlist',
      artworkAlt  : '',
      videoPoster : VIDEO_POSTER_SOURCES,
    },
    layout : VIDEO_LAYOUT,
  },
} as const satisfies Record<'music' | 'video', MediaPresetConfig>
