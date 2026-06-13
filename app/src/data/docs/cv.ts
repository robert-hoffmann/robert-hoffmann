import type { Locale, Localized } from '../../types/desktop'
import { about } from '../apps/about'
import { galleryImages, type GalleryImageId } from '../apps/gallery'
import { projects, type Project, type ProjectId } from '../apps/projects'
import { experience } from '../apps/resume'

// #region Types
type Experience = (typeof experience)[number]
type ExperienceId = Experience['id']

interface CvLink {
  label : string
  href  : string
}

interface CvContact extends CvLink {
  text : string
}

interface CvTopMetric {
  value            : string
  label            : string
  sourceProjectIds?: readonly ProjectId[]
}

type CvCertification = CvLink

interface CvLanguage {
  flag  : string
  label : string
}

interface CvPortfolioProof {
  eyebrow         : string
  title           : string
  href            : string
  body            : string
  sourceProjectId : ProjectId
}

interface CvExperienceItem {
  date      : string
  role      : string
  company   : string
  bullets   : readonly string[]
  sourceIds : readonly ExperienceId[]
}

interface CvImpactProject {
  title            : string
  href?            : string
  body             : string
  metrics          : readonly string[]
  sourceProjectIds : readonly ProjectId[]
  hasGalleryImage  : boolean
}

interface CvVisualEvidence {
  galleryImageId : GalleryImageId
  projectId      : ProjectId
}

interface CvIdentity {
  avatarSrc : string
  bannerSrc : string
}

interface CvSectionLabels {
  certifications         : string
  coreStack              : string
  currentValue           : string
  deliveryReliability    : string
  documentKind           : string
  languages              : string
  operatingMode          : string
  portfolioProof         : string
  profile                : string
  profilePhoto           : string
  selectedExperience     : string
  selectedImpactProjects : string
}

export interface CvDocument {
  locale              : Locale
  title               : string
  name                : string
  identity            : CvIdentity
  labels              : CvSectionLabels
  topbarKicker        : string
  role                : string
  contacts            : readonly CvContact[]
  metrics             : readonly CvTopMetric[]
  profile             : {
    lead : string
    body : string
  }
  coreStack           : readonly string[]
  deliveryReliability : readonly string[]
  languages           : readonly CvLanguage[]
  certifications      : readonly CvCertification[]
  portfolioProof      : CvPortfolioProof
  operatingMode       : readonly string[]
  currentValue        : string
  selectedExperience  : readonly CvExperienceItem[]
  impactProjects      : readonly CvImpactProject[]
  footer              : {
    links : readonly CvLink[]
    text  : string
  }
  visualEvidence      : readonly CvVisualEvidence[]
}
// #endregion Types

// #region Source Helpers
const portfolioHref = 'https://i-technology.net/'

function localized(value: Localized, locale: Locale): string {
  return value[locale]
}

function asciiDateRange(value: string): string {
  return value.replaceAll('–', '-')
}

function requireAboutLink(label: string): string {
  const link = about.links.find(item => item.label === label)

  if (!link) {
    throw new Error(`Missing about link: ${label}`)
  }

  return link.href
}

function getProject(id: ProjectId): Project {
  const project = projects.find(item => item.id === id)

  if (!project) {
    throw new Error(`Missing CV project source: ${id}`)
  }

  return project
}

function getExperience(id: ExperienceId): Experience {
  const item = experience.find(entry => entry.id === id)

  if (!item) {
    throw new Error(`Missing CV experience source: ${id}`)
  }

  return item
}

function getProjectLink(project: Project, label: string): string | undefined {
  const candidate = project as Project & { links?: readonly CvLink[] }

  return candidate.links?.find(link => link.label === label)?.href
}

function getCertification(label: string): CvCertification {
  const certification = about.certifications.find(item => item.label === label)

  if (!certification) {
    throw new Error(`Missing CV certification source: ${label}`)
  }

  return {
    label : certification.label,
    href  : certification.href,
  }
}

