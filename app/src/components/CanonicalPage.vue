<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import {
  buildCanonicalRouteModel,
  type CanonicalRouteBlock,
  type CanonicalRouteCard,
  type CanonicalRouteLink,
  type CanonicalRouteModel,
} from '../data/portfolio/canonical'

const props = defineProps<{
  pathname: string
}>()

const model = computed<CanonicalRouteModel | null>(() => {
  try {
    return buildCanonicalRouteModel(props.pathname)
  } catch {
    return null
  }
})

function syncCanonicalDocument() {
  const routeModel = model.value

  if (!routeModel) return
  if (typeof document === 'undefined') return

  const titleElement = document.querySelector('title') ??
    document.head.appendChild(document.createElement('title'))

  titleElement.textContent = routeModel.title
  document.documentElement.lang = routeModel.locale
  document.documentElement.dataset.canonicalRoute = 'true'
  document.documentElement.dataset.routeLocale = routeModel.locale
}

function blockKey(block: CanonicalRouteBlock, index: number): string {
  return `${block.kind}-${block.title ?? index}`
}

function cardKey(card: CanonicalRouteCard, index: number): string {
  return `${card.id}-${index}`
}

function linkKey(link: CanonicalRouteLink, index: number): string {
  return `${link.href}-${link.label}-${index}`
}

function isExternalLink(href: string): boolean {
  return /^https?:\/\//iu.test(href)
}

watch(model, syncCanonicalDocument, { immediate : true })

onMounted(syncCanonicalDocument)
</script>

<template>
  <main
    v-if="model"
    class="canonical-page"
    data-canonical-route="true"
    :data-route-kind="model.route.kind"
    :data-route-locale="model.locale"
  >
    <header class="canonical-header">
      <nav class="canonical-nav canonical-language-nav" :aria-label="model.languageLabel">
        <a
          v-for="(link, index) in model.languageLinks"
          :key="linkKey(link, index)"
          :href="link.href"
          :hreflang="link.hreflang"
          :aria-current="link.current ? 'page' : undefined"
        >
          <span v-if="link.icon" class="canonical-link-icon" aria-hidden="true">
            {{ link.icon }}
          </span>
          <span>{{ link.label }}</span>
        </a>
      </nav>

      <p class="canonical-kicker">{{ model.kicker }}</p>
      <h1>{{ model.h1 }}</h1>
      <p class="canonical-identity">{{ model.identityLine }}</p>
      <p>{{ model.intro }}</p>

      <nav class="canonical-nav" :aria-label="model.navLabel">
        <a
          v-for="(link, index) in model.navLinks"
          :key="linkKey(link, index)"
          :href="link.href"
          :aria-current="link.current ? 'page' : undefined"
        >
          <span v-if="link.icon" class="canonical-link-icon" aria-hidden="true">
            {{ link.icon }}
          </span>
          <span>{{ link.label }}</span>
        </a>
      </nav>
    </header>

    <section
      v-for="section in model.sections"
      :key="section.id"
      class="canonical-section"
    >
      <h2>{{ section.title }}</h2>

      <template
        v-for="(block, blockIndex) in section.blocks"
        :key="blockKey(block, blockIndex)"
      >
        <h3 v-if="block.title">{{ block.title }}</h3>

        <template v-if="block.kind === 'paragraphs'">
          <p v-for="item in block.items" :key="item">{{ item }}</p>
        </template>

        <ul v-else-if="block.kind === 'list'">
          <li v-for="item in block.items" :key="item">{{ item }}</li>
        </ul>

        <ul v-else-if="block.kind === 'links'">
          <li v-for="(link, index) in block.links" :key="linkKey(link, index)">
            <a
              :href="link.href"
              :target="isExternalLink(link.href) ? '_blank' : undefined"
              :rel="isExternalLink(link.href) ? 'noopener noreferrer' : undefined"
              :aria-current="link.current ? 'page' : undefined"
            >
              <span v-if="link.icon" class="canonical-link-icon" aria-hidden="true">
                {{ link.icon }}
              </span>
              <span>{{ link.label }}</span>
            </a>
          </li>
        </ul>

        <template v-else>
          <article
            v-for="(card, index) in block.cards"
            :key="cardKey(card, index)"
            class="canonical-project"
          >
            <h3>
              <a v-if="card.href" :href="card.href">{{ card.title }}</a>
              <template v-else>{{ card.title }}</template>
            </h3>

            <p v-if="card.meta" class="canonical-meta">{{ card.meta }}</p>
            <p v-if="card.proof" class="canonical-proof">{{ card.proof }}</p>

            <ul v-if="card.highlights.length">
              <li v-for="highlight in card.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>

            <p>{{ card.summary }}</p>
            <p v-if="card.stack.length" class="canonical-stack">
              {{ model.stackLabel }}: {{ card.stack.join(', ') }}
            </p>

            <p v-if="card.links.length" class="canonical-links">
              <a
                v-for="(link, linkIndex) in card.links"
                :key="linkKey(link, linkIndex)"
                :href="link.href"
                :target="isExternalLink(link.href) ? '_blank' : undefined"
                :rel="isExternalLink(link.href) ? 'noopener noreferrer' : undefined"
                :aria-current="link.current ? 'page' : undefined"
              >
                <span v-if="link.icon" class="canonical-link-icon" aria-hidden="true">
                  {{ link.icon }}
                </span>
                <span>{{ link.label }}</span>
              </a>
            </p>
          </article>
        </template>
      </template>
    </section>
  </main>
