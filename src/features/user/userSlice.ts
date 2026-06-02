import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UserData = {
  id: string;
  given_name?: string;
  name?: string;
  photoUrl?: string;
  email?: string;
};

interface UserState {
  currentUser: UserData | null;
  isAuthenticated: boolean;
  location: { lat: number; lng: number };
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
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
  },
});

export const { setUser, clearUser, setUserLocation } = userSlice.actions;
export const userReducer = userSlice.reducer;