function projectHasGalleryImage(id: ProjectId): boolean {
  return galleryImages.some(image => image.projectId === id)
}
// #endregion Source Helpers

// #region Source Selections
const githubHref   = requireAboutLink('GitHub')
const linkedInHref = requireAboutLink('LinkedIn')
const xHref        = requireAboutLink('X')

const maserExperience       = getExperience('exp-maser')
const independentExperience = getExperience('exp-independent')
const infomilExperience     = getExperience('exp-infomil')
const daoExperience         = getExperience('exp-dao')
const prestaliaExperience   = getExperience('exp-prestalia')
const indexExperience       = getExperience('exp-index')
const mmExperience          = getExperience('exp-123mm')

const tmipSchedulerProject  = getProject('proj-tmip-scheduler')
const tmipLoggerProject     = getProject('proj-tmip-logger')
const healthmonProject      = getProject('proj-healthmon')
const windProject           = getProject('proj-wind-maintenance')
const sbmProject            = getProject('proj-sbm-compliance')
const hutchinsonProject     = getProject('proj-hutchinson-work-instructions')
const chatProject           = getProject('proj-chatapp')
const adProxyProject        = getProject('proj-adproxy')
const portfolioProject      = getProject('proj-desktop-portfolio')
// #endregion Source Selections

// #region Document
type CvLocalizedSectionLabels = {
  readonly [Key in keyof CvSectionLabels]: Localized
}

interface CvLanguageSource {
  flag  : string
  label : Localized
}

interface CvExperienceSource {
  date    : Localized
  role?   : Localized
  company : Localized
  bullets : readonly Localized[]
}

interface CvImpactProjectSource {
  title   : Localized
  body    : Localized
  metrics : readonly Localized[]
}

interface CvCopySource {
  contacts           : {
    locationLabel : Localized
    locationText  : Localized
    phoneLabel    : Localized
  }
  currentValue       : Localized
  deliveryReliability: readonly Localized[]
  experience         : {
    independent   : CvExperienceSource
    maser         : CvExperienceSource
    modernization : CvExperienceSource
    multimedia    : CvExperienceSource
  }
  footerText         : Localized
  impactProjects     : {
    compliance    : CvImpactProjectSource
    healthmon     : CvImpactProjectSource
    media         : CvImpactProjectSource
    monitoring    : CvImpactProjectSource
    tmipLogger    : CvImpactProjectSource
    tmipScheduler : CvImpactProjectSource
  }
  labels             : CvLocalizedSectionLabels
  languages          : readonly CvLanguageSource[]
  metrics            : {
    ads        : Localized
    jobs       : Localized
    lighthouse : Localized
    requests   : Localized
    years      : {
      value : Localized
      label : Localized
    }
  }
  operatingMode      : readonly Localized[]
  portfolioProof     : {
    body  : Localized
    title : Localized
  }
  profile            : {
    body : Localized
    lead : Localized
  }
  role               : Localized
  topbarKicker       : Localized
}

