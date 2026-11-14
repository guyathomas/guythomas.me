import type { SheetBody } from '../sheet/body';
import { curlFromDrag, pastCrease, type Curl } from '../sheet/curl';
import { frontUp, lerpPose, movePose, reflectPose, toLocal, toWorld, type Pose } from '../sheet/pose';
import { glideStep, slideStep, type Glide } from '../sheet/slide';

type Phase = 'rest' | 'slide' | 'glide' | 'curl' | 'return' | 'turning' | 'dropping' | 'squaring';

export interface HandlingEvents {
  /** The sheet moved rigidly from one pose to another (so things resting on it can follow). */
  moved(from: Pose, to: Pose): void;
  slide(speed: number): void;
  flick(): void;
  slap(strength: number): void;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Everything a hand can do to the sheet: slide it, lift a corner, turn it
 * over. Owns the sheet's pose and curl, and animates the moments after a
 * release (coasting, falling back, completing a turn, dropping flat).
 */
export class SheetHandling {
  phase: Phase = 'rest';
  /** Where the sheet lies when squared up, front or back. */
  home: Pose;

  private readonly radius: number;
  private readonly gyration: number;
  private grabLocal: [number, number] = [0, 0];
  private glide: Glide = { vx: 0, vz: 0, spin: 0 };
  /** Flat desk position of the grabbed corner. */
  private anchor: [number, number] = [0, 0];
  /** Where the hand is, and where the sheet has caught up to. */
  private hand: [number, number] = [0, 0];
  private pull: [number, number] = [0, 0];
  /** The sheet carrying itself over: the roll sweeps across while the sheet stays where it is. */
  private turn: { from: [number, number]; to: [number, number]; angle: number; swing: number; q0: number; q1: number; time: number; duration: number } | null = null;
  /** How fast the hand is carrying the corner over, metres per second. */
  private handFlow = 0;
  private lastHand: [number, number] = [0, 0];
  private dropSpeed = 0;
  private squareFrom: Pose | null = null;
  private squareTo: Pose | null = null;
  private squareTime = 0;
  private afterTurn: (() => void) | null = null;

  constructor(private readonly sheet: SheetBody, private readonly events: HandlingEvents, private readonly instant: boolean) {
    this.home = { ...sheet.pose };
    this.radius = Math.min(0.019, Math.max(0.009, sheet.width * 0.085));
    this.gyration = Math.hypot(sheet.width, sheet.height) * 0.3;
  }

  get busy(): boolean {
    return this.phase !== 'rest';
  }

  get frontUp(): boolean {
    return frontUp(this.sheet.pose);
  }

  /** `carry` is true when the sheet is sliding flat, so whatever rests on it rides along. */
  private setPose(next: Pose, carry = false): void {
    const previous = this.sheet.pose;
    // Keep the sheet on the desk.
    next.cx = Math.min(0.42, Math.max(-0.42, next.cx));
    next.cz = Math.min(0.5, Math.max(-0.5, next.cz));
    this.sheet.pose = next;
    if (carry) this.events.moved(previous, next);
  }

  // Sliding

  beginSlide(x: number, z: number): void {
    if (this.phase !== 'rest' && this.phase !== 'glide') return;
    this.phase = 'slide';
    this.grabLocal = toLocal(this.sheet.pose, x, z);
    this.glide = { vx: 0, vz: 0, spin: 0 };
  }

  moveSlide(x: number, z: number, dt: number): void {
    if (this.phase !== 'slide') return;
    const [gx, gz] = toWorld(this.sheet.pose, this.grabLocal[0], this.grabLocal[1]);
    const before = this.sheet.pose;
    const next = slideStep(before, gx, gz, x, z, this.gyration);
    const blend = 0.35;
    const step = Math.max(dt, 1 / 240);
    this.glide.vx += ((next.cx - before.cx) / step - this.glide.vx) * blend;
    this.glide.vz += ((next.cz - before.cz) / step - this.glide.vz) * blend;
    const turned = Math.atan2(next.c, next.a) - Math.atan2(before.c, before.a);
    this.glide.spin += (Math.atan2(Math.sin(turned), Math.cos(turned)) / step - this.glide.spin) * blend;
    this.setPose(next, true);
    this.sheet.update();
    this.events.slide(Math.hypot(this.glide.vx, this.glide.vz));
  }

