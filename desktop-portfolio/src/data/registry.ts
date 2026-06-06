/* ============================================================
   Window App Registry — Typed Registry + Desktop Items
   ============================================================
   Each entry maps a desktop item ID to its metadata and
   lazy-loaded component. Adding a new window = add one entry.
   ============================================================ */

import { defineAsyncComponent } from 'vue'
import type { DesktopItem, Locale, WindowAppDefinition } from '../types/desktop'
import { resolveInterfaceMessage } from './interface'

/** Resolve a registry entry's title for the given locale */
export function getRegistryTitle(id: string, locale: Locale): string {
  const def = windowRegistry[id]

  return def ? resolveInterfaceMessage(def.titleKey, locale) : id
}

/** Resolve a desktop/mobile shortcut label without changing the window title */
export function getRegistryIconTitle(id: string, locale: Locale): string {
  const def = windowRegistry[id]

  if (!def) return id

  return resolveInterfaceMessage(def.iconTitleKey ?? def.titleKey, locale)
}

/* ----------------------------------------------------------
   Window Registry
   Each entry's `component` uses dynamic import() for code splitting.
   Three.js deps only load when their window opens.
   ---------------------------------------------------------- */
export const windowRegistry: Record<string, WindowAppDefinition> = {
  about : {
    id            : 'about',
    titleKey      : 'registry.about.title',
    icon          : '👤',
    iconUrl       : `${import.meta.env.BASE_URL}profile-icon.webp`,
    iconSprite    : 'profile',
    type          : 'file',
    defaultCol    : 1,
    defaultRow    : 1,
    window        : {
      size : {
        default : { w : 497, h : 794 },
        min     : { w : 455, h : 520 },
        max     : { w : 720, h : 980 },
      },
    },
    component     : () => import('../components/AboutApp.vue'),
  },
  projects : {
    id            : 'projects',
    titleKey      : 'registry.projects.title',
    iconTitleKey  : 'registry.projects.iconTitle',
    icon          : '📂',
    iconSprite    : 'projects',
    type          : 'folder',
    defaultCol    : 1,
    defaultRow    : 2,
    window        : {
      size : {
        default : { w : 469, h : 691 },
        min     : { w : 430, h : 420 },
        max     : { w : 755, h : 1100 },
      },
    },
    component     : () => import('../components/ProjectsApp.vue'),
  },
  resume : {
    id            : 'resume',
    titleKey      : 'registry.resume.title',
    icon          : '📄',
    iconSprite    : 'resume',
    type          : 'file',
    defaultCol    : 14,
    defaultRow    : 2,
    window        : {
      size : {
        default : { w : 546, h : 760 },
        min     : { w : 480, h : 540 },
        max     : { w : 830, h : 1100 },
      },
    },
    component     : () => import('../components/ResumeApp.vue'),
  },
  twitter : {
    id            : 'twitter',
    titleKey      : 'registry.twitter.title',
    icon          : '𝕏',
    iconUrl       : `${import.meta.env.BASE_URL}icons/x.svg`,
    iconSprite    : 'social-x',
    type          : 'link',
    defaultCol    : 14,
    defaultRow    : 4,
    url           : 'https://x.com/itechnologynet',
  },
  linkedin : {
    id            : 'linkedin',
    titleKey      : 'registry.linkedin.title',
    icon          : '💼',
    iconUrl       : `${import.meta.env.BASE_URL}icons/linkedin.svg`,
    iconSprite    : 'social-linkedin',
    type          : 'link',
    defaultCol    : 14,
    defaultRow    : 5,
    url           : 'https://www.linkedin.com/in/hoffmannrobert',
  },
  github : {
    id            : 'github',
    titleKey      : 'registry.github.title',
    icon          : '🐙',
    iconUrl       : `${import.meta.env.BASE_URL}icons/github.svg`,
    iconSprite    : 'social-github',
    type          : 'link',
    defaultCol    : 14,
    defaultRow    : 6,
    url           : 'https://github.com/robert-hoffmann',
  },

  extras : {
    id            : 'extras',
    titleKey      : 'registry.extras.title',
    icon          : '🕹️',
    iconSprite    : 'joystick',
    type          : 'app',
    defaultCol    : 1,
    defaultRow    : 5,
    window        : {
      size : {
        default : { w : 720, h : 550 },
        min     : { w : 550, h : 440 },
        max     : { w : 1200, h : 900 },
      },
    },
    component     : () => import('../components/GeoWarsApp.vue'),
  },
  music : {
    id            : 'music',
    titleKey      : 'registry.music.title',
    icon          : '🎵',
    iconSprite    : 'music',
    type          : 'app',
    defaultCol    : 1,
    defaultRow    : 8,
    window        : {
      size : {
        default : { w : 388, h : 203 },
        min     : { w : 388, h : 203 },
        max     : { w : 388, h : 203 },
      },
      behavior : {
        resizable   : false,
        maximizable : false,
      },
      placement : {
        openStrategy    : 'fixed',
        defaultPosition : { x : 672, y : 580 },
      },
    },
    component       : () => import('../components/MusicApp.vue'),
    /* Mobile uses the unified media-player wrapper; desktop keeps the original app UI. */
    mobileComponent : () => import('../components/mobile/MobileUnifiedMediaApp.vue'),
    mobileComponentProps : {
      preset : 'music',
    },
  },
  video : {
    id            : 'video',
    titleKey      : 'registry.video.title',
    icon          : '📺',
    iconSprite    : 'video',
    type          : 'app',
    defaultCol    : 1,
    defaultRow    : 7,
    window        : {
      size : {
        default : { w : 466, h : 393 },
        min     : { w : 460, h : 340 },
        max     : { w : 1280, h : 900 },
      },
    },
    component       : () => import('../components/VideoApp.vue'),
    /* Mobile uses the unified media-player wrapper; desktop keeps the original app UI. */
    mobileComponent : () => import('../components/mobile/MobileUnifiedMediaApp.vue'),
    mobileComponentProps : {
      preset : 'video',
    },
  },
  terminal : {
    id            : 'terminal',
    titleKey      : 'registry.terminal.title',
    icon          : '>_',
    iconUrl       : `${import.meta.env.BASE_URL}icons/terminal.svg`,
    iconSprite    : 'terminal',
    type          : 'app',
    defaultCol    : 1,
    defaultRow    : 4,
    window        : {
      size : {
        default : { w : 615, h : 380 },
        min     : { w : 615, h : 380 },
        max     : { w : 1600, h : 1000 },
      },
      behavior : {
        maximizable : true,
      },
    },
    component     : () => import('../components/TerminalApp.vue'),
  },
  gallery : {
    id            : 'gallery',
    titleKey      : 'registry.gallery.title',
    iconTitleKey  : 'registry.gallery.iconTitle',
    icon          : '▧',
    iconUrl       : `${import.meta.env.BASE_URL}icons/gallery.webp`,
    type          : 'app',
    defaultCol    : 3,
    defaultRow    : 8,
    window        : {
      size : {
        default : { w : 760, h : 590 },
        min     : { w : 520, h : 390 },
        max     : { w : 1180, h : 900 },
      },
      placement : {
        openStrategy    : 'fixed',
        defaultPosition : { x : 594, y : 65 },
      },
    },
    component     : () => import('../components/ImageViewerApp.vue'),
  },  
}

/** Resolve a registry entry's component as a Vue async component */
export function resolveAppComponent(id: string) {
  const def = windowRegistry[id]
  if (!def?.component) return null
  return defineAsyncComponent(def.component)
}

/* ----------------------------------------------------------
   Default Desktop Items (derived from registry)
   ---------------------------------------------------------- */
export function getDefaultDesktopItems(locale: Locale = 'en'): DesktopItem[] {
  return Object.values(windowRegistry).map(def => ({
    id         : def.id,
    title      : getRegistryIconTitle(def.id, locale),
    icon       : def.icon,
    iconUrl    : def.iconUrl,
    iconSprite : def.iconSprite,
    type       : def.type,
    col        : def.defaultCol,
    row        : def.defaultRow,
    url        : def.url,
  }))
}
