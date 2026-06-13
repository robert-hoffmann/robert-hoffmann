<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import { useCvDownload } from '../composables/useCvDownload'
import { useLocale } from '../composables/useLocale'
import {
  OPEN_PORTFOLIO_APP_EVENT,
  type OpenPortfolioAppEventDetail,
  usePortfolioNavigation,
} from '../composables/usePortfolioNavigation'
import { usePersistedWindowScroll } from '../composables/usePersistedWindowScroll'
import type { GalleryImageId } from '../data/apps/gallery'
import { projects, projectsMessages, type Project } from '../data/apps/projects'

const { l, t } = useLocale(projectsMessages)
const {
  cvPdfLabel,
  cvPdfSprite,
  cvPdfUrl,
} = useCvDownload()
const {
  clearProjectInfoRequest,
  projectInfoRequest,
  showGalleryImage,
} = usePortfolioNavigation()

const highlightedProjectId        = ref<string | null>(null)
const skipPersistedScrollRestore  = ref(Boolean(projectInfoRequest.value))
const scrollRef                   = useTemplateRef<HTMLElement>('projectsScroll')
const projectElements             = new Map<string, HTMLElement>()

usePersistedWindowScroll(scrollRef, {
  shouldRestore : () => !skipPersistedScrollRestore.value,
})

let highlightTimer: number | null = null

function getProjectGalleryImageId(project: Project): GalleryImageId | null {
  if ('galleryImageId' in project && typeof project.galleryImageId === 'string') {
    return project.galleryImageId as GalleryImageId
  }

  return null
}

function setProjectElement(
  projectId: string,
  el: Element | ComponentPublicInstance | null,
) {
  if (el instanceof HTMLElement) {
    projectElements.set(projectId, el)
    return
  }

  projectElements.delete(projectId)
}

function clearProjectHighlightTimer() {
  if (highlightTimer === null) return

  window.clearTimeout(highlightTimer)
  highlightTimer = null
}

function highlightProject(projectId: string) {
  clearProjectHighlightTimer()
  highlightedProjectId.value = projectId

  highlightTimer = window.setTimeout(() => {
    if (highlightedProjectId.value === projectId) {
      highlightedProjectId.value = null
    }

    highlightTimer = null
  }, 1_600)
}

function scrollToProject(projectId: string) {
  const element = projectElements.get(projectId)

  if (!element) return

  element.scrollIntoView({
    block    : 'start',
    behavior : 'smooth',
  })
  highlightProject(projectId)
}

async function scrollToRequestedProject(projectId: string) {
  skipPersistedScrollRestore.value = true
  await nextTick()
  scrollToProject(projectId)
}

function onOpenPortfolioApp(event: Event) {
  const detail = (event as CustomEvent<OpenPortfolioAppEventDetail>).detail

  if (detail?.itemId !== 'projects' || !detail.projectId) return

  void scrollToRequestedProject(detail.projectId)
}

function openProjectImage(project: Project) {
  const galleryImageId = getProjectGalleryImageId(project)

  if (galleryImageId === null) return

  showGalleryImage(galleryImageId)
}

watch(
  () => projectInfoRequest.value,
  async (request) => {
    if (!request) return

    await scrollToRequestedProject(request.projectId)
    clearProjectInfoRequest(request.requestId)
  },
  { immediate : true },
)

onMounted(() => {
  window.addEventListener(OPEN_PORTFOLIO_APP_EVENT, onOpenPortfolioApp)
})

onBeforeUnmount(() => {
  clearProjectHighlightTimer()
  window.removeEventListener(OPEN_PORTFOLIO_APP_EVENT, onOpenPortfolioApp)
})
</script>

