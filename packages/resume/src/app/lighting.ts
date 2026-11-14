import { sunFor } from '../light/clock';
import { guessPlace, locate } from '../light/locate';
import { lightingFor } from '../light/state';
import type { Place } from '../light/zones';
import type { LightRig } from '../scene/rig';
import type { Mode, Params } from './params';

const STORE = 'lighting-mode';

/** Chooses the sky for the scene: a fixed day, a fixed night, or the viewer's real sun. */
export class Lighting {
  mode: Mode;
  private place: Place;
  private lampWanted: boolean | null = null;

  constructor(private readonly rig: LightRig, private readonly params: Params, private readonly frozen: boolean, private readonly changed: () => void) {
    this.mode = params.mode ?? (frozen ? 'auto' : this.remembered()) ?? 'auto';
    this.place = guessPlace();
    if (params.latitude !== null) this.place = { ...this.place, latitude: params.latitude };
    if (params.longitude !== null) this.place = { ...this.place, longitude: params.longitude };
    rig.lampOn = true;
    this.refresh(true);
  }

  private remembered(): Mode | null {
    try {
      const stored = localStorage.getItem(STORE);
      return stored === 'auto' || stored === 'day' || stored === 'night' ? stored : null;
    } catch {
      return null;
    }
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

  setMode(mode: Mode): void {
    this.mode = mode;
    if (!this.frozen) {
      try {
        localStorage.setItem(STORE, mode);
      } catch {
        // Private windows may refuse storage; the choice simply is not remembered.
      }
    }
    this.refresh(false);
  }

  toggleLamp(): void {
    this.rig.lampOn = !this.rig.lampOn;
    this.changed();
  }

  /** Recomputes the sky. Call when the mode, the place or the time changes. */
  refresh(immediate: boolean): void {
    const sun = sunFor(this.mode, new Date(), this.place, this.params.sun);
    const state = lightingFor(sun, this.place.latitude);
    // A hand on the switch holds until the next dusk or dawn.
    if (this.lampWanted !== null && this.lampWanted !== state.lampWanted) this.rig.lampOn = true;
    this.lampWanted = state.lampWanted;
    this.rig.setState(state, immediate);
    this.changed();
  }
}
