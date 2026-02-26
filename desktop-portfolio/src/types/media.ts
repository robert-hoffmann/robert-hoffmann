import type { Ref, ShallowRef } from 'vue'

export type MediaPreset = 'music' | 'video'

export type MediaVisualSurface = 'artwork' | 'video'

export interface MediaTransportState {
  ready    : boolean
  playing  : boolean
  paused   : boolean
  loop     : boolean
  elapsed  : number
  duration : number
  volume   : number
  muted    : boolean
}

export interface MediaTransportCapabilities {
  canPlayPause   : boolean
  canSeek        : boolean
  canToggleLoop  : boolean
  canSkipPrevious: boolean
  canSkipNext    : boolean
  canAdjustVolume: boolean
  canToggleMute  : boolean
}

export interface MediaTransportActions {
  playPause   : () => void
  seekToRatio : (ratio: number) => void
  setVolume   : (volume: number) => void
  toggleMute  : () => void
  toggleLoop? : () => void
  previous?   : () => void
  next?       : () => void
}

export interface MediaPosterSources {
  avif? : string
  webp? : string
}

export interface MediaPresetMetadata {
  title      : string
  subtitle   : string
  artworkSrc?: string
  artworkAlt : string
  videoPoster?: MediaPosterSources
}

export interface MediaLayoutConfig {
  visualSurface    : MediaVisualSurface
  showEq           : boolean
  showMetadata     : boolean
  showVolumePercent: boolean
}

export interface MediaPresetConfig {
  metadata : MediaPresetMetadata
  layout   : MediaLayoutConfig
}

export interface MediaTransportBase {
  kind         : 'audio' | 'video'
  state        : MediaTransportState
  capabilities : MediaTransportCapabilities
  actions      : MediaTransportActions
}

export interface AudioMediaTransport extends MediaTransportBase {
  kind      : 'audio'
  sourceUrl : string
  audioRef  : Ref<HTMLAudioElement | null>
  eqBars    : ShallowRef<number[]>
  onAudioPlay         : () => void
  onAudioPause        : () => void
  onAudioEnded        : () => void
  onAudioDurationChange: () => void
  onAudioTimeUpdate   : () => void
}

export interface VideoMediaTransport extends MediaTransportBase {
  kind         : 'video'
  wrapperRef   : Ref<HTMLDivElement | null>
  containerRef : Ref<HTMLDivElement | null>
  showFacade   : Ref<boolean>
  poster       : MediaPosterSources
  bootstrapPlayer     : (autoplay?: boolean) => Promise<void>
  onOverlayPointerDown: () => void
}

export type UnifiedMediaTransport = AudioMediaTransport | VideoMediaTransport