const cvCopy = {
  contacts           : {
    locationLabel : {
      en : 'Location',
      fr : 'Localisation',
    },
    locationText  : {
      en : 'Toulouse - France, Hybrid',
      fr : 'Toulouse - France, hybride',
    },
    phoneLabel    : {
      en : 'Phone',
      fr : 'Téléphone',
    },
  },
  currentValue       : {
    en :
      'Best fit: autonomous product teams, startups, scale-ups, SaaS companies, software publishers, ' +
      'or expert operational teams that need a senior builder who can own delivery from product ' +
      'problem to production without losing engineering control.',
    fr :
      'Meilleur fit : équipes produit autonomes, startups, scale-ups, SaaS, éditeurs logiciels ' +
      'ou équipes opérationnelles expertes qui ont besoin d’un senior capable de tenir le delivery ' +
      'du problème produit à la production sans perdre le contrôle engineering.',
  },
  deliveryReliability : [
    {
      en : 'AI-Directed Delivery',
      fr : 'Livraison pilotée par IA',
    },
    {
      en : 'Quality Gates',
      fr : 'Quality Gates',
    },
    {
      en : 'Observability',
      fr : 'Observabilité',
    },
    {
      en : 'Structured Logging',
      fr : 'Logging structuré',
    },
    {
      en : 'Error Tracking',
      fr : 'Suivi d’erreurs',
    },
    {
      en : 'Health Monitoring',
      fr : 'Supervision santé',
    },
    {
      en : 'Alerting',
      fr : 'Alerting',
    },
    {
      en : 'Traceability',
      fr : 'Traçabilité',
    },
    {
      en : 'Fast Diagnosis',
      fr : 'Diagnostic rapide',
    },
  ],
  experience          : {
    independent   : {
      date    : {
        en : '2019<br>Present',
        fr : '2019<br>Présent',
      },
      company : {
        en : `${localized(independentExperience.company, 'en')} - ${localized(independentExperience.location, 'en')}`,
        fr : `${localized(independentExperience.company, 'fr')} - ${localized(independentExperience.location, 'fr')}`,
      },
      bullets : [
        {
          en :
            'Advises entrepreneurs, startups, SMEs, and product/technical teams on strategy, ' +
            'workflows, technical direction, automation, optimization, ROI, risk, and delivery choices.',
          fr :
            'Accompagne entrepreneurs, startups, PME et équipes produit/tech sur stratégie, workflows, ' +
            'direction technique, automatisation, optimisation, ROI, risque et delivery.',
        },
      ],
    },
    maser         : {
      date    : {
        en : 'Mar 2022<br>Present',
        fr : 'Mars 2022<br>Présent',
      },
      company : {
        en : `${localized(maserExperience.company, 'en')} - France, hybrid`,
        fr : `${localized(maserExperience.company, 'fr')} - France, hybride`,
      },
      bullets : [
        {
          en :
            'Delivered production software for Airbus, Hutchinson, SBM, Terega, CRIT, Nexess, ' +
            'Maser Academy, and renewable-energy teams.',
          fr :
            'Livraison de logiciels de production pour Airbus, Hutchinson, SBM, Teréga, CRIT, ' +
            'Nexess, Maser Academy et équipes énergies renouvelables.',
        },
        {
          en :
            'Built data orchestration, offline field apps, planning back offices, certification ' +
            'workflows, inventory systems, and observability tooling.',
          fr :
            'Orchestration de données, apps terrain offline, back offices planning, workflows ' +
            'conformité, inventaire et observabilité.',
        },
        {
          en :
            'Introduced AI-directed delivery workflows, documentation sync, quality gates, and ' +
            'repeatable validation practices.',
          fr :
            'Mise en place de workflows IA dirigés, sync documentation, quality gates et ' +
            'validations répétables.',
        },
      ],
    },
    modernization : {
      date    : {
        en : '2014<br>2017',
        fr : '2014<br>2017',
      },
      role    : {
        en : 'Web Architect / Delivery Modernization',
        fr : 'Architecte web / Modernisation delivery',
      },
      company : {
        en : 'Infomil, dao & Co, Prestalia - Toulouse, France',
        fr : 'Infomil, dao & Co, Prestalia - Toulouse, France',
      },
      bullets : [
        {
          en :
            'Improved source-control architecture, cloud migration, deployment pipelines, bug ' +
            'tracking, and knowledge sharing.',
          fr :
            'Amélioration architecture source-control, migration cloud, pipelines de déploiement, ' +
            'bug tracking et partage de connaissances.',
        },
      ],
    },
    multimedia    : {
      date    : {
        en : '2003<br>2013',
        fr : '2003<br>2013',
      },
      company : {
        en : '123 Multimedia / Index Multimedia - Toulouse, France',
        fr : '123 Multimedia / Index Multimedia - Toulouse, France',
      },
      bullets : [
        {
          en :
            'Led and evolved high-traffic community, real-time chat, ad-tech, localization, and ' +
            'error-tracking systems for major French media brands.',
          fr :
            'Lead sur produits communautaires, chat temps réel, ad-tech, localisation et ' +
            'error-tracking à fort trafic pour grands médias français.',
        },
      ],
    },
  },
  footerText          : {
    en : `${about.name} - Senior Product-Minded Full-Stack Engineer`,
    fr : `${about.name} - Ingénieur full-stack senior orienté produit`,
  },
  impactProjects      : {
    compliance    : {
      title   : {
        en : 'Offline field and compliance platforms',
        fr : 'Plateformes terrain offline et conformité',
      },
      body    : {
        en :
          'Quasar/Vue field apps, Symfony back offices, SCORM onboarding, certification expiry, ' +
          'gate checks, queued sync, and PDF/CSV outputs for industrial teams.',
        fr :
          'Apps terrain Quasar/Vue, back offices Symfony, onboarding SCORM, expirations de ' +
          'certifications, contrôles d’accès, sync en file d’attente et exports PDF/CSV.',
      },
      metrics : [
        {
          en : '100s turbines',
          fr : '100s turbines',
        },
        {
          en : '117 companies',
          fr : '117 sociétés',
        },
        {
          en : '10,202 steps',
          fr : '10 202 étapes',
        },
      ],
    },
    healthmon     : {
      title   : {
        en : 'HealthMonitoring - error-tracking back office',
        fr : 'HealthMonitoring - back office error-tracking',
      },
      body    : {
        en :
          'Aggregated SQL, IIS, .NET, application, and client-side errors into drill-down ' +
          'views by machine, exception, message, stack trace, request context, and browser metadata.',
        fr :
          'Agrégation d’erreurs SQL, IIS, .NET, applicatives et client dans des vues par machine, ' +
          'exception, message, stack trace, contexte requête et métadonnées navigateur.',
      },
      metrics : [
        {
          en : 'days to minutes',
          fr : 'jours à minutes',
        },
        {
          en : '5x fewer errors',
          fr : '5x moins d’erreurs',
        },
        {
          en : 'SQL/IIS/.NET/client',
          fr : 'SQL/IIS/.NET/client',
        },
      ],
    },
    media         : {
      title   : {
        en : 'High-scale real-time web and ad-serving systems',
        fr : 'Systèmes web temps réel et ad-serving à grande échelle',
      },
      body    : {
        en :
          'Lead developer and technical owner for white-label chat and ad-serving products ' +
          'covering frontend architecture, backend APIs, caching, moderation, performance, ' +
          'campaign routing, targeting, and branded portals.',
        fr :
          'Lead developer et responsable technique de produits chat et ad-serving marque blanche : ' +
          'architecture frontend, APIs, cache, modération, performance, routage campagnes et portails.',
      },
      metrics : [
        {
          en : '600M views/month',
          fr : '600M vues/mois',
        },
        {
          en : '3B+ ads/month',
          fr : '3Md+ pubs/mois',
        },
        {
          en : '~125K req/s chat-cluster peaks',
          fr : '~125K req/s chat',
        },
      ],
    },
    monitoring    : {
      title   : {
        en : 'Operational health monitoring - production signals',
        fr : 'Supervision opérationnelle - signaux production',
      },
      body    : {
        en :
          'Health and alerting layer for industrial jobs: error spikes, SSL expiry, daily ' +
          'summaries, Skywise feeds, Quiver VM metrics, and plant/job-level diagnosis.',
        fr :
          'Santé et alerting pour jobs industriels : pics d’erreurs, expiration SSL, synthèses ' +
          'quotidiennes, flux Skywise, métriques Quiver VM et diagnostic par usine/job.',
      },
      metrics : [
        {
          en : '16 plants',
          fr : '16 usines',
        },
        {
          en : 'Skywise + Quiver',
          fr : 'Skywise + Quiver',
        },
        {
          en : 'automated alerts',
          fr : 'alertes auto',
        },
      ],
    },
    tmipLogger    : {
      title   : {
        en : 'TMIP Logger - QoS & KPI observability',
        fr : 'TMIP Logger - observabilité QoS & KPI',
      },
      body    : {
        en :
          'Structured logging layer turning raw events into SQLite inspection, Vue operations ' +
          'views, Skywise feeds, and automated alerts for plant and job health.',
        fr :
          'Couche de logging structuré transformant les événements en inspection SQLite, vues ' +
          'opérations Vue, flux Skywise et alertes automatisées sur santé usine/job.',
      },
      metrics : [
        {
          en : '10x error reduction',
          fr : '10x moins d’erreurs',
        },
        {
          en : '5x faster fixes',
          fr : 'fixes 5x plus rapides',
        },
        {
          en : '~300 jobs',
          fr : '~300 jobs',
        },
      ],
    },
    tmipScheduler : {
      title   : {
        en : 'TMIP Scheduler - Airbus data orchestration',
        fr : 'TMIP Scheduler - orchestration data Airbus',
      },
      body    : {
        en :
          'Central service synchronizing Nexess smart cabinets, Google Workspace, Skywise ' +
          'datasets, and management tooling while modernizing legacy Python into typed, ' +
          'observable infrastructure.',
        fr :
          'Service central synchronisant armoires Nexess, Google Workspace, datasets Skywise et ' +
          'outils management, en modernisant du Python legacy vers une infra typée et observable.',
      },
      metrics : [
        {
          en : '30K+ jobs/day',
          fr : '30K+ jobs/jour',
        },
        {
          en : '16 plants',
          fr : '16 usines',
        },
        {
          en : '~1,000 users',
          fr : '~1 000 utilisateurs',
        },
      ],
    },
  },
  labels              : {
    certifications         : {
      en : 'Certifications',
      fr : 'Certifications',
    },
    coreStack              : {
      en : 'Core Stack',
      fr : 'Stack clé',
    },
    currentValue           : {
      en : 'Current Value',
      fr : 'Valeur actuelle',
    },
    deliveryReliability    : {
      en : 'Delivery & Reliability',
      fr : 'Delivery & fiabilité',
    },
    documentKind           : {
      en : 'CV',
      fr : 'CV',
    },
    languages              : {
      en : 'Languages',
      fr : 'Langues',
    },
    operatingMode          : {
      en : 'Operating Mode',
      fr : 'Mode de fonctionnement',
    },
    portfolioProof         : {
      en : 'Portfolio Proof',
      fr : 'Preuve portfolio',
    },
    profile                : {
      en : 'Profile',
      fr : 'Profil',
    },
    profilePhoto           : {
      en : 'profile photo',
      fr : 'photo de profil',
    },
    selectedExperience     : {
      en : 'Selected Experience',
      fr : 'Expérience sélectionnée',
    },
    selectedImpactProjects : {
      en : 'Selected Impact Projects',
      fr : 'Projets d’impact sélectionnés',
    },
  },
  languages           : [
    {
      flag  : '🇬🇧',
      label : {
        en : 'English',
        fr : 'Anglais',
      },
    },
    {
      flag  : '🇫🇷',
      label : {
        en : 'French',
        fr : 'Français',
      },
    },
    {
      flag  : '🇩🇪',
      label : {
        en : 'German',
        fr : 'Allemand',
      },
    },
  ],
  metrics             : {
    ads        : {
      en : 'ads distributed through custom ad-serving infrastructure',
      fr : 'publicités distribuées via infrastructure ad-serving maison',
    },
    jobs       : {
      en : 'aerospace orchestration jobs for Airbus smart-cabinet operations',
      fr : 'jobs d’orchestration aéronautique pour armoires Airbus',
    },
    lighthouse : {
      en : 'Lighthouse desktop / mobile score on AI-directed portfolio',
      fr : 'score Lighthouse desktop / mobile du portfolio IA-dirigé',
    },
    requests   : {
      en : 'requests handled across the managed media network',
      fr : 'requêtes traitées par le réseau média géré',
    },
    years      : {
      value : {
        en : '25+ yrs',
        fr : '25+ ans',
      },
      label : {
        en : 'production web software across product, media, operations and tooling',
        fr : 'logiciel web production sur produit, média, opérations et tooling',
      },
    },
  },
  operatingMode      : [
    {
      en : 'Clarify users, failure modes, data flows, and acceptance evidence before implementation.',
      fr : 'Clarifier utilisateurs, risques, flux de données et preuves d’acceptance avant d’implémenter.',
    },
    {
      en :
        'Modernize legacy systems through typing, logging, repeatable checks, and ' +
        'production-friendly steps.',
      fr :
        'Moderniser les systèmes legacy par typage, logging, checks répétables et étapes ' +
        'production-friendly.',
    },
    {
      en :
        'Use AI-directed workflows for specs, implementation, review, docs sync, tests, and ' +
        'quality gates.',
      fr :
        'Utiliser les workflows IA pour specs, implémentation, revue, sync docs, tests et ' +
        'quality gates.',
    },
  ],
  portfolioProof     : {
    body  : {
      en :
        'AI-directed web app turning a resume into a desktop simulator: human-owned product ' +
        'direction, architecture, review, tests, docs sync, and quality gates, with agent-assisted ' +
        'implementation across mini apps, mobile shell, prerendered SEO, optimized assets, and state.',
      fr :
        'Application web IA-dirigée transformant un CV en simulateur desktop : direction produit, ' +
        'architecture, revue, tests, sync docs et quality gates sous contrôle humain, avec agents ' +
        'sur mini-apps, shell mobile, SEO prérendu, assets optimisés et état applicatif.',
    },
    title : {
      en : 'i-technology.net desktop portfolio',
      fr : 'Portfolio desktop i-technology.net',
    },
  },
  profile            : {
    body : {
      en :
        'I build production web products where browser UX, backend APIs, databases, caching, ' +
        'observability, offline workflows, and delivery automation have to work together. AI agents ' +
        'provide implementation throughput; architecture, review, tests, docs sync, and quality gates ' +
        'stay human-owned.',
      fr :
        'Je construis des produits web de production où UX navigateur, APIs backend, bases de données, ' +
        'cache, observabilité, offline et automation delivery doivent fonctionner ensemble. Les agents IA ' +
        'apportent du débit; architecture, revue, tests, sync docs et quality gates restent sous contrôle humain.',
    },
    lead : {
      en : 'Frontend-led, not frontend-limited.',
      fr : 'Frontend-led, pas frontend-limited.',
    },
  },
  role               : {
    en :
      'Senior product-minded full-stack engineer and frontend/platform lead for complex web ' +
      'products, operational systems, developer tooling, and AI-directed delivery workflows.',
    fr :
      'Ingénieur full-stack senior orienté produit et lead frontend/platforme pour produits web complexes, ' +
      'systèmes opérationnels, tooling développeur et workflows de livraison pilotés par IA.',
  },
  topbarKicker       : {
    en : 'Product-minded full-stack / frontend platform lead',
    fr : 'Full-stack orienté produit / lead plateforme frontend',
  },
} satisfies CvCopySource

