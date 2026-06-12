import type { Localized } from '../../types/desktop'
import type { MessageCatalog } from '../interface'

// #region Messages
export const geoWarsMessages = {
  'geowars.score'        : {
    en : 'Score:',
    fr : 'Score :',
  },
  'geowars.wave'         : {
    en : 'Wave:',
    fr : 'Vague :',
  },
  'geowars.lives'        : {
    en : 'Lives:',
    fr : 'Vies :',
  },
  'geowars.resume'       : {
    en : '▶ Resume',
    fr : '▶ Reprendre',
  },
  'geowars.pause'        : {
    en : '⏸ Pause',
    fr : '⏸ Pause',
  },
  'geowars.restart'      : {
    en : '↻ Restart',
    fr : '↻ Recommencer',
  },
  'geowars.startCta'     : {
    en : 'Click to fire / start',
    fr : 'Cliquer pour tirer / démarrer',
  },
  'geowars.introTitle'   : {
    en : 'Ready, Pilot?',
    fr : 'Prêt, pilote ?',
  },
  'geowars.controlsHint' : {
    en : 'Mouse to steer (distance = thrust) · Click to fire · Space to pause.',
    fr : 'Souris pour diriger (distance = poussée) · Clic pour tirer · Espace pour pause.',
  },
  'geowars.gameOver'     : {
    en : 'Game Over',
    fr : 'Partie terminée',
  },
  'geowars.finalScore'   : {
    en : 'Final score:',
    fr : 'Score final :',
  },
  'geowars.pausedLabel'  : {
    en : 'Paused',
    fr : 'En pause',
  },
} satisfies MessageCatalog
// #endregion Messages

// #region Content
export const easterEgg = {
  title : {
    en : '🎮 GeoWars',
    fr : '🎮 GeoWars',
  } satisfies Localized,
  body  : {
    en : 'Mouse to steer (distance = thrust) · Click to fire · Space to pause.',
    fr : 'Souris pour diriger (distance = poussée) · Clic pour tirer · Espace pour pause.',
  } satisfies Localized,
} as const
// #endregion Content
