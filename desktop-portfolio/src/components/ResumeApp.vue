<script setup lang="ts">
import CvDownloadLink from './CvDownloadLink.vue'
import { experience } from '../data/apps/resume'
import { useLocale } from '../composables/useLocale'

const { l } = useLocale()
</script>

<template>
  <div class="resume-timeline">
    <CvDownloadLink placement="sticky" />

    <div class="resume-timeline-list">
      <article v-for="entry in experience" :key="entry.id" class="resume-entry">
        <div class="resume-dot" />

        <div class="resume-content">
          <div class="resume-header">
            <h3 class="content-title">{{ l(entry.company) }}</h3>
            <span class="content-period">{{ entry.period }}</span>
          </div>

          <div class="resume-role-row">
            <span class="resume-role">{{ l(entry.role) }}</span>
          </div>

          <div
            v-if="'type' in entry || 'location' in entry"
            class="resume-meta-row"
          >
            <span v-if="'type' in entry" class="resume-type">{{ l(entry.type) }}</span>
            <span
              v-if="'type' in entry && 'location' in entry"
              class="resume-meta-separator"
              aria-hidden="true"
            >·</span>
            <span v-if="'location' in entry" class="resume-location">{{ l(entry.location) }}</span>
          </div>

          <p class="panel-paragraph">{{ l(entry.summary) }}</p>

          <ul v-if="entry.bullets.length" class="panel-list">
            <li v-for="bullet in entry.bullets" :key="`${entry.id}-${l(bullet)}`">{{ l(bullet) }}</li>
          </ul>

          <div v-if="'stack' in entry" class="content-stack">
            <span
              v-for="tech in entry.stack"
              :key="`${entry.id}-${tech}`"
              class="content-tag"
            >{{ tech }}</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.resume-timeline {
  --cv-download-sticky-top : 10px;

  position             : relative;
  inline-size          : 100%;
  block-size           : 100%;
  min-block-size       : 0;
  padding              : var(--space-6);
  padding-block-start  : 0;
  padding-inline-start : calc(var(--space-6) * 2);
  overflow-y           : auto;
  scrollbar-width      : thin;
  scrollbar-color      : var(--icon-selected-bg) var(--surface-raised);
  touch-action         : pan-y;

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

.resume-timeline-list {
  position : relative;
}

.resume-timeline-list::before {
  content            : '';
  position           : absolute;
  inset-inline-start : calc(-1 * var(--space-6) + 0.5rem);
  inset-block-start  : 0.25rem;
  inset-block-end    : 0.25rem;
  inline-size        : 2px;
  background         : var(--border-subtle);
}

.resume-entry {
  position          : relative;
  padding-block-end : var(--space-6);
  margin-block-end  : var(--space-2);

  &:last-child {
    padding-block-end : 0;
    margin-block-end  : 0;
  }
}

.resume-dot {
  position           : absolute;
  inset-inline-start : calc(-1 * var(--space-6) + 0.25rem);
  inset-block-start  : 0.35rem;
  inline-size        : 0.625rem;
  block-size         : 0.625rem;
  border-radius      : var(--radius-full);
  background         : var(--c-accent);
  box-shadow         : 0 0 0 3px var(--surface-base);
}

.resume-header {
  display          : flex;
  align-items      : baseline;
  justify-content  : space-between;
  gap              : var(--space-3);
  flex-wrap        : wrap;
  margin-block-end : var(--space-1);
}

.resume-role-row {
  display          : flex;
  align-items      : center;
  gap              : var(--space-2);
  flex-wrap        : wrap;
  margin-block-end : var(--space-1);
}

.resume-role {
  font-size   : var(--text-sm);
  font-weight : 600;
  color       : var(--text-primary);
}

.resume-type {
  padding-inline : var(--space-2);
  padding-block  : 0.0625rem;
  border-radius  : var(--radius-full);
  background     : var(--icon-hover-bg);
  color          : var(--text-meta);
  font-family    : var(--font-mono);
  font-size      : var(--text-xs);
}

.resume-meta-row {
  display          : flex;
  align-items      : center;
  flex-wrap        : wrap;
  gap              : var(--space-1);
  min-inline-size  : 0;
  margin-block-end : var(--space-2);
}

.resume-meta-separator {
  color       : var(--text-meta);
  font-family : var(--font-mono);
  font-size   : var(--text-xs);
  line-height : var(--leading-tight);
}

.resume-location {
  min-inline-size : 0;
  color           : var(--text-meta);
  font-size       : var(--text-xs);
  line-height     : var(--leading-tight);
}
</style>
