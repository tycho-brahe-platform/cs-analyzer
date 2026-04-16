import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Button } from 'tycho-storybook';
import './style.scss';
import type { UploadedFile } from './UploadedFile';

export type AppDropzoneBodyProps = {
  onSuccess: (files: UploadedFile[]) => void;
  onError?: (err: unknown) => void;
  accept: Record<string, string[]>;
  onDrop?: () => void;
  /** When false, the confirm button is hidden (e.g. when used inside modal with its own confirm) */
  showConfirmButton?: boolean;
};

export type AppDropzoneBodyRef = {
  upload: () => Promise<void>;
};

function AppDropzoneBodyInner(
  {
    onSuccess,
    onError,
    accept,
    onDrop,
    showConfirmButton = true,
  }: AppDropzoneBodyProps,
  ref: React.Ref<AppDropzoneBodyRef>
) {
  const { t } = useTranslation('upload');

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const filesRef = useRef<File[]>([]);
  filesRef.current = files;

  const upload = async () => {
    const currentFiles = filesRef.current;
    if (currentFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    try {
      const results: UploadedFile[] = await Promise.all(
        currentFiles.map(async (file) => ({
          name: file.name,
          content: await file.text(),
        }))
      );
      onSuccess(results);
    } catch (err) {
      onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    upload,
  }));

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setFiles((prev) => [...prev, ...acceptedFiles]);
    onDrop?.();
  };

  const clearFiles = () => setFiles([]);

  const removeAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="dropzone-container">
      <Dropzone onDrop={handleDrop} accept={accept} multiple>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <span>{t('label.dropzone')}</span>
          </div>
        )}
      </Dropzone>

      {files.length > 0 && (
        <div className="uploaded-message">
          <b>{t('label.uploaded.file')}</b>
          <ul className="uploaded-file-list">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}-${index}`}>
                <span>{file.name}</span>
                <button
                  type="button"
                  className="uploaded-file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(index);
                  }}
                  aria-label={t('common:button.remove', { defaultValue: 'Remove' })}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="uploaded-clear-all" onClick={clearFiles}>
            {t('label.clear.all', { defaultValue: 'Clear all' })}
          </button>
          <b>{t('label.confirm')}</b>
        </div>
      )}

      {files.length > 0 && showConfirmButton && (
        <Button
          onClick={() => {
            void upload();
          }}
          text={t('common:button.confirm')}
        />
      )}
    </div>
  );
}

const AppDropzoneBody = forwardRef<AppDropzoneBodyRef, AppDropzoneBodyProps>(
  AppDropzoneBodyInner
);

export default AppDropzoneBody;
