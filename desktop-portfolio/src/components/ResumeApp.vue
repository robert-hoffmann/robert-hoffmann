<script setup lang="ts">
import { experience } from '../data/content'
</script>

<template>
  <div class="resume-timeline">
    <article v-for="entry in experience" :key="entry.id" class="resume-entry">
      <div class="resume-dot" />

      <div class="resume-content">
        <div class="resume-header">
          <h3 class="project-title">{{ entry.company }}</h3>
          <span class="project-period">{{ entry.period }}</span>
        </div>

        <div class="resume-role-row">
          <span class="resume-role">{{ entry.role }}</span>
          <span v-if="'type' in entry" class="resume-type">{{ entry.type }}</span>
        </div>

        <span v-if="'location' in entry" class="resume-location">{{ entry.location }}</span>

        <p v-if="'highlight' in entry" class="project-highlight">
          {{ entry.highlight }}
        </p>

        <p class="panel-paragraph">{{ entry.summary }}</p>

        <ul v-if="entry.bullets.length" class="panel-list">
          <li v-for="bullet in entry.bullets" :key="`${entry.id}-${bullet}`">{{ bullet }}</li>
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
