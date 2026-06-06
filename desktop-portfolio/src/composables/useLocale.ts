/* ============================================================
   useLocale - EN/FR locale toggle composable
   ============================================================
   Module-level singleton ref shared across all consumers.
   Mirrors the useTheme pattern: reactive ref + side effects.
   ============================================================ */

import { ref } from 'vue'
import type { Locale } from '../types/desktop'
import { useToast } from './useToast'
import {
  interfaceMessages,
  resolveMessage,
  type MessageCatalog,
  type MessageParams,
} from '../data/interface'

/** Detect browser language preference - returns 'fr' for any fr variant, 'en' otherwise */
function detectBrowserLocale(): Locale {
  const langs = navigator.languages ?? [navigator.language]
  for (const lang of langs) {
    if (String(lang).toLowerCase().startsWith('fr')) return 'fr'
  }
  return 'en'
}

const locale = ref<Locale>(detectBrowserLocale())

export function useLocale(localMessages?: MessageCatalog) {
  const { show } = useToast()

  /** Look up a UI translation key, with optional {placeholder} interpolation */
  function t(key: string, params?: MessageParams): string {
    const catalogs = localMessages
      ? [localMessages, interfaceMessages]
      : [interfaceMessages]

    return resolveMessage(catalogs, key, locale.value, params)
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
