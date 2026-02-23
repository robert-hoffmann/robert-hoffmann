<script setup lang="ts">
import { computed, defineAsyncComponent, provide, shallowRef, toRef } from 'vue'
import type { WindowState } from '../types/desktop'
import { windowRegistry } from '../data/registry'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const props = defineProps<{
  windowState  : WindowState
  isFocused    : boolean
  canMinimize  : boolean
  canMaximize  : boolean
  canResize    : boolean
  canMove      : boolean
}>()

const emit = defineEmits<{
  close          : [id: string]
  minimize       : [id: string]
  toggleMaximize : [id: string]
  focus          : [id: string]
  dragStart      : [event: PointerEvent, id: string]
  resizeStart    : [event: PointerEvent, id: string]
}>()

/** Expose window context to dynamically loaded content components */
provide('windowFocused', toRef(props, 'isFocused'))
provide('closeWindow', () => emit('close', props.windowState.id))

const shellStyle = computed(() => ({
  left   : `${props.windowState.x}px`,
  top    : `${props.windowState.y}px`,
  width  : `${props.windowState.w}px`,
  height : `${props.windowState.h}px`,
  zIndex : props.windowState.zIndex,
}))

/*
 * Resolve the async component exactly once from the registry.
 * Using shallowRef (not computed) ensures no reactive dependency
 * on windowState — so zIndex bumps, position changes, etc. never
 * cause Vue to see a "new" component and remount the content.
 * This is critical for iframes (YouTube) that reload on remount.
 */
const def = windowRegistry[props.windowState.itemId]
const contentComponent = shallowRef(
  def?.component ? defineAsyncComponent(def.component) : null,
)

/** Forward optional componentProps from registry (static per itemId) */
const contentProps = def?.componentProps ?? {}

const greenButtonLabel = computed(() =>
  props.windowState.mode === 'maximized'
    ? t('window.restore')
    : t('window.maximize'),
)

function onHeaderPointerDown(event: PointerEvent) {
  const target = event.target
  if (target instanceof Element && target.closest('.traffic-lights')) return
  if (!props.canMove) return
  emit('dragStart', event, props.windowState.id)
}

function onGreenButtonClick() {
  if (!props.canMaximize) return
  emit('toggleMaximize', props.windowState.id)
}
</script>

<template>
  <div class="app-window-shell" :style="shellStyle">
    <section
      class="app-window"
      role="dialog"
      :aria-labelledby="`window-title-${windowState.id}`"
      @pointerdown="emit('focus', windowState.id)"
    >
      <!-- Title bar -->
      <header
        class="app-window-header"
        @pointerdown.stop="onHeaderPointerDown"
      >
        <div class="traffic-lights" role="group" :aria-label="t('window.controls')">
          <button
            class="traffic-light traffic-light--close"
            type="button"
            :aria-label="t('window.close')"
            @click.stop="emit('close', windowState.id)"
          />
          <button
            class="traffic-light traffic-light--minimize"
            type="button"
            :aria-label="t('window.minimize')"
            :disabled="!canMinimize"
            @click.stop="emit('minimize', windowState.id)"
          />
          <button
            class="traffic-light traffic-light--focus"
            type="button"
            :aria-label="greenButtonLabel"
            :disabled="!canMaximize"
            @click.stop="onGreenButtonClick"
          />
        </div>
        <h2
          class="app-window-title"
          :id="`window-title-${windowState.id}`"
        >
          {{ windowState.title }}
        </h2>
      </header>

      <!-- Dynamic content -->
      <div class="app-window-content">
        <component :is="contentComponent" v-if="contentComponent" v-bind="contentProps" />
      </div>

      <!-- Resize handle -->
      <div
        v-if="canResize"
        class="app-window-resize"
        aria-hidden="true"
        @pointerdown.stop="emit('resizeStart', $event, windowState.id)"
      />
    </section>
  </div>
</template>