const coreStack = [
  'Python',
  'FastAPI',
  'C#',
  '.NET',
  'VueJS',
  'TypeScript',
  'HTML5',
  'CSS3',
  'Bootstrap',
  'Tailwind',
  'Symfony',
  'Quasar',
  'SQL',
  'Airtable',
  'Skywise',
] as const

const certifications = [
  getCertification('PSM'),
  getCertification('PSPO'),
  getCertification('Lean Six Sigma'),
  getCertification('Change Mgmt'),
  getCertification('Strategic Agility'),
  getCertification('Digital Transformation'),
] as const

const footerLinks = [
  {
    label : 'i-technology.net',
    href  : portfolioHref,
  },
  {
    label : 'LinkedIn',
    href  : linkedInHref,
  },
  {
    label : 'GitHub',
    href  : githubHref,
  },
  {
    label : 'X',
    href  : xHref,
  },
] as const

function localizeList(items: readonly Localized[], locale: Locale): string[] {
  return items.map(item => localized(item, locale))
}

function localizeSectionLabels(labels: CvLocalizedSectionLabels, locale: Locale): CvSectionLabels {
  return {
    certifications         : localized(labels.certifications, locale),
    coreStack              : localized(labels.coreStack, locale),
    currentValue           : localized(labels.currentValue, locale),
    deliveryReliability    : localized(labels.deliveryReliability, locale),
    documentKind           : localized(labels.documentKind, locale),
    languages              : localized(labels.languages, locale),
    operatingMode          : localized(labels.operatingMode, locale),
    portfolioProof         : localized(labels.portfolioProof, locale),
    profile                : localized(labels.profile, locale),
    profilePhoto           : localized(labels.profilePhoto, locale),
    selectedExperience     : localized(labels.selectedExperience, locale),
    selectedImpactProjects : localized(labels.selectedImpactProjects, locale),
  }
}

