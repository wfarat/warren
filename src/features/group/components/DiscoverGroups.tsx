import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchDiscoverableGroupsAction,
  GroupCard,
  joinGroupAction,
  selectCurrentUserId,
  selectGroup,
  setGroupTagFilter,
  setSuccess,
} from '@/features';
import type { Group } from '@/types';

export function DiscoverGroups() {
  const dispatch = useAppDispatch();

  const currentUserId = useAppSelector(selectCurrentUserId);
  const { discoverGroups, tagFilter, isLoading } = useAppSelector(selectGroup);

  useEffect(() => {
    if (!currentUserId) return;
    dispatch(fetchDiscoverableGroupsAction());
  }, [currentUserId, tagFilter, dispatch]);

  const handleJoinGroup = (groupId: string) => {
    dispatch(
      joinGroupAction(groupId, () => {
        dispatch(setSuccess('Successfully joined a group'));
      })
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 p-8">
      <div className="flex flex-col gap-0.5">
        <h2>Discover Groups</h2>
        {tagFilter ? (
          <p className="text-grey-1 text-xs">
            Showing community results matching
            <span className="text-primary-light font-medium">#{tagFilter}</span>
          </p>
        ) : (
          <p className="text-grey-1 text-xs">Explore alternative communities</p>
        )}
      </div>

      {isLoading && discoverGroups.length === 0 ? (
        <div className="w-full py-12 flex justify-center items-center text-grey-1 text-sm">
          Searching for communities...
        </div>
      ) : discoverGroups.length === 0 ? (
        <div className="w-full py-16 border border-dashed border-grey-2/60 bg-bg-2 rounded-2xl flex flex-col items-center justify-center gap-2 text-center p-6">
          <h3 className="text-white font-medium text-base">
            {tagFilter ? 'No matching groups found' : 'You are all caught up!'}
          </h3>
          <p className="text-grey-1 text-xs max-w-sm">
            {tagFilter
              ? `We couldn't find any public communities cataloged under #${tagFilter}. Try searching alternative tags.`
              : "Wow! You've joined every single public community currently running on this hub."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {discoverGroups.map((group: Group) => (
            <GroupCard
              key={group.id}
              group={group}
              isJoined={false}
              onJoin={handleJoinGroup}
              onTagClick={(clickedTag) => {
                dispatch(setGroupTagFilter(clickedTag));
              }}
              orientation="vertical"
            />
          ))}
        </div>
      )}
    </div>
  );
}
