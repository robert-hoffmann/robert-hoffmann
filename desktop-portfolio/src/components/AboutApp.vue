<script setup lang="ts">
import { about } from '../data/content'
</script>

<template>
  <div class="about-content">
    <!-- ---- Header: photo + name + tagline ---- -->
    <div class="about-header">
      <img
        :src="about.photo"
        :alt="about.name"
        class="about-photo"
        width="80"
        height="80"
      />
      <div class="about-header-text">
        <h3 class="about-name">{{ about.name }}</h3>
        <p class="about-tagline">{{ about.tagline }}</p>
      </div>
    </div>

    <!-- ---- AI callout ---- -->
    <blockquote class="about-ai-callout">
      <span class="about-ai-icon" aria-hidden="true">⚡</span>
      <p>{{ about.aiCallout }}</p>
    </blockquote>

    <!-- ---- Expertise pills ---- -->
    <div class="about-pills">
      <span
        v-for="skill in about.expertise"
        :key="skill"
        class="about-pill"
      >{{ skill }}</span>
    </div>

    <!-- ---- Narrative ---- -->
    <p class="panel-paragraph">{{ about.summary }}</p>

    <!-- ---- Certifications ---- -->
    <div class="about-certs">
      <h4 class="about-section-title">Certifications</h4>
      <div class="about-cert-pills">
        <span
          v-for="cert in about.certifications"
          :key="cert.label"
          class="about-pill about-pill--cert"
          :title="cert.issuer"
        >{{ cert.label }}</span>
      </div>
    </div>

    <!-- ---- Social links ---- -->
    <div class="panel-links">
      <a
        v-for="link in about.links"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="panel-link"
      >{{ link.label }}</a>
    </div>
  </div>
</template>

<style scoped>
.about-content {
  display        : flex;
  flex-direction : column;
  gap            : var(--space-5);
}

/* ---- Header ---- */
.about-header {
  display     : flex;
  align-items : center;
  gap         : var(--space-4);
}

.about-photo {
  inline-size   : 80px;
  block-size    : 80px;
  border-radius : var(--radius-full);
  object-fit    : cover;
  box-shadow    : 0 0 0 3px var(--c-accent),
                  0 4px 14px oklch(0% 0 0 / 0.25);
  flex-shrink   : 0;
}

.about-name {
  font-size   : var(--text-2xl);
  font-weight : 700;
  line-height : var(--leading-tight);
  color       : var(--text-primary);
}

.about-tagline {
  font-size      : var(--text-sm);
  color          : var(--text-muted);
  letter-spacing : 0.04em;
  margin-block-start : var(--space-1);
}

/* ---- AI callout ---- */
.about-ai-callout {
  display          : flex;
  align-items      : flex-start;
  gap              : var(--space-3);
  padding          : var(--space-3) var(--space-4);
  border-radius    : var(--radius-lg);
  border-inline-start : 3px solid var(--c-accent);
  background       : var(--icon-selected-bg);
  font-size        : var(--text-sm);
  line-height      : var(--leading-relaxed);
  color            : var(--text-secondary);
}

.about-ai-icon {
  font-size   : var(--text-lg);
  flex-shrink : 0;
  line-height : 1.4;
}

.about-ai-callout p {
  margin : 0;
}

/* ---- Expertise pills ---- */
.about-pills {
  display               : grid;
  grid-template-columns : repeat(auto-fill, minmax(10rem, 1fr));
  gap                   : var(--space-2);
}

.about-pill {
  display         : inline-flex;
  align-items     : center;
  justify-content : center;
  padding-inline  : var(--space-3);
  padding-block   : var(--space-1);
  border-radius   : var(--radius-full);
  background      : var(--icon-selected-bg);
  border          : 1px solid var(--border-subtle);
  font-size       : var(--text-sm);
  font-weight     : 500;
  color           : var(--text-secondary);
  letter-spacing  : 0.02em;
  cursor          : pointer;
  white-space     : nowrap;
  transition      : background var(--dur-fast) var(--ease-out),
                    color var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out);

  &:hover {
    background   : var(--c-accent);
    color        : var(--c-white);
    border-color : var(--c-accent);
  }
}

/* ---- Cert pills (flex wrap, smaller) ---- */
.about-cert-pills {
  display   : flex;
  flex-wrap : wrap;
  gap       : var(--space-2);
}

/* ---- Section title ---- */
.about-section-title {
  font-size      : var(--text-xs);
  font-weight    : 600;
  text-transform : uppercase;
  letter-spacing : 0.05em;
  color          : var(--text-muted);
  margin-block-end : var(--space-2);
}

.about-pill--cert {
  background   : transparent;
  border-color : var(--border-default);
  font-size    : var(--text-xs);
}

/* ---- Responsive: stack stats 2×2 in narrow windows ---- */
@container (max-width: 420px) {
  .about-stats {
    grid-template-columns : repeat(2, 1fr);
  }

  .about-header {
    flex-direction : column;
    text-align     : center;
  }
}
</style>
