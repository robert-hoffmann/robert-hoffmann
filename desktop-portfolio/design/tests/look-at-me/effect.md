# Look at me effect

Profile photo illusion used in About Me (`.about-photo` in `src/components/AboutApp.vue`).

## Markup (wrapper + image)

```html
<div class="about-photo" :class="{ 'about-photo--active': isPhotoActive }" ref="photoWrapRef">
  <img
    :src="about.photo"
    :alt="about.name"
    class="about-photo-img"
    width="80"
    height="80"
  />
</div>
```

## CSS contract (custom properties)

The effect writes only CSS variables on `.about-photo`:

- `--photo-rot-x`, `--photo-rot-y`
- `--photo-shift-x`, `--photo-shift-y`
- `--photo-glint-x`, `--photo-glint-y`, `--photo-glint-opacity`
- `--photo-ring-rot`

`::before` renders the orbital ring glint, `::after` renders a moving specular highlight, and `.about-photo-img` applies 3D transform from these variables.

The effect is disabled for accessibility/perf in:

- `@media (prefers-reduced-motion: reduce)`
- `@media (hover: none), (pointer: coarse)`

## Vue/TS pseudocode

```ts
const POINTER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MEDIA_QUERY = '(prefers-reduced-motion: reduce)'

const photoWrapRef = ref<HTMLElement | null>(null)
const isPhotoActive = ref(false)
const effectEnabled = ref(false)

let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let cachedPhotoRect: DOMRect | null = null
let rafId: number | null = null
let isActive = false
const RING_ALIGNMENT_OFFSET = 32.5

function onPointerMove(event: PointerEvent) {
  if (!effectEnabled.value) return
  if (!isActive) {
    isActive = true
    cachedPhotoRect = photoWrapRef.value?.getBoundingClientRect() ?? null
  }
  // Halo tracks exact pointer direction from raw dx/dy.
  // Transform motion still uses smoothed normalized deltas.
  updateTargetFromPointer(event, cachedPhotoRect)
  ensureAnimation()
}

function onPointerLeave() {
  isActive = false
  targetX = 0
  targetY = 0
  ensureAnimation()
}

function animate() {
  currentX += (targetX - currentX) * 0.16
  currentY += (targetY - currentY) * 0.16
  writeCssVars(currentX, currentY) // rotate, shift, glint, ring

  const stillMoving = Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002
  const nearRest = Math.abs(currentX) <= 0.002 && Math.abs(currentY) <= 0.002

  if (stillMoving || !nearRest) {
    rafId = requestAnimationFrame(animate)
    return
  }

  isPhotoActive.value = false
  rafId = null
}

onMounted(() => {
  // enable only for fine pointer + no reduced motion
  // bind pointermove/pointerleave on window
  // when AboutApp is mounted (window open), tracking is global
  // add resize listener to refresh cachedPhotoRect
})

onUnmounted(() => {
  // remove all listeners and cancel RAF
})
```
