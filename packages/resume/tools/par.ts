// Plays the marble run to find how little line each page can be passed with.
// Starts from the plain solution (with and without any opening line) and from
// any seed solutions given, then keeps shortening, moving, turning, splitting,
// adding and removing lines. A change is kept when the marble misses the stars
// by less, summed over the run as drawn and over copies with every line end
// nudged as a hand would place it; once it misses nothing, when it is shorter.
// The nudged copies are redrawn every so often so the search cannot learn them.
// A solution is reported only if it passes the fixed five-nudge test and at
// least 90% of 200 fresh nudges. Prints lengths in page widths.
//
// usage: bun tools/par.ts [rounds] [page] [--restarts n] [--max-lines n] [--seeds file.json] [--lines]
// seeds file: { "<page>": [ [[x0, y0, x1, y1], ...], ... ] } in page fractions, pages counted from 1.
import { readFileSync } from 'node:fs';
import { LEVELS } from '../src/game/levels';
import { plainSolution } from '../src/game/routes';
import { MarbleRun } from '../src/game/run';
import { clipped, dependable, generator, H, length, type Line, onPage, passRate, play, shaken, SHAKE, toFractions, toMetres, W } from './par-sim';

const args = process.argv.slice(2);
const VALUED = ['--restarts', '--max-lines', '--seeds'];
const flag = (name: string) => {
  const at = args.indexOf(name);
  return at < 0 ? undefined : args[at + 1];
};
const positional = args.filter((arg, i) => !arg.startsWith('--') && !VALUED.includes(args[i - 1]));
const rounds = Number(positional[0] ?? 4000);
const only = positional[1] ? Number(positional[1]) - 1 : null;
const restarts = Number(flag('--restarts') ?? 6);
const maxLines = Number(flag('--max-lines') ?? 6);
const seedFile = flag('--seeds');
const seeds: Record<string, number[][][]> = seedFile ? JSON.parse(readFileSync(seedFile, 'utf8')) : {};

/** Nudged copies tried per candidate, how often they are redrawn, and how far inside a star's reach the run as drawn must pass. */
const COPIES = 16;
const REDRAW = 400;
const MARGIN = 0.0015;
const ENOUGH = 0.9;

const random = generator(11);
const gauss = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());

interface Score {
  shortfall: number;
  length: number;
}
const better = (a: Score, b: Score) => a.shortfall < b.shortfall - 1e-12 || (a.shortfall <= 1e-12 && b.shortfall <= 1e-12 && a.length < b.length);

function score(level: number, lines: Line[], copies: Array<() => number>): Score {
  if (lines.length === 0 || !lines.every(onPage)) return { shortfall: Infinity, length: Infinity };
  const drawn = play(level, lines, MARGIN);
  let shortfall = drawn.shortfall * 2;
  if (!drawn.won) shortfall += copies.length * 0.05;
  else for (const copy of copies) shortfall += play(level, shaken(lines, copy)).shortfall;
  return { shortfall, length: length(lines) };
}

/** A new short line under a point the marble passes through now. */
function added(level: number, lines: Line[]): Line[] {
  const { path } = play(level, lines);
  const [x, y] = path.length ? path[Math.floor(random() * Math.min(path.length, 60))] : [LEVELS[level].start[0] * W, LEVELS[level].start[1] * H];
  const cx = x + gauss() * 0.004;
  const cy = y + 0.006 + random() * 0.02;
  const angle = (random() * 2 - 1) * 1.3 + (random() < 0.15 ? Math.PI / 2 : 0);
  const half = 0.004 + random() * 0.025;
  return [...lines, [cx - Math.cos(angle) * half, cy - Math.sin(angle) * half, cx + Math.cos(angle) * half, cy + Math.sin(angle) * half]];
}

