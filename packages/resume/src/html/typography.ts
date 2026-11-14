const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}

/**
 * Typographic substitutions only, never rewording: a spaced hyphen between
 * dates becomes a spaced en dash, a hyphen between digits becomes an en dash,
 * and straight apostrophes become curly.
 */
export function typeset(text: string): string {
  return text
    .replace(/\s+-\s+/g, ' – ')
    .replace(/(\d)-(\d)/g, '$1–$2')
    .replace(/(\w)'(\w)/g, '$1’$2');
}
