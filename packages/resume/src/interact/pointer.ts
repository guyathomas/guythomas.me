import * as THREE from 'three';
import type { CameraRig } from '../scene/camera';
import type { LightRig } from '../scene/rig';
import type { SheetBody } from '../sheet/body';
import { linkAt, type LinkRegion } from '../typeset/raster';
import type { SheetHandling } from './handling';
import type { DeskObjects, Item } from './objects';
import { pageAt, type PagePoint, type PencilTool } from './pencil';

type Drag = 'slide' | 'curl' | 'object' | 'draw' | null;

export interface PointerDeps {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  sheet: SheetBody;
  handling: SheetHandling;
  objects: DeskObjects;
  rig: LightRig;
  cameraRig: CameraRig;
  frontLinks: LinkRegion[];
  /** The bell was struck. */
  ring(): void;
  /** Something changed: keep the frame loop running. */
  wake(): void;
  /** The things that are picked up and used in the hand. */
  tools: { pencil: PencilTool; eraser: PencilTool };
  /** A click on the page. Returns true if something there took it. */
  poke(at: PagePoint): boolean;
}

const CORNER_REACH = 0.021;

/** Turns pointer and touch input into handling of the sheet and the things on the desk. */
export class Pointer {
  private drag: Drag = null;
  private readonly ray = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private readonly plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly point = new THREE.Vector3();
  private downAt: [number, number] = [0, 0];
  private travelled = 0;
  private lastMove = 0;
  /** The mouse or pen pointer whose press began on the canvas, if any. */
  private pressed: number | null = null;
  /** True while the rubber is down only because the other mouse button is held. */
  private borrowed = false;
  private readonly grips: Array<{ element: HTMLElement; place: () => THREE.Vector3 | null; begin: (x: number, z: number) => void }> = [];

