import type { RootState } from '@/store';

export const selectProfile = (state: RootState) => state.profile;
export const selectSelectedUserId = (state: RootState) => state.profile.selectedUserId;
