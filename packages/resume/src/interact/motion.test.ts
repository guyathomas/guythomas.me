import { describe, expect, it } from 'vitest';
import { coast, collide, throwSpin, type Body } from './motion';

const body = (over: Partial<Body> = {}): Body => ({
  x: 0, z: 0, angle: 0, vx: 0, vz: 0, spin: 0, rolled: 0, span: [0, 0], radius: 0.02, mass: 1, rolls: false, ...over,
});

function settle(b: Body): number {
  let steps = 0;
  while (coast(b, 1 / 120) && steps < 5000) steps++;
  return steps;
}

describe('coast', () => {
  it('brings a sliding body to rest a short way on', () => {
    const b = body({ vx: 0.5 });
    expect(settle(b)).toBeLessThan(5000);
    expect(b.vx).toBe(0);
    expect(b.x).toBeGreaterThan(0.02);
    expect(b.x).toBeLessThan(0.06);
  });

  it('lets a round body roll further across its axis than it slides along it', () => {
    const along = body({ rolls: true, vx: 0.3 });
    const across = body({ rolls: true, vz: 0.3 });
    settle(along);
    settle(across);
    expect(across.z).toBeGreaterThan(along.x * 2);
    expect(Math.abs(across.rolled)).toBeGreaterThan(0.01);
    expect(along.rolled).toBe(0);
  });

  it('stops a spin', () => {
    const b = body({ spin: 6 });
    settle(b);
    expect(b.spin).toBe(0);
    expect(b.angle).toBeGreaterThan(0);
  });

  it('keeps bodies on the desk', () => {
    const b = body({ vx: 40, vz: -40 });
    settle(b);
    expect(Math.abs(b.x)).toBeLessThanOrEqual(0.45);
    expect(Math.abs(b.z)).toBeLessThanOrEqual(0.5);
  });
});

describe('collide', () => {
  it('leaves bodies that are apart alone', () => {
    const a = body({ vx: 1 });
    const b = body({ x: 0.1 });
    expect(collide(a, b)).toBe(false);
    expect(b.vx).toBe(0);
  });

  it('passes momentum on and separates the pair', () => {
    const a = body({ vx: 0.4 });
    const b = body({ x: 0.035 });
    expect(collide(a, b)).toBe(true);
    expect(b.vx).toBeGreaterThan(0);
    expect(a.vx).toBeLessThan(0.4);
    expect(a.vx + b.vx).toBeCloseTo(0.4, 6);
    expect(b.x - a.x).toBeGreaterThanOrEqual(0.04 - 1e-9);
  });

  it('moves the lighter body more', () => {
    const heavy = body({ mass: 6 });
    const light = body({ x: 0.03, mass: 1 });
    collide(heavy, light);
    expect(Math.abs(light.x - 0.03)).toBeGreaterThan(Math.abs(heavy.x) * 3);
  });

  it('treats a long body as a capsule and turns it when struck off centre', () => {
    const pencil = body({ span: [-0.06, 0.08], radius: 0.005 });
    const ball = body({ x: 0.07, z: -0.02, vz: 0.5 });
    expect(collide(ball, pencil)).toBe(true);
    expect(pencil.spin).not.toBe(0);
    const miss = body({ x: 0.12, z: -0.02, vz: 0.5 });
    expect(collide(miss, pencil)).toBe(false);
  });
});

describe('throwSpin', () => {
  it('is zero when thrown by the middle and turns opposite ways either side', () => {
    expect(throwSpin(0, 0, 0.5, 0)).toBe(0);
    const one = throwSpin(0, 0.03, 0.5, 0);
    const other = throwSpin(0, -0.03, 0.5, 0);
    expect(one).not.toBe(0);
    expect(Math.sign(one)).toBe(-Math.sign(other));
  });
});
