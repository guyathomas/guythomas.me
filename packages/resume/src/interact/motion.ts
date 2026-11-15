/** A loose thing on the desk, seen from above: a capsule that can slide, turn and roll. */
export interface Body {
  x: number;
  z: number;
  angle: number;
  vx: number;
  vz: number;
  /** Radians per second about the vertical. */
  spin: number;
  /** Distance rolled across its own axis so far, signed. */
  rolled: number;
  /** Extent along its own length from the origin: [from, to] in metres. */
  span: [number, number];
  radius: number;
  mass: number;
  /** Round in section, so it rolls sideways far more easily than it slides. */
  rolls: boolean;
}

/** Deceleration from friction, metres per second squared. */
const SLIDE = 3.2;
const ROLL = 0.7;
/** Radians per second squared. */
const TURN = 18;
const BOUNCE = 0.3;
/** The part of the desk a loose thing may slide over: by default the whole top. */
export interface Bounds {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}
export const DESK: Bounds = { x0: -0.45, x1: 0.45, z0: -0.5, z1: 0.5 };

const toward = (value: number, amount: number) => (value > 0 ? Math.max(0, value - amount) : Math.min(0, value + amount));

/** Advances a released body under friction. Returns true while it is still moving. */
export function coast(body: Body, dt: number, bounds: Bounds = DESK): boolean {
  const cos = Math.cos(body.angle);
  const sin = Math.sin(body.angle);
  // Along the body's length is (cos, -sin); across it is (sin, cos).
  let along = body.vx * cos - body.vz * sin;
  let across = body.vx * sin + body.vz * cos;
  if (body.rolls) {
    along = toward(along, SLIDE * dt);
    across = toward(across, ROLL * dt);
    body.rolled += across * dt;
  } else {
    const speed = Math.hypot(along, across);
    const keep = speed > 0 ? Math.max(0, speed - SLIDE * dt) / speed : 0;
    along *= keep;
    across *= keep;
  }
  body.vx = along * cos + across * sin;
  body.vz = -along * sin + across * cos;
  body.spin = toward(body.spin, TURN * dt);

  body.x += body.vx * dt;
  body.z += body.vz * dt;
  body.angle += body.spin * dt;
  // At the edge it stops dead, as against a raised lip.
  if (body.x < bounds.x0 || body.x > bounds.x1) {
    body.x = Math.min(bounds.x1, Math.max(bounds.x0, body.x));
    body.vx = 0;
  }
  if (body.z < bounds.z0 || body.z > bounds.z1) {
    body.z = Math.min(bounds.z1, Math.max(bounds.z0, body.z));
    body.vz = 0;
  }
  return body.vx !== 0 || body.vz !== 0 || body.spin !== 0;
}

function ends(body: Body): [number, number, number, number] {
  const cos = Math.cos(body.angle);
  const sin = Math.sin(body.angle);
  return [body.x + cos * body.span[0], body.z - sin * body.span[0], body.x + cos * body.span[1], body.z - sin * body.span[1]];
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Closest points of two segments in the plane: [ax, az, bx, bz]. */
function closest(p: [number, number, number, number], q: [number, number, number, number]): [number, number, number, number] {
  const d1x = p[2] - p[0];
  const d1z = p[3] - p[1];
  const d2x = q[2] - q[0];
  const d2z = q[3] - q[1];
  const rx = p[0] - q[0];
  const rz = p[1] - q[1];
  const a = d1x * d1x + d1z * d1z;
  const e = d2x * d2x + d2z * d2z;
  const f = d2x * rx + d2z * rz;
  let s = 0;
  let t = 0;
  if (a > 1e-12 && e > 1e-12) {
    const b = d1x * d2x + d1z * d2z;
    const c = d1x * rx + d1z * rz;
    const denom = a * e - b * b;
    s = denom > 1e-12 ? clamp01((b * f - c * e) / denom) : 0;
    t = clamp01((b * s + f) / e);
    s = clamp01((b * t - c) / a);
  } else if (a > 1e-12) {
    s = clamp01(-(d1x * rx + d1z * rz) / a);
  } else if (e > 1e-12) {
    t = clamp01(f / e);
  }
  return [p[0] + d1x * s, p[1] + d1z * s, q[0] + d2x * t, q[1] + d2z * t];
}

function turn(body: Body, px: number, pz: number, jx: number, jz: number): void {
  const length = body.span[1] - body.span[0] + 2 * body.radius;
  const inertia = body.mass * (length * length / 12 + body.radius * body.radius / 2);
  const rx = px - body.x;
  const rz = pz - body.z;
  body.spin += (rz * jx - rx * jz) / inertia;
}

/** Pushes two overlapping bodies apart and passes momentum between them. Returns true if they touched. */
export function collide(a: Body, b: Body): boolean {
  const [ax, az, bx, bz] = closest(ends(a), ends(b));
  let nx = bx - ax;
  let nz = bz - az;
  const distance = Math.hypot(nx, nz);
  const overlap = a.radius + b.radius - distance;
  if (overlap <= 0) return false;
  if (distance > 1e-9) {
    nx /= distance;
    nz /= distance;
  } else {
    nx = 1;
    nz = 0;
  }
  const ia = 1 / a.mass;
  const ib = 1 / b.mass;
  const push = (overlap + 1e-6) / (ia + ib);
  a.x -= nx * push * ia;
  a.z -= nz * push * ia;
  b.x += nx * push * ib;
  b.z += nz * push * ib;

  const closing = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
  if (closing < 0) {
    const impulse = (-(1 + BOUNCE) * closing) / (ia + ib);
    a.vx -= impulse * ia * nx;
    a.vz -= impulse * ia * nz;
    b.vx += impulse * ib * nx;
    b.vz += impulse * ib * nz;
    turn(a, ax, az, -impulse * nx, -impulse * nz);
    turn(b, bx, bz, impulse * nx, impulse * nz);
  }
  return true;
}

/**
 * The spin a thing leaves the hand with: held off centre, its middle trails
 * the grip. (cx, cz) is the body's origin relative to where it was held.
 */
export function throwSpin(cx: number, cz: number, vx: number, vz: number): number {
  const spin = (-0.6 * (cz * vx - cx * vz)) / (0.0009 + cx * cx + cz * cz);
  return spin === 0 ? 0 : Math.min(14, Math.max(-14, spin));
}
