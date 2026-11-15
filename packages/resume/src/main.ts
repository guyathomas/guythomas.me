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
import { createLampHead, SHADE_RADIUS } from './scene/lamp';
import { createLoupe } from './scene/loupe';
import { createKit, createPencil } from './scene/props';
import { LightRig } from './scene/rig';
import { Stage } from './scene/stage';
import { createStamp } from './scene/stamp';
import { frameReading, METRES_PER_SHEET_PX } from './scene/view';
import { fontsReady } from './typeset/raster';
import { Controls } from './ui/controls';

declare global {
  interface Window {
    __sizeSheet(): boolean;
    __stats?: Stage['stats'];
  }
}

const FREE_CORNER_LIFT = [0.0012, 0.0038, 0.0024, 0.0034];

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
  const stage = new Stage(canvas);
  stage.frozenTime = params.time;
  stage.continuous = params.fps;
  window.__stats = stage.stats;
  const { scene, camera, renderer } = stage;
  camera.layers.enable(1);

  // The sheet.
  const { sheet, frontLinks, sheetWidthPx, inks, pencil } = printSheet(renderer, frontEl, backEl, narrow);
  const stamping = new Stamping(sheet, inks);
  scene.add(sheet.group);

  // The desk and the things on it.
  const desk = createDesk(renderer.capabilities.getMaxAnisotropy(), () => stage.invalidate());
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

  // Light.
  const rig = new LightRig(scene, renderer);
  rig.lampAim.set(-0.02, 0, -sheet.height * 0.2);
  if (params.light) rig.lampAim.set(params.light[0] * 0.3, 0, params.light[1] * 0.3);
  rig.place();
  rig.loadEnvironment(() => stage.invalidate());
  const lampHead = createLampHead();
  scene.add(lampHead.group);

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
      pointer.dropPencil();
      play.reset();
      objects.home();
      rig.lampAim.set(-0.02, 0, -sheet.height * 0.2);
      rig.lampNudge.set(0, 0);
      rig.place();
      cameraRig.goal = 0;
      controls.setDesk(false);
      wake();
    },
    lamp: () => {
      lighting.toggleLamp();
      voices.click();
    },
  });


  const cameraRig = new CameraRig(camera, still);
  const handling = new SheetHandling(
    sheet,
    {
      moved: (from, to) => objects.carry(sheet, from, to),
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
    game: roomy,
    firstPage: Math.floor((params.page ?? 1) - 1),
    turnOver: () => {
      handling.turnOver();
      wake();
    },
    // The last page passed: the proof is stamped, without sending it to the printer.
    finished: () => {
      const { cx, cz } = sheet.pose;
      if (stamping.press(cx, cz + sheet.height * 0.2, 0.1)) voices.stamp();
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

  // The lamp's head is its switch. It is found on the screen, so that it can be pressed in either view.
  const lampAt = new THREE.Vector3();
  const lampRim = new THREE.Vector3();
  const onLamp = (clientX: number, clientY: number): boolean => {
    const toScreen = (v: THREE.Vector3) => v.project(camera).set(((v.x + 1) / 2) * window.innerWidth, ((1 - v.y) / 2) * window.innerHeight, 0);
    toScreen(lampAt.copy(lampHead.group.position));
    toScreen(lampRim.copy(lampHead.group.position).add(new THREE.Vector3(SHADE_RADIUS * lampHead.group.scale.x, 0, 0)));
    const reach = Math.max(26, lampAt.distanceTo(lampRim));
    return Math.hypot(clientX - lampAt.x, clientY - lampAt.y) < reach;
  };

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
    onLamp,
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
    toggleLamp: () => {
      lighting.toggleLamp();
      voices.click();
    },
    tools: play.tools,
    poke: play.poke,
  });

  const down = new THREE.Vector3(0, -1, 0);
  const aim = new THREE.Vector3();
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
      // The lamp leans in at the top left of the picture as it is when not scrolled, smaller where the picture is small.
      const left = framing.x - halfWidth;
      const top = framing.z - (window.innerHeight / 2 + window.scrollY) / framing.pxPerMetre;
      const shade = Math.min(SHADE_RADIUS, Math.max(0.016, halfWidth * 0.3));
      lampHead.group.scale.setScalar(shade / SHADE_RADIUS);
      // With desk to spare the whole head is in the picture; without, it only looks in over the corner.
      const inset = roomy ? 1.75 : 0.6;
      rig.lampHome.set(left + shade * inset, 0.07 + shade * 2, top + shade * inset);
      rig.place();
      // Thrown things stop at the edge of what can be seen, so nothing is lost.
      objects.bounds = { x0: left + 0.015, x1: left + halfWidth * 2 - 0.015, z0: top + 0.015, z1: sheet.height / 2 + 0.03 };
      if (!placed) applyView();
      placed = true;
    }
    sheetCentre.set(handling.home.cx, 0, handling.home.cz);
    cameraRig.apply(framing, window.innerHeight, sheetCentre, sheet.height);

    lampHead.group.position.copy(rig.head);
    aim.copy(rig.lamp.target.position).sub(rig.head).normalize();
    lampHead.group.quaternion.setFromUnitVectors(down, aim);
    lampHead.bulb.emissiveIntensity = rig.lamp.intensity * 2.4;
    lampHead.bulb.color.set(rig.lamp.intensity > 0.02 ? '#fff4dc' : '#6f6a5f');

    play.render(renderer);
    loupe.sync();
    if (loupe.group.visible) loupe.renderView(renderer, scene);
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

  wake();
  await desk.ready.catch(() => undefined);
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('live')));
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
