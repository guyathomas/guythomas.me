import { sunFor } from '../light/clock';
import { guessPlace, locate } from '../light/locate';
import { lightingFor } from '../light/state';
import type { Place } from '../light/zones';
import type { LightRig } from '../scene/rig';
import type { Mode, Params } from './params';

/**
 * Lights the scene by the viewer's real sun. The lamp comes on at dusk and
 * goes off at dawn by itself; a hand on its switch holds until the next one.
 * A fixed day or night can be asked for in the URL, for review.
 */
export class Lighting {
  private mode: Mode;
  private place: Place;
  private lampWanted: boolean | null = null;

  constructor(private readonly rig: LightRig, private readonly params: Params, private readonly changed: () => void) {
    this.mode = params.mode ?? 'auto';
    this.place = guessPlace();
    if (params.latitude !== null) this.place = { ...this.place, latitude: params.latitude };
    if (params.longitude !== null) this.place = { ...this.place, longitude: params.longitude };
    this.refresh(true);
  }

  /** Refines the viewer's position without holding anything up. */
  async refine(): Promise<void> {
    if (this.params.latitude !== null && this.params.longitude !== null) return;
    const found = await locate();
    if (!found) return;
    this.place = {
      latitude: this.params.latitude ?? found.latitude,
      longitude: this.params.longitude ?? found.longitude,
    };
    this.refresh(false);
  }

  /** Pins the sky, for a freeze state. */
  setMode(mode: Mode): void {
    this.mode = mode;
    this.refresh(false);
  }

  toggleLamp(): void {
    this.rig.lampOn = !this.rig.lampOn;
    this.changed();
  }

  /** Recomputes the sky. Call when the place or the time changes. */
  refresh(immediate: boolean): void {
    const sun = sunFor(this.mode, new Date(), this.place, this.params.sun);
    const state = lightingFor(sun, this.place.latitude);
    if (this.lampWanted !== state.lampWanted) this.rig.lampOn = state.lampWanted;
    this.lampWanted = state.lampWanted;
    this.rig.setState(state, immediate);
    this.changed();
  }
}
