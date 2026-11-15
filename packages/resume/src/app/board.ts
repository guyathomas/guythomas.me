import type { Sketch } from '../game/sketch';

/** The size of page the marble run is laid out and scored on: a letter sheet, metres. */
export const BOARD = { width: 0.2159, height: 0.2794 };

/** Thinnest a game line is drawn on the page, as half its width in metres, so it survives on a small sheet. */
const THINNEST = 0.0003;

/**
 * The game is always played on a letter-sized board, so that its pages, its
 * physics and its scores are the same everywhere. On a narrower sheet, as on
 * a phone, the board is drawn smaller at the head of the page. This is the
 * map between the two: page metres on one side, board metres on the other.
 */
export class Board {
  /** How much smaller than life the board is drawn. */
  readonly scale: number;

  constructor(sheetWidth: number) {
    this.scale = sheetWidth / BOARD.width;
  }

  /** How far down the page the board reaches, metres. */
  get foot(): number {
    return BOARD.height * this.scale;
  }

  /** A run of x, y pairs on the page, as the game sees it. */
  toGame(points: number[]): number[] {
    return points.map((value) => value / this.scale);
  }

  /** A run of x, y pairs in the game, as it lies on the page. */
  toPage(points: number[]): number[] {
    return points.map((value) => value * this.scale);
  }

  /** What the game draws, as it lies on the page. */
  sketchToPage(sketch: Sketch[]): Sketch[] {
    if (this.scale === 1) return sketch;
    const drawn = sketch.map(({ points, half, tone }) => ({ points: this.toPage(points), half: Math.max(THINNEST, half * this.scale), tone }));
    // A rule under the board, where the page goes on below it.
    drawn.push({ points: [BOARD.width * 0.06 * this.scale, this.foot, BOARD.width * 0.94 * this.scale, this.foot], half: THINNEST, tone: 0.35 });
    return drawn;
  }
}
