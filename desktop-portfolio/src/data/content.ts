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
    id        : 'proj-chatapp',
    name      : {
      en : 'tchatche.com — Real-Time Chat Platform',
      fr : 'tchatche.com — Plateforme de chat temps réel',
    } satisfies Localized,
    org       : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period    : '2004 – 2013',
    summary   : {
      en :
        'Engineered a high-scale real-time chat platform, also white-labeled for ' +
        'major French media brands. Fluid and responsive across desktop (IE\u202F7+), ' +
        'tablet, and mobile with a skinnable, localizable UI shipping at just 200\u202FKB ' +
        'and a PageSpeed score of 97/100.',
      fr :
        'Conception d\u2019une plateforme de chat temps réel à grande échelle, également ' +
        'déclinée en marque blanche pour de grands médias français. Interface fluide et ' +
        'responsive sur desktop (IE\u202F7+), tablette et mobile, personnalisable et ' +
        'localisable, ne pesant que 200\u202FKo avec un score PageSpeed de 97/100.',
    } satisfies Localized,
    highlight : {
      en : '600M page-views/mo · 400M daily requests',
      fr : '600M pages vues/mois · 400M requêtes/jour',
    } satisfies Localized,
    stack     : ['.NET MVC5', 'WebAPI 2', '.NET 4.5', 'CSS3', 'HTML5', 'LESS', 'jsRender'],
  },
  {
    id        : 'proj-adproxy',
    name      : {
      en : 'Ad Proxy — Ad-Distribution Server',
      fr : 'Ad Proxy — Serveur de distribution publicitaire',
    } satisfies Localized,
    org       : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period    : '2010 – 2013',
    summary   : {
      en :
        'Built a generic ad-distribution server that eliminated per-site code changes ' +
        'when onboarding new ad agencies. Auto-detected format, site, and agency; ' +
        'delivered audience-targeted ads by region, age, and gender; and load-balanced ' +
        'delivery based on agency performance.',
      fr :
        'Développement d\u2019un serveur générique de distribution publicitaire supprimant ' +
        'les modifications de code par site lors de l\u2019intégration de nouvelles régies. ' +
        'Détection automatique du format, du site et de la régie\u202F; diffusion de publicités ' +
        'ciblées par région, âge et sexe\u202F; répartition de charge basée sur les performances ' +
        'de chaque régie.',
    } satisfies Localized,
    highlight : {
      en : '3B+ ads served/mo · ~5\u202F% CPU on 2 servers',
      fr : '3Md+ pubs servies/mois · ~5\u202F% CPU sur 2 serveurs',
    } satisfies Localized,
    stack     : ['ASP.NET 4'],
  },
  {
    id        : 'proj-headjs',
    name      : {
      en : 'HeadJS — Open-Source JS Library',
      fr : 'HeadJS — Bibliothèque JS open source',
    } satisfies Localized,
    org       : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period    : '2011 – 2014',
    summary   : {
      en :
        'Co-maintained a popular multi-purpose JavaScript library providing responsive-design ' +
        'polyfills for older browsers (IE\u202F6+), on-demand script and resource loading, ' +
        'and Modernizr-style browser feature detection. Used on high-traffic websites worldwide.',
      fr :
        'Co-maintenance d\u2019une bibliothèque JavaScript polyvalente populaire fournissant des ' +
        'polyfills responsive design pour les anciens navigateurs (IE\u202F6+), le chargement ' +
        'de scripts et ressources à la demande, et la détection de fonctionnalités navigateur ' +
        'de type Modernizr. Utilisée sur des sites à fort trafic dans le monde entier.',
    } satisfies Localized,
    highlight : {
      en : '4K+ GitHub stars · 400+ forks · ~200 dependents',
      fr : '4K+ étoiles GitHub · 400+ forks · ~200 dépendants',
    } satisfies Localized,
    stack     : ['JavaScript'],
    links     : [
      { label : 'GitHub', href : 'https://github.com/headjs/headjs' },
    ],
  },
  {
    id        : 'proj-powertoys',
    name      : {
      en : 'PowerToys for OpenAI',
      fr : 'PowerToys pour OpenAI',
    } satisfies Localized,
    org       : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period    : '2023 – present',
    summary   : {
      en :
        'Browser extension that embeds ChatGPT directly into search-engine results, ' +
        'offering capabilities beyond the paid subscription tier. Features prompt ' +
        'engineering via profile management, context menus on any website for streamlined ' +
        'research, a built-in writing assistant, and BYO API key support for full ' +
        'functionality at a fraction of the subscription cost.',
      fr :
        'Extension navigateur intégrant ChatGPT directement dans les résultats de recherche, ' +
        'offrant des fonctionnalités dépassant l\u2019abonnement payant. Inclut l\u2019ingénierie de ' +
        'prompts via la gestion de profils, des menus contextuels sur tout site web pour ' +
        'faciliter la recherche, un assistant de rédaction intégré, et le support BYO API key ' +
        'pour des fonctionnalités complètes à une fraction du coût d\u2019abonnement.',
    } satisfies Localized,
    stack     : ['Browser Extension', 'JavaScript', 'OpenAI API'],
  },
  {
    id        : 'proj-stats-drees',
    name      : {
      en : 'Stats DREES — France',
      fr : 'Stats DREES — France',
    } satisfies Localized,
    org       : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period    : '2021 – present',
    summary   : {
      en :
        'Interactive dashboard consuming the French government DREES public API to ' +
        'visualize COVID-19 and vaccination data — including cases, hospitalizations, ' +
        'ICU patients, and deaths. Built comparative views by vaccination status and ' +
        'causality with trend analysis of efficacy and risk over time.',
      fr :
        'Tableau de bord interactif consommant l\u2019API publique DREES du gouvernement français ' +
        'pour visualiser les données COVID-19 et vaccinales\u202F— cas, hospitalisations, ' +
        'patients en réanimation et décès. Vues comparatives par statut vaccinal et ' +
        'causalité avec analyse de tendances d\u2019efficacité et de risque dans le temps.',
    } satisfies Localized,
    stack     : ['Power BI'],
  },
  {
    id        : 'proj-stats-covid',
    name      : {
      en : 'Stats COVID — France',
      fr : 'Stats COVID — France',
    } satisfies Localized,
    org       : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period    : '2021 – present',
    summary   : {
      en :
        'Comprehensive COVID-19 dashboard with interactive slicing by date range, ' +
        'age range, and percentage visualization. Covers cases, tests, positivity rate, ' +
        'hospitalizations, ICU occupancy, multi-dose vaccinations, deaths, and ' +
        'demographic breakdowns.',
      fr :
        'Tableau de bord COVID-19 complet avec découpage interactif par plage de dates, ' +
        'tranche d\u2019âge et visualisation en pourcentage. Couvre les cas, tests, taux de ' +
        'positivité, hospitalisations, occupation en réanimation, vaccinations multi-doses, ' +
        'décès et ventilations démographiques.',
    } satisfies Localized,
    stack     : ['Power BI'],
  },
  {
    id        : 'proj-microcoil-mobile',
    name      : {
      en : 'MicroCoil Calculator (Mobile)',
      fr : 'Calculateur MicroCoil (Mobile)',
    } satisfies Localized,
    org       : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period    : '2017 – present',
    summary   : {
      en :
        'Mobile app that helps DIY vapers calculate coil resistance for electronic ' +
        'cigarettes — simple, accurate, and purpose-built for the community.',
      fr :
        'Application mobile aidant les vapoteurs DIY à calculer la résistance de coils ' +
        'pour cigarettes électroniques\u202F— simple, précise et conçue pour la communauté.',
    } satisfies Localized,
    highlight : {
      en : '10K+ installs on Android',
      fr : '10K+ installations sur Android',
    } satisfies Localized,
    stack     : ['Vue.js', 'Cordova'],
  },
  {
    id        : 'proj-microcoil-web',
    name      : {
      en : 'Micro-Coil Calculator · Vapez.FR',
      fr : 'Calculateur Micro-Coil · Vapez.FR',
    } satisfies Localized,
    org       : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period    : '2014 – 2016',
    summary   : {
      en :
        'Mobile-first web app deployed across major French vaping e-commerce sites. ' +
        'Included a liquid-consumption calculator for smokers transitioning to vaping ' +
        'and a coil resistance calculator for DIY users.',
      fr :
        'Application web mobile-first déployée sur les principaux sites e-commerce de ' +
        'vape en France. Incluait un calculateur de consommation de liquide pour les ' +
        'fumeurs en transition vers la vape et un calculateur de résistance de coils ' +
        'pour les utilisateurs DIY.',
    } satisfies Localized,
    highlight : {
      en : '50K+ monthly active users',
      fr : '50K+ utilisateurs actifs mensuels',
    } satisfies Localized,
    stack     : ['AngularJS', 'Bootstrap'],
  },
  {
    id        : 'proj-findunused',
    name      : {
      en : 'FindUnusedFiles — VS Extension',
      fr : 'FindUnusedFiles — Extension VS',
    } satisfies Localized,
    org       : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period    : '2013 – 2015',
    summary   : {
      en :
        'Visual Studio add-in and standalone app that scans VS solutions and website ' +
        'projects to surface unused resources — images, scripts, stylesheets, and more.',
      fr :
        'Add-in Visual Studio et application autonome analysant les solutions VS et les ' +
        'projets web pour identifier les ressources inutilisées\u202F— images, scripts, ' +
        'feuilles de style, etc.',
    } satisfies Localized,
    highlight : {
      en : '11K+ installs on VS Marketplace',
      fr : '11K+ installations sur VS Marketplace',
    } satisfies Localized,
    stack     : ['C#', 'Visual Studio SDK'],
  },
  {
    id        : 'proj-phantomui',
    name      : {
      en : 'PhantomUI — Web-to-PDF Converter',
      fr : 'PhantomUI — Convertisseur Web vers PDF',
    } satisfies Localized,
    org       : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period    : '2015 – present',
    summary   : {
      en :
        'Desktop utility that converts local and remote web pages to PDF or image. ' +
        'Wraps a modified and recompiled PhantomJS build with full HTML5/CSS3 rendering ' +
        'support.',
      fr :
        'Utilitaire de bureau convertissant des pages web locales et distantes en PDF ou ' +
        'image. Encapsule un build PhantomJS modifié et recompilé avec un rendu HTML5/CSS3 ' +
        'complet.',
    } satisfies Localized,
    stack     : ['C#', 'WPF'],
  },
  {
    id        : 'proj-healthmon',
    name      : {
      en : 'HealthMonitoring — Error Tracking',
      fr : 'HealthMonitoring — Suivi d\u2019erreurs',
    } satisfies Localized,
    org       : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period    : '2006 – 2013',
    summary   : {
      en :
        'Aggregated error-tracking back-office leveraging .NET\u2019s HealthMonitoring ' +
        'framework. Tracks SQL, IIS, .NET, application, and client-side errors; groups by ' +
        'machine, exception type, and message; and offers drill-down into stack traces, ' +
        'request info, and browser metadata. Reduced bug-resolution time from hours/days ' +
        'to minutes.',
      fr :
        'Back-office de suivi d\u2019erreurs agrégé exploitant le framework HealthMonitoring de ' +
        '.NET. Suit les erreurs SQL, IIS, .NET, applicatives et côté client\u202F; les regroupe ' +
        'par machine, type d\u2019exception et message\u202F; et offre une exploration détaillée des ' +
        'stack traces, informations de requête et métadonnées navigateur. Temps de résolution ' +
        'des bugs réduit de heures/jours à quelques minutes.',
    } satisfies Localized,
    stack     : ['ASP.NET', '.NET Framework'],
  },
  {
    id        : 'proj-webmonitor',
    name      : {
      en : 'Web-Monitor.NET',
      fr : 'Web-Monitor.NET',
    } satisfies Localized,
    org       : {
      en : 'Independent',
      fr : 'Indépendant',
    } satisfies Localized,
    period    : '2014 – 2015',
    summary   : {
      en :
        'Full rewrite of the HealthMonitoring app, used as a testbed for modern cloud ' +
        'technologies. Integrated SSO via LinkedIn, Google, Facebook, and Live; hosted ' +
        'on Windows Azure with Azure SQL; and cloud messaging via Mandrill.',
      fr :
        'Réécriture complète de l\u2019application HealthMonitoring, utilisée comme banc d\u2019essai ' +
        'pour les technologies cloud modernes. SSO intégré via LinkedIn, Google, Facebook et ' +
        'Live\u202F; hébergé sur Windows Azure avec Azure SQL\u202F; et messagerie cloud via Mandrill.',
    } satisfies Localized,
    stack     : ['AngularJS', 'MVC5', 'Bootstrap', 'Azure'],
  },
  {
    id        : 'proj-jsonr',
    name      : {
      en : 'JsonR — Lightweight JSON Protocol',
      fr : 'JsonR — Protocole JSON léger',
    } satisfies Localized,
    org       : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period    : '2012 – 2013',
    summary   : {
      en :
        'Designed a lightweight JSON protocol that reduced Ajax payload sizes by over ' +
        '50\u202F%, saving bandwidth and noticeably improving page-load times. A complete ' +
        'rewrite of an earlier protocol that achieved ~40\u202F% savings.',
      fr :
        'Conception d\u2019un protocole JSON léger réduisant la taille des payloads Ajax de plus ' +
        'de 50\u202F%, économisant de la bande passante et améliorant sensiblement les temps de ' +
        'chargement. Réécriture complète d\u2019un protocole antérieur atteignant ~40\u202F% d\u2019économie.',
    } satisfies Localized,
    stack     : ['JavaScript', '.NET'],
  },
  {
    id        : 'proj-t4resx',
    name      : {
      en : 'T4ResX — Localization Tooling',
      fr : 'T4ResX — Outillage de localisation',
    } satisfies Localized,
    org       : {
      en : 'Index Multimedia',
      fr : 'Index Multimedia',
    } satisfies Localized,
    period    : '2012 – 2014',
    summary   : {
      en :
        'T4 text-transformation template for Visual Studio that simplified localization ' +
        'management. Generated strongly-typed resource accessors for websites, class ' +
        'libraries, and JavaScript, with support for database-backed translations and ' +
        'classic RESX-to-Excel workflows for translator exchange.',
      fr :
        'Template de transformation de texte T4 pour Visual Studio simplifiant la gestion ' +
        'de la localisation. Génération d\u2019accesseurs de ressources fortement typés pour ' +
        'sites web, bibliothèques de classes et JavaScript, avec support de traductions ' +
        'en base de données et workflows classiques RESX vers Excel pour l\u2019échange traducteur.',
    } satisfies Localized,
    stack     : ['C#', 'T4', 'Visual Studio'],
  },
  {
    id        : 'proj-mario',
    name      : {
      en : 'jQuery Mario — Game POC',
      fr : 'jQuery Mario — POC de jeu',
    } satisfies Localized,
    org       : {
      en : '123 Multimedia SA',
      fr : '123 Multimedia SA',
    } satisfies Localized,
    period    : '2011',
    summary   : {
      en :
        'Built a micro Mario game as a proof-of-concept to evaluate lightweight ' +
        'alternatives to full gaming frameworks for porting a Flash game to mobile web.',
      fr :
        'Création d\u2019un micro-jeu Mario comme preuve de concept pour évaluer des alternatives ' +
        'légères aux frameworks de jeu complets dans le cadre du portage d\u2019un jeu Flash ' +
        'vers le web mobile.',
    } satisfies Localized,
    stack     : ['jQuery'],
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
      en : 'Owned and evolved the Perforce source-control architecture used by 200 developers.',
      fr : 'Responsable de l\u2019architecture de gestion de sources Perforce utilisée par 200 développeurs.',
    } satisfies Localized,
    bullets  : [
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
