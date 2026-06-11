#!/usr/bin/env node
/**
 * optimize-images.mjs
 * -------------------
 * 1. Reads every image in public/ and writes WebP + AVIF variants.
 * 2. Generates favicons (favicon.ico 32×32, apple-touch-icon 180×180,
 *    favicon-32.png, favicon-16.png) from public/profile.jpg.
 * 3. Generates a 64×64 circular desktop-icon thumbnail (profile-icon.webp).
 * 4. Generates local video poster assets (video-poster.webp / .avif).
 * 5. Generates responsive gallery images, thumbnails, and LQIP previews.
 * 6. Generates desktop parallax LQIP assets from tmp/background.
 * 7. Generates desktop parallax layers and flattened mobile wallpapers.
 *
 * Usage:  node scripts/optimize-images.mjs
 */

import { readdir, stat, access, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const PUBLIC   = fileURLToPath(new URL('../public/', import.meta.url))
const TMP      = fileURLToPath(new URL('../tmp/', import.meta.url))
const QUALITY  = { webp : 80, avif : 55 }
const EXTS     = new Set(['.jpg', '.jpeg', '.png'])
const SKIP     = new Set(['favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'])

const GALLERY_DIR                 = join(PUBLIC, 'image-gallery')
const GALLERY_SOURCE_DIR          = join(GALLERY_DIR, 'src')
const GALLERY_IMAGE_OUTPUT_DIR    = join(GALLERY_DIR, 'images')
const GALLERY_THUMB_OUTPUT_DIR    = join(GALLERY_DIR, 'thumbs')
const GALLERY_PREVIEW_OUTPUT_DIR  = join(GALLERY_DIR, 'previews')
const GALLERY_ACCEPTED_EXTENSIONS = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])
const GALLERY_FULL_SIZE = {
  width  : 1600,
  height : 1000,
}
const GALLERY_PREVIEW_SIZE = {
  width  : 160,
  height : 100,
}
const GALLERY_FULL_WIDTHS = [
  480,
  800,
  1200,
  1600,
]
const GALLERY_THUMB_WIDTHS = [
  180,
  360,
]
const GALLERY_FULL_QUALITY = {
  avif : {
    480  : 39,
    800  : 43,
    1200 : 48,
    1600 : 52,
  },
  webp : {
    480  : 70,
    800  : 76,
    1200 : 82,
    1600 : 86,
  },
}
const DESKTOP_PARALLAX_WIDTHS               = [1280, 1920, 2560]
const MOBILE_BACKGROUND_WIDTHS              = [480, 768, 1024]
const MOBILE_BACKGROUND_ASPECT_RATIO        = 16 / 9
const MOBILE_BACKGROUND_CROP_OFFSET_X_RATIO = 200 / 768
const PWA_ICON_PNG_OPTIONS = {
  adaptiveFiltering : true,
  compressionLevel  : 9,
  palette           : true,
  quality           : 90,
}
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

function parseGallerySourceName(fileName) {
  const extension = extname(fileName).toLowerCase()
  if (!GALLERY_ACCEPTED_EXTENSIONS.has(extension)) return null

  const stem = basename(fileName, extension)
  if (!/^.+-\d+$/.test(stem)) return null

  return {
    fileName       : fileName,
    galleryImageId : stem,
  }
}

function galleryResponsiveFileName(galleryImageId, width, format) {
  const suffix = width === GALLERY_FULL_SIZE.width ? '' : `-${width}`

  return `${galleryImageId}${suffix}.${format}`
}

