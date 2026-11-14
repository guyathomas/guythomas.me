export type Mode = 'auto' | 'day' | 'night';
export type ViewName = 'rest' | 'raking' | 'corner-lifted' | 'mid-flip' | 'back' | 'loupe' | 'desk';

export interface Params {
  /** Pin the piece to a named state. */
  view: ViewName | null;
  mode: Mode | null;
  /** Local solar hour for auto mode, e.g. 6.5 for half past six. */
  sun: number | null;
  latitude: number | null;
  longitude: number | null;
  /** Freeze time at this many seconds. */
  time: number | null;
  /** Lamp position over the desk, each axis from -1 to 1. */
  light: [number, number] | null;
  /** Page of the marble run to open on, counting from 1. */
  page: number | null;
  /** Render continuously and record the frame rate. */
  fps: boolean;
}

const VIEWS: ViewName[] = ['rest', 'raking', 'corner-lifted', 'mid-flip', 'back', 'loupe', 'desk'];
const MODES: Mode[] = ['auto', 'day', 'night'];

function number(raw: string | null, lo: number, hi: number): number | null {
  if (raw === null || raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.min(hi, Math.max(lo, value)) : null;
}

/** Reads the freeze-state parameters. Anything unrecognised is ignored. */
export function parseParams(search: string): Params {
  const query = new URLSearchParams(search);
  const view = query.get('view') as ViewName | null;
  const mode = query.get('mode') as Mode | null;
  const light = query.get('light')?.split(',').map(Number);
  return {
    view: view && VIEWS.includes(view) ? view : null,
    mode: mode && MODES.includes(mode) ? mode : null,
    sun: number(query.get('sun'), 0, 24),
    latitude: number(query.get('lat'), -90, 90),
    longitude: number(query.get('lon'), -180, 180),
    time: number(query.get('t'), 0, 1e6),
    light: light && light.length === 2 && light.every(Number.isFinite) ? [Math.min(1, Math.max(-1, light[0])), Math.min(1, Math.max(-1, light[1]))] : null,
    page: number(query.get('page'), 1, 99),
    fps: query.has('fps'),
  };
}

/** True when any parameter pins the scene, so idle motion and persistence should stay out of the way. */
export function isFrozen(params: Params): boolean {
  return params.view !== null || params.time !== null || params.sun !== null || params.light !== null;
}
