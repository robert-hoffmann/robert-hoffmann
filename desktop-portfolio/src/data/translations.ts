/* ============================================================
   UI Translations — Flat key/value map for EN/FR
   ============================================================
   Component-embedded strings (menus, toasts, aria-labels, etc.)
   separated from portfolio content in content.ts.
   ============================================================ */

import type { Localized } from '../types/desktop'

const ui: Record<string, Localized> = {
  /* ---- TopBar menus ---- */
  'topbar.file'              : { en : 'File',               fr : 'Fichier' },
  'topbar.edit'              : { en : 'Edit',               fr : 'Édition' },
  'topbar.view'              : { en : 'View',               fr : 'Affichage' },
  'topbar.help'              : { en : 'Help',               fr : 'Aide' },
  'topbar.openAbout'         : { en : 'Open About',         fr : 'Ouvrir À propos' },
  'topbar.openProjects'      : { en : 'Open Projects',      fr : 'Ouvrir Projets' },
  'topbar.openResume'        : { en : 'Open Resume',        fr : 'Ouvrir CV' },
  'topbar.openGeoWars'       : { en : 'Open GeoWars',       fr : 'Ouvrir GeoWars' },
  'topbar.openMusic'         : { en : 'Open Music',         fr : 'Ouvrir Musique' },
  'topbar.openVideo'         : { en : 'Open Video',         fr : 'Ouvrir Vidéo' },
  'topbar.openTwitter'       : { en : 'Open X (Twitter)',   fr : 'Ouvrir X (Twitter)' },
  'topbar.openLinkedIn'      : { en : 'Open LinkedIn',      fr : 'Ouvrir LinkedIn' },
  'topbar.openGitHub'        : { en : 'Open GitHub',        fr : 'Ouvrir GitHub' },
  'topbar.closeAll'          : { en : 'Close All Windows',  fr : 'Fermer toutes les fenêtres' },
  'topbar.resetDesktop'      : { en : 'Reset Desktop',      fr : 'Réinitialiser le bureau' },
  'topbar.copyPageUrl'       : { en : 'Copy Page URL',      fr : 'Copier l\u2019URL' },
  'topbar.copyShareLink'     : { en : 'Copy Share Link',    fr : 'Copier le lien de partage' },
  'topbar.toggleTheme'       : { en : 'Toggle Theme',       fr : 'Changer le thème' },
  'topbar.tileWindows'       : { en : 'Tile All Windows',   fr : 'Mosaïque de fenêtres' },
  'topbar.cascadeWindows'    : { en : 'Cascade Windows',    fr : 'Fenêtres en cascade' },
  'topbar.minimizeAll'       : { en : 'Minimize All',       fr : 'Tout réduire' },
  'topbar.restoreAll'        : { en : 'Restore All',        fr : 'Tout restaurer' },
  'topbar.aboutSite'         : { en : 'About This Site',    fr : 'À propos de ce site' },
  'topbar.viewSource'        : { en : 'View Source on GitHub', fr : 'Voir le code source sur GitHub' },
  'topbar.desktop'           : { en : 'Desktop',            fr : 'Bureau' },
  'topbar.switchTheme'       : { en : 'Switch to {theme} theme', fr : 'Passer au thème {theme}' },
  'topbar.resetDesktopAria'  : { en : 'Reset desktop',      fr : 'Réinitialiser le bureau' },
  'topbar.toggleLocale'      : { en : 'Switch to French',   fr : 'Passer en anglais' },

  /* ---- Toasts ---- */
  'toast.allWindowsClosed'   : { en : 'All windows closed',                   fr : 'Toutes les fenêtres fermées' },
  'toast.desktopReset'       : { en : 'Desktop reset',                        fr : 'Bureau réinitialisé' },
  'toast.pageUrlCopied'      : { en : 'Page URL copied',                      fr : 'URL de la page copiée' },
  'toast.copyFailed'         : { en : 'Copy failed — use browser address bar', fr : 'Échec de la copie — utilisez la barre d\u2019adresse' },
  'toast.shareLinkCopied'    : { en : 'Share link copied',                    fr : 'Lien de partage copié' },
  'toast.copyFailedShort'    : { en : 'Copy failed',                          fr : 'Échec de la copie' },
  'toast.tiledWindows'       : { en : 'Tiled {n} windows',                    fr : '{n} fenêtres en mosaïque' },
  'toast.cascaded'           : { en : 'Windows cascaded',                     fr : 'Fenêtres en cascade' },
  'toast.minimizedAll'       : { en : 'All windows minimized',                fr : 'Toutes les fenêtres réduites' },
  'toast.restoredAll'        : { en : 'All windows restored',                 fr : 'Toutes les fenêtres restaurées' },
  'toast.aboutSite'          : { en : 'Desktop Portfolio — a macOS-inspired static portfolio by Robert Hoffmann',
                                 fr : 'Desktop Portfolio — un portfolio statique inspiré de macOS par Robert Hoffmann' },
  'toast.switchedTheme'      : { en : 'Switched to {theme} theme',            fr : 'Thème {theme} activé' },
  'toast.switchedLocale'     : { en : 'Switched to English',                  fr : 'Passé en français' },

  /* ---- Window controls ---- */
  'window.controls'          : { en : 'Window controls',    fr : 'Contrôles de fenêtre' },
  'window.close'             : { en : 'Close window',       fr : 'Fermer la fenêtre' },
  'window.minimize'          : { en : 'Minimize window',    fr : 'Réduire la fenêtre' },
  'window.restore'           : { en : 'Restore window',     fr : 'Restaurer la fenêtre' },

  /* ---- Desktop / Dock ---- */
  'desktop.area'             : { en : 'Desktop area',       fr : 'Zone de bureau' },
  'desktop.srTitle'          : { en : 'Robert Hoffmann — Full-Stack Engineer & Consultant',
                                 fr : 'Robert Hoffmann — Ingénieur Full-Stack & Consultant' },
  'dock.label'               : { en : 'Dock',               fr : 'Dock' },
  'dock.launch'              : { en : 'Launch {title}',     fr : 'Lancer {title}' },
  'dock.toggle'              : { en : 'Toggle {title}',     fr : 'Basculer {title}' },
  'dock.trash'               : { en : 'Trash',              fr : 'Corbeille' },

  /* ---- Desktop icon types ---- */
  'iconType.file'            : { en : 'file',               fr : 'fichier' },
  'iconType.folder'          : { en : 'folder',             fr : 'dossier' },
  'iconType.app'             : { en : 'app',                fr : 'application' },
  'iconType.link'            : { en : 'link',               fr : 'lien' },

  /* ---- GeoWars ---- */
  'geowars.score'            : { en : 'Score:',             fr : 'Score :' },
  'geowars.wave'             : { en : 'Wave:',              fr : 'Vague :' },
  'geowars.lives'            : { en : 'Lives:',             fr : 'Vies :' },
  'geowars.resume'           : { en : '▶ Resume',           fr : '▶ Reprendre' },
  'geowars.pause'            : { en : '⏸ Pause',            fr : '⏸ Pause' },
  'geowars.restart'          : { en : '↻ Restart',          fr : '↻ Recommencer' },

  /* ---- Music player ---- */
  'music.seek'               : { en : 'Seek',               fr : 'Rechercher' },
  'music.disableLoop'        : { en : 'Disable loop',       fr : 'Désactiver la boucle' },
  'music.enableLoop'         : { en : 'Enable loop',        fr : 'Activer la boucle' },
  'music.stop'               : { en : 'Stop',               fr : 'Arrêter' },

  /* ---- Video player ---- */
  'video.playPause'          : { en : 'Play / Pause',       fr : 'Lecture / Pause' },
  'video.stop'               : { en : 'Stop',               fr : 'Arrêter' },
  'video.toggleMute'         : { en : 'Toggle mute',        fr : 'Activer/désactiver le son' },
  'video.volume'             : { en : 'Volume',             fr : 'Volume' },
  'video.fullscreen'         : { en : 'Toggle fullscreen',  fr : 'Plein écran' },

  /* ---- About section ---- */
  'about.certifications'     : { en : 'Certifications',     fr : 'Certifications' },

  /* ---- Theme names (for interpolation) ---- */
  'theme.dark'               : { en : 'dark',               fr : 'sombre' },
  'theme.light'              : { en : 'light',              fr : 'clair' },
} as const

export default ui
