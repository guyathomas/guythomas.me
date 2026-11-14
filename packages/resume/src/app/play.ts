import type { Voices } from '../audio/voices';
import { LEVELS } from '../game/levels';
import { MarbleRun } from '../game/run';
import type { SheetHandling } from '../interact/handling';
import type { DeskObjects, Item } from '../interact/objects';
import { ERASER, PENCIL_HALF, PencilTool, type PagePoint } from '../interact/pencil';
import type { SheetBody } from '../sheet/body';
import type { GraphiteLayer } from '../sheet/graphite';
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
  /** False where there is no pencil to play with, as on a phone: the back stays as printed. */
  game: boolean;
  /** Page of the run to open on, counting from 0. */
  firstPage: number;
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
  const run = new MarbleRun(sheet.width, sheet.height, (event, strength) => {
    if (event === 'star' || event === 'won') voices.chime();
    else if (event === 'knock') voices.knock(strength);
    else if (event === 'release' || event === 'lost') voices.tap();
    // A finished page is rubbed clean for the next.
    else if (event === 'next' || event === 'finished') {
      marks.back.clear();
      if (!tool.rubbing) tool.cut();
      if (event === 'finished') deps.finished();
      else open();
      deps.wake();
    }
  }, Math.min(deps.firstPage, LEVELS.length - 1));
  const redraw = () => {
    layers.back.sketch(run.sketch());
    deps.wake();
  };
  /** Hands the game the lines now on its page. */
  const sync = () => {
    run.setLines(marks.back.lines.map((mark) => mark.points), PENCIL_HALF);
    redraw();
  };
  /** Pencils in the lines a page opens with. They are ordinary lines: they can be rubbed out. */
  function open(): void {
    if (!deps.game) return;
    for (const points of run.starter()) marks.back.put(points, 0.8);
    run.setLines(marks.back.lines.map((mark) => mark.points), PENCIL_HALF);
    layers.back.sketch(run.sketch());
  }
  // The first page is set out before anything is running, so nothing needs waking.
  open();

  /** Pencils "PTO" at the foot of the front. Like any pencil it can be rubbed out; a reset writes it again. */
  function note(): void {
    for (const points of ptoLines(sheet.width, sheet.height)) marks.front.put(points, 0.78);
  }
  note();

  const launch = (): boolean => {
    if (!deps.game || handling.frontUp || handling.busy || run.phase !== 'ready') return false;
    run.release();
    deps.wake();
    return true;
  };
  /** A press on the page: on the waiting marble, it lets it go. */
  const poke = (at: PagePoint): boolean => !at.front && run.onMarble(at.x, at.y) && launch();

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
      run.spend(Math.hypot(x1 - x0, y1 - y0));
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
    /** Advances the game. The marble only runs while its page is face up and lying still. */
    step(dt: number): boolean {
      if (!deps.game || handling.frontUp || handling.busy || !run.step(dt)) return false;
      layers.back.sketch(run.sketch());
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
      note();
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
