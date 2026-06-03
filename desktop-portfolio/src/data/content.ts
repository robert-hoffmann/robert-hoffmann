/* ============================================================
   Content Registry — Portfolio Data (Bilingual EN / FR)
   ============================================================
   All portfolio content lives here, separated from logic.
   Edit this file to update content without touching components.
   ============================================================ */

import type { Localized } from '../types/desktop'

export const about = {
  name     : 'Robert Hoffmann',
  tagline  : {
    en : 'Full-Stack Engineer · Consultant · 25+ years in tech',
    fr : 'Ingénieur Full-Stack · Consultant · 25+ ans dans la tech',
  } satisfies Localized,
  photo    : `${import.meta.env.BASE_URL}profile-avatar-80.avif`,
  photoSrcSet : [
    `${import.meta.env.BASE_URL}profile-avatar-80.avif 1x`,
    `${import.meta.env.BASE_URL}profile-avatar-160.avif 2x`,
    `${import.meta.env.BASE_URL}profile-avatar-240.avif 3x`,
  ].join(', '),

  aiCallout : {
    en :
      'I use AI tools, agents, and workflows every day\u202F— for research, writing specs, ' +
      'reviewing codebases, and accelerating delivery. I\u2019m genuinely comfortable ' +
      'with the whole stack, from prompt engineering to raw code.',
    fr :
      'J\u2019utilise des outils d\u2019IA, des agents et des workflows au quotidien\u202F— ' +
      'pour la recherche, la rédaction de spécifications, la revue de code et ' +
      'l\u2019accélération des livraisons. Je suis réellement à l\u2019aise avec l\u2019ensemble ' +
      'de la chaîne, du prompt engineering au code brut.',
  } satisfies Localized,

  summary : {
    en :
      'I\u2019ve spent 25+ years shipping software across aerospace, telecom, and media\u202F— ' +
      'from white-label chat platforms handling 400M requests a day and ad systems ' +
      'serving 3B+ impressions a month, to industrial IoT pipelines feeding real-time ' +
      'dashboards on the factory floor. High-traffic, mission-critical, and usually ' +
      'the kind of thing that has to work at 3\u202Fam.',
    fr :
      'En 25+ ans, j\u2019ai livré des logiciels dans l\u2019aérospatiale, les télécoms et les ' +
      'médias\u202F— des plateformes de chat en marque blanche traitant 400M de requêtes ' +
      'par jour et des régies pub servant 3Md+ d\u2019impressions par mois, jusqu\u2019aux ' +
      'pipelines IoT industriels alimentant des tableaux de bord temps réel en usine. ' +
      'Fort trafic, systèmes critiques, et le genre de chose qui doit fonctionner à 3\u202Fh du matin.',
  } satisfies Localized,

  expertise : [
    { en : 'AI Tools & Agents',       fr : 'Outils IA & Agents' },
    { en : '.NET · TS · Vue · Python', fr : '.NET · TS · Vue · Python' },
    { en : 'Data Pipelines & IoT',    fr : 'Pipelines de données & IoT' },
    { en : 'Skywise / Foundry',       fr : 'Skywise / Foundry' },
    { en : 'DevOps & CI/CD',          fr : 'DevOps & CI/CD' },
    { en : 'Agile & Scrum',           fr : 'Agile & Scrum' },
  ] satisfies Localized[],

  certifications : [
    { label : 'PSM',                    issuer : 'Scrum.org' },
    { label : 'PSPO',                   issuer : 'Scrum.org' },
    { label : 'Lean Six Sigma',         issuer : 'LinkedIn' },
    { label : 'Change Mgmt',            issuer : 'LinkedIn' },
    { label : 'Strategic Agility',      issuer : 'LinkedIn' },
    { label : 'Digital Transformation', issuer : 'LinkedIn' },
    { label : 'Digital Strategy',       issuer : 'LinkedIn' },
  ],

  links : [
    { label : 'GitHub',   href : 'https://github.com/robert-hoffmann' },
    { label : 'LinkedIn', href : 'https://www.linkedin.com/in/hoffmannrobert' },
    { label : 'X',        href : 'https://x.com/itechnologynet' },
  ],
} as const

