<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import MobileHeader from './MobileHeader.vue'
import { about } from '../data/content'
import { useLocale } from '../composables/useLocale'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'

/* Preserve chunk isolation between mobile and desktop startup paths. */
const AboutApp    = defineAsyncComponent(() => import('./AboutApp.vue'))
const ResumeApp   = defineAsyncComponent(() => import('./ResumeApp.vue'))
const ProjectsApp = defineAsyncComponent(() => import('./ProjectsApp.vue'))

const OWNER_NAME  = 'Robert Hoffmann'
const TEASER_IMG  = `${import.meta.env.BASE_URL}screenshot-teaser.avif`

const { t }    = useLocale()
const theme    = useTheme()
const toast    = useToast()
</script>

<template>
  <div class="mobile-root" :data-theme="theme.theme.value">
    <MobileHeader :owner-name="OWNER_NAME" />

    <!-- Section navigation -->
    <nav class="mobile-nav" :aria-label="t('mobile.nav')">
      <a href="#about" class="mobile-nav-link">{{ t('mobile.about') }}</a>
      <a href="#resume" class="mobile-nav-link">{{ t('mobile.resume') }}</a>
      <a href="#projects" class="mobile-nav-link">{{ t('mobile.projects') }}</a>
    </nav>

    <main class="mobile-main">
      <h1 class="sr-only">{{ t('desktop.srTitle') }}</h1>

      <!-- About section -->
      <section id="about" class="mobile-section">
        <h2 class="mobile-section-title">{{ t('mobile.about') }}</h2>
        <AboutApp />
      </section>

      <!-- Resume section -->
      <section id="resume" class="mobile-section">
        <h2 class="mobile-section-title">{{ t('mobile.resume') }}</h2>
        <ResumeApp />
      </section>

      <!-- Projects section -->
      <section id="projects" class="mobile-section">
        <h2 class="mobile-section-title">{{ t('mobile.projects') }}</h2>
        <ProjectsApp />
      </section>
    </main>

    <!-- Footer -->
    <footer class="mobile-footer" :aria-label="t('mobile.footer')">
      <div class="mobile-footer-links">
        <a
          v-for="link in about.links"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="panel-link"
        >{{ link.label }}</a>
      </div>

      <!-- Desktop teaser -->
      <div class="mobile-teaser">
        <img
          :src="TEASER_IMG"
          alt="Desktop portfolio preview"
          class="mobile-teaser-img"
          width="800"
          height="369"
          loading="lazy"
        />
        <p class="mobile-teaser-text">{{ t('mobile.desktopTeaser') }}</p>
      </div>

      <p class="mobile-footer-copy">
        © {{ new Date().getFullYear() }} {{ OWNER_NAME }}
      </p>
    </footer>

    <!-- Toast -->
    <aside v-if="toast.message.value" class="toast" aria-live="polite">
      {{ toast.message.value }}
    </aside>
  </div>
</template>

<style scoped>
.mobile-root {
  display        : flex;
  flex-direction : column;
  min-block-size : 100dvh;
  background     : var(--surface-base);
  color          : var(--text-primary);
}

/* ---- Section nav bar ---- */
.mobile-nav {
  position         : sticky;
  inset-block-start: 0;
  z-index          : calc(var(--z-topbar) - 1);
  display          : flex;
  justify-content  : center;
  gap              : var(--space-1);
  padding-inline   : var(--space-4);
  padding-block    : var(--space-2);
  background       : var(--surface-glass);
  backdrop-filter   : blur(12px) saturate(1.3);
  -webkit-backdrop-filter : blur(12px) saturate(1.3);
  border-block-end : 1px solid var(--border-subtle);
  /* Sits just below the header — the header's sticky too,
     so overlap is handled by z-index layering */
  inset-block-start: 0;
}

.mobile-nav-link {
  padding-inline   : var(--space-3);
  padding-block    : var(--space-1);
  border-radius    : var(--radius-full);
  font-size        : var(--text-sm);
  font-weight      : 500;
  color            : var(--text-secondary);
  transition       : background var(--dur-fast) var(--ease-out),
                     color var(--dur-fast) var(--ease-out);

  &:hover {
    background : var(--icon-hover-bg);
    color      : var(--text-primary);
  }
}

/* ---- Main content ---- */
.mobile-main {
  flex         : 1;
  padding-inline : var(--space-4);
  scroll-behavior : smooth;
}

/* ---- Sections ---- */
.mobile-section {
  padding-block    : var(--space-8);
  border-block-end : 1px solid var(--border-subtle);

  /* Offset for sticky header + nav when jumping via anchors */
  scroll-margin-block-start : 6rem;

  &:last-child {
    border-block-end : none;
  }
}

.mobile-section-title {
  font-size        : var(--text-2xl);
  font-weight      : 700;
  color            : var(--text-primary);
  margin-block-end : var(--space-6);
}

/* ---- Footer ---- */
.mobile-footer {
  display        : flex;
  flex-direction : column;
  align-items    : center;
  gap            : var(--space-4);
  padding-inline : var(--space-4);
  padding-block  : var(--space-8);
  border-block-start : 1px solid var(--border-subtle);
  background     : var(--surface-raised);
}

.mobile-footer-links {
  display   : flex;
  flex-wrap : wrap;
  gap       : var(--space-3);
  justify-content : center;
}

.mobile-teaser {
  display        : flex;
  flex-direction : column;
  align-items    : center;
  gap            : var(--space-3);
  max-inline-size: 28rem;
}

.mobile-teaser-img {
  inline-size   : 100%;
  block-size    : auto;
  border-radius : var(--radius-lg);
  border        : 1px solid var(--border-subtle);
  box-shadow    : var(--shadow-md);
  object-fit    : cover;
}

.mobile-teaser-text {
  font-size   : var(--text-sm);
  color       : var(--text-secondary);
  text-align  : center;
  line-height : var(--leading-relaxed);
}

.mobile-footer-copy {
  font-size  : var(--text-xs);
  color      : var(--text-muted);
}
</style>
