const publicAssetVersion = __PUBLIC_ASSET_VERSION__

function appendAssetVersion(url: string) {
  if (!publicAssetVersion) return url

  const hashIndex = url.indexOf('#')
  const urlWithoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : ''
  const separator = urlWithoutHash.includes('?') ? '&' : '?'

  return `${urlWithoutHash}${separator}v=${encodeURIComponent(publicAssetVersion)}${hash}`
}

export function publicAssetUrl(path: string) {
  const trimmed = path.trim()
  const isAbsolute = /^(https?:|data:|blob:)/i.test(trimmed)

  if (isAbsolute) return trimmed

  const normalizedPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed

  return appendAssetVersion(`${import.meta.env.BASE_URL}${normalizedPath}`)
}

export function publicAssetCssUrl(path: string) {
  return `url("${publicAssetUrl(path)}")`
}
