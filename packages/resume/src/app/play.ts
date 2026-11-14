import type { Voices } from '../audio/voices';
import { MarbleRun } from '../game/run';
import type { SheetHandling } from '../interact/handling';
import type { DeskObjects, Item } from '../interact/objects';
import { PENCIL_HALF, PencilTool, type PagePoint } from '../interact/pencil';
import type { SheetBody } from '../sheet/body';
import type { GraphiteLayer } from '../sheet/graphite';

export interface PlayDeps {
  sheet: SheetBody;
  handling: SheetHandling;
  objects: DeskObjects;
  pencilItem: Item;
  layers: { front: GraphiteLayer; back: GraphiteLayer };
  voices: Voices;
  wake(): void;
}

/** Pencil and paper: drawing on either face, and the marble run on the back. */
export function createPlay(deps: PlayDeps) {
  const { sheet, handling, layers, voices } = deps;
  const run = new MarbleRun(sheet.width, sheet.height, (event, strength) => {
    if (event === 'star' || event === 'won') voices.chime();
    else if (event === 'knock') voices.knock(strength);
    else if (event === 'release' || event === 'lost') voices.tap();
    // A finished page is rubbed clean for the next.
    else if (event === 'next') layers.back.clear();
  });
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
    drawn: (front, x0, y0, x1, y1, tone, speed) => {
      (front ? layers.front : layers.back).draw(x0, y0, x1, y1, PENCIL_HALF, tone);
      voices.scratch(speed);
    },
    rest: () => voices.scratch(0),
    stroke: (front, points) => {
      voices.scratch(0);
      if (front) return;
      run.addLine(points, PENCIL_HALF);
      // With something to roll on, the waiting marble asks to be let go.
      layers.back.sketch(run.sketch());
      deps.wake();
    },
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
      layers.front.clear();
      layers.back.clear();
      run.reset();
      layers.back.sketch(run.sketch());
    },
    render(renderer: Parameters<GraphiteLayer['render']>[0]): void {
      layers.front.render(renderer);
      layers.back.render(renderer);
    },
  };
}
