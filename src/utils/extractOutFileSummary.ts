/** Corpus Search .out files end with a SUMMARY (or FOOTER) block in a closing comment. */
export function extractOutFileSummary(content: string): string {
  const normalized = content.replace(/\r\n/g, '\n');
  const summaryIdx = normalized.lastIndexOf('SUMMARY:');
  if (summaryIdx !== -1) {
    const fromSummary = normalized.slice(summaryIdx);
    const end = fromSummary.indexOf('*/');
    if (end !== -1) {
      return fromSummary.slice(0, end).trim();
    }
    return fromSummary.trim();
  }
  const footerIdx = normalized.lastIndexOf('FOOTER');
  if (footerIdx !== -1) {
    const fromFooter = normalized.slice(footerIdx);
    const end = fromFooter.indexOf('*/');
    if (end !== -1) {
      return fromFooter.slice(0, end).trim();
    }
    return fromFooter.trim();
  }
  return '';
}
