export interface StampMark {
  /** Ink coverage, one byte per pixel. */
  coverage: Uint8Array;
  width: number;
  height: number;
}

const MONTHS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii'];

/** The date as a printer would stamp it: day, month in roman numerals, year. */
export function stampDate(when: Date): string {
  return `${when.getDate()} · ${MONTHS[when.getMonth()]} · ${when.getFullYear()}`;
}

/**
 * Draws the "OK to print" stamp as it lands on the sheet: turned by `angle`
 * (radians, clockwise in sheet px) and unevenly inked, as a hand stamp is.
 */
export function drawStampMark(markWidth: number, markHeight: number, angle: number, when: Date): StampMark {
  const size = Math.ceil(Math.hypot(markWidth, markHeight)) + 4;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size / 2, size / 2);
  ctx.rotate(angle);
  ctx.strokeStyle = ctx.fillStyle = '#fff';
  const unit = markHeight / 16.5;

  const frame = (inset: number, line: number) => {
    ctx.lineWidth = line;
    ctx.beginPath();
    ctx.roundRect(-markWidth / 2 + inset, -markHeight / 2 + inset, markWidth - inset * 2, markHeight - inset * 2, unit * 1.6 - inset * 0.5);
    ctx.stroke();
  };
  frame(unit * 0.5, unit * 0.9);
  frame(unit * 1.75, unit * 0.3);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  ctx.font = `${unit * 6.4}px "EBG Medium", Georgia, serif`;
  spaced.letterSpacing = `${unit * 0.75}px`;
  ctx.fillText('OK TO PRINT', unit * 0.38, unit * 1.3);
  ctx.font = `${unit * 3.3}px "EBG SC", Georgia, serif`;
  spaced.letterSpacing = `${unit * 0.45}px`;
  ctx.fillText(`passed for press · ${stampDate(when)}`, unit * 0.22, unit * 5.6);

  const rgba = ctx.getImageData(0, 0, size, size).data;
  canvas.width = canvas.height = 0;
  const coverage = new Uint8Array(size * size);
  // Uneven pressure across the die, and specks where the rubber missed the paper.
  let seed = (when.getTime() % 2147483646) + 1;
  const random = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  const cell = Math.max(2, Math.round(unit * 0.22));
  const cells = Math.ceil(size / cell);
  const grain = new Float32Array(cells * cells);
  for (let i = 0; i < grain.length; i++) grain[i] = random() > 0.86 ? 0.35 : 1;
  const tiltX = random() - 0.5;
  const tiltY = random() - 0.5;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pressure = 0.86 + 0.28 * (tiltX * (x / size - 0.5) + tiltY * (y / size - 0.5)) + 0.1 * Math.sin(x / (unit * 5) + tiltX * 9) * Math.sin(y / (unit * 4) + tiltY * 9);
      const value = rgba[(y * size + x) * 4] * Math.min(1, pressure) * grain[Math.floor(y / cell) * cells + Math.floor(x / cell)];
      coverage[y * size + x] = Math.round(value);
    }
  }
  return { coverage, width: size, height: size };
}
