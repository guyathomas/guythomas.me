// Inlined into <head>: sizes the sheet before first paint, and again on resize.
window.__sizeSheet = function () {
  var w = window.innerWidth;
  var narrow = w < 700;
  var base = narrow ? 372 : 816;
  var target = narrow ? w - 14 : Math.min(Math.max(w * 0.62, 760), 1000, w - 32);
  var root = document.documentElement;
  root.style.setProperty('--s', (target / base).toFixed(4));
  root.classList.toggle('narrow', narrow);
  return narrow;
};
window.__sizeSheet();
