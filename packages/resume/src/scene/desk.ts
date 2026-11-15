import * as THREE from 'three';

/** One tile of the wood covers this many metres of desk. */
const TILE = 0.55;
const SIZE = 6;

function prepare(texture: THREE.Texture, colour: boolean, anisotropy: number): THREE.Texture {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(SIZE / TILE, SIZE / TILE);
  texture.anisotropy = anisotropy;
  texture.colorSpace = colour ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  return texture;
}

/**
 * The desk: a worn, oiled tabletop. A tiny preview of the wood is shown at
 * once; the full-resolution maps replace it as they arrive.
 */
/**
 * `full` is false where hardly any desk shows, as on a phone: the small wood
 * texture is then all that is fetched. `settled` resolves once the piece is up
 * and running; the large textures wait for it, so they never hold up the start.
 */
export function createDesk(anisotropy: number, onChange: () => void, full: boolean, settled: Promise<void>): { mesh: THREE.Mesh; ready: Promise<void> } {
  // Bitmaps are decoded off the main thread, so handing a large one to the GPU does not stall the page.
  const loader = new THREE.ImageBitmapLoader();
  loader.setOptions({ imageOrientation: 'flipY' });
  const material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.82, metalness: 0 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE), material);
  mesh.rotation.x = -Math.PI / 2;
  // Turn the grain so it runs across the picture, slightly off square.
  mesh.rotation.z = 0.06;
  mesh.receiveShadow = true;

  const load = (url: string, colour: boolean) => loader.loadAsync(url).then((bitmap) => prepare(new THREE.CanvasTexture(bitmap), colour, anisotropy));

  const ready = load('/assets/wood-diff-512.webp', true).then((preview) => {
    material.map = preview;
    material.needsUpdate = true;
    onChange();
  });

  if (!full) return { mesh, ready };

  Promise.all([ready, settled])
    .then(() => Promise.all([load('/assets/wood-diff-4k.webp', true), load('/assets/wood-nor-2k.webp', false), load('/assets/wood-rough-2k.webp', false)]))
    .then(([colour, normal, rough]) => {
      material.map?.dispose();
      material.map = colour;
      material.normalMap = normal;
      material.normalScale.set(0.9, 0.9);
      material.roughnessMap = rough;
      material.roughness = 1;
      material.needsUpdate = true;
      onChange();
    })
    .catch(() => undefined);

  return { mesh, ready };
}
