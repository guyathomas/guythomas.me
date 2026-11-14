import { describe, expect, it } from 'vitest';
import { MarbleRun, type RunEvent } from './run';

const W = 0.2159;
const H = 0.2794;

function make() {
  const events: RunEvent[] = [];
  const run = new MarbleRun(W, H, (event) => events.push(event));
  return { run, events };
}

const play = (run: MarbleRun, seconds: number) => {
  for (let i = 0; i < seconds * 60; i++) run.step(1 / 60);
};

describe('MarbleRun', () => {
  it('holds the marble until it is let go', () => {
    const { run } = make();
    const y = run.marble.y;
    play(run, 1);
    expect(run.marble.y).toBe(y);
    expect(run.onMarble(run.marble.x, run.marble.y)).toBe(true);
  });

  it('loses the marble off the foot of the page and puts it back', () => {
    const { run, events } = make();
    run.release();
    play(run, 3);
    expect(events).toContain('lost');
    expect(run.phase).toBe('ready');
  });

  it('collects the stars along a drawn ramp and turns the page', () => {
    const { run, events } = make();
    // The first page's stars lie on a diagonal: a ramp parallel to it, one marble's reach below.
    const slope = (0.14 * H) / (0.2 * W);
    const drop = (0.0042 + 0.0003) * Math.hypot(1, slope);
    const at = (x: number) => 0.36 * H + (x - 0.42 * W) * slope + drop;
    run.addLine([0.1 * W, at(0.1 * W), 0.95 * W, at(0.95 * W)], 0.0003);
    run.release();
    play(run, 6);
    expect(events.filter((event) => event === 'star').length).toBe(3);
    expect(events).toContain('won');
    expect(events).toContain('next');
    expect(run.level).toBe(1);
    expect(run.phase).toBe('ready');
  });

  it('draws the marble, the shelf and the stars while waiting', () => {
    const { run } = make();
    expect(run.sketch().length).toBeGreaterThanOrEqual(5);
  });
});
