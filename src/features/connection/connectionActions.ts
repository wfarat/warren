import type { AppDispatch, RootState } from '@/store';
import { connectionRepo } from '@/api/connection/connection.repo.ts';
import { addConnection, setConnectionState, setError, setSuccess } from '@/features';

export const fetchConnections = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user } = getState();
  const currentUserId = user.currentUser?.id;
  if (!currentUserId) return;
  try {
    const connections = await connectionRepo.fetchUserConnections(currentUserId);
    dispatch(setConnectionState(connections));
  } catch (error) {
    dispatch(setError({ message: 'Failed to fetch connections', retryAction: 'CONNECTIONS' }));
  }
};

export const followUser =
  (targetUserId: string, targetUserName: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    const currentUserId = user.currentUser?.id;
    const currentUserName = user.currentUser?.name;
    if (!currentUserId || !currentUserName) return;
    try {
      await connectionRepo.followUser(currentUserId, currentUserName, targetUserId, targetUserName);
      dispatch(addConnection({ targetUserId, targetUserName }));
      dispatch(setSuccess('User followed successfully!'));
    } catch (error) {
      dispatch(setError({ message: 'Failed to follow user' }));
      console.error('Failed to follow user:', error);
    }
  };
