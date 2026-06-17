import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMyGroupsAction, GroupCard, selectCurrentUserId, selectGroup } from '@/features';

export function MyGroups() {
  const dispatch = useAppDispatch();

  const currentUserId = useAppSelector(selectCurrentUserId);
  const { myGroups, isLoading } = useAppSelector(selectGroup);

  useEffect(() => {
    if (!currentUserId) return;
    dispatch(fetchMyGroupsAction());
  }, [currentUserId, dispatch]);

  if (isLoading && myGroups.length === 0) {
    return (
      <div className="w-full py-12 flex justify-center items-center text-grey-1 text-sm">
        Loading your communities...
      </div>
    );
  }

  if (myGroups.length === 0) {
    return (
      <div className="w-full py-16 border border-dashed border-grey-2/60 rounded-2xl flex flex-col items-center justify-center gap-2 text-center p-6">
        <h3 className="text-white font-medium text-base">No communities joined yet</h3>
        <p className="text-grey-1 text-xs max-w-sm">
          View the Discover Groups section to find new communities to join.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 p-8">
      <div className="flex flex-col gap-0.5">
        <h2>My Groups</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {myGroups.map((group) => (
          <GroupCard key={group.id} group={group} isJoined={true} />
        ))}
      </div>
    </div>
  );
}
