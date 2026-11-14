import { LEVELS, type Level } from './levels';
import { Marble, type Segment } from './marble';
import { burst, dashes, numerals, ring, star, type Sketch } from './sketch';

export type RunEvent = 'release' | 'knock' | 'star' | 'lost' | 'won' | 'next' | 'finished';

interface Star {
  x: number;
  y: number;
  got: boolean;
  /** Seconds since it was collected, for its little burst. */
  since: number;
}

const LINE = 0.00036;
const STAR_RADIUS = 0.006;
const SHELF = 0.009;
const WIN_TIME = 1.7;

/**
 * The game on the back of the sheet. A marble waits on a shelf; lines drawn
 * on the page become ramps; let it go and it rolls down the page collecting
 * stars. All three must be collected in one run, and the less line it took
 * the better the page scores. All coordinates are page metres, x across and y down.
 */
export class MarbleRun {
  phase: 'ready' | 'rolling' | 'won' | 'done' = 'ready';
  level = 0;
  marble: Marble;
  private stars: Star[] = [];
  private walls: Segment[] = [];
  /** Length of line the viewer has drawn on this page, metres, and of the line being drawn now. */
  private used = 0;
  private drawing = 0;
  /** Everything the marble can strike: the page's own lines, then the viewer's. */
  private solid: Segment[] = [];
  private shelf: Segment;
  private stalled = 0;
  private clock = 0;
  private wonFor = 0;
  /** What each page passed so far scored. */
  private scores: number[] = [];
  /** The points each page passed so far scored. */
  private tally: number[] = [];

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly emit: (event: RunEvent, strength: number) => void,
    /** The page to open on. */
    first = 0,
  ) {
    this.marble = new Marble(0, 0);
    this.shelf = { x0: 0, y0: 0, x1: 0, y1: 0, half: LINE };
    this.load(first);
  }

  private get plan(): Level {
    return LEVELS[this.level % LEVELS.length];
  }

  private load(level: number): void {
    this.level = level;
    const { width, height, plan } = this;
    if (level === 0) {
      this.scores = [];
      this.tally = [];
    }
    this.stars = plan.stars.map(([x, y]) => ({ x: x * width, y: y * height, got: false, since: 0 }));
    this.walls = [];
    for (const wall of plan.walls) {
      for (let i = 1; i < wall.length; i++) {
        this.walls.push({ x0: wall[i - 1][0] * width, y0: wall[i - 1][1] * height, x1: wall[i][0] * width, y1: wall[i][1] * height, half: LINE });
      }
    }
    this.solid = this.walls.slice();
    this.used = this.drawing = 0;
    this.toStart();
  }

  private toStart(): void {
    const [sx, sy] = this.plan.start;
    this.marble = new Marble(sx * this.width, sy * this.height);
    const under = this.marble.y + this.marble.radius + LINE;
    this.shelf = { x0: this.marble.x - SHELF, y0: under, x1: this.marble.x + SHELF, y1: under, half: LINE };
    this.phase = 'ready';
    this.stalled = 0;
    // Every run starts over: the stars have to be taken in one go.
    for (const item of this.stars) item.got = false;
  }

  /**
   * The pencil lines this page opens with, each a run of x, y pairs. They are
   * the viewer's to keep or rub out, so they are handed back through `setLines`.
   */
  starter(): number[][] {
    return (this.plan.starter ?? []).map((line) => line.flatMap(([x, y]) => [x * this.width, y * this.height]));
  }

  /** How much line is on the page, metres, counting the line being drawn now. */
  get drawn(): number {
    return this.used + this.drawing;
  }

  /** What the page would score if it were passed now: three for a tidy solution, down to one. */
  get rating(): number {
    const pages = this.drawn / this.width;
    return pages <= this.plan.three ? 3 : pages <= this.plan.two ? 2 : 1;
  }

  /** Stars won so far, out of three a page. */
  get score(): number {
    return this.scores.reduce((sum, value) => sum + value, 0);
  }

  /**
   * What the page would score in points if it were passed now: 100 for as
   * little line as the page has ever been passed with, less in proportion as
   * more is drawn.
   */
  get worth(): number {
    const best = this.plan.best * this.width;
    return Math.round(100 * Math.min(1, best / Math.max(this.drawn, 1e-9)));
  }

  /** Points won so far, out of 100 a page. */
  get points(): number {
    return this.tally.reduce((sum, value) => sum + value, 0);
  }

  /** Counts line as it is being drawn, before it is handed over with `setLines`. */
  spend(length: number): void {
    this.drawing += length;
  }

  /** Back to the first page with nothing drawn. */
  reset(): void {
    this.load(0);
  }

  /** Everything the viewer has drawn on the page, each line a run of x, y pairs. */
  setLines(lines: number[][], half: number): void {
    this.solid = this.walls.slice();
    this.used = this.drawing = 0;
    for (const points of lines) {
      for (let i = 2; i < points.length; i += 2) {
        const segment = { x0: points[i - 2], y0: points[i - 1], x1: points[i], y1: points[i + 1], half };
        this.solid.push(segment);
        this.used += Math.hypot(segment.x1 - segment.x0, segment.y1 - segment.y0);
      }
    }
  }

  /** True when a page point is on the waiting marble. */
  onMarble(x: number, y: number): boolean {
    return this.phase === 'ready' && Math.hypot(x - this.marble.x, y - this.marble.y) < this.marble.radius + 0.006;
  }

  /** Takes the shelf away. */
  release(): void {
    if (this.phase !== 'ready') return;
    this.phase = 'rolling';
    this.emit('release', 1);
  }

  /** Advances the game. Returns true while the picture is changing. */
  step(elapsed: number): boolean {
    if (this.phase === 'ready' || this.phase === 'done') return false;
    // After a stall the marble takes up where it was, not a leap further on.
    const dt = Math.min(elapsed, 1 / 30);
    this.clock += dt;
    for (const item of this.stars) if (item.got) item.since += dt;
    if (this.phase === 'won') {
      this.wonFor += dt;
      if (this.wonFor > WIN_TIME) {
        if (this.level + 1 < LEVELS.length) {
          this.load(this.level + 1);
          this.emit('next', 1);
        } else {
          this.phase = 'done';
          this.emit('finished', 1);
        }
      }
      return true;
    }

    const { marble } = this;
    // Short steps, looking for stars after each, so that a fast marble cannot skip past one.
    const steps = Math.ceil(dt / (1 / 240));
    let hit = 0;
    for (let s = 0; s < steps; s++) {
      hit = Math.max(hit, marble.step(dt / steps, this.solid));
      for (const item of this.stars) {
        if (item.got || Math.hypot(item.x - marble.x, item.y - marble.y) > marble.radius + STAR_RADIUS) continue;
        item.got = true;
        this.emit('star', 1);
      }
    }
    if (hit > 0.06) this.emit('knock', Math.min(1, hit / 0.5));
    if (this.stars.every((item) => item.got)) {
      this.phase = 'won';
      this.wonFor = 0;
      this.scores[this.level] = this.rating;
      this.tally[this.level] = this.worth;
      this.emit('won', 1);
      return true;
    }
    this.stalled = Math.hypot(marble.vx, marble.vy) < 0.004 ? this.stalled + dt : 0;
    const margin = marble.radius * 2;
    const gone = marble.y > this.height + margin || marble.x < -margin || marble.x > this.width + margin;
    if (gone || this.stalled > 1.3) {
      this.toStart();
      this.emit('lost', 1);
    }
    return true;
  }

  /** Everything the game draws on the page this frame, as pencil lines. */
  sketch(): Sketch[] {
    const out: Sketch[] = [];
    const line = (points: number[], tone = 0.8, half = LINE) => out.push({ points, half, tone });
    // Redrawn a little differently a few times a second, like a flip book.
    const boil = this.phase === 'ready' || this.phase === 'done' ? 0 : Math.floor(this.clock / 0.13);
    const { marble, width, height } = this;

    // In the head margin: a tally of pages reached, the score, and how much has been drawn.
    const top = height * 0.045;
    const done = this.level + (this.phase === 'done' ? 1 : 0);
    for (let i = 0; i <= Math.min(done, LEVELS.length - 1); i++) {
      const x = width * 0.07 + i * 0.0022 + Math.floor(i / 5) * 0.003;
      if (i % 5 === 4) line([x - 0.0098, top + 0.0038, x - 0.0008, top - 0.0002], 0.6);
      else line([x, top - 0.0004 * ((i * 7) % 3), x + 0.0004, top + 0.0042], 0.6);
    }
    const fine = LINE * 0.7;
    if (this.phase === 'done') {
      // Every page passed: one large star, the stars won out of all there were, and the points.
      line(star(width / 2, height * 0.36, width * 0.13, 4.2), 0.85, LINE * 1.4);
      const size = width * 0.05;
      const centred = (text: string, y: number, scale: number, seed: number) => {
        for (const numeral of numerals(text, width / 2 - text.length * 0.41 * scale, y, scale, seed)) line(numeral, 0.85);
      };
      centred(`${this.score}/${LEVELS.length * 3}`, height * 0.48, size, 3.3);
      centred(String(this.points), height * 0.56, size * 1.5, 8.6);
      return out;
    }
    if (this.scores.length > 0) {
      // The running score: stars, then points.
      line(star(width * 0.36, top + 0.0019, 0.0021, 6.4), 0.7, fine);
      for (const numeral of numerals(String(this.score), width * 0.36 + 0.004, top - 0.0002, 0.0042, 1.7)) line(numeral, 0.75, fine);
      for (const numeral of numerals(String(this.points), width * 0.5, top - 0.0002, 0.0042, 5.2)) line(numeral, 0.75, fine);
    }
    // The bar grows with every line drawn. Short of the first notch the page scores three, then two, then one.
    const full = 0.032;
    const left = width * 0.93 - full;
    // The two-point limit sits three quarters of the way along.
    const scale = (full * 0.75) / (this.plan.two * width);
    const notches = [this.plan.three, this.plan.two].map((limit) => left + limit * width * scale);
    line([left, top + 0.0002, left, top + 0.0036], 0.5, fine);
    for (const notch of notches) line([notch, top + 0.0006, notch, top + 0.0032], 0.5, fine);
    [3, 2, 1].forEach((points, band) => {
      const from = band === 0 ? left : notches[band - 1];
      const to = band === 2 ? left + full : notches[band];
      for (let i = 0; i < points; i++) {
        const x = (from + to) / 2 + (i - (points - 1) / 2) * 0.0026;
        line(star(x, top - 0.0022, 0.0011, band * 3 + i), this.rating === points ? 0.75 : 0.35, fine * 0.8);
      }
    });
    const reach = Math.min(full, this.drawn * scale);
    if (reach > 0.0003) line([left, top + 0.0019, left + reach, top + 0.0019], 0.9, LINE * 2.2);

    for (const wall of this.walls) line([wall.x0, wall.y0, wall.x1, wall.y1]);
    if (this.phase === 'ready') {
      const { shelf } = this;
      line([shelf.x0, shelf.y0 - 0.0016, shelf.x0, shelf.y0, shelf.x1, shelf.y1, shelf.x1, shelf.y1 - 0.0016]);
      // Once there is something to roll on, the marble asks to be let go.
      if (this.used > 0) for (const dash of dashes(marble.x, marble.y, marble.radius * 2.1, this.level + 1.5)) line(dash, 0.55);
    }
    this.stars.forEach((item, index) => {
      if (!item.got) line(star(item.x, item.y, STAR_RADIUS, index * 7.3 + boil * 0.61), 0.74);
      else if (item.since < 0.45 && this.phase !== 'ready') for (const ray of burst(item.x, item.y, STAR_RADIUS, item.since / 0.45, index + 3)) line(ray, 0.7);
    });

    line(ring(marble.x, marble.y, marble.radius, 2.7 + boil * 0.37, marble.turned), 0.92, LINE * 1.25);
    // A glint inside, so the eye can see it roll.
    line(ring(marble.x, marble.y, marble.radius * 0.55, 5.1, marble.turned + 3.6, 0.22), 0.7);
    if (this.phase === 'won') {
      const spread = Math.min(1, this.wonFor / 0.7);
      if (spread < 1) for (const ray of burst(marble.x, marble.y, marble.radius * 2.2, spread, this.level + 11, 11)) line(ray, 0.85);
      // What the page scored, written large in the middle before it is rubbed clean.
      const stars = this.scores[this.level] ?? 0;
      for (let i = 0; i < stars; i++) line(star(width / 2 + (i - (stars - 1) / 2) * 0.016, height * 0.44, 0.0062, 12 + i), 0.85);
      const worth = String(this.tally[this.level] ?? 0);
      const size = 0.011;
      for (const numeral of numerals(worth, width / 2 - worth.length * 0.41 * size, height * 0.49, size, 2.9)) line(numeral, 0.85);
    }
    return out;
  }
}
