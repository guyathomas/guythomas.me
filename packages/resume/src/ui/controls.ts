export interface ControlHandlers {
  desk(): void;
  flip(): void;
  reset(): void;
  /** Escape: returns true if something was put away. */
  cancel(): boolean;
  /** E: turns the pencil in the hand end for end. */
  erase(): void;
  /** Space: returns true if it was used. */
  launch(): boolean;
  lamp(): void;
}

/**
 * The keys. Nothing is written on the picture: everything is done by handling
 * what is on the desk, and these are shortcuts for those who look for them.
 */
export class Controls {
  private deskView = false;

  constructor(handlers: ControlHandlers) {
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
          if (!handlers.cancel() && this.deskView) handlers.desk();
          break;
        case 'e':
          handlers.erase();
          break;
        case ' ':
          if (!handlers.launch()) return;
          event.preventDefault();
          break;
        default:
          return;
      }
    });
  }

  setDesk(on: boolean): void {
    this.deskView = on;
    document.documentElement.classList.toggle('desk-view', on);
  }
}
