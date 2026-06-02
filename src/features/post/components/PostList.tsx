import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTimelinePage } from '../post.actions';
import { PostCard } from './PostCard';

export function PostList() {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.user.currentUser?.id);

  // Connect straight to Redux for global layouts
  const { timeline, isLoading, hasMore } = useAppSelector((state) => state.post);

  useEffect(() => {
    // Only trigger initial load if the feed array is totally empty
    if (timeline.length === 0 && currentUserId) {
      dispatch(fetchTimelinePage(true));
    }
  }, [dispatch, currentUserId, timeline.length]);

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
      {timeline.map((post) => (
        <PostCard key={post.id} timelinePost={post} currentUserId={currentUserId || ''} />
      ))}

      {isLoading && <p className="text-center text-gray-500">Loading feed items...</p>}

      {hasMore && !isLoading && (
        <button
          onClick={() => dispatch(fetchTimelinePage(false))}
          className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Load More Posts
        </button>
      )}
    </div>
  );
}
