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
    run.setLines([[0.1 * W, at(0.1 * W), 0.95 * W, at(0.95 * W)]], 0.0003);
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

  it('wants all three stars in one run', () => {
    const { run, events } = make();
    // A ramp that stops after the first star: the marble takes one and falls off.
    const slope = (0.14 * H) / (0.2 * W);
    const drop = (0.0042 + 0.0003) * Math.hypot(1, slope);
    const at = (x: number) => 0.36 * H + (x - 0.42 * W) * slope + drop;
    run.setLines([[0.1 * W, at(0.1 * W), 0.5 * W, at(0.5 * W)]], 0.0003);
    run.release();
    play(run, 5);
    expect(events.filter((event) => event === 'star').length).toBeGreaterThanOrEqual(1);
    expect(events).toContain('lost');
    expect(events).not.toContain('won');
    run.release();
    play(run, 5);
    expect(events.filter((event) => event === 'star').length).toBeGreaterThanOrEqual(2);
    expect(run.level).toBe(0);
  });

  it('scores a page by how little was drawn, and rubbing out counts', () => {
    const { run } = make();
    expect(run.rating).toBe(3);
    run.spend(0.05);
    expect(run.drawn).toBeCloseTo(0.05, 9);
    run.setLines([[0, 0.2, 0.2, 0.2], [0, 0.25, 0.05, 0.25]], 0.0003);
    expect(run.rating).toBe(2);
    run.setLines([[0, 0.2, 0.2, 0.2], [0, 0.25, 0.2, 0.25], [0, 0.26, 0.2, 0.26]], 0.0003);
    expect(run.rating).toBe(1);
    run.setLines([[0, 0.2, 0.1, 0.2]], 0.0003);
    expect(run.rating).toBe(3);
  });

  it('adds up the score as pages are passed', () => {
    const { run } = make();
    expect(run.score).toBe(0);
    const slope = (0.14 * H) / (0.2 * W);
    const drop = (0.0042 + 0.0003) * Math.hypot(1, slope);
    const at = (x: number) => 0.36 * H + (x - 0.42 * W) * slope + drop;
    run.setLines([[0.1 * W, at(0.1 * W), 0.95 * W, at(0.95 * W)]], 0.0003);
    const rating = run.rating;
    run.release();
    play(run, 6);
    expect(run.level).toBe(1);
    expect(run.score).toBe(rating);
    run.reset();
    expect(run.score).toBe(0);
  });

  it('opens the first page with a line that is the viewer\'s to keep or rub out', () => {
    const { run } = make();
    const starter = run.starter();
    expect(starter).toHaveLength(1);
    run.setLines(starter, 0.0003);
    // It counts as line on the page like any other.
    expect(run.drawn).toBeGreaterThan(0.05);
    run.release();
    play(run, 0.8);
    expect(run.marble.x).toBeGreaterThan(0.2 * W + 0.004);

    // Rubbed out, the marble drops straight down.
    const bare = make().run;
    bare.release();
    play(bare, 0.8);
    expect(bare.marble.x).toBeCloseTo(0.2 * W, 6);
  });
});
