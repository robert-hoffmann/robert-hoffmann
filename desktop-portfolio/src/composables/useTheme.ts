/* ============================================================
   useTheme — Dark/light theme toggle composable
   ============================================================ */

import { ref } from 'vue'
import type { Theme } from '../types/desktop'
import { useToast } from './useToast'

const theme = ref<Theme>('dark')

export function useTheme() {
  const { show } = useToast()

  function setTheme(t: Theme) {
    theme.value = t
    document.documentElement.setAttribute('data-theme', t)
  }

  function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
    show(`Switched to ${theme.value} theme`)
  }

  return { theme, setTheme, toggle }
}
