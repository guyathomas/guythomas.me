/** How close the camera has come to the desk, and where it has moved to, in the fitted view. */
export interface Zoom {
  /** 1 shows the whole desk; larger is closer. */
  scale: number;
  /** How far the middle of the picture has moved from the middle of the desk, metres. */
  x: number;
  z: number;
}

export const WHOLE: Zoom = { scale: 1, x: 0, z: 0 };

/** Keeps the picture inside the frame it has when it shows the whole desk. */
function held(zoom: Zoom, halfWidth: number, halfHeight: number): Zoom {
  const roomX = halfWidth * (1 - 1 / zoom.scale);
  const roomZ = halfHeight * (1 - 1 / zoom.scale);
  return { scale: zoom.scale, x: Math.min(roomX, Math.max(-roomX, zoom.x)), z: Math.min(roomZ, Math.max(-roomZ, zoom.z)) };
}

/**
 * Comes closer or draws back by `factor`, keeping the desk point under the
 * pointer where it is. (dx, dz) is the pointer's distance from the middle of
 * the picture in desk metres at scale 1; halfWidth and halfHeight are the
 * picture's half extents at scale 1.
 */
export function zoomAt(zoom: Zoom, factor: number, dx: number, dz: number, most: number, halfWidth: number, halfHeight: number): Zoom {
  const scale = Math.min(Math.max(1, most), Math.max(1, zoom.scale * factor));
  // The desk point under the pointer, before and after.
  const px = zoom.x + dx / zoom.scale;
  const pz = zoom.z + dz / zoom.scale;
  return held({ scale, x: px - dx / scale, z: pz - dz / scale }, halfWidth, halfHeight);
}

/** Slides the picture by a distance in desk metres. */
export function panBy(zoom: Zoom, x: number, z: number, halfWidth: number, halfHeight: number): Zoom {
  return held({ scale: zoom.scale, x: zoom.x + x, z: zoom.z + z }, halfWidth, halfHeight);
}
