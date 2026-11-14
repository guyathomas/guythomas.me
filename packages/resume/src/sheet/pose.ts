/** Where the flat sheet lies on the desk: an affine map from sheet-local metres to desk metres. */
export interface Pose {
  cx: number;
  cz: number;
  /** Linear part, row-major: world = c + [a b; c d] * local. */
  a: number;
  b: number;
  c: number;
  d: number;
}

export const identityPose = (): Pose => ({ cx: 0, cz: 0, a: 1, b: 0, c: 0, d: 1 });

export function poseFromAngle(cx: number, cz: number, angle: number): Pose {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { cx, cz, a: cos, b: -sin, c: sin, d: cos };
}

export function toWorld(pose: Pose, lx: number, lz: number): [number, number] {
  return [pose.cx + pose.a * lx + pose.b * lz, pose.cz + pose.c * lx + pose.d * lz];
}

export function toLocal(pose: Pose, x: number, z: number): [number, number] {
  const det = pose.a * pose.d - pose.b * pose.c;
  const dx = x - pose.cx;
  const dz = z - pose.cz;
  return [(pose.d * dx - pose.b * dz) / det, (-pose.c * dx + pose.a * dz) / det];
}

/** True when the printed front faces up. Turning the sheet over mirrors the map. */
export function frontUp(pose: Pose): boolean {
  return pose.a * pose.d - pose.b * pose.c > 0;
}

/** Mirror the pose across the line through (qx, qz) with unit normal (nx, nz). */
export function reflectPose(pose: Pose, qx: number, qz: number, nx: number, nz: number): Pose {
  const m11 = 1 - 2 * nx * nx;
  const m12 = -2 * nx * nz;
  const m22 = 1 - 2 * nz * nz;
  const k = 2 * ((pose.cx - qx) * nx + (pose.cz - qz) * nz);
  return {
    cx: pose.cx - k * nx,
    cz: pose.cz - k * nz,
    a: m11 * pose.a + m12 * pose.c,
    b: m11 * pose.b + m12 * pose.d,
    c: m12 * pose.a + m22 * pose.c,
    d: m12 * pose.b + m22 * pose.d,
  };
}

/** Rotate the pose by `angle` about the desk point (px, pz), then translate. */
export function movePose(pose: Pose, px: number, pz: number, angle: number, tx: number, tz: number): Pose {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rx = pose.cx - px;
  const rz = pose.cz - pz;
  return {
    cx: px + cos * rx - sin * rz + tx,
    cz: pz + sin * rx + cos * rz + tz,
    a: cos * pose.a - sin * pose.c,
    b: cos * pose.b - sin * pose.d,
    c: sin * pose.a + cos * pose.c,
    d: sin * pose.b + cos * pose.d,
  };
}

export function lerpPose(from: Pose, to: Pose, t: number): Pose {
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    cx: mix(from.cx, to.cx),
    cz: mix(from.cz, to.cz),
    a: mix(from.a, to.a),
    b: mix(from.b, to.b),
    c: mix(from.c, to.c),
    d: mix(from.d, to.d),
  };
}
