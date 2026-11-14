/**
 * Paper is stiff: it bends about one axis at a time and never stretches. A
 * curl is therefore a cylinder of radius `r` rolled along a straight crease.
 * Everything on the far side of the crease (signed distance d > 0 along the
 * unit normal n) wraps the cylinder; past half a turn it lies flat again,
 * upside down, at height 2r.
 */
export interface Curl {
  /** A point on the crease line, desk metres. */
  mx: number;
  mz: number;
  /** Unit normal of the crease, pointing at the side that lifts. */
  nx: number;
  nz: number;
  r: number;
}

/** Bends a flat desk point. Writes [x, y, z] into `out` and returns it. */
export function curlPoint(x: number, z: number, curl: Curl, out: number[] = [0, 0, 0]): number[] {
  const d = (x - curl.mx) * curl.nx + (z - curl.mz) * curl.nz;
  if (d <= 0) {
    out[0] = x;
    out[1] = 0;
    out[2] = z;
    return out;
  }
  const half = Math.PI * curl.r;
  let along: number;
  let y: number;
  if (d < half) {
    const theta = d / curl.r;
    along = curl.r * Math.sin(theta);
    y = curl.r * (1 - Math.cos(theta));
  } else {
    along = -(d - half);
    y = 2 * curl.r;
  }
  out[0] = x + (along - d) * curl.nx;
  out[1] = y;
  out[2] = z + (along - d) * curl.nz;
  return out;
}

/**
 * How far past the crease a dragged corner must sit so that, once bent, it
 * has travelled `distance` across the desk toward the pointer.
 */
export function creaseOffset(distance: number, r: number): number {
  const half = Math.PI * r;
  if (distance >= half) return (distance + half) / 2;
  // Solve x - r sin(x / r) = distance on [0, pi r]; the left side is monotonic.
  let lo = 0;
  let hi = half;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (mid - r * Math.sin(mid / r) < distance) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** The curl that carries a corner from its flat position toward the pointer. */
export function curlFromDrag(cornerX: number, cornerZ: number, pointerX: number, pointerZ: number, r: number): Curl | null {
  const vx = cornerX - pointerX;
  const vz = cornerZ - pointerZ;
  const distance = Math.hypot(vx, vz);
  if (distance < 1e-5) return null;
  const nx = vx / distance;
  const nz = vz / distance;
  const offset = creaseOffset(distance, r);
  return { mx: cornerX - nx * offset, mz: cornerZ - nz * offset, nx, nz, r };
}

/** Signed distance of a desk point past the crease. */
export function pastCrease(x: number, z: number, curl: Curl): number {
  return (x - curl.mx) * curl.nx + (z - curl.mz) * curl.nz;
}
