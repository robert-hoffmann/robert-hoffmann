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
  'topbar.openTerminal'      : { en : 'Open Terminal',       fr : 'Ouvrir Terminal' },
  'topbar.openTwitter'       : { en : 'Open X (Twitter)',   fr : 'Ouvrir X (Twitter)' },
  'topbar.openLinkedIn'      : { en : 'Open LinkedIn',      fr : 'Ouvrir LinkedIn' },
  'topbar.openGitHub'        : { en : 'Open GitHub',        fr : 'Ouvrir GitHub' },
  'topbar.closeAll'          : { en : 'Close All Windows',  fr : 'Fermer toutes les fenêtres' },
  'topbar.resetDesktop'      : { en : 'Reset Desktop',      fr : 'Réinitialiser le bureau' },
  'topbar.copyPageUrl'       : { en : 'Copy Page URL',      fr : 'Copier l\u2019URL' },
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
  'topbar.toggleFullscreen'  : { en : 'Toggle fullscreen',   fr : 'Basculer le plein écran' },
  'topbar.toggleLocale'      : { en : 'Switch to French',   fr : 'Passer en anglais' },

  /* ---- Calendar ---- */
  'calendar.month.0'           : { en : 'January',     fr : 'Janvier' },
  'calendar.month.1'           : { en : 'February',    fr : 'Février' },
  'calendar.month.2'           : { en : 'March',       fr : 'Mars' },
  'calendar.month.3'           : { en : 'April',       fr : 'Avril' },
  'calendar.month.4'           : { en : 'May',         fr : 'Mai' },
  'calendar.month.5'           : { en : 'June',        fr : 'Juin' },
  'calendar.month.6'           : { en : 'July',        fr : 'Juillet' },
  'calendar.month.7'           : { en : 'August',      fr : 'Août' },
  'calendar.month.8'           : { en : 'September',   fr : 'Septembre' },
  'calendar.month.9'           : { en : 'October',     fr : 'Octobre' },
  'calendar.month.10'          : { en : 'November',    fr : 'Novembre' },
  'calendar.month.11'          : { en : 'December',    fr : 'Décembre' },
  'calendar.day.0'             : { en : 'Su',          fr : 'Di' },
  'calendar.day.1'             : { en : 'Mo',          fr : 'Lu' },
  'calendar.day.2'             : { en : 'Tu',          fr : 'Ma' },
  'calendar.day.3'             : { en : 'We',          fr : 'Me' },
  'calendar.day.4'             : { en : 'Th',          fr : 'Je' },
  'calendar.day.5'             : { en : 'Fr',          fr : 'Ve' },
  'calendar.day.6'             : { en : 'Sa',          fr : 'Sa' },

  /* ---- Toasts ---- */
  'toast.allWindowsClosed'   : { en : 'All windows closed',                   fr : 'Toutes les fenêtres fermées' },
  'toast.desktopReset'       : { en : 'Desktop reset',                        fr : 'Bureau réinitialisé' },
  'toast.pageUrlCopied'      : { en : 'Page URL copied',                      fr : 'URL de la page copiée' },
  'toast.copyFailed'         : { en : 'Copy failed — use browser address bar', fr : 'Échec de la copie — utilisez la barre d\u2019adresse' },
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
  'music.playPause'          : { en : 'Play / Pause',       fr : 'Lecture / Pause' },
  'music.disableLoop'        : { en : 'Disable loop',       fr : 'Désactiver la boucle' },
  'music.enableLoop'         : { en : 'Enable loop',        fr : 'Activer la boucle' },
  'music.stop'               : { en : 'Stop',               fr : 'Arrêter' },
  'music.volume'             : { en : 'Volume',             fr : 'Volume' },
  'music.mute'               : { en : 'Mute',               fr : 'Couper le son' },
  'music.unmute'             : { en : 'Unmute',             fr : 'Rétablir le son' },

  /* ---- Video player ---- */
  'video.previous'           : { en : 'Previous',           fr : 'Précédent' },
  'video.next'               : { en : 'Next',               fr : 'Suivant' },
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

  /* ---- Mobile layout ---- */
  'mobile.about'             : { en : 'About',              fr : 'À propos' },
  'mobile.resume'            : { en : 'Resume',             fr : 'CV' },
  'mobile.projects'          : { en : 'Projects',           fr : 'Projets' },
  'mobile.nav'               : { en : 'Section navigation', fr : 'Navigation de section' },
  'mobile.footer'            : { en : 'Social links and site info', fr : 'Liens sociaux et informations du site' },
  'mobile.desktopTeaser'     : { en : 'Visit this site on a desktop for an interactive macOS-style experience ✨',
                                 fr : 'Visitez ce site sur un ordinateur pour une expérience interactive style macOS ✨' },

  /* ---- About Site modal ---- */
  'aboutModal.title'       : { en : 'About Desktop Portfolio',
                               fr : 'À propos de Desktop Portfolio' },
  'aboutModal.version'     : { en : 'Version 1.0',            fr : 'Version 1.0' },
  'aboutModal.description' : { en : 'A macOS-inspired interactive portfolio built with Vue, TypeScript & Vite.',
                               fr : 'Un portfolio interactif inspiré de macOS, développé avec Vue, TypeScript & Vite.' },
  'aboutModal.author'      : { en : 'Created by Robert Hoffmann',
                               fr : 'Créé par Robert Hoffmann' },
  'aboutModal.close'       : { en : 'Close',                  fr : 'Fermer' },

  /* ---- Notification toast ---- */
  'notification.followMessage'    : { en : 'Enjoying the portfolio? Follow me on X for updates!',
                                     fr : 'Vous aimez le portfolio ? Suivez-moi sur X pour les nouveaut\u00e9s !' },
  'notification.followCta'        : { en : 'Follow @itechnologynet',    fr : 'Suivre @itechnologynet' },
  'notification.connectMessage'   : { en : 'Let\u2019s connect! Reach out to me on LinkedIn.',
                                     fr : 'Restons en contact ! Retrouvez-moi sur LinkedIn.' },
  'notification.connectCta'       : { en : 'Connect on LinkedIn',       fr : 'Se connecter sur LinkedIn' },
  'notification.dismiss'          : { en : 'Dismiss notification',      fr : 'Fermer la notification' },

  /* ---- View-mode toggle (desktop only) ---- */
  'topbar.viewToggle'        : { en : 'Toggle desktop / mobile preview', fr : 'Basculer aperçu bureau / mobile' },
  'toast.switchedToMobile'   : { en : 'Switched to mobile preview',    fr : 'Aperçu mobile activé' },
  'toast.switchedToDesktop'  : { en : 'Switched to desktop view',      fr : 'Vue bureau activée' },

  /* ---- Terminal ---- */
  'term.welcome.lastLogin'       : { en : 'Last login: {date} on ttys000',
                                     fr : 'Dernière connexion : {date} sur ttys000' },
  'term.welcome.title'           : { en : '  ║       Welcome to Desktop Portfolio           ║',
                                     fr : '  ║     Bienvenue sur Desktop Portfolio          ║' },
  'term.welcome.hint'            : { en : '  ║  Type "help" for commands or "ls" for apps   ║',
                                     fr : '  ║  Tapez "help" pour les commandes ou "ls"     ║' },

  'term.cmd.help'                : { en : 'Show available commands',        fr : 'Afficher les commandes disponibles' },
  'term.cmd.clear'               : { en : 'Clear the terminal',            fr : 'Effacer le terminal' },
  'term.cmd.exit'                : { en : 'Close the terminal window',     fr : 'Fermer la fenêtre Terminal' },
  'term.cmd.quit'                : { en : 'Close the terminal window',     fr : 'Fermer la fenêtre Terminal' },
  'term.cmd.ls'                  : { en : 'List available apps',            fr : 'Lister les applications' },
  'term.cmd.pwd'                 : { en : 'Print working directory',       fr : 'Afficher le répertoire courant' },
  'term.cmd.whoami'              : { en : 'Display current user',          fr : 'Afficher l\u2019utilisateur courant' },
  'term.cmd.date'                : { en : 'Display current date and time', fr : 'Afficher la date et l\u2019heure' },
  'term.cmd.echo'                : { en : 'Print arguments to terminal',   fr : 'Afficher les arguments dans le terminal' },
  'term.cmd.cat'                 : { en : 'Display file contents',         fr : 'Afficher le contenu d\u2019un fichier' },
  'term.cmd.top'                 : { en : 'Display running processes',     fr : 'Afficher les processus actifs' },
  'term.cmd.neofetch'            : { en : 'Display system info',           fr : 'Afficher les informations système' },
  'term.cmd.uptime'              : { en : 'Show session uptime',           fr : 'Afficher le temps de session' },
  'term.cmd.hostname'            : { en : 'Display hostname',              fr : 'Afficher le nom d\u2019hôte' },
  'term.cmd.uname'               : { en : 'Display system name',           fr : 'Afficher le nom du système' },
  'term.cmd.history'             : { en : 'Show command history',          fr : 'Afficher l\u2019historique des commandes' },

  'term.help.header'             : { en : 'Available commands:',            fr : 'Commandes disponibles :' },
  'term.help.launchHint'         : { en : 'You can also type any app name to launch it.',
                                     fr : 'Vous pouvez également taper le nom d\u2019une application pour la lancer.' },
  'term.help.lsHint'             : { en : 'Type "ls" to see all available apps.',
                                     fr : 'Tapez "ls" pour voir toutes les applications.' },

  'term.cat.missing'             : { en : 'cat: missing operand',          fr : 'cat : opérande manquant' },
  'term.cat.usage'               : { en : 'Usage: cat <filename>',         fr : 'Usage : cat <fichier>' },
  'term.cat.notFound'            : { en : 'cat: {file}: No such file or directory',
                                     fr : 'cat : {file} : Aucun fichier ou répertoire de ce nom' },

  'term.launch.opening'          : { en : 'Opening {title} in a new tab...', fr : 'Ouverture de {title} dans un nouvel onglet…' },
  'term.launch.launching'        : { en : 'Launching {title}...',            fr : 'Lancement de {title}…' },
  'term.notFound'                : { en : 'zsh: command not found: {cmd}',   fr : 'zsh : commande introuvable : {cmd}' },
  'term.noHistory'               : { en : 'No commands in history.',         fr : 'Aucune commande dans l\u2019historique.' },

  'term.top.header'              : { en : 'Processes: 12  total, 2 running  —  up {uptime}',
                                     fr : 'Processus : 12 total, 2 actifs  —  up {uptime}' },
  'term.uptime.up'               : { en : 'up {time}',                      fr : 'actif depuis {time}' },
} as const

export default ui
