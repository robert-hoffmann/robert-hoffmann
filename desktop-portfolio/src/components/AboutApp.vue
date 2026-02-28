<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { about } from '../data/content'
import { useLocale } from '../composables/useLocale'

const { l, t } = useLocale()

const POINTER_MEDIA_QUERY        = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)'
const ROT_X_LIMIT                = 6
const ROT_Y_LIMIT                = 8
const SHIFT_LIMIT                = 2
const GLINT_SHIFT_LIMIT          = 8
const GLINT_MAX_OPACITY          = 0.46
const LERP_FACTOR                = 0.16
const EPSILON                    = 0.002
const RING_ALIGNMENT_OFFSET      = 32.5

const photoWrapRef  = ref<HTMLElement | null>(null)
const isPhotoActive = ref(false)
const effectEnabled = ref(false)

let interactionMedia: MediaQueryList | null = null
let reducedMotionMedia: MediaQueryList | null = null
let cachedPhotoRect: DOMRect | null = null
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let rafId: number | null = null
let isActive = false

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function setPhotoVars(normX: number, normY: number) {
  const photo = photoWrapRef.value
  if (!photo) return

  const rotX = clamp(normY * -ROT_X_LIMIT, -ROT_X_LIMIT, ROT_X_LIMIT)
  const rotY = clamp(normX * ROT_Y_LIMIT, -ROT_Y_LIMIT, ROT_Y_LIMIT)
  const shiftX = clamp(normX * SHIFT_LIMIT, -SHIFT_LIMIT, SHIFT_LIMIT)
  const shiftY = clamp(normY * SHIFT_LIMIT, -SHIFT_LIMIT, SHIFT_LIMIT)
  const glintX = clamp(normX * GLINT_SHIFT_LIMIT, -GLINT_SHIFT_LIMIT, GLINT_SHIFT_LIMIT)
  const glintY = clamp(normY * GLINT_SHIFT_LIMIT, -GLINT_SHIFT_LIMIT, GLINT_SHIFT_LIMIT)
  const glintOpacity = clamp(Math.hypot(normX, normY) * 0.34, 0, GLINT_MAX_OPACITY)

  photo.style.setProperty('--photo-rot-x', `${rotX}deg`)
  photo.style.setProperty('--photo-rot-y', `${rotY}deg`)
  photo.style.setProperty('--photo-shift-x', `${shiftX}px`)
  photo.style.setProperty('--photo-shift-y', `${shiftY}px`)
  photo.style.setProperty('--photo-glint-x', `${glintX}px`)
  photo.style.setProperty('--photo-glint-y', `${glintY}px`)
  photo.style.setProperty('--photo-glint-opacity', `${glintOpacity}`)
}

function setRingRotation(deg: number) {
  photoWrapRef.value?.style.setProperty('--photo-ring-rot', `${deg}deg`)
}

function resetPhotoState() {
  targetX = 0
  targetY = 0
  currentX = 0
  currentY = 0
  isActive = false
  isPhotoActive.value = false
  cachedPhotoRect = null

  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }

  setPhotoVars(0, 0)
  setRingRotation(0)
}

function refreshPhotoRect() {
  cachedPhotoRect = photoWrapRef.value?.getBoundingClientRect() ?? null
}

function updateTargetFromPointer(event: PointerEvent) {
  if (!cachedPhotoRect) return

  const centerX = cachedPhotoRect.left + (cachedPhotoRect.width  / 2)
  const centerY = cachedPhotoRect.top  + (cachedPhotoRect.height / 2)
  const dx = event.clientX - centerX
  const dy = event.clientY - centerY
  const viewportHalfW = Math.max(window.innerWidth / 2, 1)
  const viewportHalfH = Math.max(window.innerHeight / 2, 1)

  targetX = clamp(dx / viewportHalfW, -1, 1)
  targetY = clamp(dy / viewportHalfH, -1, 1)

  // Keep halo direction exact: compute from raw pixel vector, not normalized deltas.
  const ringRot = Math.atan2(dy, dx) * (180 / Math.PI) + 90 + RING_ALIGNMENT_OFFSET
  setRingRotation(ringRot)
}

function animate() {
  currentX += (targetX - currentX) * LERP_FACTOR
  currentY += (targetY - currentY) * LERP_FACTOR
  setPhotoVars(currentX, currentY)

  const hasPendingDelta = Math.abs(targetX - currentX) > EPSILON || Math.abs(targetY - currentY) > EPSILON
  const nearRest = Math.abs(currentX) <= EPSILON && Math.abs(currentY) <= EPSILON

  if (hasPendingDelta || !nearRest) {
    rafId = window.requestAnimationFrame(animate)
    return
  }

  currentX = 0
  currentY = 0
  setPhotoVars(0, 0)
  isPhotoActive.value = false
  rafId = null
}

