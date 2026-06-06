# Project Highlights Scratchpad

Purpose: evidence and research scratchpad for project claims. This file is not
parsed by generators. Promote stable claims manually into `src/data/apps/projects.ts`
or `src/data/docs/cv.ts` when they become app or CV source material.

Working note for revising `src/data/content.ts` and `src/components/ProjectsApp.vue`.

Goal: turn the current `Projects` window into `Project Highlights`: fewer, stronger project cards with title, period, company/client, impact highlights, description, and technologies.

## Confirmed Direction

- Section style: curated highlights, not a long archive.
- Highlights: use multiple impact chips per card.
- Company/client label: show employer and client when different, for example `Maser Engineering for Airbus`; show only employer when the work was directly for the employer.
- The portfolio site itself is a valid highlight because it demonstrates AI-assisted delivery, interactive product design, performance work, and tool/workflow building.

## Current Implementation Notes

- `ProjectsApp.vue` already renders most required fields:
  - `name`
  - `period`
  - `org`
  - optional `highlights`
  - `summary`
  - `stack`
  - optional `links`
- The data model now uses `highlights: Localized[]`.
- The window title now says `Project Highlights`.
- CSS now supports wrapped metric chips through `.project-highlights`.
- Current ordering is intentionally extensive and impact-ranked. It starts with TMIP Scheduler, Uncle Bob, TMIP Logger, SBM / Teréga, the AI-built portfolio, Parallax Designer, Hutchinson, tchatche.com, and Ad Proxy, then continues through public tooling, industrial apps, dashboards, and older experiments.
- `registry.ts` separates the mobile/desktop shortcut label `Projects` from the window title `Project Highlights`.
- The mobile Projects icon has a short three-cycle pulse on the minimized mobile home screen so users notice the main portfolio content when no window is open.

## Data Model Options

`Option A: keep current shape`

- Pros: minimal code change; current component already works; low risk.
- Cons: only one highlight line; harder to show several impact metrics cleanly.
- Best when: we want a quick content refresh without redesigning the card.

`Option B: add highlights array`

- Pros: supports multiple metric chips, for example scale, automation volume, reliability, business result.
- Cons: requires a small component and data update; existing entries need migration.
- Best when: the section becomes a curated highlights portfolio instead of a generic project list.

Confirmed path: Option B. The requested content has multiple impact facts per project, and this will make the cards sharper without adding much complexity.

## Existing Projects To Improve

### tchatche.com - Real-Time Chat Platform

Current strength: already has exceptional scale.

Potential sharper angle:

- High-scale real-time chat platform.
- White-label deployments for major French media brands.
- Strong performance constraints: 600M page views/month, 400M requests/day, 200 KB UI, PageSpeed 97/100, IE support.
- Can name major white-label brands: SFR, Bouygues, Orange, TF1, NRJ, Chérie FM, and others.
- Role framing: senior full-stack C# architect across 123 Multimedia and Index Multimedia history.
- Business context: white-label chat/community platforms were one of the company's biggest business lines.
- Feature scope included full moderation, picture albums, Google Maps integration, nearby-user discovery, a dedicated Facebook app, social sharing, and other community features.
- Dedicated tchatche.com chat application was internationalized into 13 languages and sold as a white-label product.
- At peak, the dedicated tchatche.com chat/white-label business generated around `$300K/month` in revenue.

Candidate highlights:

- `600M page views/month`
- `400M requests/day`
- `$300K/month revenue peak`
- `13-language internationalization`
- `Major French media white labels`
- `Senior full-stack C# architect`
- `Moderation + social + location features`
- `200 KB UI · 97/100 PageSpeed`

Remaining questions:

- Any billing, SSO, mobile, or localization complexity worth naming?
- Was the 400M daily request figure all chat/API traffic or total platform traffic?

### Ad Proxy - Ad-Distribution Server

Current strength: strong business impact and scale.

Potential sharper angle:

- Generic ad server/proxy that removed per-site developer work.
- Single entry point for ad managers to schedule and dispatch ads across all company sites.
- Consolidated many ad-agency contracts and agency-specific ad systems behind one operational layer.
- Targeted delivery by format, site, agency, region, age, and gender.
- Performance-based load balancing across ad agencies.
- Can cite `+20% ad revenue` and `+30% CTR` from resume bullets.
- Used across tchatche.com and the broader network of white-label sites, including chat, news, and blog applications.
- Supported the ad operations behind the revenue-generating tchatche.com ecosystem, but should not claim the `$300K/month` revenue as Ad Proxy revenue.

Candidate highlights:

