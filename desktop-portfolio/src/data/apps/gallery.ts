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
    projectId : 'proj-chatapp',
    title     : {
      en : 'tchatche.com map gallery',
      fr : 'Galerie carte tchatche.com',
    } satisfies Localized,
    summary   : {
      en :
        'Map-based user discovery interface with a photo carousel overlay from the ' +
        'white-label tchatche.com chat platform.',
      fr :
        'Interface de découverte utilisateurs sur carte avec carrousel photo, issue de la ' +
        'plateforme de chat en marque blanche tchatche.com.',
    } satisfies Localized,
    alt       : {
      en : 'tchatche.com map interface with a photo gallery modal over user listings',
      fr : 'Interface carte tchatche.com avec galerie photo au-dessus de listes utilisateurs',
    } satisfies Localized,
  },
  {
    imageId   : 2,
    projectId : 'proj-chatapp',
    title     : {
      en : 'tchatche.com profile discovery',
      fr : 'Découverte profil tchatche.com',
    } satisfies Localized,
    summary   : {
      en :
        'Map search screen with a profile popover, social counters, game ads, and the ' +
        'real-time member list used in the chat platform.',
      fr :
        'Écran de recherche cartographique avec popover profil, compteurs sociaux, publicités ' +
        'jeux et liste membres temps réel de la plateforme de chat.',
    } satisfies Localized,
    alt       : {
      en : 'tchatche.com map search screen with profile popover and member list',
      fr : 'Écran de recherche carte tchatche.com avec popover profil et liste membres',
    } satisfies Localized,
  },
  {
    imageId   : 3,
    projectId : 'proj-chatapp',
    title     : {
      en : 'NRJ white-label chat search',
      fr : 'Recherche chat marque blanche NRJ',
    } satisfies Localized,
    summary   : {
      en :
        'NRJ-branded deployment of the white-label chat system, showing regional search, ' +
        'user lists, messaging state, and advertising integration.',
      fr :
        'Déploiement NRJ du système de chat en marque blanche, avec recherche régionale, ' +
        'listes utilisateurs, état messagerie et intégration publicitaire.',
    } satisfies Localized,
    alt       : {
      en : 'NRJ branded chat search page with regional filters and user list',
      fr : 'Page de recherche chat NRJ avec filtres régionaux et liste utilisateurs',
    } satisfies Localized,
  },
  {
    imageId   : 4,
    projectId : 'proj-chatapp',
    title     : {
      en : 'TchatcheBlog community portal',
      fr : 'Portail communautaire TchatcheBlog',
    } satisfies Localized,
    summary   : {
      en :
        'Community blog portal from the tchatche.com ecosystem, including rankings, member ' +
        'promotion, search, and cross-navigation into the chat product.',
      fr :
        'Portail blog communautaire de l’écosystème tchatche.com, avec classements, promotion ' +
        'membres, recherche et navigation croisée vers le produit chat.',
    } satisfies Localized,
    alt       : {
      en : 'TchatcheBlog community portal with blog rankings and member widgets',
      fr : 'Portail communautaire TchatcheBlog avec classements blogs et widgets membres',
    } satisfies Localized,
  },
  {
    imageId   : 5,
    projectId : 'proj-desktop-portfolio',
    title     : {
      en : 'Desktop portfolio workspace',
      fr : 'Espace de travail portfolio desktop',
    } satisfies Localized,
    summary   : {
      en :
        'The portfolio shell as an interactive desktop product, combining project, about, ' +
        'media, dock, icon, and window-manager surfaces.',
      fr :
        'Le shell portfolio comme produit desktop interactif, combinant projets, à propos, ' +
        'média, dock, icônes et gestionnaire de fenêtres.',
    } satisfies Localized,
    alt       : {
      en : 'Desktop portfolio interface with several overlapping app windows and dock icons',
      fr : 'Interface portfolio desktop avec plusieurs fenêtres superposées et icônes de dock',
    } satisfies Localized,
  },
  {
    imageId   : 6,
    projectId : 'proj-parallax-designer',
    title     : {
      en : 'Parallax Designer layer editor',
      fr : 'Éditeur de calques Parallax Designer',
    } satisfies Localized,
    summary   : {
      en :
        'Browser-based visual editor for tuning scene layers, geometry, depth, and preview ' +
        'composition in the portfolio background system.',
      fr :
        'Éditeur visuel navigateur pour ajuster les calques, la géométrie, la profondeur et ' +
        'la composition preview du système de fond du portfolio.',
    } satisfies Localized,
    alt       : {
      en : 'Parallax Designer editor with canvas preview, layer stack, and geometry controls',
      fr : 'Éditeur Parallax Designer avec preview canvas, pile de calques et contrôles géométrie',
    } satisfies Localized,
  },
  {
    imageId   : 7,
    projectId : 'proj-parallax-designer',
    title     : {
      en : 'Parallax Designer architecture docs',
      fr : 'Docs architecture Parallax Designer',
    } satisfies Localized,
    summary   : {
      en :
        'Generated VitePress reference documentation showing the editor data flow, component ' +
        'hierarchy, and implementation structure behind the Parallax Designer app.',
      fr :
        'Documentation de référence VitePress générée montrant le flux de données, la hiérarchie ' +
        'des composants et la structure d’implémentation de Parallax Designer.',
    } satisfies Localized,
    alt       : {
      en : 'Parallax Designer documentation page with data flow and component hierarchy diagrams',
      fr : 'Page de documentation Parallax Designer avec diagrammes de flux et hiérarchie',
    } satisfies Localized,
  },
  {
    imageId   : 8,
    projectId : 'proj-sbm-compliance',
    title     : {
      en : 'SBM compliance dashboard',
      fr : 'Dashboard conformité SBM',
    } satisfies Localized,
    summary   : {
      en :
        'Compliance onboarding dashboard with company, user, training, registration, document, ' +
        'statistics, and administration entry points.',
      fr :
        'Dashboard d’onboarding conformité avec entrées entreprises, utilisateurs, formations, ' +
        'inscriptions, documents, statistiques et administration.',
    } satisfies Localized,
    alt       : {
      en : 'SBM compliance dashboard with administration cards and profile side menu',
      fr : 'Dashboard conformité SBM avec cartes d’administration et menu latéral profil',
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
  'oklch(60% 0.16 120)',
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