export const projects = [
  {
    id         : 'proj-tmip-scheduler',
    name       : {
      en : 'TMIP Scheduler — Industrial Data Orchestration',
      fr : 'TMIP Scheduler — Orchestration de données industrielles',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for Airbus',
      fr : 'Maser Engineering pour Airbus',
    } satisfies Localized,
    period     : '2025 – present',
    summary    : {
      en :
        'Central orchestration service for Airbus smart-cabinet operations, synchronizing ' +
        'Nexess cabinet servers, Google Workspace, Skywise datasets, and internal management ' +
        'tools while modernizing an undocumented, untyped legacy Python codebase into typed, observable, ' +
        'production-grade infrastructure.',
      fr :
        'Service central d\u2019orchestration pour les opérations d\u2019armoires connectées Airbus, ' +
        'synchronisant les serveurs Nexess, Google Workspace, les datasets Skywise et les ' +
        'outils de gestion internes tout en modernisant une base Python legacy non documentée ' +
        'et non typée vers une infrastructure typée, observable et exploitable en production.',
    } satisfies Localized,
    highlights : [
      {
        en : '30K+ jobs/day',
        fr : '30K+ jobs/jour',
      },
      {
        en : '3-100 web-service calls/job',
        fr : '3-100 appels web-service/job',
      },
      {
        en : '16 Airbus assembly plants',
        fr : '16 usines d\u2019assemblage Airbus',
      },
      {
        en : '~1,000 users',
        fr : '~1 000 utilisateurs',
      },
    ] satisfies Localized[],
    stack      : [
      'Python 3.12',
      'FastAPI',
      'aiohttp',
      'Pydantic',
      'glom',
      'uv',
      'Ruff',
      'Pyright',
      'Windows Server 2022',
      'Skywise',
      'Google Workspace',
      'Vue.js',
    ],
  },
  {
    id         : 'proj-uncle-bob',
    name       : {
      en : 'Uncle Bob — Agentic AI Workflow System',
      fr : 'Uncle Bob — Système de workflow IA agentique',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2026 – present',
    summary    : {
      en :
        'Portable skill system for AI coding agents, structured as a full operating model ' +
        'for quality, workflow, governance, authoring, and specialist ' +
        'implementation guidance. It adapts Agile, Scrum, Kanban, Shape Up, and AI-evaluation ideas ' +
        'into practical agent controls: lane selection, durable artifacts, WIP limits, readiness gates, ' +
        'bounded exceptions, evidence routing, docs synchronization, and deterministic validation scripts.',
      fr :
        'Système de skills portable pour agents de code IA, structuré comme un modèle opérationnel ' +
        'complet pour qualité, workflow, gouvernance, authoring et spécialistes ' +
        'd\u2019implémentation. Il adapte Agile, Scrum, Kanban, Shape Up et les pratiques d\u2019évaluation IA ' +
        'en contrôles agentiques concrets : choix de lane, artefacts durables, limites WIP, gates de ' +
        'readiness, exceptions bornées, routage d\u2019évidence, synchronisation documentaire et scripts ' +
        'de validation déterministes.',
    } satisfies Localized,
    highlights : [
      {
        en : '11 portable AI skills',
        fr : '11 skills IA portables',
      },
      {
        en : 'Workflow + governance gates',
        fr : 'Gates workflow + gouvernance',
      },
      {
        en : 'Docs-sync validation',
        fr : 'Validation sync docs',
      },
      {
        en : 'Production aerospace use',
        fr : 'Usage production aéronautique',
      },
    ] satisfies Localized[],
    stack      : [
      'Agent Skills',
      'GitHub Copilot',
      'Codex',
      'Claude Code',
      'VitePress',
      'Python',
      'uv',
      'Ruff',
      'Taskfile',
      'GitHub Actions',
      'Mermaid',
      'Markdown',
      'AI Workflows',
    ],
    links      : [
      {
        label : 'Docs',
        href  : 'https://robert-hoffmann.github.io/uncle-bob/',
      },
      {
        label : 'GitHub',
        href  : 'https://github.com/robert-hoffmann/uncle-bob',
      },
    ],
  },
  {
    id         : 'proj-tmip-logger',
    name       : {
      en : 'TMIP Logger — QoS & KPI Observability',
      fr : 'TMIP Logger — Observabilité QoS & KPI',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for Airbus',
      fr : 'Maser Engineering pour Airbus',
    } satisfies Localized,
    period     : '2025 – present',
    summary    : {
      en :
        'Structured logging and observability layer for TMIP operations, turning raw job ' +
        'events into searchable SQLite records, a Vue.js inspection UI, Skywise dashboard ' +
        'feeds, and automated alerts for error spikes, job health, and plant-level impact.',
      fr :
        'Couche de logging structuré et d\u2019observabilité pour les opérations TMIP, transformant ' +
        'les événements bruts des jobs en enregistrements SQLite consultables, interface Vue.js, ' +
        'flux dashboard Skywise et alertes automatisées sur les pics d\u2019erreurs, la santé des ' +
        'jobs et l\u2019impact par usine.',
    } satisfies Localized,
    highlights : [
      {
        en : '10x error reduction',
        fr : '10x moins d\u2019erreurs',
      },
      {
        en : '5x faster bug resolution',
        fr : 'Résolution 5x plus rapide',
      },
      {
        en : '5x job-volume scale-up',
        fr : 'Volume de jobs multiplié par 5',
      },
      {
        en : 'Nearly 300 scheduled jobs',
        fr : 'Près de 300 jobs planifiés',
      },
    ] satisfies Localized[],
    stack      : [
      'Python',
      'Vue.js',
      'SQLite',
      'CSV',
      'Skywise',
      'Structured Logging',
      'REST API',
    ],
  },
  {
    id         : 'proj-sbm-compliance',
    name       : {
      en : 'SBM / Ter\u00e9ga — Onboarding & Certification Tracking',
      fr : 'SBM / Ter\u00e9ga — Suivi onboarding & certifications',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for SBM Company and Ter\u00e9ga',
      fr : 'Maser Engineering pour SBM Company et Ter\u00e9ga',
    } satisfies Localized,
    period     : '2025',
    summary    : {
      en :
        'Compliance onboarding platform for high-risk work sites, combining SCORM training, ' +
        'document collection, certification expiry tracking, subcontractor delegation, and ' +
        'gate-access verification so site guards can confirm whether a worker is cleared before entry. ' +
        'A white-label Ter\u00e9ga version reused the onboarding and certification core with document ' +
        'management and advanced role delegation disabled.',
      fr :
        'Plateforme d\u2019onboarding conformité pour sites à risque, combinant formations SCORM, ' +
        'collecte documentaire, suivi d\u2019expiration des certifications, délégation aux ' +
        'sous-traitants et contrôle d\u2019accès afin que les gardiens vérifient les habilitations ' +
        'avant l\u2019entrée sur site. Une version marque blanche Ter\u00e9ga réutilisait le coeur ' +
        'onboarding et certification avec gestion documentaire et délégation de rôles avancée ' +
        'désactivées.',
    } satisfies Localized,
    highlights : [
      {
        en : 'SBM: 117 companies',
        fr : 'SBM : 117 entreprises',
      },
      {
        en : 'SBM: 595 users',
        fr : 'SBM : 595 utilisateurs',
      },
      {
        en : 'Ter\u00e9ga: 2,303 users',
        fr : 'Ter\u00e9ga : 2 303 utilisateurs',
      },
      {
        en : 'SBM: 219 documents',
        fr : 'SBM : 219 documents',
      },
      {
        en : 'Expiry automation',
        fr : 'Automatisation des expirations',
      },
      {
        en : 'White-label variant',
        fr : 'Version marque blanche',
      },
    ] satisfies Localized[],
    stack      : [
      'PHP',
      'Symfony',
      'Live Components',
      'Bootstrap',
      'MariaDB',
      'SCORM',
    ],
    links      : [
      {
        label : 'SBM Company',
        href  : 'https://sbm-company.com/',
      },
      {
        label : 'Ter\u00e9ga',
        href  : 'https://www.terega.fr/en/',
      },
    ],
  },
  {
    id         : 'proj-desktop-portfolio',
    name       : {
      en : 'i-technology.net — AI-Built Desktop Portfolio',
      fr : 'i-technology.net — Portfolio desktop construit avec l\u2019IA',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2026 – present',
    summary    : {
      en :
        'Interactive portfolio and AI-workflow testbed that turns a resume into a desktop ' +
        'simulator. Built through AI-driven engineering workflows, it combines a macOS-style ' +
        'shell, typed app registry, draggable and resizable window manager, async-loaded mini ' +
        'apps, bilingual content, mobile shell, prerendered SEO, and performance-focused asset loading.',
      fr :
        'Portfolio interactif et banc d\u2019essai de workflows IA transformant un CV en simulateur ' +
        'desktop. Construit via des workflows d\u2019ingénierie pilotés par l\u2019IA, il combine shell ' +
        'style macOS, registre d\u2019apps typé, gestionnaire de fenêtres déplaçables et ' +
        'redimensionnables, mini-apps chargées en async, contenu bilingue, shell mobile, SEO ' +
        'prérendu et chargement d\u2019assets optimisé.',
    } satisfies Localized,
    highlights : [
      {
        en : '100% AI-built',
        fr : '100% construit avec l\u2019IA',
      },
      {
        en : 'Desktop simulator + mini apps',
        fr : 'Simulateur desktop + mini-apps',
      },
      {
        en : 'Lighthouse 100 desktop',
        fr : 'Lighthouse 100 desktop',
      },
      {
        en : 'Lighthouse 99 mobile',
        fr : 'Lighthouse 99 mobile',
      },
    ] satisfies Localized[],
    stack      : [
      'Vue 3',
      'TypeScript',
      'Vite',
      'Tailwind CSS v4',
      'Three.js',
      'vite-prerender-plugin',
      'Sharp',
      'AI Workflows',
    ],
    links      : [
      { label : 'Live site', href : 'https://i-technology.net/' },
    ],
  },
  {
    id         : 'proj-parallax-designer',
    name       : {
      en : 'Parallax Designer — AI-Built Visual Builder',
      fr : 'Parallax Designer — Builder visuel construit avec l\u2019IA',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2026 – present',
    summary    : {
      en :
        'Browser-based visual editor for designing multi-layer parallax scenes like the ' +
        'portfolio background system. It provides real-time preview, layer geometry and motion ' +
        'controls, local asset storage, presets, schema validation, standalone runtime HTML export, ' +
        'and an AI-driven documentation pipeline syncing app, user, and API docs into a VitePress site.',
      fr :
        'Éditeur visuel navigateur pour concevoir des scènes parallax multi-couches comme le ' +
        'système de fond du portfolio. Il propose preview temps réel, contrôles géométrie et ' +
        'mouvement par couche, stockage local d\u2019assets, presets, validation de schéma, export ' +
        'HTML runtime autonome et pipeline documentaire IA synchronisant app, docs utilisateur ' +
        'et API vers un site VitePress.',
    } satisfies Localized,
    highlights : [
      {
        en : '100% AI-built',
        fr : '100% construit avec l\u2019IA',
      },
      {
        en : 'Real-time parallax editor',
        fr : 'Éditeur parallax temps réel',
      },
      {
        en : 'Standalone HTML export',
        fr : 'Export HTML autonome',
      },
      {
        en : 'Automated VitePress docs',
        fr : 'Docs VitePress automatisées',
      },
    ] satisfies Localized[],
    stack      : [
      'Vue 3',
      'TypeScript',
      'Vite',
      'Tailwind CSS v4',
      'Dexie',
      'IndexedDB',
      'SortableJS',
      'Vitest',
      'Playwright',
      'VitePress',
      'GitHub Actions',
      'AI Workflows',
    ],
    links      : [
      { label : 'Live app', href : 'https://robert-hoffmann.github.io/parallax-designer/' },
      { label : 'Docs',     href : 'https://robert-hoffmann.github.io/parallax-designer/docs/' },
      { label : 'GitHub',   href : 'https://github.com/robert-hoffmann/parallax-designer' },
    ],
  },
  {
    id         : 'proj-hutchinson-work-instructions',
    name       : {
      en : 'Hutchinson — Digital Work Instructions',
      fr : 'Hutchinson — Instructions de travail digitales',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for Hutchinson',
      fr : 'Maser Engineering pour Hutchinson',
    } satisfies Localized,
    period     : '2022 – 2023',
    summary    : {
      en :
        'Tablet work-instruction platform for transferring composite-manufacturing know-how ' +
        'between factories. Operators used it with safety gloves at the workstation, with ' +
        'offline access to PDF plans, MP4 videos, annotated images, schemas, PPE checks, ' +
        'materials, tools, and step-by-step assembly guidance.',
      fr :
        'Plateforme tablette d\u2019instructions de travail pour transférer le savoir-faire de ' +
        'fabrication composite entre usines. Les opérateurs l\u2019utilisaient avec des gants de ' +
        'sécurité au poste, avec accès hors ligne aux plans PDF, vidéos MP4, images annotées, ' +
        'schémas, contrôles EPI, matériaux, outils et guidage d\u2019assemblage étape par étape.',
    } satisfies Localized,
    highlights : [
      {
        en : '512 parts',
        fr : '512 pièces',
      },
      {
        en : '10,202 assembly steps',
        fr : '10 202 étapes d\u2019assemblage',
      },
      {
        en : 'Offline tablet app',
        fr : 'Application tablette hors ligne',
      },
      {
        en : '10 Airtable content contributors',
        fr : '10 contributeurs contenu Airtable',
      },
    ] satisfies Localized[],
    stack      : [
      'Quasar',
      'Vue.js',
      'Airtable',
      'MySQL',
      'C#',
      'PHP',
      'Offline UX',
    ],
  },
  {
    id         : 'proj-chatapp',
    name       : {
      en : 'tchatche.com — White-Label Chat Platform',
      fr : 'tchatche.com — Plateforme de chat en marque blanche',
    } satisfies Localized,
    org        : {
      en : '123 Multimedia / Index Multimedia',
      fr : '123 Multimedia / Index Multimedia',
    } satisfies Localized,
    period     : '2004 – 2013',
    summary    : {
      en :
        'Senior full-stack C# architecture for a high-scale real-time chat and community ' +
        'platform sold as a white-label product to SFR, Bouygues, Orange, TF1, NRJ, Chérie FM, ' +
        'and others. The product included full moderation, picture albums, location search, ' +
        'Google Maps integration, a dedicated Facebook app, social sharing, and 13-language i18n.',
      fr :
        'Architecture full-stack C# senior pour une plateforme de chat temps réel et communauté ' +
        'à grande échelle, vendue en marque blanche à SFR, Bouygues, Orange, TF1, NRJ, Chérie FM ' +
        'et autres. Le produit incluait modération complète, albums photo, recherche géolocalisée, ' +
        'intégration Google Maps, application Facebook dédiée, partage social et i18n en 13 langues.',
    } satisfies Localized,
    highlights : [
      {
        en : '600M page views/month',
        fr : '600M pages vues/mois',
      },
      {
        en : '400M requests/day',
        fr : '400M requêtes/jour',
      },
      {
        en : '$300K/month revenue peak',
        fr : 'Pic à 300K$/mois',
      },
      {
        en : '13-language i18n',
        fr : 'i18n en 13 langues',
      },
    ] satisfies Localized[],
    stack      : [
      '.NET MVC5',
      'WebAPI 2',
      '.NET 4.5',
      'C#',
      'CSS3',
      'HTML5',
      'LESS',
      'jsRender',
      'Google Maps',
    ],
  },
  {
    id         : 'proj-adproxy',
    name       : {
      en : 'Ad Proxy — Ad-Distribution Server',
      fr : 'Ad Proxy — Serveur de distribution publicitaire',
    } satisfies Localized,
    org        : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period     : '2010 – 2013',
    summary    : {
      en :
        'Generic ad-distribution server that gave ad managers one scheduling and dispatch ' +
        'entry point across chat, news, blog, and white-label sites. It consolidated many ' +
        'ad-agency contracts and agency-specific systems behind demographic targeting, ' +
        'format detection, site routing, and performance-based delivery.',
      fr :
        'Serveur générique de distribution publicitaire donnant aux responsables pub un point ' +
        'd\u2019entrée unique pour planifier et diffuser sur les sites chat, news, blog et marque ' +
        'blanche. Il consolidait de nombreux contrats régies et systèmes propres à chaque régie ' +
        'derrière ciblage démographique, détection de format, routage par site et diffusion ' +
        'basée sur la performance.',
    } satisfies Localized,
    highlights : [
      {
        en : '3B+ ads served/month',
        fr : '3Md+ pubs servies/mois',
      },
      {
        en : '+20% ad revenue',
        fr : '+20% revenus publicitaires',
      },
      {
        en : '+30% click-through rate',
        fr : '+30% taux de clic',
      },
      {
        en : '~5% CPU on 2 servers',
        fr : '~5% CPU sur 2 serveurs',
      },
    ] satisfies Localized[],
    stack      : [
      'ASP.NET 4',
      'C#',
      'Ad Serving',
      'Targeting',
      'Load Balancing',
    ],
  },
  {
    id         : 'proj-t4resx',
    name       : {
      en : 'T4ResX — Localization Tooling',
      fr : 'T4ResX — Outillage de localisation',
    } satisfies Localized,
    org        : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period     : '2012 – 2014',
    summary    : {
      en :
        'Open-source Visual Studio T4 tooling distributed through NuGet and the Visual Studio ' +
        'Marketplace, transforming RESX files into strongly typed resource accessors for websites, ' +
        'class libraries, ViewModels, localized JavaScript exports, database-backed translations, ' +
        'and RESX-to-Excel translator workflows.',
      fr :
        'Outillage T4 Visual Studio open source distribué via NuGet et Visual Studio Marketplace, ' +
        'transformant les fichiers RESX en accesseurs de ressources fortement typés pour sites web, ' +
        'bibliothèques de classes, ViewModels, exports JavaScript localisés, traductions en base ' +
        'et workflows RESX-vers-Excel pour traducteurs.',
    } satisfies Localized,
    highlights : [
      {
        en : '14.5K NuGet downloads',
        fr : '14.5K téléchargements NuGet',
      },
      {
        en : '2.3K VS Marketplace installs',
        fr : '2.3K installations VS Marketplace',
      },
      {
        en : 'Strongly typed resources',
        fr : 'Ressources fortement typées',
      },
      {
        en : 'Localized JavaScript export',
        fr : 'Export JavaScript localisé',
      },
    ] satisfies Localized[],
    stack      : [
      'C#',
      'T4',
      'Visual Studio',
      'RESX',
    ],
    links      : [
      {
        label : 'NuGet',
        href  : 'https://www.nuget.org/packages/T4ResX',
      },
      {
        label : 'VS Marketplace',
        href  : 'https://marketplace.visualstudio.com/items?itemName=RobertHoffmann.T4ResX',
      },
      {
        label : 'GitHub',
        href  : 'https://github.com/itechnology/T4ResX',
      },
    ],
  },
  {
    id         : 'proj-headjs',
    name       : {
      en : 'HeadJS — Open-Source JS Library',
      fr : 'HeadJS — Bibliothèque JS open source',
    } satisfies Localized,
    org        : {
      en : 'Open Source / Index Multimedia',
      fr : 'Open source / Index Multimedia',
    } satisfies Localized,
    period     : '2011 – 2014',
    summary    : {
      en :
        'Main maintainer of a popular JavaScript library for non-blocking script loading, ' +
        'resource management, responsive helpers, browser detection, feature detection, ' +
        'HTML5 enabling, and Modernizr-style shim support during the IE6+ and mobile-web era.',
      fr :
        'Mainteneur principal d\u2019une bibliothèque JavaScript populaire pour chargement de scripts ' +
        'non bloquant, gestion de ressources, helpers responsive, détection navigateur, détection ' +
        'de fonctionnalités, activation HTML5 et support de shims type Modernizr à l\u2019époque IE6+ ' +
        'et web mobile.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Main maintainer',
        fr : 'Mainteneur principal',
      },
      {
        en : '4K+ GitHub stars',
        fr : '4K+ étoiles GitHub',
      },
      {
        en : '400+ forks',
        fr : '400+ forks',
      },
      {
        en : 'Script loader + feature detection',
        fr : 'Loader JS + feature detection',
      },
    ] satisfies Localized[],
    stack      : ['JavaScript'],
    links      : [
      { label : 'Docs',   href : 'https://headjs.github.io/' },
      { label : 'GitHub', href : 'https://github.com/headjs/headjs' },
    ],
  },
  {
    id         : 'proj-wind-maintenance',
    name       : {
      en : 'Wind Turbine Maintenance Operations Platform',
      fr : 'Plateforme d\u2019opérations de maintenance éolienne',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering',
      fr : 'Maser Engineering',
    } satisfies Localized,
    period     : '2022 – 2024',
    summary    : {
      en :
        'Production maintenance operations platform for Maser Engineering\u2019s renewable-energy ' +
        'field teams, combining a Symfony planning back office with an offline-capable Quasar ' +
        'companion app. Managers planned multi-team interventions across 10-20 wind parks and ' +
        'hundreds of turbines; field engineers downloaded site and job documents, captured ' +
        'checklists, photos, signatures, timestamps, work reports, machine status, and downtime, ' +
        'used Google Maps directions, and synced queued updates when connectivity returned.',
      fr :
        'Plateforme d\u2019opérations de maintenance en production pour les équipes terrain énergie ' +
        'renouvelable de Maser Engineering, combinant back-office Symfony de planification et ' +
        'application compagnon Quasar utilisable hors ligne. Les managers planifiaient des ' +
        'interventions multi-équipes sur 10-20 parcs éoliens et des centaines d\u2019éoliennes ; ' +
        'les techniciens téléchargeaient les documents site et job, saisissaient checklists, ' +
        'photos, signatures, horodatages, rapports de travaux, directions Google Maps, statut ' +
        'machine, temps d\u2019arrêt et synchronisation en file d\u2019attente au retour réseau.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Hundreds of turbines',
        fr : 'Des centaines d\u2019éoliennes',
      },
      {
        en : '10-20 wind parks',
        fr : '10-20 parcs éoliens',
      },
      {
        en : '20-30 field engineers',
        fr : '20-30 techniciens terrain',
      },
      {
        en : 'Offline Dexie sync',
        fr : 'Sync hors ligne Dexie',
      },
    ] satisfies Localized[],
    stack      : [
      'Symfony',
      'Live Components',
      'Bootstrap',
      'MariaDB',
      'REST API',
      'Quasar',
      'Vue.js',
      'Dexie',
      'IndexedDB',
      'Google Maps',
      'PDF',
    ],
    links      : [
      {
        label : 'Maser maintenance',
        href  : 'https://maser-engineering.com/specialite-maintenance/',
      },
    ],
  },
  {
    id         : 'proj-attendance-billing',
    name       : {
      en : 'Student Attendance & Invoicing System',
      fr : 'Application de pointage & facturation',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering',
      fr : 'Maser Engineering',
    } satisfies Localized,
    period     : '2023',
    summary    : {
      en :
        'Digital attendance and billing workflow for an aerospace training center. Teachers ' +
        'collected student signatures digitally; HR used the back office to track presence, ' +
        'absences, hours, client associations, attendance PDFs, billing CSVs, and automatic ' +
        'invoicing data for companies sending students.',
      fr :
        'Workflow digital de pointage et facturation pour un centre de formation aéronautique. ' +
        'Les formateurs collectaient les signatures des stagiaires numériquement ; les RH ' +
        'suivaient présence, absences, heures, associations client, PDF d\u2019émargement, exports ' +
        'CSV de facturation et données de facturation automatique pour les entreprises clientes.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Hundreds of students/year',
        fr : 'Plusieurs centaines de stagiaires/an',
      },
      {
        en : 'Paper attendance replaced',
        fr : 'Pointage papier remplacé',
      },
      {
        en : 'Attendance PDFs',
        fr : 'PDF d\u2019émargement',
      },
      {
        en : 'Automated billing exports',
        fr : 'Exports de facturation automatisés',
      },
    ] satisfies Localized[],
    stack      : [
      'Vue.js',
      'Symfony',
      'Live Components',
      'Bootstrap',
      'MariaDB',
      'PDF',
      'CSV',
    ],
  },
  {
    id         : 'proj-maser-academy-inventory',
    name       : {
      en : 'Maser Academy — Course Inventory Planning',
      fr : 'Maser Academy — Planification d\u2019inventaire formation',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for Maser Academy',
      fr : 'Maser Engineering pour Maser Academy',
    } satisfies Localized,
    period     : '2025',
    summary    : {
      en :
        'Airtable-based inventory planning system for Maser Academy training centers. Managers ' +
        'select an upcoming course session, training center, student group, and exercises; the ' +
        'system aggregates required supplies across 76 practical exercises, 532 supply types, ' +
        'and 5 suppliers into a purchasing list with references, prices, totals, automations, ' +
        'and CSV export for the buying department.',
      fr :
        'Système Airtable de planification d\u2019inventaire pour les centres de formation Maser ' +
        'Academy. Les managers sélectionnent une session à venir, un centre, un groupe de ' +
        'stagiaires et les travaux pratiques prévus ; le système agrège les fournitures ' +
        'nécessaires sur 76 travaux pratiques, 532 types de fournitures et 5 fournisseurs en ' +
        'liste d\u2019achat avec références, prix, totaux, automatisations et export CSV pour le ' +
        'service achats.',
    } satisfies Localized,
    highlights : [
      {
        en : '76 practical exercises',
        fr : '76 travaux pratiques',
      },
      {
        en : '532 supply types',
        fr : '532 types de fournitures',
      },
      {
        en : '5 suppliers',
        fr : '5 fournisseurs',
      },
      {
        en : 'Automatic purchase lists',
        fr : 'Listes d\u2019achat automatiques',
      },
      {
        en : 'CSV purchasing export',
        fr : 'Export CSV achats',
      },
    ] satisfies Localized[],
    stack      : [
      'Airtable',
      'Airtable Automations',
      'Linked Records',
      'Formulas',
      'CSV',
      'Inventory Modeling',
    ],
    links      : [
      {
        label : 'Maser Academy',
        href  : 'https://www.maser-academy.com/',
      },
    ],
  },
  {
    id         : 'proj-roland-garros-navigation',
    name       : {
      en : 'Roland-Garros — Staff Navigation PWA',
      fr : 'Roland-Garros — PWA de guidage du personnel',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for CRIT / Roland-Garros',
      fr : 'Maser Engineering pour CRIT / Roland-Garros',
    } satisfies Localized,
    period     : '2022',
    summary    : {
      en :
        'Navigation PWA for temporary staff working at Roland-Garros, guiding people across ' +
        'venue halls, corridors, workspaces, and access paths with manual step plans, road and ' +
        'hallway photos, mini-maps, directional arrows, and Chrome text-to-speech instructions.',
      fr :
        'PWA de navigation pour les intérimaires travaillant à Roland-Garros, guidant les ' +
        'personnes dans les halls, couloirs, espaces de travail et chemins d\u2019accès via plans ' +
        'manuels, photos de routes et couloirs, mini-cartes, flèches directionnelles et ' +
        'instructions vocales Chrome TTS.',
    } satisfies Localized,
    highlights : [
      {
        en : 'PWA for temporary staff',
        fr : 'PWA pour intérimaires',
      },
      {
        en : 'Step-by-step visual routing',
        fr : 'Guidage visuel étape par étape',
      },
      {
        en : 'Chrome TTS directions',
        fr : 'Instructions vocales Chrome TTS',
      },
      {
        en : 'Live Airtable updates',
        fr : 'Mises à jour Airtable live',
      },
    ] satisfies Localized[],
    stack      : [
      'Vanilla JavaScript',
      'HTML5',
      'CSS3',
      'PWA',
      'Chrome TTS',
      'Airtable',
    ],
  },
  {
    id         : 'proj-findunused',
    name       : {
      en : 'FindUnusedFiles — Visual Studio Extension',
      fr : 'FindUnusedFiles — Extension Visual Studio',
    } satisfies Localized,
    org        : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period     : '2013 – 2015',
    summary    : {
      en :
        'Visual Studio add-in and standalone developer tool that scanned VS solutions and ' +
        'website projects to surface unused images, scripts, stylesheets, and other resources, ' +
        'reducing dead assets in large web applications.',
      fr :
        'Add-in Visual Studio et outil développeur autonome analysant les solutions VS et projets ' +
        'web pour identifier images, scripts, feuilles de style et autres ressources inutilisées, ' +
        'réduisant les assets morts dans de grandes applications web.',
    } satisfies Localized,
    highlights : [
      {
        en : '15K+ VS Marketplace installs',
        fr : '15K+ installations VS Marketplace',
      },
      {
        en : 'Solution and website scans',
        fr : 'Scan solutions et sites web',
      },
      {
        en : 'Unused asset detection',
        fr : 'Détection d\u2019assets inutilisés',
      },
    ] satisfies Localized[],
    stack      : [
      'C#',
      'Visual Studio SDK',
      '.NET',
    ],
    links      : [
      {
        label : 'Marketplace',
        href  : 'https://marketplace.visualstudio.com/items?itemName=RobertHoffmann.FindUnusedFiles',
      },
    ],
  },
  {
    id         : 'proj-public-health-analytics',
    name       : {
      en : 'Public Health Analytics Dashboards',
      fr : 'Dashboards d\u2019analyse santé publique',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2021 – present',
    summary    : {
      en :
        'Public Power BI dashboards consuming French public-health open data, including DREES ' +
        'vaccination datasets and COVID-19 indicators published as a data.gouv.fr reuse. Built ' +
        'comparative views by vaccination status, age, date range, hospitalization, ICU occupancy, ' +
        'deaths, positivity, tests, and demographic breakdowns.',
      fr :
        'Dashboards Power BI publics consommant des données ouvertes françaises de santé publique, ' +
        'dont les datasets DREES vaccination et indicateurs COVID-19 publiés comme réutilisation ' +
        'data.gouv.fr. Vues comparatives par statut vaccinal, âge, période, hospitalisations, ' +
        'réanimation, décès, positivité, tests et ventilations démographiques.',
    } satisfies Localized,
    highlights : [
      {
        en : '8K data.gouv views',
        fr : '8K vues data.gouv',
      },
      {
        en : 'DREES + COVID indicators',
        fr : 'Indicateurs DREES + COVID',
      },
      {
        en : 'Vaccination-status analysis',
        fr : 'Analyse par statut vaccinal',
      },
      {
        en : 'Power BI public reports',
        fr : 'Rapports Power BI publics',
      },
    ] satisfies Localized[],
    stack      : ['Power BI'],
    links      : [
      {
        label : 'Stats COVID',
        href  : 'https://www.data.gouv.fr/reuses/stats-covid-france',
      },
      {
        label : 'Stats DREES',
        href  : 'https://app.powerbi.com/view?r=eyJrIjoiYWRlZjQ5ZjAtZjllYy00OGNmLWI3NDctMzdkM2Y3YzkxMjUyIiwidCI6ImUxNTkwMzRhLTc5ODQtNDQ2ZS1iODM0LWUxZTM3ZDE2NzY3OSJ9',
      },
    ],
  },
  {
    id         : 'proj-healthmon',
    name       : {
      en : 'HealthMonitoring — Error Tracking',
      fr : 'HealthMonitoring — Suivi d\u2019erreurs',
    } satisfies Localized,
    org        : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period     : '2006 – 2013',
    summary    : {
      en :
        'Aggregated error-tracking back office built on .NET HealthMonitoring. It tracked SQL, ' +
        'IIS, .NET, application, and client-side errors; grouped incidents by machine, exception, ' +
        'and message; and exposed drill-downs into stack traces, request context, and browser metadata.',
      fr :
        'Back-office de suivi d\u2019erreurs agrégé basé sur .NET HealthMonitoring. Il suivait les ' +
        'erreurs SQL, IIS, .NET, applicatives et client ; regroupait les incidents par machine, ' +
        'exception et message ; et exposait stack traces, contexte requête et métadonnées navigateur.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Bug resolution from days to minutes',
        fr : 'Résolution de jours à minutes',
      },
      {
        en : 'SQL/IIS/.NET/client errors',
        fr : 'Erreurs SQL/IIS/.NET/client',
      },
      {
        en : 'Aggregated stack-trace back office',
        fr : 'Back-office stack traces agrégé',
      },
    ] satisfies Localized[],
    stack      : [
      'ASP.NET',
      '.NET Framework',
      'HealthMonitoring',
    ],
  },
  {
    id         : 'proj-jsonr',
    name       : {
      en : 'JsonRaw — Lightweight JSON Protocol',
      fr : 'JsonRaw — Protocole JSON léger',
    } satisfies Localized,
    org        : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period     : '2012 – 2013',
    summary    : {
      en :
        'Production lightweight JSON protocol used by the tchatche.com chat platform to reduce ' +
        'bandwidth on high-volume Ajax traffic. It removed repeated object keys from payloads ' +
        'and reconstructed data from implicit schemas or type hints, anticipating the same ' +
        'shape-aware compression idea now seen in LLM-oriented formats like TOON.',
      fr :
        'Protocole JSON léger utilisé en production par la plateforme de chat tchatche.com pour ' +
        'réduire la bande passante sur du trafic Ajax à fort volume. Il supprimait les clés ' +
        'd\u2019objet répétées des payloads, puis reconstruisait les données via schémas implicites ' +
        'ou indices de type, anticipant la même idée de compression orientée structure que l\u2019on ' +
        'retrouve aujourd\u2019hui dans des formats pour LLM comme TOON.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Production tchatche.com chat traffic',
        fr : 'Trafic chat tchatche.com en production',
      },
      {
        en : '43-51% smaller sample payloads',
        fr : 'Payloads exemples réduits de 43-51%',
      },
      {
        en : 'Schema-aware key elision',
        fr : 'Élimination des clés par schéma',
      },
      {
        en : 'TOON-like idea in 2012',
        fr : 'Idée proche de TOON en 2012',
      },
    ] satisfies Localized[],
    stack      : [
      'JavaScript',
      'C#',
      '.NET',
      'JSON',
    ],
    links      : [
      { label : 'GitHub', href : 'https://github.com/itechnology/JsonRaw' },
    ],
  },
  {
    id         : 'proj-powertoys',
    name       : {
      en : 'PowerToys for OpenAI',
      fr : 'PowerToys pour OpenAI',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2023 – archived',
    summary    : {
      en :
        'Archived Chrome and Edge extension built when early GPT interfaces were still limited. ' +
        'It added chat history, voice-to-text, custom profiles, and search-provider integration ' +
        'that injected a ChatGPT-style box directly into Google and other search result pages.',
      fr :
        'Extension Chrome et Edge archivée, créée lorsque les premières interfaces GPT restaient ' +
        'limitées. Elle ajoutait historique de chat, voix vers texte, profils personnalisés et ' +
        'intégration moteurs de recherche injectant une boîte type ChatGPT directement dans Google ' +
        'et d\u2019autres pages de résultats.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Archived Chrome + Edge extension',
        fr : 'Extension Chrome + Edge archivée',
      },
      {
        en : 'Search-page GPT injection',
        fr : 'Injection GPT dans les résultats',
      },
      {
        en : 'Voice-to-text',
        fr : 'Voix vers texte',
      },
      {
        en : 'Custom prompt profiles',
        fr : 'Profils de prompts personnalisés',
      },
    ] satisfies Localized[],
    stack      : [
      'Browser Extension',
      'JavaScript',
      'OpenAI API',
      'Chrome',
      'Edge',
    ],
  },
  {
    id         : 'proj-microcoil',
    name       : {
      en : 'MicroCoil Calculator — Web & Mobile',
      fr : 'Calculateur MicroCoil — Web & mobile',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2014 – present',
    summary    : {
      en :
        'Community toolset for DIY vapers, combining a mobile app and mobile-first web app ' +
        'deployed across major French vaping e-commerce sites. It helped users calculate coil ' +
        'resistance and estimate liquid consumption while transitioning from smoking to vaping.',
      fr :
        'Outils communautaires pour vapoteurs DIY, combinant application mobile et application ' +
        'web mobile-first déployée sur de grands sites e-commerce français de vape. Ils aidaient ' +
        'à calculer la résistance de coils et estimer la consommation de liquide lors de la ' +
        'transition du tabac vers la vape.',
    } satisfies Localized,
    highlights : [
      {
        en : '50K+ monthly active web users',
        fr : '50K+ utilisateurs web actifs/mois',
      },
      {
        en : '10K+ Android installs',
        fr : '10K+ installations Android',
      },
      {
        en : 'Major French vape sites',
        fr : 'Grands sites vape français',
      },
    ] satisfies Localized[],
    stack      : [
      'Vue.js',
      'Cordova',
      'AngularJS',
      'Bootstrap',
    ],
  },
  {
    id         : 'proj-webmonitor',
    name       : {
      en : 'Web-Monitor.NET',
      fr : 'Web-Monitor.NET',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2014 – 2015',
    summary    : {
      en :
        'Full rewrite of the HealthMonitoring concept as a cloud-era testbed, integrating social ' +
        'SSO through LinkedIn, Google, Facebook, and Live, with hosting on Windows Azure, Azure SQL, ' +
        'and cloud messaging via Mandrill.',
      fr :
        'Réécriture complète du concept HealthMonitoring comme banc d\u2019essai cloud, intégrant SSO ' +
        'social via LinkedIn, Google, Facebook et Live, avec hébergement Windows Azure, Azure SQL ' +
        'et messagerie cloud Mandrill.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Cloud rewrite',
        fr : 'Réécriture cloud',
      },
      {
        en : 'Multi-provider SSO',
        fr : 'SSO multi-fournisseurs',
      },
      {
        en : 'Azure-hosted',
        fr : 'Hébergé sur Azure',
      },
    ] satisfies Localized[],
    stack      : [
      'AngularJS',
      'MVC5',
      'Bootstrap',
      'Azure',
      'Azure SQL',
    ],
  },
  {
    id         : 'proj-phantomui',
    name       : {
      en : 'PhantomUI — Web-to-PDF Converter',
      fr : 'PhantomUI — Convertisseur web vers PDF',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2015 – present',
    summary    : {
      en :
        'Desktop utility that converts local and remote web pages to PDF or image output, wrapping ' +
        'a modified and recompiled PhantomJS build with broad HTML5 and CSS3 rendering support.',
      fr :
        'Utilitaire desktop convertissant des pages web locales et distantes en PDF ou image, ' +
        'encapsulant un build PhantomJS modifié et recompilé avec un large support de rendu HTML5 ' +
        'et CSS3.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Local and remote page rendering',
        fr : 'Rendu pages locales et distantes',
      },
      {
        en : 'PDF and image output',
        fr : 'Sortie PDF et image',
      },
      {
        en : 'Modified PhantomJS build',
        fr : 'Build PhantomJS modifié',
      },
    ] satisfies Localized[],
    stack      : [
      'C#',
      'WPF',
      'PhantomJS',
    ],
    links      : [
      {
        label : 'GitHub',
        href  : 'https://github.com/itechnology/PhantomUI',
      },
    ],
  },
  {
    id         : 'proj-mario',
    name       : {
      en : 'jQuery Mario — Mobile Web Game POC',
      fr : 'jQuery Mario — POC jeu web mobile',
    } satisfies Localized,
    org        : {
      en : '123 Multimedia SA',
      fr : '123 Multimedia SA',
    } satisfies Localized,
    period     : '2011',
    summary    : {
      en :
        'Lightweight browser-game proof of concept built to evaluate alternatives to full game ' +
        'frameworks while exploring how to port a Flash game experience to the mobile web.',
      fr :
        'Preuve de concept de jeu navigateur léger pour évaluer des alternatives aux frameworks ' +
        'de jeu complets lors de l\u2019exploration du portage d\u2019une expérience Flash vers le web mobile.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Flash-to-mobile-web POC',
        fr : 'POC Flash vers web mobile',
      },
      {
        en : 'Lightweight game framework test',
        fr : 'Test framework jeu léger',
      },
    ] satisfies Localized[],
    stack      : ['jQuery'],
  },
] as const

