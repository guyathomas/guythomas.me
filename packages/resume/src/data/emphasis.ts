export interface Run {
  text: string;
  em: boolean;
}

/** Splits "plain *emphasised* plain" into runs. Unpaired asterisks are kept as text. */
export function parseEmphasis(source: string): Run[] {
  const runs: Run[] = [];
  const pattern = /\*([^*]+)\*/g;
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) runs.push({ text: source.slice(cursor, start), em: false });
    runs.push({ text: match[1], em: true });
    cursor = start + match[0].length;
  }
  if (cursor < source.length) runs.push({ text: source.slice(cursor), em: false });
  return runs;
}

export function stripEmphasis(source: string): string {
  return parseEmphasis(source)
    .map((run) => run.text)
    .join('');
}
