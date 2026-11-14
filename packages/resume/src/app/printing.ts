let frame: HTMLIFrameElement | null = null;
let ready = false;

/** Prints the plain copy of the sheet without leaving the desk. */
export function printPlain(): void {
  if (frame) {
    // Still loading: the print already asked for will follow. The frame is never focused, so the desk keeps its keys.
    if (ready) frame.contentWindow?.print();
    return;
  }
  const created = document.createElement('iframe');
  frame = created;
  created.src = '/plain/';
  created.title = 'Printable copy';
  created.tabIndex = -1;
  created.setAttribute('aria-hidden', 'true');
  created.style.cssText = 'position:fixed;left:-10000px;top:0;width:816px;height:1056px;border:0';
  created.addEventListener('load', () => {
    const view = created.contentWindow;
    if (!view) return;
    void view.document.fonts.ready.then(() => {
      ready = true;
      view.print();
    });
  });
  document.body.appendChild(created);
}