  constructor(private readonly deps: PointerDeps) {
    const { canvas } = deps;
    this.ray.layers.enableAll();
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onCancel);
    canvas.addEventListener('pointerleave', () => {
      if (this.drag) return;
      this.deps.cameraRig.sway.set(0, 0);
      this.deps.wake();
    });
    canvas.addEventListener('dblclick', this.onDouble);
    canvas.addEventListener('contextmenu', (event) => {
      if (this.tool.active) event.preventDefault();
    });
    if (window.matchMedia('(pointer: coarse)').matches) this.buildGrips();
  }

  private deskPoint(clientX: number, clientY: number): THREE.Vector3 | null {
    this.ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.deps.camera);
    return this.ray.ray.intersectPlane(this.plane, this.point);
  }

  private begin(clientX: number, clientY: number): void {
    const point = this.deskPoint(clientX, clientY);
    if (!point) return;
    const { objects, sheet, handling } = this.deps;
    this.downAt = [clientX, clientY];
    this.travelled = 0;
    this.lastMove = performance.now();

    const item = objects.pick(point.x, point.z);
    if (item) {
      objects.grab(item, point.x, point.z);
      this.drag = 'object';
    } else {
      const hit = sheet.curl ? null : sheet.hit(point.x, point.z, CORNER_REACH);
      if (hit && hit.corner !== null) {
        handling.beginCurl(hit.corner);
        this.drag = handling.phase === 'curl' ? 'curl' : null;
      } else if (hit) {
        handling.beginSlide(point.x, point.z);
        this.drag = handling.phase === 'slide' ? 'slide' : null;
      }
    }
    if (this.drag) this.deps.canvas.style.cursor = 'grabbing';
    this.deps.wake();
  }

  private move(clientX: number, clientY: number): void {
    const point = this.deskPoint(clientX, clientY);
    if (!point) return;
    const { objects, handling } = this.deps;
    const now = performance.now();
    const dt = (now - this.lastMove) / 1000;
    this.lastMove = now;
    this.travelled = Math.max(this.travelled, Math.hypot(clientX - this.downAt[0], clientY - this.downAt[1]));
    switch (this.drag) {
      case 'object':
        objects.drag(point.x, point.z, dt);
        break;
      case 'curl':
        handling.moveCurl(point.x, point.z);
        break;
      case 'slide':
        handling.moveSlide(point.x, point.z, dt);
        break;
    }
    this.deps.wake();
  }

  private end(clientX: number, clientY: number, cancelled: boolean): void {
    const { objects, handling, sheet, tools } = this.deps;
    const drag = this.drag;
    this.drag = null;
    if (drag === 'object') {
      // The pencil or the eraser, clicked or carried onto the paper, stays in the hand to be used.
      const name = objects.inHand?.prop.name;
      const tool = name === 'pencil' || name === 'eraser' ? tools[name] : null;
      const point = tool ? this.deskPoint(clientX, clientY) : null;
      if (tool && point && (this.travelled < 5 || pageAt(sheet, point.x, point.z))) {
        tool.take(point.x, point.z);
        this.setTool(true);
        this.deps.wake();
        return;
      }
      // A click that does not carry the bell off rings it.
      if (objects.inHand?.prop.name === 'bell' && this.travelled < 5) this.deps.ring();
      objects.release((performance.now() - this.lastMove) / 1000);
    }
    if (drag === 'curl') handling.endCurl();
    if (drag === 'slide') handling.endSlide();
    // A click on an object is not a click on what lies under it.
    if (drag !== 'object' && !cancelled && this.travelled < 5) this.click(clientX, clientY);
    this.hover(clientX, clientY);
    this.deps.wake();
  }

  /** The thing in the hand, or the pencil when the hand is empty. */
  private get tool(): PencilTool {
    const { pencil, eraser } = this.deps.tools;
    return eraser.active ? eraser : pencil;
  }

  /** A press and release without travel: something on the page takes it, or a link is followed. */
  private click(clientX: number, clientY: number): void {
    const { sheet } = this.deps;
    const point = this.deskPoint(clientX, clientY);
    const at = point ? pageAt(sheet, point.x, point.z) : null;
    if (at && this.deps.poke(at)) return;
    const link = this.linkUnder(clientX, clientY);
    if (!link || sheet.curl) return;
    if (link.href.startsWith('mailto:')) window.location.href = link.href;
    else window.open(link.href, '_blank', 'noopener');
  }

  private linkUnder(clientX: number, clientY: number): LinkRegion | undefined {
    const point = this.deskPoint(clientX, clientY);
    if (!point) return undefined;
    const hit = this.deps.sheet.hit(point.x, point.z, 0);
    if (!hit || !hit.front) return undefined;
    return linkAt(this.deps.frontLinks, hit.u, hit.v);
  }

  /** No button down: the picture shifts a breath with the pointer, and the cursor says what can be picked up. */
  private hover(clientX: number, clientY: number): void {
    const point = this.deskPoint(clientX, clientY);
    if (!point) return;
    const { objects, sheet, canvas, cameraRig } = this.deps;
    cameraRig.sway.set((clientX / window.innerWidth) * 2 - 1, (clientY / window.innerHeight) * 2 - 1);
    let cursor = 'default';
    if (objects.pick(point.x, point.z)) cursor = 'grab';
    else {
      const hit = sheet.curl ? null : sheet.hit(point.x, point.z, CORNER_REACH);
      if (hit?.corner !== null && hit) cursor = 'grab';
      else if (hit && hit.front && linkAt(this.deps.frontLinks, hit.u, hit.v)) cursor = 'pointer';
    }
    canvas.style.cursor = cursor;
    this.deps.wake();
  }

  /** A double click on the bare sheet turns it over. */
  private onDouble = (event: MouseEvent): void => {
    if (this.tool.active) return;
    const point = this.deskPoint(event.clientX, event.clientY);
    const { objects, sheet, handling } = this.deps;
    if (!point || objects.pick(point.x, point.z) || this.linkUnder(event.clientX, event.clientY)) return;
    if (!sheet.hit(point.x, point.z, 0)) return;
    handling.turnOver();
    this.deps.wake();
  };

  private setTool(on: boolean): void {
    const { canvas } = this.deps;
    canvas.style.cursor = on ? 'none' : 'default';
    // With the pencil in hand a finger draws rather than scrolls.
    canvas.style.touchAction = on ? 'none' : '';
  }

  /** Abandons a press in progress, so that its release does nothing. */
  private cancelPress(): void {
    this.borrowed = false;
    if (this.pressed === null) return;
    if (this.deps.canvas.hasPointerCapture(this.pressed)) this.deps.canvas.releasePointerCapture(this.pressed);
    this.pressed = null;
  }

  /** Lays the pencil down if it is in the hand. Returns true if it was. */
  putDownPencil(): boolean {
    const pencil = this.tool;
    if (!pencil.active) return false;
    pencil.putDown();
    if (this.drag === 'draw') this.cancelPress();
    this.drag = null;
    this.setTool(false);
    this.deps.wake();
    return true;
  }

  /** Forgets the pencil without moving it, when the desk is being reset. */
  dropPencil(): void {
    this.deps.tools.pencil.drop();
    this.deps.tools.eraser.drop();
    if (this.drag === 'draw') {
      this.cancelPress();
      this.drag = null;
    }
    this.setTool(false);
  }

  /** Turns the pencil in the hand end for end. Returns true if there was one to turn. */
  turnPencil(): boolean {
    const pencil = this.tool;
    if (!pencil.active) return false;
    pencil.turn();
    this.deps.wake();
    return true;
  }

  private onDown = (event: PointerEvent): void => {
    const pencil = this.tool;
    // With the pencil in hand, the other mouse button rubs out for as long as it is held.
    const other = pencil.active && !pencil.rubOnly && event.button === 2 && !this.drag;
    if (event.button !== 0 && !other) return;
    // Reaching for something else on the desk puts the pencil down first.
    const reach = pencil.active && !this.drag && event.button === 0 ? this.deskPoint(event.clientX, event.clientY) : null;
    if (reach && this.deps.objects.pick(reach.x, reach.z)) this.putDownPencil();
    if (pencil.active) {
      const point = this.deskPoint(event.clientX, event.clientY);
      if (!point || this.drag) return;
      if (other) {
        this.borrowed = !pencil.rubbing;
        pencil.turn(true);
      }
      this.lastMove = performance.now();
      if (pencil.press(point.x, point.z)) {
        this.pressed = event.pointerId;
        this.deps.canvas.setPointerCapture(event.pointerId);
        this.drag = 'draw';
      } else {
        this.borrowed = false;
        this.setTool(false);
      }
      this.deps.wake();
      return;
    }
    if (event.pointerType === 'touch') {
      // Touch on the open desk is left to scrolling.
      this.downAt = [event.clientX, event.clientY];
      this.travelled = 0;
      return;
    }
    this.pressed = event.pointerId;
    this.deps.canvas.setPointerCapture(event.pointerId);
    this.begin(event.clientX, event.clientY);
  };

  private onMove = (event: PointerEvent): void => {
    const pencil = this.tool;
    if (pencil.active) {
      // Only the finger that is drawing moves the line.
      if (this.drag === 'draw' && event.pointerId !== this.pressed) return;
      const point = this.deskPoint(event.clientX, event.clientY);
      if (!point) return;
      const now = performance.now();
      if (this.drag === 'draw') pencil.drag(point.x, point.z, (now - this.lastMove) / 1000);
      else if (event.pointerType !== 'touch') pencil.hover(point.x, point.z);
      this.lastMove = now;
      this.deps.wake();
      return;
    }
    if (event.pointerType === 'touch') {
      this.travelled = Math.max(this.travelled, Math.hypot(event.clientX - this.downAt[0], event.clientY - this.downAt[1]));
      return;
    }
    if (this.drag) this.move(event.clientX, event.clientY);
    else this.hover(event.clientX, event.clientY);
  };

  private endStroke(event: PointerEvent): boolean {
    if (this.drag !== 'draw') return false;
    if (this.pressed !== event.pointerId) return true;
    this.pressed = null;
    this.drag = null;
    if (this.deps.canvas.hasPointerCapture(event.pointerId)) this.deps.canvas.releasePointerCapture(event.pointerId);
    this.tool.lift();
    if (this.borrowed) this.tool.turn(false);
    this.borrowed = false;
    this.deps.wake();
    return true;
  }

  private onUp = (event: PointerEvent): void => {
    if (this.endStroke(event)) return;
    if (event.pointerType === 'touch') {
      if (this.travelled < 8) this.tap(event.clientX, event.clientY);
      return;
    }
    if (this.pressed !== event.pointerId) return;
    this.pressed = null;
    if (this.deps.canvas.hasPointerCapture(event.pointerId)) this.deps.canvas.releasePointerCapture(event.pointerId);
    this.end(event.clientX, event.clientY, false);
  };

  private onCancel = (event: PointerEvent): void => {
    if (this.endStroke(event)) return;
    if (event.pointerType === 'touch' || this.pressed !== event.pointerId) return;
    this.pressed = null;
    this.end(event.clientX, event.clientY, true);
  };

  private tap(clientX: number, clientY: number): void {
    const link = this.linkUnder(clientX, clientY);
    if (link) {
      this.click(clientX, clientY);
      return;
    }
    const point = this.deskPoint(clientX, clientY);
    if (!point) return;
    const at = pageAt(this.deps.sheet, point.x, point.z);
    if (at && this.deps.poke(at)) return;
  }

  // Touch grips: small invisible handles over the things a finger can pick up,
  // so that everywhere else a swipe still scrolls the page.

  private buildGrips(): void {
    document.documentElement.classList.add('touch');
    const { sheet, handling, objects } = this.deps;
    for (let corner = 0; corner < 4; corner++) {
      this.addGrip(
        () => {
          if (sheet.curl || handling.busy) return null;
          const [x, z] = sheet.cornerWorld(corner);
          return new THREE.Vector3(x, 0, z);
        },
        () => {
          handling.beginCurl(corner);
          this.drag = handling.phase === 'curl' ? 'curl' : null;
        },
      );
    }
    for (const item of objects.items) {
      // Phones show no objects; on a tablet a tap on the pencil picks it up.
      this.addGrip(
        () => (item.prop.group.visible && !item.flight && !item.hand ? new THREE.Vector3(item.x, 0, item.z) : null),
        (x, z) => this.grabItem(item, x, z),
      );
    }
  }

  private grabItem(item: Item, x: number, z: number): void {
    this.deps.objects.grab(item, x, z);
    this.drag = 'object';
  }

  private addGrip(place: () => THREE.Vector3 | null, begin: (x: number, z: number) => void): void {
    const element = document.createElement('div');
    element.className = 'grip';
    element.setAttribute('aria-hidden', 'true');
    document.body.appendChild(element);
    /** The finger that took hold; others are ignored until it lets go. */
    let owner: number | null = null;
    element.addEventListener('pointerdown', (event) => {
      // One hand at a time: a second finger does not take over, and a hand holding the pencil is busy.
      if (this.drag || this.tool.active) return;
      const point = this.deskPoint(event.clientX, event.clientY);
      if (!point) return;
      event.preventDefault();
      owner = event.pointerId;
      element.setPointerCapture(event.pointerId);
      this.downAt = [event.clientX, event.clientY];
      this.travelled = 0;
      this.lastMove = performance.now();
      begin(point.x, point.z);
      this.deps.wake();
    });
    element.addEventListener('pointermove', (event) => {
      if (this.drag && event.pointerId === owner) this.move(event.clientX, event.clientY);
    });
    const finish = (event: PointerEvent) => {
      if (event.pointerId !== owner) return;
      owner = null;
      if (!this.drag) return;
      this.end(event.clientX, event.clientY, true);
    };
    element.addEventListener('pointerup', finish);
    element.addEventListener('pointercancel', finish);
    this.grips.push({ element, place, begin });
  }

  /** Keeps the touch grips over their objects. Call once per frame. */
  syncGrips(): void {
    if (this.grips.length === 0 || this.drag) return;
    const projected = new THREE.Vector3();
    for (const grip of this.grips) {
      // With the pencil in hand the whole sheet is for drawing on.
      const at = this.tool.active ? null : grip.place();
      if (!at) {
        grip.element.style.display = 'none';
        continue;
      }
      projected.copy(at).project(this.deps.camera);
      grip.element.style.display = '';
      grip.element.style.left = `${((projected.x + 1) / 2) * window.innerWidth}px`;
      grip.element.style.top = `${((1 - projected.y) / 2) * window.innerHeight}px`;
    }
  }
}
