import { describe, expect, it } from 'vitest';
import { splitPieces } from './pieces';

describe('splitPieces', () => {
  it('splits on whitespace into words', () => {
    const text = '  Led 9 engineers\n building ';
    expect(splitPieces(text, false).map((p) => text.slice(p.start, p.end))).toEqual(['Led', '9', 'engineers', 'building']);
  });

  it('splits letter-spaced text into characters and skips spaces', () => {
    const text = 'Guy T';
    expect(splitPieces(text, true).map((p) => text.slice(p.start, p.end))).toEqual(['G', 'u', 'y', 'T']);
  });

  it('keeps surrogate pairs together', () => {
    const text = 'a\u{1F600}b';
    expect(splitPieces(text, true).map((p) => text.slice(p.start, p.end))).toEqual(['a', '\u{1F600}', 'b']);
  });

  it('returns nothing for blank text', () => {
    expect(splitPieces(' \n\t ', false)).toEqual([]);
  });
});
