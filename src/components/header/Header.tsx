import Logo from '@/assets/warren_logo.svg?react';
import Name from '@/assets/warren_name.svg?react';
import SearchIcon from '@/assets/icons/Search.svg?react';
import Close from '@/assets/icons/Close.svg?react';
import { Search } from './Search.tsx';
import { UserMenu } from '@/features/user/UserMenu.tsx';
import { useState } from 'react';

export function Header() {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <header className=" bg-bg-2 max-w-360 mx-auto flex-between p-3 fixed top-0 left-0 right-0 z-10 border-b border-x border-grey-2">
      {showSearch ? (
        <div className="flex-center gap-3 w-full">
          <Search className="w-full" />
          <Close className="w-6 h-6 fill-grey-1" onClick={() => setShowSearch(false)} />
        </div>
      ) : (
        <>
          <div className="ml-3 items-baseline gap-2 flex">
            <Logo />
            <Name className="sm:block hidden" />
          </div>
          <Search className="sm:block hidden" />
          <div className="flex-center gap-3">
            <SearchIcon
              className="sm:hidden block w-6 h-6"
              onClick={() => setShowSearch((prev) => !prev)}
            />
            <UserMenu />
          </div>
        </>
      )}
    </header>
  );
}
