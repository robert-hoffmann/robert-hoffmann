import { inject, type InjectionKey, type Ref } from 'vue'
import type { WindowContentState } from '../types/desktop'

export interface WindowContentStateBridge {
  state : Readonly<Ref<WindowContentState | null>>
  patch : (patch: Partial<WindowContentState>) => void
}

export const windowContentStateKey: InjectionKey<WindowContentStateBridge> = Symbol('windowContentState')

export function useWindowContentState(): WindowContentStateBridge | null {
  return inject(windowContentStateKey, null)
}
