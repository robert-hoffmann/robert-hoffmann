import type { Localized } from '../../types/desktop'
import { about } from '../apps/about'
import { galleryImages } from '../apps/gallery'
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

interface CvCertification extends CvLink {}

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
  imageId   : number
  projectId : ProjectId
}

export interface CvDocument {
  title             : string
  name              : string
  mark              : string
  topbarKicker      : string
  role              : string
  contacts          : readonly CvContact[]
  metrics           : readonly CvTopMetric[]
  profile           : {
    lead : string
    body : string
  }
  coreStack         : readonly string[]
  emphasisStack     : readonly string[]
  certifications    : readonly CvCertification[]
  portfolioProof    : CvPortfolioProof
  operatingMode     : readonly string[]
  currentValue      : string
  selectedExperience: readonly CvExperienceItem[]
  impactProjects    : readonly CvImpactProject[]
  footer            : {
    links : readonly CvLink[]
    text  : string
  }
  visualEvidence    : readonly CvVisualEvidence[]
}
// #endregion Types

// #region Source Helpers
const portfolioHref = 'https://i-technology.net/'

function english(value: Localized): string {
  return value.en
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

const maserExperience       = getExperience('exp-maser')
const independentExperience = getExperience('exp-independent')
const indexExperience       = getExperience('exp-index')
const mmExperience          = getExperience('exp-123mm')

const tmipSchedulerProject  = getProject('proj-tmip-scheduler')
const tmipLoggerProject     = getProject('proj-tmip-logger')
const windProject           = getProject('proj-wind-maintenance')
const sbmProject            = getProject('proj-sbm-compliance')
const hutchinsonProject     = getProject('proj-hutchinson-work-instructions')
const chatProject           = getProject('proj-chatapp')
const adProxyProject        = getProject('proj-adproxy')
const uncleBobProject       = getProject('proj-uncle-bob')
const portfolioProject      = getProject('proj-desktop-portfolio')
// #endregion Source Selections

// #region Document
export const cvDocument = {
  title        : `${about.name} - CV`,
  name         : about.name,
  mark         : 'RH',
  topbarKicker : 'Industrial software / AI-assisted delivery',
  role         :
    'Industrial Full-Stack Consultant for operational platforms, data orchestration, offline ' +
    'field apps, observability, and controlled AI-assisted software delivery.',

  contacts : [
    {
      label : 'Location',
      text  : 'France, hybrid',
      href  : '',
    },
    {
      label : 'Portfolio',
      text  : 'i-technology.net',
      href  : portfolioHref,
    },
    {
      label : 'LinkedIn',
      text  : 'linkedin.com/in/hoffmannrobert',
      href  : linkedInHref,
    },
    {
      label : 'GitHub',
      text  : 'github.com/robert-hoffmann',
      href  : githubHref,
    },
  ],

  metrics : [
    {
      value : '25+ yrs',
      label : 'production software across web, industrial, media and operations',
    },
    {
      value            : '30K+ / day',
      label            : 'industrial orchestration jobs for Airbus smart-cabinet operations',
      sourceProjectIds : [tmipSchedulerProject.id],
    },
    {
      value            : '400M / day',
      label            : 'requests handled by high-scale white-label chat platforms',
      sourceProjectIds : [chatProject.id],
    },
    {
      value            : '3B+ / month',
      label            : 'ads distributed through custom ad-serving infrastructure',
      sourceProjectIds : [adProxyProject.id],
    },
    {
      value            : '100 / 99',
      label            : 'Lighthouse desktop / mobile score on AI-built portfolio',
      sourceProjectIds : [portfolioProject.id],
    },
  ],

  profile : {
    lead : 'I turn messy operations into reliable software.',
    body :
      'Current focus: industrial data flows, traceability, field work, offline sync, ' +
      'dashboards, alerting, and engineering workflows where AI agents are used as controlled ' +
      'delivery infrastructure, not just autocomplete.',
  },

  coreStack : [
    'Python 3.12',
    'FastAPI',
    'C#',
    '.NET',
    'Vue 3',
    'TypeScript',
    'Symfony',
    'Quasar',
    'MariaDB',
    'SQLite',
    'Airtable',
    'Skywise',
    'Google Workspace',
  ],

  emphasisStack : [
    'AI Workflows',
    'Quality Gates',
    'Observability',
  ],

  certifications : [
    getCertification('PSM'),
    getCertification('PSPO'),
    getCertification('Lean Six Sigma'),
    getCertification('Change Mgmt'),
    getCertification('Strategic Agility'),
    getCertification('Digital Transformation'),
  ],

  portfolioProof : {
    eyebrow         : asciiDateRange(portfolioProject.period),
    title           : 'i-technology.net desktop portfolio',
    href            : getProjectLink(portfolioProject, 'Live site') ?? portfolioHref,
    body            :
      '100% AI-built web app turning a resume into a desktop simulator: window manager, ' +
      'mini apps, bilingual content, mobile shell, Three.js game, prerendered SEO, optimized ' +
      'assets, and persistent state.',
    sourceProjectId : portfolioProject.id,
  },

  operatingMode : [
    'Outside-in delivery: clarify users, failure modes, data flows, and acceptance evidence before polishing UI.',
    'Modernize legacy systems through typing, logging, repeatable checks, and production-friendly migration steps.',
    'Use agent workflows for research, specs, reviews, implementation, docs sync, and quality gates.',
  ],

  currentValue :
    'Best fit: industrial, aerospace, energy, compliance, training, or operational teams that ' +
    'need a senior full-stack builder who can connect systems, reduce manual work, make data ' +
    'traceable, and ship usable internal tools without losing engineering control.',

  selectedExperience : [
    {
      date      : 'Mar 2022<br>Present',
      role      : english(maserExperience.role),
      company   : `${english(maserExperience.company)} - France, hybrid`,
      bullets   : [
        'Delivered production software for Airbus, Hutchinson, SBM, Terega, CRIT, Nexess, Maser Academy, and renewable-energy teams.',
        'Built data orchestration, offline field apps, planning back offices, certification workflows, inventory systems, and observability tooling.',
        'Introduced AI-assisted engineering workflows, documentation sync, quality gates, and repeatable delivery practices.',
      ],
      sourceIds : [maserExperience.id],
    },
    {
      date      : '2019<br>Present',
      role      : english(independentExperience.role),
      company   : `${english(independentExperience.company)} - ${english(independentExperience.location)}`,
      bullets   : [
        'Advises entrepreneurs, startups, and SMEs on product strategy, automation, technical risk, ROI, and full-stack delivery.',
      ],
      sourceIds : [independentExperience.id],
    },
    {
      date      : '2003<br>2013',
      role      : english(indexExperience.role),
      company   : '123 Multimedia / Index Multimedia',
      bullets   : [
        'Built and evolved high-traffic community, chat, ad-tech, localization, and error-tracking systems for major French media brands.',
      ],
      sourceIds : [mmExperience.id, indexExperience.id],
    },
  ],

  impactProjects : [
    {
      title            : 'TMIP Scheduler - Airbus data orchestration',
      body             :
        'Central service synchronizing Nexess smart cabinets, Google Workspace, Skywise ' +
        'datasets, and management tooling while modernizing legacy Python into typed, ' +
        'observable infrastructure.',
      metrics          : [
        '30K+ jobs/day',
        '16 plants',
        '~1,000 users',
      ],
      sourceProjectIds : [tmipSchedulerProject.id],
      hasGalleryImage  : projectHasGalleryImage(tmipSchedulerProject.id),
    },
    {
      title            : 'TMIP Logger - QoS & KPI observability',
      body             :
        'Structured logging layer turning raw events into SQLite inspection, Vue operations ' +
        'views, Skywise feeds, and automated alerts for plant and job health.',
      metrics          : [
        '10x error reduction',
        '5x faster fixes',
        '~300 jobs',
      ],
      sourceProjectIds : [tmipLoggerProject.id],
      hasGalleryImage  : projectHasGalleryImage(tmipLoggerProject.id),
    },
    {
      title            : 'Offline field and compliance platforms',
      href             : getProjectLink(windProject, 'Maser maintenance'),
      body             :
        'Quasar/Vue field apps, Symfony back offices, SCORM onboarding, certification expiry, ' +
        'gate checks, queued sync, and PDF/CSV outputs for industrial teams.',
      metrics          : [
        '100s turbines',
        '117 companies',
        '10,202 steps',
      ],
      sourceProjectIds : [windProject.id, sbmProject.id, hutchinsonProject.id],
      hasGalleryImage  : projectHasGalleryImage(sbmProject.id),
    },
    {
      title            : 'High-scale web and AI workflow systems',
      href             : getProjectLink(uncleBobProject, 'Docs'),
      body             :
        'White-label chat/ad infrastructure for major media brands, plus portable agent ' +
        'workflows for quality, governance, documentation sync, and validation.',
      metrics          : [
        '400M req/day',
        '3B+ ads/month',
        '11 AI skills',
      ],
      sourceProjectIds : [chatProject.id, adProxyProject.id, uncleBobProject.id],
      hasGalleryImage  : projectHasGalleryImage(chatProject.id),
    },
  ],

  footer : {
    links : [
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
    ],
    text : `${about.name} - Industrial Full-Stack Consultant`,
  },

  visualEvidence : galleryImages.map(image => ({
    imageId   : image.imageId,
    projectId : image.projectId,
  })),
} satisfies CvDocument
// #endregion Document
