#!/usr/bin/env node
/**
 * optimize-images.mjs
 * -------------------
 * 1. Reads every image in public/ and writes WebP + AVIF variants.
 * 2. Generates favicons (favicon.ico 32×32, apple-touch-icon 180×180,
 *    favicon-32.png, favicon-16.png) from public/profile.jpg.
 * 3. Generates a 64×64 circular desktop-icon thumbnail (profile-icon.webp).
 * 4. Generates local video poster assets (video-poster.webp / .avif).
 * 5. Generates responsive wallpaper variants for startup performance.
 *
 * Usage:  node scripts/optimize-images.mjs
 */

import { readdir, stat, access } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const PUBLIC   = fileURLToPath(new URL('../public/', import.meta.url))
const QUALITY  = { webp: 80, avif: 55 }
const EXTS     = new Set(['.jpg', '.jpeg', '.png'])
const SKIP     = new Set(['favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'])

async function exists(pathname) {
  try {
    await access(pathname)
    return true
  } catch {
    return false
  }
}

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

/* ---- 4. Local video poster (for Video app facade) ---- */
const videoPosterCandidates = [
  /* Preferred source requested for video facade poster. */
  join(PUBLIC, 'drib.jpg'),
  join(PUBLIC, 'video-poster.jpg'),
  join(PUBLIC, 'video-poster.png'),
  /* Keeps build deterministic even if no dedicated poster asset exists yet. */
  join(PUBLIC, 'screenshot-teaser.avif'),
]
const videoPosterSrc = await (async () => {
  for (const candidate of videoPosterCandidates) {
    if (await exists(candidate)) return candidate
  }
  return null
})()

if (videoPosterSrc) {
  const base = sharp(videoPosterSrc).resize(1280, 720, { fit : 'cover', position : 'centre' })
  await Promise.all([
    base.clone().webp({ quality : 78 }).toFile(join(PUBLIC, 'video-poster.webp')),
    base.clone().avif({ quality : 52 }).toFile(join(PUBLIC, 'video-poster.avif')),
  ])

  const webpSize = (await stat(join(PUBLIC, 'video-poster.webp'))).size
  const avifSize = (await stat(join(PUBLIC, 'video-poster.avif'))).size
  console.log(
    `✓ Video poster from ${basename(videoPosterSrc)} → ` +
    `video-poster.webp (${(webpSize / 1024).toFixed(1)}KB) + ` +
    `video-poster.avif (${(avifSize / 1024).toFixed(1)}KB)`,
  )
} else {
  console.log('⚠ No source found for video poster generation')
}

/* ---- 5. Responsive wallpaper variants ---- */
const wallpaperSrc = join(PUBLIC, 'wallpaper.webp')
if (await exists(wallpaperSrc)) {
  /* Match common viewport bands to avoid shipping 4K wallpaper to smaller screens. */
  const widths = [1280, 1920, 2560]
  for (const width of widths) {
    const outputWebp = join(PUBLIC, `wallpaper-${width}.webp`)
    const outputAvif = join(PUBLIC, `wallpaper-${width}.avif`)
    const base = sharp(wallpaperSrc).resize({ width, withoutEnlargement : true })
    await Promise.all([
      base.clone().webp({ quality : 78 }).toFile(outputWebp),
      base.clone().avif({ quality : 52 }).toFile(outputAvif),
    ])
    const webpSize = (await stat(outputWebp)).size
    const avifSize = (await stat(outputAvif)).size
    console.log(
      `✓ Wallpaper ${width}px → ` +
      `wallpaper-${width}.webp (${(webpSize / 1024).toFixed(1)}KB) + ` +
      `wallpaper-${width}.avif (${(avifSize / 1024).toFixed(1)}KB)`,
    )
  }

  const lqipOutput = join(PUBLIC, 'wallpaper-lqip.webp')
  await sharp(wallpaperSrc)
    .resize({ width : 96, withoutEnlargement : true })
    .blur(3)
    .webp({ quality : 42 })
    .toFile(lqipOutput)

  const lqipSize = (await stat(lqipOutput)).size
  console.log(`✓ Wallpaper LQIP → wallpaper-lqip.webp (${(lqipSize / 1024).toFixed(1)}KB)`)
} else {
  console.log('⚠ No wallpaper.webp found — skipping responsive wallpaper generation')
}

console.log('Done.')
