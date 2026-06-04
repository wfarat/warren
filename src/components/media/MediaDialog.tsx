import { Button, Dialog, Input, TabNav, type TabOption } from '@/components';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
import Upload from '@/assets/icons/Upload.svg?react';
import { validUrl } from '@/validators';
import type { Validity } from '@/types/util.ts';
import type { Media } from '@/types';

type Props = {
  type: 'image' | 'video' | null;
  onClose: () => void;
  setFile: (file: File) => void;
  file?: File;
  action?: (media: Media) => void;
};

type MediaTab = 'upload' | 'link';

const TAB_OPTIONS: TabOption<MediaTab>[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'link', label: 'Link' },
];

export function MediaDialog({ type, onClose, setFile, file, action }: Props) {
  if (!type) return null;

  const [validity, setValidity] = useState<Validity>({ url: false });
  const [url, setUrl] = useState<string>('');
  const [tab, setTab] = useState<MediaTab>('upload');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const title = type === 'image' ? 'Add Image' : 'Add Video';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setValidity({ url: true });
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
      setValidity({ url: true });
    }
  };

  const handleSubmit = () => {
    if (!action) return;
    if (tab === 'upload' && file) {
      const temporaryLocalUrl = URL.createObjectURL(file);
      action({ type, url: temporaryLocalUrl });
    } else {
      action({ type, url });
    }
    onClose();
  };

  const isFormInvalid = tab === 'link' ? !validity.url : !file;

  return (
    <Dialog onClose={onClose} title={title} onSubmit={handleSubmit} disabled={isFormInvalid}>
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
              value={url}
              name="url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste link here"
              validation={(value) => (validUrl(value) ? '' : 'Invalid URL')}
              setValid={setValidity}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