</template>

<style scoped>
:global(.canonical-page) {
  min-block-size : 100dvh;
  padding        : clamp(1rem, 3vw, 3rem);
  color          : #14202a;
  background     : #f6f8f9;
  font-family    : Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size      : clamp(1rem, 0.96rem + 0.2vw, 1.06rem);
  line-height    : 1.62;
}

:global(.canonical-page *) {
  box-sizing : border-box;
}

:global(.canonical-page a) {
  color                     : #006f7d;
  font-weight               : 700;
  text-decoration           : underline;
  text-decoration-thickness : 0.08em;
  text-underline-offset     : 0.18em;
}

:global(.canonical-header),
:global(.canonical-section) {
  inline-size : min(100%, 68rem);
  margin      : 0 auto;
}

:global(.canonical-header) {
  padding-block : clamp(0.75rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem);
}

:global(.canonical-kicker) {
  margin         : 0 0 0.45rem;
  color          : #5b6570;
  font-size      : 0.82rem;
  font-weight    : 800;
  letter-spacing : 0;
  text-transform : uppercase;
}

:global(.canonical-header h1) {
  max-inline-size : 58rem;
  margin          : 0;
  color           : #101820;
  font-size       : clamp(1.85rem, 7.5vw, 3.75rem);
  line-height     : 1.08;
  letter-spacing  : 0;
}

:global(.canonical-header p) {
  max-inline-size : 48rem;
  margin          : 1rem 0 0;
  color           : #354451;
  font-size       : clamp(1rem, 0.94rem + 0.28vw, 1.08rem);
}

:global(.canonical-header .canonical-identity) {
  margin      : 0.75rem 0 0;
  color       : #52616d;
  font-size   : clamp(0.92rem, 0.88rem + 0.18vw, 1rem);
  font-weight : 800;
}

:global(.canonical-nav) {
  display      : flex;
  flex-wrap    : wrap;
  gap          : 0.6rem;
  margin-block : 1.1rem 0;
}

:global(.canonical-nav a) {
  display         : inline-flex;
  min-block-size  : 2.3rem;
  align-items     : center;
  gap             : 0.42rem;
  padding         : 0 0.78rem;
  color           : #101820;
  border          : 1px solid #b7c8d1;
  border-radius   : 6px;
  background      : #ffffff;
  font-size       : 0.98rem;
  line-height     : 1.1;
  text-decoration : none;
}

:global(.canonical-nav a:focus-visible) {
  outline        : 3px solid #7cc7d2;
  outline-offset : 3px;
}

:global(.canonical-language-nav) {
  justify-content : flex-end;
  margin-block    : 0 clamp(1rem, 3vw, 1.75rem);
}

:global(.canonical-language-nav a) {
  min-block-size : 2.1rem;
  padding        : 0 0.68rem;
  font-size      : 0.94rem;
}

:global(.canonical-language-nav a[aria-current="page"]) {
  color        : #064c56;
  border-color : #77bdc8;
  background   : #eaf6f8;
}

:global(.canonical-link-icon) {
  font-size   : 1.05em;
  line-height : 1;
}

:global(.canonical-section) {
  padding-block      : clamp(1rem, 3vw, 2.4rem);
  border-block-start : 1px solid #d8e0e5;
}

:global(.canonical-section h2) {
  margin         : 0 0 1rem;
  color          : #101820;
  font-size      : clamp(1.35rem, 2vw, 1.9rem);
  line-height    : 1.18;
  letter-spacing : 0;
}

:global(.canonical-project) {
  margin        : 0 0 1rem;
  padding       : 1rem;
  border        : 1px solid #d7e1e7;
  border-radius : 8px;
  background    : #ffffff;
  box-shadow    : 0 1px 0 rgb(16 24 32 / 0.04);
}

:global(.canonical-project h3) {
  margin         : 0 0 0.4rem;
  color          : #101820;
  font-size      : 1.1rem;
  line-height    : 1.28;
  letter-spacing : 0;
}

:global(.canonical-project p),
:global(.canonical-section p) {
  max-inline-size : 62rem;
  margin          : 0.65rem 0 0;
}

:global(.canonical-page ul) {
  margin               : 0.75rem 0 0;
  padding-inline-start : 1.2rem;
}

:global(.canonical-page li) {
  margin-block : 0.22rem;
}

:global(.canonical-meta),
:global(.canonical-proof),
:global(.canonical-stack) {
  color : #52616d;
}

:global(.canonical-proof) {
  font-weight : 700;
}

:global(.canonical-links) {
  display   : flex;
  flex-wrap : wrap;
  gap       : 0.75rem;
}
</style>
