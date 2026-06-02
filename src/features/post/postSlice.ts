// src/features/post/postSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '@/types';

interface PostState {
  timeline: Post[];
  lastVisibleDoc: any | null;
  isLoading: boolean;
  hasMore: boolean;
}

const initialState: PostState = {
  timeline: [],
  lastVisibleDoc: null,
  isLoading: false,
  hasMore: true,
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
    resetFeed: (state) => {
      state.timeline = [];
      state.lastVisibleDoc = null;
      state.hasMore = true;
    },
  },
});

export const { setFeedLoading, appendFeedPage, resetFeed } = postSlice.actions;
export const postReducer = postSlice.reducer;
