import { describe, expect, it } from 'vitest';
import { isFrozen, parseParams } from './params';

describe('parseParams', () => {
  it('is empty for no query', () => {
    const params = parseParams('');
    expect(params).toEqual({ view: null, mode: null, sun: null, latitude: null, longitude: null, time: null, light: null, page: null, fps: false });
    expect(isFrozen(params)).toBe(false);
  });

  it('reads a full freeze state', () => {
    const params = parseParams('?view=mid-flip&mode=auto&sun=6.5&lat=51.5&lon=-0.1&t=3&light=0.2,-0.3&page=5&fps');
    expect(params).toEqual({ view: 'mid-flip', mode: 'auto', sun: 6.5, latitude: 51.5, longitude: -0.1, time: 3, light: [0.2, -0.3], page: 5, fps: true });
    expect(isFrozen(params)).toBe(true);
  });

  it('ignores unknown names and junk numbers', () => {
    const params = parseParams('?view=explode&mode=dusk&sun=abc&light=1');
    expect(params.view).toBeNull();
    expect(params.mode).toBeNull();
    expect(params.sun).toBeNull();
    expect(params.light).toBeNull();
  });

  it('clamps values to their ranges', () => {
    const params = parseParams('?sun=40&lat=-200&light=5,-5');
    expect(params.sun).toBe(24);
    expect(params.latitude).toBe(-90);
    expect(params.light).toEqual([1, -1]);
  });
});
