import type { Localized } from '../../types/desktop'
import { publicAssetUrl } from '../../utils/publicAssets'
import type { MessageCatalog } from '../interface'
import type { ProjectId } from './projects'

// #region Messages
export const galleryMessages = {
  'imageViewer.previous'              : {
    en : 'previous',
    fr : 'précédent',
  },
  'imageViewer.next'                  : {
    en : 'next',
    fr : 'suivant',
  },
  'imageViewer.thumbnails'            : {
    en : 'Project thumbnails',
    fr : 'Miniatures des projets',
  },
  'imageViewer.thumbnail'             : {
    en : 'Show image {index}: {title}',
    fr : 'Afficher image {index} : {title}',
  },
  'imageViewer.projectInfo'           : {
    en : 'Project Info',
    fr : 'Infos projet',
  },
  'imageViewer.fullscreenOpen'        : {
    en : 'Open full-screen image',
    fr : 'Afficher l’image en plein écran',
  },
  'imageViewer.fullscreenClose'       : {
    en : 'Close full-screen image',
    fr : 'Fermer l’image en plein écran',
  },
  'imageViewer.fullscreenCloseText'   : {
    en : 'Close',
    fr : 'Fermer',
  },
  'imageViewer.fullscreenMobileHint'  : {
    en : 'Pinch to zoom. &#8595; to close.',
    fr : 'Pincez pour zoomer. &#8595; pour fermer.',
  },
} satisfies MessageCatalog
// #endregion Messages

// #region Content
export type ProjectScopedGalleryImageId = `${ProjectId}-${number}`

export const galleryImageDisplayOrder = [
  'proj-chatapp-1',
  'proj-chatapp-2',
  'proj-chatapp-3',
  'proj-chatapp-4',
  'proj-chatapp-5',
  'proj-desktop-portfolio-1',
  'proj-parallax-designer-1',
  'proj-parallax-designer-2',
  'proj-sbm-compliance-1',
  'proj-tmip-logger-1',
  'proj-tmip-logger-2',
  'proj-tmip-logger-3',
  'proj-hutchinson-work-instructions-1',
  'proj-hutchinson-work-instructions-2',
  'proj-wind-maintenance-1',
  'proj-wind-maintenance-2',
  'proj-attendance-billing-1',
  'proj-attendance-billing-2',
  'proj-roland-garros-navigation-1',
] satisfies readonly [ProjectScopedGalleryImageId, ...ProjectScopedGalleryImageId[]]

export type GalleryImageId = (typeof galleryImageDisplayOrder)[number]

interface GalleryImageContentEntry {
  projectId : ProjectId
  title     : Localized
  summary   : Localized
  alt       : Localized
}

export interface GalleryImageContent extends GalleryImageContentEntry {
  galleryImageId : GalleryImageId
}

