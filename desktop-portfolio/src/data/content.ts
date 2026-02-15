/* ============================================================
   Content Registry — Portfolio Data
   ============================================================
   All portfolio content lives here, separated from logic.
   Edit this file to update content without touching components.
   ============================================================ */

export const about = {
  name     : 'Robert Hoffmann',
  tagline  : 'Full-Stack Engineer · Consultant · 25+ years in tech',
  photo    : `${import.meta.env.BASE_URL}profile.avif`,

  aiCallout :
    'I use AI tools, agents, and workflows every day\u202F— for research, writing specs, ' +
    'reviewing codebases, and accelerating delivery. I\u2019m genuinely comfortable ' +
    'with the whole stack, from prompt engineering to autonomous agent pipelines.',

  summary :
    'I\u2019ve spent 25+ years shipping software across aerospace, telecom, and media\u202F— ' +
    'from white-label chat platforms handling 400M requests a day and ad systems ' +
    'serving 3B+ impressions a month, to industrial IoT pipelines feeding real-time ' +
    'dashboards on the factory floor. High-traffic, mission-critical, and usually ' +
    'the kind of thing that has to work at 3\u202Fam.',

  expertise : [
    'AI Tools & Agents',       '.NET · TS · Vue · Python',
    'Data Pipelines & IoT',    'Skywise / Foundry',
    'DevOps & CI/CD',          'Agile & Scrum',
  ],

  certifications : [
    { label : 'PSM',                   issuer : 'Scrum.org' },
    { label : 'PSPO',                  issuer : 'Scrum.org' },
    { label : 'Lean Six Sigma',        issuer : 'LinkedIn' },
    { label : 'Change Mgmt',           issuer : 'LinkedIn' },
    { label : 'Strategic Agility',     issuer : 'LinkedIn' },
    { label : 'Digital Transformation',issuer : 'LinkedIn' },
    { label : 'Digital Strategy',      issuer : 'LinkedIn' },
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
    name      : 'tchatche.com — Real-Time Chat Platform',
    org       : 'Index Multimedia',
    period    : '2004 – 2013',
    summary   : 'Engineered a high-scale real-time chat platform, also white-labeled for ' +
                'major French media brands. Fluid and responsive across desktop (IE\u202F7+), ' +
                'tablet, and mobile with a skinnable, localizable UI shipping at just 200\u202FKB ' +
                'and a PageSpeed score of 97/100.',
    highlight : '600M page-views/mo · 400M daily requests',
    stack     : ['.NET MVC5', 'WebAPI 2', '.NET 4.5', 'CSS3', 'HTML5', 'LESS', 'jsRender'],
  },
  {
    id        : 'proj-adproxy',
    name      : 'Ad Proxy — Ad-Distribution Server',
    org       : 'Index Multimedia',
    period    : '2010 – 2013',
    summary   : 'Built a generic ad-distribution server that eliminated per-site code changes ' +
                'when onboarding new ad agencies. Auto-detected format, site, and agency; ' +
                'delivered audience-targeted ads by region, age, and gender; and load-balanced ' +
                'delivery based on agency performance.',
    highlight : '3B+ ads served/mo · ~5\u202F% CPU on 2 servers',
    stack     : ['ASP.NET 4'],
  },
  {
    id        : 'proj-headjs',
    name      : 'HeadJS — Open-Source JS Library',
    org       : 'Index Multimedia',
    period    : '2011 – 2014',
    summary   : 'Co-maintained a popular multi-purpose JavaScript library providing responsive-design ' +
                'polyfills for older browsers (IE\u202F6+), on-demand script and resource loading, ' +
                'and Modernizr-style browser feature detection. Used on high-traffic websites worldwide.',
    highlight : '4K+ GitHub stars · 400+ forks · ~200 dependents',
    stack     : ['JavaScript'],
    links     : [
      { label : 'GitHub', href : 'https://github.com/headjs/headjs' },
    ],
  },
  {
    id        : 'proj-powertoys',
    name      : 'PowerToys for OpenAI',
    org       : 'Independent',
    period    : '2023 – present',
    summary   : 'Browser extension that embeds ChatGPT directly into search-engine results, ' +
                'offering capabilities beyond the paid subscription tier. Features prompt ' +
                'engineering via profile management, context menus on any website for streamlined ' +
                'research, a built-in writing assistant, and BYO API key support for full ' +
                'functionality at a fraction of the subscription cost.',
    stack     : ['Browser Extension', 'JavaScript', 'OpenAI API'],
  },
  {
    id        : 'proj-stats-drees',
    name      : 'Stats DREES — France',
    org       : 'Independent',
    period    : '2021 – present',
    summary   : 'Interactive dashboard consuming the French government DREES public API to ' +
                'visualize COVID-19 and vaccination data — including cases, hospitalizations, ' +
                'ICU patients, and deaths. Built comparative views by vaccination status and ' +
                'causality with trend analysis of efficacy and risk over time.',
    stack     : ['Power BI'],
  },
  {
    id        : 'proj-stats-covid',
    name      : 'Stats COVID — France',
    org       : 'Independent',
    period    : '2021 – present',
    summary   : 'Comprehensive COVID-19 dashboard with interactive slicing by date range, ' +
                'age range, and percentage visualization. Covers cases, tests, positivity rate, ' +
                'hospitalizations, ICU occupancy, multi-dose vaccinations, deaths, and ' +
                'demographic breakdowns.',
    stack     : ['Power BI'],
  },
  {
    id        : 'proj-microcoil-mobile',
    name      : 'MicroCoil Calculator (Mobile)',
    org       : 'Independent',
    period    : '2017 – present',
    summary   : 'Mobile app that helps DIY vapers calculate coil resistance for electronic ' +
                'cigarettes — simple, accurate, and purpose-built for the community.',
    highlight : '10K+ installs on Android',
    stack     : ['Vue.js', 'Cordova'],
  },
  {
    id        : 'proj-microcoil-web',
    name      : 'Micro-Coil Calculator · Vapez.FR',
    org       : 'Independent',
    period    : '2014 – 2016',
    summary   : 'Mobile-first web app deployed across major French vaping e-commerce sites. ' +
                'Included a liquid-consumption calculator for smokers transitioning to vaping ' +
                'and a coil resistance calculator for DIY users.',
    highlight : '50K+ monthly active users',
    stack     : ['AngularJS', 'Bootstrap'],
  },
  {
    id        : 'proj-findunused',
    name      : 'FindUnusedFiles — VS Extension',
    org       : 'Index Multimedia',
    period    : '2013 – 2015',
    summary   : 'Visual Studio add-in and standalone app that scans VS solutions and website ' +
                'projects to surface unused resources — images, scripts, stylesheets, and more.',
    highlight : '11K+ installs on VS Marketplace',
    stack     : ['C#', 'Visual Studio SDK'],
  },
  {
    id        : 'proj-phantomui',
    name      : 'PhantomUI — Web-to-PDF Converter',
    org       : 'Independent',
    period    : '2015 – present',
    summary   : 'Desktop utility that converts local and remote web pages to PDF or image. ' +
                'Wraps a modified and recompiled PhantomJS build with full HTML5/CSS3 rendering ' +
                'support.',
    stack     : ['C#', 'WPF'],
  },
  {
    id        : 'proj-healthmon',
    name      : 'HealthMonitoring — Error Tracking',
    org       : 'Index Multimedia',
    period    : '2006 – 2013',
    summary   : 'Aggregated error-tracking back-office leveraging .NET\u2019s HealthMonitoring ' +
                'framework. Tracks SQL, IIS, .NET, application, and client-side errors; groups by ' +
                'machine, exception type, and message; and offers drill-down into stack traces, ' +
                'request info, and browser metadata. Reduced bug-resolution time from hours/days ' +
                'to minutes.',
    stack     : ['ASP.NET', '.NET Framework'],
  },
  {
    id        : 'proj-webmonitor',
    name      : 'Web-Monitor.NET',
    org       : 'Independent',
    period    : '2014 – 2015',
    summary   : 'Full rewrite of the HealthMonitoring app, used as a testbed for modern cloud ' +
                'technologies. Integrated SSO via LinkedIn, Google, Facebook, and Live; hosted ' +
                'on Windows Azure with Azure SQL; and cloud email via Mandrill.',
    stack     : ['AngularJS', 'MVC5', 'Bootstrap', 'Azure'],
  },
  {
    id        : 'proj-jsonr',
    name      : 'JsonR — Lightweight JSON Protocol',
    org       : 'Index Multimedia',
    period    : '2012 – 2013',
    summary   : 'Designed a lightweight JSON protocol that reduced Ajax payload sizes by over ' +
                '50\u202F%, saving bandwidth and noticeably improving page-load times. A complete ' +
                'rewrite of an earlier protocol that achieved ~40\u202F% savings.',
    stack     : ['JavaScript', '.NET'],
  },
  {
    id        : 'proj-t4resx',
    name      : 'T4ResX — Localization Tooling',
    org       : 'Index Multimedia',
    period    : '2012 – 2014',
    summary   : 'T4 text-transformation template for Visual Studio that simplified localization ' +
                'management. Generated strongly-typed resource accessors for websites, class ' +
                'libraries, and JavaScript, with support for database-backed translations and ' +
                'classic RESX-to-Excel workflows for translator exchange.',
    stack     : ['C#', 'T4', 'Visual Studio'],
  },
  {
    id        : 'proj-mario',
    name      : 'jQuery Mario — Game POC',
    org       : '123 Multimedia SA',
    period    : '2011',
    summary   : 'Built a micro Mario game as a proof-of-concept to evaluate lightweight ' +
                'alternatives to full gaming frameworks for porting a Flash game to mobile web.',
    stack     : ['jQuery'],
  },
] as const

