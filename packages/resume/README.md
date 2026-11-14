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
| Drag a corner | Curl it; pull it across to turn the sheet over |
| Drag the loupe, stamp, pencil | Move them. The loupe magnifies. Let go while moving and they slide on, bump each other, and the pencil rolls |
| Set the stamp down on the sheet | Leaves an "OK to print" mark and opens the print dialog for the plain copy |
| Click the email or website | Opens it |
| `F` / `R` / `D` / `L` | Turn over / reset / desk view / lamp switch |
| `Cmd/Ctrl+P`, or Print | Prints the plain copy, not the picture of the desk |

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
| `fps` | Render continuously and record the frame rate in `window.__stats` |

`tools/shot.mjs` drives Chrome on the real GPU with scripted input and takes screenshots.

## Viewer location

Auto lighting needs a rough position. It starts from the browser's time zone (a bundled table, no network) and refines it from `/api/geo`, which returns the location Vercel derives from the request, rounded to a tenth of a degree. Nothing is stored or logged, there is no permission prompt, and no third party is involved.

## Where this departs from the handover

- **No Blender bake.** The handover recommended baking the desk's light. Everything on the desk can be moved and the sun moves in auto mode, so a bake would be wrong as soon as anything was touched. The scene is lit live with shadow maps, contact shadows and an HDRI instead.
- **No type sorts on the desk.** They read as dark sticks at this scale. Fewer, better objects.
- **Sliding does not nudge objects.** The sheet passes under things rather than pushing them; things resting on it ride along.
- **Touch is simpler.** Corners, the loupe and the stamp can be dragged; a tap moves the light; swipes scroll. The sheet cannot be slid by touch.

Assets and licences are listed in `ATTRIBUTIONS.md`.
