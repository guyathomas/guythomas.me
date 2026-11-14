import { describe, expect, it } from 'vitest';
import type { GraphiteLayer } from '../sheet/graphite';
import { Marks, rubOut } from './marks';

function layer() {
  const drawn: number[][] = [];
  const fake = { draw: (...args: number[]) => drawn.push(args), clear: () => (drawn.length = 0) };
  return { drawn, fake: fake as unknown as GraphiteLayer };
}

describe('rubOut', () => {
  const line = { points: [0, 0, 0.05, 0, 0.1, 0], tones: [0.8, 0.7] };

  it('leaves a line it does not touch exactly as it was', () => {
    expect(rubOut(line, 0.05, 0.02, 0.003)).toEqual([line]);
    expect(rubOut(line, 0.05, 0.02, 0.003)[0]).toBe(line);
  });

  it('takes out only the stretch under the rubber, leaving a piece either side', () => {
    const pieces = rubOut(line, 0.03, 0, 0.005);
    expect(pieces).toHaveLength(2);
    expect(pieces[0].points).toEqual([0, 0, expect.closeTo(0.025, 9), 0]);
    expect(pieces[1].points).toEqual([expect.closeTo(0.035, 9), 0, 0.05, 0, 0.1, 0]);
    expect(pieces[1].tones).toEqual([0.8, 0.7]);
  });

  it('shortens a line rubbed at its end, and removes one rubbed all over', () => {
    const pieces = rubOut(line, 0.1, 0, 0.01);
    expect(pieces).toHaveLength(1);
    expect(pieces[0].points).toEqual([0, 0, 0.05, 0, expect.closeTo(0.09, 9), 0]);
    expect(rubOut(line, 0.05, 0, 0.06)).toEqual([]);
  });

  it('spans the joint between two segments', () => {
    const pieces = rubOut(line, 0.05, 0, 0.004);
    expect(pieces.map((piece) => piece.points)).toEqual([
      [0, 0, expect.closeTo(0.046, 9), 0],
      [expect.closeTo(0.054, 9), 0, 0.1, 0],
    ]);
  });

  it('rubs out a dot', () => {
    const dot = { points: [0.02, 0.02], tones: [] };
    expect(rubOut(dot, 0.021, 0.02, 0.003)).toEqual([]);
    expect(rubOut(dot, 0.03, 0.02, 0.003)).toEqual([dot]);
  });
});

describe('Marks', () => {
  it('redraws what is left and says whether anything went', () => {
    const { drawn, fake } = layer();
    const marks = new Marks(fake, 0.0004);
    marks.add({ points: [0, 0, 0.1, 0], tones: [0.8] });
    marks.add({ points: [0, 0.05, 0.1, 0.05], tones: [0.7] });
    expect(marks.rub(0.5, 0.5, 0.003)).toBe(false);
    expect(marks.rub(0.05, 0, 0.01)).toBe(true);
    expect(marks.lines).toHaveLength(3);
    expect(drawn).toHaveLength(3);
  });
});
