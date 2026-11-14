export interface Piece {
  start: number;
  end: number;
}

/**
 * Splits a text node into the pieces that are drawn one by one: whole words
 * normally, single characters when the text is letter-spaced (so tracking
 * comes from the browser's own positions).
 */
export function splitPieces(text: string, perCharacter: boolean): Piece[] {
  const pieces: Piece[] = [];
  for (const match of text.matchAll(/\S+/g)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (!perCharacter) {
      pieces.push({ start, end });
      continue;
    }
    let offset = start;
    for (const ch of match[0]) {
      pieces.push({ start: offset, end: offset + ch.length });
      offset += ch.length;
    }
  }
  return pieces;
}
