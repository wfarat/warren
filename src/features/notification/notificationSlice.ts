import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NotificationState = {
  message: string;
  type?: 'error' | 'success';
  visible: boolean;
  retryAction?: string;
  payload?: Record<string, unknown>;
};

const initialState: NotificationState = {
  message: '',
  visible: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setSuccess: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.type = 'success';
      state.visible = true;
      state.retryAction = undefined;
    },
    setError: (
      state,
      action: PayloadAction<{
        message: string;
        retryAction?: string;
        payload?: Record<string, unknown>;
      }>
    ) => {
      state.message = action.payload.message;
      state.type = 'error';
      state.visible = true;
      state.retryAction = action.payload.retryAction;
      state.payload = action.payload.payload;
    },
    clearNotification: (state) => {
      state.message = '';
      state.type = undefined;
      state.visible = false;
      state.retryAction = undefined;
      state.payload = undefined;
    },
  },
});

export const { setSuccess, setError, clearNotification } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
