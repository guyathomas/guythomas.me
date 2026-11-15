import type { DeskObjects } from '../interact/objects';
import type { SheetBody } from '../sheet/body';

/**
 * Lays the loose objects out around the sheet for the space the picture has.
 * On a phone there is no desk to either side, so only the sheet is shown.
 * Returns true if the objects were given their places.
 */
/** Least bare desk beside the sheet, in metres, for the objects to be set out on it. */
const ROOM = 0.045;

/** True when the window shows enough desk beside the sheet for the loose objects. */
export function hasDeskRoom(sheetWidth: number, halfWidth: number): boolean {
  return halfWidth - sheetWidth / 2 > ROOM;
}

export function arrangeDesk(objects: DeskObjects, sheet: SheetBody, halfWidth: number, rehome: boolean): boolean {
  const margin = halfWidth - sheet.width / 2;
  const roomy = hasDeskRoom(sheet.width, halfWidth);
  const left = -sheet.width / 2;
  const right = sheet.width / 2;
  const top = -sheet.height / 2;

  for (const item of objects.items) {
    item.prop.group.visible = roomy;
    item.prop.blob.visible = roomy;
    if (item.prop.name === 'loupe') (item.prop.group.userData.glass as { visible: boolean }).visible = roomy;
  }
  if (!roomy || !rehome) return false;

  const stamp = objects.find('stamp');
  const loupe = objects.find('loupe');
  const pencil = objects.find('pencil');
  const eraser = objects.find('eraser');
  const bell = objects.find('bell');
  const side = Math.min(margin * 0.52, 0.062);
  if (bell) objects.setHome(bell, left - side - 0.004, top + 0.03, 0);
  if (stamp) objects.setHome(stamp, right + Math.max(side * 0.8, 0.032), top + 0.03, 0.12);
  if (loupe) objects.setHome(loupe, left - side - 0.004, top + 0.105, -1.82);
  if (eraser) objects.setHome(eraser, right + Math.max(side * 0.8, 0.032), top + 0.068, 0.2);
  if (pencil) objects.setHome(pencil, right + side * 0.78, top + 0.185, 1.77);
  return true;
}
