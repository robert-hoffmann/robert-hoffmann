<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import { projects, projectsMessages, type Project } from '../data/apps/projects'
import { useLocale } from '../composables/useLocale'
import {
  OPEN_PORTFOLIO_APP_EVENT,
  type OpenPortfolioAppEventDetail,
  usePortfolioNavigation,
} from '../composables/usePortfolioNavigation'

const { l, t } = useLocale(projectsMessages)
const {
  clearProjectInfoRequest,
  projectInfoRequest,
  showGalleryImage,
} = usePortfolioNavigation()

const highlightedProjectId = ref<string | null>(null)
const projectElements      = new Map<string, HTMLElement>()

let highlightTimer: number | null = null

function getProjectImageId(project: Project) {
  if ('imageId' in project && typeof project.imageId === 'number') {
    return project.imageId
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
  await nextTick()
  scrollToProject(projectId)
}

function onOpenPortfolioApp(event: Event) {
  const detail = (event as CustomEvent<OpenPortfolioAppEventDetail>).detail

  if (detail?.itemId !== 'projects' || !detail.projectId) return

  void scrollToRequestedProject(detail.projectId)
}

function openProjectImage(project: Project) {
  const imageId = getProjectImageId(project)

  if (imageId === null) return

  showGalleryImage(imageId)
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
  <div class="projects-grid">
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
          v-if="getProjectImageId(project) !== null"
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
          :key="`${project.id}-${l(highlight)}`"
          class="content-highlight"
        >{{ l(highlight) }}</span>
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
  overflow-y            : auto;
  scrollbar-width       : thin;
  scrollbar-color       : var(--icon-selected-bg) var(--surface-raised);

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
  scroll-margin-block-start : var(--space-4);
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
</style>