function galleryThumbnailFileName(galleryImageId, width) {
  const suffix = width === Math.max(...GALLERY_THUMB_WIDTHS) ? '' : `-${width}`

  return `${galleryImageId}${suffix}.webp`
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

async function createGalleryBackground(sourcePath) {
  return sharp(sourcePath)
    .rotate()
    .resize(GALLERY_FULL_SIZE.width, GALLERY_FULL_SIZE.height, {
      fit      : 'cover',
      position : 'centre',
    })
    .blur(30)
    .modulate({
      brightness : 0.68,
      saturation : 0.88,
    })
    .toBuffer()
}

async function createGalleryForeground(sourcePath) {
  const maxWidth  = Math.round(GALLERY_FULL_SIZE.width * 0.88)
  const maxHeight = Math.round(GALLERY_FULL_SIZE.height * 0.88)

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
    .png()
    .toBuffer()
}

async function createGalleryCanvas(sourcePath) {
  const background         = await createGalleryBackground(sourcePath)
  const foreground         = await createGalleryForeground(sourcePath)
  const foregroundMetadata = await sharp(foreground).metadata()
  const foregroundWidth    = foregroundMetadata.width ?? GALLERY_FULL_SIZE.width
  const foregroundHeight   = foregroundMetadata.height ?? GALLERY_FULL_SIZE.height
  const left               = Math.round((GALLERY_FULL_SIZE.width - foregroundWidth) / 2)
  const top                = Math.round((GALLERY_FULL_SIZE.height - foregroundHeight) / 2)
  const shadow             = shadowSvg(
    GALLERY_FULL_SIZE.width,
    GALLERY_FULL_SIZE.height,
    foregroundWidth,
    foregroundHeight,
    left,
    top,
    8,
  )

  return sharp(background)
    .composite([
      {
        input : vignetteSvg(GALLERY_FULL_SIZE.width, GALLERY_FULL_SIZE.height),
        blend : 'over',
      },
      {
        input : shadow,
        blend : 'over',
      },
      {
        input : foreground,
        left  : left,
        top   : top,
      },
    ])
    .png()
    .toBuffer()
}

async function createGalleryThumbnail(fullImageBuffer, size) {
  const background = await sharp(fullImageBuffer)
    .resize(size, size, {
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
      Math.round(size * 0.9),
      Math.round(size * 0.72),
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
    .png()
    .toBuffer()
  const foregroundMetadata = await sharp(foreground).metadata()
  const foregroundWidth    = foregroundMetadata.width ?? size
  const foregroundHeight   = foregroundMetadata.height ?? size
  const left               = Math.round((size - foregroundWidth) / 2)
  const top                = Math.round((size - foregroundHeight) / 2)

  return sharp(background)
    .composite([
      {
        input : foreground,
        left  : left,
        top   : top,
      },
    ])
    .webp({
      effort  : 6,
      quality : size <= 180 ? 72 : 82,
    })
    .toBuffer()
}

async function writeGalleryRuntimeAssets() {
  if (!(await exists(GALLERY_SOURCE_DIR))) {
    console.log('⚠ No image-gallery/src directory found - skipping gallery runtime assets')
    return
  }

  const entries = (await readdir(GALLERY_SOURCE_DIR))
    .map(parseGallerySourceName)
    .filter(Boolean)
    .sort((a, b) => a.galleryImageId.localeCompare(b.galleryImageId))

  if (entries.length === 0) {
    console.log('⚠ No gallery source images found - skipping gallery runtime assets')
    return
  }

  await Promise.all([
    rm(GALLERY_IMAGE_OUTPUT_DIR, { force : true, recursive : true }),
    rm(GALLERY_THUMB_OUTPUT_DIR, { force : true, recursive : true }),
    rm(GALLERY_PREVIEW_OUTPUT_DIR, { force : true, recursive : true }),
  ])
  await Promise.all([
    mkdir(GALLERY_IMAGE_OUTPUT_DIR, { recursive : true }),
    mkdir(GALLERY_THUMB_OUTPUT_DIR, { recursive : true }),
    mkdir(GALLERY_PREVIEW_OUTPUT_DIR, { recursive : true }),
  ])

  for (const entry of entries) {
    const sourcePath = join(GALLERY_SOURCE_DIR, entry.fileName)
    const canvas     = await createGalleryCanvas(sourcePath)

    await Promise.all([
      ...GALLERY_FULL_WIDTHS.flatMap((width) => {
        const resized = sharp(canvas).resize({
          width              : width,
          withoutEnlargement : true,
        })
        const webpOutput = join(
          GALLERY_IMAGE_OUTPUT_DIR,
          galleryResponsiveFileName(entry.galleryImageId, width, 'webp'),
        )
        const avifOutput = join(
          GALLERY_IMAGE_OUTPUT_DIR,
          galleryResponsiveFileName(entry.galleryImageId, width, 'avif'),
        )

        return [
          resized
            .clone()
            .webp({
              effort  : 6,
              quality : GALLERY_FULL_QUALITY.webp[width],
            })
            .toFile(webpOutput),
          resized
            .clone()
            .avif({
              effort  : 6,
              quality : GALLERY_FULL_QUALITY.avif[width],
            })
            .toFile(avifOutput),
        ]
      }),
      ...GALLERY_THUMB_WIDTHS.map(async (width) => {
        const thumbnail = await createGalleryThumbnail(canvas, width)

        await writeFile(
          join(GALLERY_THUMB_OUTPUT_DIR, galleryThumbnailFileName(entry.galleryImageId, width)),
          thumbnail,
        )
      }),
      sharp(canvas)
        .resize(GALLERY_PREVIEW_SIZE.width, GALLERY_PREVIEW_SIZE.height, {
          fit      : 'cover',
          position : 'centre',
        })
        .blur(2)
        .webp({
          effort  : 6,
          quality : 34,
        })
        .toFile(join(GALLERY_PREVIEW_OUTPUT_DIR, `${entry.galleryImageId}.webp`)),
    ])

    console.log(
      `✓ Gallery ${entry.galleryImageId} → ` +
      `${GALLERY_FULL_WIDTHS.length} full widths, ` +
      `${GALLERY_THUMB_WIDTHS.length} thumbs, 1 preview`,
    )
  }
}

function mobileBackgroundHeightForWidth(width) {
  return Math.round(width * MOBILE_BACKGROUND_ASPECT_RATIO)
}

async function resolveMobileBackgroundCrop(referenceSource, targetWidth) {
  const targetHeight = mobileBackgroundHeightForWidth(targetWidth)
  const metadata = await sharp(referenceSource).metadata()
  const sourceWidth = metadata.width ?? targetWidth
  const sourceHeight = metadata.height ?? targetHeight
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight)
  const scaledWidth = Math.max(targetWidth, Math.round(sourceWidth * scale))
  const scaledHeight = Math.max(targetHeight, Math.round(sourceHeight * scale))
  const preferredLeft = Math.round(targetWidth * MOBILE_BACKGROUND_CROP_OFFSET_X_RATIO)

  return {
    left         : Math.min(Math.max(preferredLeft, 0), Math.max(0, scaledWidth - targetWidth)),
    top          : Math.max(0, Math.floor((scaledHeight - targetHeight) / 2)),
    width        : targetWidth,
    height       : targetHeight,
    scaledWidth,
    scaledHeight,
  }
}

function mobileBackgroundBase(source, crop) {
  return sharp(source)
    .resize(crop.scaledWidth, crop.scaledHeight, { fit : 'fill' })
    .extract({
      left   : crop.left,
      top    : crop.top,
      width  : crop.width,
      height : crop.height,
    })
}

async function mobileWallpaperBuffer(crop) {
  const [backgroundInput, middleInput, foregroundInput] = await Promise.all(
    PARALLAX_LAYERS.map((layer) =>
      mobileBackgroundBase(join(TMP, layer.sourceFile), crop).png().toBuffer(),
    ),
  )

  return sharp(backgroundInput)
    .composite([
      {
        input : middleInput,
        blend : 'over',
      },
      {
        input : foregroundInput,
        blend : 'over',
      },
    ])
    .png()
    .toBuffer()
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
    img.clone().resize(180, 180).png(PWA_ICON_PNG_OPTIONS).toFile(join(PUBLIC, 'apple-touch-icon.png')),
    img.clone().resize(192, 192).png(PWA_ICON_PNG_OPTIONS).toFile(join(PUBLIC, 'icon-192.png')),
    img.clone().resize(512, 512).png(PWA_ICON_PNG_OPTIONS).toFile(join(PUBLIC, 'icon-512.png')),
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
  console.log('⚠ No profile.jpg found - skipping favicon + avatar + icon generation')
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

/* ---- 6. Responsive gallery runtime assets ---- */
await writeGalleryRuntimeAssets()

/* ---- 7. Desktop LQIP output (single source) ---- */
const backgroundSourceCandidates = [
  join(TMP, 'background.png'),
  join(TMP, 'background.jpg'),
  join(TMP, 'background.webp'),
]
const backgroundSource = await (async () => {
  for (const candidate of backgroundSourceCandidates) {
    if (await exists(candidate)) return candidate
  }
  return null
})()

if (backgroundSource) {
  const desktopParallaxAssetDir = join(PUBLIC, 'parallax', 'desktop')
  await mkdir(desktopParallaxAssetDir, { recursive : true })

  const desktopLqipOutput = join(desktopParallaxAssetDir, 'layer-bg-lqip.webp')
  await sharp(backgroundSource)
    .resize({ width : 96, withoutEnlargement : true })
    .blur(3)
    .webp({ quality : 42 })
    .toFile(desktopLqipOutput)

  const desktopLqipSize = (await stat(desktopLqipOutput)).size
  console.log(
    '✓ Desktop LQIP → ' +
    `parallax/desktop/layer-bg-lqip.webp (${(desktopLqipSize / 1024).toFixed(1)}KB)`,
  )
} else {
  console.log('⚠ No tmp/background source found (png/jpg/webp) - skipping desktop LQIP generation')
}

/* ---- 8. Desktop icon sprite runtime optimization ---- */
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
  console.log('⚠ No desktop-profile-icons.webp found - skipping runtime sprite optimization')
}

/* ---- 9. Desktop parallax layers + mobile wallpapers (tmp -> public/parallax) ---- */
const desktopParallaxLayerOutputDir = join(PUBLIC, 'parallax', 'desktop')
const mobileBackgroundOutputDir      = join(PUBLIC, 'parallax', 'mobile')
const hasParallaxSources = await Promise.all(
  PARALLAX_LAYERS.map(async ({ sourceFile }) => exists(join(TMP, sourceFile))),
)

if (hasParallaxSources.every(Boolean)) {
  await Promise.all([
    mkdir(desktopParallaxLayerOutputDir, { recursive : true }),
    mkdir(mobileBackgroundOutputDir, { recursive : true }),
  ])

  for (const layer of PARALLAX_LAYERS) {
    const source = join(TMP, layer.sourceFile)

    for (const width of DESKTOP_PARALLAX_WIDTHS) {
      const webpOutput = join(desktopParallaxLayerOutputDir, `${layer.id}-${width}.webp`)
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

  const mobileLqipCrop = await resolveMobileBackgroundCrop(backgroundSource, 96)
  const mobileLqipInput = await mobileWallpaperBuffer(mobileLqipCrop)
  const mobileLqipOutput = join(mobileBackgroundOutputDir, 'wallpaper-lqip.webp')
  await sharp(mobileLqipInput)
    .blur(4)
    .webp({ quality : 44 })
    .toFile(mobileLqipOutput)

  const mobileLqipSize = (await stat(mobileLqipOutput)).size
  console.log(
    '✓ Mobile wallpaper LQIP → ' +
    `parallax/mobile/wallpaper-lqip.webp (${(mobileLqipSize / 1024).toFixed(1)}KB)`,
  )

  for (const width of MOBILE_BACKGROUND_WIDTHS) {
    const crop = await resolveMobileBackgroundCrop(backgroundSource, width)
    const wallpaperInput = await mobileWallpaperBuffer(crop)
    const webpOutput = join(mobileBackgroundOutputDir, `wallpaper-${width}.webp`)

    await sharp(wallpaperInput)
      .webp({
        quality : 76,
        effort  : 6,
      })
      .toFile(webpOutput)

    const webpBytes = (await stat(webpOutput)).size
    console.log(
      `✓ Mobile wallpaper ${width}px → ` +
      `${basename(webpOutput)} (${(webpBytes / 1024).toFixed(1)}KB)`,
    )
  }
} else {
  console.log('⚠ Missing tmp parallax source PNG files - skipping parallax + mobile wallpaper optimization')
}

console.log('Done.')
