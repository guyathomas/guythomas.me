import type { SunPosition } from './solar';

export type Vec3 = [number, number, number];

/** Everything the lighting rig needs, derived from where the sun is. */
export interface LightState {
  /** Unit vector from the desk toward the sun as it comes through the window. */
  sunDirection: Vec3;
  sunColor: Vec3;
  /** 0 when the sun is down or out of the window's view, 1 for a full beam. */
  sunStrength: number;
  skyColor: Vec3;
  /** 0 at night, 1 in full daylight. */
  skyStrength: number;
  /** 0 by day, 1 at full night. */
  night: number;
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const smooth = (lo: number, hi: number, x: number) => {
  const t = clamp((x - lo) / (hi - lo), 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const HORIZON: Vec3 = [1.0, 0.42, 0.16];
const GOLDEN: Vec3 = [1.0, 0.74, 0.5];
const HIGH: Vec3 = [1.0, 0.95, 0.88];
const DAY_SKY: Vec3 = [0.72, 0.84, 1.0];
const DUSK_SKY: Vec3 = [0.3, 0.42, 0.85];

/**
 * The desk sits under a window that faces the midday sun (south in the
 * northern hemisphere, north in the southern), at the top of the picture. East
 * is therefore to the left: morning light rakes in from the left, evening
 * light from the right.
 */
export function lightingFor(sun: SunPosition, latitude: number): LightState {
  const toward = latitude >= 0 ? 180 : 0;
  let relative = ((sun.azimuth - toward + 540) % 360) - 180;
  if (latitude < 0) relative = -relative;
  const inWindow = 1 - smooth(62, 104, Math.abs(relative));
  const up = smooth(-1.5, 9, sun.elevation);
  // A real room cuts off the high summer sun and never sees a beam flatter than the sill.
  const reach = 1 - 0.55 * smooth(52, 78, sun.elevation);

  const beamAzimuth = (clamp(relative, -64, 64) * Math.PI) / 180;
  const beamElevation = (clamp(sun.elevation, 9, 58) * Math.PI) / 180;
  const sunDirection: Vec3 = [
    Math.sin(beamAzimuth) * Math.cos(beamElevation),
    Math.sin(beamElevation),
    -Math.cos(beamAzimuth) * Math.cos(beamElevation),
  ];

  const warm = smooth(0, 9, sun.elevation);
  const high = smooth(8, 32, sun.elevation);
  const sunColor = mix(mix(HORIZON, GOLDEN, warm), HIGH, high);

  const skyStrength = smooth(-9, 7, sun.elevation);
  const skyColor = mix(DUSK_SKY, DAY_SKY, smooth(-4, 10, sun.elevation));

  return {
    sunDirection,
    sunColor,
    sunStrength: up * inWindow * reach,
    skyColor,
    skyStrength,
    night: 1 - smooth(-7, 5, sun.elevation),
  };
}

/** The fixed skies of the two manual modes. */
export const DAY_SUN: SunPosition = { elevation: 33, azimuth: 138 };
export const NIGHT_SUN: SunPosition = { elevation: -35, azimuth: 0 };
