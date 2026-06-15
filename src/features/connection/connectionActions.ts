import type { AppDispatch, RootState } from '@/store';
import { connectionRepo } from '@/api/connection/connection.repo.ts';
import {
  addConnection,
  removeConnection,
  setConnectionState,
  setError,
  setSuccess,
  updateFollowedByMe,
} from '@/features';
import type { UserListItem } from '@/types';

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
      dispatch(updateFollowedByMe(true));
      dispatch(setSuccess('User followed successfully!'));
    } catch (error) {
      dispatch(setError({ message: 'Failed to follow user' }));
      console.error('Failed to follow user:', error);
    }
  };

export const unfollowUser =
  (targetUserId: string, targetUserName: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    const currentUserId = user.currentUser?.id;
    const currentUserName = user.currentUser?.name;
    if (!currentUserId || !currentUserName) return;
    try {
      await connectionRepo.unfollowUser(
        currentUserId,
        currentUserName,
        targetUserId,
        targetUserName
      );
      dispatch(removeConnection({ targetUserId, targetUserName }));
      dispatch(updateFollowedByMe(false));
      dispatch(setSuccess('User unfollowed successfully!'));
    } catch (error) {
      dispatch(setError({ message: 'Failed to unfollow user' }));
      console.error('Failed to follow user:', error);
    }
  };

export const followUsers =
  (users: UserListItem[]) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    const currentUserId = user.currentUser?.id;
    const currentUserName = user.currentUser?.name;
    if (!currentUserId || !currentUserName) return;
    try {
      const promises = users.map(async (user) => {
        await connectionRepo.followUser(currentUserId, currentUserName, user.id, user.name);
        dispatch(addConnection({ targetUserId: user.id, targetUserName: user.name }));
      });
      await Promise.all(promises);
      dispatch(setSuccess('Users followed successfully!'));
    } catch (error) {
      dispatch(setError({ message: 'Failed to follow users' }));
      console.error('Failed to follow users:', error);
    }
  };
