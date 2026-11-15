import { describe, expect, it } from 'vitest';
import { coast, type Body } from './motion';

const body = (over: Partial<Body>): Body => ({ x: 0, z: 0, angle: 0, vx: 0, vz: 0, spin: 0, rolled: 0, span: [0, 0], radius: 0.01, mass: 1, rolls: false, ...over });

describe('coast within bounds', () => {
  it('stops a thrown thing at the edge of what can be seen', () => {
    const bounds = { x0: -0.2, x1: 0.15, z0: -0.1, z1: 0.3 };
    const thrown = body({ vx: 1.4, vz: -1.4 });
    for (let i = 0; i < 600 && coast(thrown, 1 / 120, bounds); i++);
    expect(thrown.x).toBeLessThanOrEqual(0.15);
    expect(thrown.z).toBeGreaterThanOrEqual(-0.1);
    expect(thrown.vx).toBe(0);
    expect(thrown.vz).toBe(0);
  });
});
