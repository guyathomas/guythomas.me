import { describe, expect, it } from 'vitest';
import { geoFromHeaders, placeFromReply } from './geo';
import { placeFromTimeZone } from './zones';

const headers = (values: Record<string, string>) => ({ get: (name: string) => values[name] ?? null });

describe('geoFromHeaders', () => {
  it('coarsens the location to a tenth of a degree', () => {
    expect(
      geoFromHeaders(headers({ 'x-vercel-ip-latitude': '40.7128', 'x-vercel-ip-longitude': '-74.0060', 'x-vercel-ip-timezone': 'America/New_York' })),
    ).toEqual({ latitude: 40.7, longitude: -74, timeZone: 'America/New_York' });
  });

  it('returns nothing without headers', () => {
    expect(geoFromHeaders(headers({}))).toEqual({});
  });

  it('drops half a location and nonsense values', () => {
    expect(geoFromHeaders(headers({ 'x-vercel-ip-latitude': '40.7' }))).toEqual({});
    expect(geoFromHeaders(headers({ 'x-vercel-ip-latitude': 'abc', 'x-vercel-ip-longitude': '10' }))).toEqual({});
    expect(geoFromHeaders(headers({ 'x-vercel-ip-latitude': '140', 'x-vercel-ip-longitude': '10' }))).toEqual({});
  });

  it('rejects a time zone that is not a zone name', () => {
    expect(geoFromHeaders(headers({ 'x-vercel-ip-timezone': '<script>' }))).toEqual({});
  });
});

describe('placeFromReply', () => {
  it('accepts a good reply and rejects bad ones', () => {
    expect(placeFromReply({ latitude: 51.5, longitude: -0.1 })).toEqual({ latitude: 51.5, longitude: -0.1 });
    expect(placeFromReply({})).toBeNull();
    expect(placeFromReply(null)).toBeNull();
    expect(placeFromReply({ latitude: 'x', longitude: 2 })).toBeNull();
    expect(placeFromReply({ latitude: 95, longitude: 2 })).toBeNull();
  });
});

describe('placeFromTimeZone', () => {
  it('knows major zones', () => {
    expect(placeFromTimeZone('Europe/London', 0)).toEqual({ latitude: 51.5, longitude: -0.1 });
  });

  it('falls back to the meridian of the offset', () => {
    expect(placeFromTimeZone('Asia/Nowhere', 330)).toEqual({ latitude: 38, longitude: 82.5 });
    expect(placeFromTimeZone(undefined, -300)).toEqual({ latitude: 38, longitude: -75 });
  });

  it('guesses the southern hemisphere from the zone name', () => {
    expect(placeFromTimeZone('Australia/Hobart', 600).latitude).toBeLessThan(0);
  });
});
