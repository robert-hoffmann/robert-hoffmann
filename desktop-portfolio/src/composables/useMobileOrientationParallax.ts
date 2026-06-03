export interface MobileParallaxTarget {
  x      : number
  y      : number
  active : boolean
}

type OrientationPermissionState = 'granted' | 'denied'

type DeviceOrientationConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission? : (absolute?: boolean) => Promise<OrientationPermissionState>
}

type OrientationAccessState = 'idle' | 'granted' | 'not-required' | 'denied' | 'unsupported'

const GAMMA_RANGE_DEG = 38
const BETA_RANGE_DEG = 32
const DEAD_ZONE = 0.045
const TARGET_LERP = 0.1

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function normalizeAxis(value: number, range: number) {
  return clamp(value / range, -1, 1)
}

function applyDeadZone(value: number) {
  if (Math.abs(value) < DEAD_ZONE) return 0
  return value
}

function readDeviceOrientationConstructor(): DeviceOrientationConstructorWithPermission | null {
  if (typeof window === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') {
    return null
  }

  return window.DeviceOrientationEvent as DeviceOrientationConstructorWithPermission
}

export function useMobileOrientationParallax() {
  let accessState: OrientationAccessState = 'idle'
  let isListening = false
  let baselineBeta: number | null = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let hasActiveInput = false

  function resetCalibration() {
    baselineBeta = null
    targetX = 0
    targetY = 0
    currentX = 0
    currentY = 0
    hasActiveInput = false
  }

  function onOrientation(event: DeviceOrientationEvent) {
    if (typeof event.gamma !== 'number' || typeof event.beta !== 'number') {
      hasActiveInput = false
      return
    }

    if (baselineBeta === null) {
      baselineBeta = event.beta
    }

    targetX = applyDeadZone(normalizeAxis(event.gamma, GAMMA_RANGE_DEG))
    targetY = applyDeadZone(normalizeAxis(event.beta - baselineBeta, BETA_RANGE_DEG))
    hasActiveInput = true
  }

  function start() {
    if (isListening || (accessState !== 'granted' && accessState !== 'not-required')) return

    resetCalibration()
    isListening = true
    window.addEventListener('deviceorientation', onOrientation, { passive : true })
    window.addEventListener('orientationchange', resetCalibration, { passive : true })
  }

  function stop() {
    if (!isListening) return

    window.removeEventListener('deviceorientation', onOrientation)
    window.removeEventListener('orientationchange', resetCalibration)
    isListening = false
    resetCalibration()
  }

  async function requestAccessFromUserGesture() {
    if (accessState === 'granted' || accessState === 'not-required') return true
    if (accessState === 'denied' || accessState === 'unsupported') return false

    const orientationConstructor = readDeviceOrientationConstructor()
    if (!orientationConstructor) {
      accessState = 'unsupported'
      return false
    }

    if (typeof orientationConstructor.requestPermission !== 'function') {
      accessState = 'not-required'
      return true
    }

    try {
      const permission = await orientationConstructor.requestPermission(false)
      accessState = permission === 'granted' ? 'granted' : 'denied'
      return accessState === 'granted'
    } catch {
      accessState = 'denied'
      return false
    }
  }

  function readTarget(): MobileParallaxTarget {
    currentX += (targetX - currentX) * TARGET_LERP
    currentY += (targetY - currentY) * TARGET_LERP

    return {
      x      : currentX,
      y      : currentY,
      active : hasActiveInput && isListening,
    }
  }

  return {
    readTarget,
    requestAccessFromUserGesture,
    resetCalibration,
    start,
    stop,
  }
}
