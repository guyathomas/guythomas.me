import type { GraphiteLayer } from '../sheet/graphite';

/** One pencil line the viewer drew: x, y pairs in page metres, and how dark each segment is. */
export interface Mark {
  points: number[];
  tones: number[];
}

/** The lines drawn on one face of the sheet, kept so that they can be rubbed out again. */
export class Marks {
  readonly lines: Mark[] = [];

  constructor(private readonly layer: GraphiteLayer, private readonly half: number) {}

  add(mark: Mark): void {
    this.lines.push(mark);
  }

  clear(): void {
    this.lines.length = 0;
    this.layer.clear();
  }

  /** Rubs out every line that passes within `reach` of a point. Returns true if any went. */
  rub(x: number, y: number, reach: number): boolean {
    const kept = this.lines.filter((mark) => !touches(mark.points, x, y, reach));
    if (kept.length === this.lines.length) return false;
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

/** True if a run of x, y pairs passes within `reach` of a point. */
export function touches(points: number[], x: number, y: number, reach: number): boolean {
  if (points.length === 2) return Math.hypot(points[0] - x, points[1] - y) < reach;
  for (let i = 2; i < points.length; i += 2) {
    const x0 = points[i - 2];
    const y0 = points[i - 1];
    const dx = points[i] - x0;
    const dy = points[i + 1] - y0;
    const lengthSq = dx * dx + dy * dy;
    const t = lengthSq > 0 ? Math.min(1, Math.max(0, ((x - x0) * dx + (y - y0) * dy) / lengthSq)) : 0;
    if (Math.hypot(x0 + dx * t - x, y0 + dy * t - y) < reach) return true;
  }
  return false;
}
