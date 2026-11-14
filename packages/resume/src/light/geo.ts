import type { Place } from './zones';

export interface GeoReply extends Partial<Place> {
  timeZone?: string;
}

const round1 = (value: number): number => Math.round(value * 10) / 10;

function coordinate(raw: string | null, limit: number): number | undefined {
  if (raw === null || raw.trim() === '') return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && Math.abs(value) <= limit ? round1(value) : undefined;
}

/**
 * Reads the approximate location Vercel attaches to a request and coarsens it
 * to a tenth of a degree (about ten kilometres). Nothing else leaves the server.
 */
export function geoFromHeaders(headers: { get(name: string): string | null }): GeoReply {
  const latitude = coordinate(headers.get('x-vercel-ip-latitude'), 90);
  const longitude = coordinate(headers.get('x-vercel-ip-longitude'), 180);
  const reply: GeoReply = {};
  if (latitude !== undefined && longitude !== undefined) {
    reply.latitude = latitude;
    reply.longitude = longitude;
  }
  const zone = headers.get('x-vercel-ip-timezone');
  if (zone && /^[A-Za-z_+\-/0-9]{1,64}$/.test(zone)) reply.timeZone = zone;
  return reply;
}

/** Validates a reply from /api/geo on the client. */
export function placeFromReply(reply: unknown): Place | null {
  if (!reply || typeof reply !== 'object') return null;
  const { latitude, longitude } = reply as GeoReply;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude, longitude };
}
