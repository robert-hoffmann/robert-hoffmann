#!/usr/bin/env node
/**
 * Validate prerendered canonical HTML routes after production build.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url))
const DIST_DIR     = join(PROJECT_ROOT, 'dist')

const SITEMAP_LASTMOD_PATTERN = /^\d{4}-\d{2}-\d{2}$/u
const CURRENT_EMPLOYER_NAME = 'Maser Engineering'
const CURRENT_EMPLOYER_URL = 'https://maser-engineering.com/'
const ROOT_RUNTIME_CANONICAL_SENTINELS = [
  'Best-Fit Roles',
  'Maser Engineering operational software',
  'llms.txt',
  'sitemap.xml',
  'data-canonical-page-style',
]

async function loadModule(path) {
  const server = await createServer({
    root     : PROJECT_ROOT,
    logLevel : 'silent',
    server   : {
      middlewareMode : true,
    },
    appType  : 'custom',
  })

  try {
    return await server.ssrLoadModule(path)
  } finally {
    await server.close()
  }
}

async function distFileExists(path) {
  try {
    await readFile(join(DIST_DIR, path), 'utf8')
    return true
  } catch (error) {
    if (error && error.code === 'ENOENT') return false

    throw error
  }
}

function stripNoise(html) {
  return html
    .replace(/<noscript[\s\S]*?<\/noscript>/giu, '')
    .replace(/<script[\s\S]*?<\/script>/giu, '')
    .replace(/<style[\s\S]*?<\/style>/giu, '')
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0
}

function htmlAttribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  const match = tag.match(new RegExp(`\\b${escaped}="([^"]+)"`, 'iu'))

  return match?.[1] ?? null
}

function decodeHtmlText(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

function visibleText(html) {
  return decodeHtmlText(
    stripNoise(html)
      .replace(/<[^>]+>/gu, ' ')
      .replace(/\s+/gu, ' ')
      .trim(),
  )
}

function expectedLanguageText(route) {
  if (route.locale === 'fr') {
    return [
      'A propos',
      'Brief recrutement',
      'Positionnement IA',
      'Identite technique',
      'Contexte projet',
      'Angle de preuve',
      'Pages projet canoniques',
    ]
  }

  return [
    'About',
    'Hiring brief',
    'AI framing',
    'Technical identity',
    'Project context',
    'Proof angle',
    'Canonical project pages',
  ]
}

function forbiddenLanguageText(route) {
  if (route.locale === 'fr') {
    return [
      'Best-Fit Roles',
      'Best-fit roles',
      'Best Environments',
      'Best environments',
      'Strongest Proof Points',
      'Strongest proof points',
      'Technical Identity',
      'Technical identity',
      'AI Framing',
      'AI framing',
      'Project Context',
      'Project context',
      'Proof Angle',
      'Proof angle',
      'Canonical Project Pages',
      'Canonical project pages',
    ]
  }

  return [
    'Roles les plus adaptes',
    'Environnements les plus adaptes',
    'Points de preuve les plus forts',
    'Identite technique',
    'Positionnement IA',
    'Contexte projet',
    'Angle de preuve',
    'Pages projet canoniques',
  ]
}

function routeUrl(siteUrl, path) {
  return path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`
}

function sitemapLastmods(content) {
  return [...content.matchAll(/<lastmod>([^<]+)<\/lastmod>/giu)]
    .map(match => match[1])
}

function extractSitemapLastmod(content) {
  return sitemapLastmods(content)[0] ?? null
}

function validateSitemapLastmods(content, errors) {
  const urlCount = [...content.matchAll(/<url>/giu)].length
  const lastmods = sitemapLastmods(content)
  const uniqueLastmods = new Set(lastmods)

  if (!lastmods.length) {
    errors.push('dist/sitemap.xml is missing <lastmod> entries.')
    return
  }

  if (lastmods.length !== urlCount) {
    errors.push('dist/sitemap.xml must include exactly one <lastmod> per <url>.')
  }

  for (const lastmod of lastmods) {
    if (!SITEMAP_LASTMOD_PATTERN.test(lastmod)) {
      errors.push(`dist/sitemap.xml has invalid <lastmod> date: ${lastmod}`)
    }
  }

  if (uniqueLastmods.size > 1) {
    errors.push('dist/sitemap.xml should use one build-date <lastmod> value across generated routes.')
  }
}

function extractJsonLd(html) {
  const matches = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)]

  return matches.map(match => JSON.parse(match[1]))
}

function jsonLdNodes(blocks) {
  return blocks.flatMap((block) => {
    if (Array.isArray(block?.['@graph'])) return block['@graph']

    return [block]
  })
}

function personJsonLd(blocks) {
  return jsonLdNodes(blocks).find((node) => {
    const type = node?.['@type']

    return type === 'Person' || (Array.isArray(type) && type.includes('Person'))
  })
}

function hasMetaDescription(html) {
  return /<meta\b(?=[^>]*\bname="description")(?=[^>]*\bcontent="[^"]+")[^>]*>/iu.test(html)
}

function metaDescriptionContent(html) {
  const match = html.match(/<meta\b(?=[^>]*\bname="description")[^>]*>/iu)

  if (!match) return null

  const content = match[0].match(/\bcontent="([^"]*)"/iu)

  return content ? decodeHtmlText(content[1]) : null
}

function hasMetaName(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

  return new RegExp(`<meta\\b(?=[^>]*\\bname="${escaped}")(?=[^>]*\\bcontent="[^"]+")[^>]*>`, 'iu').test(html)
}

function hasMetaProperty(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

  return new RegExp(`<meta\\b(?=[^>]*\\bproperty="${escaped}")(?=[^>]*\\bcontent="[^"]+")[^>]*>`, 'iu').test(html)
}

function hasCanonical(html, canonicalUrl) {
  const escaped = canonicalUrl.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

  return new RegExp(`<link\\b(?=[^>]*\\brel="canonical")(?=[^>]*\\bhref="${escaped}")[^>]*>`, 'iu').test(html)
}

function hasHtmlLang(html, lang) {
  const escaped = lang.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

  return new RegExp(`<html\\b(?=[^>]*\\blang="${escaped}")[^>]*>`, 'iu').test(html)
}

function hasAlternate(html, hreflang, href) {
  const escapedLang = hreflang.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

  return new RegExp(
    `<link\\b(?=[^>]*\\brel="alternate")(?=[^>]*\\bhreflang="${escapedLang}")(?=[^>]*\\bhref="${escapedHref}")[^>]*>`,
    'iu',
  ).test(html)
}

function hasInteractivePreload(html) {
  return html.includes('data-interactive-preload="true"')
}

function hasHiddenPrerenderRoot(html) {
  return /<main\b(?=[^>]*\bdata-prerender-root\b)(?=[^>]*\bdata-prerender-hidden="true")[^>]*>/iu.test(html)
}

function hasAppBootAsset(html) {
  return html.includes('data-app-boot="true"') ||
    /<script\b(?=[^>]*\btype="module")[^>]*><\/script>/iu.test(html) ||
    /<link\b(?=[^>]*\brel="modulepreload")[^>]*>/iu.test(html) ||
    /<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="style")[^>]*>/iu.test(html)
}

function hasAppThemeBootMarker(html) {
  return /<html\b(?=[^>]*\bdata-theme=)[^>]*>/iu.test(html) ||
    /<meta\b(?=[^>]*\bid="app-theme-color-meta")[^>]*>/iu.test(html) ||
    /<meta\b(?=[^>]*\bname="color-scheme")(?=[^>]*\bcontent="dark light")[^>]*>/iu.test(html)
}

function hasStaticColorScheme(html) {
  return /<meta\b(?=[^>]*\bname="color-scheme")(?=[^>]*\bcontent="light")[^>]*>/iu.test(html)
}

function rootLoadedScriptAssetPaths(html) {
  const paths = new Set()
  const tags = [
    ...html.matchAll(/<script\b[^>]*\bsrc="[^"]+"[^>]*>/giu),
    ...html.matchAll(/<link\b(?=[^>]*\brel="modulepreload")[^>]*\bhref="[^"]+"[^>]*>/giu),
  ]

  for (const [tag] of tags) {
    const source = htmlAttribute(tag, 'src') ?? htmlAttribute(tag, 'href')

    if (!source) continue

    const path = new URL(source, 'https://i-technology.net/').pathname

    if (/^\/assets\/.+\.js$/iu.test(path)) {
      paths.add(path.replace(/^\//u, ''))
    }
  }

  return [...paths]
}

function hasLanguageSwitcherBeforeH1(html) {
  const languageNavIndex = html.indexOf('canonical-language-nav')
  const h1Index = html.search(/<h1\b/iu)

  return languageNavIndex >= 0 && h1Index >= 0 && languageNavIndex < h1Index
}

function hasLanguageSwitcherFlags(html) {
  return html.includes('🇬🇧') && html.includes('🇫🇷')
}

function hasCurrentLocaleLanguageLink(html, locale) {
  const escapedLocale = locale.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

  return new RegExp(
    `<a\\b(?=[^>]*\\bhreflang="${escapedLocale}")(?=[^>]*\\baria-current="page")[^>]*>`,
    'iu',
  ).test(html)
}

function validateRouteShell(html, route, path, errors) {
  if (!html.includes('data-canonical-route="true"')) {
    errors.push(`${path} is missing data-canonical-route marker.`)
  }

  if (!html.includes(`data-route-locale="${route.locale}"`)) {
    errors.push(`${path} is missing data-route-locale="${route.locale}".`)
  }

  if (!html.includes('data-canonical-scroll="true"')) {
    errors.push(`${path} is missing canonical scroll style marker.`)
  }

  if (!html.includes('data-canonical-page-style="true"')) {
    errors.push(`${path} is missing canonical page style marker.`)
  }

  if (!hasLanguageSwitcherBeforeH1(html)) {
    errors.push(`${path} must render the language switcher before the H1.`)
  }

  if (!hasLanguageSwitcherFlags(html)) {
    errors.push(`${path} must render flag icons in the language switcher.`)
  }

  if (!hasCurrentLocaleLanguageLink(html, route.locale)) {
    errors.push(`${path} must mark the current locale language link.`)
  }

  if (route.kind === 'home' && route.isXDefault) {
    if (!hasHiddenPrerenderRoot(html)) {
      errors.push('/ must keep hidden prerender fallback content for JS users.')
    }

    if (!hasInteractivePreload(html)) {
      errors.push('/ must keep interactive media preloads.')
    }

    if (!hasAppBootAsset(html)) {
      errors.push('/ must keep app boot assets for the interactive portfolio.')
    }

    if (!hasAppThemeBootMarker(html)) {
      errors.push('/ must keep app theme boot markers for the interactive portfolio.')
    }

    return
  }

  if (hasHiddenPrerenderRoot(html)) {
    errors.push(`${path} must not hide text-first canonical content.`)
  }

  if (hasInteractivePreload(html)) {
    errors.push(`${path} must not include interactive media preloads.`)
  }

  if (hasAppBootAsset(html)) {
    errors.push(`${path} must not include app boot JavaScript or stylesheet assets.`)
  }

  if (hasAppThemeBootMarker(html)) {
    errors.push(`${path} must not include root app theme boot markers.`)
  }

  if (!hasStaticColorScheme(html)) {
    errors.push(`${path} must declare a light static color scheme.`)
  }
}

function validateCurrentEmployerSeo(html, jsonLdBlocks, route, path, text, errors) {
  const person = personJsonLd(jsonLdBlocks)

  if (!person) {
    errors.push(`${path} JSON-LD is missing a Person node.`)
    return
  }

  if (person.worksFor?.name !== CURRENT_EMPLOYER_NAME) {
    errors.push(`${path} JSON-LD Person.worksFor.name must be "${CURRENT_EMPLOYER_NAME}".`)
  }

  if (person.worksFor?.url !== CURRENT_EMPLOYER_URL) {
    errors.push(`${path} JSON-LD Person.worksFor.url must be "${CURRENT_EMPLOYER_URL}".`)
  }

  if (!text.includes(CURRENT_EMPLOYER_NAME)) {
    errors.push(`${path} visible route text must include "${CURRENT_EMPLOYER_NAME}".`)
  }

  if (route.kind === 'home' || route.kind === 'hiring-brief') {
    const description = metaDescriptionContent(html) ?? ''

    if (!description.includes(CURRENT_EMPLOYER_NAME)) {
      errors.push(`${path} meta description must include "${CURRENT_EMPLOYER_NAME}".`)
    }

    if (!description.includes('Toulouse')) {
      errors.push(`${path} meta description must include "Toulouse".`)
    }
  }
}

async function validateRootRuntimeBundleBoundary(errors) {
  const rootHtml = await readFile(join(DIST_DIR, 'index.html'), 'utf8')
  const assetPaths = rootLoadedScriptAssetPaths(rootHtml)

  for (const assetPath of assetPaths) {
    const content = await readFile(join(DIST_DIR, assetPath), 'utf8')

    for (const sentinel of ROOT_RUNTIME_CANONICAL_SENTINELS) {
      if (content.includes(sentinel)) {
        errors.push(`Root runtime asset ${assetPath} includes canonical-only content: ${sentinel}`)
      }
    }
  }
}

async function main() {
  const canonical = await loadModule('/src/data/portfolio/canonical.ts')
  const routes = await loadModule('/src/data/portfolio/projectRoutes.ts')
  const errors = []

  for (const path of routes.prerenderRoutePaths) {
    const htmlPath = join(DIST_DIR, canonical.routePathToDistHtmlPath(path))
    const html = await readFile(htmlPath, 'utf8')
    const withoutNoise = stripNoise(html)
    const canonicalUrl = canonical.routeCanonicalUrl(path)
    const route = routes.resolveCanonicalRoute(path)

    if (!route) {
      errors.push(`${path} does not resolve to a canonical route.`)
      continue
    }

    if (countMatches(withoutNoise, /<h1\b/giu) !== 1) {
      errors.push(`${path} must contain exactly one visible prerendered H1.`)
    }

    if (!/<title>[^<]+<\/title>/iu.test(html)) {
      errors.push(`${path} is missing a title.`)
    }

    if (!hasMetaDescription(html)) {
      errors.push(`${path} is missing a meta description.`)
    }

    if (!hasCanonical(html, canonicalUrl)) {
      errors.push(`${path} is missing canonical URL ${canonicalUrl}.`)
    }

    if (!hasHtmlLang(html, route.locale)) {
      errors.push(`${path} is missing html lang="${route.locale}".`)
    }

    validateRouteShell(html, route, path, errors)

    const text = visibleText(html)
    const expectedText = expectedLanguageText(route)

    if (!expectedText.some(value => text.includes(value))) {
      errors.push(`${path} does not contain expected ${route.locale} canonical route wording.`)
    }

    for (const forbidden of forbiddenLanguageText(route)) {
      if (text.includes(forbidden)) {
        errors.push(`${path} contains opposite-language canonical wording: ${forbidden}`)
      }
    }

    for (const alternate of canonical.alternateRouteUrls(path)) {
      if (!hasAlternate(html, alternate.hreflang, alternate.href)) {
        errors.push(`${path} is missing hreflang ${alternate.hreflang} -> ${alternate.href}.`)
      }
    }

    for (const property of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image']) {
      if (!hasMetaProperty(html, property)) {
        errors.push(`${path} is missing ${property}.`)
      }
    }

    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      if (!hasMetaName(html, name)) {
        errors.push(`${path} is missing ${name}.`)
      }
    }

    const jsonLdBlocks = extractJsonLd(html)

    if (!jsonLdBlocks.length) {
      errors.push(`${path} is missing JSON-LD.`)
    }

    validateCurrentEmployerSeo(html, jsonLdBlocks, route, path, text, errors)

    if (route?.kind === 'project') {
      const jsonLdText = JSON.stringify(jsonLdBlocks)

      for (const highlight of route.project.highlights) {
        const label = highlight.label[route.locale]

        if (highlight.schemaVisibility === 'exclude' && jsonLdText.includes(label)) {
          errors.push(`${path} JSON-LD includes excluded highlight "${label}".`)
        }

        if (highlight.schemaVisibility === 'visible' && jsonLdText.includes(label) && !text.includes(label)) {
          errors.push(`${path} JSON-LD highlight "${label}" is not visible in route text.`)
        }
      }
    }
  }

  await validateRootRuntimeBundleBoundary(errors)

  const distSitemap = await readFile(join(DIST_DIR, 'sitemap.xml'), 'utf8')
  const sitemapLastmod = extractSitemapLastmod(distSitemap)
  const expectedSitemap = canonical
    .buildPublicArtifacts({ sitemapLastmod: sitemapLastmod ?? canonical.formatSitemapLastmod() })
    .find(artifact => artifact.path === 'sitemap.xml')?.content

  validateSitemapLastmods(distSitemap, errors)

  if (distSitemap !== expectedSitemap) {
    errors.push('dist/sitemap.xml does not match generated sitemap artifact.')
  }

  const sitemapUrls = [...distSitemap.matchAll(/<loc>([^<]+)<\/loc>/giu)]
    .map(match => match[1])
  const expectedUrls = routes.sitemapRoutePaths.map(path => routeUrl(canonical.siteUrl, path))

  for (const url of sitemapUrls) {
    if (/\.(?:json|md|txt|xml)$/iu.test(new URL(url).pathname)) {
      errors.push(`Sitemap contains non-HTML route: ${url}`)
    }
  }

  if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) {
    errors.push('Sitemap URL list does not match canonical HTML routes.')
  }

  const removedAliasPaths = [
    routes.projectIndexPath,
    ...routes.routeEnabledProjects.map(project => project.route.path),
    routes.hiringBriefPath,
  ]

  for (const aliasPath of removedAliasPaths) {
    const htmlPath = canonical.routePathToDistHtmlPath(aliasPath)

    if (await distFileExists(htmlPath)) {
      errors.push(`Removed unprefixed canonical alias still exists in dist: ${htmlPath}`)
    }
  }

  if (errors.length) {
    console.error(errors.map(error => `- ${error}`).join('\n'))
    process.exitCode = 1
    return
  }

  console.log(`validated ${routes.prerenderRoutePaths.length} prerendered HTML routes`)
}

await main()
