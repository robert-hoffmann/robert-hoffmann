import type { MessageCatalog } from '../interface'

// #region Messages
export const terminalMessages = {
  'term.welcome.lastLogin' : {
    en : 'Last login: {date} on ttys000',
    fr : 'Dernière connexion : {date} sur ttys000',
  },
  'term.welcome.title'     : {
    en : 'Welcome to Desktop Portfolio',
    fr : 'Bienvenue sur Desktop Portfolio',
  },
  'term.welcome.hint'      : {
    en : 'Type "help" for commands or "ls" for apps',
    fr : 'Tapez "help" pour les commandes ou "ls"',
  },
  'term.cmd.help'          : {
    en : 'Show available commands',
    fr : 'Afficher les commandes disponibles',
  },
  'term.cmd.clear'         : {
    en : 'Clear the terminal',
    fr : 'Effacer le terminal',
  },
  'term.cmd.exit'          : {
    en : 'Close the terminal window',
    fr : 'Fermer la fenêtre Terminal',
  },
  'term.cmd.quit'          : {
    en : 'Close the terminal window',
    fr : 'Fermer la fenêtre Terminal',
  },
  'term.cmd.ls'            : {
    en : 'List available apps',
    fr : 'Lister les applications',
  },
  'term.cmd.pwd'           : {
    en : 'Print working directory',
    fr : 'Afficher le répertoire courant',
  },
  'term.cmd.whoami'        : {
    en : 'Display current user',
    fr : 'Afficher l’utilisateur courant',
  },
  'term.cmd.date'          : {
    en : 'Display current date and time',
    fr : 'Afficher la date et l’heure',
  },
  'term.cmd.echo'          : {
    en : 'Print arguments to terminal',
    fr : 'Afficher les arguments dans le terminal',
  },
  'term.cmd.cat'           : {
    en : 'Display file contents',
    fr : 'Afficher le contenu d’un fichier',
  },
  'term.cmd.top'           : {
    en : 'Display running processes',
    fr : 'Afficher les processus actifs',
  },
  'term.cmd.neofetch'      : {
    en : 'Display system info',
    fr : 'Afficher les informations système',
  },
  'term.cmd.uptime'        : {
    en : 'Show session uptime',
    fr : 'Afficher le temps de session',
  },
  'term.cmd.hostname'      : {
    en : 'Display hostname',
    fr : 'Afficher le nom d’hôte',
  },
  'term.cmd.uname'         : {
    en : 'Display system name',
    fr : 'Afficher le nom du système',
  },
  'term.cmd.history'       : {
    en : 'Show command history',
    fr : 'Afficher l’historique des commandes',
  },
  'term.help.header'       : {
    en : 'Available commands:',
    fr : 'Commandes disponibles :',
  },
  'term.help.launchHint'   : {
    en : 'You can also type any app name to launch it.',
    fr : 'Vous pouvez également taper le nom d’une application pour la lancer.',
  },
  'term.help.lsHint'       : {
    en : 'Type "ls" to see all available apps.',
    fr : 'Tapez "ls" pour voir toutes les applications.',
  },
  'term.cat.missing'       : {
    en : 'cat: missing operand',
    fr : 'cat : opérande manquant',
  },
  'term.cat.usage'         : {
    en : 'Usage: cat <filename>',
    fr : 'Usage : cat <fichier>',
  },
  'term.cat.notFound'      : {
    en : 'cat: {file}: No such file or directory',
    fr : 'cat : {file} : Aucun fichier ou répertoire de ce nom',
  },
  'term.launch.opening'    : {
    en : 'Opening {title} in a new tab...',
    fr : 'Ouverture de {title} dans un nouvel onglet…',
  },
  'term.launch.launching'  : {
    en : 'Launching {title}...',
    fr : 'Lancement de {title}…',
  },
  'term.notFound'          : {
    en : 'zsh: command not found: {cmd}',
    fr : 'zsh : commande introuvable : {cmd}',
  },
  'term.noHistory'         : {
    en : 'No commands in history.',
    fr : 'Aucune commande dans l’historique.',
  },
  'term.top.header'        : {
    en : 'Processes: 12  total, 2 running  -  up {uptime}',
    fr : 'Processus : 12 total, 2 actifs  -  up {uptime}',
  },
  'term.uptime.up'         : {
    en : 'up {time}',
    fr : 'actif depuis {time}',
  },
} satisfies MessageCatalog
// #endregion Messages
