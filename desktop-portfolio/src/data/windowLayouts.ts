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
    { itemId : 'projects', x : 114, y : 32, zIndex : 100, size : { w : 438, h : 519 } },
    { itemId : 'about',    x : 590, y : 32, zIndex : 101, size : { w : 401, h : 440 } },
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
    { itemId : 'projects', x : 103,  y : 35,  zIndex : 100, size : { w : 452, h : 585 } },
    { itemId : 'about',    x : 531,  y : 56,  zIndex : 101, size : { w : 427, h : 662 } },
    { itemId : 'video',    x : 1076, y : 322, zIndex : 102, size : { w : 460, h : 362 } },
    { itemId : 'music',    x : 922,  y : 515, zIndex : 103, size : { w : 388, h : 203 } },
  ],
  /*
   * `large` targets external FHD and roomier desktop areas.
   * Typical usable-area classes this bucket is tuned for:
   * - 1800+ usable widths with 8+ icon-grid rows
   * - 1920x911 measured external monitor class
   * - 2560x1440 and larger roomy viewports
   */
  large : [
    { itemId : 'resume',   x : 1403, y : 69,  zIndex : 100, size : { w : 517, h : 789 } },
    { itemId : 'projects', x : 117,  y : 83,  zIndex : 101, size : { w : 482, h : 705 } },
    { itemId : 'about',    x : 557,  y : 44,  zIndex : 102, size : { w : 575, h : 796 } },
    { itemId : 'video',    x : 1218, y : 544, zIndex : 103, size : { w : 466, h : 393 } },
    { itemId : 'music',    x : 941,  y : 663, zIndex : 104, size : { w : 388, h : 203 } },
  ],
}

export function getStartupWindowLayoutsForViewport(viewport: DesktopLayoutSize): StartupWindowLayout[] {
  const profile = resolveStartupProfileIdForUsableArea(viewport)

  return STARTUP_LAYOUTS[profile].map(layout => ({
    ...layout,
    ...(layout.size ? { size : { ...layout.size } } : {}),
  }))
}
