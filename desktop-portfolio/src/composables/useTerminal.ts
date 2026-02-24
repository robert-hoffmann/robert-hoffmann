/* ============================================================
   useTerminal — Fake tmux terminal composable
   ============================================================
   Manages scrollback buffer, command history, and a registry
   of fake shell commands. Accepts an `onLaunchApp` callback
   so the host component can bridge to the window manager.
   ============================================================ */

import { reactive, ref } from 'vue'
import { windowRegistry, getRegistryTitle } from '../data/registry'
import type { Locale } from '../types/desktop'

/* ---- public types ---- */

export interface TerminalLine {
  id      : number
  type    : 'input' | 'output' | 'welcome-banner'
  text    : string
  tKey?   : string
  tParams?: Record<string, string | number>
}

interface TerminalOptions {
  onLaunchApp : (id: string) => void
  onClose?    : () => void
  getLocale   : () => Locale
  t           : (key: string, params?: Record<string, string | number>) => string
}

/** A single output line — either raw text, a translation reference, or a structured banner. */
type OutputEntry =
  | string
  | { tKey: string; tParams?: Record<string, string | number> }
  | { kind: 'welcome-banner' }

interface TerminalCommand {
  description : string
  handler     : (args: string[]) => OutputEntry[]
}

/* ---- composable ---- */

