# Handover: Living paper, an interactive resume

Rebuild the owner's resume site as a single piece: **a letterpress-printed sheet lying on a desk, which the viewer can handle.** Slide it, rake light across the impression, curl a corner, turn it over, look through a loupe.

This is a **complete rewrite**. Nothing about the existing site (stack, layout, components, styling, theme toggle, print flow) is a requirement. Only the resume's content carries over. Two other concepts (reactive ink, a generative engraved plate) were considered and dropped; do not build them.

| Route | What |
|---|---|
| `/` | The piece. |
| `/plain/` | A simply typeset HTML resume with a print stylesheet. The only print, PDF, and fallback path. |

## What matters, in order

1. **The full resume is readable the moment the page loads.** The owner's one firm constraint. Earlier concepts were rejected because content was hidden behind interaction. No intro, no "click to begin", no loader that outlasts a second, nothing gated. At rest, every word is as legible as a well-printed page.
2. **A rich, interactive experience.** This is what is being optimised. When richness conflicts with convenience (bundle size, simpler engineering, familiar tooling), richness wins. Depth comes from one convincing physical object that responds truthfully, not from a list of effects.
3. **Finish.** A frozen frame should pass for a photograph of a real object.

Everything else here is in service of those three and is negotiable if it gets in their way. Say so in the final report when you trade something off.

### "Readable immediately", concretely

