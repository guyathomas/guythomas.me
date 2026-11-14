/**
 * A plain way through each page of the marble run, built the way a careful
 * player would: a ramp from star to star, and a wall to catch the marble where
 * it has to turn back. Used to prove every page can be passed, and as the
 * starting point when looking for shorter solutions. Not part of the piece.
 */

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

/** The points the marble should pass through on each page, in page fractions. */
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

/** Lines a player would add besides ramps, in page fractions: a backstop over the cup on page 7. */
const EXTRAS: Record<number, number[][]> = { 6: [[0.44, 0.54, 0.44, 0.655]] };

/** The lines of the plain solution to a page, in page metres, not counting any the page opens with. */
export function plainSolution(level: number, width: number, height: number): number[][] {
  const points = ROUTES[level].map(([x, y]) => [x * width, y * height] as [number, number]);
  const lines: number[][] = [];
  let from = points[0];
  for (let i = 1; i < points.length; i++) {
    const to = points[i];
    const turns = i > 1 && Math.sign(to[0] - points[i - 1][0]) !== Math.sign(points[i - 1][0] - points[i - 2][0]);
    if (turns) {
      // The marble runs off the end of the last ramp, meets a wall, and drops onto the next ramp going back.
      const way = Math.sign(points[i - 1][0] - points[i - 2][0]);
      const wall = from[0] + way * 0.07 * width;
      lines.push([wall, from[1] - 0.04 * height, wall, from[1] + 0.075 * height]);
      from = [wall - way * REACH, from[1] + 0.06 * height];
      lines.push(ramp(from, to, 0, 0.04));
    } else {
      // Only the first ramp reaches back, to catch the marble as it drops from its shelf.
      lines.push(ramp(from, to, i === 1 ? 0.22 : 0));
    }
    from = to;
  }
  for (const extra of EXTRAS[level] ?? []) lines.push(extra.map((value, k) => value * (k % 2 ? height : width)));
  return lines;
}
