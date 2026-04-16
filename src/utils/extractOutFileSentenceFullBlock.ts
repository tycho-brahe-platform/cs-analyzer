/** Strip trailing SUMMARY / FOOTER regions so we only scan sentence bodies. */
export function trimOutFileBeforeSummaryFooter(content: string): string {
  const n = content.replace(/\r\n/g, '\n');
  const a = n.lastIndexOf('SUMMARY:');
  const b = n.lastIndexOf('FOOTER');
  let cut = n.length;
  if (a !== -1) {
    cut = Math.min(cut, a);
  }
  if (b !== -1) {
    cut = Math.min(cut, b);
  }
  return n.slice(0, cut);
}

function skipWs(s: string, i: number): number {
  while (i < s.length && /\s/.test(s[i])) {
    i += 1;
  }
  return i;
}

/** Parse one balanced (...) segment starting at `start` (must be '('). */
function balancedParensEnd(s: string, start: number): number | null {
  if (s[start] !== '(') {
    return null;
  }
  let depth = 0;
  for (let i = start; i < s.length; i += 1) {
    const c = s[i];
    if (c === '(') {
      depth += 1;
    } else if (c === ')') {
      depth -= 1;
      if (depth === 0) {
        return i + 1;
      }
    }
  }
  return null;
}

const SENTENCE_MARK_RE = /\/~\*\s*([\s\S]*?)\s*\*~\//g;

/**
 * Returns the full .out sentence unit for `sentenceId`: sentence mark block,
 * optional annotation comment, and optional following parse tree in parentheses.
 */
export function extractOutFileSentenceFullBlock(
  content: string,
  sentenceId: string,
): string | null {
  const body = trimOutFileBeforeSummaryFooter(content);
  let m: RegExpExecArray | null;
  while ((m = SENTENCE_MARK_RE.exec(body)) !== null) {
    const inner = m[1].trim();
    const idMatch = inner.match(/\(([^)]+)\)\s*$/);
    if (!idMatch) {
      continue;
    }
    const id = idMatch[1].trim();
    if (id !== sentenceId) {
      continue;
    }
    const blockStart = m.index;
    let pos = m.index + m[0].length;
    pos = skipWs(body, pos);
    const rest = body.slice(pos);
    const cmt = rest.match(/^\s*\/\*[\s\S]*?\*\//);
    if (cmt) {
      pos += cmt[0].length;
    }
    pos = skipWs(body, pos);
    if (pos < body.length && body[pos] === '(') {
      const end = balancedParensEnd(body, pos);
      if (end !== null) {
        pos = end;
      }
    }
    return body.slice(blockStart, pos);
  }
  return null;
}
