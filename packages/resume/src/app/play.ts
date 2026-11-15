import type { Voices } from '../audio/voices';
import { LEVELS } from '../game/levels';
import { MarbleRun } from '../game/run';
import type { SheetHandling } from '../interact/handling';
import type { DeskObjects, Item } from '../interact/objects';
import { ERASER, PENCIL_HALF, PencilTool, type PagePoint } from '../interact/pencil';
import type { SheetBody } from '../sheet/body';
import type { GraphiteLayer } from '../sheet/graphite';
import { Board, BOARD } from './board';
import { Marks } from './marks';
import { ptoLines } from './pto';

export interface PlayDeps {
  sheet: SheetBody;
  handling: SheetHandling;
  objects: DeskObjects;
  pencilItem: Item;
  eraserItem: Item;
  layers: { front: GraphiteLayer; back: GraphiteLayer };
  voices: Voices;
  wake(): void;
  /** False where the window has no desk beside the sheet, as on a phone: "PTO" is then written on the back too. */
  desk: boolean;
  /** Page of the run to open on, counting from 0. */
  firstPage: number;
  /** Turns the sheet over, as a tap on the pencilled "PTO" asks. */
  turnOver(): void;
  /** Every page of the run has been passed. */
  finished(): void;
}

/** Reach of the pencil's rubber end, and of the block eraser, metres. */
const RUBBER = 0.0032;
const BLOCK = 0.0065;

