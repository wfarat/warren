import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UserData = {
  given_name?: string;
  name?: string;
  photoUrl?: string;
  email?: string;
};

interface UserState extends UserData {
  isAuthenticated: boolean;
  location: { lat: number; lng: number };
}

const initialState: UserState = {
  isAuthenticated: false,
  location: { lat: 54.352, lng: 18.6466 },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.given_name = action.payload.given_name;
      state.name = action.payload.name;
      state.photoUrl = action.payload.photoUrl;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      Object.assign(state, initialState);
    },
    setUserLocation(state, action: PayloadAction<{ lat: number; lng: number }>) {
      state.location = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserLocation } = userSlice.actions;
export const userReducer = userSlice.reducer;