export const experience = [
  {
    id       : 'exp-maser',
    company  : {
      en : 'Maser Engineering',
      fr : 'Maser Engineering',
    } satisfies Localized,
    role     : {
      en : 'Consultant — Data & IoT Integration',
      fr : 'Consultant — Intégration Data & IoT',
    } satisfies Localized,
    period   : 'Mar 2022 – Present',
    location : {
      en : 'France (Hybrid)',
      fr : 'France (Hybride)',
    } satisfies Localized,
    type     : {
      en : 'Permanent',
      fr : 'CDI',
    } satisfies Localized,
    summary  : {
      en :
        'Designing and optimizing industrial data workflows with progressive specialization ' +
        'in Airbus Skywise / Palantir Foundry for aerospace, energy, and industrial clients ' +
        'including Airbus, Safran, Hutchinson, Terega, SBM, and Nexess IoT.',
      fr :
        'Conception et optimisation de workflows de données industrielles avec spécialisation ' +
        'progressive sur Airbus Skywise / Palantir Foundry pour des clients de l\u2019aérospatiale, ' +
        'de l\u2019énergie et de l\u2019industrie, dont Airbus, Safran, Hutchinson, Terega, SBM et Nexess IoT.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Data collection & transformation — APIs, CSV, JSON, XML, IoT sensor feeds, log parsing',
        fr : 'Collecte & transformation de données — APIs, CSV, JSON, XML, flux capteurs IoT, parsing de logs',
      },
      {
        en : 'Workflow automation — no-code, low-code, and full-code (n8n, Make, Airtable, custom APIs)',
        fr : 'Automatisation de workflows — no-code, low-code et full-code (n8n, Make, Airtable, APIs custom)',
      },
      {
        en : 'Skywise / Foundry dataset integration, ontology modeling, and SQL & Spark pipelines',
        fr : 'Intégration de datasets Skywise / Foundry, modélisation d\u2019ontologies, et pipelines SQL & Spark',
      },
      {
        en : 'Slate dashboards for operational health, performance, and error monitoring',
        fr : 'Tableaux de bord Slate pour le suivi opérationnel, la performance et la surveillance d\u2019erreurs',
      },
      {
        en : 'Alerting & observability for anomaly and error-trend detection',
        fr : 'Alerting & observabilité pour la détection d\u2019anomalies et de tendances d\u2019erreurs',
      },
    ] satisfies Localized[],
    stack    : ['C#', 'PHP', 'Vue.js', 'Python', 'SQL', 'Skywise', 'Foundry'],
  },
  {
    id       : 'exp-independent',
    company  : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    role     : {
      en : 'Digital & Technological Consultant',
      fr : 'Consultant digital & technologique',
    } satisfies Localized,
    period   : '2019 – Present',
    location : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type     : {
      en : 'Freelance',
      fr : 'Freelance',
    } satisfies Localized,
    summary  : {
      en :
        'Helping entrepreneurs, start-ups, and SMEs analyze and realize their potential through ' +
        'marketing, technology, automation, and industrialization.',
      fr :
        'Accompagnement d\u2019entrepreneurs, de start-ups et de PME dans l\u2019analyse et la ' +
        'réalisation de leur potentiel grâce au marketing, à la technologie, à l\u2019automatisation ' +
        'et à l\u2019industrialisation.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Innovation management, feasibility studies, and market & competitive analysis',
        fr : 'Gestion de l\u2019innovation, études de faisabilité, et analyses de marché & concurrentielles',
      },
      {
        en : 'Full-stack delivery — front-end, back-office, web, mobile, and service architecture',
        fr : 'Livraison full-stack — front-end, back-office, web, mobile et architecture de services',
      },
      {
        en : 'DevOps automation, CI/CD, error & project management',
        fr : 'Automatisation DevOps, CI/CD, gestion des erreurs & de projets',
      },
      {
        en : 'Digital strategy, growth hacking, SEO/SEA, and user acquisition & retention',
        fr : 'Stratégie digitale, growth hacking, SEO/SEA, et acquisition & rétention utilisateurs',
      },
      {
        en : 'ROI, cost, risk, and technical-debt analysis using Scrum, Kanban, and Lean',
        fr : 'Analyse de ROI, coûts, risques et dette technique avec Scrum, Kanban et Lean',
      },
    ] satisfies Localized[],
    stack    : ['Agile Coach', 'Product Owner', 'Scrum', 'Kanban'],
  },
  {
    id       : 'exp-biocurae',
    company  : {
      en : 'BioCurae',
      fr : 'BioCurae',
    } satisfies Localized,
    role     : {
      en : 'Chief Product Officer',
      fr : 'Chief Product Officer',
    } satisfies Localized,
    period   : '2021',
    location : {
      en : 'Île-de-France',
      fr : 'Île-de-France',
    } satisfies Localized,
    type     : {
      en : 'Contract',
      fr : 'Contrat',
    } satisfies Localized,
    summary  : {
      en : 'Led product strategy for a HealthTech / NutriTech start-up focused on personalized care.',
      fr : 'Direction de la stratégie produit pour une start-up HealthTech / NutriTech spécialisée dans le soin personnalisé.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Defined product strategy for nootropics, nutraceutics, and nutrigenomics verticals',
        fr : 'Définition de la stratégie produit pour les verticales nootropiques, nutraceutiques et nutrigénomiques',
      },
      {
        en : 'Designed diagnostic & prescription automation workflows',
        fr : 'Conception de workflows d\u2019automatisation de diagnostic & de prescription',
      },
      {
        en : 'Shaped the personalized-care product roadmap',
        fr : 'Élaboration de la feuille de route produit de soins personnalisés',
      },
    ] satisfies Localized[],
  },
  {
    id       : 'exp-infomil',
    company  : {
      en : 'Infomil',
      fr : 'Infomil',
    } satisfies Localized,
    role     : {
      en : 'R&D Engineer',
      fr : 'Ingénieur R&D',
    } satisfies Localized,
    period   : 'May 2017 – Dec 2017',
    location : {
      en : 'Toulouse, France',
      fr : 'Toulouse, France',
    } satisfies Localized,
    type     : {
      en : 'Contract · 8 months',
      fr : 'Contrat · 8 mois',
    } satisfies Localized,
    summary  : {
      en : 'E.Leclerc\u2019s R&D IT Service (basically France\u2019s Walmart)',
      fr : 'Service IT R&D chez E.Leclerc',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Owned and evolved the Perforce source-control architecture used by 200 developers.',
        fr : 'Responsable de l\u2019architecture de gestion de sources Perforce utilisée par 200 développeurs.',
      },      
      {
        en : 'Audited and migrated the SCM architecture with operations and security teams',
        fr : 'Audit et migration de l\u2019architecture SCM avec les équipes opérations et sécurité',
      },
      {
        en : 'Modernized maintenance scripts from VBS to PowerShell\u202F5',
        fr : 'Modernisation des scripts de maintenance de VBS vers PowerShell\u202F5',
      },
      {
        en : 'Built WinForms plugins to streamline developer workflows',
        fr : 'Développement de plugins WinForms pour fluidifier les workflows développeurs',
      },
      {
        en : 'Evaluated TeamCity CI integration and authored an architecture evolution roadmap',
        fr : 'Évaluation de l\u2019intégration CI TeamCity et rédaction d\u2019une feuille de route d\u2019évolution d\u2019architecture',
      },
      {
        en : 'Conducted feasibility studies — emoji messaging POC, static analysis, OWASP pen testing',
        fr : 'Études de faisabilité — POC messagerie emoji, analyse statique, tests d\u2019intrusion OWASP',
      },
    ] satisfies Localized[],
    stack    : ['Perforce', 'PowerShell', 'C#', 'WinForms', 'TeamCity'],
  },
  {
    id       : 'exp-dao',
    company  : {
      en : 'dao & Co',
      fr : 'dao & Co',
    } satisfies Localized,
    role     : {
      en : 'Consultant / Full-Stack Developer',
      fr : 'Consultant / Développeur full-stack',
    } satisfies Localized,
    period   : 'Apr 2015 – Feb 2017',
    location : {
      en : 'Ramonville Saint-Agne, France',
      fr : 'Ramonville Saint-Agne, France',
    } satisfies Localized,
    type     : {
      en : 'Contract · 1 yr 11 mo',
      fr : 'Contrat · 1 an 11 mois',
    } satisfies Localized,
    summary  : {
      en :
        'Built personalized interfaces for e-learning platforms (MOOCs) used to train management ' +
        'and staff at major banks and insurance groups.',
      fr :
        'Développement d\u2019interfaces personnalisées pour des plateformes e-learning (MOOCs) ' +
        'utilisées pour la formation des cadres et du personnel de grands groupes bancaires et d\u2019assurance.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Piloted cloud migration — Mailchimp, Mandrill, AWS S3, Jira/Confluence, BitBucket',
        fr : 'Pilotage de la migration cloud — Mailchimp, Mandrill, AWS S3, Jira/Confluence, BitBucket',
      },
      {
        en : 'Automated mailing workflows via web and mobile API integrations',
        fr : 'Automatisation des workflows d\u2019emailing via des intégrations API web et mobile',
      },
      {
        en : 'Rolled out Agile workflow with integrated bug tracking and knowledge-base sharing',
        fr : 'Déploiement d\u2019un workflow Agile avec suivi de bugs intégré et partage de base de connaissances',
      },
    ] satisfies Localized[],
  },
  {
    id       : 'exp-prestalia',
    company  : {
      en : 'Prestalia',
      fr : 'Prestalia',
    } satisfies Localized,
    role     : {
      en : 'Web Architect',
      fr : 'Architecte web',
    } satisfies Localized,
    period   : 'Mar 2014 – Jul 2014',
    location : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type     : {
      en : 'Contract · 5 months',
      fr : 'Contrat · 5 mois',
    } satisfies Localized,
    summary  : {
      en : 'Reviewed and enhanced the company\u2019s technical infrastructure and development workflows.',
      fr : 'Revue et amélioration de l\u2019infrastructure technique et des workflows de développement de l\u2019entreprise.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Migrated projects to latest Microsoft stack, unblocking development and accelerating delivery',
        fr : 'Migration des projets vers la dernière stack Microsoft, débloquant le développement et accélérant les livraisons',
      },
      {
        en : 'Decoupled project dependencies to simplify deployments and reduce errors',
        fr : 'Découplage des dépendances projets pour simplifier les déploiements et réduire les erreurs',
      },
      {
        en : 'Consolidated DNS to AWS Route\u202F53 and optimized deployment pipelines',
        fr : 'Consolidation DNS vers AWS Route\u202F53 et optimisation des pipelines de déploiement',
      },
    ] satisfies Localized[],
    stack    : ['C#', '.NET', 'HTML5', 'CSS3', 'JavaScript', 'jQuery'],
  },
  {
    id        : 'exp-index',
    company   : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    role      : {
      en : 'Senior Full-Stack Developer / Tech Lead',
      fr : 'Développeur full-stack senior / Tech Lead',
    } satisfies Localized,
    period    : '2008 – Nov 2013',
    location  : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type      : {
      en : 'Permanent · ~6 years',
      fr : 'CDI · ~6 ans',
    } satisfies Localized,
    summary   : {
      en : 'Collaborated across design, development, IT, and marketing on high-traffic community products.',
      fr : 'Collaboration transversale entre design, développement, IT et marketing sur des produits communautaires à fort trafic.',
    } satisfies Localized,
    highlight : {
      en : '6M uniques/mo · 400M req/day',
      fr : '6M visiteurs uniques/mois · 400M req/jour',
    } satisfies Localized,
    bullets   : [
      {
        en : 'Maintained and evolved chat rooms, web apps, and multimedia portals — 6M unique visitors/month',
        fr : 'Maintenance et évolution de salons de chat, applications web et portails multimédias — 6M visiteurs uniques/mois',
      },
      {
        en : 'Designed a generic ad-proxy server — +20\u202F% ad revenue, zero developer intervention',
        fr : 'Conception d\u2019un serveur proxy publicitaire générique — +20\u202F% de revenus publicitaires, zéro intervention développeur',
      },
      {
        en : 'Built responsive ad delivery with device detection — +30\u202F% click-through rate',
        fr : 'Mise en place d\u2019une diffusion publicitaire responsive avec détection d\u2019appareil — +30\u202F% de taux de clic',
      },
      {
        en : 'Created an error-tracking tool cutting bug resolution from days to minutes — 5× fewer errors',
        fr : 'Création d\u2019un outil de suivi d\u2019erreurs réduisant la résolution de bugs de jours à minutes — 5× moins d\u2019erreurs',
      },
      {
        en : 'Elaborated social media strategy with SSO and social sharing — +50\u202F% revenue in 6 months',
        fr : 'Élaboration d\u2019une stratégie réseaux sociaux avec SSO et partage social — +50\u202F% de revenus en 6 mois',
      },
    ] satisfies Localized[],
    stack     : ['C#', '.NET', 'JavaScript', 'SEO', 'Google Analytics'],
  },
  {
    id       : 'exp-celad',
    company  : {
      en : 'CELAD',
      fr : 'CELAD',
    } satisfies Localized,
    role     : {
      en : 'Senior Full-Stack Developer',
      fr : 'Développeur full-stack senior',
    } satisfies Localized,
    period   : '2007 – 2008',
    location : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type     : {
      en : 'Contract · 1 year',
      fr : 'Contrat · 1 an',
    } satisfies Localized,
    summary  : {
      en : 'Led the technical and design restructuring of internationalized white-label web chats.',
      fr : 'Direction de la restructuration technique et design de chats web en marque blanche internationalisés.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Architected a skinnable, internationalized, responsive web app (IE\u202F6+)',
        fr : 'Architecture d\u2019une application web responsive, internationalisée et personnalisable (IE\u202F6+)',
      },
      {
        en : 'Halved white-label deployment time while delivering a modern, translatable product',
        fr : 'Réduction de moitié du temps de déploiement en marque blanche avec un produit moderne et traduisible',
      },
      {
        en : 'Designed a custom JSON protocol (JsonRaw) — 30–40\u202F% bandwidth savings',
        fr : 'Conception d\u2019un protocole JSON personnalisé (JsonRaw) — 30–40\u202F% d\u2019économie de bande passante',
      },
    ] satisfies Localized[],
    stack    : ['C#', '.NET', 'jQuery', 'JavaScript', 'CSS'],
  },
  {
    id       : 'exp-123mm',
    company  : {
      en : '123 Multimedia SA',
      fr : '123 Multimedia SA',
    } satisfies Localized,
    role     : {
      en : 'Full-Stack Developer / Integrator',
      fr : 'Développeur full-stack / Intégrateur',
    } satisfies Localized,
    period   : '2003 – 2007',
    location : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type     : {
      en : 'Permanent · 4 years',
      fr : 'CDI · 4 ans',
    } satisfies Localized,
    summary  : {
      en :
        'Built and managed community products (B2B/B2C) — chats, blogs, and portals — under ' +
        'own label, white label, and affiliation models.',
      fr :
        'Développement et gestion de produits communautaires (B2B/B2C) — chats, blogs et ' +
        'portails — en marque propre, marque blanche et modèles d\u2019affiliation.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Deployed internal ad servers — 10× increase in ads served and revenue',
        fr : 'Déploiement de serveurs publicitaires internes — 10× plus de pubs servies et de revenus',
      },
      {
        en : 'Integrated monetization services — ad networks, credit card, SMS, micro-payment, paywall',
        fr : 'Intégration de services de monétisation — régies publicitaires, carte bancaire, SMS, micro-paiement, paywall',
      },
      {
        en : 'Customized products for TF1, Skyrock, NRJ Group, M6, SFR, Orange, Microsoft, Pepsi, and more',
        fr : 'Personnalisation de produits pour TF1, Skyrock, NRJ Group, M6, SFR, Orange, Microsoft, Pepsi, et plus',
      },
    ] satisfies Localized[],
    stack    : ['C#', '.NET', 'JavaScript', 'CSS', 'HTML'],
  },
  {
    id       : 'exp-indie',
    company  : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    role     : {
      en : 'Product Owner / Full-Stack Developer',
      fr : 'Product Owner / Développeur full-stack',
    } satisfies Localized,
    period   : '1998 – 2003',
    location : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type     : {
      en : 'Freelance · 5 years',
      fr : 'Freelance · 5 ans',
    } satisfies Localized,
    summary  : {
      en : 'Conceived and managed community-oriented web products from the ground up.',
      fr : 'Conception et gestion de produits web communautaires de zéro.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Founded 2 websites — a video-game fan site and a content-creator directory with ad monetization',
        fr : 'Création de 2 sites web — un site de fans de jeux vidéo et un annuaire de créateurs de contenu avec monétisation publicitaire',
      },
      {
        en : 'Managed a CMS product with plugins, marketplace, developer community, and affiliates',
        fr : 'Gestion d\u2019un produit CMS avec plugins, marketplace, communauté de développeurs et affiliés',
      },
      {
        en : 'Built a website promotion tool with traffic generation, affiliate management, and white-label resale',
        fr : 'Développement d\u2019un outil de promotion de sites web avec génération de trafic, gestion d\u2019affiliés et revente en marque blanche',
      },
    ] satisfies Localized[],
    stack    : ['PHP', 'JavaScript', 'CSS', 'HTML', 'SEO'],
  },
  {
    id       : 'exp-bo',
    company  : {
      en : 'Bang & Olufsen',
      fr : 'Bang & Olufsen',
    } satisfies Localized,
    role     : {
      en : 'Electronics Technician',
      fr : 'Technicien en électronique',
    } satisfies Localized,
    period   : '1996 – 1997',
    location : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type     : {
      en : '1 year',
      fr : '1 an',
    } satisfies Localized,
    summary  : {
      en : 'Repair and installation of hi-tech multimedia equipment (TV/HI-FI) for Loewe and Bang & Olufsen.',
      fr : 'Réparation et installation d\u2019équipements multimédias haut de gamme (TV/HI-FI) pour Loewe et Bang & Olufsen.',
    } satisfies Localized,
    bullets  : [] satisfies Localized[],
  },
  {
    id       : 'exp-deva',
    company  : {
      en : 'Bureau d\u2019Étude D.E.V.A.',
      fr : 'Bureau d\u2019Étude D.E.V.A.',
    } satisfies Localized,
    role     : {
      en : 'Electronics Assembly Technician',
      fr : 'Technicien d\u2019assemblage électronique',
    } satisfies Localized,
    period   : '1994 – 1996',
    location : {
      en : 'Greater Toulouse Area',
      fr : 'Grand Toulouse',
    } satisfies Localized,
    type     : {
      en : '2 years',
      fr : '2 ans',
    } satisfies Localized,
    summary  : {
      en :
        'Circuit-board and parts assembly for the first fully digital photo booths using CCD cameras ' +
        'and color thermal printers — deployed to shopping centers, public spaces, and professional studios.',
      fr :
        'Assemblage de circuits imprimés et de composants pour les premiers photobooths entièrement numériques ' +
        'utilisant des caméras CCD et des imprimantes thermiques couleur\u202F— déployés dans des centres ' +
        'commerciaux, espaces publics et studios professionnels.',
    } satisfies Localized,
    bullets  : [] satisfies Localized[],
  },
] as const

export const easterEgg = {
  title : {
    en : '🎮 GeoWars',
    fr : '🎮 GeoWars',
  } satisfies Localized,
  body  : {
    en : 'Mouse to steer (distance = thrust) · Click to fire · Space to pause.',
    fr : 'Souris pour diriger (distance = poussée) · Clic pour tirer · Espace pour pause.',
  } satisfies Localized,
} as const
