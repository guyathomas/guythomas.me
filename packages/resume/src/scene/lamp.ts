import * as THREE from 'three';

/** Radius of the shade's rim, metres, before any scaling. */
export const SHADE_RADIUS = 0.034;

/**
 * The desk lamp: an enamelled shade on a brass arm that leans in from the
 * corner of the picture. Its head is the switch.
 */
export function createLampHead(): { group: THREE.Group; bulb: THREE.MeshStandardMaterial } {
  const group = new THREE.Group();
  const enamel = new THREE.MeshStandardMaterial({ color: '#1e3a30', roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const inside = new THREE.MeshStandardMaterial({ color: '#f1ece0', roughness: 0.6, side: THREE.BackSide });
  const brass = new THREE.MeshStandardMaterial({ color: '#b8924f', metalness: 1, roughness: 0.35 });
  const k = SHADE_RADIUS / 0.054;
  const profile = [
    [0.014, 0.07],
    [0.019, 0.064],
    [0.03, 0.04],
    [0.052, 0.006],
    [0.054, 0],
  ].map(([r, y]) => new THREE.Vector2(r * k, y * k));
  const shade = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), enamel);
  const lining = new THREE.Mesh(new THREE.LatheGeometry(profile.map((p) => new THREE.Vector2(p.x - 0.0006, p.y)), 64), inside);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.011 * k, 0.014 * k, 0.02 * k, 32), brass);
  cap.position.y = 0.08 * k;
  // The switch: a small brass button on the crown.
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.004 * k, 0.004 * k, 0.008 * k, 20), brass);
  button.position.y = 0.094 * k;
  const bulb = new THREE.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffcf8f', emissiveIntensity: 0, roughness: 0.4 });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.017 * k, 24, 16), bulb);
  globe.position.y = 0.03 * k;
  // A ring of light that shows at the rim when the lamp is lit, so it reads as on from above.
  const glow = new THREE.Mesh(new THREE.RingGeometry(SHADE_RADIUS * 0.985, SHADE_RADIUS * 1.06, 64), bulb);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.0004;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.9, 16), brass);
  // Shade opens downward along -Y; the whole head is tilted toward what it lights.
  const head = new THREE.Group();
  head.add(shade, lining, cap, button, globe, glow);
  group.add(head, arm);
  // The arm runs on back from the crown, so it leaves the picture the way the head leans.
  arm.position.y = 0.09 * k + 0.45;
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) child.castShadow = false;
  });
  return { group, bulb };
}
