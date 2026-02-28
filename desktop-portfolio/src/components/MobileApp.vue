<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import MobileHeader from './mobile/MobileHeader.vue'
import MobileHomeGrid from './mobile/MobileHomeGrid.vue'
import MobileDock from './mobile/MobileDock.vue'
import MobileAppSurface from './mobile/MobileAppSurface.vue'
import MobileToastStack from './mobile/MobileToastStack.vue'
import { useLocale } from '../composables/useLocale'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'
import { useViewMode } from '../composables/useViewMode'
import { useMobileShell } from '../composables/useMobileShell'
import { getRegistryTitle, windowRegistry } from '../data/registry'
import {
  BRIDGED_TOAST_DURATION_MS,
  MOBILE_WELCOME_TOAST_DELAY_MS,
  MOBILE_WELCOME_TOAST_DURATION_MS,
  SOCIAL_TOAST_DELAY_LINKEDIN_MS,
  SOCIAL_TOAST_DELAY_X_MS,
  SOCIAL_TOAST_DURATION_MS,
} from '../constants/notificationTimings'

const OWNER_NAME = 'Robert Hoffmann'

const rootStyle = {
  '--desktop-sprite-url' : 'url("/icons/desktop-profile-icons-runtime.webp")',
}

interface MobileToastStackApi {
  showToast : (options?: {
    title? : string
    message? : string
    duration? : number
    url? : string
    ctaLabel? : string
    ctaVariants? : string[]
  }) => Promise<void> | void
}

const { t, locale } = useLocale()
const theme = useTheme()
const toast = useToast()
const { isPreview } = useViewMode()
const mobileShell = useMobileShell()

const clockLabel = ref('')
const dateLabel = ref('')
const mobileToastStackRef = ref<MobileToastStackApi | null>(null)

let clockTimer: ReturnType<typeof setInterval> | null = null
const notificationTimers: Array<ReturnType<typeof setTimeout>> = []

const currentAppItemId = computed(() =>
  mobileShell.currentMobileWindow.value?.itemId ?? '',
)

const currentWindowCapabilities = computed(() => {
  const currentWindow = mobileShell.currentMobileWindow.value
  if (!currentWindow) {
    return {
      canMinimize : false,
      canMaximize : false,
    }
  }

  const capabilities = mobileShell.getWindowCapabilities(currentWindow.id)
  return {
    canMinimize : capabilities.canMinimize,
    canMaximize : capabilities.canMaximize,
  }
})

function localeCode() {
  return locale.value === 'fr' ? 'fr-FR' : 'en-US'
}

function updateClockLabels() {
  const now = new Date()
  const intlLocale = localeCode()

  try {
    clockLabel.value = now.toLocaleTimeString(intlLocale, {
      hour      : '2-digit',
      minute    : '2-digit',
      hour12    : false,
      hourCycle : 'h23',
    })
    dateLabel.value = now.toLocaleDateString(intlLocale, {
      weekday : 'long',
      month   : 'short',
      day     : 'numeric',
    })
  } catch {
    clockLabel.value = now.toLocaleTimeString([], {
      hour      : '2-digit',
      minute    : '2-digit',
      hour12    : false,
      hourCycle : 'h23',
    })
    dateLabel.value = now.toDateString()
  }
}

function enqueueNotificationTimer(delayMs: number, callback: () => void) {
  const timerId = setTimeout(() => {
    const timerIndex = notificationTimers.indexOf(timerId)
    if (timerIndex >= 0) notificationTimers.splice(timerIndex, 1)
    callback()
  }, delayMs)

  notificationTimers.push(timerId)
  return timerId
}

function clearNotificationTimers() {
  for (const timerId of notificationTimers) clearTimeout(timerId)
  notificationTimers.length = 0
}

function showMobileToast(options: Parameters<NonNullable<MobileToastStackApi['showToast']>>[0]) {
  return mobileToastStackRef.value?.showToast(options)
}

