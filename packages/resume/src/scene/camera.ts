import * as THREE from 'three';
import { READING_FOV, type Framing } from './view';

const DESK_FOV = 30;
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Two views of the same desk. Reading: straight down through a long lens, so
 * the sheet sits square at reading size. Desk: pulled back and tilted, like
 * standing over the table.
 */
export class CameraRig {
  /** 0 is the reading view, 1 the desk view. */
  blend = 0;
  goal = 0;
  /** Pointer position, -1 to 1 on each axis, for a breath of parallax. */
  readonly sway = new THREE.Vector2();
  private readonly swayNow = new THREE.Vector2();
  private readonly position = new THREE.Vector3();
  private readonly target = new THREE.Vector3();

  constructor(private readonly camera: THREE.PerspectiveCamera, private readonly stillness: boolean) {}

  /** Advances the pull-back and the parallax. Returns true while moving. */
  step(dt: number): boolean {
    const before = this.blend;
    const rate = this.stillness ? 1 : dt / 0.85;
    this.blend = this.goal > this.blend ? Math.min(this.goal, this.blend + rate) : Math.max(this.goal, this.blend - rate);
    const swayTarget = this.stillness ? new THREE.Vector2() : this.sway;
    const drift = this.swayNow.distanceTo(swayTarget);
    this.swayNow.lerp(swayTarget, 1 - Math.exp(-dt * 5));
    return this.blend !== before || drift > 0.002;
  }

  /** Points the camera for this frame. */
  apply(framing: Framing, viewportHeight: number, sheetCentre: THREE.Vector3, sheetHeight: number): void {
    const { camera } = this;
    const t = ease(this.blend);
    const visible = viewportHeight / framing.pxPerMetre;
    const distance = visible / 2 / Math.tan(THREE.MathUtils.degToRad(READING_FOV / 2));
    const readX = framing.x;
    const readZ = framing.z;

    // Desk view: far enough back to hold the whole sheet with room around it.
    const span = Math.max(sheetHeight * 1.12, 0.36) / Math.min(1, camera.aspect / 1.2);
    const deskDistance = span / 2 / Math.tan(THREE.MathUtils.degToRad(DESK_FOV / 2));
    const deskTarget = new THREE.Vector3(sheetCentre.x - 0.035, 0, sheetCentre.z - 0.015);
    const deskPosition = new THREE.Vector3(deskTarget.x + deskDistance * 0.1, deskDistance * 0.82, deskTarget.z + deskDistance * 0.56);

    this.position.set(readX + this.swayNow.x * 0.012 * (1 - t), distance, readZ + this.swayNow.y * 0.012 * (1 - t)).lerp(deskPosition, t);
    this.target.set(readX, 0, readZ).lerp(deskTarget, t);
    camera.fov = READING_FOV + (DESK_FOV - READING_FOV) * t;
    camera.near = Math.max(0.05, this.position.y * 0.2);
    camera.far = this.position.y * 4 + 4;
    camera.position.copy(this.position);
    camera.lookAt(this.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
}
