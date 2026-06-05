import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Photo } from '@/types';

type UserData = {
  id: string;
  given_name?: string;
  name?: string;
  photo?: Photo;
  email?: string;
};

interface UserState {
  currentUser: UserData | null;
  isAuthenticated: boolean;
  avatarCacheBuster: string;
  location: { lat: number; lng: number };
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  avatarCacheBuster: Date.now().toString(),
  location: { lat: 54.352, lng: 18.6466 }, // Defaults to Gdańsk!
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setUserLocation(state, action: PayloadAction<{ lat: number; lng: number }>) {
      state.location = action.payload;
    },
    triggerAvatarRefresh: (state) => {
      state.avatarCacheBuster = Date.now().toString();
    },
  },
});

export const { setUser, clearUser, setUserLocation, triggerAvatarRefresh } = userSlice.actions;
export const userReducer = userSlice.reducer;
