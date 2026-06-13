import type { SourceRef } from './types'

export const canonicalSourceRefs = [
  {
    id    : 'portfolio-source',
    label : 'Typed portfolio project records',
    type  : 'internal-evidence',
    path  : 'app/src/data/apps/projects.ts',
  },
  {
    id    : 'cv-source',
    label : 'Generated CV source data',
    type  : 'internal-evidence',
    path  : 'app/src/data/docs/cv.ts',
  },
  {
    id    : 'career-evidence',
    label : 'Career and delivery evidence curated for this portfolio',
    type  : 'internal-evidence',
    path  : 'app/src/data/apps/projects.ts',
  },
  {
    id    : 'client-delivery',
    label : 'Client delivery evidence from professional project records',
    type  : 'client-context',
    path  : 'app/src/data/apps/projects.ts',
  },
  {
    id    : 'portfolio-live',
    label : 'i-technology.net live portfolio',
    type  : 'live-site',
    url   : 'https://i-technology.net/',
  },
  {
    id    : 'github-profile',
    label : 'Robert Hoffmann GitHub profile',
    type  : 'profile',
    url   : 'https://github.com/robert-hoffmann',
  },
  {
    id    : 'linkedin-profile',
    label : 'Robert Hoffmann LinkedIn profile',
    type  : 'profile',
    url   : 'https://www.linkedin.com/in/hoffmannrobert',
  },
  {
    id    : 'x-profile',
    label : 'i-technology.net X profile',
    type  : 'profile',
    url   : 'https://x.com/itechnologynet',
  },
  {
    id    : 'scrum-profile',
    label : 'Scrum.org certification profile',
    type  : 'profile',
    url   : 'https://www.scrum.org/user/614185',
  },
  {
    id          : 'pagespeed-mobile',
    label       : 'Google PageSpeed mobile result',
    type        : 'performance-report',
    url         : 'https://pagespeed.web.dev/analysis/https-i-technology-net/vahahakfk6?form_factor=mobile',
    lastChecked : '2026-06-13',
  },
  {
    id          : 'pagespeed-desktop',
    label       : 'Google PageSpeed desktop result',
    type        : 'performance-report',
    url         : 'https://pagespeed.web.dev/analysis/https-i-technology-net/vahahakfk6?form_factor=desktop',
    lastChecked : '2026-06-13',
  },
  {
    id    : 'uncle-bob-docs',
    label : 'Uncle Bob documentation site',
    type  : 'site-docs',
    url   : 'https://robert-hoffmann.github.io/uncle-bob/',
  },
  {
    id    : 'uncle-bob-github',
    label : 'Uncle Bob GitHub repository',
    type  : 'repository',
    url   : 'https://github.com/robert-hoffmann/uncle-bob',
  },
  {
    id    : 'parallax-live',
    label : 'Parallax Designer live app',
    type  : 'live-site',
    url   : 'https://robert-hoffmann.github.io/parallax-designer/',
  },
  {
    id    : 'parallax-docs',
    label : 'Parallax Designer documentation',
    type  : 'site-docs',
    url   : 'https://robert-hoffmann.github.io/parallax-designer/docs/',
  },
  {
    id    : 'parallax-github',
    label : 'Parallax Designer GitHub repository',
    type  : 'repository',
    url   : 'https://github.com/robert-hoffmann/parallax-designer',
  },
  {
    id          : 'headjs-docs',
    label       : 'HeadJS documentation site',
    type        : 'site-docs',
    url         : 'https://headjs.github.io/',
    lastChecked : '2026-06-13',
  },
  {
    id          : 'headjs-github',
    label       : 'HeadJS GitHub repository',
    type        : 'repository',
    url         : 'https://github.com/headjs/headjs',
    lastChecked : '2026-06-13',
  },
  {
    id          : 't4resx-nuget',
    label       : 'T4ResX NuGet package',
    type        : 'package-registry',
    url         : 'https://www.nuget.org/packages/T4ResX',
    lastChecked : '2026-06-13',
  },
  {
    id          : 't4resx-marketplace',
    label       : 'T4ResX Visual Studio Marketplace listing',
    type        : 'marketplace',
    url         : 'https://marketplace.visualstudio.com/items?itemName=RobertHoffmann.T4ResX',
    lastChecked : '2026-06-13',
  },
  {
    id    : 't4resx-github',
    label : 'T4ResX GitHub repository',
    type  : 'repository',
    url   : 'https://github.com/itechnology/T4ResX',
  },
  {
    id          : 'findunused-marketplace',
    label       : 'FindUnusedFiles Visual Studio Marketplace listing',
    type        : 'marketplace',
    url         : 'https://marketplace.visualstudio.com/items?itemName=RobertHoffmann.FindUnusedFiles',
    lastChecked : '2026-06-13',
  },
  {
    id    : 'jsonraw-github',
    label : 'JsonRaw GitHub repository',
    type  : 'repository',
    url   : 'https://github.com/itechnology/JsonRaw',
  },
  {
    id    : 'phantomui-github',
    label : 'PhantomUI GitHub repository',
    type  : 'repository',
    url   : 'https://github.com/itechnology/PhantomUI',
  },
  {
    id    : 'jquery-mario-demo',
    label : 'jQuery Mario demo',
    type  : 'live-site',
    url   : 'https://itechnology.github.io/jQuery.Mario/#game',
  },
  {
    id    : 'jquery-mario-github',
    label : 'jQuery Mario GitHub repository',
    type  : 'repository',
    url   : 'https://github.com/itechnology/jQuery.Mario',
  },
  {
    id          : 'public-health-data-gouv',
    label       : 'Public health analytics data.gouv.fr reuse',
    type        : 'public-data',
    url         : 'https://www.data.gouv.fr/reuses/stats-covid-france',
    lastChecked : '2026-06-13',
  },
] satisfies readonly SourceRef[]

export type CanonicalSourceRefId = (typeof canonicalSourceRefs)[number]['id']

export const canonicalSourceRefIds = new Set<string>(
  canonicalSourceRefs.map(source => source.id),
)
