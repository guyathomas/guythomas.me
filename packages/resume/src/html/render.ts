import { parseEmphasis } from '../data/emphasis';
import type { Resume, Role } from '../data/types';
import { escapeHtml, typeset } from './typography';

const text = (value: string): string => escapeHtml(typeset(value));

const SEP = '<span class="sep" aria-hidden="true"> · </span>';

function renderAchievement(source: string): string {
  const body = parseEmphasis(source)
    .map((run) => (run.em ? `<em>${text(run.text)}</em>` : text(run.text)))
    .join('');
  return `<li><span class="mark" data-ink="2" aria-hidden="true">•</span>${body}</li>`;
}

function renderRole(role: Role, index: number): string {
  const place = role.location ? `${SEP}<span class="place">${text(role.location)}</span>` : '';
  return `
      <div class="job" data-role="${index}">
        <div class="job-head">
          <h3 class="job-title">${text(role.title)}</h3>
          <p class="job-date">${text(role.date)}</p>
        </div>
        <p class="job-firm"><span class="firm">${text(role.company)}</span>${place}</p>
        <ul>
          ${role.achievements.map(renderAchievement).join('\n          ')}
        </ul>
      </div>`;
}

/** The printed front of the sheet. Also the semantic copy and the plain page. */
export function renderFront(resume: Resume): string {
  const { header } = resume;
  const site = header.website
    ? `${SEP}<a href="https://${escapeHtml(header.website)}" data-link="website">${text(header.website)}</a>`
    : '';
  return `<article class="sheet sheet-front" id="sheet-front" aria-label="Resume of ${escapeHtml(header.name)}">
    <header class="masthead">
      <h1 class="name">${text(header.name)}</h1>
      <p class="role">${text(header.title)}</p>
      <p class="ornament" data-ink="2" aria-hidden="true">❦</p>
      <p class="contact">
        <span>${text(header.location)}</span>${SEP}<a href="mailto:${escapeHtml(header.email)}" data-link="email">${text(header.email)}</a>${SEP}<span>${text(header.phone)}</span>${site}
      </p>
    </header>
    <section class="experience" aria-label="Experience">
      <h2 class="section-title"><i class="rule" data-rule></i><span data-ink="2">Experience</span><i class="rule" data-rule></i></h2>${resume.experience.map(renderRole).join('')}
    </section>
  </article>`;
}

/** The back of the sheet. Nothing is printed on it; what happens there is drawn in pencil. */
export function renderBack(): string {
  return '<article class="sheet sheet-back" id="sheet-back" aria-hidden="true"></article>';
}
