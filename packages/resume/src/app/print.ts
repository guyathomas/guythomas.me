import * as THREE from 'three';
import { METRES_PER_SHEET_PX } from '../scene/view';
import { SheetBody } from '../sheet/body';
import { createFibreTexture } from '../sheet/fibre';
import { GraphiteLayer } from '../sheet/graphite';
import { createInkTexture, createPaperMaterial } from '../sheet/material';
import { rasterizeSheet, type LinkRegion } from '../typeset/raster';

export interface Printed {
  sheet: SheetBody;
  frontLinks: LinkRegion[];
  /** Width of the laid-out sheet in sheet px. */
  sheetWidthPx: number;
  /** The ink maps, kept so that marks can be added after printing. */
  inks: { front: THREE.DataTexture; back: THREE.DataTexture };
  /** Pencil on each face. */
  pencil: { front: GraphiteLayer; back: GraphiteLayer };
}

const PAPER = '#f3eee3';
const INK = '#14110e';
const SECOND_INK = '#8c2212';
const THICKNESS = 0.0009;

/** Sets both sides of the sheet in type and presses them into paper. */
export function printSheet(renderer: THREE.WebGLRenderer, front: HTMLElement, back: HTMLElement, narrow: boolean): Printed {
  const limit = renderer.capabilities.maxTextureSize;
  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  // As many texels as the screen can show with the sheet at reading size under the loupe, and no more: a
  // full-size map is 60 MB of memory that a small or low-density window never resolves.
  const shownPx = front.getBoundingClientRect().width * (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--read')) || 1);
  const wanted = Math.ceil((shownPx * Math.min(window.devicePixelRatio || 1, 3) * 1.6) / 256) * 256;
  const frontRaster = rasterizeSheet(front, Math.min(Math.max(narrow ? 1536 : 2048, Math.min(4096, wanted)), limit), Math.min(8192, limit));
  // Both faces are the same piece of paper: the back is as tall as the front turned out.
  back.style.minHeight = `${frontRaster.sheetHeight}px`;
  const backRaster = rasterizeSheet(back, Math.min(narrow ? 1024 : 2048, limit), Math.min(4096, limit));

  const size = new THREE.Vector2(frontRaster.sheetWidth * METRES_PER_SHEET_PX, frontRaster.sheetHeight * METRES_PER_SHEET_PX);
  const frontInk = createInkTexture(frontRaster, anisotropy);
  const backInk = createInkTexture(backRaster, anisotropy);
  const pencil = {
    front: new GraphiteLayer(size.x, size.y, Math.min(narrow ? 1024 : 2048, limit), anisotropy),
    back: new GraphiteLayer(size.x, size.y, Math.min(narrow ? 1024 : 2048, limit), anisotropy),
  };
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
    createPaperMaterial({ ink: frontInk, under: backInk, pencil: pencil.front.texture, mirror: false, ...shared }),
    createPaperMaterial({ ink: backInk, under: frontInk, pencil: pencil.back.texture, mirror: true, ...shared }),
    new THREE.MeshStandardMaterial({ color: '#e6dcc7', roughness: 1, flatShading: true, side: THREE.DoubleSide }),
  );
  return { sheet, frontLinks: frontRaster.links, sheetWidthPx: frontRaster.sheetWidth, inks: { front: frontInk, back: backInk }, pencil };
}
