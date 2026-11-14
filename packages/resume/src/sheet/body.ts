import * as THREE from 'three';
import { curlPoint, type Curl } from './curl';
import { frontUp, identityPose, toLocal, toWorld, type Pose } from './pose';

export interface SheetHit {
  u: number;
  v: number;
  /** Index of the corner within reach, if any: 0 TL, 1 TR, 2 BR, 3 BL in sheet terms. */
  corner: number | null;
  front: boolean;
}

const CORNERS: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

/**
 * The sheet as a physical object: a grid of points that lies on the desk at a
 * pose, can be rolled up along a crease, and has two printed faces a paper's
 * thickness apart. Geometry is rebuilt on the CPU so shadows and picking see
 * exactly what is drawn.
 */
export class SheetBody {
  readonly group = new THREE.Group();
  pose: Pose = identityPose();
  curl: Curl | null = null;
  /** Height of the whole sheet above the desk, used as it drops after a turn. */
  drop = 0;
  /** How far each corner stands off the desk at rest (the paper's own curl), metres. */
  readonly cornerLift = [0.0012, 0, 0.0024, 0.0034];
  /** Darkness of the shadow where paper meets desk. */
  contactStrength = 0.62;
  /** Height of the slow wave along one edge, metres. */
  wave = 0.0017;

  private readonly nx: number;
  private readonly ny: number;
  private readonly count: number;
  private readonly local: Float32Array;
  private readonly mid: Float32Array;
  private readonly normals: Float32Array;
  private readonly frontGeometry = new THREE.BufferGeometry();
  private readonly backGeometry = new THREE.BufferGeometry();
  private readonly midGeometry = new THREE.BufferGeometry();
  private readonly edgeGeometry = new THREE.BufferGeometry();
  private readonly contactGeometry = new THREE.BufferGeometry();
  private readonly rim: number[] = [];
  /** Outward direction of each rim point, in sheet-local terms. */
  private readonly rimOut: Array<[number, number]> = [];
  private readonly scratch = [0, 0, 0];

