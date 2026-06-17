import type { AppDispatch, RootState } from '@/store';
import { groupsRepo, uploadImage } from '@/api';
import {
  appendJoinedGroup,
  removeDiscoverGroup,
  setDiscoverGroups,
  setError,
  setGroupsLoading,
  setMyGroups
} from '@/features';
import type { CreateGroupData } from '@/types';

/**
 * Fetch communities the logged-in user belongs to
 */
export const fetchMyGroupsAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    if (!user.currentUser?.id) return;
    dispatch(setGroupsLoading(true));
    try {
      const response = await groupsRepo.fetchMyGroups(user.currentUser.id);
      dispatch(setMyGroups(response));
    } catch (error) {
      dispatch(setError({ message: 'Failed to fetch your groups.' }));
      console.error('Failed to fetch my groups:', error);
    } finally {
      dispatch(setGroupsLoading(false));
    }
  };

/**
 * Fetch discoverable communities with an optional cache guard
 */
export const fetchDiscoverableGroupsAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { group, user } = getState();

    if ((group.discoverGroups.length > 0 && !group.tagFilter) || !user.currentUser?.id) return;

    dispatch(setGroupsLoading(true));
    try {
      const response = await groupsRepo.fetchDiscoverableGroups(
        user.currentUser.id,
        group.tagFilter
      );
      dispatch(setDiscoverGroups(response));
    } catch (error) {
      dispatch(setError({ message: 'Failed to fetch group discovery list.' }));
    } finally {
      dispatch(setGroupsLoading(false));
    }
  };

/**
 * 3. Create a group, handle asset changes, and execute success UI triggers
 */
export const createGroupAction =
  (values: CreateGroupData, onSuccess?: () => void) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    const currentUserId = user.currentUser?.id;
    if (!currentUserId) return;

    dispatch(setGroupsLoading(true));
    try {
      let bannerUrl = values.bannerUrl;
      let bannerPublicId = values.bannerPublicId;

      if (values.bannerFile) {
        bannerPublicId = await uploadImage(values.bannerFile);
      }

      await groupsRepo.createGroup(currentUserId, {
        name: values.name,
        description: values.description,
        tagsString: values.tags,
        bannerUrl,
        bannerPublicId,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch(setError({ message: 'Failed to create group.' }));
      console.error('Group creation failure:', error);
    } finally {
      dispatch(setGroupsLoading(false));
    }
  };

/**
 * Join a group and move it from discovery to membership state optimistically
 */
export const joinGroupAction =
  (groupId: string, onSuccess?: () => void) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState();
    const currentUserId = user.currentUser?.id;
    if (!currentUserId) return;

    dispatch(setGroupsLoading(true));
    try {
      await groupsRepo.joinGroup(groupId, currentUserId);

      const refreshedGroup = await groupsRepo.getGroup(groupId);

      if (refreshedGroup) {
        dispatch(removeDiscoverGroup(groupId));
        dispatch(appendJoinedGroup(refreshedGroup));
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch(setError({ message: 'Failed to join group.' }));
      console.error('Group join pipeline crash:', error);
    } finally {
      dispatch(setGroupsLoading(false));
    }
  };
