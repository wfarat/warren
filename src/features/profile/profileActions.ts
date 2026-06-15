import type { AppDispatch, RootState } from '@/store';
import {
  setError,
  setProfile,
  setProfileLoading,
  setSelectedUserId,
  setUserName,
  updateFollowedByMe,
  updateProfileSuccess,
} from '@/features';
import { connectionRepo, uploadImage, userRepo } from '@/api';
import type { Profile, UpdateProfileInput } from '@/types';

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
      console.error('Failed to fetch profile:', error);
    } finally {
      dispatch(setSelectedUserId(userId));
      dispatch(setProfileLoading(false));
    }
  };

/**
 * Thunk action to update a user's profile info and process background asset attachments
 */
export const updateProfileAction =
  (input: UpdateProfileInput, onSuccess?: () => void) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { profile: profileState } = getState();
    const currentProfileId = profileState.profile.id;
    if (!currentProfileId) return;

    try {
      dispatch(setProfileLoading(true));

      const databasePayload: Partial<Profile> = {
        name: input.name,
        location: input.location,
        bio: input.bio,
      };

      if (input.bannerFile) {
        const uploadedPublicId = await uploadImage(input.bannerFile);
        databasePayload.banner = {
          publicId: uploadedPublicId,
        };
      } else if (input.bannerUrl) {
        databasePayload.banner = {
          url: input.bannerUrl,
        };
      }
      dispatch(setUserName(input.name));
      dispatch(updateProfileSuccess(databasePayload));

      await userRepo.updateUserProfile(currentProfileId, databasePayload);

      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch(setError({ message: 'Failed to update profile' }));
    } finally {
      dispatch(setProfileLoading(false));
    }
  };

export const checkFollowStatus = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { profile, user } = getState();
  const currentProfileId = profile.profile.id;
  const currentUserId = user.currentUser?.id;
  if (!currentUserId || !currentProfileId) return;
  try {
    const isFollowing = await connectionRepo.isFollowing(currentUserId, currentProfileId);
    dispatch(updateFollowedByMe(isFollowing));
  } catch (error) {
    console.error('Failed to check follow status:', error);
  }
};
