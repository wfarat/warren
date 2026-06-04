import { useLocation } from './useLocation';
import { fetchProfilePosts, useLogin } from '@/features';
import { fetchTimelinePage } from '@/features/post/postActions.ts';
import { useComments } from '@/features/post/useComments.ts';

export function useRetryAction() {
  const { getLocation } = useLocation();
  const { login, logout } = useLogin();
  const { getComments, getReplies } = useComments();
  const actionMap: Record<string, (payload?: Record<string, unknown>) => void> = {
    LOGIN: () => login(),
    LOGOUT: () => logout(),
    LOCATION: () => getLocation(),
    TIMELINE: () => fetchTimelinePage(true),
    COMMENTS: () => getComments(),
    REPLIES: () => getReplies(),
    PROFILE: () => fetchProfilePosts(),
  };

  return (action?: string) => {
    if (!action) {
      return;
    }
    return actionMap[action];
  };
}
