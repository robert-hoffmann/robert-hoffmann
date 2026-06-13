import type { Locale } from '../../types/desktop'
import { publicAssetUrl } from '../../utils/publicAssets'

export const cvPdfUrls = {
  en : publicAssetUrl('docs/robert-hoffmann-cv.pdf'),
  fr : publicAssetUrl('docs/robert-hoffmann-cv-fr.pdf'),
} satisfies Record<Locale, string>

export function resolveCvPdfUrl(locale: Locale): string {
  return cvPdfUrls[locale]
}
