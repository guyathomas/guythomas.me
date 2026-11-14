/** A drawn line the marble can run along: a capsule in page metres (x across, y down the page). */
export interface Segment {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  half: number;
}

/** The pull down the page, metres per second squared: a gentle slope, not free fall. */
export const GRAVITY = 0.75;
const BOUNCE = 0.28;
const MAX_SPEED = 0.7;
const SUBSTEP = 1 / 480;

/** The marble: a disc that falls down the page and rolls on whatever is drawn under it. */
export class Marble {
  vx = 0;
  vy = 0;
  /** How far it has rolled, in radians. */
  turned = 0;
  readonly radius = 0.0042;

  constructor(public x: number, public y: number) {}

  /** Advances the marble. Returns the speed of the hardest impact in this step, 0 if none. */
  step(dt: number, segments: Segment[]): number {
    let hardest = 0;
    const steps = Math.max(1, Math.ceil(dt / SUBSTEP));
    const h = dt / steps;
    for (let s = 0; s < steps; s++) {
      this.vy += GRAVITY * h;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > MAX_SPEED) {
        this.vx *= MAX_SPEED / speed;
        this.vy *= MAX_SPEED / speed;
      }
      this.x += this.vx * h;
      this.y += this.vy * h;
      for (const segment of segments) hardest = Math.max(hardest, this.touch(segment, h));
    }
    return hardest;
  }

  private touch(segment: Segment, h: number): number {
    const reach = this.radius + segment.half;
    if (this.x < Math.min(segment.x0, segment.x1) - reach || this.x > Math.max(segment.x0, segment.x1) + reach) return 0;
    if (this.y < Math.min(segment.y0, segment.y1) - reach || this.y > Math.max(segment.y0, segment.y1) + reach) return 0;
    const dx = segment.x1 - segment.x0;
    const dy = segment.y1 - segment.y0;
    const lengthSq = dx * dx + dy * dy;
    const t = lengthSq > 0 ? Math.min(1, Math.max(0, ((this.x - segment.x0) * dx + (this.y - segment.y0) * dy) / lengthSq)) : 0;
    let nx = this.x - (segment.x0 + dx * t);
    let ny = this.y - (segment.y0 + dy * t);
    const distance = Math.hypot(nx, ny);
    if (distance >= reach) return 0;
    if (distance > 1e-9) {
      nx /= distance;
      ny /= distance;
    } else {
      nx = 0;
      ny = -1;
    }
    this.x += nx * (reach - distance);
    this.y += ny * (reach - distance);
    const into = this.vx * nx + this.vy * ny;
    if (into >= 0) return 0;
    // Small knocks die out, so the marble settles instead of chattering.
    const bounce = into < -0.05 ? BOUNCE : 0;
    this.vx -= (1 + bounce) * into * nx;
    this.vy -= (1 + bounce) * into * ny;
    // What is left runs along the line: rolling, with a little drag.
    const along = -this.vx * ny + this.vy * nx;
    const kept = along * (1 - 0.6 * h);
    const away = this.vx * nx + this.vy * ny;
    this.vx = -ny * kept + nx * away;
    this.vy = nx * kept + ny * away;
    this.turned += (along * h) / this.radius;
    return -into;
  }
}
