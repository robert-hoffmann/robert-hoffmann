/* ============================================================
   Window App Registry — Typed Registry + Desktop Items
   ============================================================
   Each entry maps a desktop item ID to its metadata and
   lazy-loaded component. Adding a new window = add one entry.
   ============================================================ */

import { defineAsyncComponent } from 'vue'
import type { DesktopItem, Locale, WindowAppDefinition } from '../types/desktop'

/* ----------------------------------------------------------
   Localized window titles — keyed by registry ID
   ---------------------------------------------------------- */
const titles: Record<string, Record<Locale, string>> = {
  about    : { en : 'About Me',      fr : 'À propos' },
  projects : { en : 'Projects',      fr : 'Projets' },
  resume   : { en : 'Resume',        fr : 'CV' },
  twitter  : { en : 'X',             fr : 'X' },
  linkedin : { en : 'LinkedIn',      fr : 'LinkedIn' },
  github   : { en : 'GitHub',        fr : 'GitHub' },
  extras   : { en : 'GeoWars.app',   fr : 'GeoWars.app' },
  music    : { en : 'Music',         fr : 'Musique' },
  video    : { en : 'Video',         fr : 'Vidéo' },
  terminal : { en : 'Terminal',      fr : 'Terminal' },
}

/** Resolve a registry entry's title for the given locale */
export function getRegistryTitle(id: string, locale: Locale): string {
  return titles[id]?.[locale] ?? windowRegistry[id]?.title ?? id
}

/* ----------------------------------------------------------
   Window Registry
   Each entry's `component` uses dynamic import() for code splitting.
   Three.js deps only load when their window opens.
   ---------------------------------------------------------- */
export const windowRegistry: Record<string, WindowAppDefinition> = {
  about : {
    id            : 'about',
    title         : 'About Me',
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
    title         : 'Projects',
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
    title         : 'Resume',
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
    title         : 'X',
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
    title         : 'LinkedIn',
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
    title         : 'GitHub',
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
    title         : 'GeoWars.app',
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
    title         : 'Music',
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
    title         : 'Video',
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
    title         : 'Terminal',
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
    id      : def.id,
    title   : getRegistryTitle(def.id, locale),
    icon    : def.icon,
    iconUrl : def.iconUrl,
    iconSprite : def.iconSprite,
    type    : def.type,
    col     : def.defaultCol,
    row     : def.defaultRow,
    url     : def.url,
  }))
}
