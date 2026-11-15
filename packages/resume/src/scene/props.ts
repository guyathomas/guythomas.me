import * as THREE from 'three';

export interface Prop {
  name: 'stamp' | 'loupe' | 'pencil' | 'eraser' | 'bell' | 'lamp';
  group: THREE.Group;
  /** Reach of the object on the desk, for picking. */
  radius: number;
  /** Offset of the pick centre from the group origin, in the group's own axes. */
  pickOffset: number;
  blob: THREE.Mesh;
  blobSize: [number, number];
  /** The part that other things bump into: a capsule along the object's length. */
  solid: { span: [number, number]; radius: number };
  /** Relative weight, for what gives way in a collision. */
  mass: number;
  /** Stays where it is put rather than sliding on when thrown. */
  grip?: boolean;
  /** Present on round things: turns the object to show it has rolled this far across its axis. */
  roll?(distance: number): void;
  /** Present on things that are used in the hand: holds the object with its working end at a desk point. */
  hold?(x: number, z: number, touching: boolean, flipped: boolean): void;
}

/** Fine turning marks for lathed metal: stripes that run round the part. */
function turnedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  let seed = 5;
  const random = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  for (let y = 0; y < 512; y++) {
    const tone = 150 + random() * 80 + (random() > 0.97 ? -70 : 0);
    ctx.fillStyle = `rgb(${tone},${tone},${tone})`;
    ctx.fillRect(0, y, 4, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 3);
  return texture;
}

function softBlob(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const shade = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  shade.addColorStop(0, 'rgba(0,0,0,1)');
  shade.addColorStop(0.55, 'rgba(0,0,0,0.75)');
  shade.addColorStop(0.8, 'rgba(0,0,0,0.25)');
  shade.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export interface PropKit {
  brass: THREE.MeshStandardMaterial;
  blobTexture: THREE.Texture;
}

export function createKit(): PropKit {
  const turned = turnedTexture();
  const brass = new THREE.MeshStandardMaterial({
    color: '#c79f55',
    metalness: 1,
    roughness: 0.34,
    roughnessMap: turned,
    bumpMap: turned,
    bumpScale: 0.35,
  });
  return { brass, blobTexture: softBlob() };
}

export function blob(kit: PropKit, width: number, depth: number, opacity: number): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: kit.blobTexture, color: 0x000000, transparent: true, opacity, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.scale.set(width, depth, 1);
  mesh.renderOrder = 2;
  return mesh;
}

export function shadowed<T extends THREE.Object3D>(object: T): T {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return object;
}

/** How the pencil sits in the hand: turned to point up and to the left, and tipped onto its point. */
const HELD_TURN = 2.2;
const HELD_TILT = 0.62;

/** A used drawing pencil: hexagonal, dark green lacquer, sharpened by knife. */
export function createPencil(kit: PropKit): Prop {
  const length = 0.128;
  const radius = 0.0037;
  const lacquer = new THREE.MeshStandardMaterial({ color: '#1d3b2c', roughness: 0.32, metalness: 0 });
  const wood = new THREE.MeshStandardMaterial({ color: '#d7b27f', roughness: 0.85 });
  const graphite = new THREE.MeshStandardMaterial({ color: '#2a2a2d', roughness: 0.42, metalness: 0.35 });
  const group = new THREE.Group();
  const inner = new THREE.Group();

  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 6), lacquer);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.0011, radius * 0.96, 0.016, 18), wood);
  cone.position.y = length / 2 + 0.008;
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.00015, 0.0011, 0.0046, 12), graphite);
  tip.position.y = length / 2 + 0.016 + 0.0023;
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, 0.007, 24), kit.brass);
  ferrule.position.y = -length / 2 - 0.0035;
  const rubber = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.92, radius * 0.86, 0.006, 24), new THREE.MeshStandardMaterial({ color: '#c9706a', roughness: 0.95 }));
  rubber.position.y = -length / 2 - 0.01;
  inner.add(body, cone, tip, ferrule, rubber);
  // Lay it along the group's x axis, point forward, resting on one flat of the hexagon.
  inner.rotation.z = -Math.PI / 2;
  const shadow = blob(kit, 0.15, 0.014, 0.5);
  const roller = new THREE.Group();
  roller.position.y = radius * Math.cos(Math.PI / 6);
  roller.add(inner);
  group.add(roller);
  shadowed(group);
  return {
    name: 'pencil',
    group,
    radius: 0.012,
    pickOffset: 0,
    blob: shadow,
    blobSize: [0.16, 0.014],
    solid: { span: [-0.077, 0.084], radius: 0.004 },
    mass: 1,
    roll: (distance) => {
      roller.rotation.x = distance / radius;
    },
    hold: (x, z, touching, flipped) => {
      // Held as a right hand holds it: working end down on the paper, the rest leaning back toward the wrist.
      // Turned end for end, the rubber is the working end.
      group.rotation.set(0, 0, 0);
      group.quaternion.setFromEuler(new THREE.Euler(0, flipped ? HELD_TURN + Math.PI : HELD_TURN, flipped ? HELD_TILT : -HELD_TILT, 'YXZ'));
      const end = flipped ? -length / 2 - 0.013 : length / 2 + 0.0206;
      const point = new THREE.Vector3(end, roller.position.y, 0).applyQuaternion(group.quaternion);
      group.position.set(x - point.x, (touching ? 0.0012 : 0.0045) - point.y, z - point.z);
      shadow.visible = false;
    },
  };
}

/** Places a prop on the desk and keeps its contact shadow under it. */
export function placeProp(prop: Prop, x: number, z: number, angle: number, lift = 0): void {
  prop.group.position.set(x, lift, z);
  prop.group.rotation.set(0, angle, 0);
  prop.blob.visible = prop.group.visible;
  prop.blob.position.set(x, 0.0013, z);
  prop.blob.rotation.z = angle;
  const spread = 1 + lift * 28;
  prop.blob.scale.set(prop.blobSize[0] * spread, prop.blobSize[1] * spread, 1);
  (prop.blob.material as THREE.MeshBasicMaterial).opacity = 0.6 / (1 + lift * 90);
}
