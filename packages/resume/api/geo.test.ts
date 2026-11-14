import { describe, expect, it } from 'vitest';
import { GET } from './geo';

const ask = async (headers: Record<string, string>) => {
  const response = GET(new Request('https://example.test/api/geo', { headers }));
  return { body: await response.json(), response };
};

describe('GET /api/geo', () => {
  it('coarsens the location to a tenth of a degree', async () => {
    const { body } = await ask({ 'x-vercel-ip-latitude': '40.7128', 'x-vercel-ip-longitude': '-74.0060', 'x-vercel-ip-timezone': 'America/New_York' });
    expect(body).toEqual({ latitude: 40.7, longitude: -74, timeZone: 'America/New_York' });
  });

  it('returns nothing without headers, and is never cached', async () => {
    const { body, response } = await ask({});
    expect(body).toEqual({});
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('drops half a location and nonsense values', async () => {
    expect((await ask({ 'x-vercel-ip-latitude': '40.7' })).body).toEqual({});
    expect((await ask({ 'x-vercel-ip-latitude': 'abc', 'x-vercel-ip-longitude': '10' })).body).toEqual({});
    expect((await ask({ 'x-vercel-ip-latitude': '140', 'x-vercel-ip-longitude': '10' })).body).toEqual({});
  });

  it('rejects a time zone that is not a zone name', async () => {
    expect((await ask({ 'x-vercel-ip-timezone': 'not a zone!' })).body).toEqual({});
  });
});
