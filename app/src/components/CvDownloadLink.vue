<script setup lang="ts">
import { useCvDownload } from '../composables/useCvDownload'

type CvDownloadLinkPlacement = 'inline' | 'sticky'
type CvDownloadLinkPresentation = 'label' | 'icon'

const props = withDefaults(defineProps<{
  placement?: CvDownloadLinkPlacement
  presentation?: CvDownloadLinkPresentation
}>(), {
  placement     : 'inline',
  presentation : 'label',
})

const {
  cvPdfLabel,
  cvPdfSprite,
  cvPdfUrl,
} = useCvDownload()
</script>

<template>
  <a
    class        = "cv-download-link"
    :class      = "[
      `cv-download-link--placement-${props.placement}`,
      `cv-download-link--presentation-${props.presentation}`,
    ]"
    :href       = "cvPdfUrl"
    target      = "_blank"
    rel         = "noopener noreferrer"
    :aria-label = "cvPdfLabel"
    :title      = "props.presentation === 'icon' ? cvPdfLabel : undefined"
  >
    <span
      v-if = "props.presentation === 'label'"
      class = "cv-download-link__label"
    >{{ cvPdfLabel }}</span>
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

.cv-download-link--presentation-icon {
  --cv-download-icon-button-size : 2.25rem;
  --cv-download-icon-size        : 1.8rem;

  display         : inline-grid;
  place-items     : center;
  gap             : 0;
  inline-size     : var(--cv-download-icon-button-size);
  block-size      : var(--cv-download-icon-button-size);
  padding         : 0;
  justify-content : center;
}

.cv-download-link__label {
  min-inline-size : 0;
  font-weight     : 600;
  line-height     : var(--leading-tight);
  font-size       : var(--text-sm);
  letter-spacing  : 0.02em;
}

.cv-download-link__icon {
  --sprite-target-w : var(--cv-download-icon-size, 2rem);

  flex   : 0 0 auto;
  filter : drop-shadow(0 1px 2px oklch(0% 0 0 / 0.18));
}
</style>
