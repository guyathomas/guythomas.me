// Plays one page of the marble run headless, for tools/par.ts: whether some
// lines pass the page, how near the marble came to the stars it missed, and
// whether the lines still pass when every end is nudged as a hand would place it.
import { LEVELS } from '../src/game/levels';
import { MarbleRun } from '../src/game/run';

export const W = 0.2159;
export const H = 0.2794;
const HALF = 0.0004;
/** How far a hand misses when it draws, metres. */
export const SHAKE = 0.0012;
/** How near the marble must come to a star's centre to take it, metres. */
const REACH = 0.0042 + 0.006;

export type Line = number[];

export const length = (lines: Line[]) => lines.reduce((sum, l) => sum + Math.hypot(l[2] - l[0], l[3] - l[1]), 0);

/** A seeded generator, so runs can be repeated. */
export function generator(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

export interface Outcome {
  won: boolean;
  /** Summed distance, metres, by which the marble missed each star, short of `margin` inside the reach. */
  shortfall: number;
  /** Where the marble went, sampled, in page metres. */
  path: Array<[number, number]>;
}

/** Plays the page with these lines. With a margin, a star only counts as met when the marble passed that far inside its reach. */
export function play(level: number, lines: Line[], margin = 0): Outcome {
  let won = false;
  const run = new MarbleRun(W, H, (event) => (won ||= event === 'won'), level);
  run.setLines(lines, HALF);
  run.release();
  const stars = LEVELS[level].stars.map(([x, y]) => [x * W, y * H]);
  const nearest = stars.map(() => 0.3);
  const path: Array<[number, number]> = [];
  for (let i = 0; i < 60 * 25 && run.phase === 'rolling'; i++) {
    run.step(1 / 60);
    const { x, y } = run.marble;
    stars.forEach(([sx, sy], k) => (nearest[k] = Math.min(nearest[k], Math.hypot(sx - x, sy - y))));
    if (i % 6 === 0) path.push([x, y]);
  }
  const missed = nearest.reduce((sum, d) => sum + Math.max(0, d - (REACH - margin)), 0);
  // A pass with no margin asked for is a pass, however close it shaved a star.
  const shortfall = won && margin === 0 ? 0 : missed + (won ? 0 : 0.002);
  return { won, shortfall, path };
}

/** The lines with every end moved by up to SHAKE, from a generator. */
export const shaken = (lines: Line[], random: () => number) => lines.map((l) => l.map((v) => v + (random() * 2 - 1) * SHAKE));

/** True if the lines pass as drawn and with every end nudged, five times over. The original fixed test. */
export function dependable(level: number, lines: Line[]): boolean {
  if (!play(level, lines).won) return false;
  const random = generator(7);
  for (let trial = 0; trial < 5; trial++) if (!play(level, shaken(lines, random)).won) return false;
  return true;
}

/** The share of `trials` freshly nudged copies of the lines that pass. */
export function passRate(level: number, lines: Line[], trials = 200): number {
  const random = generator(12345);
  let passed = 0;
  for (let trial = 0; trial < trials; trial++) if (play(level, shaken(lines, random)).won) passed++;
  return passed / trials;
}

/** Page metres to page fractions, rounded for printing, and back. */
export const toFractions = (lines: Line[]) => lines.map((l) => l.map((v, k) => +(v / (k % 2 ? H : W)).toFixed(4)));
export const toMetres = (lines: Line[]) => lines.map((l) => l.map((v, k) => v * (k % 2 ? H : W)));
const EDGE = 0.002;
export const onPage = (l: Line) => l.every((v, k) => v > EDGE && v < (k % 2 ? H : W) - EDGE);

/** The part of a line that lies on the page, as a pencil would leave it. Null if none does. */
export function clipped([x0, y0, x1, y1]: Line): Line | null {
  const dx = x1 - x0;
  const dy = y1 - y0;
  let from = 0;
  let to = 1;
  const edges: Array<[number, number]> = [
    [-dx, x0 - EDGE * 1.01],
    [dx, W - EDGE * 1.01 - x0],
    [-dy, y0 - EDGE * 1.01],
    [dy, H - EDGE * 1.01 - y0],
  ];
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return null;
    } else if (p < 0) from = Math.max(from, q / p);
    else to = Math.min(to, q / p);
  }
  return from < to ? [x0 + dx * from, y0 + dy * from, x0 + dx * to, y0 + dy * to] : null;
}
