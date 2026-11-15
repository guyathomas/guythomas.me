# Changelog

## 1.0.0

Complete rewrite as "Living paper": the resume as a letterpress sheet on a desk.

### Added

- The sheet: type set by the browser, printed to a two-colour ink map, pressed into paper by a shader and lit by the scene.
- Handling: slide the sheet, curl a corner, turn it over. The sheet turns over where it lies: carry a corner a third of the way, flick it, or double-click.
- A desk with a working loupe, a pencil and a printer's stamp, all movable. Thrown, they slide to a stop and knock into each other, and the pencil rolls.
- The stamp: set it down on the sheet to leave an "OK to print" mark and print it.
- The pencil draws: pick it up and press on the paper, front or back. Reset rubs it out.
- A marble run on the back of the sheet, drawn in pencil: draw ramps, let the marble go, collect all three stars in one run. Eight pages, each scored in stars (out of three) and points (out of 100) by how little line it took.
- An eraser on the desk: pick it up and rub with its end to take out the pencil under it. The pencil's rubber end does the same (`E`, or the right mouse button).
- No hint text: a pencilled "PTO" at the foot of the sheet and a draught that lifts its corner once say that it turns over.
- Phones and narrow windows: the controls sit on their own strip, clear of the text, with larger touch targets; the back carries a note in place of the game; a corner needs a shorter pull to turn the slip over.
- Nothing written on the picture: no buttons. A bell turns sound on and off, and a tap on "PTO" turns the sheet.
- Lighting always follows the viewer's sun, with the room's own light coming up after dark. Nothing to switch.
- On anything larger than a phone the whole desk is one picture that does not scroll; the wheel comes closer, up to reading size.
- Printing from the browser prints the sheet of type rather than the scene.
- Thrown objects stop at the edge of the picture, so nothing is lost.
- Lighting modes: day, night, and auto, which follows the viewer's real sun.
- `/api/geo`, returning a coarse location from Vercel's request headers for auto lighting.
- Opt-in synthesised sound.
- Without WebGL2, or if the script fails, the page stays as a readable sheet of type.
- Freeze-state URL parameters and a screenshot tool for review.
- Unit tests for the data, typesetting, paper and lighting maths.

### Removed

- The Astro and Tailwind site, its dark mode toggle and print animation.
