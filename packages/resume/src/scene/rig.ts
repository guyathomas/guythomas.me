import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import type { LightState } from '../light/state';

/** The pattern the window throws: panes of light crossed by glazing bars, with a plant at one side. */
/**
 * `bare` leaves out the glazing bars, for a phone: its picture is a strip of desk seen so close that a bar's
 * shadow is a broad grey smear across the sheet rather than the line of a window.
 */
function windowCookie(bare: boolean): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  const bar = (x: number, y: number, w: number, h: number, soft: number) => {
    const steps = 14;
    for (let i = 0; i < steps; i++) {
      const grow = (soft * i) / steps;
      ctx.fillStyle = `rgba(0,0,0,${0.16})`;
      ctx.fillRect(x - grow, y - grow, w + grow * 2, h + grow * 2);
    }
  };
  // Outer frame, so the pool of sun has an edge.
  bar(0, 0, size, 60, 26);
  bar(0, size - 60, size, 60, 26);
  bar(0, 0, 60, size, 26);
  bar(size - 60, 0, 60, size, 26);
  // Glazing bars.
  if (!bare) {
    bar(size * 0.36, 0, 20, size, 12);
    bar(size * 0.68, 0, 20, size, 12);
    bar(0, size * 0.47, size, 24, 12);
  }

  // A pot plant on the sill: soft leaf shadows in one corner.
  let seed = 11;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 46; i++) {
    const x = size * (0.7 + random() * 0.3);
    const y = size * (0.5 + random() * 0.46);
    const length = 40 + random() * 90;
    const angle = -1.2 + random() * 1.6;
    for (let s = 0; s < 6; s++) {
      ctx.fillStyle = 'rgba(0,0,0,0.11)';
      ctx.beginPath();
      ctx.ellipse(x, y, length + s * 3, length * 0.26 + s * 3, angle, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const LAMP_COLOUR = new THREE.Color('#fff0dd');
/** Where the lamp's light is dropped to, from the middle of the sheet, to rake across it. */
const RAKE_OFFSET = new THREE.Vector3(-0.36, 0.055, -0.04);

/**
 * The lights: the sun through the window, the sky filling the room, the soft
 * glow of the window itself, and after dark the room's own light from out of the picture.
 */
export class LightRig {
  readonly sun = new THREE.SpotLight('#ffffff', 0, 0, 0.21, 0.35, 0);
  readonly windowGlow = new THREE.DirectionalLight('#ffffff', 0);
  readonly sky = new THREE.HemisphereLight('#ffffff', '#3a2a1c', 0);
  /** The room's light after dark: a warm lamp somewhere off the top left of the picture. */
  // A spot, not a bare point: one shadow map aimed at the desk is far finer than a point light's six spread round the room.
  readonly lamp = new THREE.SpotLight(LAMP_COLOUR, 0, 3, 0.62, 0.6, 2);
  /** Where the raking light is centred, for the freeze state. */
  readonly lampAim = new THREE.Vector3(0, 0, 0);
  /** Where that light is. */
  readonly lampHome = new THREE.Vector3(-0.5, 0.72, -0.5);
  exposure = 1;
  /** 0 is the lamp's normal height; 1 drops it almost to the desk, off to one side, to rake the light. */
  rake = 0;

  private readonly current = { sun: 0, sky: 0, lamp: 0, night: 0 };
  private target: LightState | null = null;
  private readonly sunDirection = new THREE.Vector3(0.3, 0.6, -0.7).normalize();
  private readonly sunColour = new THREE.Color();
  private readonly skyColour = new THREE.Color();

  /**
   * `small` is a phone's picture: a narrow strip of desk seen close to. Each shadow map is drawn over only that
   * strip, so that its texels are not magnified into blocks and hard black edges, and the lamp's map is smaller.
   */
  constructor(private readonly scene: THREE.Scene, private readonly renderer: THREE.WebGLRenderer, small = false) {
    this.sun.map = windowCookie(small);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1.4;
    this.sun.shadow.camera.far = 4.2;
    this.sun.shadow.bias = -0.00012;
    this.sun.shadow.normalBias = 0.0006;
    this.sun.shadow.radius = 1.4;
    if (small) {
      // Seen this close, the edge of the pool of sun cuts across the narrow sheet as a broad grey diagonal.
      // Widen the window so the strip in the picture lies inside the pool.
      this.sun.angle = 0.4;
      // The spot's map spans its whole cone; narrow it to the part of the desk that is in the picture.
      this.sun.shadow.focus = 0.25;
    }

    this.windowGlow.position.set(-0.25, 1.1, -1.25);
    this.windowGlow.castShadow = true;
    this.windowGlow.shadow.mapSize.set(1024, 1024);
    const glowCamera = this.windowGlow.shadow.camera;
    const reach = small ? 0.5 : 0.75;
    glowCamera.left = glowCamera.bottom = -reach;
    glowCamera.right = glowCamera.top = reach;
    glowCamera.near = 0.6;
    glowCamera.far = 3;
    this.windowGlow.shadow.bias = -0.0004;
    this.windowGlow.shadow.normalBias = 0.0012;
    this.windowGlow.shadow.radius = 7;

    this.lamp.castShadow = true;
    // A 4096 map is 64 MB that a phone can ill spare; focused on the strip, 2048 is finer than 4096 was.
    this.lamp.shadow.mapSize.setScalar(small ? 2048 : 4096);
    if (small) this.lamp.shadow.focus = 0.4;
    this.lamp.shadow.camera.near = 0.4;
    this.lamp.shadow.camera.far = 2.2;
    this.lamp.shadow.bias = -0.00015;
    this.lamp.shadow.normalBias = 0.0005;
    this.lamp.shadow.radius = 3;

    scene.add(this.sun, this.sun.target, this.windowGlow, this.windowGlow.target, this.sky, this.lamp, this.lamp.target);
    this.place();
  }

  /** Loads the room's reflections. Brass and glass look dead without them. */
  /** `small` fetches a much smaller picture of the room, for where there is no brass or glass to show it off. */
  loadEnvironment(onChange: () => void, small = false): void {
    new HDRLoader().load(small ? '/assets/workshop-256.hdr' : '/assets/workshop-1k.hdr', (hdr) => {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromEquirectangular(hdr).texture;
      // Turn the room so its windows are behind the top of the picture.
      this.scene.environmentRotation.set(0, 2.05, 0);
      hdr.dispose();
      pmrem.dispose();
      this.apply();
      onChange();
    });
  }

  setState(state: LightState, immediate: boolean): void {
    this.target = state;
    if (immediate) {
      this.current.sun = state.sunStrength;
      this.current.sky = state.skyStrength;
      this.current.night = state.night;
      this.current.lamp = this.lampLevel();
      this.sunDirection.set(...state.sunDirection);
      this.sunColour.setRGB(...state.sunColor);
      this.skyColour.setRGB(...state.skyColor);
      this.apply();
    }
  }

  /** The room's light comes up as the daylight goes. */
  private lampLevel(): number {
    return this.target?.night ?? 0;
  }

  /** Eases toward the target state like a dimmer. Returns true while still moving. */
  step(dt: number): boolean {
    const state = this.target;
    if (!state) return false;
    const k = 1 - Math.exp(-dt * 3.2);
    const before = this.current.sun + this.current.sky + this.current.lamp + this.current.night;
    this.current.sun += (state.sunStrength - this.current.sun) * k;
    this.current.sky += (state.skyStrength - this.current.sky) * k;
    this.current.night += (state.night - this.current.night) * k;
    this.current.lamp += (this.lampLevel() - this.current.lamp) * k;
    const direction = new THREE.Vector3(...state.sunDirection);
    const turn = this.sunDirection.angleTo(direction);
    this.sunDirection.lerp(direction, k).normalize();
    this.sunColour.lerp(new THREE.Color().setRGB(...state.sunColor), k);
    this.skyColour.lerp(new THREE.Color().setRGB(...state.skyColor), k);
    this.apply();
    const after = this.current.sun + this.current.sky + this.current.lamp + this.current.night;
    return Math.abs(after - before) > 0.0004 || turn > 0.0008;
  }

  /** Puts the light where the bulb is. Call after moving the lamp. */
  place(): void {
    this.lamp.position.copy(this.lampHome).lerp(RAKE_OFFSET.clone().add(this.lampAim), this.rake);
    this.lamp.target.position.copy(this.lampAim).multiplyScalar(this.rake);
  }

  private apply(): void {
    const { sun, sky, lamp, night } = this.current;
    this.sun.position.copy(this.sunDirection).multiplyScalar(2.9);
    this.sun.target.position.set(0, 0, 0.02);
    this.sun.color.copy(this.sunColour);
    this.sun.intensity = 3.3 * sun;
    this.sun.visible = sun > 0.002;

    this.windowGlow.color.copy(this.skyColour);
    // At night a little moonlight still comes through the window, cool against the lamp.
    this.windowGlow.intensity = 1.7 * sky * (1 - 0.4 * sun) + 0.05 * night;
    if (night > 0.5) this.windowGlow.color.setRGB(0.45, 0.58, 1.0);
    this.windowGlow.visible = true;

    this.sky.color.copy(this.skyColour);
    this.sky.intensity = 1.25 * sky + 0.014;
    this.scene.environmentIntensity = 0.42 * sky + 0.05 * night + 0.02;

    // Warm, from one side, and falling away across the desk.
    // Far enough off that no part of the sheet is so brightly lit that pencil and ink burn out on it.
    this.lamp.intensity = 6.2 * lamp;
    this.lamp.visible = lamp > 0.002;

    // A camera would open up at night, but not all the way: night should read as night.
    this.exposure = 0.92 + 0.3 * night * (1 - 0.6 * sky) - 0.16 * sun;
    this.renderer.toneMappingExposure = this.exposure;
  }
}
