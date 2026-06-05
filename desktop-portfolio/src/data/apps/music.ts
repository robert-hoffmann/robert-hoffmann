import type { MessageCatalog } from '../interface'

// #region Messages
export const musicMessages = {
  'music.seek'        : {
    en : 'Seek',
    fr : 'Rechercher',
  },
  'music.playPause'   : {
    en : 'Play / Pause',
    fr : 'Lecture / Pause',
  },
  'music.disableLoop' : {
    en : 'Disable loop',
    fr : 'Désactiver la boucle',
  },
  'music.enableLoop'  : {
    en : 'Enable loop',
    fr : 'Activer la boucle',
  },
  'music.stop'        : {
    en : 'Stop',
    fr : 'Arrêter',
  },
  'music.volume'      : {
    en : 'Volume',
    fr : 'Volume',
  },
  'music.mute'        : {
    en : 'Mute',
    fr : 'Couper le son',
  },
  'music.unmute'      : {
    en : 'Unmute',
    fr : 'Rétablir le son',
  },
} satisfies MessageCatalog
// #endregion Messages