  endSlide(): void {
    if (this.phase !== 'slide') return;
    const speed = Math.hypot(this.glide.vx, this.glide.vz);
    this.glide.vx *= 0.5;
    this.glide.vz *= 0.5;
    this.glide.spin *= 0.5;
    this.phase = speed > 0.03 && !this.instant ? 'glide' : 'rest';
    if (this.phase === 'rest') this.events.slide(0);
  }

  // Curling a corner

  beginCurl(corner: number): void {
    if (this.phase !== 'rest' && this.phase !== 'glide') return;
    this.phase = 'curl';
    this.anchor = this.sheet.cornerWorld(corner);
    this.hand = [...this.anchor];
    this.pull = [...this.anchor];
    this.lastHand = [...this.anchor];
    this.handFlow = 0;
    this.events.slide(0);
  }

  moveCurl(x: number, z: number): void {
    if (this.phase === 'curl') this.hand = [x, z];
  }

  endCurl(): void {
    if (this.phase !== 'curl') return;
    const curl = this.sheet.curl;
    const covered = curl ? this.covered(curl) : 0;
    // Let go a fifth of the way over, or flick it, and the sheet goes the rest of the way.
    if (curl && (covered > 0.18 || (covered > 0.06 && this.handFlow > 0.5))) this.beginTurn(curl, 0.45 + 0.4 * (1 - covered));
    else this.phase = 'return';
  }

  /** Half the sheet's extent along a desk direction. */
  private extent(nx: number, nz: number): number {
    const { cx, cz } = this.sheet.pose;
    let most = 0;
    for (let i = 0; i < 4; i++) {
      const [x, z] = this.sheet.cornerWorld(i);
      most = Math.max(most, (x - cx) * nx + (z - cz) * nz);
    }
    return most;
  }

  /** How much of the sheet has been carried past the crease, 0 to 1. */
  private covered(curl: Curl): number {
    let deepest = 0;
    for (let i = 0; i < 4; i++) {
      const [x, z] = this.sheet.cornerWorld(i);
      deepest = Math.max(deepest, pastCrease(x, z, curl));
    }
    return deepest / (2 * this.extent(curl.nx, curl.nz));
  }

  /**
   * Turns the sheet over where it lies. The crease swings square to the
   * sheet and sweeps across it while the sheet shifts the other way, so it
   * lands on the footprint it left.
   */
  private beginTurn(curl: Curl, duration: number): void {
    const pose = this.sheet.pose;
    let sx = 0;
    let sz = 0;
    let best = -1;
    for (const [x, z] of [[pose.a, pose.c], [pose.b, pose.d]]) {
      const length = Math.hypot(x, z);
      const along = (curl.nx * x + curl.nz * z) / length;
      if (Math.abs(along) <= best) continue;
      best = Math.abs(along);
      sx = (Math.sign(along) * x) / length;
      sz = (Math.sign(along) * z) / length;
    }
    const angle = Math.atan2(curl.nz, curl.nx);
    const swing = Math.atan2(sz, sx) - angle;
    const reach = this.extent(sx, sz);
    const clear = Math.PI * this.radius + 0.002;
    const travel = 2 * reach + Math.PI * this.radius + 0.004;
    this.turn = {
      from: [pose.cx, pose.cz],
      to: [pose.cx + sx * travel, pose.cz + sz * travel],
      angle,
      swing: Math.atan2(Math.sin(swing), Math.cos(swing)),
      q0: (curl.mx - pose.cx) * curl.nx + (curl.mz - pose.cz) * curl.nz,
      q1: -(reach + clear),
      time: 0,
      duration,
    };
    this.phase = 'turning';
  }

