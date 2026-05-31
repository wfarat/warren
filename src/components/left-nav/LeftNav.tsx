import { NavLink } from 'react-router';
import NewsIcon from '@/assets/icons/News.svg?react';
import People from '@/assets/icons/People.svg?react';
import Grid from '@/assets/icons/Grid.svg?react';
import Profile from '@/assets/icons/Profile.svg?react';
import './left_nav.css';

export function LeftNav() {
  return (
    <nav className="pt-6 flex-col flex gap-2 w-64 border-r border-grey-2">
      <NavLink to="/newsfeed" className="flex-start px-4 py-3 gap-2">
        <NewsIcon />
        Newsfeed
      </NavLink>
      <NavLink to="/friends" className="flex-start px-4 py-3 gap-2">
        <People />
        Friends
      </NavLink>
      <NavLink to="/groups" className="flex-start px-4 py-3 gap-2">
        <Grid />
        Groups
      </NavLink>
      <NavLink to="/profile" className="flex-start px-4 py-3 gap-2">
        <Profile />
        Profile
      </NavLink>
    </nav>
  );
}
