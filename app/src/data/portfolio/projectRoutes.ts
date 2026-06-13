import { projects, type Project } from '../apps/projects'
import type { Locale } from '../../types/desktop'

export type RouteEnabledProject = Project & { route: NonNullable<Project['route']> }

export const canonicalLocales = ['en', 'fr'] as const satisfies readonly Locale[]
export const defaultCanonicalLocale = 'en' satisfies Locale
export const xDefaultPath = '/'

export type CanonicalRoute =
  | {
      kind       : 'home'
      path       : `/${string}`
      basePath   : '/'
      locale     : Locale
      isXDefault : boolean
      isAlias    : boolean
    }
  | {
      kind       : 'project-index'
      path       : `/${string}`
      basePath   : '/projects/'
      locale     : Locale
      isXDefault : false
      isAlias    : boolean
    }
  | {
      kind       : 'hiring-brief'
      path       : `/${string}`
      basePath   : '/hiring-brief/'
      locale     : Locale
      isXDefault : false
      isAlias    : boolean
    }
  | {
      kind       : 'project'
      path       : `/${string}`
      basePath   : `/${string}/`
      locale     : Locale
      isXDefault : false
      isAlias    : boolean
      project    : RouteEnabledProject
    }

export const projectIndexPath = '/projects/'
export const hiringBriefPath = '/hiring-brief/'

export const routeEnabledProjects = projects.filter(
  (project): project is RouteEnabledProject => project.route !== undefined,
)

export const baseCanonicalRoutePaths = [
  '/',
  projectIndexPath,
  ...routeEnabledProjects.map(project => project.route.path),
  hiringBriefPath,
]

export const localizedCanonicalRoutePaths = canonicalLocales.flatMap(locale =>
  baseCanonicalRoutePaths.map(path => localizedCanonicalPath(path, locale)),
)

export const canonicalRoutePaths = [
  xDefaultPath,
  ...localizedCanonicalRoutePaths,
] as const

export const prerenderRoutePaths = canonicalRoutePaths

export const sitemapRoutePaths = canonicalRoutePaths

export function normalizeCanonicalPath(pathname: string): `/${string}` {
  const pathWithoutSearch = pathname.split(/[?#]/, 1)[0] || '/'
  const withLeadingSlash = pathWithoutSearch.startsWith('/')
    ? pathWithoutSearch
    : `/${pathWithoutSearch}`
  const withoutIndex = withLeadingSlash.replace(/\/index\.html$/u, '/')

  if (withoutIndex === '/') return '/'
  if (withoutIndex.endsWith('/')) return withoutIndex as `/${string}`

  return `${withoutIndex}/` as `/${string}`
}

export function localizedCanonicalPath(pathname: string, locale: Locale): `/${string}` {
  const basePath = normalizeCanonicalPath(pathname)

  if (basePath === '/') return `/${locale}/`

  return `/${locale}${basePath}` as `/${string}`
}

interface ParsedCanonicalPath {
  path       : `/${string}`
  basePath   : `/${string}`
  locale     : Locale
  isXDefault : boolean
  isAlias    : boolean
}

function parseCanonicalPath(pathname: string): ParsedCanonicalPath {
  const path = normalizeCanonicalPath(pathname)

  if (path === xDefaultPath) {
    return {
      path,
      basePath   : '/',
      locale     : defaultCanonicalLocale,
      isXDefault : true,
      isAlias    : false,
    }
  }

  const match = /^\/(en|fr)(\/.*)?$/u.exec(path)

  if (match) {
    return {
      path,
      basePath   : normalizeCanonicalPath(match[2] ?? '/'),
      locale     : match[1] as Locale,
      isXDefault : false,
      isAlias    : false,
    }
  }

  return {
    path,
    basePath   : path,
    locale     : defaultCanonicalLocale,
    isXDefault : false,
    isAlias    : true,
  }
}

export function resolveCanonicalRoute(pathname: string): CanonicalRoute | null {
  const parsed = parseCanonicalPath(pathname)
  const { basePath, isAlias, isXDefault, locale, path } = parsed

  if (isAlias) return null

  if (basePath === '/') {
    return {
      kind : 'home',
      path,
      basePath,
      locale,
      isXDefault,
      isAlias,
    }
  }

  if (basePath === projectIndexPath) {
    return {
      kind       : 'project-index',
      path,
      basePath,
      locale,
      isXDefault : false,
      isAlias,
    }
  }

  if (basePath === hiringBriefPath) {
    return {
      kind       : 'hiring-brief',
      path,
      basePath,
      locale,
      isXDefault : false,
      isAlias,
    }
  }

  const project = routeEnabledProjects.find(item => item.route.path === basePath)

  if (!project) return null

  return {
    kind       : 'project',
    path,
    basePath   : project.route.path,
    locale,
    isXDefault : false,
    isAlias,
    project,
  }
}
