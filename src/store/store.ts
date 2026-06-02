import { configureStore } from '@reduxjs/toolkit';
import { notificationReducer } from '@/features/notification/notificationSlice';
import { userReducer } from '@/features/user/userSlice';
import { postReducer } from '@/features/post/postSlice.ts';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
