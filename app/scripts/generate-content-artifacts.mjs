#!/usr/bin/env node
/**
 * Regenerate canonical public knowledge and crawler artifacts from typed app data.
 *
 * Source data:
 *   src/data/apps/about.ts
 *   src/data/apps/projects.ts
 *   src/data/portfolio/*.ts
 *
 * Outputs:
 *   public/knowledge/person.json
 *   public/knowledge/projects.json
 *   public/knowledge/portfolio.json
 *   public/llms.txt
 *   public/sitemap.xml
 *   public/robots.txt
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url))
const PUBLIC_DIR   = join(PROJECT_ROOT, 'public')

function artifactLabel(filePath) {
  return relative(PROJECT_ROOT, filePath)
}

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

async function main() {
  const {
    buildPublicArtifacts,
    formatSitemapLastmod,
  } = await loadCanonicalContent()
  const sitemapLastmod = formatSitemapLastmod()
  const artifacts = buildPublicArtifacts({ sitemapLastmod })

  for (const artifact of artifacts) {
    const targetPath = join(PUBLIC_DIR, artifact.path)

    await mkdir(dirname(targetPath), { recursive : true })
    await writeFile(targetPath, artifact.content, 'utf8')
    console.log(`generated ${artifactLabel(targetPath)}`)
  }
}

await main()
