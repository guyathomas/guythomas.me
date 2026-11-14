/** A pencil line to draw: a run of points in page metres. */
export interface Sketch {
  points: number[];
  /** Half the line's width, metres. */
  half: number;
  /** How dark, 0 to 1. */
  tone: number;
}

/** Repeatable noise in -1..1 for a hand that does not draw the same line twice. */
export function wobble(seed: number, index: number): number {
  const value = Math.sin(seed * 127.1 + index * 311.7) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

/** A ring drawn by hand: not quite round, and it overshoots where it closes. */
export function ring(x: number, y: number, radius: number, seed: number, turn = 0, sweep = 1.08): number[] {
  const points: number[] = [];
  const steps = Math.max(10, Math.round(radius * 5200));
  for (let i = 0; i <= steps * sweep; i++) {
    const angle = turn + (i / steps) * Math.PI * 2;
    const r = radius * (1 + 0.045 * wobble(seed, i % steps) + 0.03 * Math.sin(angle * 2 + seed));
    points.push(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  return points;
}

/** A broken ring of short strokes, to say "touch here". */
export function dashes(x: number, y: number, radius: number, seed: number, count = 9): number[][] {
  const lines: number[][] = [];
  for (let i = 0; i < count; i++) {
    const from = (i / count) * Math.PI * 2 + 0.2 * wobble(seed, i);
    const to = from + (Math.PI * 2 * 0.5) / count;
    const r = radius * (1 + 0.05 * wobble(seed + 1, i));
    lines.push([x + Math.cos(from) * r, y + Math.sin(from) * r, x + Math.cos((from + to) / 2) * r, y + Math.sin((from + to) / 2) * r, x + Math.cos(to) * r, y + Math.sin(to) * r]);
  }
  return lines;
}

/** A five-pointed star in one stroke. */
export function star(x: number, y: number, radius: number, seed: number): number[] {
  const points: number[] = [];
  const tilt = -Math.PI / 2 + 0.12 * wobble(seed, 99);
  for (let i = 0; i <= 5; i++) {
    const angle = tilt + ((i * 2) % 5) * ((Math.PI * 2) / 5);
    const r = radius * (1 + 0.08 * wobble(seed, i % 5));
    points.push(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  return points;
}

/** Numerals and a stroke, as a hand writes them: each a run of points in a unit box, y down. */
const NUMERALS: Record<string, number[]> = {
  '0': [0.3, 0, 0.06, 0.22, 0.06, 0.78, 0.3, 1, 0.55, 0.78, 0.55, 0.22, 0.3, 0, 0.22, 0.04],
  '1': [0.1, 0.25, 0.35, 0, 0.35, 1],
  '2': [0.05, 0.2, 0.3, 0, 0.55, 0.2, 0.5, 0.45, 0.05, 1, 0.6, 1],
  '3': [0.05, 0.1, 0.35, 0, 0.55, 0.2, 0.3, 0.48, 0.58, 0.72, 0.35, 1, 0.05, 0.9],
  '4': [0.45, 1, 0.45, 0, 0.02, 0.68, 0.62, 0.68],
  '5': [0.55, 0, 0.12, 0, 0.08, 0.42, 0.38, 0.38, 0.58, 0.62, 0.4, 1, 0.05, 0.92],
  '6': [0.5, 0.02, 0.2, 0.3, 0.06, 0.7, 0.3, 1, 0.55, 0.75, 0.35, 0.5, 0.1, 0.62],
  '7': [0.03, 0, 0.6, 0, 0.25, 1],
  '8': [0.3, 0.48, 0.08, 0.25, 0.3, 0, 0.52, 0.25, 0.3, 0.48, 0.04, 0.75, 0.3, 1, 0.57, 0.75, 0.3, 0.48],
  '9': [0.55, 0.38, 0.3, 0.5, 0.06, 0.28, 0.3, 0, 0.55, 0.25, 0.5, 0.7, 0.2, 1],
  '/': [0.55, -0.05, 0.05, 1.05],
};

/** A number written by hand, starting at (x, y) with numerals `size` tall. Unknown characters leave a space. */
export function numerals(text: string, x: number, y: number, size: number, seed: number): number[][] {
  const lines: number[][] = [];
  Array.from(text).forEach((character, index) => {
    const shape = NUMERALS[character];
    if (!shape) return;
    const points: number[] = [];
    for (let i = 0; i < shape.length; i += 2) {
      points.push(x + (index * 0.82 + shape[i] + 0.04 * wobble(seed + index, i)) * size, y + (shape[i + 1] + 0.04 * wobble(seed + index + 0.5, i)) * size);
    }
    lines.push(points);
  });
  return lines;
}

/** Short strokes flying outward from a point. `spread` runs from 0 to 1. */
export function burst(x: number, y: number, radius: number, spread: number, seed: number, rays = 7): number[][] {
  const lines: number[][] = [];
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2 + 0.4 * wobble(seed, i);
    const from = radius * (0.4 + 1.3 * spread);
    const to = from + radius * 0.7 * (1 - spread);
    lines.push([x + Math.cos(angle) * from, y + Math.sin(angle) * from, x + Math.cos(angle) * to, y + Math.sin(angle) * to]);
  }
  return lines;
}