- The first frame already shows the sheet, lit, at reading size: body text no smaller than about 15 CSS px equivalent on desktop, the sheet roughly square to the screen (a degree or two of casual rotation at most). Do not open on a wide establishing shot and then move in.
- Paint order: a pre-rendered still of the rest view (or the plain HTML) appears instantly, and the live scene takes over without a visible jump once it is ready. Heavy assets stream in after.
- The sheet is taller than the viewport at reading size. Scrolling travels the camera down the sheet. A key or pinch pulls back to see the whole desk; the same gesture returns.
- Handling may make text temporarily hard to read (mid-curl, flipped, slid half off screen). It must be obvious how to get back, the sheet settles flat when released, and a reset key and control return it to rest.
- The visible text does not have to be DOM text. It is rendered as part of the object. Keep a semantic copy of the resume in the HTML (visually hidden) for screen readers, find-in-page, and crawlers.
- The email address and website on the sheet must work as links (hit-test the sheet's UVs against link regions; show a pointer cursor).

### Explicitly not requirements

- Working with JavaScript disabled.
- Matching anything about the old page.
- Print support in the piece itself.
- Small bundles or avoiding heavy libraries.
- Astro, Tailwind, or any existing dependency.

## The medium and its rules

**Letterpress on heavy cotton rag paper, photographed on a wooden desk by a window, with one desk lamp.** Obey this in every pixel. Before writing code, expand these into `src/MEDIUM.md` and hold every state to it.

- **The impression.** Type is pressed *into* the sheet. Each stroke has soft shoulders; it catches light on the lip facing away from the lamp and falls into shadow on the lip facing it, and that reverses as the light moves. Depth varies a little across the sheet as real packing does. Heavier type bites deeper.
- **The ink.** Slightly uneven. A darker rim at stroke edges where ink squashed out, a faint salty texture in large solids, a touch of sheen where it sits on the surface. One or two ink colours at most, mixed by hand, not pure black.
- **The paper.** Thick (think 600 gsm cotton), with visible fibre and a soft tooth in raking light, a deckle edge or a clean guillotine cut showing its thickness, and a faint permanent curl so the shadow under it is never uniform. The back shows the reverse of the impression as a slight raised bruise.
- **How it moves.** Paper is stiff. It bends about one axis at a time and never stretches or drapes like cloth. It slides with friction and a little rotation, lifts from a corner, and settles with a small rock. It has weight.
- **The desk.** Its own real material (oiled wood with grain and wear), a few purposeful objects, a wide soft shadow under the sheet that tightens to a hard contact line where paper touches wood.
- **The light.** Daylight from a window and one warm desk lamp, mixed according to the time of day (see "Day, night, and auto"). Nothing glows. No bloom on type. Highlights are small and physical.
- **Flaws.** A slight misregistration if there is a second colour, a faint plate-edge mark, a thumb smudge near one edge, a pencilled proof mark. Sparingly: this is fine work, not distressed.

No cookie-cutter look: no glassmorphism, no neon, no gradient blobs, no default drop shadows, no default three.js materials, no stock paper tile stretched over a quad. Nothing on screen that is not part of the photograph, apart from one fading hint line and small, quiet controls.

**Typography and layout are part of the medium.** The owner chose a **classic serif** direction: an old-style book serif in the fine-press tradition, with true small caps, old-style figures in running text, and lining figures where numbers need to stand out. Design the sheet from scratch as a letterpress printer would: generous margins, restrained hierarchy, emphasis by small caps, italic, or a second colour rather than by digital tricks. No sans-serif on the sheet. It still has to work as a resume: scannable, clear dates and titles.

**Bar:** a frozen frame at `?view=rest` passes for a photograph in a letterpress studio's portfolio, and the resume is as readable as the real sheet would be in your hands.

## Content

- Source of truth: `packages/resume/src/data/resume.yaml` (`header` plus six `experience` entries with `title`, `company`, `location`, `date`, `achievements[]`). Keep it as the single content source; move or reshape the file freely.
- `*asterisks*` in achievements mark the owner's chosen emphasis (`*10 engineers*`, `*ARR 10x*`). Preserve it.
- Dates are free-text (`"Oct 2024 - Present"`). The career has gaps (Jun 2016 to Jun 2017, Jan 2019 to Apr 2019, Feb 2024 to Oct 2024) and two consecutive roles at one company. Parse them only if something needs it; the sheet prints them as written.
- Do not invent facts or numbers, and do not reword the existing resume. You may add structured fields only for values already stated in the text.
- The back of the sheet needs two new pieces of copy, stored in the yaml under a new `back` key (see "The back"). They are the only new writing in the project.
- The yaml holds the owner's email and phone. They belong on the sheet; never send them to an external service, analytics, or logs.
- The sheet must regenerate from the yaml at build time. Editing the yaml and rebuilding is the whole update flow.

## Technology

Free choice. Recommended default; change it if something gives a better result.

- **Vite + TypeScript**, static output, vanilla (no UI framework).
- **three.js**, or raw WebGL2 if it gives a better picture. Bundled from npm, no CDN. The only third-party request a finished page may make is Google Fonts; self-hosting fonts is better, since the typesetter needs them loaded before rasterising.
- **Blender**, scripted in Python, to build and bake the desk scene. It is installed on this machine and there is a Blender MCP for driving it live. Test bakes small with few samples first; check every output file after a job, since jobs can be cut short. Keep the Blender script in the repo so the scene is reproducible.
- **CC0 assets** (Poly Haven wood, HDRIs, fabric) are allowed where they clearly raise realism; list each in an attributions file. The sheet itself is made entirely in code.
- **Vitest** for pure logic. **Playwright** on the real GPU for screenshots, input scripting, and frame-rate measurement.

Fixed points:

- The repo is a bun + turborepo monorepo that also holds `packages/blog`. Leave the blog and the root wrapper alone. Everything inside `packages/resume` is replaceable. Run `bun install` at the root first (bun 1.3+ may add a harmless `"configVersion"` line to `bun.lock`).
- Output must be static files deployable on Vercel, plus the single geo edge function described under "Day, night, and auto"; update `packages/resume/vercel.json`.
- Work on a feature branch. `main` keeps the old site until the owner approves.

### Suggested layout

```
packages/resume/
  src/data/         yaml loader and types
  src/typeset/      resume -> laid-out page -> ink, height, and link-region maps
  src/sheet/        paper mesh, bend model, paper material and shaders
  src/scene/        desk, lamp, objects, baked assets, camera
  src/light/        solar position, lighting modes, location lookup and time zone table
  src/interact/     pointer and touch handling, drag physics, picking
  src/audio/        WebAudio voices, sound gate
  src/plain/        the plain HTML page and print stylesheet
  api/geo           the one edge function
  blender/          Python that builds and bakes the desk
```

Keep pure logic (layout, bend geometry, friction, solar position) free of GPU and DOM calls so it can be unit tested. One job per file.

## How to build it

### 1. The sheet's maps (the make-or-break piece)

Typeset the resume to a tall raster at build time or at load, then derive everything from it:

- **Ink map:** the typeset page with ink squash at edges and salt in solids. Albedo and a little roughness variation.
- **Height map:** the impression. Start from the ink coverage, soften the shoulders, scale by type weight, add slow variation for uneven packing. From it, a **normal map**. Light the deboss with the real scene light; do not fake it with offset shadows.
- **Paper maps:** fibre and tooth as height and normal, slight colour mottling, edge wear. Generated in code.
- **Link regions:** rectangles in UV space for the email and website.

Resolution budget: at rest the text must resolve at 2 device pixels per CSS pixel or better. A letter-proportioned sheet at roughly 4096 by 5300 covers a 900 CSS px wide sheet at DPR 2. Use mipmaps and anisotropic filtering so it holds up tilted. If texture sharpness at rest is not flawless, composite a dedicated high-density text pass for the rest view. Decide this by looking, early.

The typesetter is real work: line breaking, hanging bullets, emphasis runs, small caps, tracking. A simple, deterministic layout engine over canvas `measureText` is enough for one page; test it (line breaks stable, no overflow, nothing clipped, all yaml content present).

### 2. The paper as an object

- A subdivided mesh with thickness visible at the edges and a distinct back face.
- Bending as a **developable surface**: a cylinder or cone curl about a moving crease line, the standard page-curl model. No cloth simulation; cloth reads as fabric.
- Material: diffuse-dominant with soft forward scattering, so a lifted corner lets a little light through and the back glows faintly warm against the lamp. Ink is slightly glossier than paper.
- Shadows that change with height: a hard contact line where the sheet touches the desk, widening and softening as it lifts.

### 3. The desk

- A small, composed still life: oiled wood, the lamp (or just its light entering frame), a brass paperweight, a loupe, a pencil, perhaps a type sort or a tin of ink at the edge. Every object earns its place by being usable or by telling you this is a printer's desk. Fewer, better objects.
- Bake what does not move, as separate light contributions so day, night, and a moving sun can be mixed at runtime (see "Day, night, and auto"): sky fill, bounce, ambient occlusion, the desk's own shading. Keep the lamp as a live light so it can be moved, with a good soft shadow for the sheet and movable objects. Match the live environment to the bake so nothing looks pasted in.
- Camera: a long-ish lens looking down at a slight angle, shallow depth of field that keeps the whole sheet sharp at rest and softens the desk edges, subtle parallax with the pointer.

### 4. Interactions

Each must feel like handling a real thing: momentum, friction, weight, settle.

| Action | Result |
|---|---|
| Move the pointer | The lamp's light shifts slightly, so the impression visibly turns over as the highlight crosses it. This is the first-second response. |
| Drag the lamp, or its light | Rake the light from any side, low or high. Low angles make the deboss dramatic. |
| Drag the sheet | It slides and rotates about the grab point with friction, nudges objects it meets, and stops with a little overshoot. |
| Grab a corner | It curls up following the pointer. Release early and it falls back with a soft slap. Pull across and the sheet turns over. |
| The back | Printed, not blank: a short "about me" and a printer's note, over the raised reverse of the front's impression. See "The back". Turn it back the same way. |
| Pick up the loupe | Drag it over the sheet for a true magnified view: fibres, ink squash, the shoulder of the impression. |
| Lift the paperweight | The sheet's curl relaxes and a corner rises. Put it down and it flattens. |
| Scroll | The camera travels down the sheet at reading size. |
| Pull back (key or pinch) | See the whole desk; same gesture returns. |
| Click email or website | Opens it. |
| Reset (key and small control) | Sheet returns to rest, square and lit. |

For the curious, a few things nobody is told: the lamp's own switch works, a pencilled proof mark only shows in raking light, tapping the brass makes it ring, and in auto mode the window light is where the sun really is for the viewer.

One quiet hint line (for example "move the light, lift a corner") that fades after the first interaction. No tutorial, no HUD.

### 5. The back

The owner chose a printed back with two parts. Set it in the same serif, smaller and quieter than the front, like the reverse of a fine-press broadside. The raised reverse of the front's impression shows through around and under it.

- **About me.** A short personal paragraph (roughly 40 to 80 words). The owner has not supplied this text. Draft it using only facts already in the resume, in a plain first-person voice, store it in the yaml as `back.about`, and flag it clearly in the final report as a draft awaiting the owner's edit. Do not add claims, hobbies, or personality details that are not in the source.
- **Printer's note (colophon).** Two or three lines on how the piece was made: the typefaces, that the sheet is typeset and "printed" in code, the tools. State only what is true of the actual build, and write it last so it is accurate. Store as `back.colophon`.

Both must also appear in the hidden semantic copy and on `/plain/`.

### 6. Day, night, and auto

The owner wants a warm printer's desk with three lighting modes and a small three-state control (auto, day, night). Default is **auto**. Remember the viewer's choice in `localStorage`.

- **Day:** daylight through the window is the key light; the lamp is off or contributes little. Bright, airy, cool-to-neutral light with warm wood.
- **Night:** the room is dark, the lamp is the key light, a pool of warm light on the sheet with deep falloff across the desk. The sheet must stay fully readable: the lamp's pool covers it at rest.
- **Auto:** the scene follows the real sun for the viewer. Compute solar elevation and azimuth from the viewer's local date, time, and approximate position, and drive the window light's direction, colour, and strength continuously from it: low warm light at sunrise and sunset, high neutral light at midday, blue dusk, then night with the lamp switching itself on as the sun goes down. It should be possible to leave the page open and watch the light move.

Getting the viewer's position, in order of preference:

1. **IP-derived location from Vercel's own geo headers (default).** Vercel attaches approximate location to every request (`x-vercel-ip-latitude`, `x-vercel-ip-longitude`, `x-vercel-ip-timezone`, and related headers). Add one tiny edge function (for example `/api/geo`) that returns only latitude, longitude, and time zone as JSON, rounded to one decimal place. Same origin, no API key, no third party, no permission prompt. Verify the current header names and how to read them against Vercel's documentation before relying on them.
2. **Time zone fallback.** If that request fails or returns nothing (local dev, a non-Vercel host, a blocked request), read `Intl.DateTimeFormat().resolvedOptions().timeZone` and map the zone to an approximate latitude and longitude with a small bundled table.
3. Do not prompt for browser geolocation, and do not call a third-party IP service such as ip-api.com: its free endpoint is understood to be HTTP-only (so an HTTPS page cannot call it), rate limited, and non-commercial, and it would send every visitor's IP to a third party.

Rules: the lookup never delays first paint (start with the time zone estimate, refine when the response arrives, and ease the light to the new position). Do not store, log, or forward the location; it is used once, in memory, to place the sun. This is the one exception to "static files only": the site is static plus this single function.

Implementation notes:

- Solar position is a small, pure function (date, latitude, longitude in; elevation, azimuth out). Unit test it against known values (solstices, equinoxes, a few cities).
- Baked lighting has to support a moving sun. Bake the light contributions separately (sky fill, sun key, lamp, ambient occlusion) and combine them at runtime with weights and colours, with the sun as a live shadow-casting light or as several baked sun positions blended. Decide by what looks best; a single baked lighting state cannot serve all three modes.
- The window itself can stay out of frame. Its light, and perhaps the shadow of a glazing bar or a plant crossing the desk, is enough to tell the time of day.
- Dragging the lamp or its switch works in every mode. In auto, a manual lamp change holds until the next dusk or dawn transition.
- Transitions between modes take a second or two, like a dimmer, not a cut.
- The deboss must read well in all three modes. Check the worst case (overcast midday, sun high and flat) and keep enough directional light to model the impression.

### 7. Sound

Paper has a voice: the dry slide across wood, the flick of a released corner, the soft slap as it lands, the lamp switch, brass on wood. All synthesised with WebAudio, driven by the same velocities as the motion. Off until the viewer clicks a clear "Enable sound" control. The piece must feel complete without it.

### 8. Small screens and touch

At 390px wide the sheet fills the width at reading size and the desk is mostly implied at the edges. Vertical swipes scroll; a deliberate drag from a corner curls; two fingers slide and rotate the sheet; device orientation may steer the light. It can be a simpler staging, but it must still be the same object, and the deboss must still catch the light.

## Rules

| Area | Rule |
|---|---|
| First second | Alive from the first frame (light on the surface, a settled shadow, perhaps the faintest lamp flicker) and answers the pointer within the first second. Idle motion never competes with reading. |
| Performance | 60 fps at 1920x1080 on a recent laptop GPU. Cap device pixel ratio at 2. Lower internal resolution or shadow quality when frames run long, never the text's resolution at rest. Render on demand: when nothing is moving, stop drawing. |
| Reduced motion | Under `prefers-reduced-motion`, no idle motion or camera drift; direct manipulation still works. |
| Freeze states | `?view=<name>` pins named states (at least `rest`, `raking`, `corner-lifted`, `mid-flip`, `back`, `loupe`, `desk`), `?mode=` (`auto`, `day`, or `night`) sets the lighting mode, `?sun=<local hour, e.g. 6.5>` and optional `?lat=`/`?lon=` pin the auto sun, `?t=<seconds>` freezes time, and `?light=x,y` sets the lamp. Deterministic, for screenshots and for sending the owner to the best moment. |
| Failure | If WebGL2 is unavailable or init throws, redirect to `/plain/`. Never a blank page. |
| Plain copy | `/plain/` is linked unobtrusively from the piece (a small "plain copy" control). It is well typeset in the same typefaces, prints cleanly on one letter page, and is generated from the same yaml. |
| Originality | Original work. No copy of a specific existing site, product, or brand. |

## Order of work

1. **Scaffold.** Vite, TypeScript, tests, yaml loader and types, `/plain/`. One small commit.
2. **Spike the sheet.** Typeset raster to ink, height, and normal maps on a flat sheet under one movable light, on a neutral ground. Answer two questions by looking: is the text razor sharp at rest, and does the deboss read as real pressed paper when the light moves? Do not build anything else until both are yes. This is the piece; everything after is staging.
3. **Typography and layout** of the sheet, designed properly.
4. **Desk scene:** Blender build and separated light bakes, camera, matching live light.
5. **Day, night, and auto lighting**, with the solar position module.
6. **Handling:** slide, corner curl, flip, the printed back.
7. **Objects:** lamp, loupe, paperweight.
8. **Sound, touch, small screens, fallbacks.**
9. **Improvement rounds.**

## Improvement rounds

A working v1 is the start, not the finish.

1. Check v1 in a real browser on the real GPU: load, send input steps (move, drag, click, key, scroll, touch), take screenshots, read the console. Fix every error.
2. **Run at least 6 rounds.** In each:
   - Take four or more screenshots using the freeze states: rest, raking light, mid-curl, the back, the loupe, the desk; cover day, night, and auto at sunrise, midday, and dusk; cover 1920x1080 and 390px across rounds.
   - Read every screenshot.
   - Judge as a harsh art director comparing with photographs of real letterpress work on real desks, not with other websites. Find reference photographs and compare directly.
   - Name the three weakest things. Fix them. Check again.
   - Re-confirm the first rule: full resume readable on load, crisp at rest.
3. Also judge feel, which screenshots cannot show: script drags at different speeds and record short captures. Does the sheet have weight? Does the corner fall believably?
4. Measure the frame rate while handling the sheet at 1920x1080. Under 50 fps: make it faster before adding anything.
5. Stop when one more round would not be visible to the owner. Log each round (three weaknesses, what changed) in the PR description.

Spend early rounds on the sheet at rest (impression, ink, fibre, light, type), then on motion, then on the desk. The object the viewer is reading matters more than anything around it.

## Delivery

- One branch, one PR, one Vercel preview.
- Commits: `<type>(<scope>): <summary>`, 50 characters max, imperative, no AI attribution lines.
- Before handing back: build and tests pass; checked at desktop and phone sizes, with reduced motion on and with WebGL disabled; frame-rate numbers recorded; yaml edit and rebuild verified to update the sheet; diff free of debug code and TODOs. Two GitHub workflows run on PRs; watch them to green.
- Report to the owner, extremely concise, five lines or fewer: what to do in the first five seconds, the best moment and its freeze URL, what it was built with, any known flaw, what remains.

## Defaults chosen (confirm only if one blocks you)

| Question | Default |
|---|---|
| Is the visible text selectable DOM text? | No. It is part of the object; a hidden semantic copy covers accessibility and search, and the links work by hit-testing. |
| Stack | Vite, TypeScript, three.js, Blender-baked desk. |
| Old site | Replaced inside `packages/resume` on the branch; `main` untouched until approved. |
| Print / PDF | `/plain/` only. |
| Viewer location for auto lighting | Vercel geo headers via one edge function, time zone table as fallback. No permission prompt, no third-party service. |
| About-me copy | Agent drafts from resume facts only; owner edits before launch. |
| Sheet format | US Letter proportions, one page. |
