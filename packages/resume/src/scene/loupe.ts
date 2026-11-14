import * as THREE from 'three';
import { type Prop, type PropKit } from './props';

const LENS_RADIUS = 0.0268;
const MAGNIFICATION = 2.6;

const LENS_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

/** What you see through the glass: the desk below, enlarged, bending toward the rim. */
const LENS_FRAGMENT = /* glsl */ `
uniform sampler2D tView;
varying vec2 vUv;
vec3 through(vec2 centred, float scale) {
  float r2 = dot(centred, centred) * 4.0;
  vec2 bent = centred * (1.0 - 0.16 * r2) * scale;
  return texture2D(tView, bent + 0.5).rgb;
}
void main() {
  vec2 centred = vUv - 0.5;
  float r = length(centred) * 2.0;
  vec3 colour = vec3(through(centred, 1.006).r, through(centred, 1.0).g, through(centred, 0.994).b);
  colour *= 1.0 - 0.42 * smoothstep(0.78, 1.0, r);
  gl_FragColor = vec4(colour, 1.0);
}`;

export interface Loupe extends Prop {
  /** Renders the magnified view. Call before the main pass whenever the loupe is in use. */
  renderView(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void;
  /** Keeps the glass itself from rotating with the handle. */
  sync(): void;
}

/** A brass reading glass with an ebonised handle. Shows a true enlarged view of what lies under it. */
export function createLoupe(kit: PropKit, blobFor: (w: number, d: number, o: number) => THREE.Mesh): Loupe {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.LatheGeometry(
      [
        [0.0268, 0.0004],
        [0.0308, 0.0004],
        [0.0318, 0.0016],
        [0.0318, 0.0068],
        [0.0308, 0.0082],
        [0.0276, 0.0082],
        [0.0268, 0.0072],
        [0.0268, 0.0004],
      ].map(([r, y]) => new THREE.Vector2(r, y)),
      96,
    ),
    kit.brass,
  );
  const ebony = new THREE.MeshStandardMaterial({ color: '#16110d', roughness: 0.36, metalness: 0 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0064, 0.082, 28), ebony);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0.0318 + 0.016 + 0.041, 0.0064, 0);
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0044, 0.017, 28), kit.brass);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.set(0.0318 + 0.0078, 0.0058, 0);
  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.0064, 24, 16), ebony);
  pommel.position.set(0.0318 + 0.016 + 0.082, 0.0064, 0);
  group.add(ring, handle, ferrule, pommel);

  const target = new THREE.WebGLRenderTarget(1024, 1024, { type: THREE.HalfFloatType, depthBuffer: true });
  const half = LENS_RADIUS / MAGNIFICATION;
  const camera = new THREE.OrthographicCamera(-half, half, half, -half, 0.01, 3);
  camera.up.set(0, 0, -1);

  const lens = new THREE.Mesh(
    new THREE.CircleGeometry(LENS_RADIUS, 96),
    new THREE.ShaderMaterial({ uniforms: { tView: { value: target.texture } }, vertexShader: LENS_VERTEX, fragmentShader: LENS_FRAGMENT }),
  );
  lens.rotation.x = -Math.PI / 2;
  // The glass's own reflections of the room, laid over the view.
  const glint = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 48, 16, 0, Math.PI * 2, 0, Math.asin(LENS_RADIUS / 0.09)),
    new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.03, metalness: 0, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, envMapIntensity: 0.5 }),
  );
  const glass = new THREE.Group();
  glass.add(lens, glint);
  glint.position.y = -0.09 + 0.0012 + (0.09 - Math.sqrt(0.09 * 0.09 - LENS_RADIUS * LENS_RADIUS));

  for (const part of [ring, handle, ferrule, pommel]) {
    part.castShadow = true;
    part.receiveShadow = true;
  }
  // The glass is kept out of its own magnified view. The ring and handle lie
  // outside that view anyway, and must stay on the default layer to cast shadows.
  glass.traverse((child) => child.layers.set(1));

  // The loupe's own contact shadow must not darken what is seen through it.
  const shade = blobFor(0.076, 0.076, 0.42);
  shade.layers.set(1);

  const loupe: Loupe = {
    name: 'loupe',
    group,
    radius: 0.034,
    pickOffset: 0,
    blob: shade,
    blobSize: [0.076, 0.076],
    renderView(renderer, scene) {
      camera.position.set(group.position.x, 1, group.position.z);
      camera.lookAt(group.position.x, 0, group.position.z);
      const previous = renderer.getRenderTarget();
      renderer.setRenderTarget(target);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(previous);
    },
    sync() {
      glass.position.set(group.position.x, group.position.y + 0.0046, group.position.z);
    },
  };
  group.userData.glass = glass;
  return loupe;
}