function mutate(level: number, lines: Line[], step: number): Line[] {
  const kind = random();
  if (kind < 0.03 && lines.length > 1) {
    const gone = Math.floor(random() * lines.length);
    return lines.filter((_, k) => k !== gone);
  }
  if (kind < 0.05 && lines.length < maxLines) return added(level, lines);
  const next = lines.map((l) => l.slice());
  const i = Math.floor(random() * next.length);
  const [x0, y0, x1, y1] = next[i];
  const end = random() < 0.5 ? 0 : 2;
  if (kind < 0.07 && lines.length < maxLines) {
    // Split: rub out a piece from the middle.
    const at = 0.2 + random() * 0.6;
    const gap = 0.05 + random() * 0.25;
    const a = at - gap / 2;
    const b = at + gap / 2;
    next.splice(i, 1, [x0, y0, x0 + (x1 - x0) * a, y0 + (y1 - y0) * a], [x0 + (x1 - x0) * b, y0 + (y1 - y0) * b, x1, y1]);
  } else if (kind < 0.3) {
    // Shorten or lengthen from one end.
    const keep = Math.exp(gauss() * step * 10);
    const other = 2 - end;
    next[i][end] = next[i][other] + (next[i][end] - next[i][other]) * keep;
    next[i][end + 1] = next[i][other + 1] + (next[i][end + 1] - next[i][other + 1]) * keep;
  } else if (kind < 0.55) {
    next[i][end] += gauss() * step;
    next[i][end + 1] += gauss() * step;
  } else if (kind < 0.75) {
    const dx = gauss() * step;
    const dy = gauss() * step;
    next[i] = [x0 + dx, y0 + dy, x1 + dx, y1 + dy];
  } else {
    // Turn about the middle.
    const turn = gauss() * step * 15;
    const [cx, cy, hx, hy] = [(x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2];
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    next[i] = [cx - hx * c + hy * s, cy - hx * s - hy * c, cx + hx * c - hy * s, cy + hx * s + hy * c];
  }
  return next.filter((l) => Math.hypot(l[2] - l[0], l[3] - l[1]) > 0.002);
}

interface Found {
  lines: Line[];
  rate: number;
}

function search(level: number, start: Line[]): Found | null {
  let best: Found | null = null;
  // Judged on the fixed test and fresh nudges alone, so a start that already passes them counts.
  const keep = (lines: Line[]) => {
    if ((best && length(lines) >= length(best.lines)) || !dependable(level, lines)) return;
    const rate = passRate(level, lines);
    if (rate >= ENOUGH) best = { lines, rate };
  };
  const redraw = () => Array.from({ length: COPIES }, () => generator(1 + Math.floor(random() * 2147483645)));
  let copies = redraw();
  let current = start;
  let at = score(level, current, copies);
  keep(current);
  let step = 0.003;
  for (let round = 1; round <= rounds; round++) {
    if (round % REDRAW === 0) {
      keep(current);
      copies = redraw();
      at = score(level, current, copies);
    }
    const candidate = mutate(level, current, step);
    const there = score(level, candidate, copies);
    if (better(there, at)) {
      current = candidate;
      at = there;
      step = Math.min(0.008, step * 1.1);
    } else step = Math.max(0.0002, step * 0.985);
  }
  keep(current);
  return best;
}

const report: Array<{ page: number; lines: number[][] }> = [];
LEVELS.forEach((_, level) => {
  if (only !== null && only !== level) return;
  const opening = new MarbleRun(W, H, () => {}, level).starter();
  // Some plain ramps reach past the page edge; a pencil stops there.
  const own = plainSolution(level, W, H).map(clipped).filter((l): l is Line => l !== null);
  const plain = [...opening, ...own];
  const starts = [plain, own, ...(seeds[String(level + 1)] ?? []).map(toMetres)];
  let best: Found | null = null;
  for (let restart = 0; restart < Math.max(restarts, starts.length); restart++) {
    const from = starts[restart % starts.length];
    // Second time round a start, set off from a slightly different drawing of it.
    const start = restart < starts.length ? from : from.map((l) => l.map((v) => v + (random() * 2 - 1) * SHAKE));
    const found = search(level, start);
    if (found && (!best || length(found.lines) < length(best.lines))) best = found;
  }
  const plainNote = dependable(level, plain) ? '' : ' (not dependable)';
  const bestNote = best ? `best ${(length(best.lines) / W).toFixed(2)} in ${best.lines.length} lines, passes ${Math.round(best.rate * 100)}% of nudges` : 'nothing dependable found';
  console.log(`page ${level + 1}: plain ${(length(plain) / W).toFixed(2)}${plainNote}  ${bestNote}`);
  if (best) report.push({ page: level + 1, lines: toFractions(best.lines) });
});
if (process.argv.includes('--lines')) console.log(JSON.stringify(report));
