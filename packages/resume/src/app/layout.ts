import type { DeskObjects } from '../interact/objects';
import type { SheetBody } from '../sheet/body';

/**
 * Lays the loose objects out around the sheet for the space the picture has.
 * On a phone there is no desk to either side, so only the sheet is shown.
 */
export function arrangeDesk(objects: DeskObjects, sheet: SheetBody, halfWidth: number, rehome: boolean): void {
  const margin = halfWidth - sheet.width / 2;
  const roomy = margin > 0.045;
  const left = -sheet.width / 2;
  const right = sheet.width / 2;
  const top = -sheet.height / 2;

  for (const item of objects.items) {
    item.prop.group.visible = roomy;
    item.prop.blob.visible = roomy;
    if (item.prop.name === 'loupe') (item.prop.group.userData.glass as { visible: boolean }).visible = roomy;
  }
  if (!roomy || !rehome) return;

  const weight = objects.find('weight');
  const loupe = objects.find('loupe');
  const pencil = objects.find('pencil');
  const side = Math.min(margin * 0.52, 0.062);
  if (weight) objects.setHome(weight, right - 0.012, top + 0.013, 0.4);
  if (loupe) objects.setHome(loupe, left - side - 0.004, top + 0.118, -1.82);
  if (pencil) objects.setHome(pencil, right + side * 0.78, top + 0.165, -1.69);
}
