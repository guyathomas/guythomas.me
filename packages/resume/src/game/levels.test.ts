import { describe, expect, it } from 'vitest';
import { LEVELS } from './levels';
import { MarbleRun, type RunEvent } from './run';

const W = 0.2159;
const H = 0.2794;
const REACH = 0.0042 + 0.0004;

/** A ramp that carries the marble's centre from one page point to the next. */
function ramp(from: [number, number], to: [number, number], lead = 0.22, trail = 0.04): number[] {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  // Shift the line down its own normal by the marble's reach, so the centre rides the path.
  const nx = (-dy / length) * Math.sign(dx);
  const ny = (dx / length) * Math.sign(dx);
  const x0 = from[0] - dx * lead + nx * REACH;
  const y0 = from[1] - dy * lead + ny * REACH;
  const x1 = to[0] + dx * trail + nx * REACH;
  const y1 = to[1] + dy * trail + ny * REACH;
  return [x0, y0, x1, y1];
}

/** One way through each page, as the points the marble should pass through, in page fractions. */
const ROUTES: Array<Array<[number, number]>> = [
  [[0.34, 0.304], [0.42, 0.36], [0.62, 0.5], [0.82, 0.64]],
  [[0.8, 0.2], [0.5, 0.3], [0.2, 0.48], [0.6, 0.76]],
  [[0.5, 0.26], [0.2, 0.4], [0.8, 0.6], [0.38, 0.86]],
  [[0.16, 0.18], [0.84, 0.3], [0.5, 0.52], [0.16, 0.62], [0.84, 0.84]],
  [[0.5, 0.16], [0.16, 0.3], [0.4, 0.385], [0.84, 0.8]],
  [[0.12, 0.16], [0.86, 0.28], [0.14, 0.52], [0.86, 0.76]],
  [[0.14, 0.16], [0.3, 0.3], [0.82, 0.44], [0.6, 0.62]],
  [[0.86, 0.16], [0.2, 0.3], [0.8, 0.54], [0.34, 0.76]],
];

/** Lines a player would add besides ramps, in page fractions: here a backstop over the cup on page 7. */
const EXTRAS: Record<number, number[][]> = { 6: [[0.44, 0.54, 0.44, 0.655]] };

/** Draws a route as ramps, with a stop at the head of each so the marble cannot run off the back, and plays it. */
function play(level: number) {
  const events: RunEvent[] = [];
  const run = new MarbleRun(W, H, (event) => events.push(event), level);
  const points = ROUTES[level].map(([x, y]) => [x * W, y * H] as [number, number]);
  const lines: number[][] = [];
  let from = points[0];
  for (let i = 1; i < points.length; i++) {
    const to = points[i];
    const turns = i > 1 && Math.sign(to[0] - points[i - 1][0]) !== Math.sign(points[i - 1][0] - points[i - 2][0]);
    if (turns) {
      // The marble runs off the end of the last ramp, meets a wall, and drops onto the next ramp going back.
      const way = Math.sign(points[i - 1][0] - points[i - 2][0]);
      const wall = from[0] + way * 0.07 * W;
      lines.push([wall, from[1] - 0.04 * H, wall, from[1] + 0.075 * H]);
      from = [wall - way * REACH, from[1] + 0.06 * H];
      lines.push(ramp(from, to, 0, 0.04));
    } else {
      // Only the first ramp reaches back, to catch the marble as it drops from its shelf.
      lines.push(ramp(from, to, i === 1 ? 0.22 : 0));
    }
    from = to;
  }
  for (const extra of EXTRAS[level] ?? []) lines.push(extra.map((value, k) => value * (k % 2 ? H : W)));
  run.setLines(lines, 0.0004);
  const lead = run.lead;
  run.release();
  for (let i = 0; i < 60 * 20 && run.phase !== 'ready' && run.phase !== 'done' && run.level === level; i++) run.step(1 / 60);
  return { run, events, lead };
}

describe('levels', () => {
  it('keeps everything on the page', () => {
    for (const level of LEVELS) {
      for (const [x, y] of [level.start, ...level.stars, ...level.walls.flat()]) {
        expect(x).toBeGreaterThan(0.03);
        expect(x).toBeLessThan(0.97);
        expect(y).toBeGreaterThan(0.06);
        expect(y).toBeLessThan(0.95);
      }
      expect(level.stars).toHaveLength(3);
    }
  });

  LEVELS.forEach((_, index) => {
    it(`page ${index + 1} can be passed`, () => {
      const { run, events, lead } = play(index);
      expect(lead, 'the route fits in the lead allowed').toBeGreaterThan(0);
      expect(events.filter((event) => event === 'star'), 'stars collected').toHaveLength(3);
      if (index === LEVELS.length - 1) expect(run.phase).toBe('done');
      else expect(run.level).toBe(index + 1);
    });
  });
});
