import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
import { PORTFOLIO_STATE_KEY } from './src/constants/portfolioState'

const PUBLIC_DIR                 = resolve(__dirname, 'public')
const PUBLIC_ASSET_VERSION_TOKEN = '__PUBLIC_ASSET_VERSION__'
const PORTFOLIO_STATE_KEY_TOKEN  = '__PORTFOLIO_STATE_KEY__'

const PUBLIC_ASSET_VERSIONED_EXTENSIONS = new Set([
  '.avif',
  '.jpeg',
  '.jpg',
  '.json',
  '.mp3',
  '.pdf',
  '.png',
  '.svg',
  '.webp',
])
const PUBLIC_ASSET_VERSIONED_OUTPUT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
])

function collectPublicAssetFiles(dir: string): string[] {
  if (!existsSync(dir)) return []

  return readdirSync(dir, { withFileTypes : true })
    .flatMap((entry) => {
      const path = join(dir, entry.name)

      if (entry.isDirectory()) return collectPublicAssetFiles(path)
      if (!entry.isFile()) return []
      if (!PUBLIC_ASSET_VERSIONED_EXTENSIONS.has(extname(entry.name).toLowerCase())) return []

      return [path]
    })
    .sort()
}

function createPublicAssetVersion() {
  const hash = createHash('sha256')
  const files = collectPublicAssetFiles(PUBLIC_DIR)

  for (const file of files) {
    hash.update(relative(PUBLIC_DIR, file).split(sep).join('/'))
    hash.update('\0')
    hash.update(readFileSync(file))
    hash.update('\0')
  }

  return hash.digest('hex').slice(0, 12)
}

function replacePublicAssetVersionTokensInDir(dir: string, version: string) {
  if (!existsSync(dir)) return

  for (const entry of readdirSync(dir, { withFileTypes : true })) {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      replacePublicAssetVersionTokensInDir(path, version)
      continue
    }

    if (!entry.isFile()) continue
    if (!PUBLIC_ASSET_VERSIONED_OUTPUT_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue

    const source = readFileSync(path, 'utf8')
    if (!source.includes(PUBLIC_ASSET_VERSION_TOKEN)) continue

    writeFileSync(path, source.replaceAll(PUBLIC_ASSET_VERSION_TOKEN, version))
  }
}

function publicAssetVersionTokenPlugin(version: string): Plugin {
  const replaceVersionToken = (value: string) => value.replaceAll(PUBLIC_ASSET_VERSION_TOKEN, version)
  let outDir = resolve(__dirname, 'dist')

  return {
    name : 'public-asset-version-token',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transform(code, id) {
      if (!code.includes(PUBLIC_ASSET_VERSION_TOKEN)) return null
      if (!id.includes('.css') && !id.includes('.vue?vue&type=style')) return null

      return replaceVersionToken(code)
    },
    transformIndexHtml : {
      order : 'post',
      handler(html) {
        return replaceVersionToken(html)
      },
    },
    generateBundle(_, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') {
          output.code = replaceVersionToken(output.code)
          continue
        }

        if (typeof output.source === 'string') {
          output.source = replaceVersionToken(output.source)
        }
      }
    },
    closeBundle() {
      replacePublicAssetVersionTokensInDir(outDir, version)
    },
  }
}

function portfolioStateKeyTokenPlugin(): Plugin {
  const replaceStateKeyToken = (value: string) => value.replaceAll(
    PORTFOLIO_STATE_KEY_TOKEN,
    PORTFOLIO_STATE_KEY,
  )

  return {
    name : 'portfolio-state-key-token',
    transformIndexHtml : {
      order : 'post',
      handler(html) {
        return replaceStateKeyToken(html)
      },
    },
  }
}

function deferEntryStylesheetPlugin(): Plugin {
  return {
    name  : 'defer-entry-stylesheet',
    apply : 'build',
    transformIndexHtml : {
      order : 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet"([^>]*?)href="([^"]*\/assets\/[^"]+\.css)"([^>]*)>/g,
          `<link rel="preload" as="style"$1href="$2"$3 onload="this.onload=null;this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet"$1href="$2"$3></noscript>`,
        )
      },
    },
  }
}

const publicAssetVersion = createPublicAssetVersion()

export default defineConfig({
  base    : '/',
  define  : {
    [PUBLIC_ASSET_VERSION_TOKEN] : JSON.stringify(publicAssetVersion),
  },
  plugins : [
    vue(),
    tailwindcss(),
    publicAssetVersionTokenPlugin(publicAssetVersion),
    portfolioStateKeyTokenPlugin(),
    deferEntryStylesheetPlugin(),
    vitePrerenderPlugin({
      renderTarget    : '#app',
      prerenderScript : resolve(__dirname, 'prerender.ts'),
    }),
  ],
})
