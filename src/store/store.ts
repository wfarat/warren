import { combineReducers, configureStore, type UnknownAction } from '@reduxjs/toolkit';
import { notificationReducer } from '@/features/notification/notificationSlice';
import { userReducer } from '@/features/user/userSlice';
import { postReducer } from '@/features/post/postSlice.ts';
import { profileReducer } from '@/features/profile/profileSlice.ts';
import { connectionReducer, messagesReducer } from '@/features';

const appReducer = combineReducers({
  notification: notificationReducer,
  user: userReducer,
  post: postReducer,
  profile: profileReducer,
  connection: connectionReducer,
  messages: messagesReducer,
});
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['post/appendFeedPage', 'post/insertNewPost'],
        ignoredPaths: ['post.lastVisibleDoc'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
