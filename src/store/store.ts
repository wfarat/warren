import { configureStore } from '@reduxjs/toolkit';
import { notificationReducer } from '@/features/notification/notificationSlice';
import { userReducer } from '@/features/user/userSlice';
import { postReducer } from '@/features/post/postSlice.ts';
import { profileReducer } from '@/features/profile/profileSlice.ts';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    post: postReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'post/appendFeedPage',
          'post/insertNewPost',
          'post/addComment',
          'post/setComments',
          'post/setProfilePosts',
          'post/setCurrentPost',
        ],
        ignoredPaths: ['post.lastVisibleDoc', 'post.timeline', 'post.comments, post.profilePosts'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
