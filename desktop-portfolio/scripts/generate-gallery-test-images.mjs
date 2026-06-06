#!/usr/bin/env node
/**
 * Generate visual test outputs for project-gallery source images.
 *
 * Input naming:
 *   public/image-gallery/src/<gallery-position>-<projectId>.*
 *
 * Test output:
 *   public/image-gallery/_test-normalized/index.html
 *   public/image-gallery/_test-normalized/images/<variant>/*.webp
 *   public/image-gallery/_test-normalized/thumbs/<variant>/*.webp
 */

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url))
const SOURCE_DIR   = join(PROJECT_ROOT, 'public/image-gallery/src')
const OUTPUT_DIR   = join(PROJECT_ROOT, 'public/image-gallery/_test-normalized')

const FULL_SIZE = {
  width  : 1600,
  height : 1000,
}

const THUMB_SIZE = {
  width  : 360,
  height : 360,
}

const ACCEPTED_EXTENSIONS = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])

const variants = [
  {
    id          : 'cover-crop',
    title       : 'Cover crop',
    description : 'Fills the 1600x1000 frame, but may crop UI details.',
    foreground  : 1,
    background  : 'cover',
  },
  {
    id          : 'blur-card',
    title       : 'Blurred source card',
    description : 'Recommended first pass: full screenshot preserved over an image-derived backdrop.',
    foreground  : 0.91,
    background  : 'blur',
  },
  {
    id          : 'clean-card',
    title       : 'Clean dark card',
    description : 'More uniform gallery mood with only a faint image tint behind the screenshot.',
    foreground  : 0.88,
    background  : 'clean',
  },
]

function parseSourceName(fileName) {
  const extension = extname(fileName).toLowerCase()
  if (!ACCEPTED_EXTENSIONS.has(extension)) return null

  const stem  = basename(fileName, extension)
  const match = stem.match(/^(\d+)-(.+)$/)
  if (!match) return null

  return {
    fileName,
    position  : Number(match[1]),
    projectId : match[2],
  }
}

function paddedPosition(position) {
  return String(position).padStart(2, '0')
}

function outputFileName(entry) {
  return `${paddedPosition(entry.position)}.webp`
}

function gradientSvg(width, height) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111827"/>
          <stop offset="52%" stop-color="#172033"/>
          <stop offset="100%" stop-color="#090d16"/>
        </linearGradient>
        <radialGradient id="glow" cx="72%" cy="24%" r="65%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.26"/>
          <stop offset="44%" stop-color="#8b5cf6" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#base)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>
    </svg>
  `)
}

function vignetteSvg(width, height) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="45%" r="72%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="72%" stop-color="#000000" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.42"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>
  `)
}

function shadowSvg(canvasWidth, canvasHeight, cardWidth, cardHeight, left, top, radius) {
  return Buffer.from(`
    <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#000000" flood-opacity="0.44"/>
        </filter>
      </defs>
      <rect x="${left}" y="${top}" width="${cardWidth}" height="${cardHeight}" rx="${radius}" fill="#000000" filter="url(#shadow)"/>
    </svg>
  `)
}

async function createCoverBackground(sourcePath, width, height, blur = 30) {
  return sharp(sourcePath)
    .rotate()
    .resize(width, height, { fit : 'cover', position : 'centre' })
    .blur(blur)
    .modulate({
      brightness : 0.68,
      saturation : 0.88,
    })
    .toBuffer()
}

async function createCleanBackground(sourcePath, width, height) {
  const tint = await sharp(sourcePath)
    .rotate()
    .resize(width, height, { fit : 'cover', position : 'centre' })
    .blur(36)
    .modulate({
      brightness : 0.42,
      saturation : 0.78,
    })
    .ensureAlpha(0.22)
    .toBuffer()

  return sharp(gradientSvg(width, height))
    .composite([{ input : tint, blend : 'over' }])
    .toBuffer()
}

async function createForeground(sourcePath, variant) {
  const maxWidth  = Math.round(FULL_SIZE.width * variant.foreground)
  const maxHeight = Math.round(FULL_SIZE.height * variant.foreground)

  return sharp(sourcePath)
    .rotate()
    .resize(maxWidth, maxHeight, {
      fit      : 'inside',
      position : 'centre',
    })
    .extend({
      top        : 2,
      right      : 2,
      bottom     : 2,
      left       : 2,
      background : 'rgba(255, 255, 255, 0.72)',
    })
    .webp({ quality : 92 })
    .toBuffer()
}

