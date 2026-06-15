import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@/types';

type ProfileState = {
  selectedUserId?: string;
  profile: Profile;
  isLoading: boolean;
};

const initialState: ProfileState = {
  profile: { id: '', name: '', followers: 0, following: 0 },
  isLoading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    updateProfileSuccess: (state, action: PayloadAction<Partial<Profile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateFollowedByMe: (state, action: PayloadAction<boolean>) => {
      state.profile = {
        ...state.profile,
        followedByMe: action.payload,
      };
    },
  },
});

export const {
  setSelectedUserId,
  setProfile,
  setProfileLoading,
  updateProfileSuccess,
  updateFollowedByMe,
} = profileSlice.actions;

export const profileReducer = profileSlice.reducer;
