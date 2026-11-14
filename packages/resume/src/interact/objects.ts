import type { SheetBody } from '../sheet/body';
import { toLocal, toWorld, type Pose } from '../sheet/pose';
import { placeProp, type Prop } from '../scene/props';

export interface Item {
  prop: Prop;
  x: number;
  z: number;
  angle: number;
  lift: number;
  held: boolean;
  /** Extent of the object along its own length, for picking: [from, to] in metres. */
  span: [number, number];
  home: { x: number; z: number; angle: number };
}

const HELD_LIFT = 0.007;

/** The loose things on the desk: where they are, picking them up, putting them down. */
export class DeskObjects {
  readonly items: Item[] = [];
  private grabbed: Item | null = null;
  private offset: [number, number] = [0, 0];

  constructor(private readonly setDown: (item: Item) => void) {}

  add(prop: Prop, span: [number, number] = [0, 0]): Item {
    const item: Item = { prop, x: 0, z: 0, angle: 0, lift: 0, held: false, span, home: { x: 0, z: 0, angle: 0 } };
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
    placeProp(item.prop, x, z, angle, item.lift);
  }

  /** The object under a desk point, if any. */
  pick(x: number, z: number): Item | null {
    let found: Item | null = null;
    let best = Infinity;
    for (const item of this.items) {
      if (!item.prop.group.visible) continue;
      const dx = x - item.x;
      const dz = z - item.z;
      const cos = Math.cos(item.angle);
      const sin = Math.sin(item.angle);
      const along = dx * cos - dz * sin;
      const across = dx * sin + dz * cos;
      const nearest = Math.min(item.span[1], Math.max(item.span[0], along));
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
    this.offset = [item.x - x, item.z - z];
  }

  drag(x: number, z: number): void {
    if (this.grabbed) this.move(this.grabbed, x + this.offset[0], z + this.offset[1]);
  }

  release(): void {
    if (this.grabbed) this.grabbed.held = false;
    this.grabbed = null;
  }

  /** Things resting on the sheet ride along when it slides. */
  carry(sheet: SheetBody, from: Pose, to: Pose): void {
    const turned = Math.atan2(to.c, to.a) - Math.atan2(from.c, from.a);
    for (const item of this.items) {
      if (item.held || !item.prop.group.visible) continue;
      const [lx, lz] = toLocal(from, item.x, item.z);
      if (Math.abs(lx) > sheet.width / 2 || Math.abs(lz) > sheet.height / 2) continue;
      const [x, z] = toWorld(to, lx, lz);
      this.move(item, x, z, item.angle - turned);
    }
  }

  home(): void {
    for (const item of this.items) this.move(item, item.home.x, item.home.z, item.home.angle);
  }

  /** Eases held things up and released things down. Returns true while anything moves. */
  step(dt: number): boolean {
    let moving = false;
    for (const item of this.items) {
      const goal = item.held ? HELD_LIFT : 0;
      if (item.lift === goal) continue;
      const before = item.lift;
      const rate = item.held ? 0.07 : 0.11;
      item.lift = goal > item.lift ? Math.min(goal, item.lift + rate * dt) : Math.max(goal, item.lift - rate * dt);
      placeProp(item.prop, item.x, item.z, item.angle, item.lift);
      if (item.lift === 0 && before > 0) this.setDown(item);
      moving = true;
    }
    return moving;
  }
}
