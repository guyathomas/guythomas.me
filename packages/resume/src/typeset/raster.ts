import { splitPieces } from './pieces';

export interface LinkRegion {
  href: string;
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

export interface SheetRaster {
  /** Two channels per pixel: coverage of the first ink, coverage of the second. */
  ink: Uint8Array;
  width: number;
  height: number;
  /** Size of the laid-out sheet in sheet px. */
  sheetWidth: number;
  sheetHeight: number;
  links: LinkRegion[];
}

/** How far the second colour sits out of register with the first, in sheet px. */
const MISREGISTER = { x: 0.32, y: -0.22 };

const FAMILIES = ['EBG Text', 'EBG Italic', 'EBG SC', 'EBG Medium'];

export async function fontsReady(): Promise<void> {
  await Promise.all(FAMILIES.map((family) => document.fonts.load(`16px "${family}"`)));
  await document.fonts.ready;
}

function inkOf(el: Element): 1 | 2 {
  return el.closest('[data-ink]')?.getAttribute('data-ink') === '2' ? 2 : 1;
}

/**
 * Prints the sheet. The browser has already set the type (line breaks,
 * kerning, tracking); this reads where every word landed and draws the same
 * words at the same places into a high-resolution ink map.
 */
export function rasterizeSheet(source: HTMLElement, maxWidth: number, maxHeight: number): SheetRaster {
  // Lay out an unscaled copy off screen so measurements are in sheet px.
  const host = document.createElement('div');
  host.style.cssText = 'position:absolute;left:-20000px;top:0;pointer-events:none';
  host.setAttribute('aria-hidden', 'true');
  const sheet = source.cloneNode(true) as HTMLElement;
  sheet.removeAttribute('id');
  sheet.style.zoom = '1';
  host.appendChild(sheet);
  document.body.appendChild(host);

  const box = sheet.getBoundingClientRect();
  const scale = Math.min(maxWidth / box.width, maxHeight / box.height);
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';
  ctx.textBaseline = 'alphabetic';

  const paint = (ink: 1 | 2) => {
    ctx.fillStyle = ink === 2 ? '#00ff00' : '#ff0000';
    const dx = ink === 2 ? MISREGISTER.x : 0;
    const dy = ink === 2 ? MISREGISTER.y : 0;
    ctx.setTransform(scale, 0, 0, scale, (dx - box.left) * scale, (dy - box.top) * scale);
  };

  for (const rule of sheet.querySelectorAll<HTMLElement>('[data-rule]')) {
    const r = rule.getBoundingClientRect();
    if (r.width === 0) continue;
    paint(inkOf(rule));
    const thickness = Math.max(r.height, 0.7);
    ctx.fillRect(r.left, r.top + r.height / 2 - thickness / 2, r.width, thickness);
  }

  const range = document.createRange();
  const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const parent = node.parentElement;
    if (!parent || !node.data.trim()) continue;
    const style = getComputedStyle(parent);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const tracking = parseFloat(style.letterSpacing) || 0;
    const upper = style.textTransform === 'uppercase';
    ctx.font = `${style.fontSize} ${style.fontFamily}`;
    const descent = ctx.measureText('x').fontBoundingBoxDescent;
    paint(inkOf(parent));
    for (const piece of splitPieces(node.data, tracking !== 0)) {
      range.setStart(node, piece.start);
      range.setEnd(node, piece.end);
      const rect = Array.from(range.getClientRects()).find((r) => r.width > 0 && r.height > 0);
      if (!rect) continue;
      const word = node.data.slice(piece.start, piece.end);
      ctx.fillText(upper ? word.toUpperCase() : word, rect.left, rect.bottom - descent);
    }
  }

  const links: LinkRegion[] = Array.from(sheet.querySelectorAll<HTMLAnchorElement>('a[href]')).map((a) => {
    const r = a.getBoundingClientRect();
    const pad = 3;
    return {
      href: a.href,
      u0: (r.left - pad - box.left) / box.width,
      v0: (r.top - pad - box.top) / box.height,
      u1: (r.right + pad - box.left) / box.width,
      v1: (r.bottom + pad - box.top) / box.height,
    };
  });

  const rgba = ctx.getImageData(0, 0, width, height).data;
  const ink = new Uint8Array(width * height * 2);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 2) {
    ink[j] = rgba[i];
    ink[j + 1] = rgba[i + 1];
  }
  host.remove();
  canvas.width = canvas.height = 0;

  return { ink, width, height, sheetWidth: box.width, sheetHeight: box.height, links };
}

export function linkAt(links: LinkRegion[], u: number, v: number): LinkRegion | undefined {
  return links.find((l) => u >= l.u0 && u <= l.u1 && v >= l.v0 && v <= l.v1);
}
