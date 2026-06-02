import { type AppDispatch, type RootState } from '@/store';
import { postRepo } from '@/api';
import { appendFeedPage, insertNewPost, setFeedLoading } from './postSlice';
import { setError, setSuccess } from '@/features';
import type { Post, PostInput } from '@/types';
import { Timestamp } from 'firebase/firestore';

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
      dispatch(setError({ message: 'Failed to fetch timeline posts', retryAction: 'TIMELINE' }));
    } finally {
      dispatch(setFeedLoading(false));
    }
  };

/**
 * Thunk action to create a new post and dispatch the action to the store
 */
export const createPostAction =
  (input: PostInput, onSuccess: () => void) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    const currentUser = user.currentUser;

    if (!currentUser || !input.content.trim()) return;
    const finalPostId = postRepo.generateNewPostId();
    const newPost: Post = {
      id: finalPostId,
      content: input.content,
      author: {
        userId: currentUser.id,
        displayName: currentUser.name || 'Anonymous',
        photoUrl: currentUser.photoUrl || '',
      },
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: Timestamp.fromDate(new Date()),
    };

    if (input.media) {
      newPost.media = input.media;
    }
    try {
      dispatch(insertNewPost(newPost));
      if (onSuccess) onSuccess();

      await postRepo.createPost(finalPostId, newPost);
      dispatch(setSuccess('Post created successfully!'));
    } catch (error) {
      dispatch(setError({ message: 'Failed to create post' }));
      console.log('Failed to create post:', error);
    }
  };
