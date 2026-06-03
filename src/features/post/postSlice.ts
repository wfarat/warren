import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Comment, Post, PostInput } from '@/types';

interface PostState {
  timeline: Post[];
  lastVisibleDoc: any | null;
  isLoading: boolean;
  hasMore: boolean;
  postInput: PostInput;
  currentPostId?: string;
  comments: Comment[];
}

const initialState: PostState = {
  timeline: [],
  lastVisibleDoc: null,
  isLoading: false,
  hasMore: true,
  postInput: {
    content: '',
  },
  comments: [],
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
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
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
} = postSlice.actions;
export const postReducer = postSlice.reducer;
