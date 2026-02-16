/* ============================================================
   Prerender Script — Static HTML for Crawlers
   ============================================================
   Generates a static HTML representation of the portfolio
   content for search engines and social media crawlers.
   Vue's createApp().mount() replaces this on client hydration.
   ============================================================ */

import { about, projects, experience, contact } from './src/data/content.ts'

/* Prerender runs outside Vue reactivity; force deterministic EN strings. */
function asEnglishText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'en' in value) {
    const english = (value as { en?: unknown }).en
    if (typeof english === 'string') return english
  }
  return String(value ?? '')
}

export function prerender() {
  const projectsHtml = projects
    .slice(0, 6)
    .map(
      (p) => `
      <article>
        <h3>${asEnglishText(p.name)}</h3>
        <p>${asEnglishText(p.summary)}</p>
        ${p.highlight ? `<p><strong>${asEnglishText(p.highlight)}</strong></p>` : ''}
        <p>Stack: ${p.stack.join(', ')}</p>
      </article>`,
    )
    .join('\n')

  const experienceHtml = experience
    .slice(0, 5)
    .map(
      (e) => `
      <article>
        <h3>${asEnglishText(e.role)} — ${asEnglishText(e.company)}</h3>
        <p>${e.period}${e.location ? ` · ${asEnglishText(e.location)}` : ''}</p>
        <p>${asEnglishText(e.summary)}</p>
      </article>`,
    )
    .join('\n')

  const expertiseHtml = about.expertise
    .map((e) => `<li>${asEnglishText(e)}</li>`)
    .join('\n          ')

  const certHtml = about.certifications
    .map((c) => `<li>${c.label} (${c.issuer})</li>`)
    .join('\n          ')

  const html = `
    <div data-prerender-root style="max-width:48rem;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6;color:#e0e0e0;">
      <header>
        <h1>${about.name} — Full-Stack Engineer &amp; Consultant</h1>
        <p>${asEnglishText(about.tagline)}</p>
      </header>

      <section>
        <h2>About</h2>
        <p>${asEnglishText(about.summary)}</p>
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
        <h2>Featured Projects</h2>
        ${projectsHtml}
      </section>

      <section>
        <h2>Experience</h2>
        ${experienceHtml}
      </section>

      <section>
        <h2>Contact</h2>
        <ul>
          ${contact.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('\n          ')}
        </ul>
      </section>
    </div>
  `

  return {
    html,
    head: {
      lang  : 'en',
      title : 'Robert Hoffmann — Full-Stack Engineer & Consultant',
    },
  }
}
