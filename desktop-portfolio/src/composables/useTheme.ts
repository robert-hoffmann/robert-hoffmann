/* ============================================================
   useTheme — Dark/light theme toggle composable
   ============================================================ */

import { ref } from 'vue'
import type { Theme } from '../types/desktop'
import { useToast } from './useToast'
import { useLocale } from './useLocale'

const THEME_TRANSITION_ATTR        = 'data-theme-transition'
const THEME_TRANSITION_DURATION_VAR = '--dur-theme'

let themeTransitionTimer: number | null = null

function resolveInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'

  const current = document.documentElement.getAttribute('data-theme')
  return current === 'light' || current === 'dark' ? current : 'dark'
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function parseDurationToMs(raw: string): number {
  const value = raw.trim()
  if (!value) return 0

  if (value.endsWith('ms')) {
    const ms = Number.parseFloat(value.slice(0, -2))
    return Number.isFinite(ms) ? ms : 0
  }

  if (value.endsWith('s')) {
    const seconds = Number.parseFloat(value.slice(0, -1))
    return Number.isFinite(seconds) ? seconds * 1000 : 0
  }

  const numeric = Number.parseFloat(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function resolveThemeTransitionDurationMs(root: HTMLElement) {
  const raw = getComputedStyle(root).getPropertyValue(THEME_TRANSITION_DURATION_VAR)
  return parseDurationToMs(raw)
}

function applyThemeTransition(root: HTMLElement) {
  if (themeTransitionTimer !== null) {
    window.clearTimeout(themeTransitionTimer)
    themeTransitionTimer = null
  }

  if (prefersReducedMotion()) {
    root.removeAttribute(THEME_TRANSITION_ATTR)
    return
  }

  const durationMs = resolveThemeTransitionDurationMs(root)
  if (durationMs <= 0) {
    root.removeAttribute(THEME_TRANSITION_ATTR)
    return
  }

  root.setAttribute(THEME_TRANSITION_ATTR, 'true')
  themeTransitionTimer = window.setTimeout(() => {
    root.removeAttribute(THEME_TRANSITION_ATTR)
    themeTransitionTimer = null
  }, durationMs)
}

const theme = ref<Theme>(resolveInitialTheme())

export function useTheme() {
  const { show } = useToast()
  const { t }    = useLocale()

  function setTheme(t_: Theme) {
    const root = document.documentElement
    const currentTheme = root.getAttribute('data-theme')

    theme.value = t_
    if (currentTheme === t_) {
      root.setAttribute('data-theme', t_)
      return
    }

    applyThemeTransition(root)
    root.setAttribute('data-theme', t_)
  }

  function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
    show(t('toast.switchedTheme', { theme : t(`theme.${theme.value}`) }))
  }

  return { theme, setTheme, toggle }
}
