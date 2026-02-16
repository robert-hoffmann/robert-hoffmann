<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const props = defineProps<{
  messageKey : string
  ctaKey     : string
  url        : string
  delay      : number
}>()

const visible   = ref(false)
const dismissed = ref(false)
let delayTimer:   ReturnType<typeof setTimeout> | undefined
let dismissTimer: ReturnType<typeof setTimeout> | undefined

function dismiss() {
  dismissed.value = true
  visible.value   = false
}

function follow() {
  window.open(props.url, '_blank', 'noopener')
  dismiss()
}

onMounted(() => {
  delayTimer = setTimeout(() => {
    visible.value = true
    dismissTimer = setTimeout(dismiss, 30_000)
  }, props.delay)
})

onUnmounted(() => {
  clearTimeout(delayTimer)
  clearTimeout(dismissTimer)
})
</script>

<template>
  <Transition name="notif">
    <aside
      v-if="visible && !dismissed"
      class="notification-toast"
      role="status"
      aria-live="polite"
    >
      <button
        class="notification-close"
        type="button"
        :aria-label="t('notification.dismiss')"
        @click="dismiss"
      >&times;</button>
      <p class="notification-body">{{ t(messageKey) }}</p>
      <button
        class="notification-action"
        type="button"
        @click="follow"
      >{{ t(ctaKey) }}</button>
    </aside>
  </Transition>
</template>
