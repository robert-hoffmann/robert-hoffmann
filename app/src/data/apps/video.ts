import type { MessageCatalog } from '../interface'

// #region Messages
export const videoMessages = {
  'video.previous'   : {
    en : 'Previous',
    fr : 'Précédent',
  },
  'video.next'       : {
    en : 'Next',
    fr : 'Suivant',
  },
  'video.playPause'  : {
    en : 'Play / Pause',
    fr : 'Lecture / Pause',
  },
  'video.stop'       : {
    en : 'Stop',
    fr : 'Arrêter',
  },
  'video.toggleMute' : {
    en : 'Toggle mute',
    fr : 'Activer/désactiver le son',
  },
  'video.volume'     : {
    en : 'Volume',
    fr : 'Volume',
  },
  'video.fullscreen' : {
    en : 'Toggle fullscreen',
    fr : 'Plein écran',
  },
} satisfies MessageCatalog
// #endregion Messages
