import { useAppSelector } from '@/store';
import { selectUser } from './userSelectors.ts';
import Bell from '@/assets/icons/Bell.svg?react';
import Arrow from '@/assets/icons/Arrow.svg?react';
import { Button } from '@/components';

type UserMenuProps = {
  handleClick: () => void;
};

export function UserMenu({ handleClick }: UserMenuProps) {
  const { isAuthenticated, given_name, photoUrl } = useAppSelector(selectUser);

  return (
    <div onClick={handleClick} className="cursor-pointer hidden sm:block">
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <div className="relative mr-2">
            <div className="w-2 h-2 absolute right-0 bg-danger-light rounded-full"></div>
            <Bell />
          </div>
          {photoUrl && (
            <img className="rounded-full w-10 h-10" src={photoUrl} alt="User profile picture" />
          )}
          <span className="text-grey-4 font-semibold">{given_name}</span>
          <Arrow />
        </div>
      ) : (
        <Button size="md">Log in</Button>
      )}
    </div>
  );
}
