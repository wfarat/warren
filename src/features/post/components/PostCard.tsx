// src/features/post/PostCard.tsx
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/api/firebase';
import { postRepo } from '@/api';
import type { Post } from '@/types';
import { IconButton } from '@/components';
import Like from '@/assets/icons/Like.svg?react';
import Share from '@/assets/icons/Share.svg?react';
import Comment from '@/assets/icons/Comment.svg?react';
import More from '@/assets/icons/More.svg?react';

type PostCardProps = {
  timelinePost: Post;
  currentUserId: string;
};

export function PostCard({ timelinePost, currentUserId }: PostCardProps) {
  const [liveLikesCount, setLiveLikesCount] = useState(timelinePost.likesCount);
  const [liveCommentsCount, setLiveCommentsCount] = useState(timelinePost.commentsCount);
  const [liveSharesCount, setLiveSharesCount] = useState(timelinePost.sharesCount);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const masterPostRef = doc(db, 'posts', timelinePost.id);

    const unsubscribe = onSnapshot(masterPostRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLiveLikesCount(data.likesCount || 0);
        setLiveCommentsCount(data.commentsCount || 0);
        setLiveSharesCount(data.sharesCount || 0);
        const likesArray: string[] = data.likes || [];
        setIsLiked(likesArray.includes(currentUserId));
      }
    });

    return () => unsubscribe();
  }, [timelinePost.id, currentUserId]);

  const handleLikeToggle = async () => {
    try {
      // Optimistic UI updates feel instantaneous to users
      setIsLiked(!isLiked);
      setLiveLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      await postRepo.toggleLike(timelinePost.id, currentUserId, isLiked);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const getTimeText = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };
  return (
    <div className="border border-grey-2 bg-bg-3 p-6 relative flex flex-col gap-4 rounded-xl drop-shadow-bg-3">
      <button
        type="button"
        className="flex-center border-none absolute top-2 right-2 w-10 h-10 cursor-pointer rounded-full hover:bg-grey-2"
      >
        <More />
      </button>
      <div className="flex items-center gap-3 mb-3">
        <img src={timelinePost.author.photoUrl} className="w-10 h-10 rounded-full" alt="" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-shadow-on-surface">
            {timelinePost.author.displayName}
          </span>
          <span className="text-xs text-grey-1">
            {getTimeText(timelinePost.createdAt.toDate())} ago
          </span>
        </div>
      </div>

      <p className="text-on-surface-variant mb-4">{timelinePost.content}</p>

      <div className="flex gap-6 text-sm pt-4 text-grey-1 border-t border-grey-2">
        <IconButton
          onClick={handleLikeToggle}
          icon={Like}
          text={String(liveLikesCount)}
          textClass="text-grey-1"
        />
        <IconButton icon={Comment} text={String(liveCommentsCount)} textClass="text-grey-1" />
        <IconButton icon={Share} text={String(liveSharesCount)} textClass="text-grey-1" />
      </div>
    </div>
  );
}