export function useTerminal(options: TerminalOptions) {
  const { onLaunchApp, onClose, getLocale, t } = options

  const lines        = reactive<TerminalLine[]>([])
  const currentInput = ref('')
  const history      = ref<string[]>([])
  const historyIndex = ref(-1)

  let lineCounter = 0
  const startTime = Date.now()

  /* ---- helpers ---- */

  /** Helper to create a translatable output entry. */
  function tr(tKey: string, tParams?: Record<string, string | number>): OutputEntry {
    return { tKey, tParams }
  }

  function pushOutput(entries: OutputEntry | OutputEntry[]) {
    const arr = Array.isArray(entries) ? entries : [entries]
    for (const entry of arr) {
      if (typeof entry === 'string') {
        lines.push({ id : ++lineCounter, type : 'output', text : entry })
      } else if ('kind' in entry && entry.kind === 'welcome-banner') {
        lines.push({ id : ++lineCounter, type : 'welcome-banner', text : '' })
      } else if ('tKey' in entry) {
        const { tKey, tParams } = entry
        lines.push({
          id      : ++lineCounter,
          type    : 'output',
          text    : t(tKey, tParams),
          tKey,
          tParams,
        })
      }
    }
  }

  function pushInput(text: string) {
    lines.push({ id : ++lineCounter, type : 'input', text })
  }

  /** Format a Date as pretty ISO 8601 local time: YYYY-MM-DD HH:MM:SS */
  function isoLocal(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
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

  function closeTerminal(): OutputEntry[] {
    onClose?.()
    return []
  }

  /* ---- command registry ---- */

  const commands: Record<string, TerminalCommand> = {
    help : {
      description : 'term.cmd.help',
      handler() {
        const out: OutputEntry[] = [
          tr('term.help.header'),
          '',
        ]
        for (const [name, cmd] of Object.entries(commands)) {
          out.push(`  ${name.padEnd(12)} ${t(cmd.description)}`)
        }
        out.push('')
        out.push(tr('term.help.launchHint'))
        out.push(tr('term.help.lsHint'))
        return out
      },
    },

    clear : {
      description : 'term.cmd.clear',
      handler() {
        lines.length = 0
        return []
      },
    },

    exit : {
      description : 'term.cmd.exit',
      handler     : closeTerminal,
    },

    quit : {
      description : 'term.cmd.quit',
      handler     : closeTerminal,
    },

    ls : {
      description : 'term.cmd.ls',
      handler() {
        const apps = allApps()
        const maxKey = Math.max(...apps.map(a => a.key.length))
        const out = ['']
        for (const app of apps) {
          const icon = app.icon
            || (app.type === 'link' ? '🔗' : app.type === 'app' ? '⚙️' : '📄')
            || '?'
          out.push(`  ${icon}  ${app.key.padEnd(maxKey + 2)} ${app.title}`)
        }
        out.push('')
        return out
      },
    },

    pwd : {
      description : 'term.cmd.pwd',
      handler : () => ['/Users/guest/desktop-portfolio'],
    },

    whoami : {
      description : 'term.cmd.whoami',
      handler : () => ['guest'],
    },

    date : {
      description : 'term.cmd.date',
      handler() {
        return [isoLocal(new Date())]
      },
    },

    echo : {
      description : 'term.cmd.echo',
      handler : (args) => [args.join(' ')],
    },

    cat : {
      description : 'term.cmd.cat',
      handler(args) {
        const file = args[0]
        if (!file) return [tr('term.cat.missing'), tr('term.cat.usage')]

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
        if (!content) return [tr('term.cat.notFound', { file })]
        return content
      },
    },

    top : {
      description : 'term.cmd.top',
      handler() {
        const uptimeSec = Math.floor((Date.now() - startTime) / 1000)
        const uptimeMin = Math.floor(uptimeSec / 60)
        const uptimeHr  = Math.floor(uptimeMin / 60)
        const upStr     = uptimeHr > 0
          ? `${uptimeHr}h ${uptimeMin % 60}m`
          : `${uptimeMin}m ${uptimeSec % 60}s`

        return [
          tr('term.top.header', { uptime : upStr }),
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
      description : 'term.cmd.neofetch',
      handler() {
        const hours = Math.floor((Date.now() - startTime) / 3_600_000)
        const mins  = Math.floor(((Date.now() - startTime) % 3_600_000) / 60_000)
        const upStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

        return [
          '                    ╭──────────────────────────╮',
          '   ██████████████   │  guest@portfolio         │',
          '   ██            ██ │  ────────────────        │',
          '   ██   ▓▓▓▓▓   ██  │  OS:     macOS Portfolio │',
          '   ██   ▓▓▓▓▓   ██  │  Host:   Vue 3.5         │',
          '   ██            ██ │  Kernel: Vite 7          │',
          '   ██████████████   │  Shell:  zsh 5.9         │',
          '   ██            ██ │  Term:   tmux 3.4        │',
          '   ██   ▒▒▒▒▒   ██  │  Theme:  Tokyo Night     │',
          '   ██   ▒▒▒▒▒   ██  │  Font:   JetBrains Mono  │',
          `   ██            ██ │  Uptime: ${upStr.padEnd(16)}│`,
          '   ██████████████   │  Lang:   TypeScript 5.9  │',
          '                    ╰──────────────────────────╯',
        ]
      },
    },

    uptime : {
      description : 'term.cmd.uptime',
      handler() {
        const sec = Math.floor((Date.now() - startTime) / 1000)
        const hr  = Math.floor(sec / 3600)
        const min = Math.floor((sec % 3600) / 60)
        const s   = sec % 60
        const parts = []
        if (hr > 0) parts.push(`${hr} hour${hr > 1 ? 's' : ''}`)
        parts.push(`${min} min${min !== 1 ? 's' : ''}`)
        parts.push(`${s} sec${s !== 1 ? 's' : ''}`)
        return [tr('term.uptime.up', { time : parts.join(', ') })]
      },
    },

    hostname : {
      description : 'term.cmd.hostname',
      handler : () => ['portfolio.local'],
    },

    uname : {
      description : 'term.cmd.uname',
      handler : () => ['PortfolioOS 1.0.0 Vue/Vite arm64'],
    },

    history : {
      description : 'term.cmd.history',
      handler() {
        if (history.value.length === 0) return [tr('term.noHistory')]
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
      const def = windowRegistry[matchedApp]!
      if (def.type === 'link' && def.url) {
        pushOutput(tr('term.launch.opening', { title : def.title }))
        window.open(def.url, '_blank', 'noopener')
      } else {
        pushOutput(tr('term.launch.launching', { title : getRegistryTitle(matchedApp, getLocale()) }))
        onLaunchApp(matchedApp)
      }
      return
    }

    pushOutput(tr('term.notFound', { cmd : cmd! }))
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
      tr('term.welcome.lastLogin', { date : isoLocal(new Date()) }),
      '',
      { kind : 'welcome-banner' },
      '',
    ])
  }

  /* ---- line resolver (reactive to locale) ---- */

  /** Resolve text for a terminal line. Translatable lines re-resolve on locale change. */
  function resolveLine(line: TerminalLine): string {
    if (line.tKey) return t(line.tKey, line.tParams)
    return line.text
  }

  return {
    lines,
    currentInput,
    processCommand,
    historyUp,
    historyDown,
    showWelcome,
    resolveLine,
  }
}