function localizeLanguages(languages: readonly CvLanguageSource[], locale: Locale): CvLanguage[] {
  return languages.map(language => ({
    flag  : language.flag,
    label : localized(language.label, locale),
  }))
}

function localizeExperienceCopy(copy: CvExperienceSource, locale: Locale) {
  return {
    date    : localized(copy.date, locale),
    role    : copy.role ? localized(copy.role, locale) : undefined,
    company : localized(copy.company, locale),
    bullets : localizeList(copy.bullets, locale),
  }
}

function localizeImpactProject(copy: CvImpactProjectSource, locale: Locale) {
  return {
    title   : localized(copy.title, locale),
    body    : localized(copy.body, locale),
    metrics : localizeList(copy.metrics, locale),
  }
}

function buildCvDocument(locale: Locale): CvDocument {
  const labels             = localizeSectionLabels(cvCopy.labels, locale)
  const maserCopy          = localizeExperienceCopy(cvCopy.experience.maser, locale)
  const independentCopy    = localizeExperienceCopy(cvCopy.experience.independent, locale)
  const modernizationCopy  = localizeExperienceCopy(cvCopy.experience.modernization, locale)
  const multimediaCopy     = localizeExperienceCopy(cvCopy.experience.multimedia, locale)
  const portfolioProofCopy = cvCopy.portfolioProof

  return {
    locale,
    title    : `${about.name} - ${labels.documentKind}`,
    name     : about.name,
    identity : {
      avatarSrc : 'profile_400x400.jpg',
      bannerSrc : 'x-banner-1500x500.jpeg',
    },
    labels,
    topbarKicker : localized(cvCopy.topbarKicker, locale),
    role         : localized(cvCopy.role, locale),
    contacts     : [
      {
        label : localized(cvCopy.contacts.locationLabel, locale),
        text  : localized(cvCopy.contacts.locationText, locale),
        href  : '',
      },
      {
        label : 'Portfolio',
        text  : 'i-technology.net',
        href  : portfolioHref,
      },
      {
        label : 'Email',
        text  : 'robert.hoffmann@i-technology.net',
        href  : 'mailto:robert.hoffmann@i-technology.net',
      },
      {
        label : localized(cvCopy.contacts.phoneLabel, locale),
        text  : '+33 6 49 23 44 15',
        href  : 'tel:+33649234415',
      },
    ],
    metrics      : [
      {
        value : localized(cvCopy.metrics.years.value, locale),
        label : localized(cvCopy.metrics.years.label, locale),
      },
      {
        value            : '30K+ / day',
        label            : localized(cvCopy.metrics.jobs, locale),
        sourceProjectIds : [tmipSchedulerProject.id],
      },
      {
        value            : '400M / day',
        label            : localized(cvCopy.metrics.requests, locale),
        sourceProjectIds : [chatProject.id],
      },
      {
        value            : '3B+ / month',
        label            : localized(cvCopy.metrics.ads, locale),
        sourceProjectIds : [adProxyProject.id],
      },
      {
        value            : '100 / 99',
        label            : localized(cvCopy.metrics.lighthouse, locale),
        sourceProjectIds : [portfolioProject.id],
      },
    ],
    profile             : {
      lead : localized(cvCopy.profile.lead, locale),
      body : localized(cvCopy.profile.body, locale),
    },
    coreStack,
    deliveryReliability : localizeList(cvCopy.deliveryReliability, locale),
    languages           : localizeLanguages(cvCopy.languages, locale),
    certifications,
    portfolioProof      : {
      eyebrow         : asciiDateRange(portfolioProject.period),
      title           : localized(portfolioProofCopy.title, locale),
      href            : getProjectLink(portfolioProject, 'Live site') ?? portfolioHref,
      body            : localized(portfolioProofCopy.body, locale),
      sourceProjectId : portfolioProject.id,
    },
    operatingMode      : localizeList(cvCopy.operatingMode, locale),
    currentValue       : localized(cvCopy.currentValue, locale),
    selectedExperience : [
      {
        date      : maserCopy.date,
        role      : localized(maserExperience.role, locale),
        company   : maserCopy.company,
        bullets   : maserCopy.bullets,
        sourceIds : [maserExperience.id],
      },
      {
        date      : independentCopy.date,
        role      : localized(independentExperience.role, locale),
        company   : independentCopy.company,
        bullets   : independentCopy.bullets,
        sourceIds : [independentExperience.id],
      },
      {
        date      : modernizationCopy.date,
        role      : modernizationCopy.role ?? localized(infomilExperience.role, locale),
        company   : modernizationCopy.company,
        bullets   : modernizationCopy.bullets,
        sourceIds : [infomilExperience.id, daoExperience.id, prestaliaExperience.id],
      },
      {
        date      : multimediaCopy.date,
        role      : localized(indexExperience.role, locale),
        company   : multimediaCopy.company,
        bullets   : multimediaCopy.bullets,
        sourceIds : [mmExperience.id, indexExperience.id],
      },
    ],
    impactProjects     : [
      {
        ...localizeImpactProject(cvCopy.impactProjects.media, locale),
        sourceProjectIds : [chatProject.id, adProxyProject.id],
        hasGalleryImage  : projectHasGalleryImage(chatProject.id),
      },
      {
        ...localizeImpactProject(cvCopy.impactProjects.tmipScheduler, locale),
        sourceProjectIds : [tmipSchedulerProject.id],
        hasGalleryImage  : projectHasGalleryImage(tmipSchedulerProject.id),
      },
      {
        ...localizeImpactProject(cvCopy.impactProjects.tmipLogger, locale),
        sourceProjectIds : [tmipLoggerProject.id],
        hasGalleryImage  : projectHasGalleryImage(tmipLoggerProject.id),
      },
      {
        ...localizeImpactProject(cvCopy.impactProjects.monitoring, locale),
        sourceProjectIds : [tmipSchedulerProject.id, tmipLoggerProject.id],
        hasGalleryImage  : projectHasGalleryImage(tmipLoggerProject.id),
      },
      {
        ...localizeImpactProject(cvCopy.impactProjects.healthmon, locale),
        sourceProjectIds : [healthmonProject.id],
        hasGalleryImage  : projectHasGalleryImage(healthmonProject.id),
      },
      {
        ...localizeImpactProject(cvCopy.impactProjects.compliance, locale),
        href             : getProjectLink(windProject, 'Maser Engineering: Pole Maintenance'),
        sourceProjectIds : [windProject.id, sbmProject.id, hutchinsonProject.id],
        hasGalleryImage  : projectHasGalleryImage(sbmProject.id),
      },
    ],
    footer : {
      links : footerLinks,
      text  : localized(cvCopy.footerText, locale),
    },
    visualEvidence : galleryImages.map(image => ({
      galleryImageId : image.galleryImageId,
      projectId      : image.projectId,
    })),
  }
}

export const cvDocuments = {
  en : buildCvDocument('en'),
  fr : buildCvDocument('fr'),
} satisfies Record<Locale, CvDocument>

export const cvDocument = cvDocuments.en
// #endregion Document
