import { describe, expect, it } from 'vitest';
import { ptoLines } from './pto';

describe('ptoLines', () => {
  it.each([
    [0.2159, 0.2794],
    [0.098, 0.2],
  ])('writes in the foot margin of a %f m wide sheet, inside the page', (width, height) => {
    const lines = ptoLines(width, height);
    expect(lines.length).toBeGreaterThanOrEqual(7);
    for (const points of lines) {
      for (let i = 0; i < points.length; i += 2) {
        expect(points[i]).toBeGreaterThan(width * 0.5);
        expect(points[i]).toBeLessThan(width - 0.005);
        expect(points[i + 1]).toBeGreaterThan(height - 0.02);
        expect(points[i + 1]).toBeLessThan(height - 0.008);
      }
    }
  });

  it('keeps its size on a narrow sheet, rather than shrinking past reading', () => {
    const tall = (width: number) => {
      const ys = ptoLines(width, 0.3).flatMap((points) => points.filter((_, i) => i % 2 === 1));
      return Math.max(...ys) - Math.min(...ys);
    };
    expect(tall(0.098)).toBeGreaterThan(0.004);
    expect(tall(0.098)).toBeCloseTo(tall(0.2159), 3);
  });
});
