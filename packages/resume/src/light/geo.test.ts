import { describe, expect, it } from 'vitest';
import { placeFromReply } from './geo';
import { placeFromTimeZone } from './zones';

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
