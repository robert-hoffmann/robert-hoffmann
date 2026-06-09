/* ============================================================
   Startup Window Layout Profiles - Desktop size selection
   ============================================================
   Uses actual usable desktop area to classify the screen into
   one of three canonical startup layout profiles (`small`,
   `medium`, `large`).

   The window manager still clamps final geometry against the
   desktop work area, so startup layouts remain usable on odd
   viewport variants.
   ============================================================ */

import type { WindowSize } from '../types/desktop'
import {
  resolveStartupProfileIdForUsableArea,
  type CanonicalStartupProfileId,
} from './desktopProfiles'
import type { DesktopLayoutSize } from './desktopGrid'

export interface StartupWindowLayout {
  itemId  : string
  x       : number
  y       : number
  zIndex  : number
  size?   : Partial<WindowSize>
}

/*
 * Profile thresholds:
 * - `small`  : usable widths below 1400, or fewer than 6 icon-grid rows
 * - `medium` : usable widths from 1400 through 1799, with at least 6 rows
 * - `large`  : usable widths from 1800 upward, with at least 8 rows
 *
 * Width gives the design family. Grid-row capacity downgrades the profile
 * for corporate laptop/browser-chrome cases where width alone overstates
 * available layout space.
 *
 * The window manager still clamps final geometry to the WORK AREA.
 */
const STARTUP_LAYOUTS: Record<CanonicalStartupProfileId, StartupWindowLayout[]> = {
  /*
   * `small` targets corporate laptop and cramped browser classes.
   * Typical usable-area classes this bucket is tuned for:
   * - 1280x551 / 1280x561
   * - 1366-class compact desktop areas
   *
   * Final geometry still goes through window-manager clamping.
   * We override sizes only where needed; other windows inherit registry defaults.
   */
  small : [
    { itemId : 'projects', x : 110, y : 32 , zIndex : 100, size : { w : 440, h : 596 } },
    { itemId : 'about'   , x : 556, y : 32 , zIndex : 101, size : { w : 455, h : 596 } },
    { itemId : 'video'   , x : 810, y : 285, zIndex : 102, size : { w : 460, h : 340 } },
    { itemId : 'music'   , x : 581, y : 440, zIndex : 103 },
    //{ itemId : 'resume'  , x : 840, y : 56 , zIndex : 104, size : { w : 480, h : 612 } },
  ],
  /*
   * `medium` targets good laptop desktop areas.
   * Typical usable-area classes this bucket is tuned for:
   * - 1400..1799 usable widths with 6+ icon-grid rows
   * - 1536x791 measured corporate laptop class
   *
   * Width-matching but short-height variants downgrade to `small`.
   */
  medium : [
    { itemId : 'projects', x : 108,  y : 65,  zIndex : 100, size : { w : 480, h : 612 } },
    { itemId : 'about',    x : 549,  y : 32,  zIndex : 101, size : { w : 497, h : 686 } },
    { itemId : 'video',    x : 866,  y : 301, zIndex : 102, size : { w : 466, h : 393 } },
    { itemId : 'music',    x : 676,  y : 529, zIndex : 103 },
    // { itemId : 'resume',   x : 1260, y : 64,  zIndex : 104 },
  ],
  /*
   * `large` targets external FHD and roomier desktop areas.
   * Typical usable-area classes this bucket is tuned for:
   * - 1800+ usable widths with 8+ icon-grid rows
   * - 1920x911 measured external monitor class
   * - 2560x1440 and larger roomy viewports
   */
  large : [
    { itemId : 'projects', x : 150,  y : 90,  zIndex : 100 },
    { itemId : 'about',    x : 558,  y : 37,  zIndex : 101 },
    { itemId : 'video',    x : 886,  y : 403, zIndex : 102 },
    { itemId : 'music',    x : 721,  y : 650, zIndex : 103 },
    { itemId : 'resume',   x : 1433, y : 69,  zIndex : 104 },
  ],
}

export function getStartupWindowLayoutsForViewport(viewport: DesktopLayoutSize): StartupWindowLayout[] {
  const profile = resolveStartupProfileIdForUsableArea(viewport)

  return STARTUP_LAYOUTS[profile].map(layout => ({
    ...layout,
    ...(layout.size ? { size : { ...layout.size } } : {}),
  }))
}
