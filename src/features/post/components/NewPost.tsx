import { useAppDispatch, useAppSelector } from '@/store';
import { createPostAction, selectUserPhoto, useMediaDialog } from '@/features';
import { Button, IconButton, MediaDialog } from '@/components';
import Picture from '@/assets/icons/Picture.svg?react';
import Video from '@/assets/icons/Video.svg?react';
import Poll from '@/assets/icons/Poll.svg?react';
import { selectPostInput, selectPostLoading } from '@/features/post/postSelectors.ts';
import { setPostInput } from '@/features/post/postSlice.ts';
import { useState } from 'react';
import { uploadImage } from '@/api/cloudinary.ts';
import type { Media } from '@/types';

export function NewPost() {
  const dispatch = useAppDispatch();
  const photoUrl = useAppSelector(selectUserPhoto);
  const isFeedLoading = useAppSelector(selectPostLoading);
  const postInput = useAppSelector(selectPostInput);
  const [file, setFile] = useState<File | undefined>();

  const mediaDialog = useMediaDialog();

  const handlePostSubmit = async () => {
    if (!postInput.content.trim()) return;
    if (file && postInput.media?.type === 'image') {
      const publicId = await uploadImage(file);
      const newPostInput = {
        ...postInput,
        media: {
          type: postInput.media?.type,
          publicId,
        },
      };
      dispatch(
        createPostAction(newPostInput, () => {
          dispatch(setPostInput({ content: '' }));
        })
      );
      setFile(undefined);
    } else {
      dispatch(
        createPostAction(postInput, () => {
          dispatch(setPostInput({ content: '' }));
        })
      );
    }
  };

  const setMedia = (media: Media) => {
    dispatch(setPostInput({ ...postInput, media }));
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
          />
        </div>
        {postInput.media && postInput.media.type === 'image' && (
          <div className="relative w-full max-h-100 aspect-video rounded-lg border border-grey-2 overflow-hidden bg-bg-2">
            <img
              src={postInput.media.url}
              alt="Post media preview"
              className="w-full h-full object-cover"
            />

            <Button
              intent="outlined"
              className="absolute top-3 right-3"
              onClick={() => dispatch(setPostInput({ ...postInput, media: undefined }))}
            >
              Remove
            </Button>
          </div>
        )}
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
        <MediaDialog
          action={setMedia}
          type={mediaDialog.mediaType}
          onClose={mediaDialog.close}
          setFile={setFile}
          file={file}
        />
      )}
    </>
  );
}
