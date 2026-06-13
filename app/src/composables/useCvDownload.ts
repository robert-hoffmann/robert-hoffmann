import { computed } from 'vue'
import { resolveCvPdfUrl } from '../data/docs/cvDownloads'
import { windowRegistry } from '../data/registry'
import { useLocale } from './useLocale'

const cvPdf = windowRegistry['cv-pdf']

if (!cvPdf || cvPdf.type !== 'link' || !cvPdf.url || cvPdf.iconSprite !== 'cv-pdf') {
  throw new Error(
    'The cv-pdf registry entry must define a PDF link URL and sprite key.',
  )
}

const cvPdfSprite = cvPdf.iconSprite

export function useCvDownload() {
  const { locale, t } = useLocale()

  return {
    cvPdfLabel  : computed(() => t('cvDownload.label')),
    cvPdfSprite,
    cvPdfUrl    : computed(() => resolveCvPdfUrl(locale.value)),
  }
}
