import type { Localized } from '../../types/desktop'
import type { MessageCatalog } from '../interface'

// #region Messages
export const aboutMessages = {
  'about.certifications' : {
    en : 'Process literacy / Certifications',
    fr : 'Culture process / Certifications',
  },
} satisfies MessageCatalog
// #endregion Messages

// #region Content
export const about = {
  name        : 'Robert Hoffmann',
  tagline     : {
    en : 'Senior Product-Minded Full-Stack Engineer · Frontend & Platform Lead',
    fr : 'Ingénieur full-stack senior orienté produit · Lead frontend & plateforme',
  } satisfies Localized,
  photo       : `${import.meta.env.BASE_URL}profile-avatar-80.avif`,
  photoSrcSet : [
    `${import.meta.env.BASE_URL}profile-avatar-80.avif 1x`,
    `${import.meta.env.BASE_URL}profile-avatar-160.avif 2x`,
    `${import.meta.env.BASE_URL}profile-avatar-240.avif 3x`,
  ].join(', '),

  aiCallout : {
    en :
      'I use AI agents for implementation throughput inside an AI-directed, human-owned ' +
      'delivery system. Product direction, architecture, acceptance criteria, review, tests, ' +
      'docs sync, and quality gates stay under my control.',
    fr :
      'J\u2019utilise les agents IA pour accélérer l\u2019implémentation dans un système de livraison ' +
      'piloté par IA et contrôlé humainement. Direction produit, architecture, critères ' +
      'd\u2019acceptation, revue, tests, sync docs et quality gates restent sous mon contrôle.',
  } satisfies Localized,

  summary : {
    en :
      'I\u2019ve spent 25+ years building production software that has to survive real traffic, ' +
      'real users, and real operational constraints. I am frontend-led, not frontend-limited: ' +
      'my work spans ~125K req/s chat-cluster peaks, a 400M req/day managed media network, ' +
      '3B+ impressions/month ad systems, backend APIs, databases, caching, observability, ' +
      'offline field apps, and developer tooling.',
    fr :
      'En 25+ ans, j\u2019ai construit des logiciels de production qui doivent tenir face au ' +
      'vrai trafic, aux vrais utilisateurs et aux vraies contraintes opérationnelles. Je suis ' +
      'frontend-led, pas frontend-limited : mon travail couvre des pics cluster chat à ' +
      '~125K req/s, un réseau média géré à 400M req/jour, des systèmes publicitaires à ' +
      '3Md+ impressions/mois, APIs backend, bases de données, cache, observabilité, apps ' +
      'terrain hors ligne et outils développeurs.',
  } satisfies Localized,

  expertise : [
    {
      en : 'Product Architecture',
      fr : 'Architecture produit',
    },
    {
      en : 'Product Engineering',
      fr : 'Ingénierie produit',
    },
    {
      en : 'High-Traffic Applications',
      fr : 'Applications à fort trafic',
    },
    {
      en : 'Backend APIs',
      fr : 'APIs backend',
    },
    {
      en : 'Databases',
      fr : 'Bases de données',
    },
    {
      en : 'Observability & Traceability',
      fr : 'Observabilité & traçabilité',
    },
    {
      en : 'AI-Directed Delivery',
      fr : 'Livraison pilotée par IA',
    },
    {
      en : 'VueJS',
      fr : 'VueJS',
    },
    {
      en : 'TypeScript',
      fr : 'TypeScript',
    },
    {
      en : 'Python',
      fr : 'Python',
    },
    {
      en : '.NET',
      fr : '.NET',
    },
  ] satisfies Localized[],

  certifications : [
    {
      label  : 'PSM',
      issuer : 'Scrum.org',
      icon   : 'scrum',
      href   : 'https://www.scrum.org/user/614185',
    },
    {
      label  : 'PSPO',
      issuer : 'Scrum.org',
      icon   : 'scrum',
      href   : 'https://www.scrum.org/user/614185',
    },
    {
      label  : 'Lean Six Sigma',
      issuer : 'LinkedIn',
      icon   : 'linkedin',
      href   : 'https://www.linkedin.com/learning/certificates/ea7aeab9046a8a37af23a00a2e3b3263b1bae86059bb2a14f387156da1f13d12',
    },
    {
      label  : 'Change Mgmt',
      issuer : 'LinkedIn',
      icon   : 'linkedin',
      href   : 'https://www.linkedin.com/learning/certificates/809c54d4c06ee8f5b9ffadb06cc25f134ece32146c02c38de5e920a5cf4089c9',
    },
    {
      label  : 'Strategic Agility',
      issuer : 'LinkedIn',
      icon   : 'linkedin',
      href   : 'https://www.linkedin.com/learning/certificates/194ee73337c919c6fb56a526beccfa78dd1325ee81142777769e4c5a7e1d196f',
    },
    {
      label  : 'Digital Transformation',
      issuer : 'LinkedIn',
      icon   : 'linkedin',
      href   : 'https://www.linkedin.com/learning/certificates/366ab1cc56e81f92e057968e0441ac6515cf33e09b4e3ad461ec479ac84635d0',
    },
    {
      label  : 'Digital Strategy',
      issuer : 'LinkedIn',
      icon   : 'linkedin',
      href   : 'https://www.linkedin.com/learning/certificates/0f87d3ffb057ac3c06c32372af91009d9bb03b48ad6970f0eb6f61d70c6872ca',
    },
  ],

  links : [
    { label : 'GitHub',   href : 'https://github.com/robert-hoffmann' },
    { label : 'LinkedIn', href : 'https://www.linkedin.com/in/hoffmannrobert' },
    { label : 'X',        href : 'https://x.com/itechnologynet' },
  ],
} as const
// #endregion Content
