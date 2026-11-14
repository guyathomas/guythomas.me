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
  private turnSpeed = 0;
  private dropSpeed = 0;
  private squareFrom: Pose | null = null;
  private squareTo: Pose | null = null;
  private squareTime = 0;
  private scripted: { from: [number, number]; to: [number, number]; time: number; duration: number } | null = null;
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
    this.scripted = null;
    this.events.slide(0);
  }

  moveCurl(x: number, z: number): void {
    if (this.phase === 'curl') this.hand = [x, z];
  }

  endCurl(): void {
    if (this.phase !== 'curl') return;
    const curl = this.sheet.curl;
    const half = curl ? Math.PI * curl.r * 0.5 : 0;
    const over = curl ? pastCrease(this.sheet.pose.cx, this.sheet.pose.cz, curl) > half : false;
    if (over) {
      this.phase = 'turning';
      this.turnSpeed = 0.5;
    } else {
      this.phase = 'return';
    }
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

  /** True once every corner has rolled past half a turn: the sheet is fully over. */
  private fullyOver(curl: Curl): boolean {
    const half = Math.PI * curl.r;
    for (let i = 0; i < 4; i++) {
      const [x, z] = this.sheet.cornerWorld(i);
      if (pastCrease(x, z, curl) < half) return false;
    }
    return true;
  }

  // Scripted moves

  /** Turns the sheet over as a hand would, then squares it up. */
  turnOver(): void {
    if (this.phase !== 'rest') return;
    // Take the corner nearest the bottom right of the picture.
    let corner = 0;
    let best = -Infinity;
    for (let i = 0; i < 4; i++) {
      const [x, z] = this.sheet.cornerWorld(i);
      if (x + z * 0.6 > best) {
        best = x + z * 0.6;
        corner = i;
      }
    }
    this.beginCurl(corner);
    const reach = this.sheet.width * 2.3;
    this.scripted = { from: [...this.anchor], to: [this.anchor[0] - reach, this.anchor[1] - this.sheet.height * 0.22], time: 0, duration: 1.15 };
    this.afterTurn = () => this.squareUp();
    if (this.instant) {
      this.sheet.curl = null;
      this.setPose({ ...this.homeFor(!this.frontUp) });
      this.phase = 'rest';
      this.scripted = null;
      this.afterTurn = null;
      this.sheet.update();
    }
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
    this.scripted = null;
    this.afterTurn = null;
    this.sheet.update();
    if (this.frontUp) this.squareUp();
    else this.turnOver();
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
        if (this.scripted) {
          const s = this.scripted;
          s.time += dt;
          const t = smooth(Math.min(1, s.time / s.duration));
          this.hand = [s.from[0] + (s.to[0] - s.from[0]) * t, s.from[1] + (s.to[1] - s.from[1]) * t];
        }
        const k = this.instant ? 1 : 1 - Math.exp(-dt * 22);
        const gap = Math.hypot(this.hand[0] - this.pull[0], this.hand[1] - this.pull[1]);
        this.pull[0] += (this.hand[0] - this.pull[0]) * k;
        this.pull[1] += (this.hand[1] - this.pull[1]) * k;
        const curl = this.applyCurl();
        sheet.update();
        if (this.scripted && curl && this.fullyOver(curl)) {
          this.scripted = null;
          this.finishTurn(curl);
          return true;
        }
        return gap > 0.0002 || this.scripted !== null;
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
        // Past the tipping point the sheet carries itself the rest of the way over.
        const curl = sheet.curl;
        if (!curl) {
          this.phase = 'rest';
          return false;
        }
        this.turnSpeed += dt * 2.6;
        this.pull[0] -= curl.nx * this.turnSpeed * dt;
        this.pull[1] -= curl.nz * this.turnSpeed * dt;
        const next = this.applyCurl();
        if (next && (this.fullyOver(next) || this.instant)) this.finishTurn(next);
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
