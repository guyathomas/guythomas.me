import type { Mode } from '../app/params';
import { solarPosition, type SunPosition } from './solar';
import { DAY_SUN, NIGHT_SUN } from './state';
import type { Place } from './zones';

/** The instant today at which the local solar clock at this longitude reads `hour`. */
export function dateAtSolarHour(today: Date, hour: number, longitude: number): Date {
  const midnight = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return new Date(midnight + (hour - longitude / 15) * 3600000);
}

/** Where the sun is for the chosen lighting mode. */
export function sunFor(mode: Mode, now: Date, place: Place, solarHour: number | null): SunPosition {
  if (mode === 'day') return DAY_SUN;
  if (mode === 'night') return NIGHT_SUN;
  const when = solarHour === null ? now : dateAtSolarHour(now, solarHour, place.longitude);
  return solarPosition(when, place.latitude, place.longitude);
}
