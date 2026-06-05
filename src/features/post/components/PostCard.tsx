import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/api/firebase';
import { postRepo } from '@/api';
import type { Post } from '@/types';
import { Card, IconButton } from '@/components';
import Like from '@/assets/icons/Like.svg?react';
import Share from '@/assets/icons/Share.svg?react';
import Comment from '@/assets/icons/Comment.svg?react';
import More from '@/assets/icons/More.svg?react';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '@/api/cloudinary.ts';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectAvatarCacheBuster, selectCurrentUserId, setCurrentPost, setCurrentPostId, } from '@/features';
import { getTimeText } from '@/utils/timeUtils.ts';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';

type PostCardProps = {
  timelinePost: Post;
  full?: boolean;
  onProfile?: boolean;
};

export function PostCard({ timelinePost, full, onProfile }: PostCardProps) {
  const [liveLikesCount, setLiveLikesCount] = useState(timelinePost.likesCount);
  const [liveCommentsCount, setLiveCommentsCount] = useState(timelinePost.commentsCount);
  const [liveSharesCount, setLiveSharesCount] = useState(timelinePost.sharesCount);
  const [isLiked, setIsLiked] = useState(false);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const cacheBuster = useAppSelector(selectAvatarCacheBuster);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const masterPostRef = doc(db, 'posts', timelinePost.id);

    const unsubscribe = onSnapshot(masterPostRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLiveLikesCount(data.likesCount || 0);
        setLiveCommentsCount(data.commentsCount || 0);
        setLiveSharesCount(data.sharesCount || 0);
        const likesArray: string[] = data.likes || [];
        if (currentUserId) {
          setIsLiked(likesArray.includes(currentUserId));
        }
      }
    });

    return () => unsubscribe();
  }, [timelinePost.id, currentUserId]);

  const handleLikeToggle = async () => {
    if (!currentUserId) return;
    try {
      // Optimistic UI updates feel instantaneous to users
      setIsLiked(!isLiked);
      setLiveLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      await postRepo.toggleLike(timelinePost.id, currentUserId, isLiked);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleComment = () => {
    dispatch(setCurrentPostId(timelinePost.id));
    if (onProfile) {
      dispatch(setCurrentPost(timelinePost));
      navigate(`/post/${timelinePost.id}`);
    }
  };
  const postImage = (publicId: string) => {
    let image = cld.image(publicId);
    if (full) {
      return image.resize(scale().width(800));
    }
    return image.resize(fill().width(800).height(400));
  };
  const avatarImage = cld
    .image(`users/${timelinePost.author.userId}/profile`)
    .resize(fill().width(40).height(40))
    .format('auto');
  const freshAvatarUrl = `${avatarImage.toURL()}?v=${cacheBuster}`;
  return (
    <Card>
      <button
        type="button"
        className="flex-center border-none absolute top-2 right-2 w-10 h-10 cursor-pointer rounded-full hover:bg-grey-2"
      >
        <More />
      </button>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full border border-grey-2 overflow-hidden bg-bg-2">
          <img
            src={freshAvatarUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://res.cloudinary.com/dtz3qhhlp/image/upload/v1780652522/placeholder.jpg';
            }}
          />
        </div>
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
      {timelinePost.media && timelinePost.media.type === 'image' && (
        <div
          className={twMerge(
            'relative w-full rounded-lg border border-grey-2 overflow-hidden bg-bg-2',
            full ? 'h-auto aspect-auto' : 'max-h-100 aspect-video'
          )}
        >
          {timelinePost.media.publicId && (
            <AdvancedImage
              alt=""
              className="w-full h-full object-cover"
              cldImg={postImage(timelinePost.media.publicId)}
            />
          )}
          {timelinePost.media.url && (
            <img src={timelinePost.media.url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )}
      <div className="flex gap-6 text-sm pt-4 text-grey-1 border-t border-grey-2">
        <IconButton
          onClick={handleLikeToggle}
          icon={Like}
          filled={isLiked}
          buttonClass={isLiked ? 'text-primary' : 'text-grey-1'}
          text={String(liveLikesCount)}
          textClass="text-grey-1"
        />
        <IconButton
          onClick={handleComment}
          icon={Comment}
          text={String(liveCommentsCount)}
          textClass="text-grey-1"
        />
        <IconButton icon={Share} text={String(liveSharesCount)} textClass="text-grey-1" />
      </div>
    </Card>
  );
}
