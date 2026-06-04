import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Photo } from '@/types';

type ProfileState = {
  selectedUserId?: string;
  name: string;
  profession?: string;
  photo?: Photo;
  banner?: Photo;
  bio?: string;
  location?: string;
  website?: string;
  followers: number;
  following: number;
};
const initialState: ProfileState = {
  name: '',
  followers: 0,
  following: 0,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setSelectedUserId: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const { setSelectedUserId } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
