import { useAppSelector } from '@/store';
import { selectUserPhoto } from '@/features';
import { DialogButton } from '@/components/common/dialog/DialogButton.tsx';
import Picture from '@/assets/icons/Picture.svg?react';
import Video from '@/assets/icons/Video.svg?react';
import Poll from '@/assets/icons/Poll.svg?react';
import { Button } from '@/components';

export function NewPost() {
  const photoUrl = useAppSelector(selectUserPhoto);

  return (
    <div className="border border-grey-2 bg-bg-3 p-6 flex flex-col gap-4 rounded-xl drop-shadow-bg-3">
      <div className="flex gap-4">
        <img src={photoUrl} className="rounded-full w-12 h-12" alt="User profile picture" />
        <textarea
          className="bg-bg-2 p-3 rounded-lg h-25 w-full border border-grey-2 focus:outline-none focus:border-primary-light"
          placeholder="What's on your mind?"
        ></textarea>
      </div>
      <div className="flex-between border-t border-grey-2 pt-4">
        <div className="flex-center gap-2">
          <DialogButton icon={Picture} text="Media" />
          <DialogButton icon={Video} text="Video" />
          <DialogButton icon={Poll} text="Poll" />
        </div>
        <Button intent="primary-dark">Post</Button>
      </div>
    </div>
  );
}
