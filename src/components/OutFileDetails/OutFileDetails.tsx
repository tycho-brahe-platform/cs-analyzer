import { useMemo } from 'react';
import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { AppTableList } from 'tycho-components';
import {
  parseOutFileSentences,
  type OutFileSentenceRow,
} from '../../utils/parseOutFileSentences';

export type OutFileDetailsProps = {
  /** Raw .out file text */
  content: string;
  /** Optional heading (e.g. file name) */
  title?: string;
  className?: string;
};

export default function OutFileDetails({
  content,
  title,
  className,
}: OutFileDetailsProps) {
  const { t } = useTranslation('home');

  const rows = useMemo(
    () => parseOutFileSentences(content),
    [content],
  );

  const columns = useMemo<ColumnDef<OutFileSentenceRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: t('home.out.columnId'),
      },
      {
        accessorKey: 'sentence',
        header: t('home.out.columnSentence'),
      },
    ],
    [t],
  );

  if (rows.length === 0) {
    return (
      <div className={className}>
        {title ? (
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {title}
          </Typography>
        ) : null}
        <Typography color="text.secondary" variant="body2">
          {t('home.out.noSentences')}
        </Typography>
      </div>
    );
  }

  return (
    <div className={className}>
      {title ? (
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
      ) : null}
      <AppTableList columns={columns} data={rows} />
    </div>
  );
}
