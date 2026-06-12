<script setup lang="ts">
import { computed, defineAsyncComponent, provide, ref, shallowRef, toRef } from 'vue'
import type { WindowState } from '../../types/desktop'
import { windowRegistry } from '../../data/registry'
import { useLocale } from '../../composables/useLocale'

const { t } = useLocale()

const props = defineProps<{
  windowState  : WindowState
  isFocused    : boolean
  canMinimize  : boolean
  canMaximize  : boolean
}>()

const emit = defineEmits<{
  close          : [id: string]
  minimize       : [id: string]
  toggleMaximize : [id: string]
  focus          : [id: string]
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
 * Resolve the async component exactly once for the selected item.
 * Mobile may override a registry entry's desktop component with `mobileComponent`.
 * Keeping it in a shallowRef avoids remounts from non-item window-state changes.
 */
const def = windowRegistry[props.windowState.itemId]
const contentLoader = def?.mobileComponent ?? def?.component
const contentComponent = shallowRef(
  contentLoader ? defineAsyncComponent(contentLoader) : null,
)
const contentProps = def?.mobileComponentProps ?? def?.componentProps ?? {}

const greenButtonLabel = computed(() =>
  props.windowState.mode === 'maximized'
    ? t('window.restore')
    : t('window.maximize'),
)

const isMusicNopeAction = computed(() =>
  props.windowState.itemId === 'music' && !props.canMaximize,
)

const greenButtonDisabled = computed(() =>
  !props.canMaximize && !isMusicNopeAction.value,
)

const showNopePenguin = ref(false)
const nopeAnimationKey = ref(0)

function onGreenButtonClick() {
  if (isMusicNopeAction.value) {
    nopeAnimationKey.value += 1
    showNopePenguin.value = true
    return
  }
  if (!props.canMaximize) return
  emit('toggleMaximize', props.windowState.id)
}

function onNopeAnimationEnd() {
  showNopePenguin.value = false
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
      <header class="app-window-header">
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
            :disabled="greenButtonDisabled"
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

      <div class="app-window-content">
        <component :is="contentComponent" v-if="contentComponent" v-bind="contentProps" />
      </div>
    </section>

    <img
      v-if="showNopePenguin"
      :key="nopeAnimationKey"
      class="app-window-nope"
      src="/nope-penguin.gif"
      alt=""
      aria-hidden="true"
      @animationend="onNopeAnimationEnd"
    >
  </div>
</template>
