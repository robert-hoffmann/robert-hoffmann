/* ============================================================
   useTheme — Dark/light theme toggle composable
   ============================================================ */

import { ref } from 'vue'
import type { Theme } from '../types/desktop'
import { useToast } from './useToast'
import { useLocale } from './useLocale'

const theme = ref<Theme>('dark')

export function useTheme() {
  const { show } = useToast()
  const { t }    = useLocale()

  function setTheme(t_: Theme) {
    theme.value = t_
    document.documentElement.setAttribute('data-theme', t_)
  }

  function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
    show(t('toast.switchedTheme', { theme : t(`theme.${theme.value}`) }))
  }

  return { theme, setTheme, toggle }
}
