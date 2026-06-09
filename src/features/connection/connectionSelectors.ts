import type { RootState } from '@/store';

export const selectConnection = (state: RootState) => state.connection;
