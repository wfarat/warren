import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTimelinePage } from '../postActions.ts';
import { PostCard } from './PostCard';
import { Button } from '@/components';

export function PostList() {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.user.currentUser?.id);

  const { timeline, isLoading, hasMore } = useAppSelector((state) => state.post);

  useEffect(() => {
    if (timeline.length === 0 && currentUserId) {
      dispatch(fetchTimelinePage(true));
    }
  }, [dispatch, currentUserId, timeline.length]);

  return (
    <div className="flex flex-col gap-4 mx-auto w-full">
      {timeline.map((post) => (
        <PostCard key={post.id} timelinePost={post} currentUserId={currentUserId || ''} />
      ))}

      {isLoading && <p className="text-center text-gray-500">Loading feed items...</p>}

      {hasMore && !isLoading && (
        <Button onClick={() => dispatch(fetchTimelinePage(false))} intent="primary-dark" size="lg">
          Load More Posts
        </Button>
      )}
    </div>
  );
}
