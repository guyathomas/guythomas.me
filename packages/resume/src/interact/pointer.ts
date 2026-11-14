import * as THREE from 'three';
import type { CameraRig } from '../scene/camera';
import type { LightRig } from '../scene/rig';
import type { SheetBody } from '../sheet/body';
import { linkAt, type LinkRegion } from '../typeset/raster';
import type { SheetHandling } from './handling';
import type { DeskObjects, Item } from './objects';

type Drag = 'slide' | 'curl' | 'object' | 'light' | null;

export interface PointerDeps {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  sheet: SheetBody;
  handling: SheetHandling;
  objects: DeskObjects;
  rig: LightRig;
  cameraRig: CameraRig;
  frontLinks: LinkRegion[];
  lampHead: THREE.Object3D;
  /** Something changed: keep the frame loop running. */
  wake(): void;
  /** The viewer has done something; the hint can go. */
  used(): void;
  toggleLamp(): void;
}

const CORNER_REACH = 0.021;
const LIGHT_REACH = 0.34;

/** Turns pointer and touch input into handling of the sheet, the objects and the lamp. */
export class Pointer {
  private drag: Drag = null;
  private readonly ray = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private readonly plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly point = new THREE.Vector3();
  private lightOffset: [number, number] = [0, 0];
  private downAt: [number, number] = [0, 0];
  private travelled = 0;
  private lastMove = 0;
  /** The mouse or pen pointer whose press began on the canvas, if any. */
  private pressed: number | null = null;
  private readonly grips: Array<{ element: HTMLElement; place: () => THREE.Vector3 | null; begin: (x: number, z: number) => void }> = [];

  constructor(private readonly deps: PointerDeps) {
    const { canvas } = deps;
    this.ray.layers.enableAll();
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onCancel);
    canvas.addEventListener('pointerleave', () => {
      if (!this.drag) this.deps.cameraRig.sway.set(0, 0);
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
    const { objects, sheet, handling, rig } = this.deps;
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
      } else {
        this.lightOffset = [rig.lampAim.x - point.x, rig.lampAim.z - point.z];
        rig.lampNudge.set(0, 0);
        this.drag = 'light';
      }
    }
    if (this.drag) this.deps.canvas.style.cursor = 'grabbing';
    this.deps.wake();
  }

  private move(clientX: number, clientY: number): void {
    const point = this.deskPoint(clientX, clientY);
    if (!point) return;
    const { objects, handling, rig } = this.deps;
    const now = performance.now();
    const dt = (now - this.lastMove) / 1000;
    this.lastMove = now;
    this.travelled = Math.max(this.travelled, Math.hypot(clientX - this.downAt[0], clientY - this.downAt[1]));
    if (this.travelled > 4) this.deps.used();
    switch (this.drag) {
      case 'object':
        objects.drag(point.x, point.z);
        break;
      case 'curl':
        handling.moveCurl(point.x, point.z);
        break;
      case 'slide':
        handling.moveSlide(point.x, point.z, dt);
        break;
      case 'light':
        rig.lampAim.set(
          THREE.MathUtils.clamp(point.x + this.lightOffset[0], -LIGHT_REACH, LIGHT_REACH),
          0,
          THREE.MathUtils.clamp(point.z + this.lightOffset[1], -LIGHT_REACH, LIGHT_REACH),
        );
        rig.place();
        break;
    }
    this.deps.wake();
  }

  private end(clientX: number, clientY: number, cancelled: boolean): void {
    const { objects, handling } = this.deps;
    const drag = this.drag;
    this.drag = null;
    if (drag === 'object') objects.release();
    if (drag === 'curl') handling.endCurl();
    if (drag === 'slide') handling.endSlide();
    if (!cancelled && this.travelled < 5) this.click(clientX, clientY);
    this.hover(clientX, clientY);
    this.deps.wake();
  }

  /** A press and release without travel: follow a link, or work the lamp's switch. */
  private click(clientX: number, clientY: number): void {
    const { sheet, lampHead, cameraRig } = this.deps;
    if (cameraRig.blend > 0.5) {
      this.ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
      this.ray.setFromCamera(this.ndc, this.deps.camera);
      if (this.ray.intersectObject(lampHead, true).length > 0) {
        this.deps.toggleLamp();
        return;
      }
    }
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

  /** No button down: the lamp leans toward the pointer, and the cursor says what can be picked up. */
  private hover(clientX: number, clientY: number): void {
    const point = this.deskPoint(clientX, clientY);
    if (!point) return;
    const { rig, objects, sheet, canvas, cameraRig } = this.deps;
    cameraRig.sway.set((clientX / window.innerWidth) * 2 - 1, (clientY / window.innerHeight) * 2 - 1);
    const lean = new THREE.Vector2(point.x - rig.lampAim.x, point.z - rig.lampAim.z).multiplyScalar(0.2);
    if (lean.length() > 0.045) lean.setLength(0.045);
    rig.lampNudge.copy(lean);
    rig.place();

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

  private onDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    this.deps.used();
    if (event.pointerType === 'touch') {
      // Touch on the open desk is left to scrolling; a tap moves the light.
      this.downAt = [event.clientX, event.clientY];
      this.travelled = 0;
      return;
    }
    this.pressed = event.pointerId;
    this.deps.canvas.setPointerCapture(event.pointerId);
    this.begin(event.clientX, event.clientY);
  };

  private onMove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') {
      this.travelled = Math.max(this.travelled, Math.hypot(event.clientX - this.downAt[0], event.clientY - this.downAt[1]));
      return;
    }
    if (this.drag) this.move(event.clientX, event.clientY);
    else this.hover(event.clientX, event.clientY);
  };

  private onUp = (event: PointerEvent): void => {
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
    const { rig } = this.deps;
    rig.lampNudge.set(0, 0);
    rig.lampAim.set(THREE.MathUtils.clamp(point.x, -LIGHT_REACH, LIGHT_REACH), 0, THREE.MathUtils.clamp(point.z, -LIGHT_REACH, LIGHT_REACH));
    rig.place();
    this.deps.wake();
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
      if (item.prop.name !== 'weight' && item.prop.name !== 'loupe') continue;
      this.addGrip(
        () => (item.prop.group.visible ? new THREE.Vector3(item.x, 0, item.z) : null),
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
    element.addEventListener('pointerdown', (event) => {
      const point = this.deskPoint(event.clientX, event.clientY);
      if (!point) return;
      event.preventDefault();
      element.setPointerCapture(event.pointerId);
      this.deps.used();
      this.downAt = [event.clientX, event.clientY];
      this.travelled = 0;
      this.lastMove = performance.now();
      begin(point.x, point.z);
      this.deps.wake();
    });
    element.addEventListener('pointermove', (event) => {
      if (this.drag) this.move(event.clientX, event.clientY);
    });
    const finish = (event: PointerEvent) => {
      if (!this.drag) return;
      this.travelled = 99;
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
      const at = grip.place();
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
