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
  /** Whether the pencil may draw on this face just now. */
  allow(front: boolean): boolean;
  /** A stroke segment was drawn. `speed` is metres per second. */
  drawn(front: boolean, x0: number, y0: number, x1: number, y1: number, tone: number, speed: number): void;
  /** A stroke ended; `points` are its x, y pairs and `tones` the darkness of each segment. */
  stroke(front: boolean, points: number[], tones: number[]): void;
  /** The rubber passed over this point. */
  rub(at: PagePoint, speed: number): void;
  /** The pencil is resting, or has left the paper: nothing is being drawn or rubbed. */
  rest(): void;
  /** The point was pressed here. Return true to take it as a poke rather than the start of a line. */
  poke(at: PagePoint): boolean;
}

/** Half the width of a pencil line, metres. */
export const PENCIL_HALF = 0.00048;
const SPACING = 0.00035;
/** What kind of thing is in the hand. */
export interface ToolKind {
  /** True for a thing that only rubs out, like the eraser. */
  rubOnly: boolean;
  /** Where it lies when put down, relative to where its working end was. */
  laid: { x: number; z: number; angle: number };
}

export const PENCIL: ToolKind = { rubOnly: false, laid: { x: 0.05, z: 0.069, angle: 2.2 } };
export const ERASER: ToolKind = { rubOnly: true, laid: { x: 0.012, z: 0.017, angle: 2.2 } };

/** The page point under a desk point, if the sheet is lying flat there. */
export function pageAt(sheet: SheetBody, x: number, z: number): PagePoint | null {
  const hit = sheet.curl ? null : sheet.hit(x, z, 0);
  if (!hit || hit.u < 0 || hit.u > 1 || hit.v < 0 || hit.v > 1) return null;
  // The back is read mirrored, so its lines run the other way across the sheet.
  return { front: hit.front, x: (hit.front ? hit.u : 1 - hit.u) * sheet.width, y: hit.v * sheet.height };
}

/**
 * A thing held in the hand and used on the paper. The pencil follows the
 * pointer, draws where its point is pressed down, and turned end for end it
 * rubs lines out; the eraser only rubs.
 */
export class PencilTool {
  active = false;
  /** True while the rubber end is down. */
  rubbing = false;
  private stroke: { front: boolean; points: number[]; tones: number[] } | null = null;
  /** Where the rubber last was, while it is pressed to the paper. */
  private rubbed: PagePoint | null = null;

  constructor(
    private readonly item: Item,
    private readonly objects: DeskObjects,
    private readonly sheet: SheetBody,
    private readonly handling: SheetHandling,
    private readonly events: PencilEvents,
    private readonly kind: ToolKind = PENCIL,
  ) {}

  /** True for a tool with only a rubber end. */
  get rubOnly(): boolean {
    return this.kind.rubOnly;
  }

  private hold(x: number, z: number, touching: boolean): void {
    this.objects.hold(this.item, x, z, touching, this.rubbing && !this.kind.rubOnly);
  }

  private page(x: number, z: number): PagePoint | null {
    return this.handling.busy ? null : pageAt(this.sheet, x, z);
  }

  take(x: number, z: number): void {
    this.active = true;
    this.rubbing = this.kind.rubOnly;
    this.hold(x, z, false);
  }

  /** Turns the pencil end for end. Not while it is pressed to the paper. */
  turn(rubbing = !this.rubbing): void {
    if (!this.active || this.kind.rubOnly || this.stroke || this.rubbed || !this.item.hand) return;
    this.rubbing = rubbing;
    this.hold(this.item.hand.x, this.item.hand.z, false);
  }

  /** Moves the pencil with the pointer while nothing is pressed. */
  hover(x: number, z: number): void {
    if (this.active) this.hold(x, z, false);
  }

  /** The working end comes down. Returns false if that put the pencil down instead. */
  press(x: number, z: number): boolean {
    const at = this.page(x, z);
    if (!at) {
      this.putDown(x, z);
      return false;
    }
    this.hold(x, z, true);
    if (this.rubbing) {
      this.rubbed = at;
      this.events.rub(at, 0);
      return true;
    }
    if (this.events.poke(at) || !this.events.allow(at.front)) return true;
    this.stroke = { front: at.front, points: [at.x, at.y], tones: [] };
    this.events.drawn(at.front, at.x, at.y, at.x, at.y, 0.9, 0);
    return true;
  }

  /** The working end moves across the paper. `dt` is the time since it last moved. */
  drag(x: number, z: number, dt: number): void {
    const at = this.page(x, z);
    const { stroke } = this;
    this.hold(x, z, at !== null && (stroke !== null || this.rubbed !== null));
    if (this.rubbed) {
      if (!at) return this.events.rest();
      const speed = Math.hypot(at.x - this.rubbed.x, at.y - this.rubbed.y) / Math.max(dt, 1 / 240);
      this.rubbed = at;
      this.events.rub(at, speed);
      return;
    }
    if (!stroke) return;
    const n = stroke.points.length;
    const x0 = stroke.points[n - 2];
    const y0 = stroke.points[n - 1];
    const length = at ? Math.hypot(at.x - x0, at.y - y0) : 0;
    // Off the edge, onto the other face, or the page has been passed: the line ends there.
    if (!at || at.front !== stroke.front || !this.events.allow(stroke.front)) {
      this.lift();
      return;
    }
    if (length < SPACING) {
      this.events.rest();
      return;
    }
    const speed = length / Math.max(dt, 1 / 240);
    // A quick line is a light line.
    const tone = Math.min(0.95, Math.max(0.7, 1 - speed * 0.6));
    stroke.points.push(at.x, at.y);
    stroke.tones.push(tone);
    this.events.drawn(stroke.front, x0, y0, at.x, at.y, tone, speed);
  }

  /** The working end lifts off the paper; the pencil stays in the hand. */
  lift(): void {
    const { stroke } = this;
    this.stroke = null;
    this.rubbed = null;
    if (this.item.hand) this.hold(this.item.hand.x, this.item.hand.z, false);
    if (stroke) this.events.stroke(stroke.front, stroke.points, stroke.tones);
    else this.events.rest();
  }

  /** Abandons the line being drawn, when the page under it has been rubbed clean. */
  cut(): void {
    this.stroke = null;
  }

  /** Lays the pencil down by where its point was. */
  putDown(x = this.item.hand?.x ?? this.item.x, z = this.item.hand?.z ?? this.item.z): void {
    if (!this.active) return;
    this.lift();
    this.active = false;
    this.rubbing = false;
    const { laid } = this.kind;
    this.objects.layDown(this.item, x + laid.x, z + laid.z, laid.angle);
  }

  /** Forgets the hand without moving anything, for when the desk is reset around it. */
  drop(): void {
    this.stroke = null;
    this.rubbed = null;
    this.active = false;
    this.rubbing = false;
    this.events.rest();
  }
}
