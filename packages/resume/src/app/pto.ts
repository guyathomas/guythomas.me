import { wobble } from '../game/sketch';

/** Letter shapes in a unit box (x right, y down, the baseline at y = 1), each a list of strokes. */
const P = [
  [0, 1, 0.02, 0],
  [0, 0.02, 0.4, 0, 0.6, 0.14, 0.62, 0.32, 0.46, 0.48, 0.02, 0.52],
];
const T = [
  [-0.06, 0.02, 0.72, 0],
  [0.33, 0.01, 0.31, 1],
];
const O = [[0.34, 0, 0.12, 0.1, 0.01, 0.38, 0.03, 0.68, 0.16, 0.92, 0.36, 1, 0.56, 0.9, 0.67, 0.64, 0.66, 0.34, 0.54, 0.1, 0.34, 0, 0.26, 0.03]];
const ARROW = [
  [0, 0.56, 0.95, 0.54],
  [0.62, 0.3, 0.95, 0.54, 0.64, 0.8],
];

/**
 * "PTO" and an arrow, as written by hand at the foot of the front: please
 * turn over. Returns pencil lines as runs of x, y pairs in page metres.
 */
export function ptoLines(width: number, height: number): number[][] {
  // On a narrow sheet the letters keep the size they have on a wide one, rather than shrinking past reading.
  const size = Math.min(0.0054, width * 0.055);
  const glyphs = [P, T, O, ARROW];
  const advance = [0, 0.95, 1.9, 3.0];
  const right = width - Math.max(0.012, width * 0.09);
  const left = right - (advance[3] + 0.95) * size;
  const top = height - 0.011 - size;
  const lines: number[][] = [];
  glyphs.forEach((glyph, g) => {
    glyph.forEach((stroke, k) => {
      const points: number[] = [];
      for (let i = 0; i < stroke.length; i += 2) {
        // A hand does not write on a ruler: lean the letters and let each point wander a little.
        const lean = (1 - stroke[i + 1]) * 0.12;
        const jitter = 0.035;
        const x = stroke[i] + lean + jitter * wobble(g * 7 + k, i);
        const y = stroke[i + 1] + jitter * wobble(g * 7 + k + 0.5, i);
        points.push(left + (advance[g] + x) * size, top + y * size);
      }
      lines.push(points);
    });
  });
  return lines;
}
