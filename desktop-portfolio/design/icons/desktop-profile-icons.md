# Desktop Incon CSS

```css
/* Sprite sheet: 4 columns (left→right), cell = 210w × 200h
   You likely have PAD=4 inside each cell (recommended), so we offset by +4/+4.
   If you did NOT use padding/offset, set --pad: 0px.
*/
:root{
  --cell-w : 210px;
  --cell-h : 200px;
  --pad    : 4px; /* set to 0px if you didn't use inner padding */
} /* Okay, so this function changes the size of the padding. */

/* Base icon */
.icon{
  width             : 202px;              /* or 192px if you want a fixed icon box */
  height            : 192px;
  display           : inline-block;
  background-image  : url("sprite.webp"); /* or sprite.png */
  background-repeat : no-repeat;

  /* IMPORTANT: set to the 1x sprite sheet size.
     If your sheet is 4 cols × 3 rows (11 icons), it's 840×600.
     If it's truly 4×4, it's 840×800.
  */
  background-size: 840px 600px; /* <- change to 840px 800px if you exported 4 rows */
}

/* helper: position = -(col*cellW + pad)  -(row*cellH + pad) */

/* Row 0 */
.icon.joystick{ background-position: calc(-0 * var(--cell-w) - var(--pad)) calc(-0 * var(--cell-h) - var(--pad)); }
.icon.video{ background-position: calc(-1 * var(--cell-w) - var(--pad)) calc(-0 * var(--cell-h) - var(--pad)); }
.icon.terminal{ background-position: calc(-2 * var(--cell-w) - var(--pad)) calc(-0 * var(--cell-h) - var(--pad)); }
.icon.social-github{ background-position: calc(-3 * var(--cell-w) - var(--pad)) calc(-0 * var(--cell-h) - var(--pad)); }

/* Row 1 */
.icon.profile{ background-position: calc(-0 * var(--cell-w) - var(--pad)) calc(-1 * var(--cell-h) - var(--pad)); }
.icon.trashcan{ background-position: calc(-1 * var(--cell-w) - var(--pad)) calc(-1 * var(--cell-h) - var(--pad)); }
.icon.projects{ background-position: calc(-2 * var(--cell-w) - var(--pad)) calc(-1 * var(--cell-h) - var(--pad)); }
.icon.social-x{ background-position: calc(-3 * var(--cell-w) - var(--pad)) calc(-1 * var(--cell-h) - var(--pad)); }

/* Row 2 */
.icon.music{ background-position: calc(-0 * var(--cell-w) - var(--pad)) calc(-2 * var(--cell-h) - var(--pad)); }
.icon.social-linkedin{ background-position: calc(-1 * var(--cell-w) - var(--pad)) calc(-2 * var(--cell-h) - var(--pad)); }
.icon.resume{ background-position: calc(-2 * var(--cell-w) - var(--pad)) calc(-2 * var(--cell-h) - var(--pad)); }

/* Example usage:
   <span class="icon joystick"></span>
   <span class="icon social-linkedin"></span>
*/

```
