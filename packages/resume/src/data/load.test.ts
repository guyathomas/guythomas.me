import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseResume } from './load';

const source = readFileSync(new URL('./resume.yaml', import.meta.url), 'utf8');

describe('parseResume', () => {
  it('loads the real resume', () => {
    const resume = parseResume(source);
    expect(resume.header.name).toBe('Guy Thomas');
    expect(resume.experience).toHaveLength(6);
    expect(resume.experience[0].achievements.length).toBeGreaterThan(0);
  });

  it('keeps the phone number as a string', () => {
    expect(typeof parseResume(source).header.phone).toBe('string');
  });

  it('names the missing field', () => {
    expect(() => parseResume('header: {name: A}\nexperience: []')).toThrow(/header\.title/);
  });

  it('rejects a role with no achievements', () => {
    const bad = `header: {name: A, title: B, email: c@d.e, phone: "1", location: X}
experience:
  - {title: T, company: C, date: D, achievements: []}`;
    expect(() => parseResume(bad)).toThrow(/experience\[0\]\.achievements/);
  });
});
