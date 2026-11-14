// The plain copy: print button, and letter layout restored while printing.
const root = document.documentElement;
let wasNarrow = false;

document.getElementById('print')?.addEventListener('click', () => window.print());

// The inline boot script defines the sizing; keep the sheet fitted as the window changes.
window.addEventListener('resize', () => (window as unknown as { __sizeSheet(): boolean }).__sizeSheet());

window.addEventListener('beforeprint', () => {
  wasNarrow = root.classList.contains('narrow');
  root.classList.remove('narrow');
});
window.addEventListener('afterprint', () => {
  root.classList.toggle('narrow', wasNarrow);
});
