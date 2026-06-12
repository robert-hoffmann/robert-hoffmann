<script setup lang="ts">
import { onUnmounted } from 'vue'
import type { DesktopItem } from '../types/desktop'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const props = defineProps<{
  item             : DesktopItem
  isSelected       : boolean
  touchDesktopMode : boolean
  style            : Record<string, string>
}>()

const emit = defineEmits<{
  select      : [id: string]
  open        : [id: string]
  pointerdown : [event: PointerEvent, id: string]
}>()

const TOUCH_SECOND_TAP_OPEN_MS = 500
const TOUCH_LONG_PRESS_MS = 350
const TOUCH_LONG_PRESS_SLOP_PX = 8
const SUPPRESS_CLICK_AFTER_DRAG_MS = 450

interface TouchGestureContext {
  pointerId      : number
  startX         : number
  startY         : number
  sourcePointerEv: PointerEvent
  longPressFired : boolean
}

let touchGesture: TouchGestureContext | null = null
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let lastTapAt = 0
let suppressClickUntil = 0

function isPrimaryPointerActivation(event: PointerEvent) {
  if (!event.isPrimary) return false
  if (event.pointerType === 'touch') return event.button === 0 || event.button === -1
  return event.button === 0
}

function clearLongPressTimer() {
  if (!longPressTimer) return
  clearTimeout(longPressTimer)
  longPressTimer = null
}

function removeTouchGestureListeners() {
  document.removeEventListener('pointermove', onTouchGestureMove)
  document.removeEventListener('pointerup', onTouchGestureEnd)
  document.removeEventListener('pointercancel', onTouchGestureEnd)
}

function cleanupTouchGesture() {
  clearLongPressTimer()
  touchGesture = null
  removeTouchGestureListeners()
}

function maybeTriggerLongPressDrag() {
  if (!touchGesture) return

  touchGesture.longPressFired = true
  suppressClickUntil = performance.now() + SUPPRESS_CLICK_AFTER_DRAG_MS
  emit('pointerdown', touchGesture.sourcePointerEv, props.item.id)
}

function onTouchGestureMove(event: PointerEvent) {
  if (!touchGesture || event.pointerId !== touchGesture.pointerId) return
  if (touchGesture.longPressFired) return

  const dx = event.clientX - touchGesture.startX
  const dy = event.clientY - touchGesture.startY
  if (Math.hypot(dx, dy) <= TOUCH_LONG_PRESS_SLOP_PX) return

  clearLongPressTimer()
}

function onTouchGestureEnd(event: PointerEvent) {
  if (!touchGesture || event.pointerId !== touchGesture.pointerId) return
  cleanupTouchGesture()
}

function onIconPointerDown(event: PointerEvent) {
  if (!props.touchDesktopMode) {
    emit('pointerdown', event, props.item.id)
    return
  }

  if (!isPrimaryPointerActivation(event)) return

  cleanupTouchGesture()
  touchGesture = {
    pointerId       : event.pointerId,
    startX          : event.clientX,
    startY          : event.clientY,
    sourcePointerEv : event,
    longPressFired  : false,
  }

  longPressTimer = setTimeout(maybeTriggerLongPressDrag, TOUCH_LONG_PRESS_MS)
  document.addEventListener('pointermove', onTouchGestureMove)
  document.addEventListener('pointerup', onTouchGestureEnd)
  document.addEventListener('pointercancel', onTouchGestureEnd)
}

function onIconContextMenu(event: MouseEvent) {
  if (!props.touchDesktopMode) return
  event.preventDefault()
  event.stopPropagation()
}

function onIconClick(event: MouseEvent) {
  if (!props.touchDesktopMode) {
    emit('select', props.item.id)
    return
  }

  if (performance.now() < suppressClickUntil) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const now = performance.now()
  const isSecondTap = props.isSelected && now - lastTapAt <= TOUCH_SECOND_TAP_OPEN_MS
  if (isSecondTap) {
    lastTapAt = 0
    emit('open', props.item.id)
    return
  }

  lastTapAt = now
  emit('select', props.item.id)
}

function onIconDblClick(event: MouseEvent) {
  if (props.touchDesktopMode) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('open', props.item.id)
}

onUnmounted(() => {
  cleanupTouchGesture()
})
</script>

<template>
  <button
    class="desktop-icon"
    :class="{
      'desktop-icon--selected'    : isSelected,
      'desktop-icon--touch-desktop': touchDesktopMode,
    }"
    type="button"
    :style="style"
    :aria-label="`${item.title} ${t(`iconType.${item.type}`)}`"
    @click.stop="onIconClick"
    @dblclick.stop="onIconDblClick"
    @pointerdown="onIconPointerDown"
    @contextmenu="onIconContextMenu"
  >
    <span
      v-if="item.iconSprite"
      class="icon-sprite desktop-icon-sprite"
      :class="`icon-sprite--${item.iconSprite}`"
      aria-hidden="true"
    />
    <img v-else-if="item.iconUrl" :src="item.iconUrl" :alt="item.title" class="desktop-icon-img" width="48" height="48" />
    <span v-else class="desktop-icon-glyph" aria-hidden="true">{{ item.icon }}</span>
    <span class="desktop-icon-label">{{ item.title }}</span>
  </button>
</template>
