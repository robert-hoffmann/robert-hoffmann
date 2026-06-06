import type { Localized } from '../../types/desktop'

// #region Content
export const experience = [
  {
    id       : 'exp-maser',
    company  : {
      en : 'Maser Engineering',
      fr : 'Maser Engineering',
    } satisfies Localized,
    role     : {
      en : 'Consultant - Industrial Software & Operations Platforms',
      fr : 'Consultant - Logiciels industriels & plateformes opérationnelles',
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
        'Building production software for industrial, aerospace, energy, training, and ' +
        'compliance operations: data orchestration, offline field apps, planning back offices, ' +
        'certification workflows, inventory systems, observability tooling, and AI-assisted ' +
        'delivery workflows for clients including Airbus, Hutchinson, SBM, Teréga, CRIT, Nexess, ' +
        'and Maser Academy.',
      fr :
        'Conception et livraison de logiciels de production pour les opérations industrielles, ' +
        'aéronautiques, énergie, formation et conformité : orchestration de données, apps terrain ' +
        'hors ligne, back-offices de planification, workflows de certification, systèmes ' +
        'd\u2019inventaire, observabilité et workflows de livraison assistés par IA pour des clients ' +
        'dont Airbus, Hutchinson, SBM, Teréga, CRIT, Nexess et Maser Academy.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Delivered full-stack operational platforms across Symfony, Vue, Quasar, Python, Airtable, MariaDB, SQLite, and REST APIs',
        fr : 'Livraison de plateformes opérationnelles full-stack avec Symfony, Vue, Quasar, Python, Airtable, MariaDB, SQLite et APIs REST',
      },
      {
        en : 'Built offline-capable field and tablet apps for wind-turbine maintenance, training attendance, and manufacturing work instructions',
        fr : 'Création d\u2019apps terrain et tablette hors ligne pour maintenance éolienne, pointage formation et instructions de fabrication',
      },
      {
        en : 'Modernized industrial data pipelines, job orchestration, structured logging, alerting, and traceability systems',
        fr : 'Modernisation de pipelines de données industrielles, orchestration de jobs, logging structuré, alerting et traçabilité',
      },
      {
        en : 'Integrated smart cabinets, Google Workspace, Skywise / Foundry, Airtable, PDFs, CSV exports, and internal back-office tools',
        fr : 'Intégration d\u2019armoires connectées, Google Workspace, Skywise / Foundry, Airtable, PDFs, exports CSV et outils back-office internes',
      },
      {
        en : 'Introduced AI-assisted engineering workflows, quality gates, documentation sync, and repeatable delivery practices',
        fr : 'Introduction de workflows d\u2019ingénierie assistés par IA, quality gates, synchronisation documentaire et pratiques de livraison répétables',
      },
    ] satisfies Localized[],
    stack    : [
      'Python',
      'PHP',
      'Symfony',
      'Vue.js',
      'Quasar',
      'Airtable',
      'MariaDB',
      'SQLite',
      'REST APIs',
      'Skywise / Foundry',
      'AI Workflows',
    ],
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
        en : 'Full-stack delivery - front-end, back-office, web, mobile, and service architecture',
        fr : 'Livraison full-stack - front-end, back-office, web, mobile et architecture de services',
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
        en : 'Conducted feasibility studies - emoji messaging POC, static analysis, OWASP pen testing',
        fr : 'Études de faisabilité - POC messagerie emoji, analyse statique, tests d\u2019intrusion OWASP',
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
        en : 'Piloted cloud migration - Mailchimp, Mandrill, AWS S3, Jira/Confluence, BitBucket',
        fr : 'Pilotage de la migration cloud - Mailchimp, Mandrill, AWS S3, Jira/Confluence, BitBucket',
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
        en : 'Maintained and evolved chat rooms, web apps, and multimedia portals - 6M unique visitors/month',
        fr : 'Maintenance et évolution de salons de chat, applications web et portails multimédias - 6M visiteurs uniques/mois',
      },
      {
        en : 'Designed a generic ad-proxy server - +20\u202F% ad revenue, zero developer intervention',
        fr : 'Conception d\u2019un serveur proxy publicitaire générique - +20\u202F% de revenus publicitaires, zéro intervention développeur',
      },
      {
        en : 'Built responsive ad delivery with device detection - +30\u202F% click-through rate',
        fr : 'Mise en place d\u2019une diffusion publicitaire responsive avec détection d\u2019appareil - +30\u202F% de taux de clic',
      },
      {
        en : 'Created an error-tracking tool cutting bug resolution from days to minutes - 5× fewer errors',
        fr : 'Création d\u2019un outil de suivi d\u2019erreurs réduisant la résolution de bugs de jours à minutes - 5× moins d\u2019erreurs',
      },
      {
        en : 'Elaborated social media strategy with SSO and social sharing - +50\u202F% revenue in 6 months',
        fr : 'Élaboration d\u2019une stratégie réseaux sociaux avec SSO et partage social - +50\u202F% de revenus en 6 mois',
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
        en : 'Designed a custom JSON protocol (JsonRaw) - 30–40\u202F% bandwidth savings',
        fr : 'Conception d\u2019un protocole JSON personnalisé (JsonRaw) - 30–40\u202F% d\u2019économie de bande passante',
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
        'Built and managed community products (B2B/B2C) - chats, blogs, and portals - under ' +
        'own label, white label, and affiliation models.',
      fr :
        'Développement et gestion de produits communautaires (B2B/B2C) - chats, blogs et ' +
        'portails - en marque propre, marque blanche et modèles d\u2019affiliation.',
    } satisfies Localized,
    bullets  : [
      {
        en : 'Deployed internal ad servers - 10× increase in ads served and revenue',
        fr : 'Déploiement de serveurs publicitaires internes - 10× plus de pubs servies et de revenus',
      },
      {
        en : 'Integrated monetization services - ad networks, credit card, SMS, micro-payment, paywall',
        fr : 'Intégration de services de monétisation - régies publicitaires, carte bancaire, SMS, micro-paiement, paywall',
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
        en : 'Founded 2 websites - a video-game fan site and a content-creator directory with ad monetization',
        fr : 'Création de 2 sites web - un site de fans de jeux vidéo et un annuaire de créateurs de contenu avec monétisation publicitaire',
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
        'and color thermal printers - deployed to shopping centers, public spaces, and professional studios.',
      fr :
        'Assemblage de circuits imprimés et de composants pour les premiers photobooths entièrement numériques ' +
        'utilisant des caméras CCD et des imprimantes thermiques couleur\u202F- déployés dans des centres ' +
        'commerciaux, espaces publics et studios professionnels.',
    } satisfies Localized,
    bullets  : [] satisfies Localized[],
  },
] as const
// #endregion Content
