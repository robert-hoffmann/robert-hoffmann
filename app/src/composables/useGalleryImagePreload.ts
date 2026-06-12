type GalleryImageFetchPriority = 'auto' | 'high' | 'low'

interface GalleryPreloadImageSource {
  src        : string
  webpSrcset : string
}

const preloadedGalleryImages = new Set<string>()

export function preloadGalleryImage(
  source        : GalleryPreloadImageSource,
  sizes         : string,
  fetchPriority : GalleryImageFetchPriority = 'low',
) {
  if (typeof document === 'undefined') return
  if (!source.src || !source.webpSrcset) return

  const normalizedSizes = sizes.trim() || '100vw'
  const cacheKey        = source.src

  if (preloadedGalleryImages.has(cacheKey)) return

  preloadedGalleryImages.add(cacheKey)

  const link = document.createElement('link')

  link.rel  = 'preload'
  link.as   = 'image'
  link.href = source.src
  link.type = 'image/webp'
  link.setAttribute('imagesrcset', source.webpSrcset)
  link.setAttribute('imagesizes', normalizedSizes)
  link.setAttribute('fetchpriority', fetchPriority)

  document.head.append(link)
}
