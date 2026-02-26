/* ============================================================
   Desktop Portfolio — Core Type Definitions
   ============================================================ */

export type DesktopSpriteKey =
  | 'joystick'
  | 'video'
  | 'terminal'
  | 'social-github'
  | 'profile'
  | 'trashcan'
  | 'projects'
  | 'social-x'
  | 'music'
  | 'social-linkedin'
  | 'resume'

/** Desktop icon definition (file, folder, app, or external link) */
export interface DesktopItem {
  id       : string
  title    : string
  icon     : string
  iconUrl? : string
  iconSprite? : DesktopSpriteKey
  type     : 'file' | 'folder' | 'app' | 'link'
  col      : number
  row      : number
  url?     : string
}

export type WindowMode = 'normal' | 'minimized' | 'maximized'
export type WindowResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export interface WindowSize {
  w : number
  h : number
}

export interface WindowPoint {
  x : number
  y : number
}

export interface WindowRect extends WindowPoint, WindowSize {}

export type WindowOpenStrategy = 'cascade' | 'fixed' | 'center'

export interface WindowSizePolicyConfig {
  default? : WindowSize
  min?     : WindowSize
  max?     : WindowSize
}

export interface WindowBehaviorPolicyConfig {
  resizable?      : boolean
  movable?        : boolean
  minimizable?    : boolean
  maximizable?    : boolean
  singleInstance? : boolean
  persistGeometry?: boolean
}

export interface WindowPlacementPolicyConfig {
  openStrategy?        : WindowOpenStrategy
  defaultPosition?     : WindowPoint
  keepTitlebarVisible? : boolean
}

export interface WindowPolicyConfig {
  size?      : WindowSizePolicyConfig
  behavior?  : WindowBehaviorPolicyConfig
  placement? : WindowPlacementPolicyConfig
}

export interface ResolvedWindowPolicy {
  size : {
    default : WindowSize
    min     : WindowSize
    max     : WindowSize
  }
  behavior : {
    resizable      : boolean
    movable        : boolean
    minimizable    : boolean
    maximizable    : boolean
    singleInstance : boolean
    persistGeometry: boolean
  }
  placement : {
    openStrategy        : WindowOpenStrategy
    defaultPosition     : WindowPoint | null
    keepTitlebarVisible : boolean
  }
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
  mode        : WindowMode
  restoreBounds : WindowRect | null
  restoreMode   : Exclude<WindowMode, 'minimized'> | null
}

/** Definition for a window-app in the typed registry */
export interface WindowAppDefinition {
  id           : string
  title        : string
  icon         : string
  iconUrl?     : string
  iconSprite?  : DesktopSpriteKey
  type         : 'file' | 'folder' | 'app' | 'link'
  defaultCol   : number
  defaultRow   : number
  /** Window policy overrides (inherits manager defaults) */
  window?       : WindowPolicyConfig
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

/** Supported locales */
export type Locale = 'en' | 'fr'

/** View mode for desktop vs mobile layout */
export type ViewMode = 'desktop' | 'mobile'
export type MobileAppState = 'expanded' | 'minimized'

/** Bilingual text field — keyed by locale */
export type Localized = Record<Locale, string>

/** Serializable session state for localStorage */
export interface SessionState {
  version?        : number
  theme           : Theme
  locale          : Locale
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
  volume   : number
  muted    : boolean
}
