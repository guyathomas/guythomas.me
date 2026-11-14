import { describe, expect, it } from 'vitest';
import type { GraphiteLayer } from '../sheet/graphite';
import { Marks, touches } from './marks';

function layer() {
  const drawn: number[][] = [];
  const fake = { draw: (...args: number[]) => drawn.push(args), clear: () => (drawn.length = 0) };
  return { drawn, fake: fake as unknown as GraphiteLayer };
}

describe('touches', () => {
  it('finds a line near a point, anywhere along it', () => {
    const line = [0, 0, 0.1, 0, 0.1, 0.1];
    expect(touches(line, 0.05, 0.002, 0.003)).toBe(true);
    expect(touches(line, 0.102, 0.05, 0.003)).toBe(true);
    expect(touches(line, 0.05, 0.05, 0.003)).toBe(false);
    expect(touches([0.02, 0.02], 0.021, 0.02, 0.003)).toBe(true);
  });
});

describe('Marks', () => {
  it('rubs out whole lines under the rubber and redraws the rest', () => {
    const { drawn, fake } = layer();
    const marks = new Marks(fake, 0.0004);
    marks.add({ points: [0, 0, 0.1, 0], tones: [0.8] });
    marks.add({ points: [0, 0.05, 0.05, 0.05, 0.1, 0.05], tones: [0.8, 0.7] });
    expect(marks.rub(0.5, 0.5, 0.003)).toBe(false);
    expect(marks.rub(0.05, 0.001, 0.003)).toBe(true);
    expect(marks.lines).toHaveLength(1);
    expect(drawn).toHaveLength(2);
    expect(drawn[1][5]).toBe(0.7);
  });
});
