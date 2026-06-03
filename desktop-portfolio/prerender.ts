/* ============================================================
   Prerender Script — Static HTML for Crawlers
   ============================================================
   Generates a static HTML representation of the portfolio
   content for search engines and social media crawlers.
   Vue's createApp().mount() replaces this on client hydration.
   ============================================================ */

import { about, projects, experience } from './src/data/content.ts'

/* Prerender runs outside Vue reactivity; force deterministic EN strings. */
function asEnglishText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'en' in value) {
    const english = (value as { en?: unknown }).en
    if (typeof english === 'string') return english
  }
  return String(value ?? '')
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderList(items: readonly string[]): string {
  if (!items.length) return ''

  return `
        <ul>
          ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n          ')}
        </ul>`
}

function renderLinks(links: readonly { label: string; href: string }[]): string {
  if (!links.length) return ''

  return `
        <p>
          ${links
            .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
            .join(' · ')}
        </p>`
}

export function prerender() {
  const projectsHtml = projects
    .map(
      (p) => {
        const highlights = p.highlights
          .map((highlight) => asEnglishText(highlight))

        const links = 'links' in p ? p.links : []

        return `
      <article>
        <h3>${escapeHtml(asEnglishText(p.name))}</h3>
        <p>${escapeHtml(p.period)} · ${escapeHtml(asEnglishText(p.org))}</p>
        ${renderList(highlights)}
        <p>${escapeHtml(asEnglishText(p.summary))}</p>
        <p>Stack: ${escapeHtml(p.stack.join(', '))}</p>
        ${renderLinks(links)}
      </article>`
      },
    )
    .join('\n')

  const experienceHtml = experience
    .map(
      (e) => {
        const bullets = 'bullets' in e
          ? e.bullets.map((bullet) => asEnglishText(bullet))
          : []
        const stack = 'stack' in e ? e.stack : []

        return `
      <article>
        <h3>${escapeHtml(asEnglishText(e.role))} — ${escapeHtml(asEnglishText(e.company))}</h3>
        <p>${escapeHtml(e.period)}${'location' in e ? ` · ${escapeHtml(asEnglishText(e.location))}` : ''}</p>
        <p>${escapeHtml(asEnglishText(e.summary))}</p>
        ${renderList(bullets)}
        ${stack.length ? `<p>Stack: ${escapeHtml(stack.join(', '))}</p>` : ''}
      </article>`
      },
    )
    .join('\n')

  const expertiseHtml = about.expertise
    .map((e) => `<li>${escapeHtml(asEnglishText(e))}</li>`)
    .join('\n          ')

  const certHtml = about.certifications
    .map((c) => `<li><a href="${escapeHtml(c.href)}">${escapeHtml(c.label)} — ${escapeHtml(c.issuer)}</a></li>`)
    .join('\n          ')

  const html = `
    <div data-prerender-root style="max-width:48rem;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6;color:#e0e0e0;">
      <header>
        <h1>${escapeHtml(about.name)} — Industrial Full-Stack Consultant</h1>
        <p>${escapeHtml(asEnglishText(about.tagline))}</p>
      </header>

      <section>
        <h2>About</h2>
        <p>${escapeHtml(asEnglishText(about.aiCallout))}</p>
        <p>${escapeHtml(asEnglishText(about.summary))}</p>
        <h3>Expertise</h3>
        <ul>
          ${expertiseHtml}
        </ul>
        <h3>Certifications</h3>
        <ul>
          ${certHtml}
        </ul>
      </section>

      <section>
        <h2>Project Highlights</h2>
        ${projectsHtml}
      </section>

      <section>
        <h2>Experience</h2>
        ${experienceHtml}
      </section>

      <section>
        <h2>Contact</h2>
        <ul>
          ${about.links.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`).join('\n          ')}
        </ul>
      </section>
    </div>
  `

  return {
    html,
    head: {
      lang  : 'en',
      title : 'Robert Hoffmann — Industrial Full-Stack Consultant',
    },
  }
}
