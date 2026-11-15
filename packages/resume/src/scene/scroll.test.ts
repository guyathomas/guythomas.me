import { describe, expect, it } from 'vitest';
import { planScroll, viewAt, WHOLE } from './scroll';

// A 900 px window showing a 0.2794 m sheet at 2900 px per metre (810 px tall), which may come 1.43 times closer.
const plan = planScroll(900, 2900, 0.2794, 1.43, 40);

describe('planScroll', () => {
  it('has nothing to scroll when the sheet is already at reading size', () => {
    const flat = planScroll(1400, 4000, 0.2794, 1.01, 40);
    expect(flat.stretch + flat.travel).toBe(0);
    expect(viewAt(flat, 500)).toEqual(WHOLE);
  });

  it('travels exactly as far as the sheet overflows the window at reading size', () => {
    const tall = 0.2794 * 2900 * 1.43;
    expect(plan.travel).toBeCloseTo(tall + 80 - 900, 6);
    expect(plan.stretch).toBeGreaterThan(200);
  });
});

describe('viewAt', () => {
  it('shows the whole desk before any scroll', () => {
    expect(viewAt(plan, 0)).toEqual({ scale: 1, x: 0, z: 0 });
  });

  it('is at reading size on the top of the sheet once the camera has come in', () => {
    const view = viewAt(plan, plan.stretch);
    expect(view.scale).toBeCloseTo(1.43, 9);
    // The top edge of the sheet sits one margin below the top of the window.
    const topEdgePx = 450 + (-0.2794 / 2 - view.z) * plan.perMetre;
    expect(topEdgePx).toBeCloseTo(40, 6);
  });

  it('ends with the foot of the sheet one margin above the bottom of the window, and goes no further', () => {
    const end = viewAt(plan, plan.stretch + plan.travel);
    const footPx = 450 + (0.2794 / 2 - end.z) * plan.perMetre;
    expect(footPx).toBeCloseTo(900 - 40, 6);
    expect(viewAt(plan, plan.stretch + plan.travel + 999)).toEqual(end);
  });

  it('moves down the sheet a pixel for a pixel', () => {
    const a = viewAt(plan, plan.stretch + 100);
    const b = viewAt(plan, plan.stretch + 160);
    expect((b.z - a.z) * plan.perMetre).toBeCloseTo(60, 6);
  });
});
