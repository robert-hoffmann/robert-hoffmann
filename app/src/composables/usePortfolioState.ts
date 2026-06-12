/* ============================================================
   usePortfolioState - Versioned localStorage state boundary
   ============================================================
   Stores shared preferences and desktop-only session data under
   one versioned key. Older keys are intentionally ignored.
   ============================================================ */

import type {
  DesktopItem,
  Locale,
  PortfolioDesktopState,
  PortfolioSharedState,
  PortfolioState,
  Theme,
  WindowState,
} from '../types/desktop'
import {
  PORTFOLIO_STATE_KEY,
  PORTFOLIO_STATE_VERSION,
} from '../constants/portfolioState'
import { safeParse } from '../utils'

export {
  PORTFOLIO_STATE_KEY,
  PORTFOLIO_STATE_VERSION,
}

const DEFAULT_SHARED_STATE: PortfolioSharedState = {
  locale : 'en',
  theme  : 'dark',
}

function storage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'fr'
}

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}

function parseSharedState(value: unknown): PortfolioSharedState | null {
  if (!isRecord(value)) return null
  if (!isLocale(value.locale) || !isTheme(value.theme)) return null

  return {
    locale : value.locale,
    theme  : value.theme,
  }
}

function parseDesktopState(value: unknown): PortfolioDesktopState | null {
  if (!isRecord(value)) return null
  if (!Array.isArray(value.desktopItems)) return null
  if (!Array.isArray(value.windows)) return null
  if (typeof value.nextZIndex !== 'number') return null
  if (value.focusedWindowId !== null && typeof value.focusedWindowId !== 'string') return null

  return {
    desktopItems    : value.desktopItems as DesktopItem[],
    focusedWindowId : value.focusedWindowId,
    nextZIndex      : value.nextZIndex,
    windows         : value.windows as WindowState[],
  }
}

function composeState(
  shared  : PortfolioSharedState,
  desktop?: PortfolioDesktopState | null,
): PortfolioState {
  return desktop
    ? { shared, desktop }
    : { shared }
}

export function readPortfolioState(): PortfolioState | null {
  const store = storage()
  if (!store) return null

  const parsed = safeParse<unknown>(store.getItem(PORTFOLIO_STATE_KEY))
  if (!isRecord(parsed)) return null

  const shared = parseSharedState(parsed.shared)
  if (!shared) return null

  return composeState(shared, parseDesktopState(parsed.desktop))
}

export function writePortfolioState(state: PortfolioState): void {
  const store = storage()
  if (!store) return

  try {
    store.setItem(PORTFOLIO_STATE_KEY, JSON.stringify(state))
  } catch {
    /* Quota exceeded or private browsing - fail silently. */
  }
}

export function readSharedState(): PortfolioSharedState | null {
  return readPortfolioState()?.shared ?? null
}

export function writeSharedState(patch: Partial<PortfolioSharedState>): PortfolioSharedState {
  const current = readPortfolioState()
  const shared  = {
    ...DEFAULT_SHARED_STATE,
    ...current?.shared,
    ...patch,
  }

  writePortfolioState(composeState(shared, current?.desktop ?? null))
  return shared
}

export function readDesktopState(): PortfolioDesktopState | null {
  return readPortfolioState()?.desktop ?? null
}

export function writeDesktopState(desktop: PortfolioDesktopState): void {
  const current = readPortfolioState()
  const shared  = current?.shared ?? DEFAULT_SHARED_STATE

  writePortfolioState({ shared, desktop })
}

export function clearDesktopState(): void {
  const current = readPortfolioState()
  if (!current) return

  writePortfolioState({ shared : current.shared })
}
