// src/features/post/PostCard.tsx
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/api/firebase';
import { postRepo } from '@/api';
import type { Post } from '@/types';

type PostCardProps = {
  timelinePost: Post;
  currentUserId: string;
};

export function PostCard({ timelinePost, currentUserId }: PostCardProps) {
  const [liveLikesCount, setLiveLikesCount] = useState(timelinePost.likesCount);
  const [liveCommentsCount, setLiveCommentsCount] = useState(timelinePost.commentsCount);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const masterPostRef = doc(db, 'posts', timelinePost.id);

    const unsubscribe = onSnapshot(masterPostRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLiveLikesCount(data.likesCount || 0);
        setLiveCommentsCount(data.commentsCount || 0);

        // Check if current user is in the master likes array
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

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
      {/* Author Header */}
      <div className="flex items-center gap-2 mb-3">
        <img src={timelinePost.author.photoUrl} className="w-9 h-9 rounded-full" alt="" />
        <span className="font-semibold text-gray-800 dark:text-zinc-200">
          {timelinePost.author.displayName}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-700 dark:text-zinc-300 mb-4">{timelinePost.content}</p>

      {/* Interaction Bar */}
      <div className="flex gap-6 text-sm text-gray-500 border-t pt-3 dark:border-zinc-800">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-1 font-medium ${isLiked ? 'text-blue-600' : 'hover:text-blue-500'}`}
        >
          👍 {liveLikesCount} Likes
        </button>
        <span className="cursor-pointer hover:text-gray-700">💬 {liveCommentsCount} Comments</span>
      </div>
    </div>
  );
}