- `3B+ ads served/month`
- `+20% ad revenue`
- `+30% click-through rate`
- `Single entry point for ad managers`
- `Demographic and performance targeting`

Remaining questions:

- What formats did it support: banners, popups, mobile ads, rich media, video?
- What technologies beyond ASP.NET 4 were involved: SQL Server, caching, logs, metrics?

### HeadJS - Open-Source JS Library

Current strength: strong public signal via GitHub stars/forks.

Potential sharper angle:

- Open-source browser utility for script loading, feature detection, and responsive fallbacks.
- Useful during the IE6/IE7 era and mobile web transition.
- Public docs still available: https://headjs.github.io/
- Main maintainer, not original author.
- Made massive changes.
- Competed in the period's script-loader/resource-management ecosystem and with Modernizr-style feature detection/shim management.
- Public docs position HeadJS around JavaScript loading, responsive design/media-query helpers, browser detection, CSS3/JavaScript feature detection, and HTML5 enabling.

Candidate highlights:

- `Main maintainer`
- `4K+ GitHub stars`
- `400+ forks`
- `Script loader + feature detection`
- `IE-era responsive polyfills`

Remaining questions:

- Any npm/CDN usage stats, notable adopters, or production sites?
- Any specific major changes you want called out?

### PowerToys for OpenAI

Current strength: modern AI tooling story.

Raw facts:

- Archived project; store links have been deactivated.
- Previously public Chrome and Edge browser extensions in the official extension stores.
- Built when the early GPT/ChatGPT interface was still limited.
- Included chat/history management, voice-to-text, custom profiles, and direct search-provider integration.
- Injected a `search with` box directly into Google and other search-provider result pages.
- Users could chat inline on the search page or open a full chat window.

Candidate highlights:

- `Archived Chrome + Edge extension`
- `Search-page GPT injection`
- `Voice-to-text`
- `Custom prompt profiles`
- `Chat history management`

Remaining questions:

- Screenshot, archived demo, or GitHub link?
- Any user/install numbers?
- Which APIs/models did it support?
- Did it include BYO API key, local storage, privacy controls, prompt templating, or context-menu actions?

### Stats DREES / Stats COVID

Current strength: data visualization and public API usage.

Source links:

- Stats COVID France reuse: https://www.data.gouv.fr/reuses/stats-covid-france
- Stats DREES Power BI report: https://app.powerbi.com/view?r=eyJrIjoiYWRlZjQ5ZjAtZjllYy00OGNmLWI3NDctMzdkM2Y3YzkxMjUyIiwidCI6ImUxNTkwMzRhLTc5ODQtNDQ2ZS1iODM0LWUxZTM3ZDE2NzY3OSJ9

Raw facts:

- `Stats COVID France` is listed on data.gouv.fr as a Health visualization reuse.
- data.gouv.fr shows 8K views at time of inspection.
- Created on 2021-11-11 and last updated on 2024-04-30 according to data.gouv.fr.
- data.gouv.fr description says the dashboard supports date-range and age-slice selection.
- Listed indicators include tests, cases, positivity, critical care, hospitalizations, SOS Médecins, deaths, vaccinations, mortality, and demography.
- Second link is a public Power BI report for Stats DREES.

Candidate highlights:

- `8K data.gouv views`
- `DREES + COVID indicators`
- `Vaccination-status analysis`
- `Power BI public reports`

Questions:

- Should these be merged into one "Public Health Analytics Dashboards" highlight?
- Are they still maintained and publicly available?
- Any links, screenshots, usage, or methodological angle worth including?
- Do these matter enough for the target roles compared with aerospace/industrial systems?

### MicroCoil Calculator

Current strength: clear user adoption.

Questions:

- Should mobile and web versions be merged into one highlight?
- Any app store link, user reviews, retention, or calculation complexity?
- Was this commercial, community, or personal?

### FindUnusedFiles

Current strength: useful developer tooling and 11K installs.

Questions:

- Any Marketplace link still available?
- Did it work across web projects, class libraries, and full VS solutions?
- Any notable technical challenge: parsing project files, dependency graph, static analysis, false positives?

### HealthMonitoring / Web-Monitor.NET / JsonR / T4ResX / PhantomUI / jQuery Mario

Current view: useful but probably secondary unless we want a long project archive.

Questions:

- Should Project Highlights be curated to 8-12 strongest items, with these folded into experience bullets?
- Which of these still matter strategically for your current positioning?

### T4ResX - Localization Tooling

Source links:

- NuGet: https://www.nuget.org/packages/T4ResX
- Visual Studio Marketplace: https://marketplace.visualstudio.com/items?itemName=RobertHoffmann.T4ResX
- GitHub: https://github.com/itechnology/T4ResX

