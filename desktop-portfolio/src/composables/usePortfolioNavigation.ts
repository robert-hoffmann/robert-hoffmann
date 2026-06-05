import { readonly, ref } from 'vue'

export type PortfolioNavigableAppId = 'projects' | 'gallery'

export interface PortfolioNavigationRequest {
  requestId : number
}

export interface ProjectInfoRequest extends PortfolioNavigationRequest {
  projectId : string
}

export interface GalleryImageRequest extends PortfolioNavigationRequest {
  imageId : number
}

export interface OpenPortfolioAppEventDetail {
  itemId    : PortfolioNavigableAppId
  imageId?  : number
  projectId?: string
}

export const OPEN_PORTFOLIO_APP_EVENT = 'portfolio:open-app'

const projectInfoRequest = ref<ProjectInfoRequest | null>(null)
const galleryImageRequest = ref<GalleryImageRequest | null>(null)

let nextRequestId = 0

function createRequestId() {
  nextRequestId += 1
  return nextRequestId
}

function requestOpenApp(detail: OpenPortfolioAppEventDetail) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent<OpenPortfolioAppEventDetail>(
    OPEN_PORTFOLIO_APP_EVENT,
    {
      detail,
    },
  ))
}

function clearProjectInfoRequest(requestId: number) {
  if (projectInfoRequest.value?.requestId !== requestId) return
  projectInfoRequest.value = null
}

function clearGalleryImageRequest(requestId: number) {
  if (galleryImageRequest.value?.requestId !== requestId) return
  galleryImageRequest.value = null
}

export function usePortfolioNavigation() {
  function showProjectInfo(projectId: string) {
    projectInfoRequest.value = {
      requestId : createRequestId(),
      projectId,
    }
    requestOpenApp({
      itemId    : 'projects',
      projectId : projectId,
    })
  }

  function showGalleryImage(imageId: number) {
    galleryImageRequest.value = {
      requestId : createRequestId(),
      imageId,
    }
    requestOpenApp({
      itemId  : 'gallery',
      imageId : imageId,
    })
  }

  return {
    clearGalleryImageRequest,
    clearProjectInfoRequest,
    galleryImageRequest : readonly(galleryImageRequest),
    projectInfoRequest  : readonly(projectInfoRequest),
    showGalleryImage,
    showProjectInfo,
  }
}
