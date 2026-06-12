import type { RootState } from '@/store';

export const selectUser = (state: RootState) => state.user;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectCurrentUserId = (state: RootState) => state.user.currentUser?.id;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectLocation = (state: RootState) => state.user.location;
export const selectAvatarCacheBuster = (state: RootState) => state.user.avatarCacheBuster;
export const selectIsRegistering = (state: RootState) => state.user.isRegistering;
