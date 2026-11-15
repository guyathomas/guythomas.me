import * as THREE from 'three';
import { CornerDraught } from './app/ear';
import { arrangeDesk, hasDeskRoom } from './app/layout';
import { Lighting } from './app/lighting';
import { isFrozen, parseParams } from './app/params';
import { createPlay } from './app/play';
import { printSheet } from './app/print';
import { installPrinting, printing, printSheetCopy } from './app/printing';
import { Stamping } from './app/stamping';
import { Voices } from './audio/voices';
import { SheetHandling } from './interact/handling';
import { DeskObjects } from './interact/objects';
import { Pointer } from './interact/pointer';
import { CameraRig } from './scene/camera';
import { createBell } from './scene/bell';
import { createDesk } from './scene/desk';
import { createEraser } from './scene/eraser';
import { createLoupe } from './scene/loupe';
import { createKit, createPencil } from './scene/props';
import { LightRig } from './scene/rig';
import { Stage } from './scene/stage';
import { createStamp } from './scene/stamp';
import { frameReading, METRES_PER_SHEET_PX } from './scene/view';
import { planScroll, viewAt, WHOLE, type ScrollPlan } from './scene/scroll';
import { fontsReady } from './typeset/raster';
import { Controls } from './ui/controls';
import { ToolTray } from './ui/tray';

declare global {
  interface Window {
    __sizeSheet(reading?: boolean): boolean;
    __stats?: Stage['stats'];
  }
}

const FREE_CORNER_LIFT = [0.0012, 0.0038, 0.0024, 0.0034];

/** Hands the page back to the browser for a moment, so that starting up is several short jobs and not one long one. */
const breathe = () => new Promise<void>((resolve) => window.setTimeout(resolve));

