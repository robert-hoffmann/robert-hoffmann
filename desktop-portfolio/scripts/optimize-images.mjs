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

import { readdir, stat, access, readFile, mkdir } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const PUBLIC   = fileURLToPath(new URL('../public/', import.meta.url))
const TMP      = fileURLToPath(new URL('../tmp/', import.meta.url))
const QUALITY  = { webp: 80, avif: 55 }
const EXTS     = new Set(['.jpg', '.jpeg', '.png'])
const SKIP     = new Set(['favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'])
const PARALLAX_WIDTHS = [1280, 1920, 2560]
const PARALLAX_LAYERS = [
  {
    id           : 'layer-bg',
    sourceFile   : 'background.png',
    webpQuality  : 68,
    alphaQuality : 100,
  },
  {
    id           : 'layer-mid',
    sourceFile   : 'middle.png',
    webpQuality  : 72,
    alphaQuality : 90,
  },
  {
    id           : 'layer-fg',
    sourceFile   : 'foreground.png',
    webpQuality  : 78,
    alphaQuality : 95,
  },
]

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

  /* ---- 3. About header avatars (responsive 80px UI image) ---- */
  const aboutAvatarVariants = [
    { size : 80,  quality : 42 },
    { size : 160, quality : 45 },
    { size : 240, quality : 50 },
  ]

  await Promise.all(
    aboutAvatarVariants.map(({ size, quality }) =>
      img
        .clone()
        .resize(size, size, { fit : 'cover' })
        .avif({ quality })
        .toFile(join(PUBLIC, `profile-avatar-${size}.avif`)),
    ),
  )

  const avatarSummaries = await Promise.all(
    aboutAvatarVariants.map(async ({ size }) => {
      const avatarBytes = (await stat(join(PUBLIC, `profile-avatar-${size}.avif`))).size
      return `profile-avatar-${size}.avif (${(avatarBytes / 1024).toFixed(1)}KB)`
    }),
  )
  console.log(`✓ About avatars: ${avatarSummaries.join(' · ')}`)

  /* ---- 4. Desktop icon thumbnail (64px circle via circular mask) ---- */
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
  console.log('⚠ No profile.jpg found — skipping favicon + avatar + icon generation')
}

/* ---- 5. Local video poster variants (for Video app facade) ---- */
const videoPosterCandidates = [
  /* Preferred source requested for video facade poster. */
  join(PUBLIC, 'drib.jpg'),
  join(PUBLIC, 'video-poster.jpg'),
  join(PUBLIC, 'video-poster.png'),
]
const videoPosterSrc = await (async () => {
  for (const candidate of videoPosterCandidates) {
    if (await exists(candidate)) return candidate
  }
  return null
})()

if (videoPosterSrc) {
  const videoPosterVariants = [
    { width : 640,  webpQuality : 70, avifQuality : 46, suffix : '-640' },
    { width : 960,  webpQuality : 74, avifQuality : 50, suffix : '-960' },
    { width : 1280, webpQuality : 78, avifQuality : 52, suffix : '' },
  ]

  const outputs = []

  for (const variant of videoPosterVariants) {
    const height = Math.round((variant.width * 9) / 16)
    const base = sharp(videoPosterSrc).resize(variant.width, height, {
      fit      : 'cover',
      position : 'centre',
    })

    const webpName = `video-poster${variant.suffix}.webp`
    const avifName = `video-poster${variant.suffix}.avif`
    const webpPath = join(PUBLIC, webpName)
    const avifPath = join(PUBLIC, avifName)

    await Promise.all([
      base.clone().webp({ quality : variant.webpQuality }).toFile(webpPath),
      base.clone().avif({ quality : variant.avifQuality }).toFile(avifPath),
    ])

    const webpSize = (await stat(webpPath)).size
    const avifSize = (await stat(avifPath)).size
    outputs.push(
      `${webpName} (${(webpSize / 1024).toFixed(1)}KB) + ${avifName} (${(avifSize / 1024).toFixed(1)}KB)`,
    )
  }

  console.log(`✓ Video poster variants from ${basename(videoPosterSrc)} → ${outputs.join(' · ')}`)
} else {
  console.log('⚠ No source found for video poster generation')
}

