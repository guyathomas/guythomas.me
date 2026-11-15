import type { SheetBody } from '../sheet/body';
import { toLocal, toWorld, type Pose } from '../sheet/pose';
import { placeProp, type Prop } from '../scene/props';
import { coast, collide, DESK, throwSpin, type Body, type Bounds } from './motion';

export interface Item extends Body {
  prop: Prop;
  lift: number;
  held: boolean;
  /** Extent of the object along its own length, for picking: [from, to] in metres. */
  reach: [number, number];
  home: { x: number; z: number; angle: number };
  /** A move the object makes by itself, such as going back to its place. */
  flight: { fromX: number; fromZ: number; fromAngle: number; time: number } | null;
  /** Set while the object is being used in the hand: where its working end is, and whether it touches the desk. */
  hand: { x: number; z: number; touching: boolean; flipped: boolean } | null;
}

const HELD_LIFT = 0.007;
const FLIGHT_TIME = 0.5;
/** Fastest a thing leaves the hand, metres per second. */
const MAX_THROW = 1.4;
/** Furthest a sliding thing moves between checks for what is in its way, metres. */
const STRIDE = 0.003;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** The loose things on the desk: where they are, picking them up, throwing them, putting them down. */
export class DeskObjects {
  readonly items: Item[] = [];
  private grabbed: Item | null = null;
  private readonly riders = new Set<Item>();
  /** Where thrown things stop: the part of the desk that can be seen, so nothing is lost off the edge of the picture. */
  bounds: Bounds = DESK;
  private offset: [number, number] = [0, 0];

  /** `byHand` is false when the object put itself down. */
  constructor(private readonly setDown: (item: Item, byHand: boolean) => void, private readonly instant = false) {}

  add(prop: Prop, reach: [number, number] = [0, 0]): Item {
    const item: Item = {
      prop,
      x: 0,
      z: 0,
      angle: 0,
      vx: 0,
      vz: 0,
      spin: 0,
      rolled: 0,
      span: prop.solid.span,
      radius: prop.solid.radius,
      mass: prop.mass,
      rolls: prop.roll !== undefined,
      lift: 0,
      held: false,
      reach,
      home: { x: 0, z: 0, angle: 0 },
      flight: null,
      hand: null,
    };
    this.items.push(item);
    return item;
  }

  find(name: Prop['name']): Item | undefined {
    return this.items.find((item) => item.prop.name === name);
  }

  setHome(item: Item, x: number, z: number, angle: number): void {
    item.home = { x, z, angle };
    this.move(item, x, z, angle);
  }

  move(item: Item, x: number, z: number, angle = item.angle): void {
    item.x = x;
    item.z = z;
    item.angle = angle;
    this.place(item);
  }

  private place(item: Item): void {
    if (item.hand && item.prop.hold) {
      item.prop.hold(item.hand.x, item.hand.z, item.hand.touching, item.hand.flipped);
      return;
    }
    placeProp(item.prop, item.x, item.z, item.angle, item.lift);
    item.prop.roll?.(item.rolled);
  }

  private still(item: Item): void {
    item.vx = item.vz = item.spin = 0;
  }

  /** The object under a desk point, if any. */
  pick(x: number, z: number): Item | null {
    let found: Item | null = null;
    let best = Infinity;
    for (const item of this.items) {
      if (!item.prop.group.visible || item.flight || item.hand) continue;
      const dx = x - item.x;
      const dz = z - item.z;
      const cos = Math.cos(item.angle);
      const sin = Math.sin(item.angle);
      const along = dx * cos - dz * sin;
      const across = dx * sin + dz * cos;
      const nearest = Math.min(item.reach[1], Math.max(item.reach[0], along));
      const distance = Math.hypot(along - nearest, across);
      if (distance < item.prop.radius && distance < best) {
        best = distance;
        found = item;
      }
    }
    return found;
  }

  grab(item: Item, x: number, z: number): void {
    this.grabbed = item;
    item.held = true;
    item.flight = null;
    this.still(item);
    this.offset = [item.x - x, item.z - z];
  }

  /** `dt` is the time since the hand last moved, for the speed it will be thrown at. */
  drag(x: number, z: number, dt: number): void {
    const item = this.grabbed;
    if (!item) return;
    const nx = x + this.offset[0];
    const nz = z + this.offset[1];
    const step = Math.max(dt, 1 / 240);
    item.vx += ((nx - item.x) / step - item.vx) * 0.4;
    item.vz += ((nz - item.z) / step - item.vz) * 0.4;
    this.move(item, nx, nz);
  }

  /** `idle` is how long the hand had been still: a thing set down is not thrown. */
  release(idle: number): void {
    const item = this.grabbed;
    this.grabbed = null;
    if (!item) return;
    item.held = false;
    if (idle > 0.07 || this.instant || item.prop.grip) {
      this.still(item);
      return;
    }
    // A hand only throws so hard.
    const speed = Math.hypot(item.vx, item.vz);
    if (speed > MAX_THROW) {
      item.vx *= MAX_THROW / speed;
      item.vz *= MAX_THROW / speed;
    }
    item.spin = throwSpin(this.offset[0], this.offset[1], item.vx, item.vz);
  }

