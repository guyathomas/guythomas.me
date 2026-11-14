import * as THREE from 'three';
import { arrangeDesk } from './app/layout';
import { Lighting } from './app/lighting';
import { isFrozen, parseParams } from './app/params';
import { createPlay } from './app/play';
import { printSheet } from './app/print';
import { printPlain } from './app/printing';
import { Stamping } from './app/stamping';
import { Voices } from './audio/voices';
import { SheetHandling } from './interact/handling';
import { DeskObjects } from './interact/objects';
import { Pointer } from './interact/pointer';
import { CameraRig } from './scene/camera';
import { createDesk } from './scene/desk';
import { createEraser } from './scene/eraser';
import { createLampHead } from './scene/lamp';
import { createLoupe } from './scene/loupe';
import { createKit, createPencil } from './scene/props';
import { LightRig } from './scene/rig';
import { Stage } from './scene/stage';
import { createStamp } from './scene/stamp';
import { frameReading } from './scene/view';
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
        window.setTimeout(printPlain, 1150),
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
    mode: (mode) => {
      lighting.setMode(mode);
      controls.setMode(mode);
    },
    desk: () => {
      cameraRig.goal = cameraRig.goal === 1 ? 0 : 1;
      controls.setDesk(cameraRig.goal === 1);
      wake();
    },
    flip: () => {
      handling.turnOver();
      wake();
    },
    print: printPlain,
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
      rig.lampOn = true;
      cameraRig.goal = 0;
      controls.setDesk(false);
      wake();
    },
    sound: () => {
      if (voices.enabled) voices.disable();
      else voices.enable();
      controls.setSound(voices.enabled);
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
    firstPage: Math.floor((params.page ?? 1) - 1),
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

  const lighting = new Lighting(rig, params, frozen, () => wake());
  controls.setMode(lighting.mode);

  const pointer = new Pointer({
    canvas,
    camera,
    sheet,
    handling,
    objects,
    rig,
    cameraRig,
    frontLinks,
    lampHead: lampHead.group,
    wake,
    used: () => controls.used(),
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
      if (arrangeDesk(objects, sheet, window.innerWidth / 2 / framing.pxPerMetre, !homed)) homed = true;
      if (!placed) applyView();
      placed = true;
    }
    sheetCentre.set(handling.home.cx, 0, handling.home.cz);
    cameraRig.apply(framing, window.innerHeight, sheetCentre, sheet.height);

    lampHead.group.visible = cameraRig.blend > 0.02;
    lampHead.group.position.copy(rig.lamp.position);
    aim.copy(rig.lamp.target.position).sub(rig.lamp.position).normalize();
    lampHead.group.quaternion.setFromUnitVectors(down, aim);
    lampHead.bulb.emissiveIntensity = rig.lamp.intensity * 2.4;

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
    if (window.__sizeSheet() !== narrow) {
      location.reload();
      return;
    }
    // A hand full of pencil should not outlast the room for it.
    pointer.putDownPencil();
    arranged = false;
    stage.resize();
  });
  // If the graphics context goes, the plain sheet underneath takes over until it is back.
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

if (supported()) {
  start().catch((error) => {
    console.error(error);
    location.replace('/plain/');
  });
} else {
  location.replace('/plain/');
}
