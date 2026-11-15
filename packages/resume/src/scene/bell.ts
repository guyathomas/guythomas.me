import * as THREE from 'three';
import { blob, shadowed, type Prop, type PropKit } from './props';

/** A brass desk bell. Ring it to turn the desk's sounds on, and again to turn them off. */
export function createBell(kit: PropKit): Prop {
  const group = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: '#2b1a10', roughness: 0.4 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.0145, 0.0155, 0.003, 48), dark);
  base.position.y = 0.0015;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.0135, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), kit.brass);
  dome.scale.y = 0.72;
  dome.position.y = 0.003;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0016, 0.004, 16), kit.brass);
  stem.position.y = 0.0145;
  const button = new THREE.Mesh(new THREE.SphereGeometry(0.0034, 20, 12), dark);
  button.position.y = 0.0175;
  group.add(base, dome, stem, button);
  shadowed(group);
  return {
    name: 'bell',
    group,
    radius: 0.0165,
    pickOffset: 0,
    blob: blob(kit, 0.044, 0.044, 0.6),
    blobSize: [0.044, 0.044],
    solid: { span: [0, 0], radius: 0.0155 },
    mass: 5,
    grip: true,
  };
}