Raw facts:

- Public NuGet package for T4ResX, current listed version `0.99.0`.
- NuGet shows 14.5K total downloads at time of inspection.
- Visual Studio Marketplace extension shows 2,373 installs at time of inspection.
- GitHub repository is public under `itechnology/T4ResX`.
- Public description: transforms ResX files into strongly typed classes via T4.
- Supports strongly typed resources for websites, class libraries, ViewModels, and localized JavaScript exports.

Candidate highlights:

- `14.5K NuGet downloads`
- `2.3K VS Marketplace installs`
- `Strongly typed resources`
- `Localized JavaScript export`

### PhantomUI - Web-to-PDF Converter

Source links:

- GitHub: https://github.com/itechnology/PhantomUI

## New Project Candidates

### i-technology.net - AI-Built Desktop Portfolio

Raw facts:

- Online portfolio site: https://i-technology.net/
- Built in 2026 and actively maintained.
- Built 100% through AI-driven workflows and prompt systems.
- Used as a testbed for AI workflows that can build practical tools.
- Site model: desktop simulator with mini apps, dock, top bar, icon grid, and window manager.
- Source-code facts:
  - Vue 3 + TypeScript + Vite app.
  - Tailwind CSS v4 integration.
  - Typed desktop app/window registry.
  - Draggable, resizable, minimizable, restorable, maximizable windows.
  - Async-loaded mini-app windows.
  - Dedicated mobile shell and desktop-side mobile preview.
  - Bilingual content.
  - Session persistence for theme, locale, icons, open windows, geometry, z-order, and focused window.
  - Prerendered SEO via `vite-prerender-plugin`.
  - Sharp-based image optimization and OG image generation.
  - Three.js mini-game module.
- User-supplied performance facts:
  - Lighthouse desktop score: 100.
  - Lighthouse mobile score: 99.
- Related workflow angle:
  - `ub-quality` and `ub-workflow` were built for the same class of AI-assisted engineering work used on TMIP and this portfolio.

Candidate highlights:

- `100% AI-built`
- `Desktop simulator + mini apps`
- `Lighthouse 100 desktop`
- `Lighthouse 99 mobile`
- `Typed window manager`
- `Custom AI workflow system`

Possible positioning:

> Interactive portfolio and AI-workflow testbed that turns a resume into a desktop simulator, combining a macOS-style shell, typed app registry, draggable/resizable window manager, mini apps, bilingual content, mobile shell, prerendered SEO, and performance-focused asset loading.

Remaining questions:

- Should this card mention `ub-quality` / `ub-workflow` by name, or keep the wording public-facing as `AI Workflows`?
- Should we add a source-code/GitHub link if the repository is public?
- Do we want to verify the Lighthouse scores locally and archive the report as evidence?

### Parallax Designer - AI-Built Visual Builder

Source links:

- Live app: https://robert-hoffmann.github.io/parallax-designer/
- Docs: https://robert-hoffmann.github.io/parallax-designer/docs/
- GitHub: https://github.com/robert-hoffmann/parallax-designer

Raw facts:

- Built in 2026 and actively maintained.
- Public GitHub repository.
- Built 100% with AI-driven workflows.
- Tool was created to build/fine-tune the parallax background effect used by the portfolio.
- Browser-based visual editor for multi-layer parallax scenes.
- Uses real-time preview and HTML export.
- Supports layer geometry, motion, background controls, presets, local assets, schema validation, and project import/export.
- GitHub README describes support for up to 30 layers per project.
- The project was also an experiment in automating documentation generation/sync:
  - app/source documentation,
  - user documentation,
  - API/technical documentation,
  - VitePress docs site as generated output.
- GitHub README describes the docs stack as VitePress and deployment via GitHub Pages / GitHub Actions.
- Stack from README:
  - Vue 3,
  - TypeScript 5.9,
  - Vite 7,
  - Tailwind CSS 4,
  - Dexie / IndexedDB,
  - VueUse,
  - SortableJS,
  - Vitest,
  - Playwright,
  - VitePress,
  - GitHub Actions.

Candidate highlights:

- `100% AI-built`
- `Real-time parallax editor`
- `Standalone HTML export`
- `Automated VitePress docs`
- `30-layer scene support`
- `Source/user/API docs sync`

Possible positioning:

> Browser-based visual editor for designing multi-layer parallax scenes like the portfolio background system, with real-time preview, layer geometry and motion controls, local asset storage, presets, schema validation, standalone runtime HTML export, and an AI-driven documentation pipeline syncing app, user, and API docs into a VitePress site.

Remaining questions:

- Should we include `30-layer scene support` as a highlight chip, or keep the docs automation chip stronger?
- Should this sit above or below the main portfolio card?
- Any Lighthouse/performance score for the designer itself?

### Uncle Bob - Agentic AI Workflow System

Source links:

- Public docs: https://robert-hoffmann.github.io/uncle-bob/
- Current repository: https://github.com/robert-hoffmann/uncle-bob

Raw facts:

- Current public repo was created on 2026-03-12.
- Repo is public, MIT licensed, active, has GitHub Pages docs, has plugin metadata, has discussions/issues enabled.
- Current repo has low public popularity signal: 2 stars and 2 forks at time of inspection.
- README positions Uncle Bob as a practical collection of skills and a focused teaching agent for GitHub Copilot, VS Code, Copilot CLI, Claude Code, and Codex users.
- README says the skills are used in an actual corporate production environment for supply-chain management in aerospace.
- Core skill stack:
  - `ub-quality`,
  - `ub-authoring`,
  - `ub-workflow`,
  - `ub-governance`,
  - `ub-customizations`,
  - plus specialist skills for Python, TypeScript, Vue, Nuxt, CSS, and Tailwind.
- The strong story is the operating model around portable skills, workflow artifacts, governance gates, docs sync, and deterministic validation scripts.
- Validation/tooling surfaces inspected:
  - `plugin.json` exposes `.agents/skills/` and `.github/agents/`,
  - `Taskfile.yml` includes lint, integrity, governance, workflow, docs-sync, and docs-build checks,
  - `scripts/check-docs-sync.mjs` checks docs links, routes, skill docs sections, script references, and path references,
  - repo-maintenance scripts check repo catalog, package metadata, path/case integrity, skill schema, and governance surface integrity.

External standards / best-practice cross-check:

- Agile Manifesto principles support frequent valuable software, working software as progress, technical excellence, simplicity, and retrospection.
- Scrum Guide supports empiricism through transparency, inspection, and adaptation; it uses product/sprint goals, sprint backlog, and Definition of Done commitments to make progress inspectable.
- Kanban Guide supports defining/visualizing workflow, controlling WIP, explicit flow policies, actively managing blocked/aging work, and continuous workflow improvement.
- Shape Up supports appetite, shaping, betting, circuit breakers, and avoiding backlog sludge.
- NIST AI RMF supports continuous AI risk management through govern, map, measure, and manage, with documentation, accountability, and continual improvement.
- OpenAI eval guidance supports reproducible evaluations, trace grading for agent workflows, datasets, and iterative prompt/model improvement.

Judgment:

- Strong enough for a Project Highlight.
- The strongest angle is not stars or open-source popularity.
- The strongest angle is agentic delivery control: adapting product/project management and governance concepts to AI coding agents with durable artifacts, context recovery, evidence routing, readiness gates, bounded exceptions, and deterministic docs/validation checks.
- The weakness is that it is still early publicly and does not yet show broad adoption, benchmarked eval results, or a large community.

Candidate highlights:

- `11 portable AI skills`
- `Workflow + governance gates`
- `Docs-sync validation`
- `Production aerospace use`
- `Copilot / Codex / Claude Code`

Possible positioning:

> Portable skill system for AI coding agents, structured as a full operating model for quality, workflow, governance, authoring, and specialist implementation guidance. It adapts Agile, Scrum, Kanban, Shape Up, and AI-evaluation ideas into practical agent controls: lane selection, durable artifacts, WIP limits, readiness gates, bounded exceptions, evidence routing, docs synchronization, and deterministic validation scripts.

Remaining questions:

- Should the card mention `uncle-bob` by name only, or explain the brand as `AI workflow system` for readers who do not know the repo?
- Should we add a future benchmark/eval claim only after creating real trace/eval reports?

### Roland-Garros Navigation App

Note: recommended public spelling is `Roland-Garros`.

Translation notes:

- `interimaires`: temporary workers / agency workers / temp staff.

Raw facts:

- Built in 2022.
- Employer: Maser Engineering, a CRIT subsidiary.
- Client chain: CRIT for Roland-Garros.
- Format: PWA.
- Helped temporary workers navigate Roland-Garros work areas.
- Not a Google Maps clone.
- Provided point-to-point step-by-step routing.
- Included pictures, turn-by-turn instructions, and text-to-speech.
- Stack: vanilla JavaScript, HTML5, CSS3, Chrome TTS, Airtable.
- Airtable was used as a SaaS database so managers could consult and update app information live.
- Routing model: manual step plans with photos of roads and hallways, mini-maps, arrows, and spoken voice directions.

Candidate highlights:

