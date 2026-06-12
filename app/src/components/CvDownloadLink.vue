<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import { windowRegistry } from '../data/registry'

type CvDownloadLinkPlacement = 'inline' | 'sticky'

const props = withDefaults(defineProps<{
  placement?: CvDownloadLinkPlacement
}>(), {
  placement : 'inline',
})

const { t } = useLocale()
const cvPdf = windowRegistry['cv-pdf']

if (!cvPdf || cvPdf.type !== 'link' || !cvPdf.url || cvPdf.iconSprite !== 'cv-pdf') {
  throw new Error(
    'The cv-pdf registry entry must define a PDF link URL and sprite key.',
  )
}

const cvPdfUrl      = cvPdf.url
const cvPdfSprite   = cvPdf.iconSprite
const downloadLabel = computed(() => t('cvDownload.label'))
</script>

<template>
  <a
    class="cv-download-link"
    :class="`cv-download-link--placement-${props.placement}`"
    :href="cvPdfUrl"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="downloadLabel"
  >
    <span class="cv-download-link__label">{{ downloadLabel }}</span>
    <span
      class="icon-sprite cv-download-link__icon"
      :class="`icon-sprite--${cvPdfSprite}`"
      aria-hidden="true"
    />
  </a>
</template>

<style scoped>
.cv-download-link {
  display         : inline-flex;
  align-items     : center;
  justify-content : space-between;
  gap             : var(--space-3);
  inline-size     : 100%;
  padding-inline  : var(--space-3);
  padding-block   : var(--space-2);
  border          : 1px solid var(--border-subtle);
  border-radius   : var(--radius-md);
  background      : color-mix(in oklch, var(--surface-raised) 82%, transparent);
  color           : var(--text-primary);
  text-decoration : none;
  box-shadow      : inset 0 1px 0 oklch(100% 0 0 / 0.08);
  transition      : background var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out),
                    color var(--dur-fast) var(--ease-out),
                    transform var(--dur-fast) var(--ease-out);

  &:hover {
    border-color : color-mix(in oklch, var(--c-accent) 45%, var(--border-subtle));
    background   : var(--icon-selected-bg);
    color        : var(--text-primary);
    transform    : translateY(-1px);
  }

  &:focus-visible {
    outline        : 2px solid var(--focus-ring);
    outline-offset : 2px;
  }
}

.cv-download-link--placement-sticky {
  position                : sticky;
  inset-block-start       : var(--cv-download-sticky-top, 10px);
  z-index                 : 4;
  margin-block-end        : var(--space-5);
  border-color            : var(--c-accent);
  backdrop-filter         : blur(12px);
  -webkit-backdrop-filter : blur(12px);

  &:hover {
    border-color : var(--c-accent);
  }
}

.cv-download-link__label {
  min-inline-size : 0;
  font-weight     : 600;
  line-height     : var(--leading-tight);
  font-size       : var(--text-sm);
  letter-spacing  : 0.02em;
}

.cv-download-link__icon {
  --sprite-target-w : 2rem;

  flex   : 0 0 auto;
  filter : drop-shadow(0 1px 2px oklch(0% 0 0 / 0.18));
}
</style>
