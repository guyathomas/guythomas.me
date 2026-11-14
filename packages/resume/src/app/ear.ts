import type { SheetHandling } from '../interact/handling';
import type { SheetBody } from '../sheet/body';

const STIR_TIME = 1.3;

/**
 * A draught at the corner. The sheet lies flat, but once, shortly after the
 * piece opens, its bottom right corner lifts and settles again: with the
 * pencilled "PTO", the hint that the sheet can be turned over.
 */
export class CornerDraught {
  private stirring = -1;

  constructor(private readonly sheet: SheetBody, private readonly handling: SheetHandling, private readonly instant: boolean) {}

  private get lying(): boolean {
    const { phase } = this.handling;
    return (phase === 'rest' || phase === 'slide' || phase === 'glide') && this.handling.frontUp && !this.sheet.curl;
  }

  /** Lifts the corner and lets it settle, once. Not for viewers who asked for stillness. */
  stir(): void {
    if (!this.instant && this.lying) this.stirring = 0;
  }

  /** Advances the draught. Returns true while the corner is moving. */
  step(dt: number): boolean {
    const { sheet } = this;
    if (this.stirring < 0) return false;
    this.stirring += dt;
    const over = this.stirring >= STIR_TIME || !this.lying;
    if (over) this.stirring = -1;
    sheet.ear = over ? 0 : Math.sin((Math.PI * this.stirring) / STIR_TIME) ** 2;
    if (!this.handling.busy) sheet.update();
    return true;
  }
}
