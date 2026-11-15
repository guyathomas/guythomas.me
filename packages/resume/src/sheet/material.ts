import * as THREE from 'three';
import type { SheetRaster } from '../typeset/raster';

export function createInkTexture(raster: SheetRaster, anisotropy: number): THREE.DataTexture {
  const texture = new THREE.DataTexture(raster.ink, raster.width, raster.height, THREE.RGFormat, THREE.UnsignedByteType);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = anisotropy;
  texture.colorSpace = THREE.NoColorSpace;
  texture.unpackAlignment = 1;
  texture.needsUpdate = true;
  return texture;
}

export interface PaperOptions {
  /** This side's printing. */
  ink: THREE.Texture;
  /** The other side's printing, which shows here as a faint raised bruise. */
  under: THREE.Texture;
  /** Pencil marks made on this side after printing. */
  pencil: THREE.Texture;
  fibre: THREE.Texture;
  /** True for the reverse of the sheet. */
  mirror: boolean;
  /** Physical size of the sheet in metres. */
  size: THREE.Vector2;
  paper: THREE.Color;
  ink1: THREE.Color;
  ink2: THREE.Color;
}

const PARS = /* glsl */ `
uniform sampler2D uInk;
uniform sampler2D uUnder;
uniform sampler2D uFibre;
uniform sampler2D uPencil;
uniform vec2 uInkTexel;
uniform vec2 uUnderTexel;
uniform vec2 uSheet;
uniform vec3 uPaper;
uniform vec3 uInk1;
uniform vec3 uInk2;
uniform float uDeboss;
uniform float uTooth;
uniform float uLod;
uniform float uUnderLod;
uniform float uMirror;

// How hard the forme pressed here: soft-shouldered ink coverage.
float pressAt(vec2 uv) {
  vec2 k = textureLod(uInk, uv, uLod + 2.3).rg;
  return max(k.r, k.g);
}
float bruiseAt(vec2 uv) {
  vec2 k = textureLod(uUnder, vec2(1.0 - uv.x, uv.y), uUnderLod + 2.2).rg;
  return max(k.r, k.g);
}
// Height of the surface in metres: type is pressed in, the reverse side's type stands proud.
float heightAt(vec2 uv) {
  // Heavier type bites deeper: display lines sink further than text lines.
  vec2 mass = textureLod(uInk, uv, uLod + 4.4).rg;
  float bite = mix(0.34, 1.0, smoothstep(0.1, 0.34, max(mass.r, mass.g)));
  return -uDeboss * bite * pressAt(uv) + 0.006 * uDeboss * bruiseAt(uv);
}
`;

const ALBEDO = /* glsl */ `
// The back is read from the other side, so its printing runs the other way across the sheet.
vec2 suv = uMirror > 0.5 ? vec2(1.0 - vNormalMapUv.x, vNormalMapUv.y) : vNormalMapUv;
vec2 inkRaw = texture2D(uInk, suv).rg;
// Keep letter edges crisp under the loupe; leave them alone at reading size.
vec2 texelPos = suv / uInkTexel;
float footprint = max(length(dFdx(texelPos)), length(dFdy(texelPos)));
float halfWidth = 0.5 * clamp(footprint, 0.06, 1.0);
vec2 inkCrisp = smoothstep(0.5 - halfWidth, 0.5 + halfWidth, inkRaw);
// Partly covered pixels are blended in linear light, which thins small type.
// Weighting coverage restores the colour of the printed page, and adds the
// slight gain of ink pressed into paper.
vec2 inkSmall = pow(inkRaw, vec2(0.52));
vec2 ink = mix(inkCrisp, inkSmall, smoothstep(0.55, 1.0, footprint));

vec2 soft = textureLod(uInk, suv, uLod + 2.6).rg;
float cover = max(ink.r, ink.g);
float solid = smoothstep(0.6, 0.97, max(soft.r, soft.g));

vec2 fuv = suv * uSheet / 0.045;
vec3 fib = texture2D(uFibre, fuv).rgb;
vec3 fine = texture2D(uFibre, fuv * 4.3 + 0.37).rgb;

// Ink squash: the film is thickest at the edge of a stroke. In the middle of
// a solid it is thinner, follows the paper's tooth, and misses the odd speck.
float speck = solid * smoothstep(0.975, 0.997, fine.b) * smoothstep(0.45, 0.7, fine.r);
float density = clamp(cover * (1.0 - 0.75 * speck), 0.0, 1.0);
float thin = solid * (0.25 + 1.3 * max(0.0, fine.r - 0.42));

vec3 paperCol = uPaper * (0.955 + 0.1 * (fib.g - 0.5) + 0.1 * (fib.r - 0.5) + 0.05 * (fine.r - 0.5));
// The dent holds a little shadow of its own.
paperCol *= 1.0 - 0.06 * pressAt(suv) * (1.0 - cover);
vec3 inkCol = (uInk1 * ink.r + uInk2 * ink.g) / max(ink.r + ink.g, 1e-4);
inkCol *= 1.0 + 2.2 * thin;
diffuseColor.rgb = mix(paperCol, inkCol, density);
float paperInk = density;
// Pencil sits on the tooth of the paper: broken by the fibres, and a little shiny.
// A line thinner than a pixel is blended in linear light, which thins it to nothing on brightly lit paper;
// weighting its coverage keeps it as dark as it is drawn (as for small type above).
float graphite = clamp(pow(texture2D(uPencil, suv).r, 0.5) * (0.9 + 0.35 * fine.r), 0.0, 1.0);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.07, 0.07, 0.085), graphite * 0.97);
float pencilMark = graphite;
`;