const galleryImageContentById = {
  'proj-chatapp-1'              : {
    projectId : 'proj-chatapp',
    title     : {
      en : 'TchaTche: Magazine',
      fr : 'TchaTche: Magazine',
    } satisfies Localized,
    summary   : {
      en :
        'Magazine cover from the broader tchatche.com media ecosystem. My work focused on ' +
        'the main site, user blogs, and dedicated/white-label chat apps, including responsive ' +
        'versions and Facebook integration.',
      fr :
        'Couverture magazine issue de l’écosystème média tchatche.com. Mon travail portait ' +
        'sur le site principal, les blogs utilisateurs et les apps chat dédiées / marque ' +
        'blanche, avec versions responsive et intégration Facebook.',
    } satisfies Localized,
    alt       : {
      en :
        'TchaTche magazine cover with pop music, cinema, games, mobile logos and ringtones, ' +
        'sport, and SMS bonus callouts',
      fr :
        'Couverture du magazine TchaTche avec musique pop, cinéma, jeux, logos et sonneries ' +
        'mobile, sport et bonus SMS',
    } satisfies Localized,
  },
  'proj-chatapp-2'              : {
    projectId : 'proj-chatapp',
    title     : {
      en : 'TchaTche: Gallery (chat)',
      fr : 'TchaTche: Galerie (chats)',
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
  'proj-chatapp-3'              : {
    projectId : 'proj-chatapp',
    title     : {
      en : 'TchaTche: GeoLocalization (chat)',
      fr : 'TchaTche: Géolocalisation (chats)',
    } satisfies Localized,
    summary   : {
      en :
        'Map search with a profile popover, social counters, game ads, and the ' +
        'real-time member list used in the chat platform. (integrated MaxMind geolocation)',
      fr :
        'Écran de recherche avec popover profil, compteurs sociaux, publicités ' +
        'jeux et liste membres temps réel de la plateforme de chat. (géolocalisation MaxMind intégrée)',
    } satisfies Localized,
    alt       : {
      en : 'tchatche.com map search screen with profile popover and member list',
      fr : 'Écran de recherche carte tchatche.com avec popover profil et liste membres',
    } satisfies Localized,
  },
  'proj-chatapp-4'              : {
    projectId : 'proj-chatapp',
    title     : {
      en : 'TchaTche: NRJ (white label)',
      fr : 'TchaTche: NRJ (marque blanche)',
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
  'proj-chatapp-5'              : {
    projectId : 'proj-chatapp',
    title     : {
      en : 'TchaTche: Blogs',
      fr : 'TchaTche: Blogs',
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
  'proj-desktop-portfolio-1'    : {
    projectId : 'proj-desktop-portfolio',
    title     : {
      en : 'Work Portfolio',
      fr : 'Portfolio de travail',
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
  'proj-parallax-designer-1'    : {
    projectId : 'proj-parallax-designer',
    title     : {
      en : 'Parallax Designer (interface)',
      fr : 'Parallax Designer (interface)',
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
  'proj-parallax-designer-2'    : {
    projectId : 'proj-parallax-designer',
    title     : {
      en : 'Parallax Designer (documentation)',
      fr : 'Parallax Designer (documentation)',
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
  'proj-sbm-compliance-1'       : {
    projectId : 'proj-sbm-compliance',
    title     : {
      en : 'SBM: Compliance Dashboard',
      fr : 'SBM : Dashboard de conformité',
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

  'proj-tmip-logger-1'                  : {
    projectId : 'proj-tmip-logger',
    title     : {
      en : 'TMIP Logger: Metadata Inspector',
      fr : 'TMIP Logger : inspecteur de métadonnées',
    } satisfies Localized,
    summary   : {
      en :
        'Log inspection view showing a failed Google Drive job beside performance events, ' +
        'with a metadata modal exposing the program, widget, and folder context needed to ' +
        'diagnose the error.',
      fr :
        'Vue d’inspection des logs montrant un job Google Drive en échec à côté d’événements ' +
        'de performance, avec une fenêtre de métadonnées exposant le programme, le widget et ' +
        'le dossier nécessaires au diagnostic.',
    } satisfies Localized,
    alt       : {
      en :
        'TMIP Logger table with error and performance rows and a metadata details modal for ' +
        'a failed archive job',
      fr :
        'Table TMIP Logger avec lignes d’erreur et de performance et fenêtre de métadonnées ' +
        'pour un job d’archivage en échec',
    } satisfies Localized,
  },
  'proj-tmip-logger-2'                  : {
    projectId : 'proj-tmip-logger',
    title     : {
      en : 'TMIP Logger: Filter Panel',
      fr : 'TMIP Logger : panneau de filtres',
    } satisfies Localized,
    summary   : {
      en :
        'Expanded filter panel for narrowing high-volume SQLite log records by level, run, ' +
        'batch, job, program, operation state, duration, exception details, metadata, and time ' +
        'window.',
      fr :
        'Panneau de filtres étendu pour réduire un volume élevé de logs SQLite par niveau, ' +
        'run, batch, job, programme, état d’opération, durée, détails d’exception, métadonnées ' +
        'et fenêtre temporelle.',
    } satisfies Localized,
    alt       : {
      en : 'TMIP Logger filter panel above a log table with operation and exception filters visible',
      fr :
        'Panneau de filtres TMIP Logger au-dessus d’une table de logs avec filtres d’opération ' +
        'et d’exception visibles',
    } satisfies Localized,
  },
  'proj-tmip-logger-3'                  : {
    projectId : 'proj-tmip-logger',
    title     : {
      en : 'TMIP Logger: Error Spike Alert',
      fr : 'TMIP Logger : alerte de pics d’erreurs',
    } satisfies Localized,
    summary   : {
      en :
        'Automated email report grouping error spikes by operation, time bucket, count, ' +
        'impacted program, job, message, metadata, and exception details when alert thresholds ' +
        'are crossed.',
      fr :
        'Rapport email automatisé regroupant les pics d’erreurs par opération, fenêtre ' +
        'temporelle, volume, programme impacté, job, message, métadonnées et détails ' +
        'd’exception lorsque les seuils d’alerte sont dépassés.',
    } satisfies Localized,
    alt       : {
      en : 'Email report titled Log Error Spike Report with parameters and an error spike table',
      fr : 'Rapport email intitulé Log Error Spike Report avec paramètres et table de pics d’erreurs',
    } satisfies Localized,
  },
  'proj-hutchinson-work-instructions-1' : {
    projectId : 'proj-hutchinson-work-instructions',
    title     : {
      en : 'Hutchinson: Operator Work Step',
      fr : 'Hutchinson : étape opérateur',
    } satisfies Localized,
    summary   : {
      en :
        'Tablet work-instruction screen used at the workstation, combining step progress, ' +
        'safety/tool reminders, annotated part imagery, blueprint/video access, and ' +
        'glove-friendly navigation controls.',
      fr :
        'Écran tablette d’instruction utilisé au poste de travail, combinant progression de ' +
        'l’étape, rappels sécurité/outils, image annotée de la pièce, accès plan/vidéo et ' +
        'contrôles adaptés à l’usage avec gants.',
    } satisfies Localized,
    alt       : {
      en :
        'Tablet work instruction screen for a lower-shell step with annotated ' +
        'part photo and tool icons',
      fr :
        'Écran tablette d’instruction pour une étape lower shell avec photo ' +
        'annotée de pièce et icônes d’outils',
    } satisfies Localized,
  },
  'proj-hutchinson-work-instructions-2' : {
    projectId : 'proj-hutchinson-work-instructions',
    title     : {
      en : 'Hutchinson: Blueprint Viewer',
      fr : 'Hutchinson : visionneuse de plan',
    } satisfies Localized,
    summary   : {
      en :
        'In-app blueprint viewer giving operators access to technical drawings without leaving ' +
        'the work-instruction flow, including zoom controls for assembly details.',
      fr :
        'Visionneuse de plan intégrée donnant aux opérateurs accès aux dessins techniques sans ' +
        'quitter le flux d’instruction, avec contrôles de zoom pour les détails d’assemblage.',
    } satisfies Localized,
    alt       : {
      en : 'Blueprint viewer showing a technical drawing of an aircraft cooling duct with zoom controls',
      fr :
        'Visionneuse de plan affichant le dessin technique d’un conduit de refroidissement ' +
        'aéronautique avec contrôles de zoom',
    } satisfies Localized,
  },
  'proj-wind-maintenance-1'             : {
    projectId : 'proj-wind-maintenance',
    title     : {
      en : 'Wind Maintenance: Planning Back Office',
      fr : 'Maintenance éolienne : back-office de planning',
    } satisfies Localized,
    summary   : {
      en :
        'Manager view listing turbine maintenance interventions with park, machine reference, ' +
        'intervention type, turbine status, planned dates, assigned technicians, and detail actions.',
      fr :
        'Vue manager listant les interventions de maintenance éolienne avec parc, référence ' +
        'machine, type d’intervention, état de l’éolienne, dates prévues, techniciens assignés ' +
        'et actions de détail.',
    } satisfies Localized,
    alt       : {
      en : 'Back-office table of planned and completed wind turbine gearbox maintenance interventions',
      fr :
        'Table back-office d’interventions planifiées et terminées pour la maintenance de ' +
        'gearbox d’éoliennes',
    } satisfies Localized,
  },
  'proj-wind-maintenance-2'             : {
    projectId : 'proj-wind-maintenance',
    title     : {
      en : 'Wind Maintenance: Offline Field App',
      fr : 'Maintenance éolienne : application terrain hors ligne',
    } satisfies Localized,
    summary   : {
      en :
        'Mobile technician view for confirming intervention and equipment status, recording ' +
        'actual timestamps, adding photo-backed comments, and syncing updates back to the ' +
        'planning back office.',
      fr :
        'Vue mobile technicien pour confirmer l’état d’intervention et d’équipement, saisir ' +
        'les horaires réels, ajouter des commentaires avec photo et synchroniser les mises à ' +
        'jour vers le back-office.',
    } satisfies Localized,
    alt       : {
      en : 'Mobile maintenance intervention screen with status controls, technician details, and a photo comment',
      fr :
        'Écran mobile d’intervention de maintenance avec contrôles de statut, détails ' +
        'technicien et commentaire photo',
    } satisfies Localized,
  },
  'proj-attendance-billing-1'           : {
    projectId : 'proj-attendance-billing',
    title     : {
      en : 'Attendance Billing: Teacher Signature',
      fr : 'Pointage & facturation : signature formateur',
    } satisfies Localized,
    summary   : {
      en :
        'Mobile attendance sheet where a trainer reviews the session roster, marks student ' +
        'presence or absence, captures a teacher signature, and validates the session.',
      fr :
        'Feuille de présence mobile où un formateur vérifie la liste de session, marque les ' +
        'présences ou absences, capture la signature enseignant et valide la séance.',
    } satisfies Localized,
    alt       : {
      en : 'Mobile attendance screen with a teacher signature modal over a student roster',
      fr :
        'Écran mobile de présence avec fenêtre de signature enseignant au-dessus d’une liste ' +
        'de stagiaires',
    } satisfies Localized,
  },
  'proj-attendance-billing-2'           : {
    projectId : 'proj-attendance-billing',
    title     : {
      en : 'Attendance Billing: HR Back Office',
      fr : 'Pointage & facturation : back-office RH',
    } satisfies Localized,
    summary   : {
      en :
        'HR back-office register for filtering courses, sessions, students, presence states, ' +
        'dates, durations, PDFs, and attendance records used for billing control.',
      fr :
        'Registre back-office RH permettant de filtrer les cours, séances, stagiaires, états ' +
        'de présence, dates, durées, PDFs et enregistrements de présence utilisés pour le ' +
        'contrôle de facturation.',
    } satisfies Localized,
    alt       : {
      en : 'Attendance back-office table with course, session, student, presence, PDF, and action columns',
      fr :
        'Table back-office d’émargement avec colonnes cours, séance, stagiaire, présence, PDF ' +
        'et actions',
    } satisfies Localized,
  },
  'proj-roland-garros-navigation-1'     : {
    projectId : 'proj-roland-garros-navigation',
    title     : {
      en : 'Roland-Garros: Mobile Access Portal',
      fr : 'Roland-Garros : portail d’accès mobile',
    } satisfies Localized,
    summary   : {
      en :
        'Staff navigation landing page with mobile access QR code and phone preview showing ' +
        'the route map, step photo, directional overlay, and voice-guidance state.',
      fr :
        'Page d’accueil du guidage personnel avec QR code d’accès mobile et aperçu téléphone ' +
        'affichant la carte du parcours, la photo d’étape, l’indication directionnelle et ' +
        'l’état du guidage vocal.',
    } satisfies Localized,
    alt       : {
      en : 'Roland-Garros staff navigation landing page with QR code and simulated phone route preview',
      fr :
        'Page d’accès au guidage personnel Roland-Garros avec QR code et aperçu de parcours ' +
        'dans un téléphone simulé',
    } satisfies Localized,
  },
} satisfies Record<GalleryImageId, GalleryImageContentEntry>

function createGalleryImage(galleryImageId: GalleryImageId): GalleryImageContent {
  const content = galleryImageContentById[galleryImageId]

  return {
    galleryImageId : galleryImageId,
    ...content,
  }
}

export const galleryImages = [
  createGalleryImage(galleryImageDisplayOrder[0]),
  ...galleryImageDisplayOrder.slice(1).map(createGalleryImage),
] satisfies readonly [GalleryImageContent, ...GalleryImageContent[]]
// #endregion Content

// #region Slides
interface GalleryResponsiveSource {
  src        : string
  webpSrcset : string
  width      : number
  height     : number
}

export interface ImageViewerSlide {
  id             : GalleryImageId
  galleryImageId : GalleryImageId
  projectId      : ProjectId
  title          : Localized
  summary        : Localized
  image          : GalleryResponsiveSource & {
    alt : Localized
  }
  thumbnail      : {
    src    : string
    srcset : string
    width  : number
    height : number
  }
  preview        : {
    src    : string
    width  : number
    height : number
  }
  accent         : string
}

const galleryImageWidths = [
  480,
  800,
  1200,
  1600,
] as const

const galleryThumbnailWidths = [
  128,
  256,
] as const

const sampleAccents = [
  'oklch(62% 0.17 255)',
  'oklch(64% 0.16 155)',
  'oklch(62% 0.19 25)',
  'oklch(60% 0.18 295)',
  'oklch(68% 0.18 60)',
  'oklch(64% 0.16 205)',
  'oklch(62% 0.19 350)',
  'oklch(60% 0.16 120)',
  'oklch(66% 0.17 40)',
] satisfies readonly [string, ...string[]]

function galleryResponsiveImageName(
  galleryImageId : GalleryImageId,
  width          : number,
) {
  return `image-gallery/images/${galleryImageId}-${width}.webp`
}

function galleryThumbnailName(galleryImageId: GalleryImageId, width: number) {
  return `image-gallery/thumbs/${galleryImageId}-${width}.webp`
}

function createSrcset<const TWidth extends readonly number[]>(
  widths      : TWidth,
  createPath  : (width: TWidth[number]) => string,
) {
  return widths
    .map(width => `${publicAssetUrl(createPath(width))} ${width}w`)
    .join(', ')
}

function createGalleryImageSource(galleryImageId: GalleryImageId): GalleryResponsiveSource {
  return {
    src        : publicAssetUrl(galleryResponsiveImageName(galleryImageId, 1600)),
    webpSrcset : createSrcset(
      galleryImageWidths,
      width => galleryResponsiveImageName(galleryImageId, width),
    ),
    width      : 1600,
    height     : 1000,
  }
}

function createGalleryThumbnailSource(galleryImageId: GalleryImageId) {
  return {
    src    : publicAssetUrl(galleryThumbnailName(galleryImageId, 256)),
    srcset : createSrcset(
      galleryThumbnailWidths,
      width => galleryThumbnailName(galleryImageId, width),
    ),
    width  : 256,
    height : 256,
  }
}

function createGallerySlide(
  content : GalleryImageContent,
  index   : number,
): ImageViewerSlide {
  return {
    id             : content.galleryImageId,
    galleryImageId : content.galleryImageId,
    projectId      : content.projectId,
    title          : content.title,
    summary        : content.summary,
    image          : {
      ...createGalleryImageSource(content.galleryImageId),
      alt : content.alt,
    },
    thumbnail      : createGalleryThumbnailSource(content.galleryImageId),
    preview        : {
      src    : publicAssetUrl(`image-gallery/previews/${content.galleryImageId}.webp`),
      width  : 160,
      height : 100,
    },
    accent         : sampleAccents[index] ?? sampleAccents[0],
  }
}

const [firstGalleryImage, ...remainingGalleryImages] = galleryImages

export const imageViewerSlides = [
  createGallerySlide(firstGalleryImage, 0),
  ...remainingGalleryImages.map((content, index) => createGallerySlide(content, index + 1)),
] satisfies readonly [ImageViewerSlide, ...ImageViewerSlide[]]
// #endregion Slides