  /** The object in the hand right now, if any. */
  get inHand(): Item | null {
    return this.grabbed;
  }

  /** Takes an object into the hand to use it, with its working end at a desk point. */
  hold(item: Item, x: number, z: number, touching: boolean, flipped = false): void {
    if (this.grabbed === item) this.grabbed = null;
    item.held = true;
    item.flight = null;
    this.still(item);
    item.hand = { x, z, touching, flipped };
    this.place(item);
  }

  /** Lays an object that was in use down on the desk. */
  layDown(item: Item, x: number, z: number, angle: number): void {
    item.hand = null;
    item.held = false;
    item.lift = 0.008;
    this.move(item, x, z, angle);
  }

  /**
   * Notes what is resting on the sheet as a hand takes hold of it. Only these
   * ride along; anything the sheet then slides under stays where it is.
   */
  board(sheet: SheetBody): void {
    this.riders.clear();
    for (const item of this.items) {
      if (item.held || item.flight || !item.prop.group.visible) continue;
      const [lx, lz] = toLocal(sheet.pose, item.x, item.z);
      if (Math.abs(lx) <= sheet.width / 2 && Math.abs(lz) <= sheet.height / 2) this.riders.add(item);
    }
  }

  /** Things that were resting on the sheet when it was taken hold of ride along as it slides. */
  carry(from: Pose, to: Pose): void {
    const turned = Math.atan2(to.c, to.a) - Math.atan2(from.c, from.a);
    for (const item of this.riders) {
      // Picked up, or sent on its way, it has left the sheet.
      if (item.held || item.flight || !item.prop.group.visible) {
        this.riders.delete(item);
        continue;
      }
      const [lx, lz] = toLocal(from, item.x, item.z);
      const [x, z] = toWorld(to, lx, lz);
      this.move(item, x, z, item.angle - turned);
    }
  }

  /** Picks the object up and puts it back in its place. */
  sendHome(item: Item): void {
    if (item.held) return;
    this.still(item);
    if (this.instant) {
      this.move(item, item.home.x, item.home.z, item.home.angle);
      return;
    }
    item.flight = { fromX: item.x, fromZ: item.z, fromAngle: item.angle, time: 0 };
  }

  home(): void {
    this.grabbed = null;
    for (const item of this.items) {
      this.still(item);
      item.flight = null;
      item.held = false;
      item.hand = null;
      item.rolled = 0;
      item.lift = 0;
      this.move(item, item.home.x, item.home.z, item.home.angle);
    }
  }

  private fly(item: Item, dt: number): void {
    const flight = item.flight!;
    flight.time += dt;
    const t = smooth(Math.min(1, flight.time / FLIGHT_TIME));
    item.lift = Math.sin(Math.PI * t) * 0.014;
    this.move(item, flight.fromX + (item.home.x - flight.fromX) * t, flight.fromZ + (item.home.z - flight.fromZ) * t, flight.fromAngle + (item.home.angle - flight.fromAngle) * t);
    if (t >= 1) {
      item.flight = null;
      item.lift = 0;
      this.place(item);
      this.setDown(item, false);
    }
  }

  /** Advances everything in motion. Returns true while anything moves. */
  step(dt: number): boolean {
    let moving = false;
    for (const item of this.items) {
      if (item.flight) {
        this.fly(item, dt);
        moving = true;
        continue;
      }
      if (item.hand) continue;
      const goal = item.held ? HELD_LIFT : 0;
      if (item.lift !== goal) {
        const before = item.lift;
        const rate = item.held ? 0.07 : 0.11;
        item.lift = goal > item.lift ? Math.min(goal, item.lift + rate * dt) : Math.max(goal, item.lift - rate * dt);
        this.place(item);
        if (item.lift === 0 && before > 0) this.setDown(item, true);
        moving = true;
      }
    }
    // Sliding and bumping go in short strides, so a thrown thing cannot pass through another.
    const free = this.items.filter((item) => !item.held && !item.flight);
    const fastest = Math.max(0, ...free.map((item) => Math.hypot(item.vx, item.vz)));
    const strides = Math.min(12, Math.max(1, Math.ceil((fastest * dt) / STRIDE)));
    for (let s = 0; s < strides; s++) moving = this.slide(free, dt / strides) || moving;
    return moving;
  }

  private slide(free: Item[], dt: number): boolean {
    let moving = false;
    for (const item of free) {
      if (item.vx === 0 && item.vz === 0 && item.spin === 0) continue;
      coast(item, dt, this.bounds);
      this.place(item);
      moving = true;
    }
    // Things on the desk get in each other's way; a thing in the hand is above them.
    const grounded = free.filter((item) => item.prop.group.visible && item.lift < 0.003);
    for (let i = 0; i < grounded.length; i++) {
      for (let j = i + 1; j < grounded.length; j++) {
        if (!collide(grounded[i], grounded[j])) continue;
        this.place(grounded[i]);
        this.place(grounded[j]);
        moving = true;
      }
    }
    return moving;
  }
}