- `Roland-Garros venue navigation`
- `Live Airtable-backed content updates`
- `Step-by-step visual routing + TTS`
- `PWA for temporary staff`

Possible positioning:

> Navigation and onboarding app for temporary staff working at Roland-Garros, guiding people from point A to point B through venue halls, corridors, and workspaces using visual step-by-step directions and text-to-speech instead of map-style GPS navigation.

Remaining questions:

- Was it multilingual?
- Did it support accessibility or noisy environments through TTS?
- How many workers, routes, locations, halls, photos, or steps were involved?
- Was it used during the tournament only or year-round preparation?

### TMIP Scheduler

Raw facts:

- Built from 2025 onward.
- App for Nexess smart cabinets at Airbus Industries assembly plants.
- Used for supply chain management and tool tracking.
- Connects smart cabinet servers, Skywise databases/dashboards, and a web management interface.
- Lets users report broken/replaced tools and inventory events.
- Runs web services and over 30K data transformation jobs/day.
- Ensures data moves between Skywise, Nexess, and the web interface in the right format at the right time.
- Analyzes smart cabinet logs and produces data for Skywise dashboards tracking performance and errors.
- Ported from unsafe legacy Python 3.9 with no docs, typing, logging, or dependency management to modern Python standards.
- Uses Pyright typing, uv, Ruff, Pydantic, dataclasses, glom, structured logging with database projections, and Skywise integration.
- Includes automated email alerts for error spikes, expiring SSL certificates, and daily error summaries.
- Employer/client label: Maser Engineering for Airbus, working with Nexess as smart-cabinet supplier.
- Stack: Python 3.12, Windows Server 2022 VM, Ruff, uv, Pyright, Pydantic, aiohttp, glom, FastAPI, Vue.js.
- Runtime/system concepts: multiprocessing, job orchestration, web services, data transformation jobs, Windows Scheduler, timezone-aware Cronier scheduling with DST handling.
- Scale: 16 assembly plants and around 1,000 users.
- Impact themes: performance, modern standards, error logging, traceability, accountability.
- Workload detail: over 30K jobs/day, and each job calls 3-100 web service endpoints.
- Integrations: Nexess smart-cabinet main servers and web services, Google Workspace Drive and Sheets, Skywise.
- Analytics: Skywise dashboards in Foundry and Contour.
- Health monitoring: pushes Windows Server VM CPU/memory data to Quiver for operational monitoring.

Possible positioning:

> Central data orchestration service for Airbus smart-cabinet operations, synchronizing Nexess cabinet servers, Skywise datasets, and a management UI while running 30K+ daily transformation jobs for inventory, tool tracking, operational health, and analytics.

Candidate highlights:

- `30K+ data jobs/day`
- `3-100 web service calls/job`
- `16 Airbus assembly plants`
- `~1,000 users`
- `Python 3.12 modernization`
- `Google Workspace + Skywise + Nexess integration`

Remaining questions:

- Should public label be `Airbus`, `Airbus Industries`, or `Airbus assembly plants`?
- What is TMIP short for, if public? If forgotten/private, omit the expansion.
- How many cabinets, tools, or data sources can be named?
- What database did the web management interface use?
- Which Skywise pieces beyond Foundry, Contour, and Quiver were used: transforms, datasets, Slate dashboards, ontology?
- What was the measurable result: fewer data failures, faster diagnosis, less manual intervention, certification/compliance value?

### TMIP Logger

Raw facts:

- Separate Project Highlight.
- Built from 2025 onward.
- Internal tooling for QoS and KPIs.
- Built for TMIP Scheduler.
- Structured logging system.
- Color-coded CLI logs in dev mode.
- CSV dumps for error modes with file rotation.
- Moves logs to SQLite for inspection.
- Vue.js app filters logs and application lifecycle.
- Filters by assembly plant, job ID, error type, and more.
- Logs rotated to Skywise every 4 hours for dashboard analysis.
- Jobs send automated emails for error spikes, error types, and summaries.
- Tracks affected plant, affected job, error source, error type, and trend progression.
- Context: 16 assembly plants and almost 300 jobs.
- Includes an API layer to serve SQLite-backed log data to the Vue.js UI.
- Impact: 10x error reduction, 5x faster bug resolution, and 5x more scheduled jobs since takeover.

Candidate highlights:

- `QoS and KPI observability`
- `10x error reduction`
- `5x faster bug resolution`
- `5x job-volume scale-up`
- `16 assembly plants`
- `Nearly 300 scheduled jobs`
- `Skywise exports every 4h`

Possible positioning:

