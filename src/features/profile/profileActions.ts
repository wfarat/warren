import type { AppDispatch, RootState } from '@/store';
import { setError, setProfile, setProfileLoading, setSelectedUserId } from '@/features';
import { userRepo } from '@/api';

export const fetchProfile =
  (userId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { profile } = getState();
    if (profile.selectedUserId === userId) return;
    dispatch(setProfileLoading(true));

    try {
      const response = await userRepo.getUserProfile(userId);
      dispatch(setProfile(response));
    } catch (error) {
      dispatch(setError({ message: 'Failed to fetch profile', retryAction: 'PROFILE' }));
    } finally {
      dispatch(setSelectedUserId(userId));
      dispatch(setProfileLoading(false));
    }
  };