  private applyCurl(): Curl | null {
    const curl = curlFromDrag(this.anchor[0], this.anchor[1], this.pull[0], this.pull[1], this.radius);
    this.sheet.curl = curl;
    return curl;
  }

  private finishTurn(curl: Curl): void {
    const half = Math.PI * curl.r * 0.5;
    this.sheet.curl = null;
    this.sheet.drop = 2 * curl.r;
    this.dropSpeed = 0;
    this.setPose(reflectPose(this.sheet.pose, curl.mx + curl.nx * half, curl.mz + curl.nz * half, curl.nx, curl.nz));
    this.phase = 'dropping';
  }

  // Scripted moves

  /** Turns the sheet over where it lies, like a page. `then` runs once it has landed. */
  turnOver(then?: () => void): void {
    if (this.phase !== 'rest') return;
    const pose = this.sheet.pose;
    // Lift the edge nearest the right of the picture.
    const length = Math.hypot(pose.a, pose.c);
    const side = pose.a + pose.c * 0.3 >= 0 ? 1 : -1;
    const nx = (side * pose.a) / length;
    const nz = (side * pose.c) / length;
    this.events.slide(0);
    if (this.instant) {
      this.sheet.curl = null;
      this.setPose(reflectPose(pose, pose.cx, pose.cz, nx, nz));
      this.sheet.update();
      then?.();
      return;
    }
    const edge = this.extent(nx, nz) + 0.001;
    this.afterTurn = then ?? null;
    this.beginTurn({ mx: pose.cx + nx * edge, mz: pose.cz + nz * edge, nx, nz, r: this.radius }, 0.95);
  }

  private homeFor(front: boolean): Pose {
    return front ? { ...this.home } : reflectPose(this.home, this.home.cx, this.home.cz, 1, 0);
  }

  /** Eases the sheet back to square, keeping whichever face is up. */
  squareUp(): void {
    this.squareFrom = { ...this.sheet.pose };
    this.squareTo = this.homeFor(this.frontUp);
    this.squareTime = 0;
    this.phase = 'squaring';
  }

  /** Back to the start: square, front up, flat. */
  reset(): void {
    if (this.phase === 'curl' || this.phase === 'return' || this.phase === 'turning' || this.phase === 'dropping') {
      this.sheet.curl = null;
      this.sheet.drop = 0;
      this.phase = 'rest';
    }
    if (this.phase === 'slide' || this.phase === 'glide' || this.phase === 'squaring') this.phase = 'rest';
    // A freeze state can leave the sheet curled while at rest.
    this.sheet.curl = null;
    this.sheet.drop = 0;
    this.turn = null;
    this.afterTurn = null;
    this.sheet.update();
    if (this.frontUp) this.squareUp();
    else this.turnOver(() => this.squareUp());
  }

  /** Pins a static pose for a freeze state. */
  pose(kind: 'corner-lifted' | 'mid-flip' | 'back'): void {
    this.phase = 'rest';
    this.sheet.drop = 0;
    if (kind === 'back') {
      this.sheet.curl = null;
      this.setPose(this.homeFor(false));
    } else if (kind === 'corner-lifted') {
      const [x, z] = this.sheet.cornerWorld(0);
      this.sheet.curl = curlFromDrag(x, z, x + 0.062, z + 0.05, this.radius);
    } else {
      const [x, z] = this.sheet.cornerWorld(2);
      this.sheet.curl = curlFromDrag(x, z, x - this.sheet.width * 1.02, z - this.sheet.height * 0.1, this.radius);
    }
    this.sheet.update();
  }

