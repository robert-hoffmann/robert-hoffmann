import type { Locale, Localized } from '../types/desktop'

export type MessageCatalog = Record<string, Localized>
export type MessageParams = Record<string, string | number>

// #region Messages
export const interfaceMessages = {
  'topbar.file'                       : {
    en : 'File',
    fr : 'Fichier',
  },
  'topbar.edit'                       : {
    en : 'Edit',
    fr : 'Édition',
  },
  'topbar.view'                       : {
    en : 'View',
    fr : 'Affichage',
  },
  'topbar.help'                       : {
    en : 'Help',
    fr : 'Aide',
  },
  'topbar.openAbout'                  : {
    en : 'Open About',
    fr : 'Ouvrir À propos',
  },
  'topbar.openProjects'               : {
    en : 'Open Project Highlights',
    fr : 'Ouvrir Projets marquants',
  },
  'topbar.openGallery'                : {
    en : 'Open Project Gallery',
    fr : 'Ouvrir Galerie projets',
  },
  'topbar.openResume'                 : {
    en : 'Open Resume',
    fr : 'Ouvrir CV',
  },
  'topbar.openGeoWars'                : {
    en : 'Open GeoWars',
    fr : 'Ouvrir GeoWars',
  },
  'topbar.openMusic'                  : {
    en : 'Open Music',
    fr : 'Ouvrir Musique',
  },
  'topbar.openVideo'                  : {
    en : 'Open Video',
    fr : 'Ouvrir Vidéo',
  },
  'topbar.openTerminal'               : {
    en : 'Open Terminal',
    fr : 'Ouvrir Terminal',
  },
  'topbar.openTwitter'                : {
    en : 'Open X (Twitter)',
    fr : 'Ouvrir X (Twitter)',
  },
  'topbar.openLinkedIn'               : {
    en : 'Open LinkedIn',
    fr : 'Ouvrir LinkedIn',
  },
  'topbar.openGitHub'                 : {
    en : 'Open GitHub',
    fr : 'Ouvrir GitHub',
  },
  'topbar.closeAll'                   : {
    en : 'Close All Windows',
    fr : 'Fermer toutes les fenêtres',
  },
  'topbar.resetDesktop'               : {
    en : 'Reset Desktop',
    fr : 'Réinitialiser le bureau',
  },
  'topbar.copyPageUrl'                : {
    en : 'Copy Page URL',
    fr : 'Copier l’URL',
  },
  'topbar.toggleTheme'                : {
    en : 'Toggle Theme',
    fr : 'Changer le thème',
  },
  'topbar.tileWindows'                : {
    en : 'Tile All Windows',
    fr : 'Mosaïque de fenêtres',
  },
  'topbar.cascadeWindows'             : {
    en : 'Cascade Windows',
    fr : 'Fenêtres en cascade',
  },
  'topbar.minimizeAll'                : {
    en : 'Minimize All',
    fr : 'Tout réduire',
  },
  'topbar.restoreAll'                 : {
    en : 'Restore All',
    fr : 'Tout restaurer',
  },
  'topbar.aboutSite'                  : {
    en : 'About This Site',
    fr : 'À propos de ce site',
  },
  'topbar.viewSource'                 : {
    en : 'View Source on GitHub',
    fr : 'Voir le code source sur GitHub',
  },
  'cvDownload.label'                  : {
    en : 'Download Resume/CV',
    fr : 'Télécharger le CV',
  },
  'topbar.desktop'                    : {
    en : 'Desktop',
    fr : 'Bureau',
  },
  'topbar.switchTheme'                : {
    en : 'Switch to {theme} theme',
    fr : 'Passer au thème {theme}',
  },
  'topbar.resetDesktopAria'           : {
    en : 'Reset desktop',
    fr : 'Réinitialiser le bureau',
  },
  'topbar.toggleFullscreen'           : {
    en : 'Toggle fullscreen',
    fr : 'Basculer le plein écran',
  },
  'topbar.toggleLocale'               : {
    en : 'Switch to French',
    fr : 'Passer en anglais',
  },
  'calendar.month.0'                  : {
    en : 'January',
    fr : 'Janvier',
  },
  'calendar.month.1'                  : {
    en : 'February',
    fr : 'Février',
  },
  'calendar.month.2'                  : {
    en : 'March',
    fr : 'Mars',
  },
  'calendar.month.3'                  : {
    en : 'April',
    fr : 'Avril',
  },
  'calendar.month.4'                  : {
    en : 'May',
    fr : 'Mai',
  },
  'calendar.month.5'                  : {
    en : 'June',
    fr : 'Juin',
  },
  'calendar.month.6'                  : {
    en : 'July',
    fr : 'Juillet',
  },
  'calendar.month.7'                  : {
    en : 'August',
    fr : 'Août',
  },
  'calendar.month.8'                  : {
    en : 'September',
    fr : 'Septembre',
  },
  'calendar.month.9'                  : {
    en : 'October',
    fr : 'Octobre',
  },
  'calendar.month.10'                 : {
    en : 'November',
    fr : 'Novembre',
  },
  'calendar.month.11'                 : {
    en : 'December',
    fr : 'Décembre',
  },
  'calendar.day.0'                    : {
    en : 'Su',
    fr : 'Di',
  },
  'calendar.day.1'                    : {
    en : 'Mo',
    fr : 'Lu',
  },
  'calendar.day.2'                    : {
    en : 'Tu',
    fr : 'Ma',
  },
  'calendar.day.3'                    : {
    en : 'We',
    fr : 'Me',
  },
  'calendar.day.4'                    : {
    en : 'Th',
    fr : 'Je',
  },
  'calendar.day.5'                    : {
    en : 'Fr',
    fr : 'Ve',
  },
  'calendar.day.6'                    : {
    en : 'Sa',
    fr : 'Sa',
  },
  'toast.allWindowsClosed'            : {
    en : 'All windows closed',
    fr : 'Toutes les fenêtres fermées',
  },
  'toast.desktopReset'                : {
    en : 'Desktop reset',
    fr : 'Bureau réinitialisé',
  },
  'toast.pageUrlCopied'               : {
    en : 'Page URL copied',
    fr : 'URL de la page copiée',
  },
  'toast.copyFailed'                  : {
    en : 'Copy failed - use browser address bar',
    fr : 'Échec de la copie - utilisez la barre d’adresse',
  },
  'toast.tiledWindows'                : {
    en : 'Tiled {n} windows',
    fr : '{n} fenêtres en mosaïque',
  },
  'toast.cascaded'                    : {
    en : 'Windows cascaded',
    fr : 'Fenêtres en cascade',
  },
  'toast.minimizedAll'                : {
    en : 'All windows minimized',
    fr : 'Toutes les fenêtres réduites',
  },
  'toast.restoredAll'                 : {
    en : 'All windows restored',
    fr : 'Toutes les fenêtres restaurées',
  },
  'toast.aboutSite'                   : {
    en : 'Desktop Portfolio - a macOS-inspired static portfolio by Robert Hoffmann',
    fr : 'Desktop Portfolio - un portfolio statique inspiré de macOS par Robert Hoffmann',
  },
  'toast.switchedTheme'               : {
    en : 'Switched to {theme} theme',
    fr : 'Thème {theme} activé',
  },
  'toast.switchedLocale'              : {
    en : 'Switched to English',
    fr : 'Passé en français',
  },
  'window.controls'                   : {
    en : 'Window controls',
    fr : 'Contrôles de fenêtre',
  },
  'window.close'                      : {
    en : 'Close window',
    fr : 'Fermer la fenêtre',
  },
  'window.minimize'                   : {
    en : 'Minimize window',
    fr : 'Réduire la fenêtre',
  },
  'window.maximize'                   : {
    en : 'Maximize window',
    fr : 'Agrandir la fenêtre',
  },
  'window.restore'                    : {
    en : 'Restore window',
    fr : 'Restaurer la fenêtre',
  },
  'desktop.area'                      : {
    en : 'Desktop area',
    fr : 'Zone de bureau',
  },
  'desktop.srTitle'                   : {
    en : 'Robert Hoffmann - Industrial Full-Stack Consultant',
    fr : 'Robert Hoffmann - Consultant Full-Stack industriel',
  },
  'dock.label'                        : {
    en : 'Dock',
    fr : 'Dock',
  },
  'dock.launch'                       : {
    en : 'Launch {title}',
    fr : 'Lancer {title}',
  },
  'dock.toggle'                       : {
    en : 'Toggle {title}',
    fr : 'Basculer {title}',
  },
  'dock.trash'                        : {
    en : 'Trash',
    fr : 'Corbeille',
  },
  'iconType.file'                     : {
    en : 'file',
    fr : 'fichier',
  },
  'iconType.folder'                   : {
    en : 'folder',
    fr : 'dossier',
  },
  'iconType.app'                      : {
    en : 'app',
    fr : 'application',
  },
  'iconType.link'                     : {
    en : 'link',
    fr : 'lien',
  },
  'theme.dark'                        : {
    en : 'dark',
    fr : 'sombre',
  },
  'theme.light'                       : {
    en : 'light',
    fr : 'clair',
  },
  'aboutModal.title'                  : {
    en : 'About Desktop Portfolio',
    fr : 'À propos de Desktop Portfolio',
  },
  'aboutModal.version'                : {
    en : 'Version 1.0',
    fr : 'Version 1.0',
  },
  'aboutModal.description'            : {
    en : 'A macOS-inspired interactive portfolio built with Vue, TypeScript & Vite.',
    fr : 'Un portfolio interactif inspiré de macOS, développé avec Vue, TypeScript & Vite.',
  },
  'aboutModal.author'                 : {
    en : 'Created by Robert Hoffmann',
    fr : 'Créé par Robert Hoffmann',
  },
  'aboutModal.close'                  : {
    en : 'Close',
    fr : 'Fermer',
  },
  'notification.followMessage'        : {
    en : 'Enjoying the portfolio? Follow me on X',
    fr : 'Vous aimez le portfolio ? Suivez-moi sur X',
  },
  'notification.followCta'            : {
    en : 'Follow @itechnologynet',
    fr : 'Suivre @itechnologynet',
  },
  'notification.connectMessage'       : {
    en : 'Let’s connect! Reach out to me on LinkedIn',
    fr : 'Restons en contact ! Retrouvez-moi sur LinkedIn',
  },
  'notification.connectCta'           : {
    en : 'Connect on LinkedIn',
    fr : 'Se connecter sur LinkedIn',
  },
  'notification.mobileWelcomeTitle'   : {
    en : 'Welcome',
    fr : 'Bienvenue',
  },
  'notification.mobileWelcomeMessage' : {
    en : 'Click an icon to open an app. Click the dock bar to open or minimize an app. Swipe left to close an app.',
    fr : 'Touchez une icône pour ouvrir une app. Touchez le dock pour ouvrir ou réduire une app. Glissez vers la gauche pour fermer une app.',
  },
  'notification.dismiss'              : {
    en : 'Dismiss notification',
    fr : 'Fermer la notification',
  },
  'topbar.viewToggle'                 : {
    en : 'Toggle desktop / mobile preview',
    fr : 'Basculer aperçu bureau / mobile',
  },
  'toast.switchedToMobile'            : {
    en : 'Switched to mobile preview',
    fr : 'Aperçu mobile activé',
  },
  'toast.switchedToDesktop'           : {
    en : 'Switched to desktop view',
    fr : 'Vue bureau activée',
  },
  'registry.about.title'              : {
    en : 'About Me',
    fr : 'À propos',
  },
  'registry.projects.title'           : {
    en : 'Project Highlights',
    fr : 'Projets marquants',
  },
  'registry.projects.iconTitle'       : {
    en : 'Projects',
    fr : 'Projets',
  },
  'registry.gallery.title'            : {
    en : 'Project Gallery',
    fr : 'Galerie projets',
  },
  'registry.gallery.iconTitle'        : {
    en : 'Gallery',
    fr : 'Galerie',
  },
  'registry.resume.title'             : {
    en : 'Resume',
    fr : 'CV',
  },
  'registry.cvPdf.title'              : {
    en : 'CV PDF',
    fr : 'CV PDF',
  },
  'registry.twitter.title'            : {
    en : 'X',
    fr : 'X',
  },
  'registry.linkedin.title'           : {
    en : 'LinkedIn',
    fr : 'LinkedIn',
  },
  'registry.github.title'             : {
    en : 'GitHub',
    fr : 'GitHub',
  },
  'registry.extras.title'             : {
    en : 'GeoWars.app',
    fr : 'GeoWars.app',
  },
  'registry.music.title'              : {
    en : 'Music',
    fr : 'Musique',
  },
  'registry.video.title'              : {
    en : 'Video',
    fr : 'Vidéo',
  },
  'registry.terminal.title'           : {
    en : 'Terminal',
    fr : 'Terminal',
  },
} satisfies MessageCatalog
// #endregion Messages

// #region Resolution
export function resolveMessage(
  catalogs : readonly MessageCatalog[],
  key      : string,
  locale   : Locale,
  params?  : MessageParams,
): string {
  let text = key

  for (const catalog of catalogs) {
    const entry = catalog[key]

    if (entry) {
      text = entry[locale]
      break
    }
  }

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replaceAll('{' + paramKey + '}', String(paramValue))
    }
  }

  return text
}

export function resolveInterfaceMessage(
  key     : string,
  locale  : Locale,
  params? : MessageParams,
): string {
  return resolveMessage([interfaceMessages], key, locale, params)
}

export default interfaceMessages
// #endregion Resolution
