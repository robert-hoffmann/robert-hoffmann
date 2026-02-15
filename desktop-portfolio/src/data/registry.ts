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
    type          : 'file',
    defaultCol    : 1,
    defaultRow    : 1,
    defaultWidth  : 497,
    defaultHeight : 794,
    component     : () => import('../components/AboutApp.vue'),
  },
  projects : {
    id            : 'projects',
    title         : 'Projects',
    icon          : '📂',
    type          : 'folder',
    defaultCol    : 1,
    defaultRow    : 2,
    defaultWidth  : 469,
    defaultHeight : 691,
    component     : () => import('../components/ProjectsApp.vue'),
  },
  resume : {
    id            : 'resume',
    title         : 'Resume',
    icon          : '📄',
    type          : 'file',
    defaultCol    : 14,
    defaultRow    : 2,
    defaultWidth  : 546,
    defaultHeight : 760,
    component     : () => import('../components/ResumeApp.vue'),
  },
  twitter : {
    id            : 'twitter',
    title         : 'X',
    icon          : '𝕏',
    iconUrl       : `${import.meta.env.BASE_URL}icons/x.svg`,
    type          : 'link',
    defaultCol    : 14,
    defaultRow    : 4,
    defaultWidth  : 0,
    defaultHeight : 0,
    url           : 'https://x.com/itechnologynet',
  },
  linkedin : {
    id            : 'linkedin',
    title         : 'LinkedIn',
    icon          : '💼',
    iconUrl       : `${import.meta.env.BASE_URL}icons/linkedin.svg`,
    type          : 'link',
    defaultCol    : 14,
    defaultRow    : 5,
    defaultWidth  : 0,
    defaultHeight : 0,
    url           : 'https://www.linkedin.com/in/hoffmannrobert',
  },
  github : {
    id            : 'github',
    title         : 'GitHub',
    icon          : '🐙',
    iconUrl       : `${import.meta.env.BASE_URL}icons/github.svg`,
    type          : 'link',
    defaultCol    : 14,
    defaultRow    : 6,
    defaultWidth  : 0,
    defaultHeight : 0,
    url           : 'https://github.com/robert-hoffmann',
  },

  extras : {
    id            : 'extras',
    title         : 'GeoWars.app',
    icon          : '🕹️',
    type          : 'app',
    defaultCol    : 1,
    defaultRow    : 5,
    defaultWidth  : 560,
    defaultHeight : 420,
    component     : () => import('../components/GeoWarsApp.vue'),
  },
  music : {
    id            : 'music',
    title         : 'Music',
    icon          : '🎵',
    type          : 'app',
    defaultCol    : 1,
    defaultRow    : 8,
    defaultWidth  : 388,
    defaultHeight : 227,
    resizable     : false,
    component     : () => import('../components/MusicApp.vue'),
  },
  video : {
    id            : 'video',
    title         : 'Video',
    icon          : '📺',
    type          : 'app',
    defaultCol    : 1,
    defaultRow    : 7,
    defaultWidth  : 466,
    defaultHeight : 388,
    component     : () => import('../components/VideoApp.vue'),
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
    type    : def.type,
    col     : def.defaultCol,
    row     : def.defaultRow,
    url     : def.url,
  }))
}