  /** Advances whatever is in motion. Returns true while the sheet is still moving. */
  step(dt: number): boolean {
    const { sheet } = this;
    switch (this.phase) {
      case 'rest':
      case 'slide':
        return false;

      case 'glide': {
        const pose = sheet.pose;
        this.setPose(movePose(pose, pose.cx, pose.cz, this.glide.spin * dt, this.glide.vx * dt, this.glide.vz * dt), true);
        sheet.update();
        const moving = glideStep(this.glide, dt, 8);
        this.events.slide(moving ? Math.hypot(this.glide.vx, this.glide.vz) : 0);
        if (!moving) this.phase = 'rest';
        return true;
      }

      case 'curl': {
        const k = this.instant ? 1 : 1 - Math.exp(-dt * 22);
        const gap = Math.hypot(this.hand[0] - this.pull[0], this.hand[1] - this.pull[1]);
        this.pull[0] += (this.hand[0] - this.pull[0]) * k;
        this.pull[1] += (this.hand[1] - this.pull[1]) * k;
        const curl = this.applyCurl();
        if (curl && dt > 0) {
          const flow = -((this.hand[0] - this.lastHand[0]) * curl.nx + (this.hand[1] - this.lastHand[1]) * curl.nz) / dt;
          this.handFlow += (flow - this.handFlow) * 0.35;
        }
        this.lastHand = [...this.hand];
        // Carried a third of the way, the sheet is going over whether or not it is let go.
        const going = curl !== null && this.covered(curl) >= 1 / 3;
        if (going) this.beginTurn(curl, 0.6);
        sheet.update();
        return gap > 0.0002 || going;
      }

      case 'return': {
        // The corner springs back down toward where it came from.
        const k = 1 - Math.exp(-dt * 16);
        this.pull[0] += (this.anchor[0] - this.pull[0]) * k;
        this.pull[1] += (this.anchor[1] - this.pull[1]) * k;
        const left = Math.hypot(this.anchor[0] - this.pull[0], this.anchor[1] - this.pull[1]);
        if (left < 0.0012 || this.instant) {
          sheet.curl = null;
          this.phase = 'rest';
          this.events.flick();
        } else {
          this.applyCurl();
        }
        sheet.update();
        return true;
      }

      case 'turning': {
        const turn = this.turn;
        if (!turn) {
          this.phase = 'rest';
          return false;
        }
        turn.time += dt;
        const t = this.instant ? 1 : Math.min(1, turn.time / turn.duration);
        const eased = smooth(t);
        const angle = turn.angle + turn.swing * eased;
        const nx = Math.cos(angle);
        const nz = Math.sin(angle);
        const cx = turn.from[0] + (turn.to[0] - turn.from[0]) * eased;
        const cz = turn.from[1] + (turn.to[1] - turn.from[1]) * eased;
        const q = turn.q0 + (turn.q1 - turn.q0) * eased;
        const curl = { mx: cx + nx * q, mz: cz + nz * q, nx, nz, r: this.radius };
        sheet.pose = { ...sheet.pose, cx, cz };
        sheet.curl = curl;
        if (t >= 1) {
          this.turn = null;
          this.finishTurn(curl);
        }
        sheet.update();
        return true;
      }

      case 'dropping': {
        this.dropSpeed += dt * 3.2;
        sheet.drop = Math.max(0, sheet.drop - this.dropSpeed * dt);
        if (sheet.drop === 0 || this.instant) {
          sheet.drop = 0;
          this.phase = 'rest';
          this.events.slap(Math.min(1, this.dropSpeed * 2.2));
          const after = this.afterTurn;
          this.afterTurn = null;
          after?.();
        }
        sheet.update();
        return true;
      }

      case 'squaring': {
        if (!this.squareFrom || !this.squareTo) {
          this.phase = 'rest';
          return false;
        }
        this.squareTime += dt;
        const t = this.instant ? 1 : smooth(Math.min(1, this.squareTime / 0.55));
        const distance = Math.hypot(this.squareTo.cx - this.squareFrom.cx, this.squareTo.cz - this.squareFrom.cz);
        this.setPose(t >= 1 ? { ...this.squareTo } : lerpPose(this.squareFrom, this.squareTo, t));
        sheet.update();
        this.events.slide(t >= 1 ? 0 : (distance / 0.55) * 4 * t * (1 - t));
        if (t >= 1) this.phase = 'rest';
        return true;
      }
    }
  }
}
