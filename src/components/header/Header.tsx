import Logo from '@/assets/warren_logo.svg?react';
import Name from '@/assets/warren_name.svg?react';
import { Search } from './Search.tsx';
import { UserMenu } from '@/features/user/UserMenu.tsx';

export function Header() {
  return (
    <header className=" bg-bg-1 sm:flex-between p-3 fixed top-0 left-0 right-0 z-10">
      <div className="ml-3 items-baseline gap-2 flex">
        <Logo />
        <Name />
      </div>
      <Search />
      <UserMenu handleClick={() => console.log('clicked')} />
    </header>
  );
}
