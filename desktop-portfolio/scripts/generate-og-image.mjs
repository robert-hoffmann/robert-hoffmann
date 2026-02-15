/* ============================================================
   Generate OG Image — Social Sharing Preview (1200×630)
   ============================================================
   Creates a branded card using sharp's SVG-to-PNG pipeline.
   Run: node scripts/generate-og-image.mjs
   ============================================================ */

import sharp from 'sharp'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT       = resolve(__dirname, '..', 'public', 'og-image.png')

const WIDTH  = 1200
const HEIGHT = 630

/* ── SVG card layout ── */
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#0f0f23"/>
      <stop offset="50%"  stop-color="#1a1a3e"/>
      <stop offset="100%" stop-color="#0a0a1e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#4a90d9"/>
      <stop offset="100%" stop-color="#7c5cbf"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Decorative gradient bar -->
  <rect x="80" y="160" width="120" height="4" rx="2" fill="url(#accent)"/>

  <!-- macOS-style window dots (top-left decoration) -->
  <circle cx="100" cy="80" r="8" fill="#ff5f57"/>
  <circle cx="130" cy="80" r="8" fill="#febc2e"/>
  <circle cx="160" cy="80" r="8" fill="#28c840"/>

  <!-- Title text -->
  <text x="80" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="#f0f0f0">
    Robert Hoffmann
  </text>

  <!-- Subtitle -->
  <text x="80" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#a0a0c0">
    Full-Stack Engineer · Consultant · 25+ years in tech
  </text>

  <!-- Keywords row -->
  <text x="80" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#6a6a8a">
    .NET  ·  TypeScript  ·  Vue  ·  Python  ·  Data Pipelines  ·  IoT  ·  AI
  </text>

  <!-- Stats cards -->
  <rect x="80"  y="420" width="220" height="90" rx="12" fill="#ffffff08" stroke="#ffffff15" stroke-width="1"/>
  <text x="190" y="460" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#4a90d9">400M</text>
  <text x="190" y="490" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#8080a0">daily requests</text>

  <rect x="330" y="420" width="220" height="90" rx="12" fill="#ffffff08" stroke="#ffffff15" stroke-width="1"/>
  <text x="440" y="460" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#4a90d9">3B+</text>
  <text x="440" y="490" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#8080a0">ads served/mo</text>

  <rect x="580" y="420" width="220" height="90" rx="12" fill="#ffffff08" stroke="#ffffff15" stroke-width="1"/>
  <text x="690" y="460" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#4a90d9">15+</text>
  <text x="690" y="490" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#8080a0">shipped projects</text>

  <!-- URL -->
  <text x="80" y="580" font-family="monospace" font-size="18" fill="#5a5a7a">
    i-technology.net
  </text>

  <!-- Subtle border -->
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="0" fill="none" stroke="#ffffff10" stroke-width="2"/>
</svg>
`

await sharp(Buffer.from(svg))
  .png({ quality : 90, compressionLevel : 9 })
  .toFile(OUT)

console.log(`OG image generated → ${OUT}`)
