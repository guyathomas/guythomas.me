import type { SheetBody } from '../sheet/body';
import type { SheetHandling } from './handling';
import type { DeskObjects, Item } from './objects';

/** A point on one face of the sheet, in page metres as that face is read (x across, y down). */
export interface PagePoint {
  front: boolean;
  x: number;
  y: number;
}

export interface PencilEvents {
  /** A stroke segment was drawn. `speed` is metres per second. */
  drawn(front: boolean, x0: number, y0: number, x1: number, y1: number, tone: number, speed: number): void;
  /** A stroke ended; `points` are its x, y pairs. */
  stroke(front: boolean, points: number[]): void;
  /** The point is resting, or has left the paper: nothing is being drawn. */
  rest(): void;
  /** The point was pressed here. Return true to take it as a poke rather than the start of a line. */
  poke(at: PagePoint): boolean;
}

/** Half the width of a pencil line, metres. */
export const PENCIL_HALF = 0.0004;
const SPACING = 0.00035;
/** Where the pencil lies when put down, relative to where its point was. */
const LAID = { x: 0.05, z: 0.069, angle: 2.2 };

/** The page point under a desk point, if the sheet is lying flat there. */
export function pageAt(sheet: SheetBody, x: number, z: number): PagePoint | null {
  const hit = sheet.curl ? null : sheet.hit(x, z, 0);
  if (!hit || hit.u < 0 || hit.u > 1 || hit.v < 0 || hit.v > 1) return null;
  // The back is read mirrored, so its lines run the other way across the sheet.
  return { front: hit.front, x: (hit.front ? hit.u : 1 - hit.u) * sheet.width, y: hit.v * sheet.height };
}

/** The pencil in the hand: it follows the pointer, and draws where it is pressed to the paper. */
export class PencilTool {
  active = false;
  private stroke: { front: boolean; points: number[] } | null = null;

  constructor(
    private readonly item: Item,
    private readonly objects: DeskObjects,
    private readonly sheet: SheetBody,
    private readonly handling: SheetHandling,
    private readonly events: PencilEvents,
  ) {}

  take(x: number, z: number): void {
    this.active = true;
    this.objects.hold(this.item, x, z, false);
  }

  /** Moves the pencil with the pointer while nothing is pressed. */
  hover(x: number, z: number): void {
    if (this.active) this.objects.hold(this.item, x, z, false);
  }

  /** The point comes down. Returns false if that put the pencil down instead. */
  press(x: number, z: number): boolean {
    const at = this.handling.busy ? null : pageAt(this.sheet, x, z);
    if (!at) {
      this.putDown(x, z);
      return false;
    }
    this.objects.hold(this.item, x, z, true);
    if (this.events.poke(at)) return true;
    this.stroke = { front: at.front, points: [at.x, at.y] };
    this.events.drawn(at.front, at.x, at.y, at.x, at.y, 0.9, 0);
    return true;
  }

  /** The point moves across the paper. `dt` is the time since it last moved. */
  drag(x: number, z: number, dt: number): void {
    const at = this.handling.busy ? null : pageAt(this.sheet, x, z);
    const { stroke } = this;
    this.objects.hold(this.item, x, z, at !== null && stroke !== null);
    if (!stroke) return;
    // Off the edge, or onto the other face: the line ends there.
    if (!at || at.front !== stroke.front) {
      this.lift();
      return;
    }
    const n = stroke.points.length;
    const x0 = stroke.points[n - 2];
    const y0 = stroke.points[n - 1];
    const length = Math.hypot(at.x - x0, at.y - y0);
    if (length < SPACING) {
      this.events.rest();
      return;
    }
    const speed = length / Math.max(dt, 1 / 240);
    // A quick line is a light line.
    const tone = Math.min(0.95, Math.max(0.7, 1 - speed * 0.6));
    stroke.points.push(at.x, at.y);
    this.events.drawn(stroke.front, x0, y0, at.x, at.y, tone, speed);
  }

  /** The point lifts off the paper; the pencil stays in the hand. */
  lift(): void {
    const { stroke } = this;
    this.stroke = null;
    if (this.item.hand) this.objects.hold(this.item, this.item.hand.x, this.item.hand.z, false);
    if (stroke) this.events.stroke(stroke.front, stroke.points);
  }

  /** Lays the pencil down by where its point was. */
  putDown(x = this.item.hand?.x ?? this.item.x, z = this.item.hand?.z ?? this.item.z): void {
    if (!this.active) return;
    this.lift();
    this.active = false;
    this.objects.layDown(this.item, x + LAID.x, z + LAID.z, LAID.angle);
  }

  /** Forgets the hand without moving anything, for when the desk is reset around it. */
  drop(): void {
    this.stroke = null;
    this.events.rest();
    this.active = false;
  }
}
