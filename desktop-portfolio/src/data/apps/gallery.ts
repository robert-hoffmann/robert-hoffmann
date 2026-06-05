import type { Localized } from '../../types/desktop'
import type { MessageCatalog } from '../interface'
import type { ProjectId } from './projects'

// #region Messages
export const galleryMessages = {
  'imageViewer.previous'    : {
    en : 'previous',
    fr : 'précédent',
  },
  'imageViewer.next'        : {
    en : 'next',
    fr : 'suivant',
  },
  'imageViewer.thumbnails'  : {
    en : 'Project thumbnails',
    fr : 'Miniatures des projets',
  },
  'imageViewer.thumbnail'   : {
    en : 'Show image {index}: {title}',
    fr : 'Afficher image {index} : {title}',
  },
  'imageViewer.projectInfo' : {
    en : 'Project Info',
    fr : 'Infos projet',
  },
} satisfies MessageCatalog
// #endregion Messages

// #region Content
export interface GalleryImageContent {
  imageId   : number
  projectId : ProjectId
  title     : Localized
  summary   : Localized
  alt       : Localized
}

export const galleryImages = [
  {
    imageId   : 1,
    projectId : 'proj-tmip-scheduler',
    title     : {
      en : 'TMIP Scheduler gallery sample',
      fr : 'Exemple galerie TMIP Scheduler',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 01 for the TMIP Scheduler project gallery.',
      fr : 'Image temporaire numéro 01 pour la galerie du projet TMIP Scheduler.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 01',
      fr : 'Image temporaire numérotée 01',
    } satisfies Localized,
  },
  {
    imageId   : 2,
    projectId : 'proj-uncle-bob',
    title     : {
      en : 'Uncle Bob gallery sample',
      fr : 'Exemple galerie Uncle Bob',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 02 for the Uncle Bob workflow system gallery.',
      fr : 'Image temporaire numéro 02 pour la galerie du système Uncle Bob.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 02',
      fr : 'Image temporaire numérotée 02',
    } satisfies Localized,
  },
  {
    imageId   : 3,
    projectId : 'proj-tmip-logger',
    title     : {
      en : 'TMIP Logger gallery sample',
      fr : 'Exemple galerie TMIP Logger',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 03 for the TMIP Logger observability gallery.',
      fr : 'Image temporaire numéro 03 pour la galerie observabilité TMIP Logger.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 03',
      fr : 'Image temporaire numérotée 03',
    } satisfies Localized,
  },
  {
    imageId   : 4,
    projectId : 'proj-sbm-compliance',
    title     : {
      en : 'SBM compliance gallery sample',
      fr : 'Exemple galerie conformité SBM',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 04 for the compliance onboarding gallery.',
      fr : 'Image temporaire numéro 04 pour la galerie onboarding conformité.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 04',
      fr : 'Image temporaire numérotée 04',
    } satisfies Localized,
  },
  {
    imageId   : 5,
    projectId : 'proj-desktop-portfolio',
    title     : {
      en : 'Desktop Portfolio gallery sample',
      fr : 'Exemple galerie Desktop Portfolio',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 05 for the desktop portfolio gallery.',
      fr : 'Image temporaire numéro 05 pour la galerie du portfolio desktop.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 05',
      fr : 'Image temporaire numérotée 05',
    } satisfies Localized,
  },
  {
    imageId   : 6,
    projectId : 'proj-parallax-designer',
    title     : {
      en : 'Parallax Designer gallery sample',
      fr : 'Exemple galerie Parallax Designer',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 06 for the Parallax Designer gallery.',
      fr : 'Image temporaire numéro 06 pour la galerie Parallax Designer.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 06',
      fr : 'Image temporaire numérotée 06',
    } satisfies Localized,
  },
  {
    imageId   : 7,
    projectId : 'proj-hutchinson-work-instructions',
    title     : {
      en : 'Work instructions gallery sample',
      fr : 'Exemple galerie instructions de travail',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 07 for the digital work instructions gallery.',
      fr : 'Image temporaire numéro 07 pour la galerie instructions de travail digitales.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 07',
      fr : 'Image temporaire numérotée 07',
    } satisfies Localized,
  },
  {
    imageId   : 8,
    projectId : 'proj-chatapp',
    title     : {
      en : 'Chat platform gallery sample',
      fr : 'Exemple galerie plateforme chat',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 08 for the white-label chat platform gallery.',
      fr : 'Image temporaire numéro 08 pour la galerie plateforme de chat en marque blanche.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 08',
      fr : 'Image temporaire numérotée 08',
    } satisfies Localized,
  },
  {
    imageId   : 9,
    projectId : 'proj-adproxy',
    title     : {
      en : 'Ad Proxy gallery sample',
      fr : 'Exemple galerie Ad Proxy',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 09 for the ad-distribution server gallery.',
      fr : 'Image temporaire numéro 09 pour la galerie serveur de distribution publicitaire.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 09',
      fr : 'Image temporaire numérotée 09',
    } satisfies Localized,
  },
  {
    imageId   : 10,
    projectId : 'proj-t4resx',
    title     : {
      en : 'T4ResX gallery sample',
      fr : 'Exemple galerie T4ResX',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 10 for the localization tooling gallery.',
      fr : 'Image temporaire numéro 10 pour la galerie outillage de localisation.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 10',
      fr : 'Image temporaire numérotée 10',
    } satisfies Localized,
  },
  {
    imageId   : 11,
    projectId : 'proj-headjs',
    title     : {
      en : 'HeadJS gallery sample',
      fr : 'Exemple galerie HeadJS',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 11 for the HeadJS open-source library gallery.',
      fr : 'Image temporaire numéro 11 pour la galerie bibliothèque open source HeadJS.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 11',
      fr : 'Image temporaire numérotée 11',
    } satisfies Localized,
  },
  {
    imageId   : 12,
    projectId : 'proj-wind-maintenance',
    title     : {
      en : 'Wind maintenance gallery sample',
      fr : 'Exemple galerie maintenance éolienne',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 12 for the wind maintenance operations gallery.',
      fr : 'Image temporaire numéro 12 pour la galerie opérations de maintenance éolienne.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 12',
      fr : 'Image temporaire numérotée 12',
    } satisfies Localized,
  },
  {
    imageId   : 13,
    projectId : 'proj-attendance-billing',
    title     : {
      en : 'Attendance billing gallery sample',
      fr : 'Exemple galerie pointage facturation',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 13 for the attendance and invoicing gallery.',
      fr : 'Image temporaire numéro 13 pour la galerie pointage et facturation.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 13',
      fr : 'Image temporaire numérotée 13',
    } satisfies Localized,
  },
  {
    imageId   : 14,
    projectId : 'proj-maser-academy-inventory',
    title     : {
      en : 'Maser Academy gallery sample',
      fr : 'Exemple galerie Maser Academy',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 14 for the Maser Academy inventory gallery.',
      fr : 'Image temporaire numéro 14 pour la galerie inventaire Maser Academy.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 14',
      fr : 'Image temporaire numérotée 14',
    } satisfies Localized,
  },
  {
    imageId   : 15,
    projectId : 'proj-roland-garros-navigation',
    title     : {
      en : 'Roland-Garros gallery sample',
      fr : 'Exemple galerie Roland-Garros',
    } satisfies Localized,
    summary   : {
      en : 'Temporary numbered image 15 for the staff navigation gallery.',
      fr : 'Image temporaire numéro 15 pour la galerie guidage du personnel.',
    } satisfies Localized,
    alt       : {
      en : 'Numbered placeholder image 15',
      fr : 'Image temporaire numérotée 15',
    } satisfies Localized,
  },
] satisfies readonly [GalleryImageContent, ...GalleryImageContent[]]
// #endregion Content

