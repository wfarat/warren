import { Dialog } from '@/components';

type Props = {
  type: 'image' | 'video' | null;
  onClose: () => void;
};

export function MediaDialog({ type, onClose }: Props) {
  if (!type) return null; // Safety guard

  const title = type === 'image' ? 'Add Image' : 'Add Video';

  return (
    <Dialog onClose={onClose} title={title}>
      {/* Inputs for uploading your media files will go here later */}
      <div className="text-white mt-4 p-4 border border-dashed border-grey-2 rounded-lg text-center">
        Drag and drop your files here or browse
      </div>
    </Dialog>
  );
}
