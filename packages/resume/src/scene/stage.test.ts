import { describe, expect, it } from 'vitest';
import { OutputShader } from 'three/examples/jsm/shaders/OutputShader.js';
import { finishShader } from './stage';

describe('finishShader', () => {
  it("adds falloff and grain to three's output shader, after its tone mapping", () => {
    const shader = finishShader(OutputShader.fragmentShader);
    expect(shader).toContain('uniform float uGrain;');
    expect(shader.indexOf('ToneMapping(')).toBeLessThan(shader.indexOf('uVignette * falloff'));
    expect(shader.trimEnd().endsWith('}')).toBe(true);
  });

  it('refuses a shader it does not recognise', () => {
    expect(() => finishShader('void main() {}')).toThrow();
  });
});
