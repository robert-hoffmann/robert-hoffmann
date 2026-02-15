/* ============================================================
   useLocale — EN/FR locale toggle composable
   ============================================================
   Module-level singleton ref shared across all consumers.
   Mirrors the useTheme pattern: reactive ref + side effects.
   ============================================================ */

import { ref } from 'vue'
import type { Locale } from '../types/desktop'
import { useToast } from './useToast'
import ui from '../data/translations'

/** Detect browser language preference — returns 'fr' for any fr variant, 'en' otherwise */
function detectBrowserLocale(): Locale {
  const langs = navigator.languages ?? [navigator.language]
  for (const lang of langs) {
    if (lang.startsWith('fr')) return 'fr'
  }
  return 'en'
}

const locale = ref<Locale>(detectBrowserLocale())

export function useLocale() {
  const { show } = useToast()

  /** Look up a UI translation key, with optional {placeholder} interpolation */
  function t(key: string, params?: Record<string, string | number>): string {
    const entry = ui[key]
    let text = entry?.[locale.value] ?? key

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replaceAll(`{${k}}`, String(v))
      }
    }

    return text
  }

  /** Resolve a Localized object (e.g. { en: '...', fr: '...' }) to the current locale */
  function l(localized: Record<Locale, string>): string {
    return localized[locale.value]
  }

  function setLocale(loc: Locale) {
    locale.value = loc
    document.documentElement.lang = loc
  }

  function toggleLocale() {
    const next = locale.value === 'en' ? 'fr' : 'en'
    setLocale(next)
    show(t('toast.switchedLocale'))
  }

  return { locale, t, l, setLocale, toggleLocale }
}
