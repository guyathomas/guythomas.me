import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { SheetBody } from '../sheet/body';
import { SheetHandling } from './handling';

function make() {
  const material = new THREE.MeshBasicMaterial();
  const sheet = new SheetBody(0.2159, 0.2794, 0.0009, material, material, material);
  const handling = new SheetHandling(sheet, { moved: () => {}, slide: () => {}, flick: () => {}, slap: () => {} }, false);
  return { sheet, handling };
}

function run(handling: SheetHandling, seconds: number): void {
  for (let i = 0; i < seconds * 60; i++) handling.step(1 / 60);
}

describe('SheetHandling', () => {
  it('turns the squared-up sheet all the way over', () => {
    const { handling } = make();
    handling.turnOver();
    run(handling, 5);
    expect(handling.phase).toBe('rest');
    expect(handling.frontUp).toBe(false);
  });

  it('resets from the back to the front, square and flat', () => {
    const { sheet, handling } = make();
    handling.pose('back');
    handling.reset();
    run(handling, 5);
    expect(handling.phase).toBe('rest');
    expect(handling.frontUp).toBe(true);
    expect(sheet.curl).toBeNull();
    expect(sheet.pose.cx).toBeCloseTo(handling.home.cx, 6);
    expect(sheet.pose.cz).toBeCloseTo(handling.home.cz, 6);
  });
});
