import { placeFromReply } from './geo';
import { placeFromTimeZone, type Place } from './zones';

/** A first guess from the viewer's clock. Instant, needs no permission and no network. */
export function guessPlace(): Place {
  let zone: string | undefined;
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    zone = undefined;
  }
  return placeFromTimeZone(zone, -new Date().getTimezoneOffset());
}

/** A better fix from the host's own geolocation of the request. Null when unavailable. */
export async function locate(): Promise<Place | null> {
  try {
    const response = await fetch('/api/geo', { signal: AbortSignal.timeout(2500), headers: { accept: 'application/json' } });
    if (!response.ok) return null;
    return placeFromReply(await response.json());
  } catch {
    return null;
  }
}