> Observability layer for industrial data jobs, turning raw application events into searchable SQLite records, Vue-based operational views, Skywise dashboard feeds, and automated alerts for 16 assembly plants and nearly 300 scheduled jobs.

Remaining questions:

- Did it use SQLite only locally, or also central SQL storage?
- What fields existed in a structured log: plant, job ID, run ID, error type, actor, severity, lifecycle state?
- What did "who caused the error" mean: user, cabinet, job, source system, external API?

### Application de Pointage

English title options:

- Attendance Tracking App
- Digital Attendance App
- Student Attendance & Invoicing System

Raw facts:

- Built in 2023.
- Vue.js/Symfony application.
- Used by Maser Engineering training center for aerospace cabling and related training.
- Replaced paper attendance sheets.
- Teachers collected digital student signatures.
- App is fully offline capable.
- Offline signatures can sync back when the app goes online again.
- Signatures fed a HR back office.
- HR could see attendees, absences, attended hours, and generate attendance sheets for sending companies.
- Automatically calculated invoicing for companies that sent students.
- Scale: a couple hundred students per year.
- Outputs: attendance PDFs, billing CSV exports, total-hour CSV exports.
- Back office: attendance tracking, user information editing, client association management.
- Stack: Symfony, Symfony UX Live Components, latest Bootstrap, MariaDB.

Candidate highlights:

- `Paper attendance replaced`
- `Hundreds of students/year`
- `Offline signature sync`
- `PDF attendance sheets`
- `Automated billing exports`

Possible positioning:

> Digital attendance and invoicing workflow for an aerospace training center, replacing paper sign-in sheets with offline-capable teacher-collected signatures, HR back-office validation, automatic attendance reports, and company billing calculations.

Remaining questions:

- Was Maser both employer and client?
- Approximate number of teachers, students, sessions, or companies?
- Were signatures legally binding or just operational proof?
- Was billing based on hours, courses, student/day, or attendance rate?
- Did it include audit logs, correction workflow, or approval/validation states?
- What offline-sync mechanism was used for signatures?

### Maser Academy Course Inventory Planning

Public company context:

- Website: https://www.maser-academy.com/
- Public site describes Maser Academy as a professional training organization and a Maser Engineering brand.
- Public 2025 key figure: 1,132 learners.

Raw facts:

- Assumed period for now: 2025.
- Built for Maser Academy, a Maser Engineering training subsidiary.
- Built in Airtable.
- Supports multiple training centers in France.
- Training courses have batches of students and materials needed for the duration of the course.
- Helps teachers and managers prepare upcoming courses.
- Tracks training centers, course exercises, supplies, suppliers, prices, and product references.
- Tracks 76 different practical exercises / hands-on exercises (`travaux pratiques`).
- Tracks 532 different supply types, including screws, rivets, hammers, and tool boxes.
- Tracks 5 suppliers.
- Manager selects an upcoming training center, course/session, and the exercises students will complete.
- Each exercise has specific supply requirements.
- System automatically builds a purchase list with references, suppliers, total prices, and required quantities.
- Purchase list can be sent directly to the department responsible for buying supplies.
- Uses Airtable automations, drag-and-drop planning, automatic calculations, and final CSV export.

Candidate highlights:

- `76 practical exercises`
- `532 supply types`
- `5 suppliers`
- `Automatic purchase lists`
- `CSV purchasing export`

Possible positioning:

> Airtable-based inventory planning system for Maser Academy training centers, turning selected courses, student groups, and 76 practical exercises into automatically calculated purchase lists across 532 supply types and 5 suppliers, with references, prices, totals, and CSV export for the buying department.

Remaining questions:

- Confirm the year or year range.
- How many training centers used it?
- Approximate number of courses, exercises, supply references, or suppliers tracked?
- Did it replace spreadsheets, email requests, or manual stock checks?
- Did it track stock on hand, reservations, shortages, or only purchasing needs?
- Did it include approval states or procurement follow-up after CSV export?

### Hutchinson E-Learning / Digital Work Instructions

Raw facts:

- Built from 2022 to 2023.
- Employer: Maser Engineering.
- Client: Hutchinson.
- Format: tablet app designed for use with safety gloves in front of the workstation.
- E-learning/work-instruction app.
- Hutchinson was relocating composite-material factory work from East Germany to Morocco.
- Instead of sending teachers, teams filmed and digitized worker movements and build steps.
- Catalog exposed photos, videos, blueprints, and support material.
- User selected the factory piece to build.
- User confirmed protective equipment, raw materials, and tools.
- App guided the worker step by step, sometimes 40+ steps, with image, blueprint, video, and help support.
- Domain: composite materials for Airbus and military.
- Stack: Quasar Framework, Vue.js, Airtable, MySQL, C#, PHP.
- Airtable-backed authoring interface enabled around 10 non-technical people to enter data, images, and content.
- Delivery used a MySQL database.
- Built C# automation to pull Airtable data, map it to the production database structure, and update JavaScript fetch web services.
- Replaced direct Airtable calls with PHP endpoints pulling MySQL data through an adapter.
- Learning/support media: PDF plans, MP4 videos, annotated images, and schemas.
- Offline support.
- Two versions: civilian parts and military parts.
- Civilian scope: 383 parts and 7,593 assembly steps.
- Military scope: 129 parts and 2,609 assembly steps.

