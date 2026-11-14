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

  it('turns over on the spot', () => {
    const { sheet, handling } = make();
    const corners = [0, 1, 2, 3].map((i) => sheet.cornerWorld(i));
    handling.turnOver();
    run(handling, 3);
    expect(handling.frontUp).toBe(false);
    expect(sheet.pose.cx).toBeCloseTo(0, 6);
    expect(sheet.pose.cz).toBeCloseTo(0, 6);
    // The same four desk points are covered, by different corners.
    const after = [0, 1, 2, 3].map((i) => sheet.cornerWorld(i));
    for (const [x, z] of corners) expect(after.some(([ax, az]) => Math.hypot(ax - x, az - z) < 1e-6)).toBe(true);
  });

  it('goes over when a corner is let go part of the way, even on a diagonal', () => {
    const { sheet, handling } = make();
    const [x, z] = sheet.cornerWorld(0);
    handling.beginCurl(0);
    handling.moveCurl(x + 0.1, z + 0.08);
    run(handling, 0.5);
    expect(handling.phase).toBe('curl');
    handling.endCurl();
    run(handling, 3);
    expect(handling.phase).toBe('rest');
    expect(handling.frontUp).toBe(false);
    expect(sheet.pose.cx).toBeCloseTo(0, 6);
    expect(sheet.pose.cz).toBeCloseTo(0, 6);
    expect(Math.abs(sheet.pose.b)).toBeLessThan(1e-6);
  });

  it('lets a corner that was only lifted fall back', () => {
    const { sheet, handling } = make();
    const [x, z] = sheet.cornerWorld(0);
    handling.beginCurl(0);
    handling.moveCurl(x + 0.03, z + 0.03);
    run(handling, 1);
    handling.endCurl();
    run(handling, 3);
    expect(handling.phase).toBe('rest');
    expect(handling.frontUp).toBe(true);
  });

  it('goes over while still held once a third of it has been carried', () => {
    const { sheet, handling } = make();
    const [x, z] = sheet.cornerWorld(1);
    handling.beginCurl(1);
    handling.moveCurl(x - 0.12, z);
    run(handling, 3);
    expect(handling.phase).toBe('rest');
    expect(handling.frontUp).toBe(false);
  });

  it('resets a sheet that a freeze state left curled', () => {
    const { sheet, handling } = make();
    handling.pose('corner-lifted');
    expect(sheet.curl).not.toBeNull();
    handling.reset();
    run(handling, 2);
    expect(sheet.curl).toBeNull();
    expect(handling.phase).toBe('rest');
  });
});
