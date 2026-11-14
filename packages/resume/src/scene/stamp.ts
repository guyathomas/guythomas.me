import * as THREE from 'three';
import { blob, shadowed, type Prop, type PropKit } from './props';

/** Size of the mark the stamp leaves, in metres. */
export const STAMP_MARK = { width: 0.046, height: 0.0165 };

/** The paper label on top of the mount, showing what the stamp prints. */
function labelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 736;
  canvas.height = 264;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#e9dfc8';
  ctx.fillRect(0, 0, 736, 264);
  ctx.strokeStyle = ctx.fillStyle = '#8c2212';
  ctx.lineWidth = 7;
  ctx.strokeRect(16, 16, 704, 232);
  ctx.font = '52px "EBG Medium", Georgia, serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  // The handle stands in the middle, so the words sit either side of it.
  ctx.fillText('OK TO', 118, 136);
  ctx.fillText('PRINT', 620, 136);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** A printer's hand stamp: rubber die on a wooden mount, with a turned handle. */
export function createStamp(kit: PropKit): Prop {
  const wood = new THREE.MeshStandardMaterial({ color: '#b98d58', roughness: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: '#2b1a10', roughness: 0.38 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#7d1f12', roughness: 0.9 });
  const group = new THREE.Group();

  const die = new THREE.Mesh(new THREE.BoxGeometry(STAMP_MARK.width + 0.001, 0.0018, STAMP_MARK.height + 0.001), rubber);
  die.position.y = 0.0009;
  const mount = new THREE.Mesh(new THREE.BoxGeometry(STAMP_MARK.width + 0.004, 0.0085, STAMP_MARK.height + 0.004), wood);
  mount.position.y = 0.0018 + 0.00425;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.0062, 0.0068, 0.0026, 40), kit.brass);
  collar.position.y = 0.0103 + 0.0013;
  const profile = [
    [0, 0],
    [0.0052, 0],
    [0.0046, 0.004],
    [0.004, 0.009],
    [0.0052, 0.013],
    [0.0082, 0.0168],
    [0.0094, 0.0212],
    [0.0086, 0.0256],
    [0.0056, 0.0288],
    [0, 0.03],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const handle = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), dark);
  handle.position.y = 0.0129;

  const label = new THREE.Mesh(new THREE.PlaneGeometry(STAMP_MARK.width, STAMP_MARK.height), new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.95 }));
  label.rotation.x = -Math.PI / 2;
  label.position.y = 0.0103 + 0.00012;

  group.add(die, mount, label, collar, handle);
  shadowed(group);
  return {
    name: 'stamp',
    group,
    radius: 0.014,
    pickOffset: 0,
    blob: blob(kit, 0.066, 0.036, 0.6),
    blobSize: [0.066, 0.036],
    solid: { span: [-0.015, 0.015], radius: 0.0105 },
    mass: 6,
    grip: true,
  };
}
