/**
 * The shortest solutions found for each page of the marble run, kept for
 * reference: they are where the scoring limits in `levels.ts` come from, and
 * finding them again takes a long search (`tools/par.ts`). Not part of the piece.
 *
 * Each was found by designing a solution by hand and polishing it with the
 * solver. "Dependable" means it passes as drawn and in at least 90% of 1000
 * trials with every line end moved up to 1.2 mm, as a hand would misplace it.
 * Shorter knife-edge solutions exist (the `edge` length) but fail when nudged.
 */
export interface BestSolution {
  /** Total length of line, in page widths. */
  length: number;
  /** Share of 1000 nudged trials that passed. */
  passRate: number;
  /** Length of the shortest solution that passes only when drawn exactly, in page widths. */
  edge: number;
  /** True if the line the page opens with is kept; otherwise it is rubbed out first. */
  keepsStarter: boolean;
  /** How it works. */
  trick: string;
  /** The lines, each [x0, y0, x1, y1] in fractions of the page (x across, y down). */
  lines: number[][];
}

export const BEST: BestSolution[] = [
  {
    length: 0.11,
    passRate: 0.94,
    edge: 0.05,
    keepsStarter: false,
    trick: 'A tiny kicker under the start throws the marble right; a small deflector just past the first star lines it up with the other two.',
    lines: [
      [0.1942, 0.1523, 0.2495, 0.1801],
      [0.3814, 0.4209, 0.4205, 0.433],
    ],
  },
  {
    length: 0.29,
    passRate: 0.94,
    edge: 0.13,
    keepsStarter: false,
    trick: 'A short ramp left off the start; the marble flies past the first star; two small deflectors turn it back right and a stub catches it for the third.',
    lines: [
      [0.806, 0.1317, 0.6836, 0.1839],
      [0.5429, 0.3567, 0.4975, 0.3663],
      [0.1934, 0.4758, 0.2199, 0.5042],
      [0.3494, 0.5811, 0.2965, 0.5692],
    ],
  },
  {
    length: 0.53,
    passRate: 0.92,
    edge: 0.38,
    keepsStarter: true,
    trick: 'The printed roof throws it left onto one long gentle ramp; it rolls uphill to the first star, stops and rolls back; a deflector and a kicker send it on to the third.',
    lines: [
      [0.182, 0.3999, 0.6209, 0.4469],
      [0.7948, 0.5913, 0.7584, 0.6178],
      [0.6775, 0.6708, 0.6442, 0.6791],
    ],
  },
  {
    length: 0.95,
    passRate: 0.94,
    edge: 0.84,
    keepsStarter: true,
    trick: 'A ramp right from the start, a short bank at the first star, then two ramps it rolls up to a star on, stops, and rolls back down, with small kickers.',
    lines: [
      [0.1526, 0.1303, 0.6339, 0.2022],
      [0.8469, 0.3159, 0.8041, 0.3558],
      [0.6307, 0.5596, 0.6042, 0.5726],
      [0.1658, 0.6245, 0.1762, 0.6126],
      [0.1863, 0.63, 0.4851, 0.6852],
      [0.6036, 0.7773, 0.6401, 0.783],
    ],
  },
  {
    length: 0.27,
    passRate: 0.93,
    edge: 0.15,
    keepsStarter: true,
    trick: 'A kicker under the start throws it left to the first star; a deflector drops it onto the printed shelf, which it rolls along and off through the gap; a kicker flings it to the third.',
    lines: [
      [0.5082, 0.1566, 0.3343, 0.2027],
      [0.1649, 0.317, 0.1864, 0.342],
      [0.4514, 0.4971, 0.495, 0.5117],
    ],
  },
  {
    length: 1.09,
    passRate: 0.91,
    edge: 1.02,
    keepsStarter: true,
    trick: 'A steep ramp throws it onto a ramp under the first star; it rolls up to the star and back down onto a ramp under the second, and the same again; a tiny kicker reaches the third.',
    lines: [
      [0.6298, 0.3361, 0.6649, 0.3421],
      [0.8515, 0.3251, 0.7301, 0.3624],
      [0.1561, 0.5261, 0.6446, 0.5789],
      [0.1056, 0.1034, 0.4465, 0.1756],
      [0.1458, 0.5035, 0.1362, 0.5114],
      [0.5827, 0.4877, 0.6259, 0.4729],
      [0.8685, 0.3095, 0.8741, 0.2995],
    ],
  },
  {
    length: 0.32,
    passRate: 0.9,
    edge: 0.2,
    keepsStarter: true,
    trick: 'A kicker off the start, a deflector at the first star throws it right, a stop-post by the second, then a short ramp left that drops it into the cup.',
    lines: [
      [0.1345, 0.1094, 0.1997, 0.1351],
      [0.3098, 0.3079, 0.3486, 0.3188],
      [0.8293, 0.4568, 0.8253, 0.469],
      [0.8063, 0.485, 0.6219, 0.5004],
    ],
  },
  {
    length: 0.95,
    passRate: 0.91,
    edge: 0.9,
    keepsStarter: true,
    trick: 'A ramp left from the start, a deflector at the first star bounces it right onto one almost level line; it rolls up to the second star, stops, rolls back and off the end into the cup.',
    lines: [
      [0.866, 0.109, 0.4245, 0.1906],
      [0.1589, 0.376, 0.1817, 0.4013],
      [0.3302, 0.5798, 0.7696, 0.5552],
      [0.7822, 0.5444, 0.7904, 0.5346],
    ],
  },
];
