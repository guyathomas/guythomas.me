import { describe, expect, it } from 'vitest';
import { creaseOffset, curlFromDrag, curlPoint, type Curl } from './curl';
import { frontUp, identityPose, movePose, poseFromAngle, reflectPose, toLocal, toWorld } from './pose';
import { glideStep, slideStep } from './slide';

const close = (a: number, b: number, eps = 1e-9) => expect(Math.abs(a - b)).toBeLessThan(eps);

describe('pose', () => {
  it('round-trips local and world points', () => {
    const pose = poseFromAngle(0.1, -0.2, 0.7);
    const [x, z] = toWorld(pose, 0.05, 0.08);
    const [lx, lz] = toLocal(pose, x, z);
    close(lx, 0.05);
    close(lz, 0.08);
  });

  it('turns the sheet over when reflected, and back when reflected twice', () => {
    const pose = poseFromAngle(0.1, 0.2, 0.3);
    const flipped = reflectPose(pose, 0.3, 0, Math.SQRT1_2, Math.SQRT1_2);
    expect(frontUp(pose)).toBe(true);
    expect(frontUp(flipped)).toBe(false);
    const again = reflectPose(flipped, 0.3, 0, Math.SQRT1_2, Math.SQRT1_2);
    for (const key of ['cx', 'cz', 'a', 'b', 'c', 'd'] as const) close(again[key], pose[key]);
  });

  it('keeps points on the mirror line fixed', () => {
    const flipped = reflectPose(identityPose(), 0.1, 0, 1, 0);
    const [x, z] = toWorld(flipped, 0.1, 0.05);
    close(x, 0.1);
    close(z, 0.05);
  });

  it('rotates about a pivot without moving it', () => {
    const moved = movePose(identityPose(), 0.1, 0.1, 1.2, 0, 0);
    const [lx, lz] = toLocal(moved, 0.1, 0.1);
    close(lx, 0.1);
    close(lz, 0.1);
  });
});

describe('curl', () => {
  const curl: Curl = { mx: 0, mz: 0, nx: 1, nz: 0, r: 0.02 };

  it('leaves the near side flat', () => {
    expect(curlPoint(-0.05, 0.03, curl)).toEqual([-0.05, 0, 0.03]);
  });

  it('is continuous at the crease and at half a turn', () => {
    const eps = 1e-7;
    const half = Math.PI * curl.r;
    for (const d of [0, half]) {
      const before = curlPoint(d - eps, 0, curl).slice();
      const after = curlPoint(d + eps, 0, curl).slice();
      for (let i = 0; i < 3; i++) close(before[i], after[i], 1e-6);
    }
  });

  it('never stretches the paper', () => {
    // Arc length between neighbours on the bent sheet equals their flat spacing.
    let previous = curlPoint(-0.01, 0, curl).slice();
    for (let d = -0.0099; d < 0.12; d += 0.0001) {
      const next = curlPoint(d, 0, curl).slice();
      const step = Math.hypot(next[0] - previous[0], next[1] - previous[1], next[2] - previous[2]);
      close(step, 0.0001, 2e-6);
      previous = next;
    }
  });

  it('lays the far side flat and upside down at twice the radius', () => {
    const [x, y] = curlPoint(0.1, 0, curl);
    close(y, 0.04);
    close(x, -(0.1 - Math.PI * 0.02));
  });

  it('puts a dragged corner under the pointer', () => {
    for (const distance of [0.004, 0.03, 0.0628, 0.15]) {
      const found = curlFromDrag(0.1, 0.1, 0.1 - distance, 0.1, 0.02)!;
      const [x, , z] = curlPoint(0.1, 0.1, found);
      close(x, 0.1 - distance, 1e-6);
      close(z, 0.1);
    }
  });

  it('needs more paper past the crease the further the corner is pulled', () => {
    let last = 0;
    for (let distance = 0.001; distance < 0.2; distance += 0.003) {
      const offset = creaseOffset(distance, 0.02);
      expect(offset).toBeGreaterThan(last);
      last = offset;
    }
  });

  it('has no curl for no drag', () => {
    expect(curlFromDrag(0.1, 0.1, 0.1, 0.1, 0.02)).toBeNull();
  });
});

describe('slide', () => {
  it('keeps the grabbed point under the pointer', () => {
    const pose = poseFromAngle(0, 0, 0.2);
    const [gx, gz] = toWorld(pose, 0.08, -0.1);
    const [lx, lz] = toLocal(pose, gx, gz);
    const next = slideStep(pose, gx, gz, gx + 0.01, gz + 0.004, 0.1);
    const [nx, nz] = toWorld(next, lx, lz);
    close(nx, gx + 0.01);
    close(nz, gz + 0.004);
  });

  it('does not turn when pulled through the centre', () => {
    const next = slideStep(identityPose(), 0, 0, 0.02, 0.01, 0.1);
    close(next.a, 1);
    close(next.b, 0);
  });

  it('swings the sheet behind an off-centre pull', () => {
    // Grab the right edge and pull down the desk: the sheet turns clockwise seen from above.
    const next = slideStep(identityPose(), 0.1, 0, 0.1, 0.02, 0.1);
    expect(next.c).toBeGreaterThan(0);
  });

  it('comes to rest', () => {
    const glide = { vx: 0.5, vz: 0.2, spin: 1 };
    let steps = 0;
    while (glideStep(glide, 1 / 60, 9) && steps < 600) steps++;
    expect(steps).toBeLessThan(120);
  });
});
