#!/usr/bin/env node
/**
 * Regenerate the public CV HTML, PDF, and PNG preview from curated app data.
 *
 * Source data:
 *   src/data/docs/cv.ts
 *
 * Outputs:
 *   public/docs/robert-hoffmann-cv-hero.jpeg
 *   public/docs/robert-hoffmann-cv.html
 *   public/docs/robert-hoffmann-cv.pdf
 *   public/docs/robert-hoffmann-cv.png
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'
import { createServer } from 'vite'

// #region Paths
const PROJECT_ROOT  = fileURLToPath(new URL('../', import.meta.url))
const DOCS_DIR      = join(PROJECT_ROOT, 'public/docs')
const HERO_FILENAME = 'robert-hoffmann-cv-hero.jpeg'
const HERO_PATH     = join(DOCS_DIR, HERO_FILENAME)
const HTML_PATH     = join(DOCS_DIR, 'robert-hoffmann-cv.html')
const PDF_PATH      = join(DOCS_DIR, 'robert-hoffmann-cv.pdf')
const PNG_PATH      = join(DOCS_DIR, 'robert-hoffmann-cv.png')

const A4_PREVIEW = {
  width  : 794,
  height : 1123,
}

const HERO_BACKGROUND_SIZE = {
  width  : 1500,
  height : 500,
}

const HERO_BACKGROUND_JPEG_QUALITY = 92

const HERO_BACKGROUND_OVERLAY = {
  horizontal : {
    direction : 'horizontal',
    stops     : [
      {
        offset : '0%',
        color  : 'rgba(10,16,30,0.94)',
      },
      {
        offset : '48%',
        color  : 'rgba(10,16,30,0.78)',
      },
      {
        offset : '100%',
        color  : 'rgba(10,16,30,0.58)',
      },
    ],
  },
  vertical : {
    direction : 'vertical',
    stops     : [
      {
        offset : '0%',
        color  : 'rgba(7,11,20,0.18)',
      },
      {
        offset : '100%',
        color  : 'rgba(7,11,20,0.74)',
      },
    ],
  },
}
// #endregion Paths

// #region Helpers
function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value)
}

function escapeCssUrl(value) {
  return String(value ?? '')
    .replaceAll('\\', '/')
    .replaceAll('"', '%22')
    .replaceAll("'", '%27')
    .replaceAll('(', '%28')
    .replaceAll(')', '%29')
}

function renderCssUrl(value) {
  return `url("${escapeCssUrl(value)}")`
}

function renderHeroOverlaySvg(layer) {
  const coordinates = layer.direction === 'horizontal'
    ? 'x1="0%" y1="0%" x2="100%" y2="0%"'
    : 'x1="0%" y1="0%" x2="0%" y2="100%"'
  const stops = layer.stops
    .map(stop => `<stop offset="${escapeAttribute(stop.offset)}" stop-color="${escapeAttribute(stop.color)}" />`)
    .join('')

  return Buffer.from(`<svg width="${HERO_BACKGROUND_SIZE.width}" height="${HERO_BACKGROUND_SIZE.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="overlay" ${coordinates}>${stops}</linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#overlay)" />
  </svg>`)
}

function renderAllowedLineBreaks(value) {
  return String(value)
    .split('<br>')
    .map(segment => escapeHtml(segment))
    .join('<br>')
}

function renderLink(href, label) {
  return `<a href="${escapeAttribute(href)}">${escapeHtml(label)}</a>`
}

function renderContact(contact, index) {
  const dots = index === 0
    ? '<span class="window-dots"><i class="dot red"></i><i class="dot yellow"></i><i class="dot green"></i></span>'
    : ''
  const content = contact.href
    ? renderLink(contact.href, contact.text)
    : escapeHtml(contact.text)

  return `<span>${dots}${content}</span>`
}

function renderChip(label, className = '') {
  const classes = ['chip', className].filter(Boolean).join(' ')

  return `<span class="${classes}">${escapeHtml(label)}</span>`
}

function renderLanguageChip(language) {
  return renderChip(`${language.flag} ${language.label}`, 'language')
}

function renderDeliveryReliabilityChip(label) {
  return renderChip(label, 'delivery-reliability')
}

function renderLinkedChip(item, className = '') {
  const classes = ['chip', className].filter(Boolean).join(' ')

  return `<a class="${classes}" href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a>`
}

function renderListItem(text) {
  return `<li>${escapeHtml(text)}</li>`
}

function renderMetric(metric) {
  return `<div class="metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`
}

function renderExperience(item) {
  return `<article class="job">
              <div class="date">${renderAllowedLineBreaks(item.date)}</div>
              <div>
                <h3>${escapeHtml(item.role)}</h3>
                <div class="company">${escapeHtml(item.company)}</div>
                <ul>
                  ${item.bullets.map(renderListItem).join('\n                  ')}
                </ul>
              </div>
            </article>`
}

function renderImpactProject(project) {
  const title = project.href
    ? renderLink(project.href, project.title)
    : escapeHtml(project.title)

  return `<article class="impact">
              <h3>${title}</h3>
              <p>${escapeHtml(project.body)}</p>
              <div class="mini-metrics">${project.metrics.map(metric => `<span class="mini">${escapeHtml(metric)}</span>`).join('')}</div>
            </article>`
}

function renderFooterLink(link) {
  return `<a class="footer-link" href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`
}

function renderFooterLinks(links) {
  return `<span class="footer-links">${links.map(renderFooterLink).join('')}</span>`
}

function artifactLabel(filePath) {
  return relative(PROJECT_ROOT, filePath)
}
// #endregion Helpers

// #region Data Loading
async function loadCvDocument() {
  const server = await createServer({
    root    : PROJECT_ROOT,
    logLevel: 'silent',
    server  : {
      middlewareMode : true,
    },
    appType : 'custom',
  })

  try {
    const module = await server.ssrLoadModule('/src/data/docs/cv.ts')
    return module.cvDocument
  } finally {
    await server.close()
  }
}
// #endregion Data Loading

// #region HTML Rendering
function renderHtml(doc) {
  const avatarUrl = renderCssUrl(doc.identity.avatarSrc)
  const heroUrl   = renderCssUrl(HERO_FILENAME)

  return `<!doctype html>
<!-- Generated by scripts/generate-cv-docs.mjs. Do not edit directly; see docs/cv-workflow.md. -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(doc.title)}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    :root {
      --ink: #18212b;
      --muted: #5e6976;
      --soft: #eef3f8;
      --line: #d9e2ea;
      --panel: #ffffff;
      --navy: #101827;
      --navy-2: #1d2f46;
      --blue: #1f8bd3;
      --cyan: #16a6b8;
      --green: #44a36f;
      --amber: #d1962c;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #c9d4de;
      color: var(--ink);
      font-family: Inter, "SF Pro Display", "Segoe UI", Arial, sans-serif;
      letter-spacing: 0;
    }

    .sheet {
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(255,255,255,.94), rgba(255,255,255,.98)),
        radial-gradient(circle at 82% 6%, rgba(31,139,211,.20), transparent 25%),
        radial-gradient(circle at 12% 8%, rgba(22,166,184,.14), transparent 28%);
      box-shadow: 0 24px 80px rgba(16, 24, 39, .30);
      position: relative;
    }

    .topbar {
      height: 7mm;
      background: linear-gradient(90deg, #141d31, #221a43 58%, #101827);
      color: rgba(255,255,255,.78);
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 0 8mm;
      font-size: 8px;
    }

    .topbar strong {
      color: #fff;
      font-weight: 700;
    }

    .topbar .center {
      font-weight: 700;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: rgba(255,255,255,.70);
    }

    .window-dots {
      display: inline-flex;
      gap: 3px;
      margin-right: 6px;
      vertical-align: middle;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
    }

    .dot.red { background: #ff5f57; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #28c840; }

    .hero {
      padding: 6mm 8mm 5mm;
      background: ${heroUrl};
      background-position: center 48%;
      background-size: cover;
      color: white;
      isolation: isolate;
      position: relative;
    }

    .hero::after {
      content: "";
      position: absolute;
      inset: auto 0 0 0;
      height: 3px;
      background: linear-gradient(90deg, var(--blue), var(--cyan), var(--green), var(--amber));
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 52mm;
      gap: 7mm;
      align-items: start;
      position: relative;
      z-index: 1;
    }

    .identity {
      display: grid;
      grid-template-columns: 21mm 1fr;
      gap: 5mm;
      align-items: center;
    }

    .mark {
      width: 21mm;
      height: 21mm;
      border-radius: 50%;
      background-image: ${avatarUrl};
      background-position: center;
      background-size: cover;
      border: 1.1mm solid rgba(12,18,31,.78);
      box-shadow:
        0 0 0 1px rgba(255,255,255,.52),
        0 4px 18px rgba(0,0,0,.38);
      color: transparent;
      display: grid;
      font-size: 0;
      font-weight: 800;
      overflow: hidden;
      place-items: center;
    }

    h1 {
      margin: 0 0 2mm;
      font-size: 30px;
      line-height: 1;
      letter-spacing: 0;
    }

    .role {
      margin: 0;
      max-width: 126mm;
      color: rgba(255,255,255,.84);
      font-size: 11.2px;
      line-height: 1.38;
      text-shadow: 0 1px 2px rgba(0,0,0,.36);
    }

    .contacts {
      display: grid;
      gap: 1.8mm;
      padding-top: 1mm;
      color: rgba(255,255,255,.88);
      font-size: 8.2px;
      line-height: 1.3;
      text-align: right;
      text-shadow: 0 1px 2px rgba(0,0,0,.36);
    }

    .contacts span {
      display: block;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2mm;
      margin-top: 4.5mm;
      position: relative;
      z-index: 1;
    }

    .metric {
      min-height: 12mm;
      padding: 2.2mm 2.5mm;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 6px;
      background: rgba(255,255,255,.08);
    }

    .metric strong {
      display: block;
      color: #ffffff;
      font-size: 12px;
      line-height: 1.05;
      margin-bottom: 1.1mm;
    }

    .metric span {
      color: rgba(255,255,255,.72);
      font-size: 7.1px;
      line-height: 1.2;
    }

    .main {
      display: grid;
      grid-template-columns: 58mm 1fr;
      gap: 5mm;
      padding: 5mm 8mm 7mm;
    }

    .rail {
      display: grid;
      align-content: start;
      gap: 3.6mm;
    }

    .content {
      display: grid;
      align-content: start;
      gap: 3.6mm;
    }

    section {
      break-inside: avoid;
    }

    .impact-projects-section {
      margin-top: 1.2mm;
    }

    h2 {
      margin: 0 0 2mm;
      color: var(--navy);
      font-size: 9.4px;
      font-weight: 800;
      letter-spacing: .12em;
      text-transform: uppercase;
      border-bottom: 1px solid var(--line);
      padding-bottom: 1.4mm;
    }

    p {
      margin: 0;
      color: var(--muted);
      font-size: 8.6px;
      line-height: 1.42;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    a:focus-visible {
      outline: 2px solid var(--blue);
      outline-offset: 2px;
    }

    .contacts a {
      border-bottom: 1px solid currentColor;
    }

    .contacts a {
      color: rgba(255,255,255,.92);
    }

    .summary {
      padding: 3mm;
      border-radius: 7px;
      background: #f5f8fb;
      border: 1px solid var(--line);
    }

    .summary strong {
      color: var(--ink);
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 1.2mm;
    }

    .chip {
      border-radius: 999px;
      background: #e8f2fb;
      border: 1px solid #cce1f2;
      color: #155d91;
      display: inline-flex;
      align-items: center;
      padding: 1.1mm 1.8mm;
      font-size: 6.9px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }

    .chip.neutral {
      background: #f1f3f6;
      border-color: #dfe5ea;
      color: #53606d;
    }

    .chip.language {
      background: #fff5e8;
      border-color: #ecd4b4;
      color: #6d4a16;
    }

    .chip.delivery-reliability {
      background: #edf7f5;
      border-color: #c8e3dd;
      color: #216153;
    }

    .proof-card {
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--panel);
      padding: 2.7mm;
      display: grid;
      gap: 1.2mm;
    }

    .proof-card h3 {
      margin: 0;
      font-size: 9.5px;
      line-height: 1.15;
      color: var(--ink);
    }

    .proof-card .meta {
      color: var(--blue);
      font-size: 7px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .08em;
    }

    .proof-card p {
      font-size: 7.4px;
      line-height: 1.42;
    }

    .proof-card a,
    .impact a {
      color: var(--ink);
    }

    .proof-card h3 a,
    .impact h3 a {
      border-bottom: 1px solid rgba(31,139,211,.42);
    }

    .timeline {
      display: grid;
      gap: 2.6mm;
    }

    .job {
      display: grid;
      grid-template-columns: 23mm 1fr;
      gap: 3mm;
      padding-bottom: 2.6mm;
      border-bottom: 1px solid var(--line);
    }

    .job:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .date {
      color: var(--blue);
      font-size: 7.4px;
      font-weight: 800;
      line-height: 1.25;
    }

    .job h3 {
      margin: 0 0 1mm;
      font-size: 10px;
      line-height: 1.15;
      color: var(--ink);
    }

    .job .company {
      color: var(--muted);
      font-size: 7.5px;
      font-weight: 700;
      margin-bottom: 1.4mm;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 1.1mm;
    }

    li {
      position: relative;
      padding-left: 4mm;
      color: var(--muted);
      font-size: 7.7px;
      line-height: 1.32;
    }

    li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 3.1px;
      width: 2mm;
      height: 2mm;
      border-radius: 50%;
      background: var(--blue);
    }

    .impact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.3mm;
    }

    .impact {
      border-radius: 7px;
      border: 1px solid var(--line);
      background: #ffffff;
      padding: 2.7mm;
      min-height: 28mm;
    }

    .impact h3 {
      margin: 0 0 1.4mm;
      color: var(--ink);
      font-size: 9.2px;
      line-height: 1.18;
    }

    .impact p {
      font-size: 7.3px;
      line-height: 1.32;
      margin-bottom: 1.5mm;
    }

    .impact .mini-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 1mm;
    }

    .mini {
      border-radius: 4px;
      background: #f0f6fc;
      color: #176497;
      display: inline-flex;
      align-items: center;
      padding: 1mm 1.4mm;
      font-size: 6.6px;
      font-weight: 800;
      line-height: 1;
    }

    .callout {
      border-left: 3px solid var(--blue);
      background: #f4f9fd;
      padding: 2.5mm 3mm;
      border-radius: 0 6px 6px 0;
    }

    .callout p {
      color: #354557;
      font-size: 8.2px;
    }

    .footer {
      position: absolute;
      left: 9mm;
      right: 9mm;
      bottom: 5mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4mm;
      color: #7d8791;
      font-size: 7.4px;
      border-top: 1px solid var(--line);
      padding-top: 2mm;
    }

    .footer-links {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.4mm;
    }

    .footer-link {
      display: inline-flex;
      align-items: center;
      padding: .85mm 1.55mm;
      border: 1px solid #cce1f2;
      border-radius: 999px;
      background: #e8f2fb;
      color: #155d91;
      font-size: 7px;
      font-weight: 800;
      line-height: 1;
      text-decoration: none;
    }

    .footer-text {
      color: #7d8791;
      white-space: nowrap;
    }

    @media print {
      html,
      body {
        background: #ffffff;
        display: block;
        min-height: auto;
      }

      .sheet {
        background: #ffffff;
        box-shadow: none;
      }

      .topbar {
        background: #18172f;
        color: #dfe4ef;
      }

      .hero {
        background: ${heroUrl};
        background-position: center 48%;
        background-size: cover;
      }

      .hero::after {
        background: #1f8bd3;
      }

      .role,
      .contacts,
      .contacts a {
        color: #e7edf4;
      }

      .mark {
        background-image: ${avatarUrl};
        background-position: center;
        background-size: cover;
        border-color: rgba(255,255,255,.58);
      }

      .metric {
        background: #263447;
        border-color: #536173;
      }

      .metric span {
        color: #d8e1ea;
      }
    }
  </style>
</head>
<body>
  <article class="sheet" aria-label="${escapeAttribute(doc.name)} CV">
    <div class="topbar">
      <div><strong>${escapeHtml(doc.name)}</strong></div>
      <div class="center">CV</div>
      <div style="text-align:right;">${escapeHtml(doc.topbarKicker)}</div>
    </div>

    <header class="hero">
      <div class="hero-grid">
        <div>
          <div class="identity">
            <div class="mark" role="img" aria-label="${escapeAttribute(doc.name)} profile photo"></div>
            <div>
              <h1>${escapeHtml(doc.name)}</h1>
              <p class="role">${escapeHtml(doc.role)}</p>
            </div>
          </div>
        </div>
        <div class="contacts">
          ${doc.contacts.map(renderContact).join('\n          ')}
        </div>
      </div>

      <div class="metrics">
        ${doc.metrics.map(renderMetric).join('\n        ')}
      </div>
    </header>

    <main class="main">
      <aside class="rail">
        <section class="summary">
          <h2>Profile</h2>
          <p><strong>${escapeHtml(doc.profile.lead)}</strong> ${escapeHtml(doc.profile.body)}</p>
        </section>

        <section>
          <h2>Core Stack</h2>
          <div class="chips">
            ${doc.coreStack.map(label => renderChip(label)).join('\n            ')}
          </div>
        </section>

        <section>
          <h2>Delivery &amp; Reliability</h2>
          <div class="chips">
            ${doc.deliveryReliability.map(renderDeliveryReliabilityChip).join('\n            ')}
          </div>
        </section>

        <section>
          <h2>Languages</h2>
          <div class="chips">
            ${doc.languages.map(renderLanguageChip).join('\n            ')}
          </div>
        </section>

        <section>
          <h2>Certifications</h2>
          <div class="chips">
            ${doc.certifications.map(item => renderLinkedChip(item, 'neutral')).join('\n            ')}
          </div>
        </section>

        <section>
          <h2>Portfolio Proof</h2>
          <div class="proof-card">
            <span class="meta">${escapeHtml(doc.portfolioProof.eyebrow)}</span>
            <h3>${renderLink(doc.portfolioProof.href, doc.portfolioProof.title)}</h3>
            <p>${escapeHtml(doc.portfolioProof.body)}</p>
          </div>
        </section>

        <section>
          <h2>Operating Mode</h2>
          <ul>
            ${doc.operatingMode.map(renderListItem).join('\n            ')}
          </ul>
        </section>
      </aside>

      <div class="content">
        <section>
          <h2>Current Value</h2>
          <div class="callout">
            <p>${escapeHtml(doc.currentValue)}</p>
          </div>
        </section>

        <section>
          <h2>Selected Experience</h2>
          <div class="timeline">
            ${doc.selectedExperience.map(renderExperience).join('\n\n            ')}
          </div>
        </section>

        <section class="impact-projects-section">
          <h2>Selected Impact Projects</h2>
          <div class="impact-grid">
            ${doc.impactProjects.map(renderImpactProject).join('\n\n            ')}
          </div>
        </section>
      </div>
    </main>

    <footer class="footer">
      ${renderFooterLinks(doc.footer.links)}
      <span class="footer-text">${escapeHtml(doc.footer.text)}</span>
    </footer>
  </article>
</body>
</html>
`
}

function normalizeGeneratedHtml(html) {
  return html.replace(/[ \t]+$/gm, '')
}
// #endregion HTML Rendering

// #region Artifact Generation
async function writeHtml(doc) {
  await mkdir(DOCS_DIR, { recursive : true })
  await writeFile(HTML_PATH, normalizeGeneratedHtml(renderHtml(doc)), 'utf8')
}

async function renderPdfAndPreview() {
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage({
      viewport          : A4_PREVIEW,
      deviceScaleFactor : 1,
    })

    await page.goto(pathToFileURL(HTML_PATH).href, { waitUntil : 'load' })
    await page.locator('.sheet').waitFor({ state : 'visible' })
    await page.pdf({
      path              : PDF_PATH,
      format            : 'A4',
      printBackground   : true,
      preferCSSPageSize : true,
    })
    await page.emulateMedia({ media : 'screen' })
    await page.locator('.sheet').screenshot({ path : PNG_PATH })
  } finally {
    await browser.close()
  }
}

async function readNonEmptyArtifact(filePath, label) {
  const buffer = await readFile(filePath)

  if (buffer.length === 0) {
    throw new Error(`${label} artifact is empty: ${artifactLabel(filePath)}`)
  }

  return buffer
}

async function validateIdentityAssets(doc) {
  await readNonEmptyArtifact(join(DOCS_DIR, doc.identity.avatarSrc), 'CV avatar')
  await readNonEmptyArtifact(join(DOCS_DIR, doc.identity.bannerSrc), 'CV banner')
}

async function generateFlattenedHeroBackground(doc) {
  const bannerPath = join(DOCS_DIR, doc.identity.bannerSrc)

  await sharp(bannerPath)
    .resize({
      width    : HERO_BACKGROUND_SIZE.width,
      height   : HERO_BACKGROUND_SIZE.height,
      fit      : 'cover',
      position : 'center',
    })
    .composite([
      {
        input : renderHeroOverlaySvg(HERO_BACKGROUND_OVERLAY.vertical),
      },
      {
        input : renderHeroOverlaySvg(HERO_BACKGROUND_OVERLAY.horizontal),
      },
    ])
    .jpeg({
      mozjpeg : true,
      quality : HERO_BACKGROUND_JPEG_QUALITY,
    })
    .toFile(HERO_PATH)
}

async function validateArtifacts() {
  await readNonEmptyArtifact(HERO_PATH, 'flattened hero')
  const html = await readNonEmptyArtifact(HTML_PATH, 'HTML')
  const pdf  = await readNonEmptyArtifact(PDF_PATH, 'PDF')
  await readNonEmptyArtifact(PNG_PATH, 'PNG')

  if (!html.includes('Do not edit directly')) {
    throw new Error('Generated HTML is missing the do-not-edit notice')
  }

  if (pdf.subarray(0, 4).toString('utf8') !== '%PDF') {
    throw new Error('Generated PDF does not begin with %PDF')
  }

  const metadata = await sharp(PNG_PATH).metadata()

  if (metadata.width !== A4_PREVIEW.width || metadata.height !== A4_PREVIEW.height) {
    throw new Error(
      `Generated PNG is ${metadata.width}x${metadata.height}; expected ${A4_PREVIEW.width}x${A4_PREVIEW.height}`,
    )
  }
}
// #endregion Artifact Generation

// #region CLI
async function main() {
  const doc = await loadCvDocument()

  await validateIdentityAssets(doc)
  await generateFlattenedHeroBackground(doc)
  await writeHtml(doc)
  await renderPdfAndPreview()
  await validateArtifacts()

  console.log([
    'CV docs generated:',
    `- ${artifactLabel(HERO_PATH)}`,
    `- ${artifactLabel(HTML_PATH)}`,
    `- ${artifactLabel(PDF_PATH)}`,
    `- ${artifactLabel(PNG_PATH)} (${A4_PREVIEW.width}x${A4_PREVIEW.height})`,
  ].join('\n'))
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('Executable doesn')) {
    console.error('Playwright Chromium is not installed. Run: npm run docs:cv:install-browsers')
  }

  console.error(error)
  process.exitCode = 1
})
// #endregion CLI
