import { type AppDispatch, type RootState } from '@/store';
import { postRepo } from '@/api';
import {
  addComment,
  appendFeedPage,
  insertNewPost,
  setCurrentPost,
  setError,
  setFeedLoading,
  setProfilePosts,
  setSuccess,
} from '@/features';
import type { Comment, Post, PostInput } from '@/types';
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
 * Thunk action to pull the profile posts from the repository layer
 */
export const fetchProfilePosts = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { post, profile } = getState();
  if (post.isLoading || !profile.selectedUserId) return;
  dispatch(setFeedLoading(true));

  try {
    const posts = await postRepo.getUserProfilePosts(profile.selectedUserId);
    if (posts) {
      dispatch(setProfilePosts(posts));
    }
  } catch (error) {
    dispatch(setError({ message: 'Failed to fetch profile posts', retryAction: 'PROFILE' }));
  } finally {
    dispatch(setFeedLoading(false));
  }
};

/**
 * Thunk action to pull one post from the repository layer
 */
export const fetchPost =
  (postId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { post } = getState();
    if (post.isLoading) return;
    dispatch(setFeedLoading(true));

    try {
      const post = await postRepo.getSinglePost(postId);
      if (post) {
        dispatch(setCurrentPost(post));
      }
    } catch (error) {
      dispatch(setError({ message: 'Failed to fetch post', retryAction: 'POST' }));
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
      console.error('Failed to create post:', error);
    }
  };

export const addCommentAction =
  (postId: string, content: string, onSuccess: () => void, commentId?: string, isReply?: boolean) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    const currentUser = user.currentUser;
    if (!currentUser || !content.trim()) return;
    const finalCommentId = postRepo.generateNewCommentId(postId);
    const newComment: Comment = {
      author: {
        userId: currentUser.id,
        displayName: currentUser.name || 'Anonymous',
        photoUrl: currentUser.photoUrl || '',
      },
      content,
      createdAt: Timestamp.fromDate(new Date()),
      id: finalCommentId,
      likes: [],
      replies: [],
      isReply: !!commentId,
    };
    try {
      dispatch(addComment({ comment: newComment, parentId: commentId }));
      if (onSuccess) onSuccess();
      await postRepo.addComment(postId, newComment, commentId, isReply);
      dispatch(setSuccess('Comment added successfully!'));
    } catch (error) {
      dispatch(setError({ message: 'Failed to add comment' }));
      console.error('Failed to add comment:', error);
    }
  };
