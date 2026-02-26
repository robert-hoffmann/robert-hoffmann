<script setup lang="ts">
import { ref } from 'vue'
import NotificationStack from '../NotificationStack.vue'

interface NotificationStackApi {
  showToast : (options?: {
    title? : string
    message? : string
    duration? : number
    url? : string
    ctaLabel? : string
    ctaVariants? : string[]
  }) => Promise<void> | void
  dismissAllToasts : () => void
}

const stackRef = ref<NotificationStackApi | null>(null)

function showToast(options?: Parameters<NotificationStackApi['showToast']>[0]) {
  return stackRef.value?.showToast(options)
}

function dismissAllToasts() {
  stackRef.value?.dismissAllToasts()
}

defineExpose({
  showToast,
  dismissAllToasts,
})
</script>

<template>
  <NotificationStack ref="stackRef" variant="mobile" />
</template>