function ensureAnimation() {
  if (rafId !== null) return
  isPhotoActive.value = true
  rafId = window.requestAnimationFrame(animate)
}

function onPointerMove(event: PointerEvent) {
  if (!effectEnabled.value) return
  if (!isActive) {
    isActive = true
    refreshPhotoRect()
  } else if (!cachedPhotoRect) {
    refreshPhotoRect()
  }
  updateTargetFromPointer(event)
  ensureAnimation()
}

function onPointerLeave() {
  if (!effectEnabled.value) return
  isActive = false
  targetX = 0
  targetY = 0
  ensureAnimation()
}

function onViewportResize() {
  if (!effectEnabled.value) return
  refreshPhotoRect()
}

function updateEffectSupport() {
  effectEnabled.value = Boolean(
    interactionMedia?.matches && !reducedMotionMedia?.matches,
  )

  if (!effectEnabled.value) {
    resetPhotoState()
  }
}

function onMediaChange() {
  updateEffectSupport()
}

onMounted(() => {
  interactionMedia = window.matchMedia(POINTER_MEDIA_QUERY)
  reducedMotionMedia = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY)
  interactionMedia.addEventListener('change', onMediaChange)
  reducedMotionMedia.addEventListener('change', onMediaChange)
  updateEffectSupport()
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('resize', onViewportResize, { passive : true })
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('resize', onViewportResize)
  interactionMedia?.removeEventListener('change', onMediaChange)
  reducedMotionMedia?.removeEventListener('change', onMediaChange)
  resetPhotoState()
})
</script>

<template>
  <div class="about-content">
    <!-- ---- Header: photo + name + tagline ---- -->
    <div class="about-header">
      <div
        ref="photoWrapRef"
        class="about-photo"
        :class="{ 'about-photo--active': isPhotoActive }"
      >
        <img
          :src="about.photo"
          :srcset="about.photoSrcSet"
          :alt="about.name"
          class="about-photo-img"
          width="80"
          height="80"
        />
      </div>
      <div class="about-header-text">
        <h3 class="about-name">{{ about.name }}</h3>
        <p class="about-tagline">{{ l(about.tagline) }}</p>
      </div>
    </div>

    <!-- ---- AI callout ---- -->
    <blockquote class="about-ai-callout">
      <span class="about-ai-icon" aria-hidden="true">⚡</span>
      <p>{{ l(about.aiCallout) }}</p>
    </blockquote>

    <!-- ---- Expertise pills ---- -->
    <div class="about-pills">
      <span
        v-for="skill in about.expertise"
        :key="l(skill)"
        class="about-pill"
      >{{ l(skill) }}</span>
    </div>

    <!-- ---- Narrative ---- -->
    <p class="panel-paragraph">{{ l(about.summary) }}</p>

    <!-- ---- Certifications ---- -->
    <div class="about-certs">
      <h4 class="about-section-title">{{ t('about.certifications') }}</h4>
      <div class="about-cert-pills">
        <span
          v-for="cert in about.certifications"
          :key="cert.label"
          class="about-pill about-pill--cert"
          :title="cert.issuer"
        >{{ cert.label }}</span>
      </div>
    </div>

    <!-- ---- Social links ---- -->
    <div class="panel-links">
      <a
        v-for="link in about.links"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="panel-link"
      >{{ link.label }}</a>
    </div>
  </div>
</template>

<style scoped>
.about-content {
  display        : flex;
  flex-direction : column;
  gap            : var(--space-5);
}

/* ---- Header ---- */
.about-header {
  display     : flex;
  align-items : center;
  gap         : var(--space-4);
}

