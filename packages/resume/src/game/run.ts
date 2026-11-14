import { LEVELS, type Level } from './levels';
import { Marble, type Segment } from './marble';
import { burst, dashes, ring, star, type Sketch } from './sketch';

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
 * stars. All three must be collected in one run, with only so much pencil
 * lead to draw with. All coordinates are page metres, x across and y down.
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

  /** How much line the pencil has left for this page, metres. */
  get lead(): number {
    return Math.max(0, this.plan.lead * this.width - this.used - this.drawing);
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
    const hit = marble.step(dt, this.solid);
    if (hit > 0.06) this.emit('knock', Math.min(1, hit / 0.5));
    for (const item of this.stars) {
      if (item.got || Math.hypot(item.x - marble.x, item.y - marble.y) > marble.radius + STAR_RADIUS) continue;
      item.got = true;
      this.emit('star', 1);
    }
    if (this.stars.every((item) => item.got)) {
      this.phase = 'won';
      this.wonFor = 0;
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

    // In the head margin: a tally of pages reached, and how much lead is left.
    const top = height * 0.045;
    const done = this.level + (this.phase === 'done' ? 1 : 0);
    for (let i = 0; i <= Math.min(done, LEVELS.length - 1); i++) {
      const x = width * 0.07 + i * 0.0022 + Math.floor(i / 5) * 0.003;
      if (i % 5 === 4) line([x - 0.0098, top + 0.0038, x - 0.0008, top - 0.0002], 0.6);
      else line([x, top - 0.0004 * ((i * 7) % 3), x + 0.0004, top + 0.0042], 0.6);
    }
    if (this.phase === 'done') {
      // Every page passed: one large star, and nothing left to do.
      line(star(width / 2, height * 0.42, width * 0.13, 4.2), 0.85, LINE * 1.4);
      return out;
    }
    const full = 0.03;
    const right = width * 0.93;
    const left = (this.lead / (this.plan.lead * width)) * full;
    line([right - full, top + 0.0002, right - full, top + 0.0034], 0.5);
    line([right, top + 0.0002, right, top + 0.0034], 0.5);
    if (left > 0.0003) line([right - left, top + 0.0018, right, top + 0.0018], 0.9, LINE * 2.2);

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
    }
    return out;
  }
}
