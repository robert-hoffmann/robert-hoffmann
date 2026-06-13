import {
  buildRouteHead,
  renderCanonicalRouteHtml,
} from './src/data/portfolio/canonical.ts'
import {
  normalizeCanonicalPath,
  prerenderRoutePaths,
} from './src/data/portfolio/projectRoutes.ts'

interface PrerenderArgs {
  url?: string
}

export function prerender(args: PrerenderArgs = {}) {
  const currentPath = normalizeCanonicalPath(args.url ?? '/')

  return {
    html  : renderCanonicalRouteHtml(currentPath),
    links : new Set(prerenderRoutePaths.filter(path => path !== currentPath)),
    head  : buildRouteHead(currentPath),
  }
}
