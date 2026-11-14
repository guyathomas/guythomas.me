/** One page of the marble run, in fractions of the page (x across, y down). */
export interface Level {
  start: [number, number];
  stars: Array<[number, number]>;
  /** Lines printed on the page that cannot be rubbed out, each a run of points. */
  walls: Array<Array<[number, number]>>;
  /** Pencil lines the page opens with: a start for the viewer to carry on, or rub out. */
  starter?: Array<Array<[number, number]>>;
  /**
   * The most line, in page widths, that still scores three and two. Set by
   * playing each page (see `best.ts`): three is about a quarter more than the
   * shortest dependable solution found, so it needs a clever one; two is what
   * tidy ramps from star to star earn; anything that passes scores one. The
   * first page is kinder: three there allows one well-placed launch ramp.
   */
  three: number;
  two: number;
  /** The least line the page has been dependably passed with, in page widths: what scores 100 points. */
  best: number;
}

type Points = Array<[number, number]>;
const cup = (x: number, y: number, w: number, h: number): Points => [
  [x - w, y - h],
  [x - w, y + h],
  [x + w, y + h],
  [x + w, y - h],
];

/** Easy to hard. The first page starts a line for the viewer to carry on. */
export const LEVELS: Level[] = [
  {
    start: [0.2, 0.14],
    stars: [
      [0.42, 0.36],
      [0.62, 0.5],
      [0.82, 0.64],
    ],
    walls: [],
    starter: [
      [
        [0.14, 0.187],
        [0.33, 0.32],
      ],
    ],
    three: 0.35,
    two: 1.0,
    best: 0.11,
  },
  {
    start: [0.8, 0.12],
    stars: [
      [0.5, 0.3],
      [0.2, 0.48],
      [0.6, 0.76],
    ],
    walls: [],
    starter: [
      [
        [0.88, 0.17],
        [0.72, 0.215],
      ],
    ],
    three: 0.36,
    two: 1.7,
    best: 0.29,
  },
  {
    start: [0.5, 0.12],
    stars: [
      [0.2, 0.4],
      [0.8, 0.6],
      [0.38, 0.86],
    ],
    walls: [
      [
        [0.46, 0.25],
        [0.53, 0.22],
        [0.6, 0.25],
      ],
    ],
    three: 0.66,
    two: 2.05,
    best: 0.53,
  },
  {
    start: [0.16, 0.12],
    stars: [
      [0.84, 0.3],
      [0.16, 0.62],
      [0.84, 0.84],
    ],
    walls: [
      [
        [0.5, 0.34],
        [0.5, 0.48],
      ],
      [
        [0.5, 0.82],
        [0.5, 0.92],
      ],
    ],
    three: 1.19,
    two: 2.85,
    best: 0.95,
  },
  {
    start: [0.5, 0.1],
    stars: [
      [0.16, 0.3],
      [0.56, 0.535],
      [0.84, 0.8],
    ],
    walls: [
      [
        [0.06, 0.42],
        [0.36, 0.42],
      ],
      [
        [0.64, 0.42],
        [0.94, 0.42],
      ],
    ],
    three: 0.34,
    two: 1.7,
    best: 0.27,
  },
  {
    start: [0.12, 0.1],
    stars: [
      [0.86, 0.28],
      [0.14, 0.52],
      [0.86, 0.76],
    ],
    walls: [],
    three: 1.36,
    two: 2.95,
    best: 1.09,
  },
  {
    start: [0.14, 0.1],
    stars: [
      [0.3, 0.3],
      [0.82, 0.44],
      [0.5, 0.7],
    ],
    walls: [cup(0.5, 0.7, 0.055, 0.045)],
    three: 0.4,
    two: 1.55,
    best: 0.32,
  },
  {
    start: [0.86, 0.1],
    stars: [
      [0.2, 0.3],
      [0.8, 0.54],
      [0.24, 0.84],
    ],
    walls: [
      [
        [0.5, 0.28],
        [0.5, 0.42],
      ],
      [
        [0.3, 0.58],
        [0.62, 0.64],
      ],
      cup(0.24, 0.84, 0.065, 0.04),
    ],
    three: 1.19,
    two: 2.5,
    best: 0.95,
  },
];
