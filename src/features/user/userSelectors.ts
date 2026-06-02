import type { RootState } from '@/store';

export const selectUser = (state: RootState) => state.user;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserPhoto = (state: RootState) => state.user.currentUser?.photoUrl;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectLocation = (state: RootState) => state.user.location;
