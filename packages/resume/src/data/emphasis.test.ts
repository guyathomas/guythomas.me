import { describe, expect, it } from 'vitest';
import { parseEmphasis, stripEmphasis } from './emphasis';

describe('parseEmphasis', () => {
  it('splits emphasised runs', () => {
    expect(parseEmphasis('Lead 2 teams of *10 engineers* delivering')).toEqual([
      { text: 'Lead 2 teams of ', em: false },
      { text: '10 engineers', em: true },
      { text: ' delivering', em: false },
    ]);
  });

  it('handles emphasis at both ends', () => {
    expect(parseEmphasis('*a* and *b*')).toEqual([
      { text: 'a', em: true },
      { text: ' and ', em: false },
      { text: 'b', em: true },
    ]);
  });

  it('keeps an unpaired asterisk', () => {
    expect(parseEmphasis('5 * 3')).toEqual([{ text: '5 * 3', em: false }]);
  });

  it('strips markers', () => {
    expect(stripEmphasis('Grew *ARR 10x* YoY')).toBe('Grew ARR 10x YoY');
  });
});
