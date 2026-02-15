<script setup lang="ts">
import { experience } from '../data/content'
import { useLocale } from '../composables/useLocale'

const { l } = useLocale()
</script>

<template>
  <div class="resume-timeline">
    <article v-for="entry in experience" :key="entry.id" class="resume-entry">
      <div class="resume-dot" />

      <div class="resume-content">
        <div class="resume-header">
          <h3 class="project-title">{{ l(entry.company) }}</h3>
          <span class="project-period">{{ entry.period }}</span>
        </div>

        <div class="resume-role-row">
          <span class="resume-role">{{ l(entry.role) }}</span>
          <span v-if="'type' in entry" class="resume-type">{{ l(entry.type) }}</span>
        </div>

        <span v-if="'location' in entry" class="resume-location">{{ l(entry.location) }}</span>

        <p v-if="'highlight' in entry" class="project-highlight">
          {{ l(entry.highlight) }}
        </p>

        <p class="panel-paragraph">{{ l(entry.summary) }}</p>

        <ul v-if="entry.bullets.length" class="panel-list">
          <li v-for="bullet in entry.bullets" :key="`${entry.id}-${l(bullet)}`">{{ l(bullet) }}</li>
        </ul>

        <div v-if="'stack' in entry" class="project-stack">
          <span
            v-for="tech in entry.stack"
            :key="`${entry.id}-${tech}`"
            class="project-tag"
          >{{ tech }}</span>
        </div>
      </div>
    </article>
  </div>
</template>
