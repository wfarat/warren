// src/features/post/post.actions.ts
import { type AppDispatch, type RootState } from '@/store';
import { postRepo } from '@/api';
import { appendFeedPage, setFeedLoading } from './postSlice';

/**
 * Thunk action to pull the next chunk of posts from the repository layer
 */
export const fetchTimelinePage =
  (isInitial = false) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user, post } = getState();
    const currentUserId = user.currentUser?.id;

    if (!currentUserId || post.isLoading || (!isInitial && !post.hasMore)) return;

    dispatch(setFeedLoading(true));

    try {
      const cursor = isInitial ? null : post.lastVisibleDoc;
      const result = await postRepo.getTimeline(currentUserId, cursor);

      dispatch(
        appendFeedPage({
          posts: result.posts,
          lastDoc: result.lastDoc,
        })
      );
    } catch (error) {
      console.error('Redux error fetching feed:', error);
    } finally {
      dispatch(setFeedLoading(false));
    }
  };
