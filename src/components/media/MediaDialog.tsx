import { Button, Dialog, Input, TabNav, type TabOption } from '@/components';
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Upload from '@/assets/icons/Upload.svg?react';
import { validUrl } from '@/validators';
import type { Media } from '@/types';

type Props = {
  type: 'image' | 'video' | null;
  onClose: () => void;
  setFile: (file: File | undefined) => void;
  file?: File;
  action?: (media: Media) => void;
};

type MediaTab = 'upload' | 'link';

type FormValues = {
  url: string;
};

const TAB_OPTIONS: TabOption<MediaTab>[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'link', label: 'Link' },
];

export function MediaDialog({ type, onClose, setFile, file, action }: Props) {
  if (!type) return null;

  const [tab, setTab] = useState<MediaTab>('upload');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const title = type === 'image' ? 'Add Image' : 'Add Video';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { url: '' },
  });

  const urlValue = watch('url');

  useEffect(() => {
    if (tab === 'upload') {
      setValue('url', '');
    } else {
      setFile(undefined);
    }
  }, [tab, setValue, setFile]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];

      if (type === 'image' && !droppedFile.type.startsWith('image/')) return;
      if (type === 'video' && !droppedFile.type.startsWith('video/')) return;

      setFile(droppedFile);
    }
  };

  const onFormSubmit = (data: FormValues) => {
    if (!action) return;

    if (tab === 'upload' && file) {
      const temporaryLocalUrl = URL.createObjectURL(file);
      action({ type, url: temporaryLocalUrl });
    } else if (tab === 'link' && data.url) {
      action({ type, url: data.url });
    }

    onClose();
  };

  const isFormInvalid = tab === 'link' ? !isValid || !urlValue : !file;

  return (
    <Dialog
      onClose={onClose}
      title={title}
      onSubmit={handleSubmit(onFormSubmit)}
      disabled={isFormInvalid}
    >
      <TabNav options={TAB_OPTIONS} activeTab={tab} onChange={setTab} />

      <div className="p-12 w-full">
        {tab === 'upload' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-center p-12 flex-col gap-4 border-2 transition-colors rounded-lg cursor-pointer ${
              isDragging ? 'border-primary border-solid bg-bg-2' : 'border-grey-2 border-dashed'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={type === 'image' ? 'image/*' : 'video/*'}
              className="hidden"
            />

            <div className="flex-center w-16 h-16 bg-bg-3 rounded-full">
              <Upload />
            </div>

            <span className="text-on-surface text-center">
              {file ? `Selected: ${file.name}` : 'Drag and drop media here'}
            </span>

            <Button intent="primary-dark" size="lg" onClick={handleBrowseClick} type="button">
              {file ? 'Change File' : 'Browse Files'}
            </Button>
          </div>
        )}

        {tab === 'link' && (
          <div className="flex-center flex-col gap-4 p-12">
            <span className="text-on-surface">Link to media</span>
            <Input
              type="text"
              placeholder="Paste link here"
              error={errors.url?.message}
              {...register('url', {
                required: 'A destination address link is required',
                validate: (value) => validUrl(value) || 'Invalid URL layout format',
              })}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
