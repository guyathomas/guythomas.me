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
});
