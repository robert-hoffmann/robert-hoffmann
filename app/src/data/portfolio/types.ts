import type { Localized } from '../../types/desktop'

export type EvidenceLevel =
  | 'public'
  | 'private-client'
  | 'self-attested'
  | 'derived'

export type ClaimConfidence = 'high' | 'medium' | 'low'

export type SchemaKind =
  | 'CreativeWork'
  | 'SoftwareSourceCode'
  | 'WebPage'

export type SchemaVisibility =
  | 'visible'
  | 'summary-only'
  | 'exclude'

export interface SourceRef {
  id          : string
  label       : string
  type        :
    | 'client-context'
    | 'internal-evidence'
    | 'live-site'
    | 'marketplace'
    | 'package-registry'
    | 'performance-report'
    | 'profile'
    | 'public-data'
    | 'repository'
    | 'site-docs'
  url?        : string
  path?       : string
  lastChecked?: string
}

export interface ProjectVisibility {
  homepage    : boolean
  projectIndex: boolean
  projectPage : boolean
  hiringBrief : boolean
  llmsTxt     : boolean
  knowledgeJson: boolean
}

export interface ProjectHighlight {
  label            : Localized
  evidenceLevel    : EvidenceLevel
  confidence       : ClaimConfidence
  sourceRefs       : readonly string[]
  schemaVisibility : SchemaVisibility
  requiresQualifier: boolean
  qualifier?       : Localized
  lastVerified?    : string
}

export type ProjectHighlightPolicy = Omit<ProjectHighlight, 'label'>

export interface RouteMetadata {
  slug            : string
  path            : `/${string}/`
  canonicalUrl    : `https://${string}/`
  title           : Localized
  description     : Localized
  proofAngle      : Localized
  schemaKind      : SchemaKind
  includeInSitemap: boolean
  sitemapPriority : number
  changeFrequency : 'monthly' | 'yearly'
}

export interface ProjectCanonicalMetadata {
  evidenceLevel: EvidenceLevel
  confidence   : ClaimConfidence
  schemaKind   : SchemaKind
  sourceRefs   : readonly string[]
  visibility   : ProjectVisibility
  route?       : RouteMetadata
}
