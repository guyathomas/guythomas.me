import type { Place } from './zones';

export interface GeoReply extends Partial<Place> {
  timeZone?: string;
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