// #region Slides
export interface ImageViewerSlide {
  id        : string
  imageId   : number
  projectId : ProjectId
  title     : Localized
  summary   : Localized
  image     : {
    src    : string
    width  : number
    height : number
    alt    : Localized
  }
  thumbnail : {
    src    : string
    width  : number
    height : number
  }
  accent    : string
}

const baseUrl        = import.meta.env.BASE_URL
const galleryBaseUrl = `${baseUrl}image-gallery`
const sampleAccents  = [
  'oklch(62% 0.17 255)',
  'oklch(64% 0.16 155)',
  'oklch(62% 0.19 25)',
  'oklch(60% 0.18 295)',
  'oklch(68% 0.18 60)',
  'oklch(64% 0.16 205)',
  'oklch(62% 0.19 350)',
  'oklch(60% 0.18 270)',
  'oklch(66% 0.16 135)',
  'oklch(70% 0.16 82)',
  'oklch(62% 0.17 305)',
  'oklch(62% 0.14 180)',
  'oklch(58% 0.18 20)',
  'oklch(58% 0.16 250)',
  'oklch(68% 0.15 75)',
] satisfies readonly [string, ...string[]]

function padGalleryIndex(index: number) {
  return String(index).padStart(2, '0')
}

function createGallerySlide(content: GalleryImageContent): ImageViewerSlide {
  const paddedIndex = padGalleryIndex(content.imageId)

  return {
    id        : `gallery-${paddedIndex}`,
    imageId   : content.imageId,
    projectId : content.projectId,
    title     : content.title,
    summary   : content.summary,
    image     : {
      src    : `${galleryBaseUrl}/images/${paddedIndex}.webp`,
      width  : 1600,
      height : 1000,
      alt    : content.alt,
    },
    thumbnail : {
      src    : `${galleryBaseUrl}/thumbs/${paddedIndex}.webp`,
      width  : 360,
      height : 360,
    },
    accent    : sampleAccents[content.imageId - 1] ?? sampleAccents[0],
  }
}

const [firstGalleryImage, ...remainingGalleryImages] = galleryImages

export const imageViewerSlides = [
  createGallerySlide(firstGalleryImage),
  ...remainingGalleryImages.map(createGallerySlide),
] satisfies readonly [ImageViewerSlide, ...ImageViewerSlide[]]
// #endregion Slides
