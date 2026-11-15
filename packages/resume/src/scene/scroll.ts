/** How close the camera has come to the desk, and where it has moved to, in the fitted view. */
export interface Zoom {
  /** 1 shows the whole desk; larger is closer. */
  scale: number;
  /** How far the middle of the picture has moved from the middle of the sheet, metres. */
  x: number;
  z: number;
}

export const WHOLE: Zoom = { scale: 1, x: 0, z: 0 };

/** What scrolling does in the fitted view: first the camera comes in, then it moves down the sheet. */
export interface ScrollPlan {
  /** Scroll, in px, over which the camera comes in to reading size. */
  stretch: number;
  /** Scroll, in px, over which it then moves down the sheet. */
  travel: number;
  /** How close it comes. */
  most: number;
  /** Where the middle of the picture is, in metres from the middle of the sheet, when the top of the sheet is in view. */
  top: number;
  /** Screen px per metre at reading size. */
  perMetre: number;
}

/**
 * Plans the scroll for a window `viewHeight` px tall showing a sheet
 * `sheetHeight` metres tall at `basePx` px per metre, which may come `most`
 * times closer. `margin` is the desk left showing above and below, in px.
 */
export function planScroll(viewHeight: number, basePx: number, sheetHeight: number, most: number, margin: number): ScrollPlan {
  // Already at reading size: the whole sheet is in view and there is nothing to scroll.
  if (most < 1.03) return { stretch: 0, travel: 0, most: 1, top: 0, perMetre: basePx };
  const perMetre = basePx * most;
  const reach = (sheetHeight / 2) * perMetre + margin - viewHeight / 2;
  // A sheet that fits even at reading size is simply brought closer.
  const travel = Math.max(0, 2 * reach);
  return { stretch: Math.round(viewHeight * 0.34), travel, most, top: -Math.max(0, reach) / perMetre, perMetre };
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Where the camera is for a scroll position. */
export function viewAt(plan: ScrollPlan, scrollY: number): Zoom {
  if (plan.stretch === 0) return WHOLE;
  const t = smooth(Math.min(1, Math.max(0, scrollY / plan.stretch)));
  const down = Math.min(plan.travel, Math.max(0, scrollY - plan.stretch));
  return { scale: 1 + (plan.most - 1) * t, x: 0, z: plan.top * t + down / plan.perMetre };
}
