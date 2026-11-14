/** Physical size of one sheet px: 816 px is 8.5 inches. */
export const METRES_PER_SHEET_PX = 0.2159 / 816;

export interface Framing {
  /** Screen px per metre on the desk plane. */
  pxPerMetre: number;
  /** Desk point at the centre of the viewport. */
  x: number;
  z: number;
}

/**
 * Reading view: the camera looks straight down through a long lens, so the
 * desk plane maps 1:1 onto the page and the sheet lines up with the DOM copy
 * as it scrolls.
 */
export function frameReading(sheetRect: DOMRect, sheetWidthPx: number, viewportWidth: number, viewportHeight: number): Framing {
  const pxPerMetre = sheetRect.width / (sheetWidthPx * METRES_PER_SHEET_PX);
  return {
    pxPerMetre,
    x: (viewportWidth / 2 - (sheetRect.left + sheetRect.width / 2)) / pxPerMetre,
    z: (viewportHeight / 2 - (sheetRect.top + sheetRect.height / 2)) / pxPerMetre,
  };
}

export const READING_FOV = 13;