/* ---- 6. Responsive wallpaper variants ---- */
const wallpaperSrc = join(PUBLIC, 'wallpaper.webp')
if (await exists(wallpaperSrc)) {
  /* Match common viewport bands to avoid shipping 4K wallpaper to smaller screens. */
  const widths = [1280, 1920, 2560]
  for (const width of widths) {
    const outputWebp = join(PUBLIC, `wallpaper-${width}.webp`)
    const base = sharp(wallpaperSrc).resize({ width, withoutEnlargement : true })
    await base.clone().webp({ quality : 78 }).toFile(outputWebp)
    const webpSize = (await stat(outputWebp)).size
    console.log(
      `✓ Wallpaper ${width}px → ` +
      `wallpaper-${width}.webp (${(webpSize / 1024).toFixed(1)}KB)`,
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

    /* Mobile mockup wallpaper crop (left-origin with fixed 200px x-offset). */
    const mobileTargetW = 768
    const mobileTargetH = 1365
    const mobileLeftOffsetPx = 200
    const mobileSource = sharp(wallpaperSrc)
    const mobileMeta = await mobileSource.metadata()
    const mobileSourceW = mobileMeta.width ?? mobileTargetW
    const mobileSourceH = mobileMeta.height ?? mobileTargetH
    const mobileScale = Math.max(mobileTargetW / mobileSourceW, mobileTargetH / mobileSourceH)
    const mobileScaledW = Math.max(mobileTargetW, Math.round(mobileSourceW * mobileScale))
    const mobileScaledH = Math.max(mobileTargetH, Math.round(mobileSourceH * mobileScale))
    const mobileCropLeft = Math.min(Math.max(mobileLeftOffsetPx, 0), Math.max(0, mobileScaledW - mobileTargetW))
    const mobileCropTop = Math.max(0, Math.floor((mobileScaledH - mobileTargetH) / 2))

    const mobileWallpaperBase = mobileSource
      .resize(mobileScaledW, mobileScaledH, { fit : 'fill' })
      .extract({
        left   : mobileCropLeft,
        top    : mobileCropTop,
        width  : mobileTargetW,
        height : mobileTargetH,
      })
    const mobileWallpaperWebp = join(PUBLIC, 'wallpaper-mobile-left.webp')
    const mobileWallpaperAvif = join(PUBLIC, 'wallpaper-mobile-left.avif')

    await Promise.all([
      mobileWallpaperBase.clone().webp({ quality : 76 }).toFile(mobileWallpaperWebp),
      mobileWallpaperBase.clone().avif({ quality : 50 }).toFile(mobileWallpaperAvif),
    ])

    const mobileWebpSize = (await stat(mobileWallpaperWebp)).size
    const mobileAvifSize = (await stat(mobileWallpaperAvif)).size
    console.log(
      '✓ Mobile wallpaper crop → ' +
      `wallpaper-mobile-left.webp (${(mobileWebpSize / 1024).toFixed(1)}KB) + ` +
      `wallpaper-mobile-left.avif (${(mobileAvifSize / 1024).toFixed(1)}KB)`,
    )
} else {
  console.log('⚠ No wallpaper.webp found — skipping responsive wallpaper generation')
}

/* ---- 7. Desktop icon sprite runtime optimization ---- */
const desktopSpriteSource = join(PUBLIC, 'icons', 'desktop-profile-icons.webp')
const desktopSpriteRuntime = join(PUBLIC, 'icons', 'desktop-profile-icons-runtime.webp')

if (await exists(desktopSpriteSource)) {
  /*
   * Read the design export once, then encode a runtime variant to avoid
   * cumulative loss from repeatedly re-encoding the same output file.
   */
  const desktopSpriteSourceBuffer = await readFile(desktopSpriteSource)
  const desktopSpriteSourceBytes  = desktopSpriteSourceBuffer.byteLength

  await sharp(desktopSpriteSourceBuffer)
    .webp({
      quality : 80,
      effort  : 6,
    })
    .toFile(desktopSpriteRuntime)

  const desktopSpriteRuntimeBytes = (await stat(desktopSpriteRuntime)).size
  console.log(
    '✓ Desktop sprite runtime → ' +
    `desktop-profile-icons-runtime.webp (${(desktopSpriteRuntimeBytes / 1024).toFixed(1)}KB, ` +
    `from ${(desktopSpriteSourceBytes / 1024).toFixed(1)}KB source)`,
  )
} else {
  console.log('⚠ No desktop-profile-icons.webp found — skipping runtime sprite optimization')
}

/* ---- 8. Desktop parallax layer optimization (tmp -> public/parallax) ---- */
const parallaxOutputDir = join(PUBLIC, 'parallax', 'desktop')
const hasParallaxSources = await Promise.all(
  PARALLAX_LAYERS.map(async ({ sourceFile }) => exists(join(TMP, sourceFile))),
)

if (hasParallaxSources.every(Boolean)) {
  await mkdir(parallaxOutputDir, { recursive : true })

  for (const layer of PARALLAX_LAYERS) {
    const source = join(TMP, layer.sourceFile)

    for (const width of PARALLAX_WIDTHS) {
      const webpOutput = join(parallaxOutputDir, `${layer.id}-${width}.webp`)
      const resized = sharp(source).resize({ width, withoutEnlargement : true })

      await resized.clone().webp({
        quality      : layer.webpQuality,
        alphaQuality : layer.alphaQuality,
        effort       : 6,
      }).toFile(webpOutput)

      const webpBytes = (await stat(webpOutput)).size
      console.log(
        `✓ Parallax ${layer.id} ${width}px → ` +
        `${basename(webpOutput)} (${(webpBytes / 1024).toFixed(1)}KB)`,
      )
    }
  }
} else {
  console.log('⚠ Missing tmp parallax source PNG files — skipping parallax layer optimization')
}

console.log('Done.')
