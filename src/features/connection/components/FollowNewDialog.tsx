import { Button, Dialog, Search } from '@/components';
import { useState } from 'react';
import type { UserListItem } from '@/types';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import Close from '@/assets/icons/Close.svg?react';

type Props = {
  onClose: () => void;
  onSubmit: (users: UserListItem[]) => void;
};

export function FollowNewDialog({ onClose, onSubmit }: Props) {
  const [chosenUsers, setChosenUsers] = useState<UserListItem[]>([]);
  const handleUserDeselect = (user: UserListItem) => {
    setChosenUsers((prev) => prev.filter((u) => u.id !== user.id));
  };
  const handleUserSelect = (user: UserListItem) => {
    setChosenUsers((prev) => [...prev, user]);
  };
  const handleSubmit = () => {
    onSubmit(chosenUsers);
    onClose();
  };
  return (
    <Dialog
      submitButtonText="Follow"
      title="Follow people"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="flex-center w-full flex-col gap-2 mt-4 p-6">
        <Search onChoose={handleUserSelect} />
        {chosenUsers.map((user) => (
          <div
            key={user.id}
            className="bg-bg-1 border border-grey-2 p-2 rounded-lg flex-between w-100"
          >
            {user.name}
            <div className="flex gap-8">
              <AdvancedImage
                cldImg={cld
                  .image(`users/${user.id}/profile`)
                  .resize(fill().width(32).height(32))
                  .format('auto')}
                className="rounded-full"
              />
              <Button intent="danger" size="icon" onClick={() => handleUserDeselect(user)}>
                <Close className="fill-current w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
