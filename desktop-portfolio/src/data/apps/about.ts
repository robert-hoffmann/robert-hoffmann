import type { Localized } from '../../types/desktop'
import type { MessageCatalog } from '../interface'

// #region Messages
export const aboutMessages = {
  'about.certifications' : {
    en : 'Certifications',
    fr : 'Certifications',
  },
} satisfies MessageCatalog
// #endregion Messages

// #region Content
export const about = {
  name     : 'Robert Hoffmann',
  tagline  : {
    en : 'Full-Stack Consultant · Industrial Software · AI Workflows',
    fr : 'Consultant Full-Stack · Logiciels industriels · Workflows IA',
  } satisfies Localized,
  photo    : `${import.meta.env.BASE_URL}profile-avatar-80.avif`,
  photoSrcSet : [
    `${import.meta.env.BASE_URL}profile-avatar-80.avif 1x`,
    `${import.meta.env.BASE_URL}profile-avatar-160.avif 2x`,
    `${import.meta.env.BASE_URL}profile-avatar-240.avif 3x`,
  ].join(', '),

  aiCallout : {
    en :
      'I use AI agents as part of the engineering workflow, not just as autocomplete: ' +
      'research, specs, code review, implementation, documentation sync, quality gates, ' +
      'and repeatable delivery systems. The goal is not novelty; it is faster, clearer, ' +
      'more controlled software delivery.',
    fr :
      'J\u2019utilise les agents IA comme partie intégrante du workflow d\u2019ingénierie, pas ' +
      'seulement comme autocomplétion : recherche, specs, revue de code, implémentation, ' +
      'synchronisation documentaire, quality gates et systèmes de livraison répétables. ' +
      'Le but n\u2019est pas la nouveauté ; c\u2019est une livraison logicielle plus rapide, plus ' +
      'claire et mieux contrôlée.',
  } satisfies Localized,

  summary : {
    en :
      'I\u2019ve spent 25+ years building software that has to survive real traffic, real ' +
      'operations, and real users: white-label chat platforms handling 400M requests/day, ' +
      'ad systems serving 3B+ impressions/month, offline field apps for industrial teams, ' +
      'and data orchestration systems running 30K+ jobs/day. Today I focus on industrial ' +
      'software, operational platforms, observability, and AI-assisted engineering workflows.',
    fr :
      'En 25+ ans, j\u2019ai construit des logiciels qui doivent tenir face au vrai trafic, ' +
      'aux vraies opérations et aux vrais utilisateurs : plateformes de chat en marque ' +
      'blanche traitant 400M de requêtes/jour, régies publicitaires servant 3Md+ ' +
      'd\u2019impressions/mois, apps terrain hors ligne pour équipes industrielles et systèmes ' +
      'd\u2019orchestration de données exécutant 30K+ jobs/jour. Aujourd\u2019hui, je me concentre ' +
      'sur les logiciels industriels, plateformes opérationnelles, l\u2019observabilité et les ' +
      'workflows d\u2019ingénierie assistés par IA.',
  } satisfies Localized,

  expertise : [
    { en : 'AI Workflows & Agents',          fr : 'Workflows IA & Agents' },
    { en : 'Industrial Software',            fr : 'Logiciels industriels' },
    { en : 'Offline Field Apps',             fr : 'Apps terrain hors ligne' },
    { en : 'Data Orchestration',             fr : 'Orchestration de données' },
    { en : 'Vue · Python · Symfony · .NET',  fr : 'Vue · Python · Symfony · .NET' },
    { en : 'Observability & Traceability',   fr : 'Observabilité & traçabilité' },
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
