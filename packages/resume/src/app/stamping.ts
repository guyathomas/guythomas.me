import type * as THREE from 'three';
import { STAMP_MARK } from '../scene/stamp';
import type { SheetBody } from '../sheet/body';
import { toLocal } from '../sheet/pose';
import { liftInk, pressInk, type Imprint } from '../typeset/imprint';
import { drawStampMark } from '../typeset/stamp';

interface InkImage {
  data: Uint8Array;
  width: number;
  height: number;
}

/** Stamps the sheet: presses marks into whichever face is up, and lifts them off again. */
export class Stamping {
  private readonly marks: Array<{ texture: THREE.DataTexture; imprint: Imprint }> = [];

  constructor(private readonly sheet: SheetBody, private readonly inks: { front: THREE.DataTexture; back: THREE.DataTexture }) {}

  /** Presses the stamp at a desk point, turned by `angle`. Returns false if it missed the sheet. */
  press(x: number, z: number, angle: number): boolean {
    const { sheet } = this;
    const hit = sheet.curl ? null : sheet.hit(x, z, 0);
    if (!hit) return false;
    const texture = hit.front ? this.inks.front : this.inks.back;
    const image = texture.image as InkImage;
    const scale = image.width / sheet.width;
    // The back is printed mirrored, so that it reads the right way once turned over.
    const side = hit.front ? 1 : -1;
    const [lx, lz] = toLocal(sheet.pose, sheet.pose.cx + Math.cos(angle), sheet.pose.cz - Math.sin(angle));
    const mark = drawStampMark(STAMP_MARK.width * scale, STAMP_MARK.height * scale, Math.atan2(lz, lx * side), new Date());
    const u = hit.front ? hit.u : 1 - hit.u;
    const left = Math.round(u * image.width - mark.width / 2);
    const top = Math.round(hit.v * image.height - mark.height / 2);
    const imprint = pressInk(image.data, image.width, image.height, mark.coverage, mark.width, mark.height, left, top);
    this.marks.push({ texture, imprint });
    texture.needsUpdate = true;
    return true;
  }

  /** Lifts every mark off, leaving the sheet as printed. */
  clear(): void {
    while (this.marks.length > 0) {
      const { texture, imprint } = this.marks.pop()!;
      const image = texture.image as InkImage;
      liftInk(image.data, image.width, imprint);
      texture.needsUpdate = true;
    }
  }
}
