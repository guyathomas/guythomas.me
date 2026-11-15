type Tool = 'pencil' | 'eraser';

const GO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 8 5.2z"/></svg>';

const ICONS: Record<Tool, string> = {
  pencil:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.2-4.6L16.6 4a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8 4 20z"/><path d="M14.5 6.1l3.4 3.4"/></svg>',
  eraser:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 19.5L3.6 14.6a1.6 1.6 0 0 1 0-2.2l8.6-8.6a1.6 1.6 0 0 1 2.2 0l6 6a1.6 1.6 0 0 1 0 2.2l-7.5 7.5H8.5z"/><path d="M8.2 8.2l7.6 7.6"/><path d="M12.9 19.5H21"/></svg>',
};

/**
 * The pencil and the eraser as two buttons, for where there is no desk to
 * pick them up from. Picking one makes a finger on the paper draw or rub;
 * picking it again puts it away, and the finger scrolls as before. A third
 * button lets the marble go.
 */
export class ToolTray {
  shown = false;
  private readonly element = document.createElement('div');
  private readonly buttons = new Map<Tool, HTMLButtonElement>();
  private current: Tool | null = null;

  private readonly go = document.createElement('button');
  private ready = true;

  constructor(pick: (tool: Tool) => void, launch: () => void) {
    this.element.id = 'tray';
    this.element.setAttribute('role', 'toolbar');
    this.element.setAttribute('aria-label', 'Drawing');
    for (const tool of ['pencil', 'eraser'] as const) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', tool === 'pencil' ? 'Pencil' : 'Eraser');
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = ICONS[tool];
      button.addEventListener('click', () => pick(tool));
      this.buttons.set(tool, button);
      this.element.appendChild(button);
    }
    this.go.type = 'button';
    this.go.className = 'go';
    this.go.setAttribute('aria-label', 'Let the marble go');
    this.go.innerHTML = GO;
    this.go.addEventListener('click', launch);
    this.element.appendChild(this.go);
    document.body.appendChild(this.element);
  }

  /** Shows or hides the tray, marks the tool in use, and says whether the marble is waiting. Cheap to call every frame. */
  show(shown: boolean, inUse: Tool | null, ready: boolean): void {
    if (ready !== this.ready) {
      this.ready = ready;
      this.go.disabled = !ready;
    }
    if (shown !== this.shown) {
      this.shown = shown;
      this.element.classList.toggle('shown', shown);
    }
    if (inUse === this.current) return;
    this.current = inUse;
    for (const [tool, button] of this.buttons) button.setAttribute('aria-pressed', String(tool === inUse));
  }
}
