import { IconButton } from '@/components';
import Heart from '@/assets/icons/Heart.svg?react';
import type { Comment } from '@/types';
import { getTimeText } from '@/utils/timeUtils.ts';
import { postRepo } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  AddComment,
  selectCurrentUserId,
  selectPost,
  setCurrentReplies,
  useComments,
} from '@/features';
import { useEffect, useState } from 'react';

export function Comment({ id, author, content, likes, createdAt, replies, isReply }: Comment) {
  const dispatch = useAppDispatch();
  const repliesCount = replies.length;
  const { currentPostId: postId, commentIds } = useAppSelector(selectPost);
  const { replies: commentReplies } = useComments();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [showAddComment, setShowAddComment] = useState(false);
  useEffect(() => {
    if (!likes || !currentUserId) return;
    setIsLiked(likes.includes(currentUserId));
  }, []);
  const handleReply = () => {
    setShowAddComment((prev) => !prev);
  };
  const handleLike = () => {
    if (!postId || !currentUserId) return;
    postRepo.toggleLikeComment(postId, id, currentUserId, isLiked, isReply).then(() => {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    });
  };
  return (
    <div className="flex gap-3 w-full">
      <img className="rounded-full w-8 h-8" src={author.photoUrl} alt={author.displayName} />
      <div className="flex flex-col gap-2 w-full">
        <div className="bg-bg-3 border border-grey-2 rounded-lg p-3 w-full">
          <div className="flex-between">
            <h4 className="text-sm text-on-surface">{author.displayName}</h4>
            <span className="text-xs text-grey-1">{getTimeText(createdAt.toDate())} ago</span>
          </div>
          <p className="text-sm text-on-surface-variant">{content}</p>
        </div>
        <div className="flex gap-3 text-sm text-grey-1">
          <IconButton
            onClick={handleLike}
            icon={Heart}
            buttonClass={isLiked ? 'text-primary' : 'text-grey-1'}
            filled={isLiked}
            text={likesCount.toString()}
          />
          <button
            type="button"
            className="rounded-lg hover:bg-grey-2 p-2 cursor-pointer"
            onClick={handleReply}
          >
            {showAddComment ? 'Close' : 'Reply'}
          </button>
        </div>
        {showAddComment && (
          <AddComment
            className="relative"
            commentId={id}
            onSubmit={handleReply}
            isReply={isReply}
          />
        )}
        {commentIds.includes(id)
          ? (commentReplies[id] ?? []).map((reply) => <Comment key={reply.id} {...reply} />)
          : repliesCount > 0 && (
              <button
                type="button"
                className="rounded-lg hover:bg-grey-2 p-2 cursor-pointer"
                onClick={() => dispatch(setCurrentReplies({ replies, id }))}
              >
                {repliesCount} replies
              </button>
            )}
      </div>
    </div>
  );
}
