/** One row parsed from a Corpus Search .out block between /~* and *~/. */
export type OutFileSentenceRow = {
  id: string;
  sentence: string;
};

const BLOCK_RE = /\/~\*\s*([\s\S]*?)\s*\*~\//g;

/**
 * Extracts sentences from `/~*` … `*~/` blocks. The id is the text inside the
 * final parentheses at the end of each block, e.g. `(CARDS2257,.2)`.
 */
export function parseOutFileSentences(content: string): OutFileSentenceRow[] {
  const rows: OutFileSentenceRow[] = [];
  const normalized = content.replace(/\r\n/g, '\n');
  let m: RegExpExecArray | null;
  while ((m = BLOCK_RE.exec(normalized)) !== null) {
    const block = m[1].trim();
    const idMatch = block.match(/\(([^)]+)\)\s*$/);
    if (!idMatch || idMatch.index === undefined) {
      continue;
    }
    const id = idMatch[1].trim();
    const sentence = block.slice(0, idMatch.index).trim();
    rows.push({ id, sentence });
  }
  return rows;
}
