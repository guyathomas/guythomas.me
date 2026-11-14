import { movePose, type Pose } from './pose';

/**
 * One step of dragging a sheet across a desk by a single point. The grabbed
 * point follows the pointer exactly; friction under the rest of the sheet
 * resists turning, so the sheet swings behind the grab like real paper.
 * `gyration` is the sheet's resistance to turning, in metres.
 */
export function slideStep(pose: Pose, grabX: number, grabZ: number, toX: number, toZ: number, gyration: number): Pose {
  const dx = toX - grabX;
  const dz = toZ - grabZ;
  const rx = grabX - pose.cx;
  const rz = grabZ - pose.cz;
  // Torque of the pull about the centre, damped by the sheet's own inertia.
  const angle = (rx * dz - rz * dx) / (rx * rx + rz * rz + gyration * gyration);
  return movePose(pose, grabX, grabZ, angle, dx, dz);
}

export interface Glide {
  vx: number;
  vz: number;
  spin: number;
}

/** Coasting after release: velocity bleeds off under friction. Returns false at rest. */
export function glideStep(glide: Glide, dt: number, friction: number): boolean {
  const decay = Math.exp(-friction * dt);
  glide.vx *= decay;
  glide.vz *= decay;
  glide.spin *= decay;
  return Math.hypot(glide.vx, glide.vz) > 0.002 || Math.abs(glide.spin) > 0.01;
}
