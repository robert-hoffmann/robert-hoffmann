import type { Localized } from '../../types/desktop'
import type { MessageCatalog } from '../interface'

// #region Messages
export const projectsMessages = {
  'projects.openGalleryImage' : {
    en : 'Open gallery image for {title}',
    fr : 'Ouvrir l’image galerie pour {title}',
  },
} satisfies MessageCatalog
// #endregion Messages

// #region Content
const projectRecords = [
  {
    id         : 'proj-tmip-scheduler',
    name       : {
      en : 'TMIP Scheduler: Aerospace Data Orchestration',
      fr : 'TMIP Scheduler: Orchestration de données aéronautiques',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for Airbus',
      fr : 'Maser Engineering pour Airbus',
    } satisfies Localized,
    period     : '2025 – present',
    summary    : {
      en :
        'Central orchestration service for aerospace smart-cabinet operations, synchronizing ' +
        'Nexess cabinet servers, Google Workspace, Skywise datasets, and internal management ' +
        'tools while modernizing an undocumented, untyped legacy Python codebase into typed, observable, ' +
        'production-grade infrastructure for 16 Airbus assembly plants.',
      fr :
        'Service central d\u2019orchestration pour les opérations aéronautiques d\u2019armoires connectées, ' +
        'synchronisant les serveurs Nexess, Google Workspace, les datasets Skywise et les ' +
        'outils de gestion internes tout en modernisant une base Python legacy non documentée ' +
        'et non typée vers une infrastructure typée, observable et exploitable en production ' +
        'pour 16 usines d\u2019assemblage Airbus.',
    } satisfies Localized,
    highlights : [
      {
        en : '30K+ jobs/day',
        fr : '30K+ jobs/jour',
      },
      {
        en : '3-100 calls/job',
        fr : '3-100 appels/job',
      },
      {
        en : '16 plants',
        fr : '16 usines',
      },
      {
        en : '~1,000 users',
        fr : '~1 000 utilisateurs',
      },
    ] satisfies Localized[],
    stack      : [
      'Python',
      'FastAPI',
      'aiohttp',
      'Pydantic',
      'glom',
      'uv',
      'Ruff',
      'Pyright',
      'Windows Server',
      'Skywise',
      'Google Workspace',
      'VueJS',
    ],
  },
  {
    id         : 'proj-uncle-bob',
    name       : {
      en : 'Uncle Bob: Agentic AI Workflow System',
      fr : 'Uncle Bob: Système de workflow IA agentique',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2026 – present',
    summary    : {
      en :
        'Portable skill system for AI coding agents, structured as a human-owned delivery model ' +
        'for quality, workflow, governance, authoring, and specialist implementation guidance. ' +
        'It turns Agile, Scrum, Kanban, Shape Up, and AI-evaluation ideas into practical controls: ' +
        'lane selection, durable artifacts, WIP limits, readiness gates, bounded exceptions, ' +
        'evidence routing, docs synchronization, and deterministic validation scripts.',
      fr :
        'Système de skills portable pour agents de code IA, structuré comme un modèle de livraison ' +
        'contrôlé humainement pour qualité, workflow, gouvernance, authoring et guidage spécialiste ' +
        'd\u2019implémentation. Il transforme Agile, Scrum, Kanban, Shape Up et les pratiques ' +
        'd\u2019évaluation IA en contrôles concrets : choix de lane, artefacts durables, limites WIP, ' +
        'gates de readiness, exceptions bornées, routage d\u2019évidence, synchronisation documentaire ' +
        'et scripts de validation déterministes.',
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
      'AI-Directed Delivery',
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
      en : 'TMIP Logger: QoS & KPI Observability',
      fr : 'TMIP Logger: Observabilité QoS & KPI',
    } satisfies Localized,
    org        : {
      en : 'Maser Engineering for Airbus',
      fr : 'Maser Engineering pour Airbus',
    } satisfies Localized,
    period     : '2025 – present',
    summary    : {
      en :
        'Structured logging and observability layer for TMIP operations, turning raw job ' +
        'events into searchable SQLite records, a VueJS inspection UI, Skywise dashboard ' +
        'feeds, and automated alerts for error spikes, job health, and plant-level impact.',
      fr :
        'Couche de logging structuré et d\u2019observabilité pour les opérations TMIP, transformant ' +
        'les événements bruts des jobs en enregistrements SQLite consultables, interface VueJS, ' +
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
      'VueJS',
      'SQLite',
      'CSV',
      'Skywise',
      'Structured Logging',
      'REST API',
    ],
  },
  {
    id         : 'proj-sbm-compliance',
    imageId    : 9,
    name       : {
      en : 'SBM / Ter\u00e9ga: Onboarding & Certification Tracking',
      fr : 'SBM / Ter\u00e9ga: Suivi onboarding & certifications',
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
    imageId    : 6,
    name       : {
      en : 'i-technology.net: AI-Directed Desktop Portfolio',
      fr : 'i-technology.net: Portfolio desktop piloté par IA',
    } satisfies Localized,
    org        : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period     : '2026 – present',
    summary    : {
      en :
        'Recruiter-facing portfolio and AI-directed delivery case study that turns a resume into ' +
        'an interactive desktop product. Product direction, architecture, acceptance criteria, review, ' +
        'tests, documentation sync, and quality gates stayed human-owned while agents provided ' +
        'implementation throughput across the macOS-style shell, typed app registry, window manager, ' +
        'async-loaded mini apps, bilingual content, mobile shell, prerendered SEO, structured metadata, ' +
        'and measured Google PageSpeed scores.',
      fr :
        'Portfolio orienté recruteurs et cas d\u2019étude de livraison pilotée par IA transformant un ' +
        'CV en produit interactif style desktop. Direction produit, architecture, critères ' +
        'd\u2019acceptation, revue, tests, synchronisation documentaire et quality gates restaient ' +
        'contrôlés humainement pendant que les agents apportaient du débit d\u2019implémentation ' +
        'sur le shell style macOS, le registre d\u2019apps typé, le gestionnaire de fenêtres, les ' +
        'mini-apps async, le contenu bilingue, le shell mobile, le SEO prérendu, les données ' +
        'structurées et les scores Google PageSpeed mesurés.',
    } satisfies Localized,
    highlights : [
      {
        en : 'AI-directed case study',
        fr : 'Cas de livraison pilotée par IA',
      },
      {
        en : 'Desktop + mobile UX',
        fr : 'UX desktop + mobile',
      },
      {
        en : 'Google PageSpeed 100/99',
        fr : 'Google PageSpeed 100/99',
      },
      {
        en : '100 Accessibility + SEO',
        fr : '100 Accessibilité + SEO',
      },
    ] satisfies Localized[],
    stack      : [
      'VueJS',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Three.js',
      'vite-prerender-plugin',
      'Sharp',
      'AI-Directed Delivery',
    ],
    links      : [
      {
        label : 'Live site',
        href  : 'https://i-technology.net/',
      },
      {
        label : 'Mobile PageSpeed',
        href  : 'https://pagespeed.web.dev/analysis/https-i-technology-net/vahahakfk6?form_factor=mobile',
      },
      {
        label : 'Desktop PageSpeed',
        href  : 'https://pagespeed.web.dev/analysis/https-i-technology-net/vahahakfk6?form_factor=desktop',
      },
    ],
  },
  {
    id         : 'proj-parallax-designer',
    imageId    : 7,
    name       : {
      en : 'Parallax Designer: AI-Directed Visual Builder',
      fr : 'Parallax Designer: Builder visuel piloté par IA',
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
        'and an AI-directed documentation pipeline syncing app, user, and API docs into a VitePress site.',
      fr :
        'Éditeur visuel navigateur pour concevoir des scènes parallax multi-couches comme le ' +
        'système de fond du portfolio. Il propose preview temps réel, contrôles géométrie et ' +
        'mouvement par couche, stockage local d\u2019assets, presets, validation de schéma, export ' +
        'HTML runtime autonome et pipeline documentaire piloté par IA synchronisant app, docs utilisateur ' +
        'et API vers un site VitePress.',
    } satisfies Localized,
    highlights : [
      {
        en : 'AI-directed build',
        fr : 'Build piloté par IA',
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
      'AI-Directed Delivery',
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
      en : 'Hutchinson: Digital Work Instructions',
      fr : 'Hutchinson: Instructions de travail digitales',
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
        en : '10 Airtable contributors',
        fr : '10 contributeurs Airtable',
      },
    ] satisfies Localized[],
    stack      : [
      'Quasar',
      'VueJS',
      'Airtable',
      'MySQL',
      'C#',
      'PHP',
      'Offline UX',
    ],
  },
  {
    id         : 'proj-chatapp',
    imageId    : 1,
    name       : {
      en : 'tchatche.com: Media & Community Ecosystem',
      fr : 'tchatche.com: Écosystème média & communautaire',
    } satisfies Localized,
    org        : {
      en : '123 Multimedia / Index Multimedia',
      fr : '123 Multimedia / Index Multimedia',
    } satisfies Localized,
    period     : '2004 – 2013',
    summary    : {
      en :
        'Lead developer and technical owner for high-traffic white-label real-time chat products ' +
        'inside the broader tchatche.com media ecosystem, spanning frontend architecture, backend ' +
        'APIs, caching, moderation, browser compatibility, performance, responsive versions, ' +
        'Facebook integration, location features, social sharing, and 13-language i18n across ' +
        'the main site, user blogs, and dedicated chat apps.',
      fr :
        'Lead developer et responsable technique de produits de chat temps réel marque blanche ' +
        'à fort trafic au sein de l\u2019écosystème média tchatche.com, couvrant architecture ' +
        'frontend, APIs backend, cache, modération, compatibilité navigateur, performance, ' +
        'versions responsive, intégration Facebook, fonctions géolocalisées, partage social ' +
        'et i18n en 13 langues sur le site principal, les blogs utilisateurs et les apps chat ' +
        'dédiées.',
    } satisfies Localized,
    highlights : [
      {
        en : '600M views/mo',
        fr : '600M vues/mois',
      },
      {
        en : '13-lang i18n',
        fr : 'i18n en 13 langues',
      },
      {
        en : '$300K/mo',
        fr : '300K$/mois',
      },
      {
        en : '400M req/day sites',
        fr : '400M req/jour sites',
      },
      {
        en : '~125K req/s chat',
        fr : '~125K req/s chat',
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
      en : 'Ad Proxy: Ad-Distribution Server',
      fr : 'Ad Proxy: Serveur de distribution publicitaire',
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
        en : '3B+ ads/mo',
        fr : '3Md+ pubs/mois',
      },
      {
        en : '+20% ad revenue',
        fr : '+20% revenus publicitaires',
      },
      {
        en : '+30% CTR',
        fr : '+30% taux de clic',
      },
      {
        en : '~5% CPU',
        fr : '~5% CPU',
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
      en : 'T4ResX: Localization Tooling',
      fr : 'T4ResX: Outillage de localisation',
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
      en : 'HeadJS: Open-Source JS Library',
      fr : 'HeadJS: Bibliothèque JS open source',
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
      'VueJS',
      'Dexie',
      'IndexedDB',
      'Google Maps',
      'PDF',
    ],
    links      : [
      {
        label : 'Maser Engineering: Pole Maintenance',
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
      'VueJS',
      'Symfony',
      'Live Components',
      'Bootstrap',
      'MariaDB',
      'PDF',
      'CSV',
    ],
    links      : [
      {
        label : 'Maser Engineering: Pole Conseil',
        href  : 'https://maser-engineering.com/pole-conseil/',
      }
    ],
  },
  {
    id         : 'proj-maser-academy-inventory',
    name       : {
      en : 'Maser Academy: Course Inventory Planning',
      fr : 'Maser Academy: Planification d\u2019inventaire formation',
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
      en : 'Roland-Garros: Staff Navigation PWA',
      fr : 'Roland-Garros: PWA de guidage du personnel',
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
      en : 'FindUnusedFiles: Visual Studio Extension',
      fr : 'FindUnusedFiles: Extension Visual Studio',
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
      en : 'HealthMonitoring: Error Tracking',
      fr : 'HealthMonitoring: Suivi d\u2019erreurs',
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
        en : 'Days-to-minutes fixes',
        fr : 'Résolution de jours à minutes',
      },
      {
        en : 'SQL/IIS/.NET/client errors',
        fr : 'Erreurs SQL/IIS/.NET/client',
      },
      {
        en : 'Stack-trace back office',
        fr : 'Back-office stack traces',
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
      en : 'JsonRaw: Lightweight JSON Protocol',
      fr : 'JsonRaw: Protocole JSON léger',
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
        en : 'Production chat traffic',
        fr : 'Trafic chat en production',
      },
      {
        en : '43-51% smaller payloads',
        fr : 'Payloads réduits de 43-51%',
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
        en : 'Chrome + Edge extension',
        fr : 'Extension Chrome + Edge',
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
      en : 'MicroCoil Calculator: Web & Mobile',
      fr : 'Calculateur MicroCoil: Web & mobile',
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
      'VueJS',
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
      en : 'PhantomUI: Web-to-PDF Converter',
      fr : 'PhantomUI: Convertisseur web vers PDF',
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
        en : 'Local/remote rendering',
        fr : 'Rendu local/distant',
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
      en : 'jQuery Mario: Nicky Larson POC',
      fr : 'jQuery Mario: POC Nicky Larson',
    } satisfies Localized,
    org        : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period     : '2011',
    summary    : {
      en :
        'Lightweight browser-game proof of concept built to test whether a Flash game from ' +
        'the Nicky Larson franchise could be ported to the web with a jQuery-based implementation.',
      fr :
        'Preuve de concept de jeu navigateur léger pour tester le portage web d\u2019un jeu Flash ' +
        'de la franchise Nicky Larson avec une implémentation basée sur jQuery.',
    } satisfies Localized,
    highlights : [
      {
        en : 'Nicky Larson Flash port POC',
        fr : 'POC portage Flash Nicky Larson',
      },
      {
        en : 'jQuery browser-game prototype',
        fr : 'Prototype jeu navigateur jQuery',
      },
    ] satisfies Localized[],
    stack      : ['jQuery'],
    links      : [
      {
        label : 'Demo',
        href  : 'https://itechnology.github.io/jQuery.Mario/#game',
      },
      {
        label : 'GitHub',
        href  : 'https://github.com/itechnology/jQuery.Mario',
      },
    ],
  },
] as const

export type Project = (typeof projectRecords)[number]
export type ProjectId = Project['id']

const projectDisplayOrder = [
  'proj-chatapp',
  'proj-adproxy',
  'proj-tmip-scheduler',
  'proj-tmip-logger',
  'proj-uncle-bob',
  'proj-desktop-portfolio',
  'proj-parallax-designer',
  'proj-hutchinson-work-instructions',
  'proj-sbm-compliance',
  'proj-headjs',
  'proj-t4resx',
  'proj-findunused',
  'proj-wind-maintenance',
  'proj-attendance-billing',
  'proj-maser-academy-inventory',
  'proj-roland-garros-navigation',
  'proj-public-health-analytics',
  'proj-healthmon',
  'proj-jsonr',
  'proj-powertoys',
  'proj-microcoil',
  'proj-webmonitor',
  'proj-phantomui',
  'proj-mario',
] satisfies readonly ProjectId[]

const projectOrder = new Map<ProjectId, number>(
  projectDisplayOrder.map((id, index) => [id, index] as const),
)

export const projects = [...projectRecords].sort(
  (left, right) => (projectOrder.get(left.id) ?? projectRecords.length) -
    (projectOrder.get(right.id) ?? projectRecords.length),
)
// #endregion Content
