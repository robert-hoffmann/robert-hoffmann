<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import MobileApp from './components/MobileApp.vue'
import { useViewMode } from './composables/useViewMode'

/*
 * Mobile is the primary audience, so keep the mobile shell eager.
 * Desktop-only UI logic loads on demand to reduce unused JS on mobile.
 */
const DesktopShell = defineAsyncComponent(() => import('./components/DesktopShell.vue'))
const CanonicalPage = defineAsyncComponent(() => import('./components/CanonicalPage.vue'))

function normalizePathname(pathname: string): string {
  const pathWithoutSearch = pathname.split(/[?#]/, 1)[0] || '/'
  const withLeadingSlash = pathWithoutSearch.startsWith('/')
    ? pathWithoutSearch
    : `/${pathWithoutSearch}`
  const withoutIndex = withLeadingSlash.replace(/\/index\.html$/u, '/')

  if (withoutIndex === '/') return '/'
  if (withoutIndex.endsWith('/')) return withoutIndex

  return `${withoutIndex}/`
}

function localizedCanonicalPathname(): string | null {
  if (typeof window === 'undefined') return null

  const pathname = normalizePathname(window.location.pathname)

  return /^\/(?:en|fr)(?:\/|$)/u.test(pathname) ? pathname : null
}

const { isMobile } = useViewMode()
const canonicalPathname = localizedCanonicalPathname()
</script>

<template>
  <CanonicalPage v-if="canonicalPathname" :pathname="canonicalPathname" />
  <MobileApp v-else-if="isMobile" />
  <DesktopShell v-else />
</template>
