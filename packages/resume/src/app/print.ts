import * as THREE from 'three';
import { METRES_PER_SHEET_PX } from '../scene/view';
import { SheetBody } from '../sheet/body';
import { createFibreTexture } from '../sheet/fibre';
import { createInkTexture, createPaperMaterial } from '../sheet/material';
import { rasterizeSheet, type LinkRegion } from '../typeset/raster';

export interface Printed {
  sheet: SheetBody;
  frontLinks: LinkRegion[];
  /** Width of the laid-out sheet in sheet px. */
  sheetWidthPx: number;
  /** The ink maps, kept so that marks can be added after printing. */
  inks: { front: THREE.DataTexture; back: THREE.DataTexture };
}

const PAPER = '#f3eee3';
const INK = '#14110e';
const SECOND_INK = '#8c2212';
const THICKNESS = 0.0009;

/** Sets both sides of the sheet in type and presses them into paper. */
export function printSheet(renderer: THREE.WebGLRenderer, front: HTMLElement, back: HTMLElement, narrow: boolean): Printed {
  const limit = renderer.capabilities.maxTextureSize;
  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  // Phones get a narrower slip, so fewer texels still resolve the type.
  const frontRaster = rasterizeSheet(front, Math.min(narrow ? 1536 : 4096, limit), Math.min(8192, limit));
  const backRaster = rasterizeSheet(back, Math.min(narrow ? 1024 : 2048, limit), Math.min(4096, limit));

  const size = new THREE.Vector2(frontRaster.sheetWidth * METRES_PER_SHEET_PX, frontRaster.sheetHeight * METRES_PER_SHEET_PX);
  const frontInk = createInkTexture(frontRaster, anisotropy);
  const backInk = createInkTexture(backRaster, anisotropy);
  const shared = {
    fibre: createFibreTexture(),
    size,
    paper: new THREE.Color(PAPER),
    ink1: new THREE.Color(INK),
    ink2: new THREE.Color(SECOND_INK),
  };
  const sheet = new SheetBody(
    size.x,
    size.y,
    THICKNESS,
    createPaperMaterial({ ink: frontInk, under: backInk, mirror: false, ...shared }),
    createPaperMaterial({ ink: backInk, under: frontInk, mirror: true, ...shared }),
    new THREE.MeshStandardMaterial({ color: '#e6dcc7', roughness: 1, flatShading: true, side: THREE.DoubleSide }),
  );
  return { sheet, frontLinks: frontRaster.links, sheetWidthPx: frontRaster.sheetWidth, inks: { front: frontInk, back: backInk } };
}
