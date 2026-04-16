import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AppDropzoneBody, { type AppDropzoneBodyRef } from './AppDropzoneBody';
import type { UploadedFile } from './UploadedFile';
import { AppModal } from 'tycho-components';

type Props = {
  onClose: () => void;
  onSuccess: (files: UploadedFile[]) => void;
  onError?: (err: unknown) => void;
  accept: Record<string, string[]>;
  onDrop?: () => void;
  title?: string;
  alternativeButton?: {
    title: string;
    action: () => void;
  };
};

export default function AppDropzone({
  onClose,
  onSuccess,
  onError,
  accept,
  onDrop,
  title,
  alternativeButton,
}: Props) {
  const { t } = useTranslation('upload');
  const bodyRef = useRef<AppDropzoneBodyRef>(null);

  const handleConfirm = () => {
    void bodyRef.current?.upload();
  };

  return (
    <AppModal
      title={title || t('modal.title')}
      className="modal-upload"
      close={onClose}
      confirm={handleConfirm}
      alternativeButton={alternativeButton}
    >
      <AppDropzoneBody
        ref={bodyRef}
        onSuccess={onSuccess}
        onError={onError}
        accept={accept}
        onDrop={onDrop}
        showConfirmButton={false}
      />
    </AppModal>
  );
}
