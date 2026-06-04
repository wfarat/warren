import type { RootState } from '@/store';

export const selectPost = (state: RootState) => state.post;
export const selectTimeline = (state: RootState) => state.post.timeline;
export const selectPostLoading = (state: RootState) => state.post.isLoading;
export const selectPostInput = (state: RootState) => state.post.postInput;
export const selectCurrentPostId = (state: RootState) => state.post.currentPostId;
export const selectComments = (state: RootState) => state.post.comments;
export const selectReplies = (state: RootState) => state.post.replies;
