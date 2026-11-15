import { describe, expect, it } from 'vitest';
import { Board, BOARD } from './board';

describe('Board', () => {
  it('is life size on a letter sheet', () => {
    const board = new Board(BOARD.width);
    expect(board.scale).toBe(1);
    const sketch = [{ points: [0.1, 0.2], half: 0.0004, tone: 1 }];
    expect(board.sketchToPage(sketch)).toBe(sketch);
  });

  it('draws the board smaller on a narrow slip, and reads the page back at full size', () => {
    const board = new Board(0.098);
    expect(board.foot).toBeCloseTo(0.2794 * (0.098 / 0.2159), 9);
    const onPage = [0.049, 0.06, 0.098, 0.1];
    const inGame = board.toGame(onPage);
    expect(inGame[2]).toBeCloseTo(BOARD.width, 9);
    expect(board.toPage(inGame)).toEqual(onPage.map((v) => expect.closeTo(v, 9)));
  });

  it('keeps lines thick enough to see, and rules off the foot of the board', () => {
    const board = new Board(0.098);
    const drawn = board.sketchToPage([{ points: [0, 0, 0.2, 0.2], half: 0.0004, tone: 1 }]);
    expect(drawn[0].half).toBeGreaterThanOrEqual(0.0003);
    expect(drawn).toHaveLength(2);
    expect(drawn[1].points[1]).toBeCloseTo(board.foot, 9);
  });
});
