// The plain copy: print button, and letter layout restored while printing.
const root = document.documentElement;
let wasNarrow = false;

document.getElementById('print')?.addEventListener('click', () => window.print());

window.addEventListener('beforeprint', () => {
  wasNarrow = root.classList.contains('narrow');
  root.classList.remove('narrow');
});
window.addEventListener('afterprint', () => {
  root.classList.toggle('narrow', wasNarrow);
});