/** Pencil and paper: drawing on either face, and the marble run on the back. */
export function createPlay(deps: PlayDeps) {
  const { sheet, handling, layers, voices } = deps;
  const marks = { front: new Marks(layers.front, PENCIL_HALF), back: new Marks(layers.back, PENCIL_HALF) };
  // The game is played on a letter-sized board whatever the size of the sheet.
  const board = new Board(sheet.width);
  const half = PENCIL_HALF / board.scale;
  const run = new MarbleRun(BOARD.width, BOARD.height, (event, strength) => {
    if (event === 'star' || event === 'won') voices.chime();
    else if (event === 'knock') voices.knock(strength);
    else if (event === 'release' || event === 'lost') voices.tap();
    // A finished page is rubbed clean for the next.
    else if (event === 'next' || event === 'finished') {
      marks.back.clear();
      note(false);
      if (!tool.rubbing) tool.cut();
      if (event === 'finished') deps.finished();
      else open();
      deps.wake();
    }
  }, Math.min(deps.firstPage, LEVELS.length - 1));
  /** The lines on the back that lie on the board, as the game sees them. What is written below it is not the game's. */
  const boardLines = (): number[][] =>
    marks.back.lines.filter((mark) => mark.points.some((value, i) => i % 2 === 1 && value <= board.foot)).map((mark) => board.toGame(mark.points));
  const redraw = () => {
    layers.back.sketch(board.sketchToPage(run.sketch()));
    deps.wake();
  };
  /** Hands the game the lines now on its page. */
  const sync = () => {
    run.setLines(boardLines(), half);
    redraw();
  };
  /** Pencils in the lines a page opens with. They are ordinary lines: they can be rubbed out. */
  function open(): void {
    for (const points of run.starter()) marks.back.put(board.toPage(points), 0.8);
    run.setLines(boardLines(), half);
    layers.back.sketch(board.sketchToPage(run.sketch()));
  }
  // The first page is set out before anything is running, so nothing needs waking.
  open();

  // Without a desk the back is shown only as far as the board and a little more, so its "PTO" is written there.
  const backFoot = deps.desk ? sheet.height : Math.min(sheet.height, board.foot + 0.019);
  /** Pencils "PTO" at the foot of a face. Like any pencil it can be rubbed out; a reset writes it again. */
  function note(front: boolean): void {
    // Without a desk there is no corner within easy reach of a thumb, so the back says the same.
    if (!front && deps.desk) return;
    for (const points of ptoLines(sheet.width, front ? sheet.height : backFoot)) (front ? marks.front : marks.back).put(points, 0.78);
  }
  const boxOf = (height: number) => {
    const noted = ptoLines(sheet.width, height).flat();
    const xs = noted.filter((_, i) => i % 2 === 0);
    const ys = noted.filter((_, i) => i % 2 === 1);
    const pad = 0.005;
    return { x0: Math.min(...xs) - pad, x1: Math.max(...xs) + pad, y0: Math.min(...ys) - pad, y1: Math.max(...ys) + pad };
  };
  const boxes = { front: boxOf(sheet.height), back: boxOf(backFoot) };
  /** True for a page point on the pencilled "PTO". */
  const onNote = (at: PagePoint): boolean => {
    if (!at.front && deps.desk) return false;
    const box = at.front ? boxes.front : boxes.back;
    return at.x > box.x0 && at.x < box.x1 && at.y > box.y0 && at.y < box.y1;
  };
  note(true);
  note(false);

  const launch = (): boolean => {
    if (handling.frontUp || handling.busy || run.phase !== 'ready') return false;
    run.release();
    deps.wake();
    return true;
  };
  /** A press on the page: on the waiting marble, it lets it go. */
  const poke = (at: PagePoint): boolean => {
    if (onNote(at) && !handling.busy) {
      deps.turnOver();
      return true;
    }
    // On a small board the marble is a small thing to hit with a finger: allow 8 mm of page about it.
    const reach = Math.max(0.0102, 0.008 / board.scale);
    return !at.front && run.onMarble(at.x / board.scale, at.y / board.scale, reach) && launch();
  };

  /** Rubs out the lines within `reach` of a page point. */
  const rub = (at: PagePoint, speed: number, reach: number): void => {
    voices.scratch(speed * 0.6);
    if (!(at.front ? marks.front : marks.back).rub(at.x, at.y, reach)) return;
    if (at.front) deps.wake();
    else sync();
  };

  const tool = new PencilTool(deps.pencilItem, deps.objects, sheet, handling, {
    // The front takes scribbling at any time; the game's page only while a page is in play.
    allow: (front) => front || run.phase === 'ready' || run.phase === 'rolling',
    drawn: (front, x0, y0, x1, y1, tone, speed) => {
      (front ? layers.front : layers.back).draw(x0, y0, x1, y1, PENCIL_HALF, tone);
      voices.scratch(speed);
      if (front) return;
      run.spend(Math.hypot(x1 - x0, y1 - y0) / board.scale);
      redraw();
    },
    stroke: (front, points, tones) => {
      voices.scratch(0);
      (front ? marks.front : marks.back).add({ points, tones });
      if (!front) sync();
    },
    rub: (at, speed) => rub(at, speed, RUBBER),
    rest: () => voices.scratch(0),
    poke,
  });

  const eraser = new PencilTool(
    deps.eraserItem,
    deps.objects,
    sheet,
    handling,
    {
      allow: () => false,
      drawn: () => {},
      stroke: () => {},
      rub: (at, speed) => rub(at, speed, BLOCK),
      rest: () => voices.scratch(0),
      poke: () => false,
    },
    ERASER,
  );

  return {
    /** The things that are used in the hand. */
    tools: { pencil: tool, eraser },
    poke,
    launch,
    /** How much of the back, from its head, is worth showing where the sheet is longer than the board. */
    backFoot,
    /** True while the marble is waiting to be let go. */
    get waiting(): boolean {
      return run.phase === 'ready';
    },
    /** Advances the game. The marble only runs while its page is face up and lying still. */
    step(dt: number): boolean {
      if (handling.frontUp || handling.busy || !run.step(dt)) return false;
      layers.back.sketch(board.sketchToPage(run.sketch()));
      return true;
    },
    /** Rubs out every pencil mark and goes back to the first page. */
    reset(): void {
      tool.drop();
      eraser.drop();
      marks.front.clear();
      marks.back.clear();
      run.reset();
      open();
      note(true);
      note(false);
    },
    /** Draws both pencil maps afresh on the next frame. */
    stale(): void {
      layers.front.stale();
      layers.back.stale();
    },
    render(renderer: Parameters<GraphiteLayer['render']>[0]): void {
      layers.front.render(renderer);
      layers.back.render(renderer);
    },
  };
}
