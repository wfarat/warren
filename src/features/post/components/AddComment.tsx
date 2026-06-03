import { useAppDispatch, useAppSelector } from '@/store';
import { useState } from 'react';
import { addCommentAction, selectCurrentPostId } from '@/features';
import { Button } from '@/components';
import Send from '@/assets/icons/Send.svg?react';

type Props = {
  className?: string;
};
export function AddComment({ className }: Props) {
  const [content, setContent] = useState('');
  const postId = useAppSelector(selectCurrentPostId);
  const dispatch = useAppDispatch();
  const handleCommentSubmit = () => {
    if (!content.trim() || !postId) return;
    dispatch(addCommentAction(postId, content, () => setContent('')));
  };
  return (
    <div className={className}>
      <div className="flex items-end bg-bg-3 p-3 rounded-lg h-20 border border-grey-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="  w-[calc(100%-2rem)]  focus:outline-none  text-white resize-none"
          placeholder="Write a comment..."
        />
        <Button intent="primary" size="icon" onClick={handleCommentSubmit}>
          <Send />
        </Button>
      </div>
    </div>
  );
}
