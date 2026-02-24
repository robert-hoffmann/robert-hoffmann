<script setup lang="ts">
import { inject, onMounted, onUnmounted, nextTick, useTemplateRef, ref } from 'vue'
import { useTerminal } from '../composables/useTerminal'
import { useLocale } from '../composables/useLocale'

const { t, locale } = useLocale()

/* ---- app launcher bridge ---- */
const openApp = inject<(id: string) => void>('openApp')
const closeWindow = inject<() => void>('closeWindow')

const { lines, currentInput, processCommand, historyUp, historyDown, showWelcome, resolveLine } =
  useTerminal({
    onLaunchApp : (id) => openApp?.(id),
    onClose     : () => closeWindow?.(),
    getLocale   : () => locale.value,
    t,
  })

/* ---- refs ---- */
const inputRef    = useTemplateRef<HTMLInputElement>('terminalInput')
const scrollRef   = useTemplateRef<HTMLDivElement>('terminalScroll')
const isFocused   = inject<{ value: boolean }>('windowFocused', ref(true))

/* ---- tmux clock ---- */
const clock = ref(formatClock())
let clockTimer: ReturnType<typeof setInterval> | null = null

function formatClock(): string {
  const now = new Date()
  return now.toLocaleTimeString('en-US', { hour : '2-digit', minute : '2-digit', hour12 : false })
}

/* ---- auto-scroll ---- */
function scrollToBottom() {
  void nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

/* ---- input handling ---- */
function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
      processCommand(currentInput.value)
      currentInput.value = ''
      scrollToBottom()
      break

    case 'ArrowUp':
      event.preventDefault()
      historyUp()
      break

    case 'ArrowDown':
      event.preventDefault()
      historyDown()
      break

    case 'l':
      /* Ctrl+L = clear (standard terminal shortcut) */
      if (event.ctrlKey) {
        event.preventDefault()
        processCommand('clear')
      }
      break

    case 'c':
      /* Ctrl+C = cancel current input */
      if (event.ctrlKey) {
        event.preventDefault()
        currentInput.value = ''
        processCommand('')
      }
      break
  }
}

function focusInput() {
  inputRef.value?.focus()
}

