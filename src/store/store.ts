import { configureStore } from '@reduxjs/toolkit';
import { notificationReducer } from '@/features/notification/notificationSlice';
import { userReducer } from '@/features/user/userSlice';
import { postReducer } from '@/features/post/postSlice.ts';
import { profileReducer } from '@/features/profile/profileSlice.ts';
import { connectionReducer } from '@/features';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    post: postReducer,
    profile: profileReducer,
    connections: connectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 🌟 Add the profile action type that is triggering the scan
        ignoredActions: [
          'post/appendFeedPage',
          'post/insertNewPost',
          'post/addComment',
          'post/setComments',
          'post/setProfilePosts',
          'post/setCurrentPost',
          'profile/setSelectedUserId', // Added this action block
        ],
        // 🌟 Add wildcards (**), telling Redux to skip validations on nested properties
        ignoredPaths: [
          'post.lastVisibleDoc',
          'post.timeline',
          'post.timeline.**',
          'post.comments',
          'post.comments.**',
          'post.profilePosts',
          'post.profilePosts.**',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
