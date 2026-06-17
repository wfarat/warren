import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Group } from '@/types';

interface GroupsState {
  myGroups: Group[];
  discoverGroups: Group[];
  tagFilter: string;
  isLoading: boolean;
}

const initialState: GroupsState = {
  myGroups: [],
  discoverGroups: [],
  tagFilter: '',
  isLoading: false,
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroupsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setMyGroups: (state, action: PayloadAction<Group[]>) => {
      state.myGroups = action.payload;
    },

    setDiscoverGroups: (state, action: PayloadAction<Group[]>) => {
      state.discoverGroups = action.payload;
    },

    setGroupTagFilter: (state, action: PayloadAction<string>) => {
      state.tagFilter = action.payload;
    },

    appendJoinedGroup: (state, action: PayloadAction<Group>) => {
      const exists = state.myGroups.some((g) => g.id === action.payload.id);
      if (!exists) {
        state.myGroups.push(action.payload);
      }
    },

    removeDiscoverGroup: (state, action: PayloadAction<string>) => {
      state.discoverGroups = state.discoverGroups.filter((g) => g.id !== action.payload);
    },
  },
});

export const {
  setGroupsLoading,
  setMyGroups,
  setDiscoverGroups,
  setGroupTagFilter,
  appendJoinedGroup,
  removeDiscoverGroup,
} = groupSlice.actions;

export const groupReducer = groupSlice.reducer;
