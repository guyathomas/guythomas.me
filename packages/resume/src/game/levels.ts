/** One page of the marble run, in fractions of the page (x across, y down). */
export interface Level {
  start: [number, number];
  stars: Array<[number, number]>;
  /** Lines already on the page, each a run of points. */
  walls: Array<Array<[number, number]>>;
}

export const LEVELS: Level[] = [
  {
    start: [0.2, 0.14],
    stars: [
      [0.42, 0.36],
      [0.62, 0.5],
      [0.82, 0.64],
    ],
    walls: [],
  },
  {
    start: [0.8, 0.12],
    stars: [
      [0.5, 0.3],
      [0.2, 0.48],
      [0.6, 0.76],
    ],
    walls: [],
  },
  {
    start: [0.5, 0.12],
    stars: [
      [0.2, 0.46],
      [0.8, 0.46],
      [0.5, 0.82],
    ],
    walls: [
      [
        [0.44, 0.27],
        [0.5, 0.24],
        [0.56, 0.27],
      ],
    ],
  },
  {
    start: [0.16, 0.12],
    stars: [
      [0.84, 0.3],
      [0.16, 0.56],
      [0.84, 0.84],
    ],
    walls: [
      [
        [0.5, 0.36],
        [0.5, 0.5],
      ],
      [
        [0.5, 0.64],
        [0.5, 0.78],
      ],
    ],
  },
];
