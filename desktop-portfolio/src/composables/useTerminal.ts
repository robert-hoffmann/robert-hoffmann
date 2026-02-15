/* ============================================================
   useTerminal — Fake tmux terminal composable
   ============================================================
   Manages scrollback buffer, command history, and a registry
   of fake shell commands. Accepts an `onLaunchApp` callback
   so the host component can bridge to the window manager.
   ============================================================ */

import { reactive, ref, nextTick } from 'vue'
import { windowRegistry, getRegistryTitle } from '../data/registry'
import type { Locale } from '../types/desktop'

/* ---- public types ---- */

export interface TerminalLine {
  id   : number
  type : 'input' | 'output'
  text : string
}

interface TerminalOptions {
  onLaunchApp : (id: string) => void
  getLocale   : () => Locale
}

interface TerminalCommand {
  description : string
  handler     : (args: string[]) => string[]
}

/* ---- composable ---- */

export function useTerminal(options: TerminalOptions) {
  const { onLaunchApp, getLocale } = options

  const lines        = reactive<TerminalLine[]>([])
  const currentInput = ref('')
  const history      = ref<string[]>([])
  const historyIndex = ref(-1)

  let lineCounter = 0
  const startTime = Date.now()

  /* ---- helpers ---- */

  function pushOutput(text: string | string[]) {
    const arr = Array.isArray(text) ? text : [text]
    for (const t of arr) {
      lines.push({ id : ++lineCounter, type : 'output', text : t })
    }
  }

  function pushInput(text: string) {
    lines.push({ id : ++lineCounter, type : 'input', text })
  }

  /** All launchable app IDs (excludes links) */
  function launchableApps() {
    return Object.entries(windowRegistry)
      .filter(([, def]) => def.type !== 'link')
      .map(([key, def]) => ({ key, title : getRegistryTitle(key, getLocale()) }))
  }

  /** All registry entries for `ls` display */
  function allApps() {
    return Object.entries(windowRegistry)
      .map(([key, def]) => ({
        key,
        title : getRegistryTitle(key, getLocale()),
        icon  : def.icon,
        type  : def.type,
      }))
  }

  /* ---- command registry ---- */

  const commands: Record<string, TerminalCommand> = {
    help : {
      description : 'Show available commands',
      handler() {
        const out = [
          'Available commands:',
          '',
        ]
        for (const [name, cmd] of Object.entries(commands)) {
          out.push(`  ${name.padEnd(12)} ${cmd.description}`)
        }
        out.push('')
        out.push('You can also type any app name to launch it.')
        out.push('Type "ls" to see all available apps.')
        return out
      },
    },

    clear : {
      description : 'Clear the terminal',
      handler() {
        lines.length = 0
        return []
      },
    },

    ls : {
      description : 'List available apps',
      handler() {
        const apps = allApps()
        const maxKey = Math.max(...apps.map(a => a.key.length))
        const out = ['']
        for (const app of apps) {
          const typeLabel = app.type === 'link' ? '🔗' : app.type === 'app' ? '⚙️' : '📄'
          out.push(`  ${typeLabel}  ${app.key.padEnd(maxKey + 2)} ${app.title}`)
        }
        out.push('')
        return out
      },
    },

    pwd : {
      description : 'Print working directory',
      handler : () => ['/Users/guest/desktop-portfolio'],
    },

    whoami : {
      description : 'Display current user',
      handler : () => ['guest'],
    },

    date : {
      description : 'Display current date and time',
      handler() {
        return [new Date().toString()]
      },
    },

    echo : {
      description : 'Print arguments to terminal',
      handler : (args) => [args.join(' ')],
    },

    cat : {
      description : 'Display file contents',
      handler(args) {
        const file = args[0]
        if (!file) return ['cat: missing operand', 'Usage: cat <filename>']

        const files: Record<string, string[]> = {
          'README.md' : [
            '# Desktop Portfolio',
            '',
            'A macOS-inspired interactive portfolio by Robert Hoffmann.',
            'Built with Vue 3, TypeScript & Vite.',
            '',
            '## Features',
            '- Draggable, resizable windows',
            '- GeoWars mini-game',
            '- Music & video players',
            '- Dark / light theme',
            '- Bilingual (EN/FR)',
          ],
          'package.json' : [
            '{',
            '  "name": "desktop-portfolio",',
            '  "version": "1.0.0",',
            '  "scripts": {',
            '    "dev": "vite",',
            '    "build": "vue-tsc && vite build",',
            '    "preview": "vite preview"',
            '  }',
            '}',
          ],
          '.env' : [
            'VITE_APP_TITLE=Desktop Portfolio',
            'VITE_AUTHOR=Robert Hoffmann',
            'SECRET_KEY=nice_try_😏',
          ],
          'resume.txt' : [
            'Robert Hoffmann',
            '═══════════════════════════════════════',
            'Full-Stack Engineer · Consultant',
            '25+ years in tech',
            '',
            'Expertise: .NET, TypeScript, Vue, Python',
            'Industries: Aerospace, Telecom, Media',
            'Certifications: PSM, PSPO, Lean Six Sigma',
          ],
        }

        const content = files[file]
        if (!content) return [`cat: ${file}: No such file or directory`]
        return content
      },
    },

    top : {
      description : 'Display running processes',
      handler() {
        const uptimeSec = Math.floor((Date.now() - startTime) / 1000)
        const uptimeMin = Math.floor(uptimeSec / 60)
        const uptimeHr  = Math.floor(uptimeMin / 60)
        const upStr     = uptimeHr > 0
          ? `${uptimeHr}h ${uptimeMin % 60}m`
          : `${uptimeMin}m ${uptimeSec % 60}s`

        return [
          `Processes: 12  total, 2 running  —  up ${upStr}`,
          '',
          '  PID  COMMAND          CPU%   MEM%',
          '  ───  ───────────────  ─────  ─────',
          '    1  tmux-server       0.1    0.3',
          '   42  zsh               0.0    0.2',
          '  128  node             12.4    3.8',
          '  129  vite              8.7    2.1',
          '  201  vue-tsc           5.2    4.6',
          '  340  esbuild           3.1    1.2',
          '  512  tailwindcss       1.8    0.9',
          '  666  copilot-agent    42.0   13.7',
          '  801  chrome           18.3   12.4',
          '  802  chrome-gpu        6.1    8.2',
          '  900  WindowServer      2.4    1.8',
          '  999  Dock              0.3    0.5',
        ]
      },
    },

    neofetch : {
      description : 'Display system info',
      handler() {
        const hours = Math.floor((Date.now() - startTime) / 3_600_000)
        const mins  = Math.floor(((Date.now() - startTime) % 3_600_000) / 60_000)
        const upStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

        return [
          '                    ╭──────────────────────────╮',
          '   ██████████████   │  guest@portfolio         │',
          '   ██            ██ │  ────────────────         │',
          '   ██   ▓▓▓▓▓   ██ │  OS:     macOS Portfolio  │',
          '   ██   ▓▓▓▓▓   ██ │  Host:   Vue 3.5         │',
          '   ██            ██ │  Kernel: Vite 6           │',
          '   ██████████████   │  Shell:  zsh 5.9         │',
          '   ██            ██ │  Term:   tmux 3.4        │',
          '   ██   ▒▒▒▒▒   ██ │  Theme:  Tokyo Night     │',
          '   ██   ▒▒▒▒▒   ██ │  Font:   JetBrains Mono  │',
          `   ██            ██ │  Uptime: ${upStr.padEnd(16)} │`,
          '   ██████████████   │  Lang:   TypeScript 5.9  │',
          '                    ╰──────────────────────────╯',
        ]
      },
    },

    uptime : {
      description : 'Show session uptime',
      handler() {
        const sec = Math.floor((Date.now() - startTime) / 1000)
        const hr  = Math.floor(sec / 3600)
        const min = Math.floor((sec % 3600) / 60)
        const s   = sec % 60
        const parts = []
        if (hr > 0) parts.push(`${hr} hour${hr > 1 ? 's' : ''}`)
        parts.push(`${min} min${min !== 1 ? 's' : ''}`)
        parts.push(`${s} sec${s !== 1 ? 's' : ''}`)
        return [`up ${parts.join(', ')}`]
      },
    },

    hostname : {
      description : 'Display hostname',
      handler : () => ['portfolio.local'],
    },

    uname : {
      description : 'Display system name',
      handler : () => ['PortfolioOS 1.0.0 Vue/Vite arm64'],
    },

    history : {
      description : 'Show command history',
      handler() {
        if (history.value.length === 0) return ['No commands in history.']
        return history.value.map((cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`)
      },
    },
  }

  /* ---- process input ---- */

  function processCommand(raw: string) {
    const trimmed = raw.trim()
    pushInput(`guest@portfolio:~$ ${trimmed}`)

    if (!trimmed) return

    history.value.push(trimmed)
    historyIndex.value = -1

    const [cmd, ...args] = trimmed.split(/\s+/)
    const lowerCmd = cmd!.toLowerCase()

    /* Check built-in commands first */
    if (commands[lowerCmd]) {
      const output = commands[lowerCmd].handler(args)
      if (output.length > 0) pushOutput(output)
      return
    }

    /* Check if it's a launchable app name */
    const matchedApp = Object.keys(windowRegistry).find(
      key => key.toLowerCase() === lowerCmd,
    )
    if (matchedApp) {
      const def = windowRegistry[matchedApp]
      if (def.type === 'link' && def.url) {
        pushOutput(`Opening ${def.title} in a new tab...`)
        window.open(def.url, '_blank', 'noopener')
      } else {
        pushOutput(`Launching ${getRegistryTitle(matchedApp, getLocale())}...`)
        onLaunchApp(matchedApp)
      }
      return
    }

    pushOutput(`zsh: command not found: ${cmd}`)
  }

  /* ---- history navigation ---- */

  function historyUp() {
    if (history.value.length === 0) return

    if (historyIndex.value === -1) {
      historyIndex.value = history.value.length - 1
    } else if (historyIndex.value > 0) {
      historyIndex.value--
    }
    currentInput.value = history.value[historyIndex.value]!
  }

  function historyDown() {
    if (historyIndex.value === -1) return

    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      currentInput.value = history.value[historyIndex.value]!
    } else {
      historyIndex.value = -1
      currentInput.value = ''
    }
  }

  /* ---- welcome message ---- */

  function showWelcome() {
    pushOutput([
      'Last login: ' + new Date().toLocaleString() + ' on ttys000',
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║       Welcome to Desktop Portfolio           ║',
      '  ║  Type "help" for commands or "ls" for apps   ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
    ])
  }

  return {
    lines,
    currentInput,
    processCommand,
    historyUp,
    historyDown,
    showWelcome,
  }
}
