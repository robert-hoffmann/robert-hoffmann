#!/usr/bin/env node
/**
 * Validate canonical portfolio content and generated public artifacts.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url))
const PUBLIC_DIR   = join(PROJECT_ROOT, 'public')

const REMOVED_PUBLIC_ARTIFACTS = [
  'hiring-brief.md',
]

const SITEMAP_LASTMOD_PATTERN = /^\d{4}-\d{2}-\d{2}$/u

async function loadCanonicalContent() {
  const server = await createServer({
    root     : PROJECT_ROOT,
    logLevel : 'silent',
    server   : {
      middlewareMode : true,
    },
    appType  : 'custom',
  })

  try {
    return await server.ssrLoadModule('/src/data/portfolio/canonical.ts')
  } finally {
    await server.close()
  }
}

async function readExistingArtifact(path) {
  try {
    return await readFile(join(PUBLIC_DIR, path), 'utf8')
  } catch (error) {
    if (error && error.code === 'ENOENT') return null

    throw error
  }
}

function validateLlmsTxt(content, errors) {
  const requiredSections = [
    '## Best-Fit Roles',
    '## Best Environments',
    '## Not Primary Positioning',
    '## Strongest Evidence',
    '## Public Project Links',
    '## AI-Directed Delivery',
    '## Certifications',
    '## Attribution Guidance',
  ]

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      errors.push(`public/llms.txt is missing required section: ${section}`)
    }
  }

  if (/\n- proj-[^:\n]+:/u.test(content)) {
    errors.push('public/llms.txt contains project IDs in public link labels.')
  }
}

function sitemapLastmods(content) {
  return [...content.matchAll(/<lastmod>([^<]+)<\/lastmod>/giu)]
    .map(match => match[1])
}

function extractSitemapLastmod(content) {
  return sitemapLastmods(content)[0] ?? null
}

function validateSitemapXml(content, errors) {
  const urlCount = [...content.matchAll(/<url>/giu)].length
  const lastmods = sitemapLastmods(content)
  const uniqueLastmods = new Set(lastmods)

  if (!lastmods.length) {
    errors.push('public/sitemap.xml is missing <lastmod> entries.')
    return
  }

  if (lastmods.length !== urlCount) {
    errors.push('public/sitemap.xml must include exactly one <lastmod> per <url>.')
  }

  for (const lastmod of lastmods) {
    if (!SITEMAP_LASTMOD_PATTERN.test(lastmod)) {
      errors.push(`public/sitemap.xml has invalid <lastmod> date: ${lastmod}`)
    }
  }

  if (uniqueLastmods.size > 1) {
    errors.push('public/sitemap.xml should use one build-date <lastmod> value across generated routes.')
  }
}

function validateGeneratedArtifactContent(artifact, errors) {
  if (artifact.path === 'llms.txt') {
    validateLlmsTxt(artifact.content, errors)
  }

  if (artifact.path === 'sitemap.xml') {
    validateSitemapXml(artifact.content, errors)
  }
}

async function main() {
  const {
    buildPublicArtifacts,
    formatSitemapLastmod,
    validateCanonicalContent,
  } = await loadCanonicalContent()
  const errors = [...validateCanonicalContent()]
  const existingSitemap = await readExistingArtifact('sitemap.xml')
  const sitemapLastmod = existingSitemap
    ? extractSitemapLastmod(existingSitemap) ?? formatSitemapLastmod()
    : formatSitemapLastmod()
  const artifactOptions = { sitemapLastmod }
  const firstBuild = buildPublicArtifacts(artifactOptions)
  const secondBuild = buildPublicArtifacts(artifactOptions)

  if (JSON.stringify(firstBuild) !== JSON.stringify(secondBuild)) {
    errors.push('Canonical artifact generation is not deterministic.')
  }

  for (const artifact of firstBuild) {
    validateGeneratedArtifactContent(artifact, errors)

    const existing = await readExistingArtifact(artifact.path)

    if (existing === null) {
      errors.push(`Missing generated artifact: public/${artifact.path}`)
      continue
    }

    if (existing !== artifact.content) {
      errors.push(`Generated artifact is stale: public/${artifact.path}`)
    }
  }

  for (const artifactPath of REMOVED_PUBLIC_ARTIFACTS) {
    const existing = await readExistingArtifact(artifactPath)

    if (existing !== null) {
      errors.push(`Removed public artifact still exists: public/${artifactPath}`)
    }
  }

  if (errors.length) {
    console.error(errors.map(error => `- ${error}`).join('\n'))
    process.exitCode = 1
    return
  }

  console.log(`validated ${firstBuild.length} canonical artifacts`)
}

await main()
