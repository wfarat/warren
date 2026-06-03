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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'post/appendFeedPage',
          'post/insertNewPost',
          'post/addComment',
          'post/setComments',
        ],
        ignoredPaths: ['post.lastVisibleDoc', 'post.timeline', 'post.comments'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
