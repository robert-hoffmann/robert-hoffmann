<script setup lang="ts">
import { projects } from '../data/content'
import { useLocale } from '../composables/useLocale'

const { l } = useLocale()
</script>

<template>
  <div class="projects-grid">
    <article v-for="project in projects" :key="project.id" class="project-card">
      <div class="project-header">
        <h3 class="project-title">{{ l(project.name) }}</h3>
        <span class="project-period">{{ project.period }}</span>
      </div>

      <span class="project-org">{{ l(project.org) }}</span>

      <p v-if="'highlight' in project" class="project-highlight">
        {{ l(project.highlight) }}
      </p>

      <p class="panel-paragraph">{{ l(project.summary) }}</p>

      <div class="project-stack">
        <span
          v-for="tech in project.stack"
          :key="`${project.id}-${tech}`"
          class="project-tag"
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
