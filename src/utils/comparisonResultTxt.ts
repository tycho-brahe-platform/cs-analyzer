import type { GroupCompareRow } from './compareOutFileSentenceIds';
import { extractOutFileSentenceFullBlock } from './extractOutFileSentenceFullBlock';

function safeFileComment(name: string): string {
  return name.replace(/\*\//g, '* /');
}

/**
 * Builds a .out-style text: optional leading comment `headerComment`, then for
 * each row a `FILE:` comment and the full sentence block (mark, optional
 * annotation, tree) with no summary/footer.
 */
export function buildComparisonOutTxt(
  rows: GroupCompareRow[],
  getContent: (sourceIndex: number) => string | undefined,
  headerComment?: string,
): string {
  const chunks: string[] = [];
  for (const row of rows) {
    const raw = getContent(row.sourceIndex);
    if (!raw) {
      continue;
    }
    const block = extractOutFileSentenceFullBlock(raw, row.id);
    if (!block) {
      continue;
    }
    const label = safeFileComment(row.fileName);
    chunks.push(`/*\nFILE: ${label}\n*/\n\n${block}`);
  }
  const body = chunks.join('\n\n');
  if (headerComment) {
    return `${headerComment}\n\n${body}`;
  }
  return body;
}

export function downloadTxtFile(content: string, filename: string): void {
  const blob = new Blob([`\uFEFF${content}`], {
    type: 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
