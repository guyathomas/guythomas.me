import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { stripEmphasis } from '../data/emphasis';
import { parseResume } from '../data/load';
import { renderBack, renderFront } from './render';
import { escapeHtml, typeset } from './typography';

const resume = parseResume(readFileSync(new URL('../data/resume.yaml', import.meta.url), 'utf8'));
const plain = (html: string): string =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');

describe('typeset', () => {
  it('sets date ranges with an en dash', () => {
    expect(typeset('Oct 2024 - Present')).toBe('Oct 2024 – Present');
  });
  it('sets numeric ranges with an en dash and leaves words alone', () => {
    expect(typeset('0-1 products, self-serve')).toBe('0–1 products, self-serve');
  });
});

describe('escapeHtml', () => {
  it('escapes markup', () => {
    expect(escapeHtml('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });
});

describe('renderFront', () => {
  const html = renderFront(resume);
  const visible = plain(html);

  it('contains every header field', () => {
    for (const value of Object.values(resume.header)) expect(visible).toContain(value);
  });

  it('contains every role and achievement', () => {
    for (const role of resume.experience) {
      expect(visible).toContain(role.title);
      expect(visible).toContain(role.company);
      for (const achievement of role.achievements) {
        expect(visible).toContain(plain(escapeHtml(typeset(stripEmphasis(achievement)))).trim());
      }
    }
  });

  it('marks emphasis and leaves no asterisks', () => {
    expect(html).toContain('<em>10 engineers</em>');
    expect(html).not.toContain('*');
  });

  it('links the email and website', () => {
    expect(html).toContain(`href="mailto:${resume.header.email}"`);
    expect(html).toContain(`href="https://${resume.header.website}"`);
  });
});

describe('renderBack', () => {
  it('carries only the note for phones', () => {
    const html = renderBack();
    expect(html).toMatch(/^<article class="sheet sheet-back" id="sheet-back"/);
    expect(html.match(/<p /g)).toHaveLength(1);
    expect(html).toContain('class="back-note"');
  });
});
