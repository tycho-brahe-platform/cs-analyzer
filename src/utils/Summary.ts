import { extractOutFileSummary } from './extractOutFileSummary';

export type Summary = {
  hits: number;
  tokens: number;
  total: number;
};

/**
 * Corpus Search SUMMARY blocks list "whole search" with hits/tokens/total as
 * three integers separated by slashes, often on the line after the header, e.g.:
 *   whole search, hits/tokens/total
 *             68/67/708
 */
const SLASH_TRIPLE = /(\d+)\/(\d+)\/(\d+)/;

/**
 * Reads the SUMMARY/FOOTER block, finds "whole search", then the first
 * hits/tokens/total triple (slash-separated) in the text after that marker.
 */
export function parseOutFileSummaryStats(content: string): Summary | null {
  const block = extractOutFileSummary(content);
  if (!block) {
    return null;
  }
  const normalized = block.replace(/\r\n/g, '\n');
  const marker = normalized.search(/whole\s+search/i);
  if (marker === -1) {
    return null;
  }
  const afterMarker = normalized.slice(marker);
  const m = afterMarker.match(SLASH_TRIPLE);
  if (!m) {
    return null;
  }
  const hits = parseInt(m[1], 10);
  const tokens = parseInt(m[2], 10);
  const total = parseInt(m[3], 10);
  if ([hits, tokens, total].every((n) => Number.isFinite(n))) {
    return { hits, tokens, total };
  }
  return null;
}
