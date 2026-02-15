<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { WindowState } from '../types/desktop'
import { windowRegistry } from '../data/registry'

const props = defineProps<{
  windowState  : WindowState
  isFocused    : boolean
}>()

const emit = defineEmits<{
  close     : [id: string]
  minimize  : [id: string]
  restore   : [id: string]
  focus     : [id: string]
  dragStart : [event: PointerEvent, id: string]
  resizeStart: [event: PointerEvent, id: string]
}>()

const style = computed(() => ({
  left   : `${props.windowState.x}px`,
  top    : `${props.windowState.y}px`,
  width  : `${props.windowState.w}px`,
  height : `${props.windowState.h}px`,
  zIndex : props.windowState.zIndex,
}))

/** Resolve async component from registry */
const contentComponent = computed(() => {
  const def = windowRegistry[props.windowState.itemId]
  if (!def?.component) return null
  return defineAsyncComponent(def.component)
})

/** Forward optional componentProps from registry */
const contentProps = computed(() => {
  const def = windowRegistry[props.windowState.itemId]
  return def?.componentProps ?? {}
})
</script>

<template>
  <section
    class="app-window"
    role="dialog"
    :aria-labelledby="`window-title-${windowState.id}`"
    :style="style"
    @pointerdown="emit('focus', windowState.id)"
  >
    <!-- Title bar -->
    <header
      class="app-window-header"
      @pointerdown.stop="emit('dragStart', $event, windowState.id)"
    >
      <div class="traffic-lights" role="group" aria-label="Window controls">
        <button
          class="traffic-light traffic-light--close"
          type="button"
          aria-label="Close window"
          @click.stop="emit('close', windowState.id)"
        />
        <button
          class="traffic-light traffic-light--minimize"
          type="button"
          aria-label="Minimize window"
          @click.stop="emit('minimize', windowState.id)"
        />
        <button
          class="traffic-light traffic-light--focus"
          type="button"
          aria-label="Restore window"
          @click.stop="emit('restore', windowState.id)"
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
      class="app-window-resize"
      aria-hidden="true"
      @pointerdown.stop="emit('resizeStart', $event, windowState.id)"
    />
  </section>
</template>