const ROUGHNESS = /* glsl */ `
float roughnessFactor = mix(mix(0.97, 0.9, paperInk) + 0.05 * (fib.r - 0.5), 1.0, graphite);
`;

const NORMAL = /* glsl */ `
{
  float spread = 2.4 * exp2(uLod);
  vec2 du = vec2(uInkTexel.x * spread, 0.0);
  vec2 dv = vec2(0.0, uInkTexel.y * spread);
  vec2 slope = vec2(
    (heightAt(suv + du) - heightAt(suv - du)) / (2.0 * du.x * uSheet.x),
    (heightAt(suv + dv) - heightAt(suv - dv)) / (2.0 * dv.y * uSheet.y)
  );
  if (uMirror > 0.5) slope.x = -slope.x;
  float fe = 1.0 / 1024.0;
  float f0 = texture2D(uFibre, fuv).r;
  slope += uTooth * vec2(texture2D(uFibre, fuv + vec2(fe, 0.0)).r - f0, texture2D(uFibre, fuv + vec2(0.0, fe)).r - f0);
  float g0 = fine.r;
  slope += 0.14 * uTooth * vec2(
    texture2D(uFibre, fuv * 4.3 + 0.37 + vec2(fe, 0.0)).r - g0,
    texture2D(uFibre, fuv * 4.3 + 0.37 + vec2(0.0, fe)).r - g0
  );
  normal = normalize(tbn * normalize(vec3(-slope, 1.0)));
}
`;

let flatNormal: THREE.DataTexture | null = null;
function flatNormalMap(): THREE.DataTexture {
  if (!flatNormal) {
    flatNormal = new THREE.DataTexture(new Uint8Array([128, 128, 255, 255]), 1, 1);
    flatNormal.needsUpdate = true;
  }
  return flatNormal;
}

/** One side of the sheet: cotton paper carrying a pressed, inked impression. */
export function createPaperMaterial(options: PaperOptions): THREE.MeshStandardMaterial {
  const inkImage = options.ink.image as { width: number; height: number };
  const underImage = options.under.image as { width: number; height: number };
  const uniforms = {
    uInk: { value: options.ink },
    uUnder: { value: options.under },
    uFibre: { value: options.fibre },
    uPencil: { value: options.pencil },
    uInkTexel: { value: new THREE.Vector2(1 / inkImage.width, 1 / inkImage.height) },
    uUnderTexel: { value: new THREE.Vector2(1 / underImage.width, 1 / underImage.height) },
    uSheet: { value: options.size },
    uPaper: { value: options.paper },
    uInk1: { value: options.ink1 },
    uInk2: { value: options.ink2 },
    uDeboss: { value: 0.00046 },
    uMirror: { value: options.mirror ? 1 : 0 },
    uTooth: { value: 0.95 },
    // Blur radii are tuned for a 4096-texel-wide sheet; smaller maps sample finer mips.
    uLod: { value: Math.log2((inkImage.width / options.size.x) / (4096 / 0.2159)) },
    uUnderLod: { value: Math.log2((underImage.width / options.size.x) / (4096 / 0.2159)) },
  };

  // The 1x1 normal map is only there to switch on three's tangent frame; the
  // real normal is computed from the impression below.
  const material = new THREE.MeshStandardMaterial({ metalness: 0, roughness: 1, normalMap: flatNormalMap(), envMapIntensity: 0.4 });
  material.userData.uniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <normalmap_pars_fragment>', `#include <normalmap_pars_fragment>\n${PARS}`)
      .replace('#include <map_fragment>', ALBEDO)
      .replace('#include <roughnessmap_fragment>', ROUGHNESS)
      .replace('#include <normal_fragment_maps>', NORMAL)
      // Pencil takes no shine at all: lit paper must not glare through a line.
      .replace('#include <opaque_fragment>', 'outgoingLight = mix(outgoingLight, totalDiffuse + totalEmissiveRadiance, pencilMark);\n#include <opaque_fragment>');
  };
  material.customProgramCacheKey = () => 'paper-2';
  return material;
}
