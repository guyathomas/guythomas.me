import { describe, expect, it } from 'vitest';
import { LEVELS } from './levels';
import { BEST } from './best';
import { plainSolution } from './routes';
import { MarbleRun, type RunEvent } from './run';

const W = 0.2159;
const H = 0.2794;

/** Plays the plain solution to a page, keeping the line the page opens with. */
function play(level: number) {
  const events: RunEvent[] = [];
  const run = new MarbleRun(W, H, (event) => events.push(event), level);
  run.setLines([...run.starter(), ...plainSolution(level, W, H)], 0.0004);
  const rating = run.rating;
  run.release();
  for (let i = 0; i < 60 * 20 && run.phase !== 'ready' && run.phase !== 'done' && run.level === level; i++) run.step(1 / 60);
  return { run, events, rating };
}

describe('levels', () => {
  it('keeps everything on the page', () => {
    for (const level of LEVELS) {
      for (const [x, y] of [level.start, ...level.stars, ...level.walls.flat()]) {
        expect(x).toBeGreaterThan(0.03);
        expect(x).toBeLessThan(0.97);
        expect(y).toBeGreaterThan(0.06);
        expect(y).toBeLessThan(0.95);
      }
      expect(level.stars).toHaveLength(3);
    }
  });

  LEVELS.forEach((_, index) => {
    it(`page ${index + 1} can be passed`, () => {
      const { run, events, rating } = play(index);
      expect(rating, 'tidy ramps from star to star earn two').toBe(2);
      expect(events.filter((event) => event === 'star'), 'stars collected').toHaveLength(3);
      if (index === LEVELS.length - 1) expect(run.phase).toBe('done');
      else expect(run.level).toBe(index + 1);
    });
  });

  // The shortest solutions on record. If the physics changes these say so, and the limits need playing again.
  BEST.forEach((best, index) => {
    it(`page ${index + 1} is passed by its shortest recorded solution, for full marks`, () => {
      const events: RunEvent[] = [];
      const run = new MarbleRun(W, H, (event) => events.push(event), index);
      const lines = best.lines.map((line) => line.map((value, k) => value * (k % 2 ? H : W)));
      run.setLines(best.keepsStarter ? [...run.starter(), ...lines] : lines, 0.0004);
      expect(run.drawn / W).toBeCloseTo(best.length, 1);
      expect(run.drawn / W).toBeLessThanOrEqual(LEVELS[index].best + 0.005);
      expect(run.rating).toBe(3);
      expect(run.worth).toBeGreaterThanOrEqual(99);
      run.release();
      for (let i = 0; i < 60 * 25 && run.phase === 'rolling'; i++) run.step(1 / 60);
      expect(events.filter((event) => event === 'star')).toHaveLength(3);
      expect(events).toContain('won');
    });
  });
});
