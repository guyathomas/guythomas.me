import { describe, expect, it } from 'vitest';
import { solarPosition } from './solar';

const NYC = [40.71, -74.01] as const;
const near = (actual: number, expected: number, tolerance: number) => expect(Math.abs(actual - expected)).toBeLessThan(tolerance);

describe('solarPosition', () => {
  it('puts the sun overhead at the equator at the equinox', () => {
    // Solar noon on the Greenwich meridian on 20 March 2025 is about 12:07 UTC.
    const sun = solarPosition(new Date('2025-03-20T12:07:00Z'), 0, 0);
    near(sun.elevation, 90, 1);
  });

  it('matches New York at the summer solstice', () => {
    const sun = solarPosition(new Date('2025-06-21T16:58:00Z'), ...NYC);
    near(sun.elevation, 72.7, 0.6);
    near(sun.azimuth, 180, 3);
  });

  it('matches New York at the winter solstice', () => {
    const sun = solarPosition(new Date('2025-12-21T16:54:00Z'), ...NYC);
    near(sun.elevation, 25.9, 0.6);
    near(sun.azimuth, 180, 2);
  });

  it('rises in the east and sets in the west', () => {
    const morning = solarPosition(new Date('2025-09-22T11:30:00Z'), ...NYC);
    const evening = solarPosition(new Date('2025-09-22T22:00:00Z'), ...NYC);
    expect(morning.azimuth).toBeGreaterThan(80);
    expect(morning.azimuth).toBeLessThan(110);
    expect(evening.azimuth).toBeGreaterThan(250);
    expect(evening.azimuth).toBeLessThan(280);
    expect(morning.elevation).toBeGreaterThan(0);
    expect(evening.elevation).toBeGreaterThan(0);
  });

  it('is below the horizon at local midnight', () => {
    expect(solarPosition(new Date('2025-06-21T05:00:00Z'), ...NYC).elevation).toBeLessThan(-20);
  });

  it('sits in the northern sky at noon in Sydney', () => {
    const sun = solarPosition(new Date('2025-12-21T02:00:00Z'), -33.87, 151.21);
    expect(sun.elevation).toBeGreaterThan(70);
    expect(Math.min(sun.azimuth, 360 - sun.azimuth)).toBeLessThan(60);
  });
});