  constructor(
    readonly width: number,
    readonly height: number,
    readonly thickness: number,
    frontMaterial: THREE.Material,
    backMaterial: THREE.Material,
    edgeMaterial: THREE.Material,
  ) {
    this.nx = 44;
    this.ny = Math.min(170, Math.max(8, Math.round((this.nx * height) / width)));
    const { nx, ny } = this;
    this.count = (nx + 1) * (ny + 1);
    this.local = new Float32Array(this.count * 2);
    this.mid = new Float32Array(this.count * 3);
    this.normals = new Float32Array(this.count * 3);

    const uv = new Float32Array(this.count * 2);
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const k = j * (nx + 1) + i;
        uv[k * 2] = i / nx;
        uv[k * 2 + 1] = j / ny;
        this.local[k * 2] = (i / nx - 0.5) * width;
        this.local[k * 2 + 1] = (j / ny - 0.5) * height;
      }
    }
    const frontIndex: number[] = [];
    const backIndex: number[] = [];
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i;
        const b = a + 1;
        const c = a + nx + 1;
        const d = c + 1;
        frontIndex.push(a, c, b, b, c, d);
        backIndex.push(a, b, c, b, d, c);
      }
    }
    for (const [geometry, index] of [
      [this.frontGeometry, frontIndex],
      [this.backGeometry, backIndex],
      [this.midGeometry, frontIndex],
    ] as const) {
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.count * 3), 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.count * 3), 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      geometry.setIndex(index);
    }

    // The cut edge: a ribbon joining the two faces all the way round.
    for (let i = 0; i <= nx; i++) this.rim.push(i);
    for (let j = 1; j <= ny; j++) this.rim.push(j * (nx + 1) + nx);
    for (let i = nx - 1; i >= 0; i--) this.rim.push(ny * (nx + 1) + i);
    for (let j = ny - 1; j >= 1; j--) this.rim.push(j * (nx + 1));
    const rimCount = this.rim.length;
    const edgeIndex: number[] = [];
    for (let i = 0; i < rimCount; i++) {
      const next = (i + 1) % rimCount;
      edgeIndex.push(i * 2, next * 2, i * 2 + 1, next * 2, next * 2 + 1, i * 2 + 1);
    }
    this.edgeGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rimCount * 6), 3));
    this.edgeGeometry.setIndex(edgeIndex);

    // Contact shadow: a soft dark skirt on the desk just outside the paper's
    // edge, fading wherever the paper stands off the surface.
    for (const k of this.rim) {
      const i = k % (nx + 1);
      const j = Math.floor(k / (nx + 1));
      const ox = i === 0 ? -1 : i === nx ? 1 : 0;
      const oz = j === 0 ? -1 : j === ny ? 1 : 0;
      const length = Math.hypot(ox, oz) || 1;
      this.rimOut.push([ox / length, oz / length]);
    }
    this.contactGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rimCount * 6), 3));
    this.contactGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(rimCount * 8), 4));
    this.contactGeometry.setIndex(edgeIndex);

    const front = new THREE.Mesh(this.frontGeometry, frontMaterial);
    const back = new THREE.Mesh(this.backGeometry, backMaterial);
    const edge = new THREE.Mesh(this.edgeGeometry, edgeMaterial);
    const caster = new THREE.Mesh(
      this.midGeometry,
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide }),
    );
    const contact = new THREE.Mesh(
      this.contactGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    );
    contact.renderOrder = 1;
    front.receiveShadow = back.receiveShadow = edge.receiveShadow = true;
    caster.castShadow = true;
    for (const mesh of [contact, front, back, edge, caster]) {
      mesh.frustumCulled = false;
      this.group.add(mesh);
    }
    this.update();
  }

  /** Flat desk position of a corner (0 TL, 1 TR, 2 BR, 3 BL). */
  cornerWorld(index: number): [number, number] {
    const [u, v] = CORNERS[index];
    return toWorld(this.pose, (u - 0.5) * this.width, (v - 0.5) * this.height);
  }

  /** What part of the flat sheet lies under a desk point. */
  hit(x: number, z: number, reach: number): SheetHit | null {
    const [lx, lz] = toLocal(this.pose, x, z);
    const u = lx / this.width + 0.5;
    const v = lz / this.height + 0.5;
    let corner: number | null = null;
    let best = reach;
    CORNERS.forEach(([cu, cv], index) => {
      const distance = Math.hypot((u - cu) * this.width, (v - cv) * this.height);
      if (distance < best) {
        best = distance;
        corner = index;
      }
    });
    const inside = u >= 0 && u <= 1 && v >= 0 && v <= 1;
    if (!inside && corner === null) return null;
    return { u, v, corner, front: frontUp(this.pose) };
  }

  private restLift(u: number, v: number): number {
    let lift = 0;
    for (let i = 0; i < 4; i++) {
      const amount = this.cornerLift[i];
      if (amount === 0) continue;
      const distance = Math.hypot((u - CORNERS[i][0]) * this.width, (v - CORNERS[i][1]) * this.height);
      const t = Math.max(0, 1 - distance / 0.11);
      lift += amount * t * t;
    }
    // Paper is never dead flat: the long right edge stands off the desk in a slow wave.
    const edge = Math.max(0, (u - 0.72) / 0.28);
    lift += this.wave * edge * edge * (0.55 + 0.45 * Math.sin(v * 4.1 + 0.6));
    return lift;
  }

  /** Rebuilds every vertex from pose, curl and rest shape. Call after changing any of them. */
  update(): void {
    const { nx, ny, count, local, mid, normals, pose, curl, scratch } = this;
    for (let k = 0; k < count; k++) {
      const [x, z] = toWorld(pose, local[k * 2], local[k * 2 + 1]);
      const u = local[k * 2] / this.width + 0.5;
      const v = local[k * 2 + 1] / this.height + 0.5;
      let y = this.restLift(u, v);
      let px = x;
      let pz = z;
      if (curl) {
        const d = (x - curl.mx) * curl.nx + (z - curl.mz) * curl.nz;
        curlPoint(x, z, curl, scratch);
        px = scratch[0];
        pz = scratch[2];
        // The rest curl fades out as the sheet leaves the desk.
        y = scratch[1] + y * Math.max(0, 1 - Math.max(0, d) / (curl.r * 0.8));
      }
      mid[k * 3] = px;
      mid[k * 3 + 1] = y + this.drop + this.thickness * 0.5;
      mid[k * 3 + 2] = pz;
    }

    // Normal of the printed face, from the grid itself.
    const row = nx + 1;
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const k = j * row + i;
        const l = (j * row + Math.max(i - 1, 0)) * 3;
        const r = (j * row + Math.min(i + 1, nx)) * 3;
        const t = (Math.max(j - 1, 0) * row + i) * 3;
        const b = (Math.min(j + 1, ny) * row + i) * 3;
        const ux = mid[r] - mid[l];
        const uy = mid[r + 1] - mid[l + 1];
        const uz = mid[r + 2] - mid[l + 2];
        const vx = mid[b] - mid[t];
        const vy = mid[b + 1] - mid[t + 1];
        const vz = mid[b + 2] - mid[t + 2];
        let nxn = vy * uz - vz * uy;
        let nyn = vz * ux - vx * uz;
        let nzn = vx * uy - vy * ux;
        const length = Math.hypot(nxn, nyn, nzn) || 1;
        nxn /= length;
        nyn /= length;
        nzn /= length;
        normals[k * 3] = nxn;
        normals[k * 3 + 1] = nyn;
        normals[k * 3 + 2] = nzn;
      }
    }

    const half = this.thickness * 0.5;
    const frontPos = this.frontGeometry.attributes.position.array as Float32Array;
    const frontNor = this.frontGeometry.attributes.normal.array as Float32Array;
    const backPos = this.backGeometry.attributes.position.array as Float32Array;
    const backNor = this.backGeometry.attributes.normal.array as Float32Array;
    const midPos = this.midGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count * 3; i++) {
      frontPos[i] = mid[i] + normals[i] * half;
      frontNor[i] = normals[i];
      backPos[i] = mid[i] - normals[i] * half;
      backNor[i] = -normals[i];
    }
    // Shadows are cast from whichever face is underneath, so the lit face
    // stands a full thickness clear of its own shadow.
    for (let k = 0; k < count; k++) {
      const under = normals[k * 3 + 1] >= 0 ? -half : half;
      for (let c = 0; c < 3; c++) midPos[k * 3 + c] = mid[k * 3 + c] + normals[k * 3 + c] * under;
    }
    const edgePos = this.edgeGeometry.attributes.position.array as Float32Array;
    this.rim.forEach((k, i) => {
      for (let c = 0; c < 3; c++) {
        edgePos[i * 6 + c] = frontPos[k * 3 + c];
        edgePos[i * 6 + 3 + c] = backPos[k * 3 + c];
      }
    });
    const contactPos = this.contactGeometry.attributes.position.array as Float32Array;
    const contactCol = this.contactGeometry.attributes.color.array as Float32Array;
    const spread = 0.0085;
    this.rim.forEach((k, i) => {
      const [lx, lz] = this.rimOut[i];
      let ox = pose.a * lx + pose.b * lz;
      let oz = pose.c * lx + pose.d * lz;
      const length = Math.hypot(ox, oz) || 1;
      ox /= length;
      oz /= length;
      const x = mid[k * 3];
      const z = mid[k * 3 + 2];
      const height = mid[k * 3 + 1] - this.thickness * 0.5;
      contactPos[i * 6] = x - ox * 0.0012;
      contactPos[i * 6 + 1] = 0.0002;
      contactPos[i * 6 + 2] = z - oz * 0.0012;
      contactPos[i * 6 + 3] = x + ox * spread;
      contactPos[i * 6 + 4] = 0.0002;
      contactPos[i * 6 + 5] = z + oz * spread;
      contactCol[i * 8 + 3] = this.contactStrength * Math.exp(-height / 0.0022);
      contactCol[i * 8 + 7] = 0;
    });
    this.contactGeometry.attributes.color.needsUpdate = true;
    for (const geometry of [this.frontGeometry, this.backGeometry, this.midGeometry, this.edgeGeometry, this.contactGeometry]) {
      geometry.attributes.position.needsUpdate = true;
      if (geometry.attributes.normal) geometry.attributes.normal.needsUpdate = true;
    }
  }

  /** Highest point of the sheet above the desk, metres. */
  maxHeight(): number {
    let top = 0;
    for (let k = 1; k < this.mid.length; k += 3) top = Math.max(top, this.mid[k]);
    return top;
  }
}