export const experience = [
  {
    id       : 'exp-maser',
    company  : 'Maser Engineering',
    role     : 'Consultant — Data & IoT Integration',
    period   : 'Mar 2022 – Present',
    location : 'France (Hybrid)',
    type     : 'Permanent',
    summary  : 'Designing and optimizing industrial data workflows with progressive specialization ' +
               'in Airbus Skywise / Palantir Foundry for aerospace, energy, and industrial clients ' +
               'including Airbus, Safran, Hutchinson, Terega, SBM, and Nexess IoT.',
    bullets  : [
      'Data collection & transformation — APIs, CSV, JSON, XML, IoT sensor feeds, log parsing',
      'Workflow automation — no-code, low-code, and full-code (n8n, Make, Airtable, custom APIs)',
      'Skywise / Foundry dataset integration, ontology modeling, and SQL & Spark pipelines',
      'Slate dashboards for operational health, performance, and error monitoring',
      'Alerting & observability for anomaly and error-trend detection',
    ],
    stack    : ['C#', 'PHP', 'Vue.js', 'Python', 'SQL', 'Skywise', 'Foundry'],
  },
  {
    id       : 'exp-independent',
    company  : 'Independent',
    role     : 'Digital & Technological Consultant',
    period   : '2019 – Present',
    location : 'Greater Toulouse Area',
    type     : 'Freelance',
    summary  : 'Helping entrepreneurs, start-ups, and SMEs analyze and realize their potential through ' +
               'marketing, technology, automation, and industrialization.',
    bullets  : [
      'Innovation management, feasibility studies, and market & competitive analysis',
      'Full-stack delivery — front-end, back-office, web, mobile, and service architecture',
      'DevOps automation, CI/CD, error & project management',
      'Digital strategy, growth hacking, SEO/SEA, and user acquisition & retention',
      'ROI, cost, risk, and technical-debt analysis using Scrum, Kanban, and Lean',
    ],
    stack    : ['Agile Coach', 'Product Owner', 'Scrum', 'Kanban'],
  },
  {
    id       : 'exp-biocurae',
    company  : 'BioCurae',
    role     : 'Chief Product Officer',
    period   : '2021',
    location : 'Île-de-France',
    type     : 'Contract',
    summary  : 'Led product strategy for a HealthTech / NutriTech start-up focused on personalized care.',
    bullets  : [
      'Defined product strategy for nootropics, nutraceutics, and nutrigenomics verticals',
      'Designed diagnostic & prescription automation workflows',
      'Shaped the personalized-care product roadmap',
    ],
  },
  {
    id       : 'exp-infomil',
    company  : 'Infomil',
    role     : 'R&D Engineer',
    period   : 'May 2017 – Dec 2017',
    location : 'Toulouse, France',
    type     : 'Contract · 8 months',
    summary  : 'Owned and evolved the Perforce source-control architecture used by 200 developers.',
    bullets  : [
      'Audited and migrated the SCM architecture with operations and security teams',
      'Modernized maintenance scripts from VBS to PowerShell\u202F5',
      'Built WinForms plugins to streamline developer workflows',
      'Evaluated TeamCity CI integration and authored an architecture evolution roadmap',
      'Conducted feasibility studies — emoji messaging POC, static analysis, OWASP pen testing',
    ],
    stack    : ['Perforce', 'PowerShell', 'C#', 'WinForms', 'TeamCity'],
  },
  {
    id       : 'exp-dao',
    company  : 'dao & Co',
    role     : 'Consultant / Full-Stack Developer',
    period   : 'Apr 2015 – Feb 2017',
    location : 'Ramonville Saint-Agne, France',
    type     : 'Contract · 1 yr 11 mo',
    summary  : 'Built personalized interfaces for e-learning platforms (MOOCs) used to train management ' +
               'and staff at major banks and insurance groups.',
    bullets  : [
      'Piloted cloud migration — Mailchimp, Mandrill, AWS S3, Jira/Confluence, BitBucket',
      'Automated mailing workflows via web and mobile API integrations',
      'Rolled out Agile workflow with integrated bug tracking and knowledge-base sharing',
    ],
  },
  {
    id       : 'exp-prestalia',
    company  : 'Prestalia',
    role     : 'Web Architect',
    period   : 'Mar 2014 – Jul 2014',
    location : 'Greater Toulouse Area',
    type     : 'Contract · 5 months',
    summary  : 'Reviewed and enhanced the company\u2019s technical infrastructure and development workflows.',
    bullets  : [
      'Migrated projects to latest Microsoft stack, unblocking development and accelerating delivery',
      'Decoupled project dependencies to simplify deployments and reduce errors',
      'Consolidated DNS to AWS Route\u202F53 and optimized deployment pipelines',
    ],
    stack    : ['C#', '.NET', 'HTML5', 'CSS3', 'JavaScript', 'jQuery'],
  },
  {
    id        : 'exp-index',
    company   : 'Index Multimedia',
    role      : 'Senior Full-Stack Developer / Tech Lead',
    period    : '2008 – Nov 2013',
    location  : 'Greater Toulouse Area',
    type      : 'Permanent · ~6 years',
    summary   : 'Collaborated across design, development, IT, and marketing on high-traffic community products.',
    highlight : '6M uniques/mo · 400M req/day',
    bullets   : [
      'Maintained and evolved chat rooms, web apps, and multimedia portals — 6M unique visitors/month',
      'Designed a generic ad-proxy server — +20\u202F% ad revenue, zero developer intervention',
      'Built responsive ad delivery with device detection — +30\u202F% click-through rate',
      'Created an error-tracking tool cutting bug resolution from days to minutes — 5× fewer errors',
      'Elaborated social media strategy with SSO and social sharing — +50\u202F% revenue in 6 months',
    ],
    stack     : ['C#', '.NET', 'JavaScript', 'SEO', 'Google Analytics'],
  },
  {
    id       : 'exp-celad',
    company  : 'CELAD',
    role     : 'Senior Full-Stack Developer',
    period   : '2007 – 2008',
    location : 'Greater Toulouse Area',
    type     : 'Contract · 1 year',
    summary  : 'Led the technical and design restructuring of internationalized white-label web chats.',
    bullets  : [
      'Architected a skinnable, internationalized, responsive web app (IE\u202F6+)',
      'Halved white-label deployment time while delivering a modern, translatable product',
      'Designed a custom JSON protocol (JsonRaw) — 30–40\u202F% bandwidth savings',
    ],
    stack    : ['C#', '.NET', 'jQuery', 'JavaScript', 'CSS'],
  },
  {
    id       : 'exp-123mm',
    company  : '123 Multimedia SA',
    role     : 'Full-Stack Developer / Integrator',
    period   : '2003 – 2007',
    location : 'Greater Toulouse Area',
    type     : 'Permanent · 4 years',
    summary  : 'Built and managed community products (B2B/B2C) — chats, blogs, and portals — under ' +
               'own label, white label, and affiliation models.',
    bullets  : [
      'Deployed internal ad servers — 10× increase in ads served and revenue',
      'Integrated monetization services — ad networks, credit card, SMS, micro-payment, paywall',
      'Customized products for TF1, Skyrock, NRJ Group, M6, SFR, Orange, Microsoft, Pepsi, and more',
    ],
    stack    : ['C#', '.NET', 'JavaScript', 'CSS', 'HTML'],
  },
  {
    id       : 'exp-indie',
    company  : 'Independent',
    role     : 'Product Owner / Full-Stack Developer',
    period   : '1998 – 2003',
    location : 'Greater Toulouse Area',
    type     : 'Freelance · 5 years',
    summary  : 'Conceived and managed community-oriented web products from the ground up.',
    bullets  : [
      'Founded 2 websites — a video-game fan site and a content-creator directory with ad monetization',
      'Managed a CMS product with plugins, marketplace, developer community, and affiliates',
      'Built a website promotion tool with traffic generation, affiliate management, and white-label resale',
    ],
    stack    : ['PHP', 'JavaScript', 'CSS', 'HTML', 'SEO'],
  },
  {
    id       : 'exp-bo',
    company  : 'Bang & Olufsen',
    role     : 'Electronics Technician',
    period   : '1996 – 1997',
    location : 'Greater Toulouse Area',
    type     : '1 year',
    summary  : 'Repair and installation of hi-tech multimedia equipment (TV/HI-FI) for Loewe and Bang & Olufsen.',
    bullets  : [],
  },
  {
    id       : 'exp-deva',
    company  : 'Bureau d\u2019Étude D.E.V.A.',
    role     : 'Electronics Assembly Technician',
    period   : '1994 – 1996',
    location : 'Greater Toulouse Area',
    type     : '2 years',
    summary  : 'Circuit-board and parts assembly for the first fully digital photo booths using CCD cameras ' +
               'and color thermal printers — deployed to shopping centers, public spaces, and professional studios.',
    bullets  : [],
  },
] as const

export const contact = {
  email : 'robert.hoffmann@i-technology.net',
  links : [
    { label : 'GitHub',   href : 'https://github.com/robert-hoffmann' },
    { label : 'LinkedIn', href : 'https://www.linkedin.com/in/hoffmannrobert' },
  ],
} as const

export const easterEgg = {
  title : '🎮 GeoWars',
  body  : 'Mouse to steer (distance = thrust) · Click to fire · Space to pause.',
} as const
