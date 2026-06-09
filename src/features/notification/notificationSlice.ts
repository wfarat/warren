import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export type NotificationData = {
  id: string;
  message: string;
  type: 'error' | 'success';
  retryAction?: string;
  payload?: Record<string, unknown>;
};

type NotificationState = {
  notifications: NotificationData[];
};

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setSuccess: (state, action: PayloadAction<string>) => {
      state.notifications.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now().toString(),
        message: action.payload,
        type: 'success',
      });
    },

    setError: (
      state,
      action: PayloadAction<{
        message: string;
        retryAction?: string;
        payload?: Record<string, unknown>;
      }>
    ) => {
      state.notifications.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now().toString(),
        message: action.payload.message,
        type: 'error',
        retryAction: action.payload.retryAction,
        payload: action.payload.payload,
      });
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setSuccess, setError, removeNotification, clearAllNotifications } =
  notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification.notifications;

export const notificationReducer = notificationSlice.reducer;
