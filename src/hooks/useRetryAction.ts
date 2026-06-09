import { useLocation } from './useLocation';
import { fetchProfilePosts, useLogin } from '@/features';
import { fetchTimelinePage } from '@/features/post/postActions.ts';
import { useComments } from '@/features/post/useComments.ts';
import { useAppDispatch } from '@/store';
import { fetchConnections } from '@/features/connection/connectionActions.ts';

export function useRetryAction() {
  const { getLocation } = useLocation();
  const { loginWithGoogle, logout } = useLogin();
  const { getComments, getReplies } = useComments();
  const dispatch = useAppDispatch();
  const actionMap: Record<string, (payload?: Record<string, unknown>) => void> = {
    LOGIN_GOOGLE: () => loginWithGoogle(),
    LOGOUT: () => logout(),
    LOCATION: () => getLocation(),
    TIMELINE: () => dispatch(fetchTimelinePage(true)),
    COMMENTS: () => getComments(),
    REPLIES: () => getReplies(),
    PROFILE_POSTS: () => dispatch(fetchProfilePosts()),
    CONNECTIONS: () => dispatch(fetchConnections()),
  };

  return (action?: string) => {
    if (!action) {
      return;
    }
    return actionMap[action];
  };
}
