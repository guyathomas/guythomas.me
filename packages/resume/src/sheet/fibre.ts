import * as THREE from 'three';

/** Small deterministic generator so the paper is the same sheet on every visit. */
function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Draws something at every wrapped position so the texture tiles seamlessly. */
function wrapped(size: number, x: number, y: number, reach: number, draw: (x: number, y: number) => void): void {
  for (const ox of [-size, 0, size]) {
    for (const oy of [-size, 0, size]) {
      const px = x + ox;
      const py = y + oy;
      if (px > -reach && px < size + reach && py > -reach && py < size + reach) draw(px, py);
    }
  }
}

/**
 * Cotton rag paper, as a tiling texture:
 *   R  fibre relief (the tooth that shows in raking light)
 *   G  slow mottling of the furnish
 *   B  fine speckle (for ink that did not quite cover)
 */
export function createFibreTexture(size = 1024, seed = 7): THREE.DataTexture {
  const random = mulberry(seed);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // Relief: thousands of short, slightly curved fibres, some proud, some sunk.
  ctx.fillStyle = 'rgb(128,128,128)';
  ctx.fillRect(0, 0, size, size);
  ctx.lineCap = 'round';
  for (let i = 0; i < 9000; i++) {
    const x = random() * size;
    const y = random() * size;
    const angle = random() * Math.PI * 2;
    const length = 10 + random() * random() * 110;
    const bend = (random() - 0.5) * 1.4;
    const proud = random() > 0.42;
    const tone = proud ? 150 + random() * 105 : random() * 105;
    ctx.strokeStyle = `rgba(${tone},${tone},${tone},${0.05 + random() * 0.22})`;
    ctx.lineWidth = 0.5 + random() * random() * 2.4;
    wrapped(size, x, y, length, (px, py) => {
      const ex = px + Math.cos(angle) * length;
      const ey = py + Math.sin(angle) * length;
      const mx = (px + ex) / 2 + Math.cos(angle + Math.PI / 2) * length * bend * 0.25;
      const my = (py + ey) / 2 + Math.sin(angle + Math.PI / 2) * length * bend * 0.25;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();
    });
  }
  const relief = ctx.getImageData(0, 0, size, size).data;

  // Mottle: big soft clouds.
  ctx.fillStyle = 'rgb(128,128,128)';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 260; i++) {
    const x = random() * size;
    const y = random() * size;
    const radius = 30 + random() * 170;
    const tone = random() > 0.5 ? 255 : 0;
    wrapped(size, x, y, radius, (px, py) => {
      const cloud = ctx.createRadialGradient(px, py, 0, px, py, radius);
      cloud.addColorStop(0, `rgba(${tone},${tone},${tone},${0.03 + random() * 0.05})`);
      cloud.addColorStop(1, `rgba(${tone},${tone},${tone},0)`);
      ctx.fillStyle = cloud;
      ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
    });
  }
  const mottle = ctx.getImageData(0, 0, size, size).data;

  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = relief[i * 4];
    data[i * 4 + 1] = mottle[i * 4];
    data[i * 4 + 2] = Math.floor(random() * 256);
    data[i * 4 + 3] = 255;
  }
  canvas.width = canvas.height = 0;

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
