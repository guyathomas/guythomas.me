import * as THREE from 'three';

/** A pencil line to lay down: a run of x, y pairs in page metres (x across, y down the page). */
export interface PencilLine {
  points: number[];
  half: number;
  tone: number;
}

const VERTEX = /* glsl */ `
attribute vec2 aLocal;
attribute vec3 aLine;
varying vec2 vLocal;
varying vec3 vLine;
void main() {
  vLocal = aLocal;
  vLine = aLine;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Each stroke is a capsule: distance to the segment gives round ends, so joins need no care.
const FRAGMENT = /* glsl */ `
varying vec2 vLocal;
varying vec3 vLine;
void main() {
  float d = length(vec2(vLocal.x - clamp(vLocal.x, 0.0, vLine.x), vLocal.y));
  float a = (1.0 - smoothstep(vLine.y * 0.5, vLine.y, d)) * vLine.z;
  gl_FragColor = vec4(a, a, a, 1.0);
}
`;

/** A growable batch of capsule strokes. */
class Strokes {
  readonly mesh: THREE.Mesh;
  private capacity = 0;
  private count = 0;
  private position = new Float32Array(0);
  private local = new Float32Array(0);
  private line = new Float32Array(0);

  constructor(material: THREE.Material) {
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), material);
    this.mesh.frustumCulled = false;
    this.grow(256);
  }

  private grow(capacity: number): void {
    const keep = (from: Float32Array, size: number) => {
      const next = new Float32Array(capacity * size);
      next.set(from);
      return next;
    };
    this.position = keep(this.position, 12);
    this.local = keep(this.local, 8);
    this.line = keep(this.line, 12);
    const index = new Uint32Array(capacity * 6);
    for (let i = 0; i < capacity; i++) index.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3], i * 6);
    this.mesh.geometry.dispose();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.position, 3));
    geometry.setAttribute('aLocal', new THREE.BufferAttribute(this.local, 2));
    geometry.setAttribute('aLine', new THREE.BufferAttribute(this.line, 3));
    geometry.setIndex(new THREE.BufferAttribute(index, 1));
    geometry.setDrawRange(0, this.count * 6);
    this.mesh.geometry = geometry;
    this.capacity = capacity;
  }

  clear(): void {
    this.count = 0;
    this.mesh.geometry.setDrawRange(0, 0);
  }

  add(x0: number, y0: number, x1: number, y1: number, half: number, tone: number): void {
    if (this.count === this.capacity) this.grow(this.capacity * 2);
    const length = Math.hypot(x1 - x0, y1 - y0);
    const ux = length > 1e-9 ? (x1 - x0) / length : 1;
    const uy = length > 1e-9 ? (y1 - y0) / length : 0;
    const i = this.count++;
    // Corners of the capsule's box: before the start and past the end, either side.
    [
      [-half, -half],
      [-half, half],
      [length + half, -half],
      [length + half, half],
    ].forEach(([along, across], corner) => {
      const v = i * 4 + corner;
      this.position[v * 3] = x0 + ux * along - uy * across;
      this.position[v * 3 + 1] = y0 + uy * along + ux * across;
      this.local[v * 2] = along;
      this.local[v * 2 + 1] = across;
      this.line[v * 3] = length;
      this.line[v * 3 + 1] = half;
      this.line[v * 3 + 2] = tone;
    });
    const { geometry } = this.mesh;
    for (const name of ['position', 'aLocal', 'aLine']) (geometry.getAttribute(name) as THREE.BufferAttribute).needsUpdate = true;
    geometry.setDrawRange(0, this.count * 6);
  }

  addLine(line: PencilLine): void {
    const { points } = line;
    if (points.length === 2) this.add(points[0], points[1], points[0], points[1], line.half, line.tone);
    for (let i = 2; i < points.length; i += 2) this.add(points[i - 2], points[i - 1], points[i], points[i + 1], line.half, line.tone);
  }
}

/**
 * Pencil on one face of the sheet: a coverage map the paper shader reads.
 * Marks that stay (what the viewer drew) and marks that move (the game's
 * own drawing) are kept apart so the moving ones can be redrawn each frame.
 */
export class GraphiteLayer {
  readonly texture: THREE.Texture;
  private readonly target: THREE.WebGLRenderTarget;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.OrthographicCamera;
  private readonly kept: Strokes;
  private readonly moving: Strokes;
  private dirty = true;

  constructor(width: number, height: number, pixelsWide: number, anisotropy: number) {
    this.target = new THREE.WebGLRenderTarget(pixelsWide, Math.round((pixelsWide * height) / width), {
      depthBuffer: false,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    });
    this.texture = this.target.texture;
    this.texture.anisotropy = anisotropy;
    // Page y runs down the sheet, and the sheet's v does too.
    this.camera = new THREE.OrthographicCamera(0, width, height, 0, -1, 1);
    this.scene.background = new THREE.Color(0x000000);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      // Crossing lines do not pile up: the darker mark wins.
      blending: THREE.CustomBlending,
      blendEquation: THREE.MaxEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
    });
    this.kept = new Strokes(material);
    this.moving = new Strokes(material);
    this.scene.add(this.kept.mesh, this.moving.mesh);
  }

  /** Adds one stroke segment that stays. */
  draw(x0: number, y0: number, x1: number, y1: number, half: number, tone: number): void {
    this.kept.add(x0, y0, x1, y1, half, tone);
    this.dirty = true;
  }

  /** Rubs out everything that was drawn to stay. */
  clear(): void {
    this.kept.clear();
    this.dirty = true;
  }

  /** Replaces the marks that are redrawn every frame. */
  sketch(lines: PencilLine[]): void {
    this.moving.clear();
    for (const line of lines) this.moving.addLine(line);
    this.dirty = true;
  }

  /** Brings the map up to date. Call before the sheet is rendered. */
  render(renderer: THREE.WebGLRenderer): void {
    if (!this.dirty) return;
    this.dirty = false;
    const previous = renderer.getRenderTarget();
    renderer.setRenderTarget(this.target);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(previous);
  }
}
