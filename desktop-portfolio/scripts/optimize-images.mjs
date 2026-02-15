#!/usr/bin/env node
/**
 * optimize-images.mjs
 * -------------------
 * 1. Reads every image in public/ and writes WebP + AVIF variants.
 * 2. Generates favicons (favicon.ico 32×32, apple-touch-icon 180×180,
 *    favicon-32.png, favicon-16.png) from public/profile.jpg.
 * 3. Generates a 64×64 circular desktop-icon thumbnail (profile-icon.webp).
 *
 * Usage:  node scripts/optimize-images.mjs
 */

import { readdir, stat, access } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const PUBLIC   = new URL('../public/', import.meta.url).pathname
const QUALITY  = { webp: 80, avif: 55 }
const EXTS     = new Set(['.jpg', '.jpeg', '.png'])
const SKIP     = new Set(['favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'])

/* ---- 1. WebP + AVIF variants ---- */
const files = await readdir(PUBLIC)

for (const file of files) {
  const ext = extname(file).toLowerCase()
  if (!EXTS.has(ext) || SKIP.has(file)) continue

  const src  = join(PUBLIC, file)
  const info = await stat(src)
  if (!info.isFile()) continue

  const name = basename(file, ext)
  const img  = sharp(src)

  await Promise.all([
    img.clone().webp({ quality: QUALITY.webp }).toFile(join(PUBLIC, `${name}.webp`)),
    img.clone().avif({ quality: QUALITY.avif }).toFile(join(PUBLIC, `${name}.avif`)),
  ])

  const webpSize = (await stat(join(PUBLIC, `${name}.webp`))).size
  const avifSize = (await stat(join(PUBLIC, `${name}.avif`))).size

  console.log(
    `✓ ${file} (${(info.size / 1024).toFixed(1)}KB) → ` +
    `${name}.webp (${(webpSize / 1024).toFixed(1)}KB) + ` +
    `${name}.avif (${(avifSize / 1024).toFixed(1)}KB)`,
  )
}

/* ---- 2. Favicons from profile.jpg ---- */
const profileSrc = join(PUBLIC, 'profile.jpg')
try {
  await access(profileSrc)
  const img = sharp(profileSrc)

  await Promise.all([
    img.clone().resize(32, 32).png().toFile(join(PUBLIC, 'favicon-32.png')),
    img.clone().resize(16, 16).png().toFile(join(PUBLIC, 'favicon-16.png')),
    img.clone().resize(180, 180).png().toFile(join(PUBLIC, 'apple-touch-icon.png')),
    img.clone().resize(192, 192).png().toFile(join(PUBLIC, 'icon-192.png')),
    img.clone().resize(512, 512).png().toFile(join(PUBLIC, 'icon-512.png')),
  ])

  // Generate ICO (use 32×32 PNG wrapped as ICO via sharp)
  await img.clone().resize(32, 32).toFormat('png').toFile(join(PUBLIC, 'favicon.ico'))

  console.log('✓ Favicons generated (16, 32, 180, 192, 512)')

  /* ---- 3. Desktop icon thumbnail (64px circle via circular mask) ---- */
  const iconSize = 64
  const circleBuffer = Buffer.from(
    `<svg width="${iconSize}" height="${iconSize}">
       <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2}" fill="white"/>
     </svg>`,
  )

  await img
    .clone()
    .resize(iconSize, iconSize)
    .composite([{ input: circleBuffer, blend: 'dest-in' }])
    .webp({ quality: 85 })
    .toFile(join(PUBLIC, 'profile-icon.webp'))

  const iconSize2 = (await stat(join(PUBLIC, 'profile-icon.webp'))).size
  console.log(`✓ Desktop icon: profile-icon.webp (${(iconSize2 / 1024).toFixed(1)}KB)`)
} catch {
  console.log('⚠ No profile.jpg found — skipping favicon + icon generation')
}

console.log('Done.')
