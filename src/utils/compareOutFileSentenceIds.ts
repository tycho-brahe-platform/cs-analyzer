import { parseOutFileSentences } from './parseOutFileSentences';

export type GroupCompareRow = {
  fileName: string;
  id: string;
  /** Index into the uploaded file list (for loading raw .out text). */
  sourceIndex: number;
};

type NamedContent = { name: string; content: string };

/** Per-file group: 0 = none, 1 = group 1, 2 = group 2 */
export type FileGroupFlag = 0 | 1 | 2;

/**
 * Sentence IDs that appear in group 1 files but in no group 2 file, with the
 * group 1 file each id first appears in (per file, each id listed once).
 */
export function compareGroup1IdsMissingFromGroup2(
  outEntries: NamedContent[],
  fileGroups: FileGroupFlag[],
): GroupCompareRow[] {
  const group2Ids = new Set<string>();
  for (let i = 0; i < outEntries.length; i += 1) {
    if (fileGroups[i] !== 2) {
      continue;
    }
    for (const row of parseOutFileSentences(outEntries[i].content)) {
      group2Ids.add(row.id);
    }
  }

  const out: GroupCompareRow[] = [];
  for (let i = 0; i < outEntries.length; i += 1) {
    if (fileGroups[i] !== 1) {
      continue;
    }
    const f = outEntries[i];
    const seenInFile = new Set<string>();
    for (const row of parseOutFileSentences(f.content)) {
      if (group2Ids.has(row.id) || seenInFile.has(row.id)) {
        continue;
      }
      seenInFile.add(row.id);
      out.push({
        fileName: f.name,
        id: row.id,
        sourceIndex: i,
      });
    }
  }
  return out;
}
