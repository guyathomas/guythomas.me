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
