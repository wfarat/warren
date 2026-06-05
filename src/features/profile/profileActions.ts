import type { AppDispatch, RootState } from '@/store';
import {
  setError,
  setProfile,
  setProfileLoading,
  setSelectedUserId,
  updateProfileSuccess,
} from '@/features';
import { uploadImage, userRepo } from '@/api';
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

      dispatch(updateProfileSuccess(databasePayload));

      await userRepo.updateUserProfile(currentProfileId, databasePayload);

      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch(setError({ message: 'Failed to update profile' }));
    } finally {
      dispatch(setProfileLoading(false));
    }
  };
