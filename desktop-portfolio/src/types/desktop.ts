/* ============================================================
   Desktop Portfolio — Core Type Definitions
   ============================================================ */

/** Desktop icon definition (file, folder, app, or external link) */
export interface DesktopItem {
  id       : string
  title    : string
  icon     : string
  iconUrl? : string
  type     : 'file' | 'folder' | 'app' | 'link'
  col      : number
  row      : number
  url?     : string
}

/** Runtime window state managed by the window manager */
export interface WindowState {
  id          : string
  itemId      : string
  title       : string
  x           : number
  y           : number
  w           : number
  h           : number
  zIndex      : number
  isMinimized : boolean
}

/** Definition for a window-app in the typed registry */
export interface WindowAppDefinition {
  id           : string
  title        : string
  icon         : string
  iconUrl?     : string
  type         : 'file' | 'folder' | 'app' | 'link'
  defaultCol   : number
  defaultRow   : number
  defaultWidth : number
  defaultHeight   : number
  /** Lazy-loaded component for the window content (omit for links) */
  component?     : () => Promise<{ default: import('vue').Component }>
  /** Optional props forwarded to the content component */
  componentProps?: Record<string, unknown>
  /** External URL opened in a new tab (type === 'link') */
  url?           : string
}

/** Menu item (action or separator) */
export type MenuItem =
  | { type : 'separator' }
  | {
      id        : string
      label     : string
      shortcut? : string
      action    : string
      disabled? : boolean
    }

/** Top-level menu group */
export interface MenuGroup {
  label : string
  items : MenuItem[]
}

/** Theme variant */
export type Theme = 'dark' | 'light'

/** Serializable session state for localStorage */
export interface SessionState {
  theme           : Theme
  desktopItems    : DesktopItem[]
  focusedWindowId : string | null
  nextZIndex      : number
  windows         : WindowState[]
}

/** GeoWars game state (read from game engine) */
export interface GameState {
  score    : number
  wave     : number
  lives    : number
  paused   : boolean
  gameOver : boolean
}

/** Music player state (native audio) */
export interface MusicPlayerState {
  playing  : boolean
  paused   : boolean
  loop     : boolean
  elapsed  : number
  duration : number
}
