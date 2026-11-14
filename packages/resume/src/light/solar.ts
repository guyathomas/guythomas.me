export interface SunPosition {
  /** Degrees above the horizon; negative at night. */
  elevation: number;
  /** Degrees clockwise from north. */
  azimuth: number;
}

const RAD = Math.PI / 180;
const wrap = (degrees: number): number => ((degrees % 360) + 360) % 360;

/**
 * Where the sun is in the sky for an observer. Low-precision almanac formulas,
 * good to a fraction of a degree, which is far more than a desk lamp needs.
 */
export function solarPosition(date: Date, latitude: number, longitude: number): SunPosition {
  const days = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
  const meanLongitude = wrap(280.46 + 0.9856474 * days);
  const anomaly = wrap(357.528 + 0.9856003 * days) * RAD;
  const ecliptic = (meanLongitude + 1.915 * Math.sin(anomaly) + 0.02 * Math.sin(2 * anomaly)) * RAD;
  const obliquity = (23.439 - 0.0000004 * days) * RAD;

  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(ecliptic), Math.cos(ecliptic));
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(ecliptic));

  const siderealHours = (((18.697374558 + 24.06570982441908 * days) % 24) + 24) % 24;
  const hourAngle = (siderealHours * 15 + longitude) * RAD - rightAscension;
  const lat = latitude * RAD;

  const elevation = Math.asin(Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle));
  const azimuth = Math.atan2(-Math.sin(hourAngle), Math.tan(declination) * Math.cos(lat) - Math.sin(lat) * Math.cos(hourAngle));
  return { elevation: elevation / RAD, azimuth: wrap(azimuth / RAD) };
}
