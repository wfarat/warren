import { useAppSelector } from '@/store';
import { selectUser } from '@/features';
import { DialogButton } from '@/components/common/dialog/DialogButton.tsx';
import Picture from '@/assets/icons/Picture.svg?react';
import Video from '@/assets/icons/Video.svg?react';
import { Button } from '@/components';

export function NewPost() {
  const { photoUrl } = useAppSelector(selectUser);

  return (
    <div className="border border-grey-2 bg-bg-3 p-6 flex flex-col gap-4 rounded-xl drop-shadow-bg-3">
      <div>
        <img src={photoUrl} className="rounded-full w-12 h-12" alt="User profile picture" />
        <textarea
          className="bg-transparent outline-none w-full text-white text-sm placeholder:opacity-60"
          placeholder="What's on your mind?"
        ></textarea>
      </div>
      <div className="flex-between">
        <div className="flex-center gap-2">
          <DialogButton icon={Picture} text="Media" />
          <DialogButton icon={Video} text="Video" />
        </div>
        <Button intent="primary-dark">Post</Button>
      </div>
    </div>
  );
}
