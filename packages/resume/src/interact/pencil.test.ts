import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import type { Prop } from '../scene/props';
import { SheetBody } from '../sheet/body';
import { SheetHandling } from './handling';
import { DeskObjects } from './objects';
import { pageAt, PencilTool } from './pencil';

function make() {
  const material = new THREE.MeshBasicMaterial();
  const sheet = new SheetBody(0.2, 0.3, 0.0009, material, material, material);
  const handling = new SheetHandling(sheet, { moved: () => {}, slide: () => {}, flick: () => {}, slap: () => {} }, false);
  const objects = new DeskObjects(() => {});
  const prop = {
    name: 'pencil',
    group: new THREE.Group(),
    radius: 0.01,
    pickOffset: 0,
    blob: new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial()),
    blobSize: [0.1, 0.01],
    solid: { span: [-0.06, 0.08], radius: 0.004 },
    mass: 1,
    hold: () => {},
  } as Prop;
  const item = objects.add(prop);
  const drawn: number[][] = [];
  const strokes: number[][] = [];
  const tool = new PencilTool(item, objects, sheet, handling, {
    drawn: (_front, x0, y0, x1, y1) => drawn.push([x0, y0, x1, y1]),
    stroke: (_front, points) => strokes.push(points),
    rest: () => {},
    poke: () => false,
  });
  return { sheet, handling, objects, item, tool, drawn, strokes };
}

describe('pageAt', () => {
  it('reads the front from its top left corner', () => {
    const { sheet } = make();
    const at = pageAt(sheet, -0.05, -0.1)!;
    expect(at.front).toBe(true);
    expect(at.x).toBeCloseTo(0.05, 9);
    expect(at.y).toBeCloseTo(0.05, 9);
    expect(pageAt(sheet, 0.2, 0)).toBeNull();
  });

  it('reads the back from left to right as it lies, too', () => {
    const { sheet, handling } = make();
    handling.pose('back');
    const at = pageAt(sheet, -0.05, -0.1)!;
    expect(at.front).toBe(false);
    expect(at.x).toBeCloseTo(0.05, 9);
  });
});

describe('PencilTool', () => {
  it('draws nothing while it is carried, only where it is pressed', () => {
    const { tool, drawn, item } = make();
    tool.take(0.3, 0);
    tool.hover(0.05, 0);
    tool.hover(0, 0);
    expect(drawn).toHaveLength(0);
    expect(item.held).toBe(true);

    expect(tool.press(0, 0)).toBe(true);
    tool.drag(0.01, 0, 0.016);
    tool.drag(0.02, 0.005, 0.016);
    expect(drawn.length).toBe(3);
    expect(drawn[1]).toEqual([0.1, 0.15, expect.closeTo(0.11, 9), 0.15]);
  });

  it('ends the line at the edge of the sheet and stays in the hand', () => {
    const { tool, strokes, drawn } = make();
    tool.take(0, 0);
    tool.press(0.09, 0);
    tool.drag(0.095, 0, 0.016);
    tool.drag(0.12, 0, 0.016);
    expect(strokes).toHaveLength(1);
    const before = drawn.length;
    tool.drag(0.09, 0, 0.016);
    expect(drawn.length).toBe(before);
    expect(tool.active).toBe(true);
  });

  it('is laid down by a press off the sheet', () => {
    const { tool, item } = make();
    tool.take(0, 0);
    expect(tool.press(0.3, 0)).toBe(false);
    expect(tool.active).toBe(false);
    expect(item.held).toBe(false);
    expect(item.hand).toBeNull();
  });
});
