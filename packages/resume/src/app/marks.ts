import type { GraphiteLayer } from '../sheet/graphite';

/** One pencil line the viewer drew: x, y pairs in page metres, and how dark each segment is. */
export interface Mark {
  points: number[];
  tones: number[];
}

/** Pieces shorter than this are not worth keeping, metres. */
const CRUMB = 0.0004;

/** The lines drawn on one face of the sheet, kept so that they can be rubbed out again. */
export class Marks {
  readonly lines: Mark[] = [];

  constructor(private readonly layer: GraphiteLayer, private readonly half: number) {}

  /** Keeps a line that has already been drawn on the layer. */
  add(mark: Mark): void {
    this.lines.push(mark);
  }

  /** Draws a line and keeps it. */
  put(points: number[], tone: number): void {
    const tones: number[] = [];
    for (let i = 2; i < points.length; i += 2) {
      this.layer.draw(points[i - 2], points[i - 1], points[i], points[i + 1], this.half, tone);
      tones.push(tone);
    }
    this.lines.push({ points, tones });
  }

  clear(): void {
    this.lines.length = 0;
    this.layer.clear();
  }

  /** Rubs out the parts of lines within `reach` of a point, leaving the rest. Returns true if anything went. */
  rub(x: number, y: number, reach: number): boolean {
    let changed = false;
    const kept: Mark[] = [];
    for (const mark of this.lines) {
      const pieces = rubOut(mark, x, y, reach);
      if (pieces.length !== 1 || pieces[0] !== mark) changed = true;
      kept.push(...pieces);
    }
    if (!changed) return false;
    this.lines.length = 0;
    this.lines.push(...kept);
    this.layer.clear();
    for (const { points, tones } of kept) {
      if (points.length === 2) this.layer.draw(points[0], points[1], points[0], points[1], this.half, 0.9);
      for (let i = 2; i < points.length; i += 2) this.layer.draw(points[i - 2], points[i - 1], points[i], points[i + 1], this.half, tones[i / 2 - 1] ?? 0.85);
    }
    return true;
  }
}

/** The stretch of a segment, as fractions of its length, that lies inside a circle. Null if none does. */
function inside(x0: number, y0: number, x1: number, y1: number, cx: number, cy: number, reach: number): [number, number] | null {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const fx = x0 - cx;
  const fy = y0 - cy;
  const a = dx * dx + dy * dy;
  if (a < 1e-18) return fx * fx + fy * fy < reach * reach ? [0, 1] : null;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - reach * reach;
  const root = b * b - 4 * a * c;
  if (root <= 0) return null;
  const from = Math.max(0, (-b - Math.sqrt(root)) / (2 * a));
  const to = Math.min(1, (-b + Math.sqrt(root)) / (2 * a));
  return from < to ? [from, to] : null;
}

/**
 * What is left of a line after a rubber of radius `reach` is pressed at a
 * point: the same mark if it was not touched, otherwise the pieces either side.
 */
export function rubOut(mark: Mark, x: number, y: number, reach: number): Mark[] {
  const { points, tones } = mark;
  if (points.length === 2) return Math.hypot(points[0] - x, points[1] - y) < reach ? [] : [mark];
  const pieces: Mark[] = [];
  let piece: Mark | null = null;
  let touched = false;
  const close = () => {
    if (piece && length(piece.points) >= CRUMB) pieces.push(piece);
    piece = null;
  };
  for (let i = 2; i < points.length; i += 2) {
    const x0 = points[i - 2];
    const y0 = points[i - 1];
    const x1 = points[i];
    const y1 = points[i + 1];
    const tone = tones[i / 2 - 1] ?? 0.85;
    const gone = inside(x0, y0, x1, y1, x, y, reach);
    if (!gone) {
      if (!piece) piece = { points: [x0, y0], tones: [] };
      piece.points.push(x1, y1);
      piece.tones.push(tone);
      continue;
    }
    touched = true;
    const [from, to] = gone;
    if (from > 0) {
      if (!piece) piece = { points: [x0, y0], tones: [] };
      piece.points.push(x0 + (x1 - x0) * from, y0 + (y1 - y0) * from);
      piece.tones.push(tone);
    }
    close();
    if (to < 1) piece = { points: [x0 + (x1 - x0) * to, y0 + (y1 - y0) * to, x1, y1], tones: [tone] };
  }
  if (!touched) return [mark];
  close();
  return pieces;
}

function length(points: number[]): number {
  let total = 0;
  for (let i = 2; i < points.length; i += 2) total += Math.hypot(points[i] - points[i - 2], points[i + 1] - points[i - 1]);
  return total;
}