function showWelcomeToast() {
  showMobileToast({
    title    : t('notification.mobileWelcomeTitle'),
    message  : t('notification.mobileWelcomeMessage'),
    duration : MOBILE_WELCOME_TOAST_DURATION_MS,
  })
}

function showSocialToast(kind: 'twitter' | 'linkedin') {
  const entry = windowRegistry[kind]
  if (!entry || entry.type !== 'link' || !entry.url) return

  const isTwitter = kind === 'twitter'
  showMobileToast({
    title      : getRegistryTitle(kind, locale.value),
    message    : t(isTwitter ? 'notification.followMessage' : 'notification.connectMessage'),
    url        : entry.url,
    ctaLabel   : t(isTwitter ? 'notification.followCta' : 'notification.connectCta'),
    ctaVariants: ['soft'],
    duration   : SOCIAL_TOAST_DURATION_MS,
  })
}

function scheduleMobileNotifications() {
  enqueueNotificationTimer(MOBILE_WELCOME_TOAST_DELAY_MS, () => {
    showWelcomeToast()
  })

  enqueueNotificationTimer(SOCIAL_TOAST_DELAY_X_MS, () => {
    showSocialToast('twitter')
  })

  enqueueNotificationTimer(SOCIAL_TOAST_DELAY_LINKEDIN_MS, () => {
    showSocialToast('linkedin')
  })
}

onMounted(() => {
  updateClockLabels()
  clockTimer = setInterval(updateClockLabels, 15_000)
  scheduleMobileNotifications()
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  clearNotificationTimers()
})

watch(locale, () => {
  updateClockLabels()
})

let lastBridgedToastMessage = ''

watch(
  () => toast.message.value,
  (message) => {
    if (!message) {
      lastBridgedToastMessage = ''
      return
    }

    if (message === lastBridgedToastMessage) return

    lastBridgedToastMessage = message
    showMobileToast({
      title   : 'Portfolio',
      message,
      duration: BRIDGED_TOAST_DURATION_MS,
    })
  },
)
</script>

<template>
  <div
    class="mobile-root mobile-root--shell"
    :class="{ 'mobile-root--preview': isPreview }"
    :data-theme="theme.theme.value"
    :data-mobile-app-state="mobileShell.mobileAppState.value"
    :data-mobile-current-app="currentAppItemId || undefined"
  >
    <div class="mobile-home-shell" :style="rootStyle">
      <MobileHeader :owner-name="OWNER_NAME" />

      <main class="desktop-area mobile-home-main" :aria-label="t('desktop.area')">
        <h1 class="sr-only">{{ t('desktop.srTitle') }}</h1>
        <div class="desktop-vignette" aria-hidden="true" />
        <MobileToastStack ref="mobileToastStackRef" />

        <div class="mobile-home-scroll">
          <section class="mobile-home-hero" aria-label="Time and date">
            <p class="mobile-home-clock">{{ clockLabel }}</p>
            <p class="mobile-home-date">{{ dateLabel }}</p>
          </section>

          <MobileHomeGrid @launch="mobileShell.launchFromIcon" />
        </div>

        <MobileAppSurface
          :window-state="mobileShell.currentMobileWindow.value"
          :is-expanded="mobileShell.mobileAppState.value === 'expanded'"
          :title="mobileShell.currentAppTitle.value"
          :can-minimize="currentWindowCapabilities.canMinimize"
          :can-maximize="currentWindowCapabilities.canMaximize"
          @close="mobileShell.closeWindowById"
          @minimize="mobileShell.minimizeWindowById"
          @toggle-maximize="mobileShell.toggleMaximizeWindowById"
          @focus="mobileShell.focusWindowById"
        />
      </main>

      <MobileDock
        :windows="mobileShell.openMobileWindows.value"
        :current-window-id="mobileShell.currentMobileWindowId.value"
        :mobile-app-state="mobileShell.mobileAppState.value"
        :current-app-title="mobileShell.currentAppTitle.value"
        @select-window="mobileShell.selectDockWindow"
        @toggle-current-app="mobileShell.toggleCurrentAppVisibility"
      />
    </div>
  </div>
</template>
