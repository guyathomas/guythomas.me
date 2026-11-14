import type { Mode } from '../app/params';

export interface ControlHandlers {
  mode(mode: Mode): void;
  desk(): void;
  flip(): void;
  reset(): void;
  sound(): void;
  lamp(): void;
}

/** The few quiet controls at the foot of the picture, and their keys. */
export class Controls {
  private readonly modeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('#ui [data-mode]'));
  private readonly view = document.getElementById('btn-view') as HTMLButtonElement;
  private readonly sound = document.getElementById('btn-sound') as HTMLButtonElement;
  private readonly hint = document.getElementById('hint');

  constructor(handlers: ControlHandlers) {
    for (const button of this.modeButtons) {
      button.addEventListener('click', () => handlers.mode(button.dataset.mode as Mode));
    }
    this.view.addEventListener('click', handlers.desk);
    document.getElementById('btn-flip')?.addEventListener('click', handlers.flip);
    document.getElementById('btn-reset')?.addEventListener('click', handlers.reset);
    this.sound.addEventListener('click', handlers.sound);

    window.addEventListener('keydown', (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      switch (event.key.toLowerCase()) {
        case 'f':
          handlers.flip();
          break;
        case 'r':
          handlers.reset();
          break;
        case 'd':
          handlers.desk();
          break;
        case 'l':
          handlers.lamp();
          break;
        case 'escape':
          if (this.view.getAttribute('aria-pressed') === 'true') handlers.desk();
          break;
        default:
          return;
      }
      this.used();
    });
    window.setTimeout(() => this.used(), 14000);
  }

  setMode(mode: Mode): void {
    for (const button of this.modeButtons) button.setAttribute('aria-checked', String(button.dataset.mode === mode));
  }

  setDesk(on: boolean): void {
    this.view.setAttribute('aria-pressed', String(on));
    this.view.textContent = on ? 'Read' : 'Desk';
    document.documentElement.classList.toggle('desk-view', on);
  }

  setSound(on: boolean): void {
    this.sound.setAttribute('aria-pressed', String(on));
    this.sound.textContent = on ? 'Sound on' : 'Enable sound';
  }

  /** The viewer has started handling things: retire the hint. */
  used(): void {
    this.hint?.classList.add('done');
  }
}
