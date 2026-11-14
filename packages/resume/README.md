# Living paper

The resume as a letterpress-printed sheet lying on a desk. It can be read at once, and it can be handled: slide it, rake the light across the impression, curl a corner, turn it over, look through the loupe.

`/` is the piece. `/plain/` is a plain, printable copy generated from the same data, and the fallback when WebGL2 is unavailable.

## Run it

```sh
bun install          # from the repo root
bun run dev          # in packages/resume, http://localhost:5199
bun run test
bun run build
```

Edit `src/data/resume.yaml` and rebuild. Both pages and the printed sheet are generated from it.

## How it works

1. **Type is set by the browser.** `vite.config.ts` prints the yaml into real HTML at build time (`src/html`). That HTML is the first paint, the semantic copy for assistive technology and search, and the layout the rasteriser reads.
2. **The sheet is printed** (`src/typeset`). Every word's position is read back from the DOM and drawn at the same place into a high-resolution two-channel ink map, one channel per ink colour.
3. **The impression is pressed** (`src/sheet/material.ts`). A shader derives the surface height from the ink map and lights it with the scene's real lights, so the deboss turns over as the light moves.
4. **The paper is an object** (`src/sheet`). A CPU-deformed mesh with thickness that lies at a pose, rolls up along a crease as a cylinder (never stretching), and can be reflected across that crease to turn it over.
5. **The desk** (`src/scene`) is lit live: sun through a window, window glow, sky, and a lamp. `src/light` computes where the sun is for the viewer.

`src/MEDIUM.md` is the art direction every state is held to.

## Controls

| Input | Result |
|---|---|
| Move the pointer | The lamp leans toward it; the impression catches the light |
| Drag the bare desk | Move the lamp's light |
| Drag the sheet | Slide and turn it |
| Drag a corner | Curl it. Carry it a third of the way, or flick it, and the sheet turns over where it lies |
| Double-click the sheet | Turns it over. A pencilled "PTO" at the foot of the front, and a draught that lifts the corner once after loading, are the only hints |
| Drag the loupe, stamp, pencil | Move them. The loupe magnifies. Let go while moving and they slide on, bump each other, and the pencil rolls |
| Click the pencil, or carry it onto the sheet | It stays in the hand. Press on the paper to draw; click off the sheet or press `Esc` to put it down |
| Click the eraser, or carry it onto the sheet | It stays in the hand, held on its end. Press on the paper and rub to take out the pencil under it; click off the sheet or press `Esc` to put it down |
| `E`, or hold the right mouse button | With the pencil in hand: turns it to the rubber end, a finer eraser |
| Set the stamp down on the sheet | Leaves an "OK to print" mark and opens the print dialog for the plain copy |
| Click the email or website | Opens it |
| `F` / `R` / `D` / `L` | Turn over / reset / desk view / lamp switch |
| `Space`, or click the marble | On the back: lets the marble go |
| `Cmd/Ctrl+P`, or Print | Prints the plain copy, not the picture of the desk |

## The back

Nothing is printed on the back. It carries a marble run, drawn in pencil and left for the viewer to find: a marble on a shelf, three stars, and on the first two pages the start of a line to carry on (an ordinary pencil line: it can be rubbed out). Lines drawn on the page are ramps. Let the marble go and it rolls down the page.

- **To pass a page,** all three stars must be collected in one run. A marble that rolls off the page or comes to rest goes back to its shelf and the stars come back.
- **The less you draw, the better the score.** A page scores three, two or one. The bar in the head margin grows with every line and shows which it would score now; rubbing a line out shortens it. The running score is written beside it, and the total out of 24 at the end.
- **There are eight pages,** from one ramp to walls, posts and a cup that must be entered last. The tally in the head margin counts them. Passing the last stamps the sheet.
- **Reset** rubs out every pencil mark and returns to the first page.

`src/game/levels.test.ts` plays a scripted solution to every page, so each is known to be passable, and sets each page's par from what that solution draws.

- `src/game` holds the rules: `marble.ts` (the marble against drawn lines), `run.ts` (shelf, stars, pages), `levels.ts`, `sketch.ts` (the hand-drawn shapes).
- `src/sheet/graphite.ts` keeps a pencil map for each face, which the paper shader reads. The viewer's lines stay; the game's own drawing is redone each frame.
- `src/interact/pencil.ts` is the pencil in the hand.

Phones show no desk objects, so there is no pencil and no game there.

## Freeze states

For review and screenshots. Combine freely.

| Parameter | Values |
|---|---|
| `view` | `rest`, `raking`, `corner-lifted`, `mid-flip`, `back`, `loupe`, `desk` |
| `mode` | `auto`, `day`, `night` |
| `sun` | Local solar hour for auto mode, for example `6.5` |
| `lat`, `lon` | Viewer position for auto mode |
| `light` | Lamp position, `x,y` each from -1 to 1 |
| `t` | Freeze the clock at this many seconds |
| `page` | Page of the marble run to open on, `1` to `8` |
| `fps` | Render continuously and record the frame rate in `window.__stats` |

`tools/shot.mjs` drives Chrome on the real GPU with scripted input and takes screenshots.

## Viewer location

Auto lighting needs a rough position. It starts from the browser's time zone (a bundled table, no network) and refines it from `/api/geo`, which returns the location Vercel derives from the request, rounded to a tenth of a degree. Nothing is stored or logged, there is no permission prompt, and no third party is involved. The function is `api/geo.ts` at the repository root, because the site deploys from there; its tests are in `packages/resume/api`.

## Where this departs from the handover

- **No Blender bake.** The handover recommended baking the desk's light. Everything on the desk can be moved and the sun moves in auto mode, so a bake would be wrong as soon as anything was touched. The scene is lit live with shadow maps, contact shadows and an HDRI instead.
- **No type sorts on the desk.** They read as dark sticks at this scale. Fewer, better objects.
- **Sliding does not nudge objects.** The sheet passes under things rather than pushing them; things resting on it ride along.
- **Touch is simpler.** Corners, the loupe, the stamp and the eraser can be dragged; a tap on the pencil takes it into the hand, after which a finger draws; a tap elsewhere moves the light or lets the marble go; swipes scroll. The sheet cannot be slid by touch, and phones show no desk objects.

Assets and licences are listed in `ATTRIBUTIONS.md`.
