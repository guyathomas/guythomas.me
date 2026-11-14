export interface Place {
  latitude: number;
  longitude: number;
}

/**
 * Rough centres of the commonest time zones: [latitude, longitude]. Only used
 * to place the sun when the precise lookup is unavailable, so a major city
 * per zone is plenty.
 */
const ZONES: Record<string, [number, number]> = {
  'America/New_York': [40.7, -74.0],
  'America/Detroit': [42.3, -83.0],
  'America/Toronto': [43.7, -79.4],
  'America/Chicago': [41.9, -87.6],
  'America/Winnipeg': [49.9, -97.1],
  'America/Denver': [39.7, -105.0],
  'America/Edmonton': [53.5, -113.5],
  'America/Phoenix': [33.4, -112.1],
  'America/Los_Angeles': [34.1, -118.2],
  'America/Vancouver': [49.3, -123.1],
  'America/Anchorage': [61.2, -149.9],
  'Pacific/Honolulu': [21.3, -157.9],
  'America/Halifax': [44.6, -63.6],
  'America/St_Johns': [47.6, -52.7],
  'America/Mexico_City': [19.4, -99.1],
  'America/Bogota': [4.7, -74.1],
  'America/Lima': [-12.0, -77.0],
  'America/Caracas': [10.5, -66.9],
  'America/Santiago': [-33.4, -70.7],
  'America/Argentina/Buenos_Aires': [-34.6, -58.4],
  'America/Sao_Paulo': [-23.6, -46.6],
  'America/Montevideo': [-34.9, -56.2],
  'America/Panama': [9.0, -79.5],
  'America/Costa_Rica': [9.9, -84.1],
  'America/Puerto_Rico': [18.4, -66.1],
  'Atlantic/Reykjavik': [64.1, -21.9],
  'Europe/London': [51.5, -0.1],
  'Europe/Dublin': [53.3, -6.3],
  'Europe/Lisbon': [38.7, -9.1],
  'Europe/Madrid': [40.4, -3.7],
  'Europe/Paris': [48.9, 2.4],
  'Europe/Brussels': [50.8, 4.4],
  'Europe/Amsterdam': [52.4, 4.9],
  'Europe/Berlin': [52.5, 13.4],
  'Europe/Zurich': [47.4, 8.5],
  'Europe/Rome': [41.9, 12.5],
  'Europe/Vienna': [48.2, 16.4],
  'Europe/Prague': [50.1, 14.4],
  'Europe/Copenhagen': [55.7, 12.6],
  'Europe/Oslo': [59.9, 10.8],
  'Europe/Stockholm': [59.3, 18.1],
  'Europe/Helsinki': [60.2, 24.9],
  'Europe/Warsaw': [52.2, 21.0],
  'Europe/Budapest': [47.5, 19.0],
  'Europe/Bucharest': [44.4, 26.1],
  'Europe/Athens': [38.0, 23.7],
  'Europe/Kyiv': [50.5, 30.5],
  'Europe/Kiev': [50.5, 30.5],
  'Europe/Istanbul': [41.0, 29.0],
  'Europe/Moscow': [55.8, 37.6],
  'Africa/Casablanca': [33.6, -7.6],
  'Africa/Lagos': [6.5, 3.4],
  'Africa/Accra': [5.6, -0.2],
  'Africa/Cairo': [30.0, 31.2],
  'Africa/Nairobi': [-1.3, 36.8],
  'Africa/Johannesburg': [-26.2, 28.0],
  'Asia/Jerusalem': [31.8, 35.2],
  'Asia/Riyadh': [24.7, 46.7],
  'Asia/Dubai': [25.2, 55.3],
  'Asia/Tehran': [35.7, 51.4],
  'Asia/Karachi': [24.9, 67.0],
  'Asia/Kolkata': [22.6, 88.4],
  'Asia/Calcutta': [22.6, 88.4],
  'Asia/Dhaka': [23.8, 90.4],
  'Asia/Bangkok': [13.8, 100.5],
  'Asia/Ho_Chi_Minh': [10.8, 106.7],
  'Asia/Jakarta': [-6.2, 106.8],
  'Asia/Singapore': [1.4, 103.8],
  'Asia/Kuala_Lumpur': [3.1, 101.7],
  'Asia/Manila': [14.6, 121.0],
  'Asia/Hong_Kong': [22.3, 114.2],
  'Asia/Shanghai': [31.2, 121.5],
  'Asia/Taipei': [25.0, 121.6],
  'Asia/Seoul': [37.6, 127.0],
  'Asia/Tokyo': [35.7, 139.7],
  'Australia/Perth': [-31.9, 115.9],
  'Australia/Adelaide': [-34.9, 138.6],
  'Australia/Brisbane': [-27.5, 153.0],
  'Australia/Sydney': [-33.9, 151.2],
  'Australia/Melbourne': [-37.8, 145.0],
  'Pacific/Auckland': [-36.8, 174.8],
};

/**
 * Best guess at where a viewer is from their clock alone. `offsetMinutes` is
 * minutes east of UTC. Unknown zones fall back to the meridian their offset
 * implies, at a temperate latitude in the hemisphere the zone name suggests.
 */
export function placeFromTimeZone(zone: string | undefined, offsetMinutes: number): Place {
  const known = zone ? ZONES[zone] : undefined;
  if (known) return { latitude: known[0], longitude: known[1] };
  const southern = zone ? /^(Australia|Antarctica)\/|^Pacific\/(Auckland|Fiji|Tongatapu)|^Africa\/(Maputo|Harare|Windhoek|Gaborone|Lusaka)/.test(zone) : false;
  return { latitude: southern ? -30 : 38, longitude: Math.max(-180, Math.min(180, offsetMinutes / 4)) };
}