Candidate highlights:

- `10 non-technical content editors`
- `512 parts`
- `10,202 assembly steps`
- `Offline tablet app for gloved users`
- `Airtable-to-MySQL migration automation`
- `Composite manufacturing transfer`

Possible positioning:

> Digital work-instruction platform for transferring composite-manufacturing know-how between factories, turning filmed expert workflows, photos, videos, and blueprints into step-by-step assembly guidance with PPE, material, and tool checks.

Remaining questions:

- Did it include role-based access or translations?
- How many videos, photos, blueprints, or schemas?
- Any measurable result: reduced trainer travel, faster onboarding, fewer production errors?

### SBM Onboarding & Certification Tracking

Public company context:

- Website: https://sbm-company.com/
- French-origin family-owned group active in crop protection, home & garden, and aromatherapy.
- Public site states SBM operates in 31 countries.

Raw facts:

- Built in 2025.
- Client: SBM Company.
- Modified white-label variant also built for Teréga: https://www.terega.fr/en/
- Teréga variant used the same onboarding/certification core, but document management and advanced role/delegation features were disabled.
- Teréga scope: 2,303 users.
- Onboarding and certification tracking system.
- Client can deliver interactive SCORM courses.
- Tracks course completion for chemical risk, onboarding, and similar training.
- Collects certification documents with expiration management.
- Workers hired for high-risk work sites must provide documents and complete certifications.
- Gate guards can check worker identity and verify valid documents/certifications before site entry.
- Subcontractors can handle paperwork themselves via delegated consultant/subcontractor roles.
- Email notification system for expiring certifications and documents.
- Stack: PHP, Symfony, Symfony UX Live Components, Bootstrap, MariaDB.
- Current production scope: 117 companies, 595 users, and 219 managed documents.

Candidate highlights:

- `SBM: 117 companies`
- `SBM: 595 users`
- `Teréga: 2,303 users`
- `SBM: 219 managed documents`
- `Certification expiry automation`
- `Gate-access compliance checks`
- `White-label Teréga variant`

Possible positioning:

> Compliance onboarding platform for high-risk work sites, combining SCORM training, document collection, certification expiry tracking, subcontractor delegation, and gate-access verification so guards can confirm whether a worker is cleared before entry. A modified white-label Teréga version reused the onboarding and certification core with document management and advanced delegation disabled.

Remaining questions:

- Was this built for internal employees, subcontractors, or both?
- How were identities checked: badge, QR code, ID document, search, mobile app?
- Did it include audit trails, document validation workflow, reminders, dashboards, or exports?
- Was SCORM delivered through an existing LMS or built into this app?

### Wind Turbine Maintenance Planning & Field Reporting

Working public title options:

- Wind Turbine Maintenance Operations Platform
- Wind Park Maintenance Planning & Field Reporting
- Wind Turbine Intervention Management Platform

Raw facts:

- Built from 2022 to 2024.
- Built for Maser Engineering.
- Public Maser Engineering website: https://maser-engineering.com
- Most relevant public page: https://maser-engineering.com/specialite-maintenance/
- Maser Engineering publicly lists maintenance as one of its expertise poles and lists renewable energy / wind-turbine maintenance as part of that activity.
- Role: full-stack engineer.
- Production application; current usage status unknown.
- Managers use the Symfony web application to manage intervention teams across maintained wind parks.
- Web stack: Symfony, Symfony UX Live Components, Bootstrap, MariaDB, REST API.
- Web back office includes a full inventory of maintained parks.
- Inventory includes wind turbines, machine specs, machine numbers, maintenance documents, and related technical information.
- Planning mode lets managers plan field interventions for multiple teams on specific dates.
- Planning captures which team goes to which wind turbine and what work must be done.
- Companion field app is built with Quasar and Vue.js.
- Field app is fully offline capable.
- Offline sync uses IndexedDB through Dexie for complex local persistence.
- App uses a queue system and syncs queued work when connectivity returns.
- Relevant documents are downloaded directly when online and when selecting a maintenance site/job.
- Engineers use the companion app on site with the information needed for each maintenance job.
- Engineers can declare a machine on/off or in maintenance mode.
- Engineers can take pictures, write reports, and add comments offline.
- When the app goes online again, it syncs field data back to the server.
- Managers can then see intervention reports, machine status, photos, comments, and site updates.
- No offline conflict-resolution system was needed.
- Tracks per-turbine maintenance history, including past interventions, documents, and photos.
- Outputs include PDF report generation and a team planning calendar.
- PDF report generation is server-side.
- Reports include checklists, signatures, technician names, work performed, and timestamps.
- Tracks planned vs completed interventions, delays, and total machine downtime.
- Sites are geolocated.
- Google Maps integration gives directions to intervention sites.
- Site records include park manager contact information.
- App is phone-compatible.
- Field scope observed: around 20-30 field engineers.
- Scale: hundreds of wind turbines and 10-20 parks across France.
- Business impact: less paperwork and better traceability.

