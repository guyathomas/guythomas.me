import * as THREE from 'three';
import { blob, type Prop, type PropKit } from './props';

/** Radius of the shade's rim, metres, before any scaling. */
export const SHADE_RADIUS = 0.026;

/**
 * The head of the desk lamp: an enamelled shade with the bulb in it. It is
 * carried on the stand below and turned toward what it lights.
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
  // Shade opens downward along -Y; the whole head is tilted toward what it lights.
  const head = new THREE.Group();
  head.add(shade, lining, cap, button, globe, glow);
  group.add(head);
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) child.castShadow = false;
  });
  return { group, bulb };
}

/** Where the head hangs relative to the foot of the stand: this far along the way the lamp faces, this high. */
export const HEAD_REACH = 0.07;
export const HEAD_HEIGHT = 0.115;
/** How far in front of its foot the lamp throws its light. */
export const THROW = 0.3;

/**
 * The lamp's stand: a weighted foot on the desk, a post and an arm out to the
 * head. It stands free: pick it up by any part and put it where the light is
 * wanted. It turns by itself to face the sheet. The group's x axis is the way it faces.
 */
export function createLampStand(kit: PropKit): Prop {
  const group = new THREE.Group();
  const enamel = new THREE.MeshStandardMaterial({ color: '#1e3a30', roughness: 0.3, metalness: 0.1 });
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.027, 0.006, 56), enamel);
  foot.position.y = 0.003;
  const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.01, 0.006, 24), kit.brass);
  boss.position.y = 0.009;
  const postTop = new THREE.Vector3(-0.012, HEAD_HEIGHT + 0.03, 0);
  const rod = (from: THREE.Vector3, to: THREE.Vector3) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, from.distanceTo(to), 16), kit.brass);
    mesh.position.copy(from).lerp(to, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    return mesh;
  };
  const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 16, 12), kit.brass);
  knuckle.position.copy(postTop);
  group.add(foot, boss, rod(new THREE.Vector3(0, 0.01, 0), postTop), knuckle, rod(postTop, new THREE.Vector3(HEAD_REACH - 0.014, HEAD_HEIGHT + 0.018, 0)));
  // Only the foot throws a shadow: the lamp does not stand in its own light.
  foot.castShadow = foot.receiveShadow = true;
  return {
    name: 'lamp',
    group,
    radius: 0.028,
    pickOffset: 0,
    blob: blob(kit, 0.074, 0.074, 0.6),
    blobSize: [0.074, 0.074],
    solid: { span: [0, 0], radius: 0.026 },
    mass: 14,
    grip: true,
  };
}
