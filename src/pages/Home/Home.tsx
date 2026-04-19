import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import {
  AppDropzone,
  AppModal,
  UploadedFile,
} from '@tycho-platform/components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutFileDetails from '../../components/OutFileDetails';
import {
  parseOutFileSummaryStats,
  type Summary as OutFileSummaryStats,
} from '../../utils/Summary';
import {
  compareGroup1IdsMissingFromGroup2,
  type GroupCompareRow,
} from '../../utils/compareOutFileSentenceIds';
import {
  buildComparisonOutTxt,
  downloadTxtFile,
} from '../../utils/comparisonResultTxt';
import { parseOutFileSentences } from '../../utils/parseOutFileSentences';
import './style.scss';

type OutEntry = {
  name: string;
  summaryStats: OutFileSummaryStats | null;
  content: string;
};

/** 0 = unassigned, 1 = group 1, 2 = group 2 */
type FileGroup = 0 | 1 | 2;

export default function Home() {
  const { t } = useTranslation('home');
  const [dropzoneOpen, setDropzoneOpen] = useState(false);
  const [outEntries, setOutEntries] = useState<OutEntry[]>([]);
  const [fileGroups, setFileGroups] = useState<FileGroup[]>([]);
  const [detailModalIndex, setDetailModalIndex] = useState<number | null>(null);
  /** Set when the user runs a comparison; null means not run yet this session. */
  const [comparisonRows, setComparisonRows] = useState<
    GroupCompareRow[] | null
  >(null);

  const handleSuccess = (files: UploadedFile[]) => {
    const next = files.map((f) => ({
      name: f.name,
      summaryStats: parseOutFileSummaryStats(f.content),
      content: f.content,
    }));
    setOutEntries((prev) => [...prev, ...next]);
    setFileGroups((prev) => [
      ...prev,
      ...Array(next.length).fill(0 as FileGroup),
    ]);
    setComparisonRows(null);
    setDropzoneOpen(false);
  };

  const handleClearResults = () => {
    setOutEntries([]);
    setFileGroups([]);
    setDetailModalIndex(null);
    setComparisonRows(null);
  };

  const setFileGroup = (index: number, value: FileGroup) => {
    setFileGroups((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setComparisonRows(null);
  };

  const hasGroup1 = fileGroups.some((g) => g === 1);
  const hasGroup2 = fileGroups.some((g) => g === 2);
  const canCompare = hasGroup1 && hasGroup2;

  const handleCompareGroups = () => {
    setComparisonRows(
      compareGroup1IdsMissingFromGroup2(outEntries, fileGroups)
    );
  };

  const handleExportComparisonTxt = () => {
    if (comparisonRows === null) {
      return;
    }
    let group1SentenceCount = 0;
    let group2SentenceCount = 0;
    for (let i = 0; i < outEntries.length; i += 1) {
      const n = parseOutFileSentences(outEntries[i].content).length;
      if (fileGroups[i] === 1) {
        group1SentenceCount += n;
      } else if (fileGroups[i] === 2) {
        group2SentenceCount += n;
      }
    }
    const differenceCount = comparisonRows.length;
    const headerComment = `/*\n${t('home.out.exportHeaderTitle')}\n${t(
      'home.out.exportHeaderG1',
      { count: group1SentenceCount }
    )}\n${t('home.out.exportHeaderG2', { count: group2SentenceCount })}\n${t(
      'home.out.exportHeaderDiff',
      { count: differenceCount }
    )}\n*/`;
    const txt = buildComparisonOutTxt(
      comparisonRows,
      (idx) => outEntries[idx]?.content,
      headerComment
    );
    const d = new Date();
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(
      2,
      '0'
    )}${String(d.getMinutes()).padStart(2, '0')}`;
    downloadTxtFile(txt, `comparison-${stamp}.txt`);
  };

  const detailModalEntry =
    detailModalIndex !== null ? outEntries[detailModalIndex] : undefined;

  return (
    <div className="home-container">
      <Box className="home-content">
        <Typography variant="h4" component="h1" gutterBottom>
          {t('home.title')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('home.subtitle')}
        </Typography>

        <Button variant="contained" onClick={() => setDropzoneOpen(true)}>
          {t('home.out.selectFiles')}
        </Button>

        {outEntries.length > 0 && (
          <Stack spacing={2} sx={{ mt: 3, width: '100%' }} alignItems="stretch">
            <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
              {t('home.out.compareHint')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="contained"
                onClick={handleCompareGroups}
                disabled={!canCompare}
              >
                {t('home.out.compareButton')}
              </Button>
              <Button variant="outlined" onClick={handleClearResults}>
                {t('home.out.clearResults')}
              </Button>
            </Stack>
            {!canCompare ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                {t('home.out.compareNeedBothGroups')}
              </Typography>
            ) : null}

            <Box
              className="home-out-layout"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                width: '100%',
              }}
            >
              <Box
                className="home-out-files"
                sx={{
                  flex: { md: '0 0 38%', xs: 'none' },
                  maxWidth: { md: '42%' },
                }}
              >
                <Stack spacing={2}>
                  {outEntries.map((entry, i) => (
                    <Paper
                      key={`${entry.name}-${i}`}
                      variant="outlined"
                      className="home-out-item"
                      sx={{
                        borderColor:
                          detailModalIndex === i ? 'primary.main' : undefined,
                        borderWidth: detailModalIndex === i ? 2 : 1,
                        p: 1,
                      }}
                    >
                      <FormControl
                        component="fieldset"
                        variant="standard"
                        sx={{ mb: 1, width: '100%' }}
                      >
                        <FormLabel
                          component="legend"
                          sx={{ typography: 'caption', mb: 0.5 }}
                        >
                          {t('home.out.groupAssignment')}
                        </FormLabel>
                        <RadioGroup
                          row
                          value={String(fileGroups[i] ?? 0)}
                          onChange={(_, v) =>
                            setFileGroup(i, Number(v) as FileGroup)
                          }
                          sx={{ flexWrap: 'wrap', gap: 0.5 }}
                        >
                          <FormControlLabel
                            value="0"
                            control={<Radio size="small" />}
                            label={t('home.out.groupNone')}
                          />
                          <FormControlLabel
                            value="1"
                            control={<Radio size="small" />}
                            label={t('home.out.group1')}
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio size="small" />}
                            label={t('home.out.group2')}
                          />
                        </RadioGroup>
                      </FormControl>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        {entry.name}
                      </Typography>
                      {entry.summaryStats ? (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {t('home.out.summaryStats', {
                            hits: entry.summaryStats.hits.toLocaleString(),
                            tokens: entry.summaryStats.tokens.toLocaleString(),
                            total: entry.summaryStats.total.toLocaleString(),
                          })}
                        </Typography>
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          {t('home.out.noSummary')}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          mt: 1.5,
                          display: 'flex',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => setDetailModalIndex(i)}
                        >
                          {t('home.out.viewDetails')}
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Paper
                className="home-out-details"
                variant="outlined"
                sx={{
                  flex: 1,
                  p: 2,
                  minHeight: { md: 200 },
                }}
              >
                {comparisonRows !== null ? (
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {t('home.out.compareMissingHeading')}
                      </Typography>
                      <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={handleExportComparisonTxt}
                      >
                        {t('home.out.exportComparisonTxt')}
                      </Button>
                    </Box>
                    {comparisonRows.length === 0 ? (
                      <Typography color="text.secondary" variant="body2">
                        {t('home.out.compareNoneMissing')}
                      </Typography>
                    ) : (
                      <Box
                        component="table"
                        sx={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          typography: 'body2',
                          '& th, & td': {
                            borderBottom: 1,
                            borderColor: 'divider',
                            py: 0.75,
                            pr: 1,
                            textAlign: 'left',
                            verticalAlign: 'top',
                          },
                          '& th': { fontWeight: 600 },
                        }}
                      >
                        <thead>
                          <tr>
                            <th>{t('home.out.compareColumnFile')}</th>
                            <th>{t('home.out.columnId')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonRows.map((row, idx) => (
                            <tr key={`${row.fileName}-${row.id}-${idx}`}>
                              <td>{row.fileName}</td>
                              <td>{row.id}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Box>
                    )}
                  </Box>
                ) : null}

                <Typography color="text.secondary" variant="body2">
                  {t('home.out.detailsPlaceholder')}
                </Typography>
              </Paper>
            </Box>
          </Stack>
        )}
      </Box>

      {dropzoneOpen && (
        <AppDropzone
          onClose={() => setDropzoneOpen(false)}
          onSuccess={handleSuccess}
          accept={{
            'text/plain': ['.out'],
            'application/octet-stream': ['.out'],
          }}
          title={t('home.out.modalTitle')}
        />
      )}

      {detailModalEntry ? (
        <AppModal
          title={detailModalEntry.name}
          close={() => setDetailModalIndex(null)}
          hideFooter
          className="modal-out-details"
        >
          <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            <OutFileDetails content={detailModalEntry.content} />
          </Box>
        </AppModal>
      ) : null}
    </div>
  );
}
