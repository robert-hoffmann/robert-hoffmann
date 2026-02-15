/* ============================================================
   YouTube IFrame Player API — Ambient Type Declarations
   ============================================================
   Minimal subset used by VideoApp.vue.
   Full reference: https://developers.google.com/youtube/iframe_api_reference
   ============================================================ */

interface Window {
  YT?: typeof YT
  onYouTubeIframeAPIReady?: (() => void) | null
}

declare namespace YT {
  const PlayerState: {
    UNSTARTED : -1
    ENDED     :  0
    PLAYING   :  1
    PAUSED    :  2
    BUFFERING :  3
    CUED      :  5
  }

  interface PlayerEvent {
    target : Player
  }

  interface OnStateChangeEvent {
    data   : number
    target : Player
  }

  interface PlayerOptions {
    videoId?    : string
    host?       : string
    width?      : string | number
    height?     : string | number
    playerVars? : Record<string, string | number>
    events?     : {
      onReady?       : (e: PlayerEvent) => void
      onStateChange? : (e: OnStateChangeEvent) => void
      onError?       : (e: { data: number }) => void
    }
  }

  class Player {
    constructor(el: string | HTMLElement, opts: PlayerOptions)
    playVideo()                       : void
    pauseVideo()                      : void
    stopVideo()                       : void
    seekTo(seconds: number, allowSeekAhead: boolean) : void
    mute()                            : void
    unMute()                          : void
    isMuted()                         : boolean
    setVolume(vol: number)            : void
    getVolume()                       : number
    getCurrentTime()                  : number
    getDuration()                     : number
    getPlayerState()                  : number
    destroy()                         : void
  }
}
