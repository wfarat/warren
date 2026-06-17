import { Button, RightBar } from '@/components';
import { createGroupAction, CreateGroupDialog, DiscoverGroups, MyGroups } from '@/features';
import { useState } from 'react';
import { useAppDispatch } from '@/store';
import type { CreateGroupData } from '@/types';

export default function Groups() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const handleCreateGroup = (groupData: CreateGroupData) => {
    dispatch(createGroupAction(groupData));
  };
  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full">
        <div className="flex-between border-b border-grey-2 p-8">
          <h1 className="text-primary">Groups</h1>
          <Button onClick={() => setDialogOpen(true)}>
            <strong className="text-2xl mr-2 leading-none">+</strong>Create Group
          </Button>
        </div>
        <MyGroups />
        <DiscoverGroups />
      </div>
      <RightBar withBorder className="bg-bg-2">
        das{' '}
      </RightBar>
      {dialogOpen && (
        <CreateGroupDialog onClose={() => setDialogOpen(false)} onSubmit={handleCreateGroup} />
      )}
    </div>
  );
}
