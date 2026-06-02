import { useLocation } from './useLocation';
import { useLogin } from '@/features';
import { fetchTimelinePage } from '@/features/post/postActions.ts';

export function useRetryAction() {
  const { getLocation } = useLocation();
  const { login, logout } = useLogin();
  const actionMap: Record<string, (payload?: Record<string, unknown>) => void> = {
    LOGIN: () => login(),
    LOGOUT: () => logout(),
    LOCATION: () => getLocation(),
    TIMELINE: () => fetchTimelinePage(true),
  };

  return (action?: string) => {
    if (!action) {
      return;
    }
    return actionMap[action];
  };
}
