<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import MobileApp from './components/MobileApp.vue'
import { useViewMode } from './composables/useViewMode'

/*
 * Mobile is the primary audience, so keep the mobile shell eager.
 * Desktop-only UI logic loads on demand to reduce unused JS on mobile.
 */
const DesktopShell = defineAsyncComponent(() => import('./components/DesktopShell.vue'))

const { isMobile } = useViewMode()
</script>

<template>
  <MobileApp v-if="isMobile" />
  <DesktopShell v-else />
</template>
