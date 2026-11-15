import { describe, expect, it } from 'vitest';
import { panBy, WHOLE, zoomAt } from './zoom';

describe('zoomAt', () => {
  it('keeps the point under the pointer where it is', () => {
    const zoom = zoomAt(WHOLE, 2, 0.1, -0.05, 3, 0.4, 0.25);
    expect(zoom.scale).toBe(2);
    // The desk point that was 0.1, -0.05 from the middle is still under the pointer.
    expect(zoom.x + 0.1 / zoom.scale).toBeCloseTo(0.1, 9);
    expect(zoom.z - 0.05 / zoom.scale).toBeCloseTo(-0.05, 9);
  });

  it('stops at the whole desk and at reading size', () => {
    expect(zoomAt(WHOLE, 0.5, 0.1, 0.1, 3, 0.4, 0.25)).toEqual(WHOLE);
    expect(zoomAt(WHOLE, 10, 0, 0, 1.6, 0.4, 0.25).scale).toBe(1.6);
    expect(zoomAt(WHOLE, 10, 0, 0, 0.9, 0.4, 0.25).scale).toBe(1);
  });

  it('comes back to the middle as it draws back', () => {
    const near = zoomAt(WHOLE, 3, 0.3, 0.2, 3, 0.4, 0.25);
    const back = zoomAt(near, 1 / 3, -0.2, 0.1, 3, 0.4, 0.25);
    expect(back.scale).toBeCloseTo(1, 9);
    expect(back.x).toBeCloseTo(0, 9);
    expect(back.z).toBeCloseTo(0, 9);
  });
});

describe('panBy', () => {
  it('cannot leave the frame of the whole desk', () => {
    const near = zoomAt(WHOLE, 2, 0, 0, 3, 0.4, 0.25);
    const far = panBy(near, 5, -5, 0.4, 0.25);
    expect(far.x).toBeCloseTo(0.2, 9);
    expect(far.z).toBeCloseTo(-0.125, 9);
    expect(panBy(WHOLE, 1, 1, 0.4, 0.25)).toEqual(WHOLE);
  });
});
