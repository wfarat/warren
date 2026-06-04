import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Photo, Profile } from '@/types';

type ProfileState = {
  selectedUserId?: string;
  profile: Profile;
  isLoading: boolean;
};
const initialState: ProfileState = {
  profile: {
    name: '',
    followers: 0,
    following: 0,
  },
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
    setProfilePhoto: (state, action: PayloadAction<Photo>) => {
      state.profile.photo = action.payload;
    },
  },
});

export const { setSelectedUserId, setProfile, setProfileLoading, setProfilePhoto } =
  profileSlice.actions;
export const profileReducer = profileSlice.reducer;
