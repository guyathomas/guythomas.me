import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import type { Prop } from '../scene/props';
import { DeskObjects } from './objects';

function prop(name: Prop['name'], radius: number): Prop {
  return {
    name,
    group: new THREE.Group(),
    radius,
    pickOffset: 0,
    blob: new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial()),
    blobSize: [0.05, 0.05],
    solid: { span: [0, 0], radius },
    mass: 1,
  };
}

describe('DeskObjects', () => {
  it('does not let a hard throw pass through something in its way', () => {
    const objects = new DeskObjects(() => {});
    const thrown = objects.add(prop('eraser', 0.006));
    const target = objects.add(prop('loupe', 0.006));
    objects.move(thrown, -0.1, 0);
    objects.move(target, 0, 0);
    objects.grab(thrown, -0.1, 0);
    // A flick far faster than a hand can manage, across where the target lies.
    objects.drag(0.1, 0, 0.004);
    objects.move(thrown, -0.1, 0);
    objects.release(0);
    expect(Math.hypot(thrown.vx, thrown.vz)).toBeLessThanOrEqual(1.4 + 1e-9);
    for (let i = 0; i < 120; i++) objects.step(1 / 30);
    expect(target.x).toBeGreaterThan(0.001);
    expect(thrown.x).toBeLessThan(target.x);
  });
});
