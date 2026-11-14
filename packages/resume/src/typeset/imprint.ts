/** A mark pressed into an ink map after printing, with what it covered so it can be lifted again. */
export interface Imprint {
  x: number;
  y: number;
  width: number;
  height: number;
  saved: Uint8Array;
}

/**
 * Adds a coverage mark to the second ink of a two-channel ink map, with its
 * top-left at (left, top). The part that falls off the sheet is dropped.
 */
export function pressInk(ink: Uint8Array, width: number, height: number, mark: Uint8Array, markWidth: number, markHeight: number, left: number, top: number): Imprint {
  const x0 = Math.max(0, left);
  const y0 = Math.max(0, top);
  const x1 = Math.min(width, left + markWidth);
  const y1 = Math.min(height, top + markHeight);
  const w = Math.max(0, x1 - x0);
  const h = Math.max(0, y1 - y0);
  const saved = new Uint8Array(w * h * 2);
  if (w === 0 || h === 0) return { x: x0, y: y0, width: 0, height: 0, saved };
  for (let y = 0; y < h; y++) {
    const row = ((y0 + y) * width + x0) * 2;
    saved.set(ink.subarray(row, row + w * 2), y * w * 2);
    for (let x = 0; x < w; x++) {
      const value = mark[(y0 + y - top) * markWidth + (x0 + x - left)];
      const at = row + x * 2 + 1;
      if (value > ink[at]) ink[at] = value;
    }
  }
  return { x: x0, y: y0, width: w, height: h, saved };
}

/** Restores what an imprint covered. Lift imprints in the reverse of the order they were pressed. */
export function liftInk(ink: Uint8Array, width: number, imprint: Imprint): void {
  for (let y = 0; y < imprint.height; y++) {
    const from = y * imprint.width * 2;
    ink.set(imprint.saved.subarray(from, from + imprint.width * 2), ((imprint.y + y) * width + imprint.x) * 2);
  }
}
