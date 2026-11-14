import * as THREE from 'three';
import { blob, shadowed, type Prop, type PropKit } from './props';

/** A well-used block eraser in a paper sleeve. Dragged across the sheet, it rubs pencil out. */
export function createEraser(kit: PropKit): Prop {
  const length = 0.042;
  const width = 0.018;
  const height = 0.0095;
  const rubber = new THREE.MeshStandardMaterial({ color: '#d98a84', roughness: 0.92 });
  const sleeve = new THREE.MeshStandardMaterial({ color: '#2f4a6b', roughness: 0.7 });
  const group = new THREE.Group();

  const block = new THREE.Mesh(new THREE.BoxGeometry(length, height, width), rubber);
  block.position.y = height / 2;
  // The corners are worn round at the working end.
  const worn = new THREE.Mesh(new THREE.CylinderGeometry(width / 2, width / 2, height, 24), rubber);
  worn.position.set(length / 2, height / 2, 0);
  worn.scale.x = 0.35;
  const band = new THREE.Mesh(new THREE.BoxGeometry(length * 0.52, height + 0.0006, width + 0.0006), sleeve);
  band.position.set(-length * 0.1, height / 2, 0);

  group.add(block, worn, band);
  shadowed(group);
  return {
    name: 'eraser',
    group,
    radius: 0.012,
    pickOffset: 0,
    blob: blob(kit, 0.056, 0.03, 0.55),
    blobSize: [0.056, 0.03],
    solid: { span: [-0.012, 0.012], radius: 0.009 },
    mass: 2,
  };
}
