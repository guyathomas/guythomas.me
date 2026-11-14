import { describe, expect, it } from 'vitest';
import { Marble, type Segment } from './marble';

const seg = (x0: number, y0: number, x1: number, y1: number): Segment => ({ x0, y0, x1, y1, half: 0.0004 });

function run(marble: Marble, segments: Segment[], seconds: number): void {
  for (let i = 0; i < seconds * 120; i++) marble.step(1 / 120, segments);
}

describe('Marble', () => {
  it('falls down the page when nothing holds it', () => {
    const marble = new Marble(0.1, 0.05);
    run(marble, [], 0.5);
    expect(marble.y).toBeGreaterThan(0.08);
    expect(marble.x).toBeCloseTo(0.1, 6);
  });

  it('rests on a level line without sinking through', () => {
    const marble = new Marble(0.1, 0.05);
    run(marble, [seg(0.05, 0.07, 0.15, 0.07)], 3);
    expect(marble.y).toBeLessThan(0.07);
    expect(marble.y).toBeGreaterThan(0.07 - marble.radius - 0.001);
    expect(Math.hypot(marble.vx, marble.vy)).toBeLessThan(0.01);
  });

  it('rolls down a ramp, turning as it goes', () => {
    const marble = new Marble(0.06, 0.05);
    run(marble, [seg(0.04, 0.06, 0.16, 0.09)], 1.2);
    expect(marble.x).toBeGreaterThan(0.09);
    expect(marble.turned).not.toBe(0);
  });

  it('does not tunnel through a line at speed', () => {
    const marble = new Marble(0.1, 0.02);
    marble.vy = 5;
    run(marble, [seg(0.0, 0.2, 0.2, 0.2)], 2);
    expect(marble.y).toBeLessThan(0.2);
  });

  it('reports how hard it hit', () => {
    const marble = new Marble(0.1, 0.02);
    let hardest = 0;
    for (let i = 0; i < 240; i++) hardest = Math.max(hardest, marble.step(1 / 120, [seg(0, 0.1, 0.2, 0.1)]));
    expect(hardest).toBeGreaterThan(0.1);
  });
});
