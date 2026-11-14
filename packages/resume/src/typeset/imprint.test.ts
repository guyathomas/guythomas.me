import { describe, expect, it } from 'vitest';
import { liftInk, pressInk } from './imprint';

const sheet = () => {
  const ink = new Uint8Array(6 * 4 * 2);
  ink[(1 * 6 + 2) * 2] = 200; // first ink at (2,1)
  ink[(1 * 6 + 2) * 2 + 1] = 90; // second ink at (2,1)
  return ink;
};

describe('pressInk', () => {
  it('adds the mark to the second ink without thinning what is there', () => {
    const ink = sheet();
    pressInk(ink, 6, 4, new Uint8Array([50, 255, 255, 0]), 2, 2, 2, 1);
    expect(ink[(1 * 6 + 2) * 2 + 1]).toBe(90);
    expect(ink[(1 * 6 + 3) * 2 + 1]).toBe(255);
    expect(ink[(2 * 6 + 2) * 2 + 1]).toBe(255);
    expect(ink[(1 * 6 + 2) * 2]).toBe(200);
  });

  it('clips a mark that hangs over the edge', () => {
    const ink = sheet();
    const mark = new Uint8Array(9).fill(255);
    const imprint = pressInk(ink, 6, 4, mark, 3, 3, 5, 3);
    expect(imprint.width).toBe(1);
    expect(imprint.height).toBe(1);
    expect(ink[(3 * 6 + 5) * 2 + 1]).toBe(255);
    expect(pressInk(ink, 6, 4, mark, 3, 3, 9, 9).width).toBe(0);
  });

  it('lifts off cleanly', () => {
    const ink = sheet();
    const before = ink.slice();
    const imprint = pressInk(ink, 6, 4, new Uint8Array(9).fill(255), 3, 3, -1, 0);
    expect(ink).not.toEqual(before);
    liftInk(ink, 6, imprint);
    expect(ink).toEqual(before);
  });
});