Candidate highlights:

- `2022-2024 production app`
- `Offline field reporting`
- `Multi-team intervention planning`
- `20-30 field engineers`
- `Hundreds of turbines`
- `10-20 wind parks`
- `Wind park inventory`
- `Photo + report sync`
- `Machine status tracking`
- `PDF report generation`
- `IndexedDB/Dexie offline sync`
- `Google Maps site directions`

Possible positioning:

> Wind-turbine maintenance operations platform for Maser Engineering, combining a Symfony planning back office with an offline-capable Quasar field app. Managers plan multi-team interventions across 10-20 wind parks and hundreds of turbines; engineers work on site with downloaded maintenance documents, checklists, photos, signatures, comments, machine status updates, Google Maps directions, and queued sync when connectivity returns.

Interview questions:

- Did engineers work with gloves, weather constraints, low connectivity, or rugged field constraints?
- Did the workflow include checklists, safety procedures, maintenance document acknowledgment, or regulatory/compliance reporting?
- Any stronger measurable before/after beyond less paperwork and traceability: faster reporting, fewer missed interventions, faster manager visibility?

## Likely Content Priorities And Ordering

Direction: keep a very extensive list, ordered by impact. The top should feel commercially and technically heavy; the lower section should still show the builder/toolmaker pattern across tools, libraries, dashboards, and side products.

Current order:

1. TMIP Scheduler - Industrial Data Orchestration
2. Uncle Bob - Agentic AI Workflow System
3. TMIP Logger - QoS & KPI Observability
4. SBM / Teréga - Onboarding & Certification Tracking
5. i-technology.net - AI-Built Desktop Portfolio
6. Parallax Designer - AI-Built Visual Builder
7. Hutchinson - Digital Work Instructions
8. tchatche.com - White-Label Chat Platform
9. Ad Proxy - Ad-Distribution Server
10. T4ResX - Localization Tooling
11. HeadJS - Open-Source JS Library
12. Wind Turbine Maintenance Operations Platform
13. Student Attendance & Invoicing System
14. Maser Academy - Course Inventory Planning
15. Roland-Garros - Staff Navigation PWA
16. FindUnusedFiles - Visual Studio Extension
17. Public Health Analytics Dashboards
18. HealthMonitoring - Error Tracking
19. JsonRaw - Lightweight JSON Protocol
20. PowerToys for OpenAI
21. MicroCoil Calculator - Web & Mobile
22. Web-Monitor.NET
23. PhantomUI - Web-to-PDF Converter
24. jQuery Mario - Mobile Web Game POC

Future additions should be inserted into this order by signal strength: production/business-critical impact first, then high-scale public/web systems, then builder/toolmaker projects, then narrower utilities and older experiments.

## Future Project Interview Template

Use this template when adding more project highlights later:

1. Project title and public-safe naming.
2. Year or year range.
3. Employer and client/product owner, using `Employer for Client` when useful.
4. Problem solved in one sentence.
5. Users, companies, sites, traffic, jobs/day, documents, parts, revenue, time saved, error reduction, or other scale metrics.
6. Your exact role and ownership level.
7. Technical stack and runtime constraints.
8. Integrations, data flows, APIs, databases, dashboards, or automation.
9. Before/after result or business impact.
10. Public links, docs, store listings, screenshots, or safe references.
11. Confidentiality limits: what can be named, generalized, or omitted.

## Maintenance Notes

- The reusable interview template above is the standard path for adding more project highlights later.
- Keep public claims grounded in known facts, public links, or user-confirmed numbers.
- When new highlights are added, update `content.ts`, prerender output expectations, SEO fallback copy if needed, and this ordering note.
