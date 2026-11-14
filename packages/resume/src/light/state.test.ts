import { describe, expect, it } from 'vitest';
import { DAY_SUN, NIGHT_SUN, lightingFor } from './state';

describe('lightingFor', () => {
  it('gives a strong beam and no lamp at mid-morning', () => {
    const state = lightingFor(DAY_SUN, 40);
    expect(state.sunStrength).toBeGreaterThan(0.8);
    expect(state.skyStrength).toBeGreaterThan(0.95);
    expect(state.lampWanted).toBe(false);
    expect(state.night).toBe(0);
  });

  it('is dark at night with the lamp on', () => {
    const state = lightingFor(NIGHT_SUN, 40);
    expect(state.sunStrength).toBe(0);
    expect(state.skyStrength).toBe(0);
    expect(state.lampWanted).toBe(true);
    expect(state.night).toBe(1);
  });

  it('is warm at sunrise and near white at noon', () => {
    const dawn = lightingFor({ elevation: 2, azimuth: 95 }, 40).sunColor;
    const noon = lightingFor({ elevation: 50, azimuth: 180 }, 40).sunColor;
    expect(dawn[2] / dawn[0]).toBeLessThan(0.4);
    expect(noon[2] / noon[0]).toBeGreaterThan(0.8);
  });

  it('brings morning light from the left and evening light from the right', () => {
    expect(lightingFor({ elevation: 20, azimuth: 120 }, 40).sunDirection[0]).toBeLessThan(0);
    expect(lightingFor({ elevation: 20, azimuth: 240 }, 40).sunDirection[0]).toBeGreaterThan(0);
  });

  it('keeps east on the left in the southern hemisphere', () => {
    // In Sydney the morning sun is in the north-east.
    expect(lightingFor({ elevation: 20, azimuth: 60 }, -34).sunDirection[0]).toBeLessThan(0);
    expect(lightingFor({ elevation: 40, azimuth: 0 }, -34).sunStrength).toBeGreaterThan(0.8);
  });

  it('always points the beam down onto the desk from the window side', () => {
    for (let elevation = -20; elevation <= 90; elevation += 10) {
      for (let azimuth = 0; azimuth < 360; azimuth += 30) {
        const { sunDirection } = lightingFor({ elevation, azimuth }, 40);
        expect(sunDirection[1]).toBeGreaterThan(0.15);
        expect(sunDirection[2]).toBeLessThan(0);
        expect(Math.hypot(...sunDirection)).toBeCloseTo(1, 6);
      }
    }
  });

  it('loses the beam when the sun is behind the window wall', () => {
    expect(lightingFor({ elevation: 20, azimuth: 0 }, 40).sunStrength).toBe(0);
  });

  it('asks for the lamp through dusk', () => {
    expect(lightingFor({ elevation: 3, azimuth: 260 }, 40).lampWanted).toBe(true);
    expect(lightingFor({ elevation: 12, azimuth: 250 }, 40).lampWanted).toBe(false);
  });
});