async function start(): Promise<void> {
  const canvas = document.getElementById('gl') as HTMLCanvasElement;
  const frontEl = document.getElementById('sheet-front') as HTMLElement;
  const backEl = document.getElementById('sheet-back') as HTMLElement;
  const params = parseParams(location.search);
  const frozen = isFrozen(params);
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = document.documentElement.classList.contains('narrow');

  // Is there desk beside the sheet for the pencil and the rest? If not, the back carries a note in place of the game.
  const deskRoom = (): boolean => {
    const shown = frontEl.getBoundingClientRect().width;
    const sheetWidth = (narrow ? 372 : 816) * METRES_PER_SHEET_PX;
    return hasDeskRoom(sheetWidth, (window.innerWidth / 2) * (sheetWidth / shown));
  };
  const roomy = deskRoom();
  document.documentElement.classList.toggle('no-desk', !roomy);

  await fontsReady();
  const stage = new Stage(canvas, narrow);
  stage.frozenTime = params.time;
  stage.continuous = params.fps;
  window.__stats = stage.stats;
  const { scene, camera, renderer } = stage;
  camera.layers.enable(1);

  // The sheet.
  const { sheet, frontLinks, sheetWidthPx, inks, pencil } = printSheet(renderer, frontEl, backEl, narrow);
  const stamping = new Stamping(sheet, inks);
  // Setting the type and making the paper are the heavy steps: let the page breathe between them and the rest.
  await breathe();
  scene.add(sheet.group);

  // The desk and the things on it.
  // Something outside the usual run of things has changed the picture (a texture arrived, the sheet was stamped):
  // draw everything afresh for a few frames.
  let fresh = 4;
  const refresh = () => {
    fresh = 4;
    stage.invalidate();
  };
  let settle: () => void = () => undefined;
  const settled = new Promise<void>((resolve) => (settle = resolve));
  const desk = createDesk(renderer.capabilities.getMaxAnisotropy(), refresh, !narrow, settled);
  scene.add(desk.mesh);
  const voices = new Voices();
  const kit = createKit();
  // What follows a stamp: it goes back to its place, then the printer opens.
  let stampRun: number[] = [];
  const cancelStampRun = () => {
    stampRun.forEach((id) => window.clearTimeout(id));
    stampRun = [];
  };
  const objects = new DeskObjects((item, byHand) => {
    // The stamp set down on the sheet passes it for press: a mark, then the printer.
    if (item.prop.name === 'stamp' && byHand && !handling.busy && stamping.press(item.x, item.z, item.angle)) {
      voices.stamp();
      refresh();
      cancelStampRun();
      stampRun = [
        window.setTimeout(() => {
          objects.sendHome(item);
          wake();
        }, 320),
        window.setTimeout(printSheetCopy, 1150),
      ];
    } else {
      voices.tap();
    }
    stage.invalidate();
  }, still);
  const blobFor = (w: number, d: number, o: number) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: kit.blobTexture, color: 0x000000, transparent: true, opacity: o, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.scale.set(w, d, 1);
    mesh.renderOrder = 2;
    return mesh;
  };
  const loupe = createLoupe(kit, blobFor);
  objects.add(createStamp(kit), [-0.012, 0.012]);
  objects.add(loupe, [0, 0.13]);
  const pencilItem = objects.add(createPencil(kit), [-0.077, 0.085]);
  const eraserItem = objects.add(createEraser(kit), [-0.012, 0.012]);
  objects.add(createBell(kit));
  for (const item of objects.items) scene.add(item.prop.group, item.prop.blob);
  scene.add(loupe.group.userData.glass as THREE.Object3D);

  await breathe();

  // Light.
  const rig = new LightRig(scene, renderer);
  rig.loadEnvironment(refresh, narrow);

  const controls = new Controls({
    desk: () => {
      cameraRig.goal = cameraRig.goal === 1 ? 0 : 1;
      controls.setDesk(cameraRig.goal === 1);
      wake();
    },
    flip: () => {
      handling.turnOver();
      wake();
    },
    cancel: () => pointer.putDownPencil(),
    launch: () => play.launch(),
    erase: () => void pointer.turnPencil(),
    reset: () => {
      handling.reset();
      cancelStampRun();
      stamping.clear();
      refresh();
      pointer.dropPencil();
      play.reset();
      objects.home();
      cameraRig.goal = 0;
      window.scrollTo(0, 0);
      controls.setDesk(false);
      wake();
    },
  });


  const cameraRig = new CameraRig(camera, still);
  const handling = new SheetHandling(
    sheet,
    {
      grasped: () => objects.board(sheet),
      moved: (from, to) => objects.carry(from, to),
      slide: (speed) => voices.slide(speed),
      flick: () => voices.flick(),
      slap: (strength) => voices.slap(strength),
    },
    still,
  );

  const ear = new CornerDraught(sheet, handling, still);

  // Pencil and paper: drawing, and the marble run on the back.
  const play = createPlay({
    sheet,
    handling,
    objects,
    pencilItem,
    eraserItem,
    layers: pencil,
    voices,
    wake,
    desk: roomy,
    firstPage: Math.floor((params.page ?? 1) - 1),
    turnOver: () => {
      handling.turnOver();
      wake();
    },
    // The last page passed: the proof is stamped, without sending it to the printer.
    finished: () => {
      const { cx, cz } = sheet.pose;
      if (stamping.press(cx, cz + sheet.height * 0.2, 0.1)) voices.stamp();
      refresh();
    },
  });

  // One ticker drives everything that moves, and stops when nothing does.
  const sheetCentre = new THREE.Vector3();
  const tick = (dt: number): boolean => {
    let moving = handling.step(dt);
    moving = objects.step(dt) || moving;
    moving = rig.step(dt) || moving;
    moving = cameraRig.step(dt) || moving;
    moving = settleCorners(dt) || moving;
    moving = ear.step(dt) || moving;
    moving = trimBack(dt) || moving;
    moving = play.step(dt) || moving;
    return moving;
  };
  function wake(): void {
    stage.addTicker(tick);
    stage.invalidate();
  }

  // The paper's own curl: its corners stand a little off the desk.
  function settleCorners(dt: number): boolean {
    let changed = false;
    for (let i = 0; i < 4; i++) {
      const goal = narrow ? FREE_CORNER_LIFT[i] * 0.5 : FREE_CORNER_LIFT[i];
      const now = sheet.cornerLift[i];
      if (Math.abs(goal - now) < 0.00002) continue;
      sheet.cornerLift[i] = still ? goal : now + (goal - now) * (1 - Math.exp(-dt * 5));
      changed = true;
    }
    if (changed && !handling.busy) sheet.update();
    return changed;
  }

  const lighting = new Lighting(rig, params, () => wake());

  const tray = new ToolTray(
    (name) => pointer.useTool(pointer.toolInUse === name ? null : name),
    () => play.launch(),
  );

  // On a phone the sheet is far longer than the game's board. While the back is up and lying still, only the
  // board's length of it is shown: the rest is drawn back out of sight, and returns before the sheet is turned.
  const playing = () => !roomy && !handling.frontUp && !handling.busy;
  const cut = new THREE.Plane(new THREE.Vector3(0, 0, -1), 10);
  const whole = sheet.height + 0.05;
  let shown = whole;
  if (!roomy) {
    renderer.localClippingEnabled = true;
    sheet.clipTo(cut);
  }
  function trimBack(dt: number): boolean {
    if (roomy) return false;
    const goal = playing() ? play.backFoot : whole;
    const before = shown;
    // It goes away gently, but is all there the moment the sheet is taken up.
    shown = goal > shown || still ? goal : Math.max(goal, shown - Math.max(0.004, (shown - goal) * (1 - Math.exp(-dt * 7))));
    cut.constant = handling.home.cz - sheet.height / 2 + shown;
    return shown !== before;
  }
  let hush = 0;
  let hushing = false;
  const pointer = new Pointer({
    canvas,
    camera,
    sheet,
    handling,
    objects,
    rig,
    cameraRig,
    frontLinks,
    // The bell turns the desk's sounds on, and off again.
    ring: () => {
      window.clearTimeout(hush);
      if (voices.enabled && !hushing) {
        // A last, shorter note, then quiet.
        voices.bell(0.5);
        hushing = true;
        hush = window.setTimeout(() => {
          hushing = false;
          voices.disable();
        }, 500);
      } else {
        hushing = false;
        voices.enable();
        voices.bell(1);
      }
    },
    wake,
    footHidden: () => !roomy && shown < sheet.height - 0.01,
    tools: play.tools,
    poke: play.poke,
  });

  // The fitted view: scrolling first brings the camera in to reading size, then moves it down the sheet.
  const fitted = document.documentElement.classList.contains('fit');
  let plan: ScrollPlan | null = null;

  // Everything that decides what the shadows and the loupe show, as numbers to compare from frame to frame.
  let before: number[] = [];
  const changed = (): boolean => {
    const { pose, curl } = sheet;
    const now = [pose.cx, pose.cz, pose.a, pose.b, pose.c, pose.d, sheet.drop, sheet.ear, ...sheet.cornerLift, cut.constant];
    if (curl) now.push(curl.mx, curl.mz, curl.nx, curl.nz);
    for (const item of objects.items) {
      now.push(item.x, item.z, item.angle, item.lift, item.rolled, item.prop.group.visible ? 1 : 0);
      if (item.hand) now.push(item.hand.x, item.hand.z, item.hand.touching ? 1 : 0, item.hand.flipped ? 1 : 0);
    }
    for (const light of [rig.sun, rig.windowGlow, rig.lamp]) now.push(light.position.x, light.position.y, light.position.z, light.intensity, light.visible ? 1 : 0);
    now.push(rig.sky.intensity, rig.exposure);
    const same = now.length === before.length && now.every((value, i) => value === before[i]);
    before = now;
    return !same;
  };

  let arranged = false;
  let placed = false;
  let homed = false;
  stage.beforeRender = () => {
    const framing = frameReading(frontEl.getBoundingClientRect(), sheetWidthPx, window.innerWidth, window.innerHeight);
    if (!arranged) {
      arranged = true;
      // Objects are laid out once, the first time there is room; after that a resize only shows or hides them.
      const halfWidth = window.innerWidth / 2 / framing.pxPerMetre;
      if (arrangeDesk(objects, sheet, halfWidth, !homed)) homed = true;
      const left = framing.x - halfWidth;
      // The fitted picture stays put while the page scrolls under it; a phone's sheet moves with the page.
      const top = framing.z - (window.innerHeight / 2 + (fitted ? 0 : window.scrollY)) / framing.pxPerMetre;
      if (fitted) {
        const most = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--read')) || 1;
        plan = planScroll(window.innerHeight, framing.pxPerMetre, sheet.height, most, 44);
        document.documentElement.style.setProperty('--scroll', `${Math.round(plan.stretch + plan.travel)}px`);
      }
      // Thrown things stop at the edge of what can be seen, so nothing is lost.
      objects.bounds = { x0: left + 0.015, x1: left + halfWidth * 2 - 0.015, z0: top + 0.015, z1: sheet.height / 2 + 0.03 };
      if (!placed) applyView();
      placed = true;
    }
    sheetCentre.set(handling.home.cx, 0, handling.home.cz);
    // Come closer, and the camera frames a part of the desk instead of the whole.
    const zoom = plan && cameraRig.goal === 0 ? viewAt(plan, window.scrollY) : WHOLE;
    const shown = { pxPerMetre: framing.pxPerMetre * zoom.scale, x: framing.x + zoom.x, z: framing.z + zoom.z };
    cameraRig.apply(shown, window.innerHeight, sheetCentre, sheet.height);

    // Where there is no desk to pick a pencil up from, the two tools are offered while the back is up.
    const play1 = playing();
    if (!play1 && tray.shown && pointer.toolInUse) pointer.useTool(null);
    if (play1 !== tray.shown) {
      // The board is at the head of the page, and there is nothing below it to scroll to.
      if (play1) window.scrollTo(0, 0);
      document.documentElement.classList.toggle('back-up', play1);
    }
    tray.show(play1, pointer.toolInUse, play.waiting);

    // Has anything on the desk, or its light, moved since the last frame? If not, the shadows and the view
    // through the loupe are as they were, and only the camera has moved.
    const drawn = play.render(renderer);
    const moved = changed();
    if (moved || fresh > 0) stage.shadowsStale = true;
    loupe.sync();
    if (loupe.group.visible && (moved || drawn || fresh > 0)) loupe.renderView(renderer, scene);
    if (fresh > 0) fresh--;
    pointer.syncGrips();
  };

  // Freeze states: pin the piece to a named moment.
  function applyView(): void {
    switch (params.view) {
      case 'raking':
        if (!params.mode) lighting.setMode('night');
        rig.rake = 1;
        rig.place();
        break;
      case 'corner-lifted':
      case 'mid-flip':
      case 'back':
        handling.pose(params.view);
        break;
      case 'loupe':
        {
          const item = objects.find('loupe');
          if (item) objects.move(item, -0.012, -sheet.height / 2 + 0.047, -2.2);
        }
        break;
      case 'desk':
        cameraRig.goal = cameraRig.blend = 1;
        controls.setDesk(true);
        break;
      default:
        break;
    }
    if (frozen) lighting.refresh(true);
  }

  window.addEventListener('scroll', () => stage.invalidate(), { passive: true });
  window.addEventListener('resize', () => {
    // The sheet is printed for the room it has; a different room wants a fresh one.
    // The printer lays the page out its own way; that is not a new window.
    if (printing()) return;
    if (window.__sizeSheet() !== narrow || deskRoom() !== roomy) {
      location.reload();
      return;
    }
    // A hand full of pencil should not outlast the room for it.
    pointer.putDownPencil();
    arranged = false;
    fresh = 4;
    stage.resize();
  });
  // If the graphics context goes, the sheet of type underneath takes over until it is back.
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    document.documentElement.classList.remove('live');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    document.documentElement.classList.add('live');
    play.stale();
    refresh();
    wake();
  });
  if (!frozen) {
    // Once, soon after opening, a draught lifts the corner: a hint that the sheet turns over.
    window.setTimeout(() => {
      ear.stir();
      wake();
    }, 2600);
    window.setInterval(() => lighting.refresh(false), 60000);
    void lighting.refine();
  }

  // Shaders are built in the background where the browser can, instead of stalling the first frame.
  await Promise.all([renderer.compileAsync(scene, camera).catch(() => undefined), desk.ready.catch(() => undefined)]);
  wake();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document.documentElement.classList.add('live');
      // The large textures come only now, once the piece is up.
      window.setTimeout(settle, 400);
    }),
  );
}

function supported(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/** Without the scene, the sheet of type the page first paints is the page. */
function fallBack(): void {
  // Sized for reading, and free to scroll.
  window.__sizeSheet(true);
  document.documentElement.classList.remove('live');
  document.documentElement.classList.add('flat');
}

installPrinting();
if (supported()) {
  start().catch((error) => {
    console.error(error);
    fallBack();
  });
} else {
  fallBack();
}
