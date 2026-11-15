import * as THREE from 'three';
import { blob, type Prop, type PropKit } from './props';

/** How high the bulb sits above the desk, metres. */
export const BULB_HEIGHT = 0.085;

/**
 * A table lamp: a weighted foot, a short brass post and a paper shade round
 * the bulb. It stands free and lights everything about it. Pick it up and put
 * it where the light is wanted; a click that does not carry it off is its switch.
 */
export function createLamp(kit: PropKit): { prop: Prop; glow: THREE.MeshStandardMaterial } {
  const group = new THREE.Group();
  const enamel = new THREE.MeshStandardMaterial({ color: '#1e3a30', roughness: 0.3, metalness: 0.1 });
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.025, 0.006, 56), enamel);
  foot.position.y = 0.003;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.0032, 0.0042, BULB_HEIGHT - 0.012, 20), kit.brass);
  post.position.y = 0.006 + (BULB_HEIGHT - 0.012) / 2;
  // The shade is lit from inside: its colour is the lamp's, turned up and down with it.
  const glow = new THREE.MeshStandardMaterial({ color: '#e9dcc0', emissive: '#ffc98a', emissiveIntensity: 0, roughness: 0.85, side: THREE.DoubleSide });
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.03, 0.044, 64, 1, true), glow);
  shade.position.y = BULB_HEIGHT + 0.004;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.009, 20, 14), glow);
  bulb.position.y = BULB_HEIGHT;
  const rim = (radius: number, y: number) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.0008, 8, 64), kit.brass);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    return ring;
  };
  group.add(foot, post, shade, bulb, rim(0.021, BULB_HEIGHT + 0.026), rim(0.03, BULB_HEIGHT - 0.018));
  // Nothing of the lamp stands in its own light; the soft patch under its foot is its only shadow.
  group.traverse((child) => {
    child.castShadow = false;
  });
  const prop: Prop = {
    name: 'lamp',
    group,
    radius: 0.032,
    pickOffset: 0,
    blob: blob(kit, 0.07, 0.07, 0.6),
    blobSize: [0.07, 0.07],
    solid: { span: [0, 0], radius: 0.025 },
    mass: 14,
    grip: true,
  };
  return { prop, glow };
}
