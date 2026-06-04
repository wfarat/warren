import { fetchTimelinePage, PostList, selectCurrentUserId, selectPost } from '@/features';
import { Button } from '@/components';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';

export function Timeline() {
  const dispatch = useAppDispatch();
  const { timeline, isLoading, hasMore } = useAppSelector(selectPost);
  const currentUserId = useAppSelector(selectCurrentUserId);
  useEffect(() => {
    if (timeline.length === 0 && currentUserId) {
      dispatch(fetchTimelinePage(true));
    }
  }, [dispatch, currentUserId, timeline.length]);

  return (
    <>
      <PostList posts={timeline} />
      {hasMore && !isLoading && (
        <Button onClick={() => dispatch(fetchTimelinePage(false))} intent="primary-dark" size="lg">
          Load More Posts
        </Button>
      )}
    </>
  );
}
