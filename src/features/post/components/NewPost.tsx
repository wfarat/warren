import { useAppDispatch, useAppSelector } from '@/store';
import { createPostAction, selectUserPhoto } from '@/features';
import { Button, IconButton } from '@/components';
import { MediaDialog } from './MediaDialog'; // 🌟 Import your dialog component
import { useMediaDialog } from '../useMediaDialog'; // 🌟 Import your updated hook
import Picture from '@/assets/icons/Picture.svg?react';
import Video from '@/assets/icons/Video.svg?react';
import Poll from '@/assets/icons/Poll.svg?react';
import { selectPostInput, selectPostLoading } from '@/features/post/postSelectors.ts';
import { setPostInput } from '@/features/post/postSlice.ts';

export function NewPost() {
  const dispatch = useAppDispatch();
  const photoUrl = useAppSelector(selectUserPhoto);
  const isFeedLoading = useAppSelector(selectPostLoading);
  const postInput = useAppSelector(selectPostInput);

  const mediaDialog = useMediaDialog();

  const handlePostSubmit = () => {
    if (!postInput.content.trim()) return;

    dispatch(
      createPostAction(postInput, () => {
        dispatch(setPostInput({ content: '' }));
      })
    );
  };

  const getButtonIntent = () => {
    return !isFeedLoading && postInput.content.trim() ? 'primary-dark' : 'disabled';
  };

  return (
    <>
      <div className="border border-grey-2 bg-bg-3 p-6 flex flex-col gap-4 rounded-xl drop-shadow-bg-3">
        <div className="flex gap-4">
          <img
            src={photoUrl}
            className="rounded-full w-12 h-12 object-cover"
            alt="User profile picture"
          />
          <textarea
            value={postInput.content}
            onChange={(e) => dispatch(setPostInput({ ...postInput, content: e.target.value }))}
            className="bg-bg-2 p-3 rounded-lg h-25 w-full border border-grey-2 focus:outline-none focus:border-primary-light text-white resize-none"
            placeholder="What's on your mind?"
            disabled={isFeedLoading}
          ></textarea>
        </div>
        <div className="flex-between border-t border-grey-2 pt-4">
          <div className="flex-center gap-2">
            <IconButton icon={Picture} text="Media" onClick={() => mediaDialog.open('image')} />
            <IconButton icon={Video} text="Video" onClick={() => mediaDialog.open('video')} />
            <IconButton icon={Poll} text="Poll" onClick={() => console.log('Poll clicked')} />
          </div>
          <Button intent={getButtonIntent()} onClick={handlePostSubmit}>
            {isFeedLoading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      {mediaDialog.isOpen && (
        <MediaDialog type={mediaDialog.mediaType} onClose={mediaDialog.close} />
      )}
    </>
  );
}
