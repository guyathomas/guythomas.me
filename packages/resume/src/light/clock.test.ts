import { describe, expect, it } from 'vitest';
import { sunFor } from './clock';
import { DAY_SUN, NIGHT_SUN } from './state';

const place = { latitude: 40.7, longitude: -74 };
const today = new Date('2025-06-21T03:00:00Z');

describe('sunFor', () => {
  it('uses fixed skies for the manual modes', () => {
    expect(sunFor('day', today, place, null)).toBe(DAY_SUN);
    expect(sunFor('night', today, place, 12)).toBe(NIGHT_SUN);
  });

  it('follows the real sun in auto', () => {
    expect(sunFor('auto', new Date('2025-06-21T17:00:00Z'), place, null).elevation).toBeGreaterThan(70);
    expect(sunFor('auto', new Date('2025-06-21T05:00:00Z'), place, null).elevation).toBeLessThan(0);
  });

  it('pins the sun to a local solar hour', () => {
    const noon = sunFor('auto', today, place, 12);
    expect(Math.abs(noon.azimuth - 180)).toBeLessThan(4);
    expect(noon.elevation).toBeGreaterThan(70);
    const dawn = sunFor('auto', today, place, 5);
    expect(dawn.azimuth).toBeLessThan(90);
    expect(Math.abs(dawn.elevation)).toBeLessThan(8);
    expect(sunFor('auto', today, place, 0).elevation).toBeLessThan(-15);
  });

  it('pins the same solar hour at any longitude', () => {
    const tokyo = sunFor('auto', today, { latitude: 35.7, longitude: 139.7 }, 12);
    expect(Math.abs(tokyo.azimuth - 180)).toBeLessThan(5);
  });
});
