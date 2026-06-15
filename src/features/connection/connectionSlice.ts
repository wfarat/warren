import type { Follower } from '@/types/followers.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ConnectionState = {
  mutualConnections: Follower[];
  pendingFollowBacks: Follower[];
  pureFollowers: Follower[];
};

const initialState: ConnectionState = {
  mutualConnections: [],
  pendingFollowBacks: [],
  pureFollowers: [],
};

export const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setConnectionState: (state, action: PayloadAction<ConnectionState>) => {
      state.pendingFollowBacks = action.payload.pendingFollowBacks;
      state.pureFollowers = action.payload.pureFollowers;
      state.mutualConnections = action.payload.mutualConnections;
    },
    addConnection: (state, action: PayloadAction<Follower>) => {
      if (state.pureFollowers.some((fb) => fb.targetUserId === action.payload.targetUserId)) {
        state.pureFollowers = state.pureFollowers.filter(
          (fb) => fb.targetUserId !== action.payload.targetUserId
        );
        state.mutualConnections.push(action.payload);
      } else {
        state.pendingFollowBacks.push(action.payload);
      }
    },
    removeConnection: (state, action: PayloadAction<Follower>) => {
      state.mutualConnections = state.mutualConnections.filter(
        (fb) => fb.targetUserId !== action.payload.targetUserId
      );
      state.pendingFollowBacks = state.pendingFollowBacks.filter(
        (fb) => fb.targetUserId !== action.payload.targetUserId
      );
    },
  },
});

export const { setConnectionState, addConnection, removeConnection } = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