async function createFullImage(sourcePath, variant) {
  if (variant.background === 'cover') {
    return sharp(sourcePath)
      .rotate()
      .resize(FULL_SIZE.width, FULL_SIZE.height, {
        fit      : 'cover',
        position : 'centre',
      })
      .webp({ quality : 86 })
      .toBuffer()
  }

  const background = variant.background === 'clean'
    ? await createCleanBackground(sourcePath, FULL_SIZE.width, FULL_SIZE.height)
    : await createCoverBackground(sourcePath, FULL_SIZE.width, FULL_SIZE.height)
  const foreground = await createForeground(sourcePath, variant)
  const foregroundMetadata = await sharp(foreground).metadata()
  const foregroundWidth    = foregroundMetadata.width ?? FULL_SIZE.width
  const foregroundHeight   = foregroundMetadata.height ?? FULL_SIZE.height
  const left               = Math.round((FULL_SIZE.width - foregroundWidth) / 2)
  const top                = Math.round((FULL_SIZE.height - foregroundHeight) / 2)
  const shadow             = shadowSvg(
    FULL_SIZE.width,
    FULL_SIZE.height,
    foregroundWidth,
    foregroundHeight,
    left,
    top,
    8,
  )

  return sharp(background)
    .composite([
      { input : vignetteSvg(FULL_SIZE.width, FULL_SIZE.height), blend : 'over' },
      { input : shadow, blend : 'over' },
      {
        input : foreground,
        left,
        top,
      },
    ])
    .webp({ quality : 86 })
    .toBuffer()
}

async function createThumbnail(fullImageBuffer, variant) {
  if (variant.background === 'cover') {
    return sharp(fullImageBuffer)
      .resize(THUMB_SIZE.width, THUMB_SIZE.height, {
        fit      : 'cover',
        position : 'centre',
      })
      .webp({ quality : 82 })
      .toBuffer()
  }

  const background = await sharp(fullImageBuffer)
    .resize(THUMB_SIZE.width, THUMB_SIZE.height, {
      fit      : 'cover',
      position : 'centre',
    })
    .blur(16)
    .modulate({
      brightness : 0.7,
      saturation : 0.86,
    })
    .toBuffer()
  const foreground = await sharp(fullImageBuffer)
    .resize(
      Math.round(THUMB_SIZE.width * 0.9),
      Math.round(THUMB_SIZE.height * 0.72),
      {
        fit      : 'inside',
        position : 'centre',
      },
    )
    .extend({
      top        : 1,
      right      : 1,
      bottom     : 1,
      left       : 1,
      background : 'rgba(255, 255, 255, 0.68)',
    })
    .webp({ quality : 88 })
    .toBuffer()
  const foregroundMetadata = await sharp(foreground).metadata()
  const foregroundWidth    = foregroundMetadata.width ?? THUMB_SIZE.width
  const foregroundHeight   = foregroundMetadata.height ?? THUMB_SIZE.height
  const left               = Math.round((THUMB_SIZE.width - foregroundWidth) / 2)
  const top                = Math.round((THUMB_SIZE.height - foregroundHeight) / 2)

  return sharp(background)
    .composite([
      {
        input : foreground,
        left,
        top,
      },
    ])
    .webp({ quality : 82 })
    .toBuffer()
}

function htmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildPreviewHtml(entries) {
  const variantColumns = variants.map(variant => `
    <th>
      <span>${htmlEscape(variant.title)}</span>
      <small>${htmlEscape(variant.description)}</small>
    </th>
  `).join('')

  const rows = entries.map(entry => {
    const sourceHref = `../src/${encodeURIComponent(entry.fileName)}`
    const cells = variants.map(variant => {
      const fileName = outputFileName(entry)
      const imageUrl = `images/${variant.id}/${fileName}`
      const thumbUrl = `thumbs/${variant.id}/${fileName}`

      return `
        <td>
          <a href="${imageUrl}">
            <img class="preview" src="${imageUrl}" alt="${htmlEscape(variant.title)} output for ${htmlEscape(entry.projectId)}"/>
          </a>
          <img class="thumb" src="${thumbUrl}" alt="${htmlEscape(variant.title)} thumbnail for ${htmlEscape(entry.projectId)}"/>
        </td>
      `
    }).join('')

    return `
      <tr>
        <td>
          <strong>${paddedPosition(entry.position)}</strong>
          <code>${htmlEscape(entry.projectId)}</code>
          <a href="${sourceHref}">
            <img class="source" src="${sourceHref}" alt="Source ${htmlEscape(entry.fileName)}"/>
          </a>
        </td>
        ${cells}
      </tr>
    `
  }).join('')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Gallery Normalization Tests</title>
    <style>
      :root {
        color-scheme : dark;
        font-family  : system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background   : #111827;
        color        : #e5e7eb;
      }

      body {
        margin  : 0;
        padding : 24px;
      }

      h1,
      p {
        max-width : 860px;
      }

      table {
        width           : 100%;
        border-collapse : collapse;
      }

      th,
      td {
        padding        : 12px;
        vertical-align : top;
        border-bottom  : 1px solid rgb(255 255 255 / 12%);
      }

      th {
        position   : sticky;
        top        : 0;
        z-index    : 1;
        background : #111827;
        text-align : left;
      }

      small {
        display     : block;
        max-width   : 22rem;
        margin-top  : 0.35rem;
        color       : #9ca3af;
        font-weight : 400;
      }

      code {
        display     : block;
        margin      : 0.35rem 0 0.75rem;
        color       : #93c5fd;
        font-size   : 0.86rem;
        white-space : nowrap;
      }

      img {
        display    : block;
        max-width  : 100%;
        background : #020617;
      }

      .source {
        width      : 240px;
        max-height : 160px;
        object-fit : contain;
      }

      .preview {
        width        : min(360px, 28vw);
        aspect-ratio : 16 / 10;
        object-fit   : cover;
      }

      .thumb {
        width      : 90px;
        height     : 90px;
        margin-top : 8px;
      }
    </style>
  </head>
  <body>
    <h1>Gallery Normalization Tests</h1>
    <p>
      All generated full images are 1600x1000 WebP. All generated thumbnails are
      360x360 WebP. Runtime folders are untouched.
    </p>
    <table>
      <thead>
        <tr>
          <th>Source</th>
          ${variantColumns}
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>
`
}

async function main() {
  const files = await readdir(SOURCE_DIR)
  const entries = files
    .map(parseSourceName)
    .filter(Boolean)
    .sort((a, b) => a.position - b.position || a.fileName.localeCompare(b.fileName))

  if (entries.length === 0) {
    throw new Error(`No source images found in ${SOURCE_DIR}`)
  }

  await rm(OUTPUT_DIR, { force : true, recursive : true })

  for (const variant of variants) {
    await mkdir(join(OUTPUT_DIR, 'images', variant.id), { recursive : true })
    await mkdir(join(OUTPUT_DIR, 'thumbs', variant.id), { recursive : true })
  }

  for (const entry of entries) {
    const sourcePath = join(SOURCE_DIR, entry.fileName)
    const fileName   = outputFileName(entry)

    for (const variant of variants) {
      const fullImage = await createFullImage(sourcePath, variant)
      const thumbnail = await createThumbnail(fullImage, variant)

      await writeFile(join(OUTPUT_DIR, 'images', variant.id, fileName), fullImage)
      await writeFile(join(OUTPUT_DIR, 'thumbs', variant.id, fileName), thumbnail)
    }
  }

  await writeFile(join(OUTPUT_DIR, 'index.html'), buildPreviewHtml(entries))
  await writeFile(
    join(OUTPUT_DIR, 'manifest.json'),
    `${JSON.stringify(entries.map(entry => ({
      fileName   : outputFileName(entry),
      position   : entry.position,
      projectId  : entry.projectId,
      sourceFile : entry.fileName,
    })), null, 2)}\n`,
  )

  console.log(`Generated ${entries.length} source images across ${variants.length} variants.`)
  console.log(`Preview: ${join(OUTPUT_DIR, 'index.html')}`)
}

await main()
