import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Comment, Post, PostInput } from '@/types';

interface PostState {
  timeline: Post[];
  profilePosts: Post[];
  lastVisibleDoc: any | null;
  isLoading: boolean;
  hasMore: boolean;
  postInput: PostInput;
  currentPostId?: string;
  comments: Comment[];
  replies: Record<string, Comment[]>;
  currentReplies?: string[];
  commentIds: string[];
  currentCommentId?: string;
  currentPost?: Post;
}

const initialState: PostState = {
  timeline: [],
  profilePosts: [],
  lastVisibleDoc: null,
  isLoading: false,
  hasMore: true,
  postInput: {
    content: '',
  },
  comments: [],
  replies: {},
  commentIds: [],
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setFeedLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    appendFeedPage: (state, action: PayloadAction<{ posts: Post[]; lastDoc: any | null }>) => {
      state.timeline = [...state.timeline, ...action.payload.posts];
      state.lastVisibleDoc = action.payload.lastDoc;
      if (action.payload.posts.length < 15) {
        state.hasMore = false;
      }
    },
    insertNewPost: (state, action: PayloadAction<Post>) => {
      state.timeline.push(action.payload);
    },
    resetFeed: (state) => {
      state.timeline = [];
      state.lastVisibleDoc = null;
      state.hasMore = true;
    },
    setPostInput: (state, action: PayloadAction<PostInput>) => {
      state.postInput = action.payload;
    },
    setCurrentPostId: (state, action: PayloadAction<string>) => {
      state.currentPostId = action.payload;
    },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },
    addComment: (
      state,
      action: PayloadAction<{
        comment: Comment;
        parentId?: string;
      }>
    ) => {
      if (action.payload.parentId) {
        const comment = state.comments.find((c) => c.id === action.payload.parentId);
        comment?.replies.push(action.payload.comment.id);
        state.replies[action.payload.parentId].push(action.payload.comment);
        state.commentIds.push(action.payload.parentId);
      } else {
        state.comments.push(action.payload.comment);
      }
    },
    setReplies: (state, action: PayloadAction<{ replies: Comment[]; id: string }>) => {
      state.replies[action.payload.id] = action.payload.replies;
    },
    setCurrentReplies: (state, action: PayloadAction<{ replies: string[]; id: string }>) => {
      state.currentReplies = action.payload.replies;
      state.commentIds.push(action.payload.id);
      state.currentCommentId = action.payload.id;
    },
    setProfilePosts: (state, action: PayloadAction<Post[]>) => {
      state.profilePosts = action.payload;
    },
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      state.currentPost = action.payload;
    },
  },
});

export const {
  setFeedLoading,
  appendFeedPage,
  resetFeed,
  insertNewPost,
  setPostInput,
  setCurrentPostId,
  setComments,
  addComment,
  setReplies,
  setCurrentReplies,
  setProfilePosts,
  setCurrentPost,
} = postSlice.actions;
export const postReducer = postSlice.reducer;
