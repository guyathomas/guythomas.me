// Inlined into <head>: sizes the sheet before first paint, and again on resize.
// A phone gets a narrow slip at reading size that scrolls. Anything larger gets
// the whole sheet fitted to the window's height, so the desk is one picture
// that does not scroll; `--read` is how much closer the camera may come to
// bring that sheet up to reading size. Pass true to size for reading instead
// (when there is no scene, only the sheet of type).
window.__sizeSheet = function (reading) {
  var w = window.innerWidth;
  var h = window.innerHeight;
  var narrow = w < 700;
  var base = narrow ? 372 : 816;
  var read = narrow ? w - 14 : Math.min(Math.max(w * 0.62, 760), 1000, w - 32);
  var fit = !narrow && !reading && h >= 560;
  var target = fit ? Math.min(read, ((h * 0.9) / 1056) * 816) : read;
  var root = document.documentElement;
  root.style.setProperty('--s', (target / base).toFixed(4));
  root.style.setProperty('--read', (read / target).toFixed(4));
  root.classList.toggle('narrow', narrow);
  root.classList.toggle('fit', fit);
  return narrow;
};
window.__sizeSheet();
