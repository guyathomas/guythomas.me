import type { Voices } from '../audio/voices';
import { LEVELS } from '../game/levels';
import { MarbleRun } from '../game/run';
import type { SheetHandling } from '../interact/handling';
import type { DeskObjects, Item } from '../interact/objects';
import { PENCIL_HALF, PencilTool, type PagePoint } from '../interact/pencil';
import type { SheetBody } from '../sheet/body';
import type { GraphiteLayer } from '../sheet/graphite';
import { Marks } from './marks';

export interface PlayDeps {
  sheet: SheetBody;
  handling: SheetHandling;
  objects: DeskObjects;
  pencilItem: Item;
  layers: { front: GraphiteLayer; back: GraphiteLayer };
  voices: Voices;
  wake(): void;
  /** Page of the run to open on, counting from 0. */
  firstPage: number;
  /** Every page of the run has been passed. */
  finished(): void;
}

/** Reach of the rubber, metres. */
const RUBBER = 0.0032;

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
  layers.back.sketch(run.sketch());

  const launch = (): boolean => {
    if (handling.frontUp || handling.busy || run.phase !== 'ready') return false;
    run.release();
    deps.wake();
    return true;
  };
  /** A press on the page: on the waiting marble, it lets it go. */
  const poke = (at: PagePoint): boolean => !at.front && run.onMarble(at.x, at.y) && launch();

  const tool = new PencilTool(deps.pencilItem, deps.objects, sheet, handling, {
    // The front takes any amount of scribbling; the game's page has only so much lead.
    allow: (front, length) => front || ((run.phase === 'ready' || run.phase === 'rolling') && run.lead > length),
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
    rub: (at, speed) => {
      voices.scratch(speed * 0.6);
      if (!(at.front ? marks.front : marks.back).rub(at.x, at.y, RUBBER)) return;
      if (at.front) deps.wake();
      else sync();
    },
    rest: () => voices.scratch(0),
    poke,
  });

  return {
    tool,
    poke,
    launch,
    /** Advances the game. The marble only runs while its page is face up and lying still. */
    step(dt: number): boolean {
      if (handling.frontUp || handling.busy || !run.step(dt)) return false;
      layers.back.sketch(run.sketch());
      return true;
    },
    /** Rubs out every pencil mark and goes back to the first page. */
    reset(): void {
      tool.drop();
      marks.front.clear();
      marks.back.clear();
      run.reset();
      layers.back.sketch(run.sketch());
    },
    render(renderer: Parameters<GraphiteLayer['render']>[0]): void {
      layers.front.render(renderer);
      layers.back.render(renderer);
    },
  };
}
