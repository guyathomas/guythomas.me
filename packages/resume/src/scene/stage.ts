import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputShader } from 'three/examples/jsm/shaders/OutputShader.js';

/**
 * Tone mapping and the move to screen colour, then lens falloff and film grain, in one pass over the picture.
 * Two passes did the same; on a phone every full-screen pass is a large share of the frame.
 */
class FinishPass extends OutputPass {
  readonly finish = {
    uGrain: { value: 0.028 },
    uVignette: { value: 0.34 },
    uSeed: { value: 0 },
    uAspect: { value: 1 },
  };

  constructor() {
    super();
    Object.assign(this.uniforms, this.finish);
    const shader = OutputShader.fragmentShader;
    const close = shader.lastIndexOf('}');
    this.material.fragmentShader =
      shader.slice(0, close).replace(
        'varying vec2 vUv;',
        /* glsl */ `varying vec2 vUv;
        uniform float uGrain;
        uniform float uVignette;
        uniform float uSeed;
        uniform float uAspect;
        float hash(vec2 p) {
          vec3 q = fract(vec3(p.xyx) * 0.1031);
          q += dot(q, q.yzx + 33.33);
          return fract((q.x + q.y) * q.z);
        }`,
      ) +
      /* glsl */ `
        vec2 centred = (vUv - 0.5) * vec2(uAspect, 1.0);
        float falloff = smoothstep(0.35, 1.05, length(centred));
        gl_FragColor.rgb *= 1.0 - uVignette * falloff;
        float grain = hash(gl_FragCoord.xy + uSeed) - 0.5;
        gl_FragColor.rgb += grain * uGrain * (1.0 - 0.6 * dot(gl_FragColor.rgb, vec3(0.3333)));
      }`;
  }
}

export type Ticker = (dt: number, now: number) => boolean;

/**
 * Owns the renderer and the frame loop. Nothing is drawn unless something
 * asked for it: call `invalidate()` after a change, or add a ticker that
 * returns true for as long as it is still moving.
 */
export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(13, 1, 0.05, 30);
  readonly composer: EffectComposer;
  /** Called just before each frame is drawn, after tickers have run. */
  beforeRender: (() => void) | null = null;
  /** Frozen clock in seconds, or null to run in real time. */
  frozenTime: number | null = null;
  continuous = false;
  readonly stats = { frames: 0, seconds: 0, fps: 0, worst: 0 };

  private readonly tickers = new Set<Ticker>();
  private readonly finish = new FinishPass();
  private dirty = true;
  private running = false;
  private last = 0;
  private scale = 1;
  private slowFrames = 0;
  /** Set when something that casts a shadow, or a light, has moved. Shadow maps are only redrawn then. */
  shadowsStale = true;

  /** `small` is a phone-sized picture: it is drawn without multisampling. */
  constructor(readonly canvas: HTMLCanvasElement, small = false) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera.up.set(0, 0, -1);

    const target = new THREE.WebGLRenderTarget(4, 4, { samples: small ? 0 : 4, type: THREE.HalfFloatType });
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(this.finish);
    this.resize();
  }

  get pixelRatio(): number {
    // Never more than two pixels to the point. A phone's screen often has three, but drawing every one of them
    // more than doubles the work of each frame for type that is already sharp at two, and the phone lags.
    return Math.min(window.devicePixelRatio || 1, 2) * this.scale;
  }

  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(width, height, false);
    this.composer.setPixelRatio(this.pixelRatio);
    this.composer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.finish.finish.uAspect.value = width / height;
    this.invalidate();
  }

  invalidate(): void {
    this.dirty = true;
    this.wake();
  }

  /** Runs every frame until it returns false. */
  addTicker(ticker: Ticker): void {
    this.tickers.add(ticker);
    this.wake();
  }

  private wake(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    requestAnimationFrame(this.frame);
  }

  private frame = (now: number): void => {
    const dt = Math.min(0.05, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    const clock = this.frozenTime ?? now / 1000;
    for (const ticker of [...this.tickers]) {
      if (ticker(dt, clock)) this.dirty = true;
      else this.tickers.delete(ticker);
    }
    if (this.dirty || this.continuous) {
      this.dirty = false;
      this.beforeRender?.();
      // Most frames only move the camera; the shadows on the desk are the same as last time.
      if (this.shadowsStale) this.renderer.shadowMap.needsUpdate = true;
      this.shadowsStale = false;
      this.finish.finish.uSeed.value = this.frozenTime === null ? (now * 0.06) % 997 : 3;
      this.composer.render();
      this.measure(dt);
    }
    if (this.tickers.size > 0 || this.dirty || this.continuous) requestAnimationFrame(this.frame);
    else this.running = false;
  };

  /** Tracks the frame rate and drops internal resolution if frames run long. */
  private measure(dt: number): void {
    const { stats } = this;
    stats.frames++;
    stats.seconds += dt;
    stats.worst = Math.max(stats.worst, dt * 1000);
    if (stats.seconds >= 1) {
      stats.fps = Math.round(stats.frames / stats.seconds);
      stats.frames = 0;
      stats.seconds = 0;
    }
    this.slowFrames = dt > 1 / 42 ? this.slowFrames + 1 : Math.max(0, this.slowFrames - 2);
    if (this.slowFrames > 18 && this.scale > 0.6) {
      this.scale = Math.max(0.6, this.scale - 0.15);
      this.slowFrames = 0;
      this.resize();
    }
  }
}
