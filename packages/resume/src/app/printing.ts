/**
 * Printing. The page prints its own sheet of type, not the picture of the
 * desk: the stylesheet hides the scene for print, and the phone's narrow slip
 * is set back to a letter sheet while the printer has it.
 */
let active = false;

/** True while the printer has the page. */
export function printing(): boolean {
  return active;
}

export function installPrinting(): void {
  const root = document.documentElement;
  let wasNarrow = false;
  window.addEventListener('beforeprint', () => {
    active = true;
    wasNarrow = root.classList.contains('narrow');
    root.classList.remove('narrow');
  });
  window.addEventListener('afterprint', () => {
    active = false;
    root.classList.toggle('narrow', wasNarrow);
  });
}

/** Sends the sheet to the printer. */
export function printSheetCopy(): void {
  window.print();
}