.about-photo {
  --photo-rot-x         : 0deg;
  --photo-rot-y         : 0deg;
  --photo-shift-x       : 0px;
  --photo-shift-y       : 0px;
  --photo-glint-x       : 0px;
  --photo-glint-y       : 0px;
  --photo-glint-opacity : 0;
  --photo-ring-rot      : 0deg;

  position      : relative;
  inline-size   : 80px;
  block-size    : 80px;
  border-radius : var(--radius-full);
  overflow      : visible;
  perspective   : 700px;
  isolation     : isolate;
  box-shadow    : 0 0 0 3px var(--c-accent),
                  0 4px 14px oklch(0% 0 0 / 0.25);
  flex-shrink   : 0;

  &::before {
    content        : '';
    position       : absolute;
    inset          : -7px;
    border-radius  : var(--radius-full);
    pointer-events : none;
    opacity        : 0;
    transform      : rotate(var(--photo-ring-rot));
    filter         : blur(0.6px);
    transition     : opacity var(--dur-fast) var(--ease-out);

    background     : conic-gradient(
      from 0deg,
      oklch(100% 0 0 / 0) 0deg,
      oklch(100% 0 0 / 0) 300deg,
      oklch(100% 0 0 / 0.96) 320deg,
      oklch(100% 0 0 / 0.18) 335deg,
      oklch(100% 0 0 / 0) 350deg
    );
    -webkit-mask   : radial-gradient(circle, transparent 63%, #000 66%);
    mask           : radial-gradient(circle, transparent 63%, #000 66%);
    z-index        : 0;
  }

  &::after {
    content        : '';
    position       : absolute;
    inset          : -35%;
    border-radius  : var(--radius-full);
    pointer-events : none;
    opacity        : var(--photo-glint-opacity);
    transform      : translate(var(--photo-glint-x), var(--photo-glint-y));
    mix-blend-mode : screen;
    z-index        : 2;

    background     : radial-gradient(
      circle at 50% 40%,
      oklch(100% 0 0 / 0.26),
      transparent 62%
    );
  }
}

.about-photo-img {
  position           : relative;
  inline-size        : 100%;
  block-size         : 100%;
  border-radius      : var(--radius-full);
  object-fit         : cover;
  transform          : rotateY(var(--photo-rot-y))
                       rotateX(var(--photo-rot-x))
                       translate3d(var(--photo-shift-x), var(--photo-shift-y), 0)
                       scale(1.08);
  transform-style    : preserve-3d;
  backface-visibility : hidden;
  z-index            : 1;
}

.about-photo--active {
  &::before {
    opacity     : 0.88;
    will-change : transform, opacity;
  }

  &::after {
    will-change : transform, opacity;
  }

  .about-photo-img {
    will-change : transform;
  }
}

.about-name {
  font-size   : var(--text-2xl);
  font-weight : 700;
  line-height : var(--leading-tight);
  color       : var(--text-primary);
}

.about-tagline {
  font-size      : var(--text-sm);
  color          : var(--text-meta);
  letter-spacing : 0.04em;
  margin-block-start : var(--space-1);
}

/* ---- AI callout ---- */
.about-ai-callout {
  display          : flex;
  align-items      : flex-start;
  gap              : var(--space-3);
  padding          : var(--space-3) var(--space-4);
  border-radius    : var(--radius-lg);
  border-inline-start : 3px solid var(--c-accent);
  background       : var(--icon-selected-bg);
  font-size        : var(--text-sm);
  line-height      : var(--leading-relaxed);
  color            : var(--text-secondary);
}

.about-ai-icon {
  font-size   : var(--text-lg);
  flex-shrink : 0;
  line-height : 1.4;
}

.about-ai-callout p {
  margin : 0;
}

/* ---- Expertise pills ---- */
.about-pills {
  display               : grid;
  grid-template-columns : repeat(auto-fill, minmax(10rem, 1fr));
  gap                   : var(--space-2);
}

.about-pill {
  display         : inline-flex;
  align-items     : center;
  justify-content : center;
  padding-inline  : var(--space-3);
  padding-block   : var(--space-1);
  border-radius   : var(--radius-full);
  background      : var(--icon-selected-bg);
  border          : 1px solid var(--border-subtle);
  font-size       : var(--text-sm);
  font-weight     : 500;
  color           : var(--text-secondary);
  letter-spacing  : 0.02em;
  cursor          : default;
  white-space     : nowrap;
  transition      : background var(--dur-fast) var(--ease-out),
                    color var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out);

  &:hover {
    background   : var(--c-accent);
    color        : var(--c-white);
    border-color : var(--c-accent);
  }
}

/* ---- Cert pills (flex wrap, smaller) ---- */
.about-cert-pills {
  display   : flex;
  flex-wrap : wrap;
  gap       : var(--space-2);
}

/* ---- Section title ---- */
.about-section-title {
  font-size      : var(--text-sm);
  font-weight    : 600;
  text-transform : uppercase;
  letter-spacing : 0.05em;
  color          : var(--text-meta);
  margin-block-end : var(--space-2);
}

.about-pill--cert {
  background   : transparent;
  border-color : var(--border-default);
  font-size    : var(--text-xs);
}

/* ---- Responsive: stack stats 2×2 in narrow windows ---- */
@container (max-width: 420px) {
  .about-stats {
    grid-template-columns : repeat(2, 1fr);
  }

  .about-header {
    flex-direction : column;
    text-align     : center;
  }
}

@media (prefers-reduced-motion: reduce), (hover: none), (pointer: coarse) {
  .about-photo {
    &::before,
    &::after {
      display : none;
    }
  }

  .about-photo-img {
    transform : scale(1);
  }
}
</style>
