/**
 * The desk's small sounds, all synthesised. Nothing plays, and no audio
 * context exists, until the viewer asks for sound.
 */
export class Voices {
  private ctx: AudioContext | null = null;
  private noise: AudioBuffer | null = null;
  private slideGain: GainNode | null = null;
  private slideFilter: BiquadFilterNode | null = null;
  private master: GainNode | null = null;

  get enabled(): boolean {
    return this.ctx !== null;
  }

  enable(): void {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(ctx.destination);

    const length = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

    // Paper sliding on wood: a continuous dry hiss whose level follows the speed.
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    this.slideFilter = ctx.createBiquadFilter();
    this.slideFilter.type = 'bandpass';
    this.slideFilter.frequency.value = 2400;
    this.slideFilter.Q.value = 0.6;
    this.slideGain = ctx.createGain();
    this.slideGain.gain.value = 0;
    source.connect(this.slideFilter).connect(this.slideGain).connect(this.master);
    source.start();
  }

  disable(): void {
    void this.ctx?.close();
    this.ctx = null;
    this.master = this.slideGain = this.slideFilter = null;
  }

  /** `speed` in metres per second across the desk. */
  slide(speed: number): void {
    if (!this.ctx || !this.slideGain || !this.slideFilter) return;
    const now = this.ctx.currentTime;
    this.slideGain.gain.setTargetAtTime(Math.min(0.22, speed * 0.55), now, 0.04);
    this.slideFilter.frequency.setTargetAtTime(1800 + Math.min(2600, speed * 4200), now, 0.06);
  }

  private burst(duration: number, type: BiquadFilterType, frequency: number, level: number, q = 0.7): void {
    const { ctx, noise, master } = this;
    if (!ctx || !noise || !master) return;
    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(level, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter).connect(gain).connect(master);
    source.start(now, Math.random());
    source.stop(now + duration + 0.02);
  }

  private tone(frequency: number, endFrequency: number, duration: number, level: number, type: OscillatorType = 'sine'): void {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  /** A corner let go: the quick crack of stiff paper. */
  flick(): void {
    this.burst(0.07, 'highpass', 2600, 0.22);
  }

  /** The sheet landing flat. */
  slap(strength: number): void {
    const level = Math.min(1, Math.max(0.15, strength));
    this.burst(0.11, 'lowpass', 1300, 0.34 * level);
    this.tone(120, 58, 0.09, 0.2 * level);
  }

  /** The lamp's switch. */
  click(): void {
    this.burst(0.018, 'bandpass', 3200, 0.5, 2.5);
    setTimeout(() => this.burst(0.014, 'bandpass', 2300, 0.3, 2.5), 34);
  }

  /** The stamp coming down on paper. */
  stamp(): void {
    this.tone(104, 46, 0.13, 0.42);
    this.burst(0.06, 'lowpass', 620, 0.36);
  }

  /** Pencil on paper: a thin dry hiss that follows the hand. */
  scratch(speed: number): void {
    if (!this.ctx || !this.slideGain || !this.slideFilter) return;
    const now = this.ctx.currentTime;
    this.slideGain.gain.setTargetAtTime(Math.min(0.09, speed * 0.45), now, 0.02);
    this.slideFilter.frequency.setTargetAtTime(4200 + Math.min(2400, speed * 9000), now, 0.03);
  }

  /** A star collected. */
  chime(): void {
    this.tone(1568, 1562, 0.34, 0.07);
    setTimeout(() => this.tone(2093, 2086, 0.42, 0.06), 70);
  }

  /** The marble striking a line. */
  knock(strength: number): void {
    this.burst(0.02, 'bandpass', 1500, 0.06 + 0.16 * strength, 1.4);
  }

  /** Something light set down. */
  tap(): void {
    this.burst(0.03, 'bandpass', 900, 0.25, 1.2);
  }
}