<template>
  <div ref="projectsScroll" class="projects-grid">
    <aside
      class="project-availability"
      aria-labelledby="project-availability-title"
    >
      <a
        class="project-availability__download"
        :href="cvPdfUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="cvPdfLabel"
        :title="cvPdfLabel"
      >
        <span
          class="icon-sprite project-availability__download-icon"
          :class="`icon-sprite--${cvPdfSprite}`"
          aria-hidden="true"
        />
      </a>
      <div class="project-availability__content">
        <h3
          id="project-availability-title"
          class="project-availability__title"
        >{{ t('projects.availability.title') }}</h3>
        <p class="project-availability__body">
          {{ t('projects.availability.body') }}
        </p>
      </div>
    </aside>

    <article
      v-for="project in projects"
      :id="project.id"
      :key="project.id"
      :ref="(el) => setProjectElement(project.id, el)"
      class="project-card"
      :class="{ 'project-card--target': highlightedProjectId === project.id }"
    >
      <div class="project-header">
        <h3 class="content-title">{{ l(project.name) }}</h3>
      </div>

      <div class="project-meta">
        <div class="project-period content-period">{{ project.period }}</div>
        <span class="project-org">{{ l(project.org) }}</span>

        <button
          v-if="getProjectGalleryImageId(project) !== null"
          class="project-gallery-button"
          type="button"
          :aria-label="t('projects.openGalleryImage', { title: l(project.name) })"
          @click="openProjectImage(project)"
        >
          <svg
            class="project-gallery-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <div class="project-highlights">
        <span
          v-for="highlight in project.highlights"
          :key="`${project.id}-${l(highlight.label)}`"
          class="content-highlight"
        >{{ l(highlight.label) }}</span>
      </div>

      <p class="panel-paragraph">{{ l(project.summary) }}</p>

      <div class="content-stack">
        <span
          v-for="tech in project.stack"
          :key="`${project.id}-${tech}`"
          class="content-tag"
        >{{ tech }}</span>
      </div>

      <div v-if="'links' in project" class="panel-links">
        <a
          v-for="link in project.links"
          :key="`${project.id}-${link.href}`"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="panel-link"
        >{{ link.label }}</a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.projects-grid {
  display               : grid;
  grid-template-columns : 1fr;
  gap                   : 0;
  inline-size           : 100%;
  block-size            : 100%;
  min-block-size        : 0;
  padding               : var(--space-6);
  padding-block-start   : var(--space-3);
  container             : projects-grid / inline-size;
  overflow-y            : auto;
  scrollbar-width       : thin;
  scrollbar-color       : var(--icon-selected-bg) var(--surface-raised);
  touch-action          : pan-y;

  &::-webkit-scrollbar {
    inline-size : 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius : 4px;
    background    : var(--surface-raised);
  }

  &::-webkit-scrollbar-thumb {
    border-radius : 4px;
    background    : var(--icon-selected-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background : var(--c-accent);
  }
}

.project-card {
  padding-block-end         : var(--space-6);
  margin-block-end          : var(--space-6);
  border-block-end          : 1px solid var(--border-subtle);
  scroll-margin-block-start : calc(3rem + var(--space-4));
  transition                : background var(--dur-normal) var(--ease-out),
                              box-shadow var(--dur-normal) var(--ease-out);

  &:last-child {
    border-block-end  : none;
    margin-block-end  : 0;
    padding-block-end : 0;
  }
}

.project-card--target {
  border-radius : var(--radius-md);
  background    : color-mix(in oklch, var(--c-accent) 10%, transparent);
  box-shadow    : inset 0 0 0 1px color-mix(in oklch, var(--c-accent) 42%, transparent);
}

.project-availability {
  display                : grid;
  grid-template-columns  : auto minmax(0, 1fr);
  gap                    : var(--space-2);
  align-items            : start;
  margin-block-end       : var(--space-4);
  padding                : var(--space-3);
  border                 : 1px solid var(--border-subtle);
  border-inline-start    : 3px solid var(--c-accent);
  border-radius          : var(--radius-md);
  background             : color-mix(in oklch, var(--icon-selected-bg) 74%, transparent);
  box-shadow             : inset 0 1px 0 oklch(100% 0 0 / 0.06);
}

.project-availability__content {
  min-inline-size : 0;
}

.project-availability__title {
  margin         : 0 0 var(--space-1);
  color          : var(--text-primary);
  font-size      : var(--text-sm);
  font-weight    : 650;
  line-height    : var(--leading-tight);
  letter-spacing : 0.02em;
}

.project-availability__body {
  margin         : 0;
  color          : var(--text-secondary);
  font-size      : var(--text-xs);
  line-height    : var(--leading-relaxed);
  letter-spacing : 0.01em;
}

.project-availability__download {
  display         : inline-grid;
  place-items     : center;
  align-self      : start;
  inline-size     : 2.25rem;
  block-size      : 2.25rem;
  border-radius   : var(--radius-md);
  color           : var(--text-primary);
  text-decoration : none;
  transition      : background var(--dur-fast) var(--ease-out),
                    transform var(--dur-fast) var(--ease-out);

  &:hover {
    background : color-mix(in oklch, var(--c-accent) 16%, transparent);
    transform  : translateY(-1px);
  }

  &:focus-visible {
    outline        : 2px solid var(--focus-ring);
    outline-offset : 2px;
  }
}

.project-availability__download-icon {
  --sprite-target-w : 1.8rem;

  filter : drop-shadow(0 1px 2px oklch(0% 0 0 / 0.2));
}

.project-header {
  display               : grid;
  grid-template-columns : minmax(0, 1fr);
  margin-block-end      : var(--space-1);
}

.project-meta {
  display               : grid;
  grid-template-columns : minmax(0, 1fr) auto;
  grid-template-rows    : auto auto;
  align-items           : center;
  column-gap            : var(--space-2);
  min-inline-size       : 0;
  margin-block-end      : var(--space-2);
}

.project-period {
  grid-column : 1;
  grid-row    : 1;
}

.project-org {
  grid-column     : 1;
  grid-row        : 2;
  min-inline-size : 0;
  font-size       : var(--text-xs);
  font-weight     : 500;
  color           : var(--c-accent);
  letter-spacing  : 0.02em;
}

.project-gallery-button {
  grid-column    : 2;
  grid-row       : 1 / span 2;
  align-self     : stretch;
  display        : inline-grid;
  place-items    : center;
  inline-size    : 2.25rem;
  min-block-size : 2.25rem;
  padding        : 0;
  border         : 1px solid var(--border-subtle);
  border-radius  : var(--radius-md);
  background     : var(--surface-raised);
  color          : var(--c-accent);
  line-height    : 1;
  cursor         : pointer;
  transition     : background var(--dur-fast) var(--ease-out),
                   border-color var(--dur-fast) var(--ease-out),
                   transform var(--dur-fast) var(--ease-out);

  &:hover {
    border-color : color-mix(in oklch, var(--c-accent) 50%, var(--border-subtle));
    background   : var(--icon-selected-bg);
    transform    : translateY(-1px);
  }

  &:focus-visible {
    outline        : 2px solid var(--focus-ring);
    outline-offset : 2px;
  }
}

.project-gallery-icon {
  inline-size : 1.1rem;
  block-size  : 1.1rem;
}

.project-highlights {
  display          : flex;
  flex-wrap        : wrap;
  gap              : var(--space-1);
  margin-block-end : var(--space-3);
}

.project-highlights .content-highlight {
  padding-inline : var(--space-2);
  font-size      : var(--text-xs);
  line-height    : var(--leading-tight);
  white-space    : nowrap;
}

@container projects-grid (max-width: 420px) {
  .project-availability {
    grid-template-columns : auto minmax(0, 1fr);
    gap              : var(--space-2);
    margin-block-end : var(--space-4);
    padding          : var(--space-2) var(--space-3);
  }

  .project-availability__title {
    font-size : var(--text-xs);
  }

  .project-availability__body {
    line-height : var(--leading-normal);
  }

  .project-availability__download {
    inline-size : 2rem;
    block-size  : 2rem;
  }

  .project-availability__download-icon {
    --sprite-target-w : 1.62rem;
  }
}
</style>