/* ---- lifecycle ---- */
onMounted(() => {
  showWelcome()
  scrollToBottom()
  focusInput()
  clockTimer = setInterval(() => { clock.value = formatClock() }, 10_000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<template>
  <div
    class="terminal-container"
    @click="focusInput"
  >
    <!-- Scrollable output area -->
    <div ref="terminalScroll" class="terminal-output">
      <div
        v-for="line in lines"
        :key="line.id"
        class="terminal-line"
        :class="{ 'terminal-line--input': line.type === 'input' }"
      >
        <div
          v-if="line.type === 'welcome-banner'"
          class="terminal-welcome-banner"
          role="note"
          aria-label="Welcome banner"
        >
          <p class="terminal-welcome-title">{{ t('term.welcome.title') }}</p>
          <p class="terminal-welcome-hint">{{ t('term.welcome.hint') }}</p>
        </div>
        <pre v-else class="terminal-text">{{ resolveLine(line) }}</pre>
      </div>

      <!-- Active input line -->
      <div class="terminal-input-row">
        <span class="terminal-prompt">guest@portfolio:~$</span>
        <span class="terminal-input-wrapper">
          <span class="terminal-typed">{{ currentInput }}</span>
          <span
            class="terminal-cursor"
            :class="{ 'terminal-cursor--blink': isFocused.value }"
          />
        </span>
        <input
          ref="terminalInput"
          v-model="currentInput"
          class="terminal-hidden-input"
          type="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          aria-label="Terminal input"
          @keydown="onKeyDown"
        />
      </div>
    </div>

    <!-- Tmux status bar -->
    <div class="tmux-bar">
      <div class="tmux-bar-left">
        <span class="tmux-session">[0]</span>
        <span class="tmux-window tmux-window--active">0:zsh*</span>
      </div>
      <div class="tmux-bar-right">
        <span class="tmux-host">"portfolio.local"</span>
        <span class="tmux-clock">{{ clock }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---- Terminal-specific tokens ---- */
.terminal-container {
  --term-bg          : oklch(0.16 0.02 260);
  --term-fg          : oklch(0.76 0.04 260);
  --term-prompt      : oklch(0.72 0.16 145);
  --term-cursor      : oklch(0.76 0.04 260);
  --term-input       : oklch(0.85 0.04 260);
  --term-bar-bg      : oklch(0.22 0.02 145);
  --term-bar-fg      : oklch(0.76 0.04 260);
  --term-bar-accent  : oklch(0.72 0.16 145);

  display        : flex;
  flex-direction : column;
  block-size     : 100%;
  background     : var(--term-bg);
  font-family    : 'JetBrains Mono', ui-monospace, monospace;
  font-size      : 13px;
  line-height    : 1.5;
  color          : var(--term-fg);
  cursor         : text;
  user-select    : text;
}

/* ---- Scrollable output ---- */
.terminal-output {
  flex           : 1;
  overflow-y     : auto;
  padding        : var(--space-4, 12px) var(--space-4, 12px) 0;
  scrollbar-width: thin;
  scrollbar-color: oklch(0.35 0.02 260) transparent;
}

/* ---- Lines ---- */
.terminal-line {
  min-block-size : 1.5em;
}

.terminal-line--input {
  color : var(--term-input);
}

.terminal-text {
  margin      : 0;
  font-family : inherit;
  font-size   : inherit;
  line-height : inherit;
  white-space : pre-wrap;
  word-break  : break-all;
}

.terminal-welcome-banner {
  border         : 1px solid color-mix(in oklch, var(--term-fg) 55%, transparent);
  border-radius  : var(--radius-sm, 4px);
  padding-inline : var(--space-4, 12px);
  padding-block  : var(--space-2, 8px);
  background     : color-mix(in oklch, var(--term-bg) 85%, var(--term-fg) 15%);
}

.terminal-welcome-title {
  color       : var(--term-fg);
  font-weight : 600;
}

.terminal-welcome-hint {
  color            : var(--term-fg);
  margin-block-start : var(--space-1, 4px);
}

/* ---- Active input row ---- */
.terminal-input-row {
  display     : flex;
  align-items : center;
  padding-block-end : var(--space-4, 12px);
  position    : relative;
}

.terminal-prompt {
  color         : var(--term-prompt);
  margin-inline-end : 0.5em;
  flex-shrink   : 0;
  font-weight   : 600;
}

.terminal-input-wrapper {
  display     : flex;
  align-items : center;
  flex        : 1;
  position    : relative;
}

.terminal-typed {
  color : var(--term-input);
  white-space : pre;
}

/* ---- Cursor ---- */
.terminal-cursor {
  display        : inline-block;
  inline-size    : 0.6em;
  block-size     : 1.2em;
  background     : var(--term-cursor);
  vertical-align : text-bottom;
  opacity        : 0.8;
}

.terminal-cursor--blink {
  animation : cursor-blink 1s steps(2) infinite;
}

@keyframes cursor-blink {
  0%   { opacity : 0.8 }
  50%  { opacity : 0 }
  100% { opacity : 0.8 }
}

@media (prefers-reduced-motion: reduce) {
  .terminal-cursor--blink {
    animation : none;
    opacity   : 0.8;
  }
}

/* ---- Hidden input (accessible, captures keyboard) ---- */
.terminal-hidden-input {
  position    : absolute;
  inset       : 0;
  opacity     : 0;
  inline-size : 100%;
  block-size  : 100%;
  border      : none;
  background  : none;
  color       : transparent;
  font-size   : inherit;
  caret-color : transparent;
}

/* ---- Tmux status bar ---- */
.tmux-bar {
  display         : flex;
  justify-content : space-between;
  align-items     : center;
  padding-inline  : var(--space-3, 8px);
  padding-block   : 2px;
  background      : var(--term-bar-bg);
  color           : var(--term-bar-fg);
  font-size       : 12px;
  flex-shrink     : 0;
  border-block-start : 1px solid oklch(0.30 0.02 145);
}

.tmux-bar-left,
.tmux-bar-right {
  display     : flex;
  align-items : center;
  gap         : var(--space-3, 8px);
}

.tmux-session {
  color       : var(--term-bar-accent);
  font-weight : 600;
}

.tmux-window--active {
  color       : var(--term-bar-accent);
  font-weight : 600;
}

.tmux-host {
  color : var(--term-bar-fg);
}

.tmux-clock {
  color       : var(--term-bar-fg);
  font-weight : 600;
}
</style>
