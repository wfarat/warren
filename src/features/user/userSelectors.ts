import type { RootState } from 'store';

export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserEmail = (state: RootState) => state.user.email;
export const selectLocation = (state: RootState) => state.user.location;
