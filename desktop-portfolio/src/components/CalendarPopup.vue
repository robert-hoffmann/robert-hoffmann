<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const emit = defineEmits<{ close : [] }>()

const popupEl = ref<HTMLElement | null>(null)

const today = new Date()
const year  = today.getFullYear()
const month = today.getMonth() // 0-indexed

/* ---- derived calendar data ---- */

const monthLabel = computed(() => t(`calendar.month.${month}`))

const dayHeaders = computed(() =>
  Array.from({ length : 7 }, (_, i) => t(`calendar.day.${i}`)),
)

/** First day-of-week (0 = Sun) for the current month */
const startDay = new Date(year, month, 1).getDay()

/** Total days in the current month */
const daysInMonth = new Date(year, month + 1, 0).getDate()

/** Calendar grid cells — null for leading blanks, day numbers for real days */
const calendarCells = computed<Array<number | null>>(() => {
  const cells: Array<number | null> = Array.from({ length : startDay }, () => null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
})

const todayDate = today.getDate()

/* ---- click-outside to close ---- */
function onClickOutside(e: MouseEvent) {
  if (popupEl.value && !popupEl.value.contains(e.target as Node)) {
    emit('close')
  }
}

onMounted(() => {
  /* Defer listener so the opening click doesn't immediately close */
  requestAnimationFrame(() => {
    document.addEventListener('pointerdown', onClickOutside)
  })
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onClickOutside)
})
</script>

<template>
  <div ref="popupEl" class="calendar-popup" role="dialog" aria-label="Calendar">
    <div class="calendar-header">
      <span class="calendar-month">{{ monthLabel }} {{ year }}</span>
    </div>

    <div class="calendar-grid">
      <span
        v-for="(dayName, i) in dayHeaders"
        :key="`h-${i}`"
        class="calendar-cell calendar-cell--header"
      >{{ dayName }}</span>

      <span
        v-for="(cell, i) in calendarCells"
        :key="`d-${i}`"
        class="calendar-cell"
        :class="{
          'calendar-cell--today' : cell === todayDate,
          'calendar-cell--blank' : cell === null,
        }"
      >{{ cell ?? '' }}</span>
    </div>
  </div>
</template>
